import { NextResponse } from "next/server";

// Simple in-memory rate limiter (Warning: resets on redeploy/restart)
const loginAttempts = new Map<string, { count: number; lastAttempt: number }>();
const MAX_ATTEMPTS = 5;
const BAN_TIME = 15 * 60 * 1000; // 15 minutes

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "local";
  const now = Date.now();

  const attempts = loginAttempts.get(ip);

  // Check if IP is currently banned
  if (
    attempts &&
    attempts.count >= MAX_ATTEMPTS &&
    now - attempts.lastAttempt < BAN_TIME
  ) {
    const timeLeft = Math.ceil(
      (BAN_TIME - (now - attempts.lastAttempt)) / 1000 / 60,
    );
    return NextResponse.json(
      {
        error: `Demasiados intentos. Intenta de nuevo en ${timeLeft} minutos.`,
      },
      { status: 429 },
    );
  }

  try {
    const body = await request.json();
    const apiUrl = process.env.API_URL;

    const response = await fetch(`${apiUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      // Increment failed attempts
      const current = attempts || { count: 0, lastAttempt: 0 };
      loginAttempts.set(ip, { count: current.count + 1, lastAttempt: now });

      return NextResponse.json(data, { status: response.status });
    }

    // Success: Reset attempts
    loginAttempts.delete(ip);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Login Proxy Error:", error.message || error);
    return NextResponse.json(
      { error: "Error interno del proxy de autenticación" },
      { status: 500 },
    );
  }
}
