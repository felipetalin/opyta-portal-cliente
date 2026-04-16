import { supabase } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";
import { createClient } from "@supabase/supabase-js";

function getClient(accessToken?: string) {
  if (!accessToken) {
    return supabase;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Client-Info": "opyta-portal/1.0"
      }
    }
  });
}

export async function getProjetosByIds(
  projectIds: number[],
  accessToken?: string
): Promise<Database["public"]["Tables"]["projetos"]["Row"][]> {
  if (!projectIds.length) return [];

  const client = getClient(accessToken);

  const { data, error } = await client
    .from("projetos")
    .select("*")
    .in("id_projeto", projectIds);

  if (error) {
    console.error("Erro ao buscar projetos:", error.message);
    return [];
  }

  return data || [];
}

export async function getProjetoById(
  projectId: number,
  accessToken?: string
): Promise<Database["public"]["Tables"]["projetos"]["Row"] | null> {
  const client = getClient(accessToken);

  const { data, error } = await client
    .from("projetos")
    .select("*")
    .eq("id_projeto", projectId)
    .single();

  if (error) {
    console.error(`Erro ao buscar projeto ${projectId}:`, error.message);
    return null;
  }

  return data || null;
}

export async function getPontosByProjetoId(
  projectId: number,
  accessToken?: string
): Promise<Database["public"]["Tables"]["pontos_coleta"]["Row"][]> {
  const client = getClient(accessToken);

  const { data, error } = await client
    .from("pontos_coleta")
    .select("*")
    .eq("id_projeto", projectId)
    .order("nome_ponto");

  if (error) {
    console.error(
      `Erro ao buscar pontos do projeto ${projectId}:`,
      error.message
    );
    return [];
  }

  return data || [];
}

export async function getGeoBiotaByProjetoId(
  projectId: number,
  accessToken?: string
): Promise<Database["public"]["Views"]["vw_geo_biota"]["Row"][]> {
  const client = getClient(accessToken);

  const { data, error } = await client
    .from("vw_geo_biota")
    .select("*")
    .eq("projeto", (await getProjetoById(projectId, accessToken))?.nome_projeto || "");      

  if (error) {
    console.error(
      `Erro ao buscar dados geo biota do projeto ${projectId}:`,
      error.message
    );
    return [];
  }

  return data || [];
}

export async function getGeoFisicoByProjetoId(
  projectId: number,
  accessToken?: string
): Promise<Database["public"]["Views"]["vw_geo_fisico"]["Row"][]> {
  const client = getClient(accessToken);

  const { data, error } = await client
    .from("vw_geo_fisico")
    .select("*")
    .eq("projeto", (await getProjetoById(projectId, accessToken))?.nome_projeto || "");      

  if (error) {
    console.error(
      `Erro ao buscar dados geo fisico do projeto ${projectId}:`,
      error.message
    );
    return [];
  }

  return data || [];
}


export type ProjetoWithCliente =
  Database["public"]["Tables"]["projetos"]["Row"] & {
    nome_empresa: string | null;
  };

export async function getProjetosWithCliente(
  projectIds: number[],
  accessToken?: string
): Promise<ProjetoWithCliente[]> {
  if (!projectIds.length) return [];

  const client = getClient(accessToken);

  const { data: projetosData, error: projError } = await client
    .from("projetos")
    .select("*")
    .in("id_projeto", projectIds);

  if (projError) {
    console.error("Erro ao buscar projetos:", projError.message);
    return [];
  }

  const projetos = (projetosData ?? []) as Database["public"]["Tables"]["projetos"]["Row"][];
  if (!projetos.length) return [];

  const clienteIds = [...new Set(projetos.map((p) => p.id_cliente))];

  const { data: clientesData, error: cliError } = await client
    .from("clientes")
    .select("id_cliente, nome_empresa")
    .in("id_cliente", clienteIds);

  if (cliError) {
    console.error("Erro ao buscar clientes:", cliError.message);
  }

  type ClienteRow = { id_cliente: number; nome_empresa: string };
  const clienteMap = new Map(
    ((clientesData ?? []) as ClienteRow[]).map((c) => [c.id_cliente, c.nome_empresa] as const)
  );

  return projetos.map((p) => ({
    ...p,
    nome_empresa: clienteMap.get(p.id_cliente) ?? null,
  }));
}
