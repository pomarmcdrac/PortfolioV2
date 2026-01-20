import { NextResponse } from "next/server";

// Simple in-memory rate limiter for contact form
const contactRateLimits = new Map<
  string,
  { count: number; lastAttempt: number }
>();
const MAX_CONTACT_ATTEMPTS = 3; // Limit to 3 emails
const CONTACT_WINDOW = 60 * 60 * 1000; // per hour

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const apiUrl = process.env.API_URL;
  const searchParams = new URL(request.url).searchParams.toString();

  const response = await fetch(
    `${apiUrl}/${pathStr}${searchParams ? "?" + searchParams : ""}`,
    {
      headers: {
        Authorization: request.headers.get("Authorization") || "",
      },
    },
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const apiUrl = process.env.API_URL;

  // Rate Limiting for Contact Form
  if (pathStr === "contact" || pathStr === "mail/send") {
    const ip = request.headers.get("x-forwarded-for") || "local";
    const now = Date.now();
    const attempts = contactRateLimits.get(ip);

    if (attempts) {
      // Check if window has passed, reset if so
      if (now - attempts.lastAttempt > CONTACT_WINDOW) {
        contactRateLimits.set(ip, { count: 1, lastAttempt: now });
      } else if (attempts.count >= MAX_CONTACT_ATTEMPTS) {
        return NextResponse.json(
          {
            error:
              "Has excedido el límite de mensajes por hora. Inténtalo más tarde.",
          },
          { status: 429 },
        );
      } else {
        contactRateLimits.set(ip, {
          count: attempts.count + 1,
          lastAttempt: now,
        });
      }
    } else {
      contactRateLimits.set(ip, { count: 1, lastAttempt: now });
    }
  }

  const contentType = request.headers.get("content-type");
  let body;

  if (contentType?.includes("multipart/form-data")) {
    body = await request.formData();
  } else {
    body = JSON.stringify(await request.json());
  }

  const response = await fetch(`${apiUrl}/${pathStr}`, {
    method: "POST",
    headers: {
      Authorization: request.headers.get("Authorization") || "",
      ...(contentType?.includes("application/json")
        ? { "Content-Type": "application/json" }
        : {}),
    },
    body: body,
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join("/");
  const apiUrl = process.env.API_URL;

  const response = await fetch(`${apiUrl}/${pathStr}`, {
    method: "DELETE",
    headers: {
      Authorization: request.headers.get("Authorization") || "",
    },
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
