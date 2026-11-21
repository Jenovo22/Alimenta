import { useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { WorkspaceHeader } from '../../components/WorkspaceHeader';
import { roleLabels, roleNavigation } from './data';
import { AdminVolunteerEvents, EdilVolunteerEvents } from './VolunteerEvents';
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
  const [message, setMessage] = useState('');
  const states = [
    ['Intención registrada', 'El aporte fue expresado; todavía no reserva saldo ni cupo.'],
    ['Cita pendiente de aceptación', 'El edil aún debe aceptar el horario propuesto.'],
    ['En transporte', 'La salida fue indicada en la demo; aún no existe recepción.'],
    ['Recepción confirmada', 'Solo esta etapa representaría una cantidad efectivamente verificada.'],
  ];
  return <section className="workspace-section"><div className="workspace-title"><div><p className="eyebrow">Donante · seguimiento</p><h2>Mis donaciones de demostración</h2><p>Compromiso, cita, despacho y recepción son estados distintos.</p></div><button className="button button-dark" type="button" onClick={() => setMessage('Intención guardada solo en este navegador. No confirma una recepción, no reserva inventario y se perderá al recargar.')}>Registrar intención</button></div>{message && <p className="form-success" role="status">{message}</p>}<ol className="state-timeline">{states.map(([title, description], index) => <li key={title}><span>{index + 1}</span><div><strong>{title}</strong><p>{description}</p></div></li>)}</ol></section>;
}

function AgentInventory() {
  const rows = [
    ['Mercados familiares', 58, 18, 8, 4],
    ['Kits de higiene', 12, 7, 3, 2],
  ];
  return <section className="workspace-section"><p className="eyebrow">Agente · banco de donaciones</p><h2>Inventario por estado</h2><p>Una promesa no aumenta lo disponible. Solo un ingreso físicamente recibido y verificado puede hacerlo.</p><div className="table-wrap"><table className="workspace-table" aria-label="Inventario demostrativo"><thead><tr><th>Producto</th><th>Recibido</th><th>Disponible</th><th>Reservado</th><th>Despachado</th></tr></thead><tbody>{rows.map((row) => <tr key={row[0]}>{row.map((value, index) => index === 0 ? <th scope="row" key={value}>{value}</th> : <td key={`${row[0]}-${index}`}>{value}</td>)}</tr>)}</tbody></table></div><p className="small-note">Cantidades ficticias. Recibido es histórico; disponible, reservado y despachado no deben sumarse entre sí.</p></section>;
}

function Placeholder({ role, page }: { role: DemoRole; page: string }) {
  const label = roleNavigation[role].find((item) => item.path === page)?.label ?? 'Inicio';
  return <section className="workspace-section"><p className="eyebrow">{roleLabels[role]} · vista demostrativa</p><h2>{label}</h2><p>Esta vista presenta el alcance del rol sin ejecutar operaciones reales ni persistir cambios.</p><div className="notice">Los datos son ficticios y cualquier acción se limita al estado temporal del navegador.</div></section>;
}

export function RoleWorkspace() {
  const params = useParams();
  const location = useLocation();
  const role = params.role as DemoRole;
  if (!roles.includes(role)) return <Navigate to="/acceso" replace />;
  const page = location.pathname.split('/').filter(Boolean)[2] ?? '';
  let content = page === '' ? <Dashboard role={role} /> : <Placeholder role={role} page={page} />;
  if (role === 'donante' && page === 'donaciones') content = <DonorDonations />;
  if (role === 'edil' && page === 'voluntariado') content = <EdilVolunteerEvents />;
  if (role === 'agente' && page === 'inventario') content = <AgentInventory />;
  if (role === 'administrador' && page === 'jornadas') content = <AdminVolunteerEvents />;

  return <div className="workspace-shell"><WorkspaceHeader role={role} page={page} /><main className="workspace-main"><div className="workspace-context"><span>Área de trabajo / {roleLabels[role]}</span><Link to="/acceso">Cambiar vista desde el acceso demo</Link></div><div className="demo-boundary">⚑ <strong>Modo demostración: no autentica.</strong> Datos ficticios y acciones locales; no hay servidor, disponibilidad, permisos ni logística real.</div>{content}</main></div>;
}
