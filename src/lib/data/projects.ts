import type { Project, ProjectKpi } from "@/lib/types";

const PROJECTS: Project[] = [
  {
    id: "p-1001",
    nome: "Fazenda Boa Vista",
    cliente: "Grupo Horizonte",
    status: "ativo",
    coordenadas: { lat: -19.9173, lng: -43.9345 },
    areaHa: 1245,
    ultimaAtualizacao: "2026-04-10"
  },
  {
    id: "p-1002",
    nome: "Area Norte",
    cliente: "Agro Serra",
    status: "pausado",
    coordenadas: { lat: -15.7942, lng: -47.8822 },
    areaHa: 860,
    ultimaAtualizacao: "2026-04-08"
  },
  {
    id: "p-1003",
    nome: "Corredor Leste",
    cliente: "BioCampo",
    status: "concluido",
    coordenadas: { lat: -22.9068, lng: -43.1729 },
    areaHa: 540,
    ultimaAtualizacao: "2026-03-27"
  }
];

export function listProjectsByIds(allowedIds: string[]): Project[] {
  return PROJECTS.filter((project) => allowedIds.includes(project.id));
}

export function getProjectById(projectId: string): Project | null {
  return PROJECTS.find((project) => project.id === projectId) ?? null;
}

export function getProjectKpis(projectId: string): ProjectKpi[] {
  const base = [
    { titulo: "Pontos monitorados", valor: "128", variacao: "+4,1%" },
    { titulo: "Campanhas validas", valor: "18", variacao: "+2" },
    { titulo: "Cobertura espacial", valor: "92%", variacao: "+1,3 p.p." },
    { titulo: "Ultimo processamento", valor: "2h atras" }
  ];

  if (projectId === "p-1002") {
    return [
      { titulo: "Pontos monitorados", valor: "74", variacao: "-1,2%" },
      { titulo: "Campanhas validas", valor: "9", variacao: "0" },
      { titulo: "Cobertura espacial", valor: "81%", variacao: "-0,6 p.p." },
      { titulo: "Ultimo processamento", valor: "1 dia" }
    ];
  }

  return base;
}