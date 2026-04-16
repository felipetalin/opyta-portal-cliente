export type UserSession = {
  userId: string;
  email: string;
  accessToken: string;
  allowedProjectIds: string[]; // IDs numericos como strings para compatibilidade
};

export type Project = {
  id: string;
  nome: string;
  cliente: string;
  status: "ativo" | "pausado" | "concluido";
  coordenadas: {
    lat: number;
    lng: number;
  };
  areaHa: number;
  ultimaAtualizacao: string;
};

export type ProjectKpi = {
  titulo: string;
  valor: string;
  variacao?: string;
};