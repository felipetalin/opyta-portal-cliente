import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { KpiCard } from "@/components/ui/kpi-card";
import { getServerSession } from "@/lib/auth";
import { getProjetosWithCliente } from "@/lib/queries";

function formatDateBr(value: string | null | undefined): string {
  if (!value) return "n/d";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "n/d";
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
}

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?next=/dashboard");
  }

  const allowedIds = (session?.allowedProjectIds ?? [])
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => Number.isFinite(id));

  const projects = await getProjetosWithCliente(allowedIds, session?.accessToken);
  const activeCount = projects.filter((p) =>
    (p.status_projeto ?? "").toLowerCase().includes("ativo")
  ).length;

  const kpis = [
    { titulo: "Projetos autorizados", valor: String(projects.length) },
    { titulo: "Projetos ativos", valor: String(activeCount) },
    { titulo: "Usuario autenticado", valor: session?.email ?? "n/d" },
  ];

  return (
    <AppShell title="Dashboard" subtitle="Resumo dos projetos liberados para seu usuario.">
      <section className="dashboard-grid">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.titulo} kpi={kpi} />
        ))}
      </section>

      <section style={{ marginTop: "24px" }}>
        <h2 style={{ marginBottom: "12px", fontSize: "1.1rem", fontWeight: 600 }}>
          Seus projetos
        </h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <article key={project.id_projeto} className="panel project-summary-card">
              <div className="project-card-header">
                <h3>{project.nome_projeto}</h3>
                {project.nome_empresa && (
                  <span className="project-client-badge">{project.nome_empresa}</span>
                )}
              </div>
              <div className="project-card-meta">
                <span className={`status-badge status-${(project.status_projeto ?? "nd").toLowerCase().replace(/\s/g, "-")}`}>
                  {project.status_projeto ?? "Status n/d"}
                </span>
                {project.local_projeto && (
                  <span className="project-meta-item">📍 {project.local_projeto}</span>
                )}
              </div>
              <div className="project-card-dates">
                <span>Início: {formatDateBr(project.data_inicio)}</span>
                <span>Fim previsto: {formatDateBr(project.data_fim_prevista)}</span>
              </div>
              <Link href={`/projetos/${project.id_projeto}`} className="panel-link">
                Ver análise geoespacial →
              </Link>
            </article>
          ))}
          {projects.length === 0 && (
            <article className="panel">
              <h3>Nenhum projeto vinculado</h3>
              <p>Seu usuario ainda nao possui projetos autorizados em <strong>usuario_projetos</strong>.</p>
            </article>
          )}
        </div>
      </section>
    </AppShell>
  );
}
