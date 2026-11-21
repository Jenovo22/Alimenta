import { useCallback, useEffect, useState } from 'react';

type WeightMap = {
  equity: number;
  urgency: number;
  efficiency: number;
  impact: number;
};

type AnalysisItem = {
  donation_id: number;
  total_score?: number;
  priority_score?: number;
  score?: number;
  priority?: string;
  recommendation?: string;
  scores?: Record<string, number>;
  breakdown?: Record<string, number>;
  factors?: Record<string, number>;
};

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
  created_at: string;
};

type ProductRecord = { id: number; name: string; unit?: string };
type NeedRecord = { id: number; community_id: number; product_id: number; quantity: number; is_satisfied: boolean; status: string };
type InventorySummary = { items: Array<{ product_id: number; product_name: string; available_quantity: number; reserved_quantity: number; dispatched_quantity: number }> };

const WEIGHT_LABELS: Record<keyof WeightMap, string> = {
  equity: 'Equidad comunitaria',
  urgency: 'Urgencia de necesidad',
  efficiency: 'Eficiencia logística',
  impact: 'Impacto social',
};

function statusBadgeClass(value: string) {
  const lower = (value || '').toLowerCase();
  if (lower.includes('confirm') || lower.includes('acept') || lower.includes('public') || lower.includes('entreg')) {
    return 'status status-success';
  }
  if (lower.includes('rechaz') || lower.includes('cancel')) {
    return 'status status-danger';
  }
  return 'status status-pending';
}

