import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthCookieName } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const payload = (await request.json().catch(() => null)) as
    | { email?: string; password?: string }
    | null;

  const email = payload?.email?.toLowerCase().trim();
  const password = payload?.password;

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email e senha sao obrigatorios" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.session) {
    return NextResponse.json(
      { error: "Credenciais invalidas" },
      { status: 401 }
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: getAuthCookieName(),
    value: data.session.access_token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/"
  });

  return response;
}
