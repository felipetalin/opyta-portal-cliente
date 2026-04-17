import { NextResponse } from "next/server";
import { getAuthCookieName } from "@/lib/auth";

const LEGACY_DEMO_EMAIL = process.env.AUTH_DEMO_EMAIL ?? "demo@opyta.com";
const AUTH_ALLOW_LEGACY_LOGIN_FALLBACK =
  (process.env.AUTH_ALLOW_LEGACY_LOGIN_FALLBACK ??
    (process.env.NODE_ENV === "production" ? "false" : "true")) === "true";

function isAuthorized(email: string, password: string): boolean {
  const configuredEmail = process.env.AUTH_LOGIN_EMAIL;
  const configuredPassword = process.env.AUTH_LOGIN_PASSWORD;

  // Prefer explicit credentials from environment when configured.
  if (configuredEmail && configuredPassword) {
    return email === configuredEmail.toLowerCase().trim() && password === configuredPassword;
  }

  if (!AUTH_ALLOW_LEGACY_LOGIN_FALLBACK) {
    return false;
  }

  // Temporary legacy fallback while production/local parity is being restored.
  return email === LEGACY_DEMO_EMAIL.toLowerCase().trim() && password.length > 0;
}

export async function POST(request: Request) {
  const payload = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  const email = payload?.email?.toLowerCase().trim() ?? "";
  const password = payload?.password ?? "";

  if (!email || !password || !isAuthorized(email, password)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getAuthCookieName(),
    value: email,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/"
  });

  return response;
}