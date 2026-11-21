import { useMemo, useState } from 'react';
import { serviceDays, serviceLocations, serviceTypes, type PublicService } from './data';

export function ServiceDirectory() {
  const [community, setCommunity] = useState('');
  const [type, setType] = useState('');
  const [day, setDay] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PublicService>(serviceLocations[0]);
  const services = useMemo(() => serviceLocations.filter((service) =>
    (!community || service.community === community) && (!type || service.type === type) &&
    (!day || service.days.includes(day)) && (!query || `${service.name} ${service.community} ${service.type}`.toLocaleLowerCase('es').includes(query.toLocaleLowerCase('es'))),
  ), [community, day, query, type]);

  function clearFilters() {
    setCommunity(''); setType(''); setDay(''); setQuery('');
  }

  return <main className="section-wrap directory-page">
    <p className="eyebrow">Consulta pública · datos ficticios</p><h1>Servicios comunitarios</h1><p className="directory-intro">Explora ejemplos de servicios y sus horarios informativos. Ningún horario indica cupos o disponibilidad en tiempo real.</p>
    <form className="service-filters" onSubmit={(event) => event.preventDefault()}>
      <label>Comunidad<select value={community} onChange={(event) => setCommunity(event.target.value)}><option value="">Todas las comunidades</option>{[...new Set(serviceLocations.map((service) => service.community))].map((name) => <option key={name}>{name}</option>)}</select></label>
      <label>Tipo de servicio<select value={type} onChange={(event) => setType(event.target.value)}><option value="">Todos los tipos</option>{serviceTypes.map((name) => <option key={name}>{name}</option>)}</select></label>
      <label>Día<select value={day} onChange={(event) => setDay(event.target.value)}><option value="">Todos los días</option>{serviceDays.map((name) => <option key={name}>{name}</option>)}</select></label>
      <label className="search-field">Buscar<input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Nombre o comunidad" /></label>
      <button className="button button-light clear-button" type="button" onClick={clearFilters}>Limpiar filtros</button>
    </form>
    <p className="result-count" aria-live="polite">{services.length} servicios de ejemplo</p>
    <div className="directory-layout">
      <section className="map-panel" aria-label="Representación esquemática de ubicaciones">
        <p className="map-disclaimer">Representación esquemática · no es un mapa real</p>
        <div className="schematic-map" role="group" aria-label="Ubicaciones esquemáticas interactivas. La lista de servicios ofrece la alternativa textual.">
          {services.map((service, index) => <button key={service.name} className={`map-marker ${selected.name === service.name ? 'selected' : ''}`} style={{ left: `${service.x}%`, top: `${service.y}%` }} type="button" aria-label={`Seleccionar ${service.name}`} aria-pressed={selected.name === service.name} onClick={() => setSelected(service)}>{index + 1}</button>)}
          {services.length === 0 && <p className="map-empty">No hay ubicaciones para estos filtros.</p>}
        </div>
        <article className="service-detail"><p className="eyebrow">Ficha del servicio · ejemplo</p>{services.length ? <><h2>{services.some((service) => service.name === selected.name) ? selected.name : services[0].name}</h2><p>{(services.some((service) => service.name === selected.name) ? selected : services[0]).description}</p><strong>{(services.some((service) => service.name === selected.name) ? selected : services[0]).community} · horario informativo</strong></> : <p>Prueba otros filtros para ver servicios de ejemplo.</p>}</article>
      </section>
      <section className="service-list-panel"><h2>Servicios publicados (demo)</h2><p className="small-note">Alternativa textual a las ubicaciones esquemáticas.</p>
        {services.length ? <ul aria-label="Servicios publicados">{services.map((service, index) => <li key={service.name}><button type="button" aria-pressed={selected.name === service.name} onClick={() => setSelected(service)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{service.name}</strong><small>{service.type} · {service.community}</small><small>{service.days.join(', ')} · {service.schedule}</small></button></li>)}</ul> : <p className="empty-state">No encontramos servicios con esos filtros.</p>}
      </section>
    </div>
  </main>;
}
