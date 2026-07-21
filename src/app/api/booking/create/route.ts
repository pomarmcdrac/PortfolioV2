import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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

    // Proxy the reservation to the NestJS API
    const nestApiUrl = process.env.API_URL;
    if (!nestApiUrl) {
      console.error("API_URL is missing in environment variables");
      return NextResponse.json(
        { error: "Error de configuración del servidor de base de datos" },
        { status: 500 }
      );
    }

    // Bundle topic and phone into description so NestJS saves it and uses it for the Google Calendar description
    const finalDescription = `Tema: ${topic || "No provisto"}\nTeléfono: ${phone || "No provisto"}\n\nNotas:\n${description || ""}`;

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
        description: finalDescription,
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
    });
  } catch (error: any) {
    console.error("Error in /api/booking/create:", error);
    return NextResponse.json(
      { error: "Ocurrió un error inesperado al procesar la reserva: " + error.message },
      { status: 500 }
    );
  }
}
