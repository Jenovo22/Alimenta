import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

type ProductRecord = { id: number; name: string; unit?: string };
type CommunityRecord = { id: number; name: string; code?: string; is_verified: boolean };
type NeedRecord = { id: number; community_id: number; edil_id: number; product_id: number; quantity: number; description?: string; status: string; is_satisfied: boolean };
type DonationRecord = {
  id: number;
  donor_id: number;
  edil_id: number | null;
  product_id: number;
  need_id: number | null;
  quantity: number;
  modality: string;
  status: string;
  appointment_status: string;
  transport_status: string;
  receipt_status: string;
};
type VolunteerEventRecord = {
  id: number;
  account_id: number;
  event_type: string;
  volunteer_name: string;
  venue: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
};
type InventorySummaryItem = {
  product_id: number;
  product_name: string;
  received_quantity: number;
  available_quantity: number;
  reserved_quantity: number;
  dispatched_quantity: number;
  location?: string;
};
type InventoryMovementRecord = {
  id: number;
  inventory_id: number;
  movement_type: string;
  quantity: number;
  notes?: string;
  created_at: string;
};
type UserRecord = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_active: boolean;
};

function statusClass(status: string) {
  const s = (status || '').toLowerCase();
  if (s.includes('confirm') || s.includes('acept') || s.includes('public') || s.includes('activ')) return 'status status-success';
  if (s.includes('rechaz') || s.includes('cancel') || s.includes('inactiv')) return 'status status-danger';
  return 'status status-pending';
}

