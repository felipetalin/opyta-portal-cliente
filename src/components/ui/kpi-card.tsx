import type { ProjectKpi } from "@/lib/types";

type KpiCardProps = {
  kpi: ProjectKpi;
};

export function KpiCard({ kpi }: KpiCardProps) {
  return (
    <article className="kpi-card">
      <p className="kpi-title">{kpi.titulo}</p>
      <p className="kpi-value">{kpi.valor}</p>
      {kpi.variacao ? <p className="kpi-variation">{kpi.variacao}</p> : null}
    </article>
  );
}