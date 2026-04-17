import { cookies } from "next/headers";
import type { UserSession } from "@/lib/types";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "opyta_portal_session";

const DEMO_SESSIONS: Record<string, UserSession> = {
  "demo@opyta.com": {
    userId: "u-demo-1",
    email: "demo@opyta.com",
    allowedProjectIds: ["p-1001", "p-1003"]
  }
};

export async function getServerSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const sessionValue = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!sessionValue) {
    return null;
  }

  return DEMO_SESSIONS[sessionValue] ?? null;
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE_NAME;
}