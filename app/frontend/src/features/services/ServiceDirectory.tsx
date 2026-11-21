import { useEffect, useMemo, useState } from 'react';
import { ReferenceMap } from './ReferenceMap';
import { defaultMapPoints, resolveCommunityCoords, type MapPoint } from './referencePoints';

type CommunityRecord = {
  id: number;
  name: string;
  code?: string;
  description?: string;
  is_verified: boolean;
};

type VolunteerEventRecord = {
  id: number;
  event_type: string;
  volunteer_name: string;
  venue: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
};

type NeedRecord = {
  id: number;
  community_id: number;
  product_id: number;
  quantity: number;
  description?: string;
  status: string;
  is_satisfied: boolean;
};

type ProductRecord = {
  id: number;
  name: string;
  unit?: string;
};

type ServiceItem = {
  id: string;
  name: string;
  type: string;
  community: string;
  communityId?: number;
  schedule: string;
  description: string;
  status: string;
};

export function ServiceDirectory() {
  const [communityFilter, setCommunityFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>(defaultMapPoints);
  const [selectedPoint, setSelectedPoint] = useState<MapPoint | null>(defaultMapPoints[0]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');

  useEffect(() => {
    let active = true;

    async function loadDirectory() {
      setLoading(true);
      try {
        const [commRes, eventsRes, needsRes, prodRes] = await Promise.all([
          fetch('/api/communities'),
          fetch('/api/volunteer-events'),
          fetch('/api/needs/public'),
          fetch('/api/products'),
        ]);

        const communities: CommunityRecord[] = commRes.ok ? await commRes.json() : [];
        const events: VolunteerEventRecord[] = eventsRes.ok ? await eventsRes.json() : [];
        const needs: NeedRecord[] = needsRes.ok ? await needsRes.json() : [];
        const products: ProductRecord[] = prodRes.ok ? await prodRes.json() : [];

        if (!active) return;

        const productMap = new Map(products.map((p) => [p.id, p]));
        const communityMap = new Map(communities.map((c) => [c.id, c]));

        const needsByCommunity = new Map<number, number>();
        for (const n of needs) {
          if (!n.is_satisfied) {
            needsByCommunity.set(n.community_id, (needsByCommunity.get(n.community_id) ?? 0) + 1);
          }
        }

        const dynamicPoints: MapPoint[] = communities.length
          ? communities.map((comm, index) => {
              const coords = resolveCommunityCoords(comm, index);
              return {
                id: String(comm.id),
                communityId: comm.id,
                name: comm.name,
                code: comm.code,
                latitude: coords.latitude,
                longitude: coords.longitude,
                source: coords.source,
                description: comm.description,
                isVerified: comm.is_verified,
                needsCount: needsByCommunity.get(comm.id) ?? 0,
                eventsCount: events.length,
              };
            })
          : defaultMapPoints;

        setMapPoints(dynamicPoints);
        setSelectedPoint(dynamicPoints[0] ?? null);

        const eventItems: ServiceItem[] = events.map((ev) => ({
          id: `event-${ev.id}`,
          name: ev.event_type,
          type: 'Jornada comunitaria',
          community: ev.venue,
          schedule: `${ev.date.slice(0, 10)} · ${ev.start_time}–${ev.end_time}`,
          description: `Responsable: ${ev.volunteer_name}`,
          status: ev.status,
        }));

        const needItems: ServiceItem[] = needs
          .filter((n) => !n.is_satisfied)
          .map((need) => {
            const comm = communityMap.get(need.community_id);
            const prod = productMap.get(need.product_id);
            return {
              id: `need-${need.id}`,
              name: prod ? `Necesidad de ${prod.name} (${need.quantity} ${prod.unit || 'uds'})` : `Solicitud #${need.id}`,
              type: 'Necesidad comunitaria',
              community: comm?.name ?? `Comunidad #${need.community_id}`,
              communityId: need.community_id,
              schedule: need.status,
              description: need.description || 'Solicitud activa registrada por la comunidad.',
              status: need.status,
            };
          });

        const combined = [...eventItems, ...needItems];
        setServices(combined);
        if (combined.length > 0) {
          setSelectedServiceId(combined[0].id);
        }
      } catch (err) {
        console.error('Error cargando directorio comunitario:', err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDirectory();
    return () => {
      active = false;
    };
  }, []);

  const communityOptions = useMemo(
    () => [...new Set([...mapPoints.map((p) => p.name), ...services.map((s) => s.community)])],
    [mapPoints, services],
  );

  const typeOptions = useMemo(
    () => [...new Set(services.map((s) => s.type))],
    [services],
  );

  const filteredServices = useMemo(() => {
    const q = query.trim().toLocaleLowerCase('es');
    return services.filter(
      (service) =>
        (!communityFilter || service.community === communityFilter) &&
        (!typeFilter || service.type === typeFilter) &&
        (!q || `${service.name} ${service.community} ${service.type} ${service.description}`.toLocaleLowerCase('es').includes(q)),
    );
  }, [services, communityFilter, typeFilter, query]);

  function handleSelectPoint(point: MapPoint) {
    setSelectedPoint(point);
    setCommunityFilter((prev) => (prev === point.name ? '' : point.name));
  }

  function clearFilters() {
    setCommunityFilter('');
    setTypeFilter('');
    setQuery('');
  }

  return (
    <main className="section-wrap directory-page">
      <p className="eyebrow">Consulta pública · datos en tiempo real</p>
      <h1>Servicios comunitarios</h1>
      <p className="directory-intro">
        Explora las comunidades registradas en Manizales, sus jornadas de voluntariado y necesidades activas sincronizadas con la base de datos.
      </p>

      <form className="service-filters" onSubmit={(event) => event.preventDefault()}>
        <label>
          Comunidad
          <select value={communityFilter} onChange={(event) => setCommunityFilter(event.target.value)}>
            <option value="">Todas las comunidades</option>
            {communityOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          Categoría
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            <option value="">Todas las categorías</option>
            {typeOptions.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </label>
        <label className="search-field">
          Buscar
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Producto, jornada o comunidad"
          />
        </label>
        <button className="button button-light clear-button" type="button" onClick={clearFilters}>
          Limpiar filtros
        </button>
      </form>

      <p className="result-count" aria-live="polite">
        {loading ? 'Cargando datos comunitarios...' : `${filteredServices.length} registros activos en ${mapPoints.length} comunidades`}
      </p>

      <div className="directory-layout">
        <ReferenceMap points={mapPoints} selected={selectedPoint} onSelect={handleSelectPoint} />
        <section className="service-list-panel">
          <h2>Jornadas y necesidades activas</h2>
          <p className="small-note">
            Información en vivo desde la base de datos de Alimenta. Haz clic en una comunidad del mapa para filtrar sus registros.
          </p>
          {loading ? (
            <p className="empty-state">Consultando base de datos...</p>
          ) : filteredServices.length ? (
            <ul aria-label="Servicios y necesidades publicadas">
              {filteredServices.map((service, index) => (
                <li key={service.id}>
                  <button
                    type="button"
                    aria-pressed={selectedServiceId === service.id}
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      const matchingPoint = mapPoints.find((p) => p.communityId === service.communityId || p.name === service.community);
                      if (matchingPoint) setSelectedPoint(matchingPoint);
                    }}
                  >
                    <span>{String(index + 1).padStart(2, '0')}</span>
                    <strong>{service.name}</strong>
                    <small>{service.type} · {service.community}</small>
                    <small>{service.schedule} · {service.description}</small>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No encontramos registros con esos filtros.</p>
          )}
        </section>
      </div>
    </main>
  );
}
