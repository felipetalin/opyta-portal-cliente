import Link from "next/link";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { getServerSession } from "@/lib/auth";
import { getProjetosByIds } from "@/lib/queries";

export const dynamic = 'force-dynamic';

export default async function ProjetosPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login?next=/projetos");
  }

  const allowedProjectIds = (session?.allowedProjectIds ?? [])
    .map((id) => Number.parseInt(id, 10))
    .filter((id) => Number.isFinite(id));
  const projects = await getProjetosByIds(allowedProjectIds, session?.accessToken);

  return (
    <AppShell title="Projetos" subtitle="Visualizacao dos projetos autorizados para seu acesso.">
      <section className="projects-grid">
        {projects.map((project) => (
          <article key={project.id_projeto} className="panel">
            <h2>{project.nome_projeto}</h2>
            <span className="status-badge">Status: {project.status_projeto ?? "nao informado"}</span>
            <p>
              Projeto #{project.id_projeto} | Local: {project.local_projeto ?? "nao informado"}
            </p>
            <p>Inicio: {project.data_inicio ?? "nao informado"}</p>
            <Link href={`/projetos/${project.id_projeto}`}>Ver analise geoespacial</Link>
          </article>
        ))}
        {projects.length === 0 ? (
          <article className="panel">
            <h2>Nenhum projeto autorizado</h2>
            <p>Seu usuario ainda nao possui projetos liberados para visualizacao.</p>
          </article>
        ) : null}
      </section>
    </AppShell>
  );
}