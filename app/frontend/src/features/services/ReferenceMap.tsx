import { useState, type PointerEvent } from 'react';
import { initialMapCenter, type MapPoint } from './referencePoints';

const TILE_SIZE = 256;
const MIN_ZOOM = 11;
const MAX_ZOOM = 18;

function project(latitude: number, longitude: number, zoom: number) {
  const scale = TILE_SIZE * 2 ** zoom;
  const sin = Math.sin((latitude * Math.PI) / 180);
  return {
    x: ((longitude + 180) / 360) * scale,
    y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
}

export function tileUrl(zoom: number, x: number, y: number) {
  const count = 2 ** zoom;
  const wrappedX = ((x % count) + count) % count;
  if (y < 0 || y >= count) return '';
  return `https://tile.openstreetmap.org/${zoom}/${wrappedX}/${y}.png`;
}

type ReferenceMapProps = {
  points: MapPoint[];
  selected: MapPoint | null;
  onSelect: (point: MapPoint) => void;
};

export function ReferenceMap({ points, selected, onSelect }: ReferenceMapProps) {
  const [center, setCenter] = useState(initialMapCenter);
  const [zoom, setZoom] = useState(14);
  const [tileFailed, setTileFailed] = useState(false);
  const [drag, setDrag] = useState<{ pointerId: number; x: number; y: number; origin: ReturnType<typeof project> } | null>(null);
  const centerPixel = project(center.latitude, center.longitude, zoom);
  const centerTileX = Math.floor(centerPixel.x / TILE_SIZE);
  const centerTileY = Math.floor(centerPixel.y / TILE_SIZE);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDrag({ pointerId: event.pointerId, x: event.clientX, y: event.clientY, origin: centerPixel });
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const scale = TILE_SIZE * 2 ** zoom;
    const x = drag.origin.x - (event.clientX - drag.x);
    const y = drag.origin.y - (event.clientY - drag.y);
    const longitude = (x / scale) * 360 - 180;
    const n = Math.PI - (2 * Math.PI * y) / scale;
    setCenter({ longitude, latitude: (180 / Math.PI) * Math.atan(Math.sinh(n)) });
  }

  function handleSelectPoint(point: MapPoint) {
    onSelect(point);
    setCenter({ latitude: point.latitude, longitude: point.longitude });
  }

  return (
    <section className="reference-map-panel" aria-label="Mapa comunitario de Manizales">
      <div className="reference-map-heading">
        <h2>Manizales · comunidades conectadas</h2>
        <div className="map-zoom-controls" aria-label="Controles de zoom">
          <button type="button" aria-label="Acercar mapa" onClick={() => setZoom((value) => Math.min(MAX_ZOOM, value + 1))}>+</button>
          <button type="button" aria-label="Alejar mapa" onClick={() => setZoom((value) => Math.max(MIN_ZOOM, value - 1))}>−</button>
        </div>
      </div>
      <p className="map-reference-notice">
        Puntos sincronizados dinámicamente con las comunidades registradas en la base de datos. Selecciona una comunidad para centrar el mapa y ver sus necesidades y jornadas activas.
      </p>
      <div
        className="reference-map"
        role="group"
        aria-label="Mapa de Manizales con comunidades registradas"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setDrag(null)}
        onPointerCancel={() => setDrag(null)}
      >
        {!tileFailed && Array.from({ length: 9 }, (_, index) => {
          const x = centerTileX + (index % 3) - 1;
          const y = centerTileY + Math.floor(index / 3) - 1;
          const url = tileUrl(zoom, x, y);
          if (!url) return null;
          const left = `calc(50% + ${x * TILE_SIZE - centerPixel.x}px)`;
          const top = `calc(50% + ${y * TILE_SIZE - centerPixel.y}px)`;
          return <img key={`${zoom}-${x}-${y}`} className="map-tile" src={url} alt="" draggable="false" style={{ left, top }} onError={() => setTileFailed(true)} />;
        })}
        {tileFailed && (
          <p className="tile-error" role="status">
            No se pudieron cargar los mosaicos del mapa. La lista de comunidades sigue disponible.
          </p>
        )}
        {points.map((point) => {
          const position = project(point.latitude, point.longitude, zoom);
          const isSelected = selected?.id === point.id;
          return (
            <button
              key={point.id}
              className={`reference-marker ${isSelected ? 'selected' : ''}`}
              type="button"
              style={{
                left: `calc(50% + ${position.x - centerPixel.x}px)`,
                top: `calc(50% + ${position.y - centerPixel.y}px)`,
              }}
              aria-label={`${point.name}, ${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)}`}
              aria-pressed={isSelected}
              onClick={() => handleSelectPoint(point)}
            >
              <span aria-hidden="true">
                {point.name}
                {typeof point.needsCount === 'number' && point.needsCount > 0 ? ` (${point.needsCount})` : ''}
              </span>
            </button>
          );
        })}
      </div>
      <p className="map-attribution">
        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">© OpenStreetMap contributors</a>
      </p>
      <ul className="reference-list" aria-label="Comunidades en el mapa">
        {points.map((point) => {
          const isSelected = selected?.id === point.id;
          return (
            <li key={point.id}>
              <button type="button" aria-pressed={isSelected} onClick={() => handleSelectPoint(point)}>
                <strong>{point.name}{point.code ? ` · ${point.code}` : ''}</strong>
                <span>
                  {point.isVerified ? 'Verificada' : 'Registrada'}
                  {typeof point.needsCount === 'number' ? ` · ${point.needsCount} necesidades` : ''}
                  {typeof point.eventsCount === 'number' ? ` · ${point.eventsCount} jornadas` : ''}
                </span>
                <small>{point.description || point.source}</small>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
