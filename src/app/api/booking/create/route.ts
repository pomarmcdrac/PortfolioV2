import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { google } from "googleapis";

// Simple in-memory rate limiter to prevent spamming bookings
const bookingRateLimits = new Map<string, number>();
const BOOKING_COOLDOWN = 15 * 60 * 1000; // 15 minutes between bookings per user

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { error: "Token de autorización faltante" },
        { status: 401 }
      );
    }

    // Initialize Supabase admin/client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error("Supabase config is missing in server environment");
      return NextResponse.json(
        { error: "Error de configuración del servidor" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Verify token with Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Sesión inválida o expirada" },
        { status: 401 }
      );
    }

    // Verify email is confirmed
    if (!user.email_confirmed_at) {
      return NextResponse.json(
        { error: "Tu cuenta de Google no tiene un correo verificado" },
        { status: 403 }
      );
    }

    // Apply Rate Limiting
    const now = Date.now();
    const lastBookingTime = bookingRateLimits.get(user.id);
    if (lastBookingTime && now - lastBookingTime < BOOKING_COOLDOWN) {
      const minutesLeft = Math.ceil((BOOKING_COOLDOWN - (now - lastBookingTime)) / 60000);
      return NextResponse.json(
        { error: `Debes esperar ${minutesLeft} minutos antes de agendar otra cita.` },
        { status: 429 }
      );
    }

    // Parse body parameters
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      startTime,
      endTime,
      description,
      phone,
      topic,
    } = body;

    if (!firstName || !email || !startTime || !endTime) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios para agendar" },
        { status: 400 }
      );
    }

    // Initialize Google API Client with JWT
    const calendarId = process.env.GOOGLE_CALENDAR_ID || "primary";

    // Check if OAuth 2.0 credentials are available (Recommended for native Google Meet & inviting attendees)
    const oAuthClientId = process.env.GOOGLE_CLIENT_ID;
    const oAuthClientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const oAuthRefreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    let calendar;
    let hangoutLink = "";
    let useOAuth = false;

    if (oAuthClientId && oAuthClientSecret && oAuthRefreshToken) {
      useOAuth = true;
      const oauth2Client = new google.auth.OAuth2(oAuthClientId, oAuthClientSecret);
      oauth2Client.setCredentials({ refresh_token: oAuthRefreshToken });
      calendar = google.calendar({ version: "v3", auth: oauth2Client });
    } else {
      // Fallback to Service Account JWT Client
      const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
      const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;

      if (!serviceAccountEmail || !serviceAccountKey) {
        console.error("Google credentials missing in server environment");
        return NextResponse.json(
          { error: "Credenciales de Google Calendar no configuradas en el servidor" },
          { status: 500 }
        );
      }

      const formattedPrivateKey = serviceAccountKey.replace(/\\n/g, "\n");
      const jwtClient = new google.auth.JWT({
        email: serviceAccountEmail,
        key: formattedPrivateKey,
        scopes: ["https://www.googleapis.com/auth/calendar"],
      });
      await jwtClient.authorize();
      calendar = google.calendar({ version: "v3", auth: jwtClient });
    }

    if (useOAuth) {
      // Native Google Meet generation for OAuth 2.0 (running as real user)
      const event = {
        summary: `Cita: ${topic || "Consulta Técnica"} - ${firstName} ${lastName}`,
        description: `${description || ""}\n\nContacto:\nTeléfono: ${phone || "No provisto"}\nCorreo: ${email}`,
        start: {
          dateTime: startTime,
          timeZone: "America/Mexico_City",
        },
        end: {
          dateTime: endTime,
          timeZone: "America/Mexico_City",
        },
        attendees: [{ email: email }],
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            conferenceSolutionKey: {
              type: "hangoutsMeet",
            },
          },
        },
      };

      const googleResponse = await calendar.events.insert({
        calendarId: calendarId,
        requestBody: event,
        conferenceDataVersion: 1,
        sendUpdates: "all", // Send native invitation to the guest
      });

      hangoutLink = googleResponse.data.hangoutLink || "";
    } else {
      // Fallback for Service Account (using Jitsi / personal meeting link)
      const fallbackMeetingLink = process.env.PERSONAL_MEETING_LINK || 
        `https://meet.jit.si/mcdrac-booking-${Math.random().toString(36).substring(2, 9)}`;

      const event = {
        summary: `Cita: ${topic || "Consulta Técnica"} - ${firstName} ${lastName}`,
        description: `${description || ""}\n\nContacto:\nTeléfono: ${phone || "No provisto"}\nCorreo: ${email}\n\nEnlace de Reunión (Video): ${fallbackMeetingLink}`,
        start: {
          dateTime: startTime,
          timeZone: "America/Mexico_City",
        },
        end: {
          dateTime: endTime,
          timeZone: "America/Mexico_City",
        },
      };

      await calendar.events.insert({
        calendarId: calendarId,
        requestBody: event,
        sendUpdates: "none", // Skip Google's default email invitation to let Resend handle it
      });

      hangoutLink = fallbackMeetingLink;
    }

    // Proxy the reservation to the NestJS API
    const nestApiUrl = process.env.API_URL;
    if (!nestApiUrl) {
      console.error("API_URL is missing in environment variables");
      return NextResponse.json(
        { error: "Error de configuración del servidor de base de datos" },
        { status: 500 }
      );
    }

    const updatedDescription = `${description || ""}\n\nGoogle Meet: ${hangoutLink}`;

    const nestResponse = await fetch(`${nestApiUrl}/booking/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName,
        lastName,
        email,
        startTime,
        endTime,
        description: updatedDescription,
      }),
    });

    if (!nestResponse.ok) {
      const errorText = await nestResponse.text();
      console.error("NestJS API Error:", errorText);
      return NextResponse.json(
        { error: "Error al registrar la cita en la base de datos externa" },
        { status: 500 }
      );
    }

    const nestData = await nestResponse.json();

    // Register booking timestamp for rate limiting
    bookingRateLimits.set(user.id, now);

    return NextResponse.json({
      success: true,
      booking: nestData,
      meetLink: hangoutLink,
    });
  } catch (error: any) {
    console.error("Error in /api/booking/create:", error);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado al procesar la reserva: " + error.message },
      { status: 500 }
    );
  }
}
