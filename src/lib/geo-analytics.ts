import type { Database } from "@/lib/database.types";

type GeoBiotaRow = Database["public"]["Views"]["vw_geo_biota"]["Row"];

export type BiotaIndicatorKey =
  | "riqueza"
  | "shannon"
  | "abundanciaTotal"
  | "biomassaTotal";

export type BiotaMapPoint = {
  ponto: string;
  latitude: number;
  longitude: number;
  campanha: string;
  campanhasAgregadas: number;
  riqueza: number;
  shannon: number;
  abundanciaTotal: number;
  biomassaTotal: number;
  grupoBiologico: string;
};

export type BiotaSummary = {
  pontos: number;
  campanhas: number;
  riquezaMedia: number;
  shannonMedio: number;
  abundanciaTotal: number;
  biomassaTotal: number;
};

function safeNumber(value: number | string | null | undefined): number {
  const numeric = Number(value ?? 0);
  return Number.isFinite(numeric) ? numeric : 0;
}

function shannonFromRows(rows: GeoBiotaRow[]): number {
  const byTaxon = new Map<string, number>();

  for (const row of rows) {
    const taxon = (row.nome_cientifico ?? "sem_taxon").trim();
    const contagem = safeNumber(row.contagem);
    byTaxon.set(taxon, (byTaxon.get(taxon) ?? 0) + (contagem > 0 ? contagem : 1));
  }

  const total = Array.from(byTaxon.values()).reduce((sum, value) => sum + value, 0);
  if (total <= 0) return 0;

  let shannon = 0;
  for (const value of byTaxon.values()) {
    const proportion = value / total;
    if (proportion > 0) {
      shannon -= proportion * Math.log(proportion);
    }
  }

  return shannon;
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function buildPointMetrics(rows: GeoBiotaRow[]): BiotaMapPoint[] {
  const grouped = new Map<string, GeoBiotaRow[]>();

  for (const row of rows) {
    const latitude = row.latitude;
    const longitude = row.longitude;
    const ponto = row.ponto ?? "Ponto sem nome";
    const campanha = row.campanha ?? "Sem campanha";

    if (latitude === null || longitude === null) continue;

    const key = [campanha, ponto, latitude, longitude].join("|");
    const current = grouped.get(key) ?? [];
    current.push(row);
    grouped.set(key, current);
  }

  const metrics: BiotaMapPoint[] = [];

  for (const rowsByPoint of grouped.values()) {
    const first = rowsByPoint[0];
    metrics.push({
      ponto: first.ponto ?? "Ponto sem nome",
      latitude: first.latitude ?? 0,
      longitude: first.longitude ?? 0,
      campanha: first.campanha ?? "Sem campanha",
      campanhasAgregadas: 1,
      riqueza: new Set(rowsByPoint.map((row) => row.nome_cientifico ?? "")).size,
      shannon: shannonFromRows(rowsByPoint),
      abundanciaTotal: rowsByPoint.reduce((sum, row) => sum + safeNumber(row.contagem), 0),
      biomassaTotal: rowsByPoint.reduce((sum, row) => sum + safeNumber(row.biomassa), 0),
      grupoBiologico: Array.from(
        new Set(rowsByPoint.map((row) => row.grupo_biologico ?? "").filter(Boolean))
      ).join(", ")
    });
  }

  return metrics;
}

export function buildBiotaCampaignOptions(rows: GeoBiotaRow[]): string[] {
  return Array.from(new Set(rows.map((row) => row.campanha ?? "Sem campanha"))).sort((left, right) =>
    left.localeCompare(right, "pt-BR", { numeric: true, sensitivity: "base" })
  );
}

export function buildBiotaDataset(
  rows: GeoBiotaRow[],
  selectedCampaign: string
): { mapPoints: BiotaMapPoint[]; summary: BiotaSummary } {
  const filteredRows =
    selectedCampaign === "all"
      ? rows
      : rows.filter((row) => (row.campanha ?? "Sem campanha") === selectedCampaign);

  const campaignLevelMetrics = buildPointMetrics(filteredRows);

  let mapPoints: BiotaMapPoint[];
  if (selectedCampaign === "all") {
    const groupedByPoint = new Map<string, BiotaMapPoint[]>();

    for (const metric of campaignLevelMetrics) {
      const key = [metric.ponto, metric.latitude, metric.longitude].join("|");
      const current = groupedByPoint.get(key) ?? [];
      current.push(metric);
      groupedByPoint.set(key, current);
    }

    mapPoints = Array.from(groupedByPoint.values()).map((metricsByPoint) => ({
      ponto: metricsByPoint[0].ponto,
      latitude: metricsByPoint[0].latitude,
      longitude: metricsByPoint[0].longitude,
      campanha: `Media de ${metricsByPoint.length} campanha(s)`,
      campanhasAgregadas: metricsByPoint.length,
      riqueza: mean(metricsByPoint.map((item) => item.riqueza)),
      shannon: mean(metricsByPoint.map((item) => item.shannon)),
      abundanciaTotal: mean(metricsByPoint.map((item) => item.abundanciaTotal)),
      biomassaTotal: mean(metricsByPoint.map((item) => item.biomassaTotal)),
      grupoBiologico: Array.from(
        new Set(metricsByPoint.map((item) => item.grupoBiologico).filter(Boolean))
      ).join(", ")
    }));
  } else {
    mapPoints = campaignLevelMetrics;
  }

  const summary: BiotaSummary = {
    pontos: new Set(filteredRows.map((row) => row.ponto ?? "")).size,
    campanhas: new Set(filteredRows.map((row) => row.campanha ?? "")).size,
    riquezaMedia: mean(campaignLevelMetrics.map((item) => item.riqueza)),
    shannonMedio: mean(campaignLevelMetrics.map((item) => item.shannon)),
    abundanciaTotal: campaignLevelMetrics.reduce((sum, item) => sum + item.abundanciaTotal, 0),
    biomassaTotal: campaignLevelMetrics.reduce((sum, item) => sum + item.biomassaTotal, 0)
  };

  return {
    mapPoints,
    summary
  };
}

export const biotaIndicatorLabels: Record<BiotaIndicatorKey, string> = {
  riqueza: "Riqueza",
  shannon: "Diversidade",
  abundanciaTotal: "Abundancia",
  biomassaTotal: "Biomassa"
};