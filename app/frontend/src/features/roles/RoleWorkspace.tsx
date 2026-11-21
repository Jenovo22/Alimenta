import { useState, useSyncExternalStore } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { WorkspaceHeader } from '../../components/WorkspaceHeader';
import { roleLabels, roleNavigation } from './data';
import { AdminVolunteerEvents, EdilVolunteerEvents } from './VolunteerEvents';
import { getDemoState, getRecoveryMessage, resetDemoState, subscribeDemoState, updateDemoState } from './demoStore';
import type { DemoRole } from './types';
import '../../styles/workspace.css';

const roles: DemoRole[] = ['donante', 'edil', 'agente', 'administrador'];

function Dashboard({ role }: { role: DemoRole }) {
  const summaries = {
    donante: ['Necesidades publicadas', 'Citas por aceptar', 'Transportes ofrecidos'],
    edil: ['Solicitudes comunitarias', 'Recepciones por verificar', 'Jornadas por revisar'],
    agente: ['Necesidades sin evaluar', 'Ingresos por verificar', 'Entregas coordinadas'],
    administrador: ['Representantes pendientes', 'Servicios por revisar', 'Jornadas pendientes'],
  }[role];
  return <section className="workspace-section"><p className="eyebrow">Resumen de datos ficticios</p><h2>Área de {roleLabels[role]}</h2><p>Explora una representación cliente de las responsabilidades documentadas para este rol.</p><div className="metric-grid">{summaries.map((label, index) => <article key={label}><strong>{index + 1}</strong><span>{label}</span><small>Dato ilustrativo</small></article>)}</div></section>;
}

function DonorDonations() {
  const state = useSyncExternalStore(subscribeDemoState, getDemoState, getDemoState);
  const [message, setMessage] = useState('');
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  const offers = state.offers.filter((offer) => offer.donorId === 'donante-demo-01');
  function createOffer(event: React.FormEvent) {
    event.preventDefault();
    const amount = Number(quantity);
    if (!product.trim() || !Number.isInteger(amount) || amount < 1) { setMessage('Ingresa un producto y una cantidad entera mayor que cero.'); return; }
    const id = `OF-${Date.now()}`;
    updateDemoState((current) => ({ ...current, offers: [{ id, donorId: 'donante-demo-01', edilId: 'edil-demo-01', product: product.trim(), quantity: amount, offerStatus: 'Ofrecida', appointmentStatus: 'Pendiente de aceptación', transportStatus: 'Pendiente', receiptStatus: 'Pendiente' }, ...current.offers] }));
    setProduct(''); setQuantity(''); setMessage('Ofrecimiento creado para la cuenta ficticia del Edil. No es una donación real ni una recepción.');
  }
  return <section className="workspace-section"><div className="workspace-title"><div><p className="eyebrow">Donante · seguimiento</p><h2>Mis donaciones de demostración</h2><p>Ofrecimiento, aceptación/cita, transporte y recepción son estados independientes.</p></div></div><form className="workspace-form" onSubmit={createOffer}><h3>Crear ofrecimiento al Edil asignado</h3><label>Producto<input value={product} onChange={(event) => setProduct(event.target.value)} /></label><label>Cantidad ofrecida<input type="number" min="1" step="1" value={quantity} onChange={(event) => setQuantity(event.target.value)} /></label><button className="button button-dark" type="submit">Crear ofrecimiento</button></form>{message && <p className="form-success" role="status">{message}</p>}<div className="volunteer-grid">{offers.map((offer) => <article className="volunteer-card" key={offer.id}><h3>{offer.product} · {offer.quantity}</h3><p>Cuenta de origen: {offer.donorId}</p><p>Oferta: {offer.offerStatus} · Cita: {offer.appointmentStatus} · Transporte: {offer.transportStatus} · Recepción: {offer.receiptStatus}</p>{offer.receiptStatus === 'Pendiente' && offer.appointmentStatus === 'Aceptada' && <button className="button button-light" onClick={() => updateDemoState((current) => ({ ...current, offers: current.offers.map((item) => item.id === offer.id ? { ...item, transportStatus: 'En transporte' } : item) }))}>Marcar transporte</button>}</article>)}</div></section>;
}

