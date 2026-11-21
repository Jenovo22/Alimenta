import { useMemo, useState } from 'react';
import { serviceDays, serviceLocations, serviceTypes, type PublicService } from './data';
import { ReferenceMap } from './ReferenceMap';
import { neighborhoodReferences } from './referencePoints';

export function ServiceDirectory() {
  const [community, setCommunity] = useState('');
  const [type, setType] = useState('');
  const [day, setDay] = useState('');
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<PublicService>(serviceLocations[0]);
  const [selectedReference, setSelectedReference] = useState(neighborhoodReferences[0]);
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
      <ReferenceMap selected={selectedReference} onSelect={setSelectedReference} />
      <section className="service-list-panel"><h2>Servicios publicados (demo)</h2><p className="small-note">Los servicios ficticios no tienen coordenadas geográficas; los marcadores representan únicamente referencias de barrios.</p>
        {services.length ? <ul aria-label="Servicios publicados">{services.map((service, index) => <li key={service.name}><button type="button" aria-pressed={selected.name === service.name} onClick={() => setSelected(service)}><span>{String(index + 1).padStart(2, '0')}</span><strong>{service.name}</strong><small>{service.type} · {service.community}</small><small>{service.days.join(', ')} · {service.schedule}</small></button></li>)}</ul> : <p className="empty-state">No encontramos servicios con esos filtros.</p>}
      </section>
    </div>
  </main>;
}
