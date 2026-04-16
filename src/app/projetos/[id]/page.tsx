import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { MapPanelInteractive } from "@/components/map/map-panel-interactive";
import { KpiCard } from "@/components/ui/kpi-card";
import { getServerSession } from "@/lib/auth";
import {
  biotaIndicatorLabels,
  buildBiotaCampaignOptions,
  buildBiotaDataset,
  type BiotaIndicatorKey
} from "@/lib/geo-analytics";
import { getGeoBiotaByProjetoId, getProjetoById } from "@/lib/queries";
import type { ProjectKpi } from "@/lib/types";

export const dynamic = 'force-dynamic';

type ProjetoDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ campanha?: string; indicador?: string }>;
};

function formatDateBr(value: string | null): string {
  if (!value) return "n/d";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "n/d";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(date);
}

export default async function ProjetoDetailPage({
  params,
  searchParams
}: ProjetoDetailPageProps) {
  const { id } = await params;
  const { campanha, indicador } = await searchParams;
  const session = await getServerSession();
  if (!session) {
    redirect(`/login?next=/projetos/${id}`);
  }

  const projectId = parseInt(id, 10);
  const project = await getProjetoById(projectId, session?.accessToken);

  if (!project) {
    notFound();
  }

  const canAccess = session?.allowedProjectIds.includes(String(project.id_projeto)) ?? false;
  if (!canAccess) {
    notFound();
  }

  const biotaRows = await getGeoBiotaByProjetoId(projectId, session?.accessToken);
  const campaignOptions = buildBiotaCampaignOptions(biotaRows);
  const selectedCampaign = campanha && campanha !== "all" ? campanha : "all";
  const selectedIndicator = (
    indicador && indicador in biotaIndicatorLabels ? indicador : "riqueza"
  ) as BiotaIndicatorKey;

  const { mapPoints, summary } = buildBiotaDataset(biotaRows, selectedCampaign);

  const lastCollectionDate = biotaRows
    .filter((row) => selectedCampaign === "all" || (row.campanha ?? "Sem campanha") === selectedCampaign)
    .map((row) => row.data_hora_coleta)
    .filter((value): value is string => Boolean(value))
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0] ?? null;

  const kpis: ProjectKpi[] = [
    {
      titulo: "Riqueza media",
      valor: summary.riquezaMedia.toFixed(2)
    },
    {
      titulo: "Diversidade media",
      valor: summary.shannonMedio.toFixed(2)
    },
    {
      titulo: "Abundancia total",
      valor: summary.abundanciaTotal.toFixed(0)
    },
    {
      titulo: "Biomassa total",
      valor: summary.biomassaTotal.toFixed(2)
    },
    {
      titulo: "Pontos visiveis",
      valor: String(summary.pontos),
      variacao: `${mapPoints.length} geoespacializados`
    },
    {
      titulo: "Campanhas visiveis",
      valor: String(summary.campanhas),
      variacao: `${campaignOptions.length} no projeto`
    },
    {
      titulo: "Indicador do mapa",
      valor: biotaIndicatorLabels[selectedIndicator]
    },
    {
      titulo: "Ultima coleta",
      valor: formatDateBr(lastCollectionDate)
    }
  ];

  const campaignLabel =
    selectedCampaign === "all" ? "Todas as campanhas" : `Campanha ${selectedCampaign}`;

  return (
    <AppShell
      title={project.nome_projeto}
      subtitle={`${session?.email} | ${summary.pontos} pontos | ${campaignLabel}`}
    >
      <section className="panel campaign-filter-panel">
        <form method="get" className="campaign-filter-form">
          <label htmlFor="campanha">Filtro de campanha</label>
          <select id="campanha" name="campanha" defaultValue={selectedCampaign}>
            <option value="all">Todas as campanhas</option>
            {campaignOptions.map((campaignName) => (
              <option key={campaignName} value={campaignName}>
                {campaignName}
              </option>
            ))}
          </select>
          <label htmlFor="indicador">Indicador do mapa</label>
          <select id="indicador" name="indicador" defaultValue={selectedIndicator}>
            {Object.entries(biotaIndicatorLabels).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
          <button type="submit" className="link-button">
            Aplicar
          </button>
          {selectedCampaign !== "all" ? (
            <Link href={`/projetos/${project.id_projeto}?indicador=${selectedIndicator}`} className="filter-clear-link">
              Limpar filtro
            </Link>
          ) : null}
        </form>
      </section>

      <section className="project-detail-grid">
        <MapPanelInteractive
          title={`Mapa analitico - ${biotaIndicatorLabels[selectedIndicator]}`}
          indicatorKey={selectedIndicator}
          indicatorLabel={biotaIndicatorLabels[selectedIndicator]}
          pontos={mapPoints.map((point) => ({
            nome_ponto: point.ponto,
            latitude: point.latitude,
            longitude: point.longitude,
            campanha: point.campanha,
            campanhasAgregadas: point.campanhasAgregadas,
            riqueza: point.riqueza,
            shannon: point.shannon,
            abundanciaTotal: point.abundanciaTotal,
            biomassaTotal: point.biomassaTotal,
            grupoBiologico: point.grupoBiologico
          }))}
        />
        <div className="dashboard-grid">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.titulo} kpi={kpi} />
          ))}
        </div>
      </section>

      <section className="panel" style={{ marginTop: "16px" }}>
        <h2>Dados Geoespaciais</h2>
        <p>
          {summary.pontos} pontos analiticos geoespacializados para {campaignLabel.toLowerCase()}.
          O mapa usa a base biota consolidada do banco, com imagem satelite e representacao por {biotaIndicatorLabels[selectedIndicator].toLowerCase()}.
        </p>
      </section>
    </AppShell>
  );
}