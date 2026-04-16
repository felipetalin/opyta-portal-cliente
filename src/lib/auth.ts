import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import type { UserSession } from "@/lib/types";

const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME ?? "opyta_portal_session";
const AUTH_REFRESH_COOKIE = "opyta_portal_refresh";

export async function getServerSession(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error || !data.user) {
      return null;
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    const userScopedClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Client-Info": "opyta-portal/1.0"
        }
      }
    });

    const { data: userProjects, error: projectsError } = await userScopedClient
      .from("usuario_projetos")
      .select("id_projeto")
      .eq("id_usuario", data.user.id) as { data: Array<{ id_projeto: number }> | null; error: any };

    if (projectsError) {
      console.error("Erro ao buscar projetos do usuario:", projectsError);
      return null;
    }

    return {
      userId: data.user.id,
      email: data.user.email || "",
      accessToken,
      allowedProjectIds: (userProjects || []).map((p) => String(p.id_projeto))
    };
  } catch (err) {
    console.error("Erro na sessao:", err);
    return null;
  }
}

export function getAuthCookieName(): string {
  return AUTH_COOKIE_NAME;
}

export function getAuthRefreshCookie(): string {
  return AUTH_REFRESH_COOKIE;
}