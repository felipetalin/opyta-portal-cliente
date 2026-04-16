import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getServerSession } from "@/lib/auth";
import { getProjetosWithCliente } from "@/lib/queries";

export default async function ProjetosPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?next=/projetos");
  }

  const allowedIds = (session?.allowedProjectIds ?? [])
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => Number.isFinite(id));

  const projects = await getProjetosWithCliente(allowedIds, session?.accessToken);

  return (
    <AppShell title="Projetos" subtitle="Visualizacao dos projetos autorizados para seu acesso.">
      <section className="projects-grid">
        {projects.length === 0 ? (
          <article className="panel">
            <h2>Nenhum projeto liberado</h2>
            <p>
              Seu usuario autenticou com sucesso, mas ainda nao possui projetos vinculados em
              <strong> usuario_projetos</strong>.
            </p>
          </article>
        ) : null}
        {projects.map((project) => (
          <article key={project.id_projeto} className="panel project-summary-card">
            <div className="project-card-header">
              <h2>{project.nome_projeto}</h2>
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
            <Link href={`/projetos/${project.id_projeto}`} className="panel-link">
              Ver análise geoespacial →
            </Link>
          </article>
        ))}
      </section>
    </AppShell>
  );
}
