"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

// Lazy load Leaflet para evitar erros SSR
const MapWithLeaflet = dynamic(() => import("./map-with-leaflet"), {
  loading: () => <div className="map-loading">Carregando mapa...</div>,
  ssr: false
});

type MapPanelInteractiveProps = {
  title: string;
  indicatorLabel?: string;
  indicatorKey?: "riqueza" | "shannon" | "abundanciaTotal" | "biomassaTotal";
  pontos: Array<{
    id_ponto_coleta?: number;
    latitude: number | null;
    longitude: number | null;
    nome_ponto?: string | null;
    id_campanha?: number | null;
    data_hora_coleta?: string;
    tipo_coleta?: string | null;
    municipio?: string | null;
    bacia_hidrografica?: string | null;
    curso_d_agua?: string | null;
    campanha?: string;
    campanhasAgregadas?: number;
    riqueza?: number;
    shannon?: number;
    abundanciaTotal?: number;
    biomassaTotal?: number;
    grupoBiologico?: string;
  }>;
};

export function MapPanelInteractive({
  title,
  indicatorLabel,
  indicatorKey,
  pontos
}: MapPanelInteractiveProps) {
  if (!pontos || pontos.length === 0) {
    return (
      <section className="map-panel" aria-label={title}>
        <div className="map-empty">Nenhum ponto de coleta disponivel</div>
      </section>
    );
  }

  return (
    <section className="map-panel" aria-label={title}>
      <Suspense fallback={<div className="map-loading">Carregando mapa...</div>}>
        <MapWithLeaflet
          title={title}
          indicatorLabel={indicatorLabel}
          indicatorKey={indicatorKey}
          pontos={pontos.filter((p) => p.latitude !== null && p.longitude !== null)}
        />
      </Suspense>
    </section>
  );
}
