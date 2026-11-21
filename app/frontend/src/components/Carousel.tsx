export type FeaturedAlly = {
  id?: number;
  name: string;
  rank?: number;
  description: string;
  verified?: boolean;
};

type CarouselProps = {
  items: FeaturedAlly[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export function Carousel({ items, selectedIndex, onSelect }: CarouselProps) {
  if (!items.length) {
    return (
      <div className="featured-carousel" aria-roledescription="carrusel">
        <div className="feature-copy">
          <p className="eyebrow">Organizaciones aliadas</p>
          <h3>Sin organizaciones registradas</h3>
          <p>Aún no hay entidades aliadas cargadas en la base de datos.</p>
        </div>
      </div>
    );
  }

  const safeIndex = selectedIndex % items.length;
  const current = items[safeIndex];
  const move = (offset: number) => onSelect((safeIndex + offset + items.length) % items.length);

  return (
    <div className="featured-carousel" aria-roledescription="carrusel">
      <div className="feature-copy" aria-live="polite">
        <p className="eyebrow">Organización destacada</p>
        <h3>{current.name}</h3>
        <p>{current.description}</p>
        <p className="small-note">
          {current.verified ? 'Organización verificada en la red Alimenta' : 'Entidad registrada en la red Alimenta'}
          {current.rank ? ` · Posición #${current.rank}` : ''}
        </p>
        <div className="carousel-controls" aria-label="Controles de organizaciones aliadas">
          <span className="slide-count">{String(safeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
          <button type="button" className="carousel-arrow" aria-label="Organización anterior" onClick={() => move(-1)}>←</button>
          <button type="button" className="carousel-arrow" aria-label="Siguiente organización" onClick={() => move(1)}>→</button>
          <div className="carousel-dots" aria-label="Seleccionar organización">
            {items.map((item, index) => (
              <button
                type="button"
                key={item.id ?? item.name}
                aria-label={`Mostrar ${item.name}`}
                aria-pressed={index === safeIndex}
                onClick={() => onSelect(index)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="feature-preview" aria-hidden="true">
        <span>Reconocimiento público</span>
        <strong>{current.name}</strong>
        <small>{current.verified ? 'Aliado verificado · Manizales' : 'Red comunitaria Alimenta'}</small>
      </div>
    </div>
  );
}
