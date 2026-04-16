import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthCookieName } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.set({
    name: getAuthCookieName(),
    value: "",
    maxAge: 0,
    path: "/"
  });

  return response;
}