function AgentInventory() {
  const state = useSyncExternalStore(subscribeDemoState, getDemoState, getDemoState);
  const rows = [...new Set(state.offers.filter((offer) => offer.receiptStatus === 'Confirmada').map((offer) => offer.product))].map((product) => [product, state.offers.filter((offer) => offer.product === product && offer.receiptStatus === 'Confirmada').reduce((sum, offer) => sum + offer.quantity, 0), state.offers.filter((offer) => offer.product === product && offer.receiptStatus === 'Confirmada').reduce((sum, offer) => sum + offer.quantity, 0), 0, 0] as (string | number)[]);
  return <section className="workspace-section"><p className="eyebrow">Agente · inventario de demostración</p><h2>Inventario por estado</h2><p>Solo las recepciones físicas confirmadas incrementan el stock demo. Las ofertas y citas aceptadas no lo hacen.</p><div className="table-wrap"><table className="workspace-table" aria-label="Inventario demostrativo"><thead><tr><th>Producto</th><th>Recibido</th><th>Disponible</th><th>Reservado</th><th>Despachado</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((value, index) => index === 0 ? <th scope="row" key={value}>{value}</th> : <td key={`${row[0]}-${index}`}>{value}</td>)}</tr>)}</tbody></table></div><p className="small-note">Solo datos ficticios en este navegador.</p></section>;
}

function Placeholder({ role, page }: { role: DemoRole; page: string }) {
  const label = roleNavigation[role].find((item) => item.path === page)?.label ?? 'Inicio';
  return <section className="workspace-section"><p className="eyebrow">{roleLabels[role]} · vista demostrativa</p><h2>{label}</h2><p>Esta vista presenta el alcance del rol sin ejecutar operaciones reales ni persistir cambios.</p><div className="notice">Los datos son ficticios y cualquier acción se limita al estado temporal del navegador.</div></section>;
}

export function RoleWorkspace() {
  const params = useParams();
  const location = useLocation();
  const role = params.role as DemoRole;
  const [resetMessage, setResetMessage] = useState('');
  if (!roles.includes(role)) return <Navigate to="/acceso" replace />;
  const page = location.pathname.split('/').filter(Boolean)[2] ?? '';
  const recovery = getRecoveryMessage();
  let content = page === '' ? <Dashboard role={role} /> : <Placeholder role={role} page={page} />;
  if (role === 'donante' && page === 'donaciones') content = <DonorDonations />;
  if (role === 'edil' && ['voluntariado', 'recepciones'].includes(page)) content = <EdilVolunteerEvents />;
  if (role === 'agente' && page === 'inventario') content = <AgentInventory />;
  if (role === 'administrador' && page === 'jornadas') content = <AdminVolunteerEvents />;

  return <div className="workspace-shell"><WorkspaceHeader role={role} page={page} /><main className="workspace-main"><div className="workspace-context"><span>Área de trabajo / {roleLabels[role]}</span><Link to="/acceso">Cambiar vista desde el acceso demo</Link><button type="button" onClick={() => { if (window.confirm('¿Restablecer todos los cambios locales y recuperar los datos ficticios iniciales? Esta acción no se puede deshacer.')) { resetDemoState(); setResetMessage('Se restablecieron los datos ficticios iniciales.'); } }}>Restablecer demo</button></div>{recovery && <p role="status">{recovery}</p>}{resetMessage && <p role="status">{resetMessage}</p>}<div className="demo-boundary">⚑ <strong>Modo demostración: no autentica.</strong> Datos ficticios y acciones locales; no hay servidor, disponibilidad, permisos ni logística real.</div>{content}</main></div>;
}
