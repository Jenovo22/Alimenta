import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { WorkspaceHeader } from '../../components/WorkspaceHeader';
import { useAuth } from '../../contexts/AuthContext';
import {
  DonorDonations,
  DonorNeeds,
  EdilNeeds,
  EdilReceptions,
  EdilVolunteerEvents,
  AgentInventory,
  AdminVolunteerEvents,
  AdminUsers,
} from './RoleComponents';
import { AgentLogistics } from './AgentLogistics';
import { AdminDashboard } from './AdminDashboard';
import { roleBasePath, roleLabels } from './data';
import type { UserRole } from './types';
import '../../styles/workspace.css';

const roles: UserRole[] = ['donante', 'edil', 'agente', 'administrador'];

function RoleSummaryDashboard({ role }: { role: UserRole }) {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Array<{ value: number | string; label: string; detail: string }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function loadSummary() {
      setLoading(true);
      try {
        const [dRes, nRes, evRes, invRes, uRes] = await Promise.all([
          fetch('/api/donations/'),
          fetch('/api/needs'),
          fetch('/api/volunteer-events'),
          fetch('/api/inventory/summary'),
          fetch('/api/users'),
        ]);
        const donations = dRes.ok ? await dRes.json() : [];
        const needs = nRes.ok ? await nRes.json() : [];
        const events = evRes.ok ? await evRes.json() : [];
        const inv = invRes.ok ? await invRes.json() : { items: [] };
        const users = uRes.ok ? await uRes.json() : [];

        if (!active) return;

        const userId = Number(user?.id || 0);
        if (role === 'donante') {
          const mine = donations.filter((d: { donor_id: number }) => d.donor_id === userId);
          const confirmed = mine.filter((d: { receipt_status: string }) => d.receipt_status === 'Confirmada').length;
          const openNeeds = needs.filter((n: { is_satisfied: boolean }) => !n.is_satisfied).length;
          setMetrics([
            { value: mine.length, label: 'Mis donaciones', detail: 'Aportes registrados en la plataforma' },
            { value: confirmed, label: 'Entregas confirmadas', detail: 'Verificadas por la comunidad receptora' },
            { value: openNeeds, label: 'Necesidades abiertas', detail: 'Solicitudes comunitarias por cubrir' },
          ]);
        } else if (role === 'edil') {
          const toReceive = donations.filter((d: { edil_id: number | null; receipt_status: string }) => d.edil_id === userId && d.receipt_status !== 'Confirmada').length;
          const openNeeds = needs.filter((n: { is_satisfied: boolean }) => !n.is_satisfied).length;
          setMetrics([
            { value: toReceive, label: 'Recepciones pendientes', detail: 'Entregas por confirmar en tu comunidad' },
            { value: openNeeds, label: 'Necesidades activas', detail: 'Solicitudes publicadas' },
            { value: events.length, label: 'Jornadas registradas', detail: 'Actividades de voluntariado' },
          ]);
        } else {
          const totalStock = (inv.items || []).reduce((acc: number, i: { available_quantity: number }) => acc + (i.available_quantity || 0), 0);
          setMetrics([
            { value: donations.length, label: 'Donaciones registradas', detail: 'Sincronizadas en tiempo real' },
            { value: totalStock, label: 'Unidades en inventario', detail: `${(inv.items || []).length} productos en bodega` },
            { value: users.length, label: 'Usuarios activos', detail: `${events.length} jornadas registradas` },
          ]);
        }
      } catch (e) {
        console.error('Error cargando resumen:', e);
      } finally {
        if (active) setLoading(false);
      }
    }
    loadSummary();
    return () => {
      active = false;
    };
  }, [role, user?.id]);

  const basePath = roleBasePath[role];

  return (
    <section className="workspace-section">
      <p className="eyebrow">Bienvenido · {roleLabels[role]}</p>
      <h2>Panel de {roleLabels[role]}</h2>
      <p>Información operativa sincronizada en tiempo real con la base de datos de Alimenta.</p>

      {loading ? (
        <p>Cargando indicadores...</p>
      ) : (
        <div className="metric-grid">
          {metrics.map((m) => (
            <article key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
              <small>{m.detail}</small>
            </article>
          ))}
        </div>
      )}

      <div className="quick-links-bar">
        {role === 'donante' && (
          <>
            <Link className="button button-dark" to={`${basePath}/donaciones`}>Gestionar mis donaciones</Link>
            <Link className="button button-light" to={`${basePath}/necesidades`}>Ver necesidades activas</Link>
          </>
        )}
        {role === 'edil' && (
          <>
            <Link className="button button-dark" to={`${basePath}/recepciones`}>Confirmar recepciones</Link>
            <Link className="button button-light" to={`${basePath}/solicitudes`}>Publicar necesidad</Link>
            <Link className="button button-light" to={`${basePath}/voluntariado`}>Programar jornada</Link>
          </>
        )}
        {role === 'administrador' && (
          <>
            <Link className="button button-dark" to={`${basePath}/agente`}>Abrir centro logístico y agente</Link>
            <Link className="button button-light" to={`${basePath}/jornadas`}>Moderar jornadas</Link>
            <Link className="button button-light" to={`${basePath}/usuarios`}>Ver usuarios</Link>
          </>
        )}
      </div>
    </section>
  );
}

export function RoleWorkspace() {
  const params = useParams();
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);
  const pathRole = segments[0] === 'admin' ? 'administrador' : segments[0];
  const role = (params.role ?? pathRole) as UserRole;
  const { user, token } = useAuth();

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  const page = segments[1] ?? '';

  let content: React.ReactNode = <RoleSummaryDashboard role={role} />;

  if (role === 'agente') {
    content = page === 'inventario' ? <AgentInventory /> : <AgentLogistics allowWeightEdit />;
  } else if (role === 'donante') {
    if (page === 'donaciones') content = <DonorDonations />;
    else if (page === 'necesidades') content = <DonorNeeds />;
  } else if (role === 'edil') {
    if (page === 'voluntariado') content = <EdilVolunteerEvents />;
    else if (page === 'recepciones') content = <EdilReceptions />;
    else if (page === 'solicitudes') content = <EdilNeeds />;
  } else if (role === 'administrador') {
    if (page === 'agente') content = <AdminDashboard />;
    else if (page === 'jornadas') content = <AdminVolunteerEvents />;
    else if (page === 'usuarios') content = <AdminUsers />;
  }

  return (
    <div className="workspace-shell">
      <WorkspaceHeader role={role} page={page} />
      <main className="workspace-main">
        <div className="workspace-context">
          <span>Área de trabajo / {roleLabels[role]}</span>
          <span>{user.name} · {user.email}</span>
        </div>
        {content}
      </main>
    </div>
  );
}
