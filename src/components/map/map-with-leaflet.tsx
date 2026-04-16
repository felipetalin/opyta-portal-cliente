"use client";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Tooltip,
  useMap
} from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";

// Fix Leaflet default icon issue with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png"
});

type Ponto = {
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
};

type MapWithLeafletProps = {
  title: string;
  indicatorLabel?: string;
  indicatorKey?: "riqueza" | "shannon" | "abundanciaTotal" | "biomassaTotal";
  pontos: Ponto[];
};

function FitBounds({ pontos }: { pontos: Ponto[] }) {
  const map = useMap();

  useEffect(() => {
    if (pontos.length === 0) return;

    const bounds = L.latLngBounds(
      pontos
        .filter((p) => p.latitude !== null && p.longitude !== null)
        .map((p) => L.latLng(p.latitude!, p.longitude!))
    );

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [pontos, map]);

  return null;
}

function RefreshMapSize() {
  const map = useMap();

  useEffect(() => {
    const refresh = () => map.invalidateSize();

    refresh();
    const timeoutIds = [
      window.setTimeout(refresh, 120),
      window.setTimeout(refresh, 400),
      window.setTimeout(refresh, 900)
    ];
    window.addEventListener("resize", refresh);

    return () => {
      timeoutIds.forEach((id) => window.clearTimeout(id));
      window.removeEventListener("resize", refresh);
    };
  }, [map]);

  return null;
}

export default function MapWithLeaflet({
  title,
  indicatorLabel,
  indicatorKey = "riqueza",
  pontos
}: MapWithLeafletProps) {
  const safeNumeric = (value: unknown) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const formatDate = (value?: string) => {
    if (!value) return "n/d";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "n/d";

    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    }).format(date);
  };

  const indicatorValues = pontos.map((ponto) => safeNumeric(ponto[indicatorKey]));
  const minValue = indicatorValues.length ? Math.min(...indicatorValues) : 0;
  const maxValue = indicatorValues.length ? Math.max(...indicatorValues) : 0;

  const getRadius = (value: number) => {
    if (maxValue <= minValue) return 8;
    return 6 + 16 * ((value - minValue) / (maxValue - minValue));
  };

  const getColor = (value: number) => {
    if (maxValue <= minValue) return "#facc15";

    const ratio = (value - minValue) / (maxValue - minValue);
    if (ratio < 0.25) return "#dcfce7";
    if (ratio < 0.5) return "#facc15";
    if (ratio < 0.75) return "#f97316";
    return "#dc2626";
  };

  // Centro padrao no Brasil
  const defaultCenter = [-14.2350, -51.9253] as [number, number];
  const initialCenter =
    pontos.length > 0 && pontos[0].latitude !== null && pontos[0].longitude !== null
      ? ([pontos[0].latitude, pontos[0].longitude] as [number, number])
      : defaultCenter;
  const initialZoom = pontos.length > 0 ? 7 : 4;

  return (
    <MapContainer
      key={`${title}-${indicatorKey}-${pontos.length}`}
      center={initialCenter}
      zoom={initialZoom}
      style={{ height: "100%", width: "100%" }}
      className="map-container"
    >
      <RefreshMapSize />
      <TileLayer
        attribution='Tiles &copy; Esri'
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      />

      {pontos.length > 0 && <FitBounds pontos={pontos} />}

      {pontos.map((ponto) => {
        if (ponto.latitude === null || ponto.longitude === null) return null;

        const pointLabel = ponto.nome_ponto || (ponto as { ponto?: string }).ponto || "Ponto de Coleta";
        const indicatorValue = safeNumeric(ponto[indicatorKey]);
        const color = getColor(indicatorValue);
        const radius = getRadius(indicatorValue);

        return (
          <CircleMarker
            key={ponto.id_ponto_coleta || `${pointLabel}-${ponto.latitude}-${ponto.longitude}`}
            center={[ponto.latitude, ponto.longitude]}
            radius={radius}
            pathOptions={{
              color: "#ffffff",
              fillColor: color,
              fillOpacity: 0.82,
              weight: 2,
              opacity: 1
            }}
          >
            <Tooltip direction="top" offset={[0, -4]} opacity={0.95}>
              <div className="popup-content">
                <strong>{pointLabel}</strong>
                <p>
                  {indicatorLabel || indicatorKey}: {indicatorValue.toFixed(2)}
                </p>
              </div>
            </Tooltip>
            <Popup>
              <div className="popup-content">
                <strong>{pointLabel}</strong>
                <ul className="popup-indicators">
                  <li>
                    <span>Campanha</span>
                    <b>{ponto.campanha || ponto.id_campanha || "n/d"}</b>
                  </li>
                  <li>
                    <span>{indicatorLabel || indicatorKey}</span>
                    <b>{indicatorValue.toFixed(2)}</b>
                  </li>
                  <li>
                    <span>Riqueza</span>
                    <b>{Number(ponto.riqueza ?? 0).toFixed(2)}</b>
                  </li>
                  <li>
                    <span>Diversidade</span>
                    <b>{Number(ponto.shannon ?? 0).toFixed(2)}</b>
                  </li>
                  <li>
                    <span>Abundancia</span>
                    <b>{Number(ponto.abundanciaTotal ?? 0).toFixed(0)}</b>
                  </li>
                  <li>
                    <span>Biomassa</span>
                    <b>{Number(ponto.biomassaTotal ?? 0).toFixed(2)}</b>
                  </li>
                </ul>
                <p>
                  Lat: {ponto.latitude.toFixed(4)}
                  <br />
                  Lng: {ponto.longitude.toFixed(4)}
                </p>
                {ponto.campanhasAgregadas && ponto.campanhasAgregadas > 1 ? (
                  <p>
                    Campanhas agregadas: {ponto.campanhasAgregadas}
                  </p>
                ) : null}
                {ponto.grupoBiologico ? <p>Grupo biologico: {ponto.grupoBiologico}</p> : null}
                {ponto.data_hora_coleta ? <p>Data: {formatDate(ponto.data_hora_coleta)}</p> : null}
              </div>
            </Popup>
          </CircleMarker>
        );
      })}

      <div className="map-legend">
        <strong>{indicatorLabel || indicatorKey}</strong>
        <span>Min {minValue.toFixed(2)}</span>
        <div className="map-legend-scale" />
        <span>Max {maxValue.toFixed(2)}</span>
      </div>
    </MapContainer>
  );
}
