import { NextResponse } from "next/server";
import { getAuthCookieName } from "@/lib/auth";

const ALLOWED_DEMO_EMAIL = "demo@opyta.com";
const AUTH_DEMO_ENABLED = (process.env.AUTH_DEMO_ENABLED ?? "true").toLowerCase() === "true";

export async function POST(request: Request) {
  if (!AUTH_DEMO_ENABLED) {
    return NextResponse.json({ error: "deprecated_endpoint" }, { status: 410 });
  }

  const payload = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = payload?.email?.toLowerCase().trim();

  if (email !== ALLOWED_DEMO_EMAIL) {
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