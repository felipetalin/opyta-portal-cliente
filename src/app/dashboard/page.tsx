import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { getServerSession } from "@/lib/auth";
import { getPontosByProjetoId, getProjetosByIds } from "@/lib/queries";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?next=/dashboard");
  }

  const allowedProjectIds = (session?.allowedProjectIds ?? [])
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => Number.isFinite(id));
  const projects = await getProjetosByIds(allowedProjectIds, session?.accessToken);
  const pontosCounts = await Promise.all(
    projects.map((project) => getPontosByProjetoId(project.id_projeto, session?.accessToken))
  );
  const totalPontos = pontosCounts.reduce(
    (sum, pontos) => sum + pontos.length,
    0
  );

  const kpis = [
    {
      titulo: "Projetos ativos",
      valor: String(
        projects.filter((project) => project.status_projeto === "ativo").length
      )
    },
    { titulo: "Projetos autorizados", valor: String(projects.length) },
    { titulo: "Pontos monitorados", valor: String(totalPontos) },
    { titulo: "Integridade dos dados", valor: "99,2%", variacao: "+0,4 p.p." }
  ];

  return (
    <AppShell title="Dashboard" subtitle="Resumo dos projetos liberados para seu usuario.">
      <section className="dashboard-grid">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.titulo} kpi={kpi} />
        ))}
      </section>

      <section className="panel" style={{ marginTop: "16px" }}>
        <h2>Atalhos</h2>
        <p>Explore detalhes por projeto e acompanhe os indicadores espaciais.</p>
        <Link href="/projetos">Abrir lista de projetos</Link>
      </section>
    </AppShell>
  );
}