export function DonorDonations() {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [needs, setNeeds] = useState<NeedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('5');
  const [modality, setModality] = useState('BANCO');
  const [needId, setNeedId] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { user } = useAuth();

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [dRes, pRes, nRes] = await Promise.all([
        fetch('/api/donations/'),
        fetch('/api/products'),
        fetch('/api/needs'),
      ]);
      const dData = dRes.ok ? await dRes.json() : [];
      const pData = pRes.ok ? await pRes.json() : [];
      const nData = nRes.ok ? await nRes.json() : [];
      setDonations(dData);
      setProducts(pData);
      setNeeds(nData);
      if (pData.length > 0 && !productId) {
        setProductId(String(pData[0].id));
      }
    } catch (e) {
      console.error('Error cargando donaciones:', e);
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const productMap = new Map(products.map((p) => [p.id, p]));
  const currentUserId = Number(user?.id || 0);
  const userDonations = donations.filter((d) => d.donor_id === currentUserId);

  async function handleCreateDonation(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    try {
      const params = new URLSearchParams({
        donor_id: String(currentUserId),
        product_id: productId,
        quantity,
        modality,
      });
      if (needId) {
        params.set('need_id', needId);
        const selectedNeed = needs.find((n) => String(n.id) === needId);
        if (selectedNeed?.edil_id) params.set('edil_id', String(selectedNeed.edil_id));
      }
      const resp = await fetch(`/api/donations/?${params.toString()}`, { method: 'POST' });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'No se pudo registrar la donación');
      }
      setFeedback({ type: 'success', text: 'Donación registrada y enviada a evaluación logística.' });
      setQuantity('5');
      setNeedId('');
      await fetchAll();
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Error al crear donación' });
    }
  }

  async function handleCancel(id: number) {
    setFeedback(null);
    try {
      const resp = await fetch(`/api/donations/${id}/cancel`, { method: 'POST' });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'No se pudo cancelar la donación');
      }
      setFeedback({ type: 'success', text: `Donación #${id} cancelada.` });
      await fetchAll();
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Error al cancelar' });
    }
  }

  return (
    <section className="workspace-section">
      <div className="workspace-title">
        <div>
          <p className="eyebrow">Donante · gestión y trazabilidad</p>
          <h2>Mis donaciones</h2>
          <p>Registra nuevos aportes y consulta el estado de cita, transporte y confirmación de recepción.</p>
        </div>
      </div>

      {feedback && (
        <p className={feedback.type === 'success' ? 'form-success' : 'form-error'} role="status">
          {feedback.text}
        </p>
      )}

      <div className="volunteer-layout">
        <form className="workspace-form" onSubmit={handleCreateDonation}>
          <h3>Registrar nueva donación</h3>
          <label>
            Producto
            <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.unit || 'uds'})</option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <label>
              Cantidad
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </label>
            <label>
              Modalidad
              <select value={modality} onChange={(e) => setModality(e.target.value)}>
                <option value="BANCO">Banco de alimentos</option>
                <option value="DIRIGIDA_EDIL">Dirigida a comunidad</option>
              </select>
            </label>
            <label>
              Asociar necesidad (opcional)
              <select value={needId} onChange={(e) => setNeedId(e.target.value)}>
                <option value="">Asignación automática</option>
                {needs.filter((n) => !n.is_satisfied).map((n) => (
                  <option key={n.id} value={n.id}>
                    #{n.id} · {productMap.get(n.product_id)?.name || `Prod #${n.product_id}`} ({n.quantity})
                  </option>
                ))}
              </select>
            </label>
          </div>
          <button type="submit" className="button button-dark">Registrar donación</button>
        </form>

        <div className="volunteer-list">
          <h3>Historial ({userDonations.length})</h3>
          {loading ? (
            <p>Cargando donaciones...</p>
          ) : userDonations.length === 0 ? (
            <p className="empty-state">Aún no tienes donaciones registradas.</p>
          ) : (
            userDonations.map((donation) => {
              const prod = productMap.get(donation.product_id);
              return (
                <article className="volunteer-card" key={donation.id}>
                  <div className="card-heading">
                    <h3>{prod?.name || `Producto #${donation.product_id}`} · {donation.quantity} {prod?.unit || 'uds'}</h3>
                    <span className={statusClass(donation.status)}>{donation.status}</span>
                  </div>
                  <dl>
                    <div><dt>Modalidad</dt><dd>{donation.modality}</dd></div>
                    <div><dt>Cita</dt><dd>{donation.appointment_status}</dd></div>
                    <div><dt>Transporte</dt><dd>{donation.transport_status}</dd></div>
                    <div><dt>Recepción</dt><dd>{donation.receipt_status}</dd></div>
                  </dl>
                  {donation.receipt_status === 'Pendiente' && donation.status !== 'Cancelada' && donation.status !== 'Rechazada' && (
                    <div className="card-actions">
                      <button type="button" className="button button-light" onClick={() => handleCancel(donation.id)}>
                        Cancelar donación
                      </button>
                    </div>
                  )}
                </article>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

export function DonorNeeds() {
  const [needs, setNeeds] = useState<NeedRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [communities, setCommunities] = useState<CommunityRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch('/api/needs'), fetch('/api/products'), fetch('/api/communities')])
      .then(async ([nRes, pRes, cRes]) => {
        if (nRes.ok) setNeeds(await nRes.json());
        if (pRes.ok) setProducts(await pRes.json());
        if (cRes.ok) setCommunities(await cRes.json());
      })
      .finally(() => setLoading(false));
  }, []);

  const prodMap = new Map(products.map((p) => [p.id, p]));
  const commMap = new Map(communities.map((c) => [c.id, c]));

  return (
    <section className="workspace-section">
      <p className="eyebrow">Donante · necesidades activas</p>
      <h2>Necesidades comunitarias publicadas</h2>
      <p>Solicitudes registradas por los ediles que requieren cobertura de alimentos o insumos.</p>
      {loading ? (
        <p>Cargando necesidades...</p>
      ) : (
        <div className="volunteer-grid">
          {needs.map((n) => {
            const prod = prodMap.get(n.product_id);
            const comm = commMap.get(n.community_id);
            return (
              <article className="volunteer-card" key={n.id}>
                <div className="card-heading">
                  <h3>{prod?.name || `Producto #${n.product_id}`} · {n.quantity} {prod?.unit || 'uds'}</h3>
                  <span className={statusClass(n.is_satisfied ? 'Confirmada' : n.status)}>
                    {n.is_satisfied ? 'Cubierta' : n.status}
                  </span>
                </div>
                <dl>
                  <div><dt>Comunidad</dt><dd>{comm?.name || `Comunidad #${n.community_id}`}</dd></div>
                  <div><dt>Detalle</dt><dd>{n.description || 'Sin observaciones adicionales'}</dd></div>
                </dl>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function EdilReceptions() {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { user } = useAuth();

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [dRes, pRes] = await Promise.all([fetch('/api/donations/'), fetch('/api/products')]);
      if (dRes.ok) setDonations(await dRes.json());
      if (pRes.ok) setProducts(await pRes.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const prodMap = new Map(products.map((p) => [p.id, p]));
  const userId = Number(user?.id || 0);
  const myReceptions = donations.filter((d) => d.edil_id === userId || user?.role === 'administrador');

  async function confirmReceipt(id: number) {
    setFeedback(null);
    try {
      const resp = await fetch(`/api/donations/${id}/confirm-receipt`, { method: 'POST' });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'No se pudo confirmar la recepción');
      }
      setFeedback({ type: 'success', text: `Recepción de donación #${id} confirmada.` });
      await load();
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Error al confirmar recepción' });
    }
  }

  return (
    <section className="workspace-section">
      <p className="eyebrow">Edil · verificación de entregas</p>
      <h2>Recepciones de donaciones</h2>
      <p>Confirma las entregas recibidas en tu comunidad para completar la trazabilidad.</p>
      {feedback && (
        <p className={feedback.type === 'success' ? 'form-success' : 'form-error'} role="status">
          {feedback.text}
        </p>
      )}
      {loading ? (
        <p>Cargando recepciones...</p>
      ) : myReceptions.length === 0 ? (
        <p className="empty-state">No hay entregas asignadas a tu comunidad todavía.</p>
      ) : (
        <div className="volunteer-grid">
          {myReceptions.map((d) => {
            const prod = prodMap.get(d.product_id);
            return (
              <article className="volunteer-card" key={d.id}>
                <div className="card-heading">
                  <h3>Donación #{d.id} · {prod?.name || `Producto #${d.product_id}`}</h3>
                  <span className={statusClass(d.receipt_status)}>{d.receipt_status}</span>
                </div>
                <dl>
                  <div><dt>Cantidad</dt><dd>{d.quantity} {prod?.unit || 'uds'}</dd></div>
                  <div><dt>Cita</dt><dd>{d.appointment_status}</dd></div>
                  <div><dt>Transporte</dt><dd>{d.transport_status}</dd></div>
                </dl>
                {d.receipt_status !== 'Confirmada' && d.status !== 'Rechazada' && d.status !== 'Cancelada' && (
                  <div className="card-actions">
                    <button type="button" className="button button-dark" onClick={() => confirmReceipt(d.id)}>
                      Confirmar recepción
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export function EdilNeeds() {
  const [needs, setNeeds] = useState<NeedRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [communities, setCommunities] = useState<CommunityRecord[]>([]);
  const [communityId, setCommunityId] = useState('');
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('10');
  const [description, setDescription] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { user } = useAuth();

  const load = useCallback(async () => {
    const [nRes, pRes, cRes] = await Promise.all([
      fetch('/api/needs'),
      fetch('/api/products'),
      fetch('/api/communities'),
    ]);
    const nData = nRes.ok ? await nRes.json() : [];
    const pData = pRes.ok ? await pRes.json() : [];
    const cData = cRes.ok ? await cRes.json() : [];
    setNeeds(nData);
    setProducts(pData);
    setCommunities(cData);
    if (pData.length && !productId) setProductId(String(pData[0].id));
    if (cData.length && !communityId) setCommunityId(String(cData[0].id));
  }, [communityId, productId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreateNeed(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    try {
      const params = new URLSearchParams({
        edil_id: String(user?.id || 3),
        community_id: communityId,
        product_id: productId,
        quantity,
        description,
      });
      const resp = await fetch(`/api/needs?${params.toString()}`, { method: 'POST' });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'No se pudo publicar la necesidad');
      }
      setFeedback({ type: 'success', text: 'Necesidad comunitaria publicada y visible para el agente y donantes.' });
      setDescription('');
      setQuantity('10');
      await load();
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Error al registrar necesidad' });
    }
  }

  const prodMap = new Map(products.map((p) => [p.id, p]));
  const commMap = new Map(communities.map((c) => [c.id, c]));

  return (
    <section className="workspace-section">
      <p className="eyebrow">Edil · solicitudes comunitarias</p>
      <h2>Necesidades de la comunidad</h2>
      {feedback && (
        <p className={feedback.type === 'success' ? 'form-success' : 'form-error'} role="status">
          {feedback.text}
        </p>
      )}
      <div className="volunteer-layout">
        <form className="workspace-form" onSubmit={handleCreateNeed}>
          <h3>Publicar nueva necesidad</h3>
          <label>
            Comunidad
            <select value={communityId} onChange={(e) => setCommunityId(e.target.value)} required>
              {communities.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <label>
              Producto
              <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} ({p.unit || 'uds'})</option>
                ))}
              </select>
            </label>
            <label>
              Cantidad requerida
              <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
            </label>
          </div>
          <label>
            Descripción
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Ej. Familias vulnerables del sector" required />
          </label>
          <button type="submit" className="button button-dark">Publicar necesidad</button>
        </form>

        <div className="volunteer-list">
          <h3>Solicitudes registradas ({needs.length})</h3>
          {needs.map((n) => (
            <article className="volunteer-card" key={n.id}>
              <div className="card-heading">
                <h3>{prodMap.get(n.product_id)?.name || `Producto #${n.product_id}`} · {n.quantity}</h3>
                <span className={statusClass(n.is_satisfied ? 'Confirmada' : n.status)}>
                  {n.is_satisfied ? 'Cubierta' : n.status}
                </span>
              </div>
              <dl>
                <div><dt>Comunidad</dt><dd>{commMap.get(n.community_id)?.name || `#${n.community_id}`}</dd></div>
                <div><dt>Detalle</dt><dd>{n.description || 'Sin descripción'}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function EdilVolunteerEvents() {
  const [events, setEvents] = useState<VolunteerEventRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [eventType, setEventType] = useState('Jornada de alimentación');
  const [volunteerName, setVolunteerName] = useState('');
  const [venue, setVenue] = useState('');
  const [date, setDate] = useState('2026-12-10');
  const [startTime, setStartTime] = useState('08:00');
  const [endTime, setEndTime] = useState('12:00');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/volunteer-events');
      if (response.ok) setEvents(await response.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  async function handleCreateEvent(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    try {
      const params = new URLSearchParams({
        account_id: String(user?.id || 3),
        event_type: eventType,
        volunteer_name: volunteerName,
        venue,
        date: `${date}T00:00:00`,
        start_time: startTime,
        end_time: endTime,
      });
      const resp = await fetch(`/api/volunteer-events?${params.toString()}`, { method: 'POST' });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'No se pudo crear la jornada');
      }
      setFeedback({ type: 'success', text: 'Jornada registrada y enviada a revisión administrativa.' });
      setVolunteerName('');
      setVenue('');
      await fetchData();
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Error al crear jornada' });
    }
  }

  return (
    <section className="workspace-section" aria-labelledby="volunteer-title">
      <div className="workspace-title">
        <div>
          <p className="eyebrow">Edil · jornadas de voluntariado</p>
          <h2 id="volunteer-title">Jornadas comunitarias</h2>
          <p>Registra jornadas de servicio comunitario que se publicarán en el directorio tras la revisión administrativa.</p>
        </div>
      </div>

      {feedback && (
        <p className={feedback.type === 'success' ? 'form-success' : 'form-error'} role="status">
          {feedback.text}
        </p>
      )}

      <div className="volunteer-layout">
        <form className="workspace-form" onSubmit={handleCreateEvent}>
          <h3>Programar jornada</h3>
          <label>
            Tipo de jornada
            <input type="text" value={eventType} onChange={(e) => setEventType(e.target.value)} required />
          </label>
          <label>
            Responsable / voluntario
            <input type="text" value={volunteerName} onChange={(e) => setVolunteerName(e.target.value)} placeholder="Nombre del responsable" required />
          </label>
          <label>
            Lugar / sede
            <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Centro comunitario" required />
          </label>
          <div className="form-row">
            <label>Fecha<input type="date" value={date} onChange={(e) => setDate(e.target.value)} required /></label>
            <label>Inicio<input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required /></label>
            <label>Fin<input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required /></label>
          </div>
          <button type="submit" className="button button-dark">Registrar jornada</button>
        </form>

        <div className="volunteer-list">
          <h3>Jornadas registradas ({events.length})</h3>
          {loading ? (
            <p>Cargando jornadas...</p>
          ) : events.length === 0 ? (
            <p className="empty-state">No hay jornadas programadas.</p>
          ) : (
            events.map((event) => (
              <article className="volunteer-card" key={event.id}>
                <div className="card-heading">
                  <h3>{event.event_type}</h3>
                  <span className={statusClass(event.status)}>{event.status}</span>
                </div>
                <dl>
                  <div><dt>Fecha y horario</dt><dd>{event.date.slice(0, 10)} · {event.start_time} – {event.end_time}</dd></div>
                  <div><dt>Lugar</dt><dd>{event.venue}</dd></div>
                  <div><dt>Responsable</dt><dd>{event.volunteer_name}</dd></div>
                </dl>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export function AgentInventory() {
  const [items, setItems] = useState<InventorySummaryItem[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [movements, setMovements] = useState<InventoryMovementRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [productId, setProductId] = useState('');
  const [qty, setQty] = useState('5');
  const [movementType, setMovementType] = useState<'RECEIPT' | 'DISPATCH' | 'ADJUSTMENT'>('RECEIPT');
  const [notes, setNotes] = useState('');
  const [allocationResult, setAllocationResult] = useState<{
    product_name: string;
    total_quantity: number;
    remaining_unallocated: number;
    allocations: Array<{ community_id: number; community_name?: string; allocated_quantity: number; priority_score?: number; reason?: string }>;
  } | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [sumRes, prodRes, movRes] = await Promise.all([
        fetch('/api/inventory/summary'),
        fetch('/api/products'),
        fetch('/api/inventory/movements?limit=15'),
      ]);
      if (sumRes.ok) {
        const sumData = await sumRes.json();
        setItems(Array.isArray(sumData.items) ? sumData.items : []);
      }
      if (prodRes.ok) {
        const pData = await prodRes.json();
        setProducts(pData);
        if (pData.length && !productId) setProductId(String(pData[0].id));
      }
      if (movRes.ok) {
        setMovements(await movRes.json());
      }
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdjust(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    try {
      const params = new URLSearchParams({
        product_id: productId,
        quantity_adjustment: qty,
        movement_type: movementType,
      });
      if (notes.trim()) params.set('notes', notes.trim());
      const resp = await fetch(`/api/inventory/adjust?${params.toString()}`, { method: 'POST' });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'No se pudo registrar el movimiento');
      }
      setFeedback({ type: 'success', text: 'Movimiento de inventario registrado en base de datos.' });
      setNotes('');
      await load();
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Error en ajuste de inventario' });
    }
  }

  async function runAllocation(targetProductId: number, availableQty: number) {
    setFeedback(null);
    const amount = Math.max(1, Math.min(availableQty || 5, 10));
    try {
      const resp = await fetch(`/api/agent/allocate/${targetProductId}?quantity=${amount}`, { method: 'POST' });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'No se pudo calcular la asignación');
      }
      setAllocationResult(await resp.json());
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Error al asignar stock' });
    }
  }

  return (
    <section className="workspace-section">
      <p className="eyebrow">Agente · inventario y asignación</p>
      <h2>Inventario del banco de alimentos</h2>
      <p>Stock en tiempo real por producto, movimientos de bodega y recomendaciones de asignación por comunidad.</p>

      {feedback && (
        <p className={feedback.type === 'success' ? 'form-success' : 'form-error'} role="status">
          {feedback.text}
        </p>
      )}

      {loading ? (
        <p>Cargando inventario...</p>
      ) : (
        <div className="table-wrap">
          <table className="workspace-table" aria-label="Inventario del banco">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Ubicación</th>
                <th>Disponible</th>
                <th>Reservado</th>
                <th>Despachado</th>
                <th>Recibido</th>
                <th>Asignación</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.product_id}>
                  <th scope="row">{item.product_name}</th>
                  <td>{item.location || 'Bodega central'}</td>
                  <td><strong>{item.available_quantity}</strong></td>
                  <td>{item.reserved_quantity}</td>
                  <td>{item.dispatched_quantity}</td>
                  <td>{item.received_quantity}</td>
                  <td>
                    <button
                      type="button"
                      className="button button-light btn-sm"
                      disabled={item.available_quantity <= 0}
                      onClick={() => runAllocation(item.product_id, item.available_quantity)}
                    >
                      Sugerir asignación
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {allocationResult && (
        <div className="workspace-card allocation-box">
          <p className="eyebrow">Recomendación del agente logístico</p>
          <h3>Distribución sugerida · {allocationResult.product_name} ({allocationResult.total_quantity} uds)</h3>
          {allocationResult.allocations.length === 0 ? (
            <p className="small-note">No hay necesidades abiertas para este producto en este momento.</p>
          ) : (
            <ul className="allocation-list">
              {allocationResult.allocations.map((a, idx) => (
                <li key={`${a.community_id}-${idx}`}>
                  <strong>{a.community_name || `Comunidad #${a.community_id}`}</strong>
                  <span>{a.allocated_quantity} unidades</span>
                  {a.reason && <small>{a.reason}</small>}
                </li>
              ))}
            </ul>
          )}
          <p className="small-note">Remanente en bodega: {allocationResult.remaining_unallocated} unidades.</p>
        </div>
      )}

      <div className="volunteer-layout">
        <form className="workspace-form" onSubmit={handleAdjust}>
          <h3>Registrar movimiento de inventario</h3>
          <label>
            Producto
            <select value={productId} onChange={(e) => setProductId(e.target.value)} required>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.unit || 'uds'})</option>
              ))}
            </select>
          </label>
          <div className="form-row">
            <label>
              Tipo
              <select value={movementType} onChange={(e) => setMovementType(e.target.value as 'RECEIPT' | 'DISPATCH' | 'ADJUSTMENT')}>
                <option value="RECEIPT">Ingreso (RECEIPT)</option>
                <option value="DISPATCH">Despacho (DISPATCH)</option>
                <option value="ADJUSTMENT">Ajuste (ADJUSTMENT)</option>
              </select>
            </label>
            <label>
              Cantidad
              <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} required />
            </label>
          </div>
          <label>
            Notas
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Motivo o referencia del movimiento" />
          </label>
          <button type="submit" className="button button-dark">Aplicar movimiento</button>
        </form>

        <div className="volunteer-list">
          <h3>Movimientos recientes ({movements.length})</h3>
          {movements.length === 0 ? (
            <p className="empty-state">Aún no hay movimientos registrados.</p>
          ) : (
            movements.slice(0, 6).map((m) => (
              <article className="volunteer-card" key={m.id}>
                <div className="card-heading">
                  <h3>{m.movement_type} · {m.quantity} uds</h3>
                  <small>{m.created_at?.slice(0, 16).replace('T', ' ')}</small>
                </div>
                <p className="small-note">{m.notes || `Inventario #${m.inventory_id}`}</p>
              </article>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export function AdminVolunteerEvents() {
  const [events, setEvents] = useState<VolunteerEventRecord[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/volunteer-events');
      if (response.ok) setEvents(await response.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  async function moderate(id: number, action: 'approve' | 'reject') {
    setFeedback(null);
    try {
      const resp = await fetch(`/api/volunteer-events/${id}/moderate?action=${action}`, { method: 'PATCH' });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'No se pudo moderar la jornada');
      }
      setFeedback({
        type: 'success',
        text: `Jornada #${id} ${action === 'approve' ? 'aprobada y publicada' : 'rechazada'}.`,
      });
      await fetchEvents();
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Error al moderar' });
    }
  }

  return (
    <section className="workspace-section" aria-labelledby="moderation-title">
      <div className="workspace-title">
        <div>
          <p className="eyebrow">Administrador · revisión</p>
          <h2 id="moderation-title">Moderación de jornadas comunitarias</h2>
          <p>Aprueba o rechaza las jornadas propuestas por los ediles para su publicación en el directorio público.</p>
        </div>
      </div>

      {feedback && (
        <p className={feedback.type === 'success' ? 'form-success' : 'form-error'} role="status">
          {feedback.text}
        </p>
      )}

      {loading ? (
        <p>Cargando jornadas...</p>
      ) : (
        <div className="volunteer-grid">
          {events.length === 0 ? (
            <p className="empty-state">No hay jornadas registradas.</p>
          ) : (
            events.map((item) => (
              <article key={item.id} className="volunteer-card">
                <div className="card-heading">
                  <h3>{item.event_type}</h3>
                  <span className={statusClass(item.status)}>{item.status}</span>
                </div>
                <dl>
                  <div><dt>Fecha</dt><dd>{item.date.slice(0, 10)} · {item.start_time}–{item.end_time}</dd></div>
                  <div><dt>Lugar</dt><dd>{item.venue}</dd></div>
                  <div><dt>Responsable</dt><dd>{item.volunteer_name}</dd></div>
                </dl>
                {item.status === 'Pendiente de revisión' && (
                  <div className="card-actions">
                    <button className="button button-dark" type="button" onClick={() => moderate(item.id, 'approve')}>
                      Aprobar publicación
                    </button>
                    <button className="button button-light" type="button" onClick={() => moderate(item.id, 'reject')}>
                      Rechazar jornada
                    </button>
                  </div>
                )}
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export function AdminUsers() {
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setUsers(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="workspace-section">
      <p className="eyebrow">Administrador · cuentas</p>
      <h2>Usuarios registrados</h2>
      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="table-wrap">
          <table className="workspace-table" aria-label="Usuarios de la plataforma">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <th scope="row">{u.name}</th>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td><span className={statusClass(u.is_active ? 'Activo' : 'Inactivo')}>{u.is_active ? 'Activo' : 'Inactivo'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
