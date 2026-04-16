import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getServerSession } from "@/lib/auth";
import { getProjetosByIds } from "@/lib/queries";

export default async function ProjetosPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?next=/projetos");
  }

  const allowedIds = (session?.allowedProjectIds ?? [])
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => Number.isFinite(id));

  const projects = await getProjetosByIds(allowedIds, session?.accessToken);

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
          <article key={project.id_projeto} className="panel">
            <h2>{project.nome_projeto}</h2>
            <span className="status-badge">Status: {project.status_projeto ?? "n/d"}</span>
            <p>
              ID projeto: {project.id_projeto} | Cliente ID: {project.id_cliente}
            </p>
            <p>Local: {project.local_projeto ?? "n/d"}</p>
            <Link href={`/projetos/${project.id_projeto}`} className="panel-link">
              Ver analise geoespacial
            </Link>
          </article>
        ))}
      </section>
    </AppShell>
  );
}