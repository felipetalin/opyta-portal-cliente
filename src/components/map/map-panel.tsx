type MapPanelProps = {
  title: string;
  lat: number;
  lng: number;
};

export function MapPanel({ title, lat, lng }: MapPanelProps) {
  return (
    <section className="map-panel" aria-label={title}>
      <div className="map-grid" />
      <div className="map-pin" />
      <div className="map-label">
        <strong>{title}</strong>
        <span>
          Lat {lat.toFixed(4)} | Lng {lng.toFixed(4)}
        </span>
      </div>
    </section>
  );
}