export function AgentLogistics({ allowWeightEdit = false }: { allowWeightEdit?: boolean }) {
  const [weights, setWeights] = useState<WeightMap>({ equity: 0.3, urgency: 0.25, efficiency: 0.25, impact: 0.2 });
  const [pendingAnalysis, setPendingAnalysis] = useState<AnalysisItem[]>([]);
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [products, setProducts] = useState<ProductRecord[]>([]);
  const [needs, setNeeds] = useState<NeedRecord[]>([]);
  const [inventoryAvailable, setInventoryAvailable] = useState(0);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const [wRes, aRes, dRes, pRes, nRes, invRes] = await Promise.all([
        fetch('/api/agent/weights'),
        fetch('/api/agent/analyze/pending'),
        fetch('/api/donations/'),
        fetch('/api/products'),
        fetch('/api/needs'),
        fetch('/api/inventory/summary'),
      ]);

      if (wRes.ok) {
        const wData = await wRes.json();
        if (wData.weights) setWeights(wData.weights);
      }
      if (aRes.ok) {
        const aData = await aRes.json();
        setPendingAnalysis(Array.isArray(aData.analysis) ? aData.analysis : []);
      }
      if (dRes.ok) {
        setDonations(await dRes.json());
      }
      if (pRes.ok) {
        setProducts(await pRes.json());
      }
      if (nRes.ok) {
        setNeeds(await nRes.json());
      }
      if (invRes.ok) {
        const invData: InventorySummary = await invRes.json();
        const totalAvail = (invData.items || []).reduce((acc, item) => acc + (item.available_quantity || 0), 0);
        setInventoryAvailable(totalAvail);
      }
    } catch (err) {
      console.error('Error cargando centro logístico:', err);
      setFeedback({ type: 'error', text: 'No se pudo cargar la información del agente logístico.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const productMap = new Map(products.map((p) => [p.id, p]));
  const donationMap = new Map(donations.map((d) => [d.id, d]));

  async function runDonationAction(donationId: number, action: 'accept' | 'reject' | 'mark-transport') {
    setBusyId(donationId);
    setFeedback(null);
    try {
      const resp = await fetch(`/api/donations/${donationId}/${action}`, { method: 'POST' });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'No se pudo actualizar la donación');
      }
      const actionLabels = {
        accept: 'aceptada',
        reject: 'rechazada',
        'mark-transport': 'marcada en transporte',
      };
      setFeedback({ type: 'success', text: `Donación #${donationId} ${actionLabels[action]} correctamente.` });
      await loadAll();
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Error al procesar acción' });
    } finally {
      setBusyId(null);
    }
  }

  async function handleSaveWeights(e: React.FormEvent) {
    e.preventDefault();
    setFeedback(null);
    try {
      const resp = await fetch('/api/agent/weights', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(weights),
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.detail || 'Error al actualizar pesos');
      }
      const data = await resp.json();
      if (data.weights) setWeights(data.weights);
      setFeedback({ type: 'success', text: 'Pesos de ponderación actualizados.' });
      await loadAll();
    } catch (err) {
      setFeedback({ type: 'error', text: err instanceof Error ? err.message : 'Error al guardar pesos' });
    }
  }

  const pendingCount = donations.filter((d) => d.appointment_status === 'Pendiente de aceptación').length;
  const inTransitCount = donations.filter((d) => d.transport_status === 'En transporte').length;
  const confirmedCount = donations.filter((d) => d.receipt_status === 'Confirmada').length;
  const openNeedsCount = needs.filter((n) => !n.is_satisfied).length;

  return (
    <section className="workspace-section">
      <div className="workspace-title">
        <div>
          <p className="eyebrow">Agente logístico · operación en vivo</p>
          <h2>Centro de control y ponderación social</h2>
          <p>Visualiza cómo el agente evalúa donaciones pendientes, prioriza entregas y coordina el despacho con la base de datos en tiempo real.</p>
        </div>
        <button type="button" className="button button-dark" onClick={loadAll} disabled={loading}>
          {loading ? 'Analizando...' : 'Recalcular análisis'}
        </button>
      </div>

      {feedback && (
        <p className={feedback.type === 'success' ? 'form-success' : 'form-error'} role="status">
          {feedback.text}
        </p>
      )}

      <div className="metric-grid metric-grid-4">
        <article>
          <strong>{pendingCount}</strong>
          <span>Pendientes de decisión</span>
          <small>{pendingAnalysis.length} evaluadas por el agente</small>
        </article>
        <article>
          <strong>{inTransitCount}</strong>
          <span>En transporte</span>
          <small>Entregas en ruta hacia comunidades</small>
        </article>
        <article>
          <strong>{confirmedCount}</strong>
          <span>Recepciones confirmadas</span>
          <small>De {donations.length} donaciones registradas</small>
        </article>
        <article>
          <strong>{inventoryAvailable}</strong>
          <span>Stock disponible en banco</span>
          <small>{openNeedsCount} necesidades comunitarias activas</small>
        </article>
      </div>

      <div className="agent-panel-grid">
        <div className="workspace-card">
          <p className="eyebrow">Criterios activos del motor</p>
          <h3>Pesos de ponderación social</h3>
          <form onSubmit={handleSaveWeights} className="weights-form">
            {(Object.keys(WEIGHT_LABELS) as Array<keyof WeightMap>).map((key) => {
              const pct = Math.round((weights[key] || 0) * 100);
              return (
                <div className="weight-row" key={key}>
                  <div className="weight-label">
                    <span>{WEIGHT_LABELS[key]}</span>
                    <strong>{pct}%</strong>
                  </div>
                  <div className="weight-bar-track">
                    <div className="weight-bar-fill" style={{ width: `${Math.min(100, pct)}%` }} />
                  </div>
                  {allowWeightEdit && (
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.05"
                      value={weights[key]}
                      onChange={(e) => setWeights((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
                      aria-label={WEIGHT_LABELS[key]}
                    />
                  )}
                </div>
              );
            })}
            {allowWeightEdit && (
              <button type="submit" className="button button-dark">
                Guardar pesos
              </button>
            )}
          </form>
        </div>

        <div className="workspace-card">
          <p className="eyebrow">Cola priorizada por el agente</p>
          <h3>Donaciones evaluadas ({pendingAnalysis.length})</h3>
          {loading ? (
            <p>Ejecutando análisis logístico...</p>
          ) : pendingAnalysis.length === 0 ? (
            <p className="small-note">No hay donaciones pendientes en cola de evaluación en este momento.</p>
          ) : (
            <div className="analysis-list">
              {pendingAnalysis.map((item) => {
                const donation = donationMap.get(item.donation_id);
                const prod = donation ? productMap.get(donation.product_id) : null;
                const score = item.total_score ?? item.priority_score ?? item.score ?? 0;
                const breakdown = item.scores ?? item.breakdown ?? item.factors ?? {};
                return (
                  <article className="analysis-item" key={item.donation_id}>
                    <div className="card-heading">
                      <div>
                        <h4>
                          Donación #{item.donation_id}
                          {prod ? ` · ${prod.name}` : ''}
                          {donation ? ` (${donation.quantity} ${prod?.unit || 'uds'})` : ''}
                        </h4>
                        <small>{item.recommendation || `Prioridad: ${item.priority || 'Evaluada'}`}</small>
                      </div>
                      <span className="score-pill">{typeof score === 'number' ? score.toFixed(2) : score}</span>
                    </div>
                    {Object.keys(breakdown).length > 0 && (
                      <div className="factor-chips">
                        {Object.entries(breakdown).map(([k, v]) => (
                          <span key={k}>
                            {k}: {typeof v === 'number' ? v.toFixed(2) : String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                    {donation && (
                      <div className="card-actions">
                        {donation.appointment_status === 'Pendiente de aceptación' && (
                          <>
                            <button
                              type="button"
                              className="button button-dark"
                              disabled={busyId === donation.id}
                              onClick={() => runDonationAction(donation.id, 'accept')}
                            >
                              Aceptar
                            </button>
                            <button
                              type="button"
                              className="button button-light"
                              disabled={busyId === donation.id}
                              onClick={() => runDonationAction(donation.id, 'reject')}
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                        {donation.appointment_status === 'Aceptada' && donation.transport_status === 'Pendiente' && (
                          <button
                            type="button"
                            className="button button-dark"
                            disabled={busyId === donation.id}
                            onClick={() => runDonationAction(donation.id, 'mark-transport')}
                          >
                            Enviar a transporte
                          </button>
                        )}
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="workspace-section-sub">
        <h3>Flujo logístico de donaciones</h3>
        <div className="table-wrap">
          <table className="workspace-table" aria-label="Flujo logístico de donaciones">
            <thead>
              <tr>
                <th>Donación</th>
                <th>Cantidad</th>
                <th>Modalidad</th>
                <th>Cita</th>
                <th>Transporte</th>
                <th>Recepción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((d) => {
                const prod = productMap.get(d.product_id);
                return (
                  <tr key={d.id}>
                    <th scope="row">#{d.id} · {prod?.name || `Producto #${d.product_id}`}</th>
                    <td>{d.quantity} {prod?.unit || 'uds'}</td>
                    <td>{d.modality}</td>
                    <td><span className={statusBadgeClass(d.appointment_status)}>{d.appointment_status}</span></td>
                    <td><span className={statusBadgeClass(d.transport_status)}>{d.transport_status}</span></td>
                    <td><span className={statusBadgeClass(d.receipt_status)}>{d.receipt_status}</span></td>
                    <td>
                      <div className="inline-actions">
                        {d.appointment_status === 'Pendiente de aceptación' && d.status !== 'Rechazada' && d.status !== 'Cancelada' && (
                          <>
                            <button
                              type="button"
                              className="button button-dark btn-sm"
                              disabled={busyId === d.id}
                              onClick={() => runDonationAction(d.id, 'accept')}
                            >
                              Aceptar
                            </button>
                            <button
                              type="button"
                              className="button button-light btn-sm"
                              disabled={busyId === d.id}
                              onClick={() => runDonationAction(d.id, 'reject')}
                            >
                              Rechazar
                            </button>
                          </>
                        )}
                        {d.appointment_status === 'Aceptada' && d.transport_status === 'Pendiente' && (
                          <button
                            type="button"
                            className="button button-dark btn-sm"
                            disabled={busyId === d.id}
                            onClick={() => runDonationAction(d.id, 'mark-transport')}
                          >
                            En transporte
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
