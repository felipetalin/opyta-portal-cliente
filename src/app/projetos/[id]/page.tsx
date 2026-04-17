import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { MapPanel } from "@/components/map/map-panel";
import { KpiCard } from "@/components/ui/kpi-card";
import { getServerSession } from "@/lib/auth";
import { getProjectById, getProjectKpis } from "@/lib/data/projects";

type ProjetoDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjetoDetailPage({ params }: ProjetoDetailPageProps) {
  const { id } = await params;
  const session = await getServerSession();
  const project = getProjectById(id);

  if (!project) {
    notFound();
  }

  const canAccess = session?.allowedProjectIds.includes(project.id) ?? false;
  if (!canAccess) {
    notFound();
  }

  const kpis = getProjectKpis(project.id);

  return (
    <AppShell
      title={project.nome}
      subtitle={`${project.cliente} | ${project.areaHa} ha | Atualizado em ${project.ultimaAtualizacao}`}
    >
      <section className="project-detail-grid">
        <MapPanel title="Mapa analitico central" lat={project.coordenadas.lat} lng={project.coordenadas.lng} />
        <div className="dashboard-grid">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.titulo} kpi={kpi} />
          ))}
        </div>
      </section>

      <section className="panel" style={{ marginTop: "16px" }}>
        <h2>Insights</h2>
        <p>
          O mapa permanece como elemento principal para leitura espacial dos dados. Esta V1 limita-se a
          visualizacao, sem qualquer operacao de escrita.
        </p>
      </section>
    </AppShell>
  );
}