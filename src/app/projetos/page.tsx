import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { listProjectsByIds } from "@/lib/data/projects";
import { getServerSession } from "@/lib/auth";

export default async function ProjetosPage() {
  const session = await getServerSession();
  const projects = listProjectsByIds(session?.allowedProjectIds ?? []);

  return (
    <AppShell title="Projetos" subtitle="Visualizacao dos projetos autorizados para seu acesso.">
      <section className="projects-grid">
        {projects.map((project) => (
          <article key={project.id} className="panel">
            <h2>{project.nome}</h2>
            <span className="status-badge">Status: {project.status}</span>
            <p>
              Cliente: {project.cliente} | Area: {project.areaHa} ha
            </p>
            <p>Ultima atualizacao: {project.ultimaAtualizacao}</p>
            <Link href={`/projetos/${project.id}`} className="panel-link">
              Ver analise geoespacial
            </Link>
          </article>
        ))}
      </section>
    </AppShell>
  );
}