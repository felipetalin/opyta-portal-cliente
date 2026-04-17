import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { listProjectsByIds } from "@/lib/data/projects";
import { getServerSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession();
  const projects = listProjectsByIds(session?.allowedProjectIds ?? []);

  const kpis = [
    { titulo: "Projetos ativos", valor: String(projects.filter((p) => p.status === "ativo").length) },
    { titulo: "Projetos autorizados", valor: String(projects.length) },
    {
      titulo: "Area total monitorada",
      valor: `${projects.reduce((sum, project) => sum + project.areaHa, 0)} ha`
    },
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
        <Link href="/projetos" className="panel-link">
          Abrir lista de projetos
        </Link>
      </section>
    </AppShell>
  );
}