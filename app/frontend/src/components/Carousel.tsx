export type FeaturedAlly = { name: string; confirmed: number; description: string };

type CarouselProps = {
  items: FeaturedAlly[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

export function Carousel({ items, selectedIndex, onSelect }: CarouselProps) {
  const current = items[selectedIndex];
  const move = (offset: number) => onSelect((selectedIndex + offset + items.length) % items.length);

  return (
    <div className="featured-carousel" aria-roledescription="carrusel">
      <div className="feature-copy" aria-live="polite">
        <p className="eyebrow">Organización destacada · demo</p>
        <h3>{current.name}</h3>
        <p>{current.description}</p>
        <p className="small-note">{current.confirmed} aportes confirmados de ejemplo</p>
        <div className="carousel-controls" aria-label="Controles de organizaciones aliadas">
          <span className="slide-count">{String(selectedIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span>
          <button type="button" className="carousel-arrow" aria-label="Organización anterior" onClick={() => move(-1)}>←</button>
          <button type="button" className="carousel-arrow" aria-label="Siguiente organización" onClick={() => move(1)}>→</button>
          <div className="carousel-dots" aria-label="Seleccionar organización">
            {items.map((item, index) => <button type="button" key={item.name} aria-label={`Mostrar ${item.name}`} aria-pressed={index === selectedIndex} onClick={() => onSelect(index)} />)}
          </div>
        </div>
      </div>
      <div className="feature-preview" aria-hidden="true"><span>Reconocimiento público</span><strong>{current.name}</strong><small>Ejemplo local · sin datos reales</small></div>
    </div>
  );
}
