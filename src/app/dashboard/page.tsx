import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { getServerSession } from "@/lib/auth";
import { getProjetosByIds } from "@/lib/queries";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?next=/dashboard");
  }

  const allowedIds = (session?.allowedProjectIds ?? [])
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => Number.isFinite(id));

  const projects = await getProjetosByIds(allowedIds, session?.accessToken);
  const activeCount = projects.filter((p) =>
    (p.status_projeto ?? "").toLowerCase().includes("ativo")
  ).length;
  const statusFilledCount = projects.filter((p) => Boolean(p.status_projeto)).length;

  const kpis = [
    { titulo: "Projetos ativos", valor: String(activeCount) },
    { titulo: "Projetos autorizados", valor: String(projects.length) },
    {
      titulo: "Com status informado",
      valor: String(statusFilledCount)
    },
    {
      titulo: "Usuario autenticado",
      valor: session?.email ?? "n/d"
    }
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
        <p>Explore os projetos liberados para seu usuario e acompanhe os indicadores espaciais.</p>
        <Link href="/projetos" className="panel-link">
          Abrir lista de projetos
        </Link>
      </section>
    </AppShell>
  );
}