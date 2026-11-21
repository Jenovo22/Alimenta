import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router-dom';
import { WorkspaceHeader } from '../../components/WorkspaceHeader';
import { useAuth } from '../../contexts/AuthContext';
import { DonorDonations, EdilVolunteerEvents, AgentInventory, AdminVolunteerEvents } from './RoleComponents';
import { AdminDashboard } from './AdminDashboard';
import type { DemoRole } from './types';
import '../../styles/workspace.css';

const roles: DemoRole[] = ['donante', 'edil', 'agente', 'administrador'];

function Dashboard({ role }: { role: DemoRole }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, [role]);
  
  async function fetchData() {
    setLoading(true);
    try {
      const endpoints: Record<DemoRole, string> = {
        donante: '/api/donations/',
        edil: '/api/jornadas/',
        agente: '/api/inventory/',
        administrador: '/api/donations/'
      };
      const response = await fetch(endpoints[role] || '/api/donations/');
      const result = await response.json();
      setData(result);
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setLoading(false);
    }
  }
  
  const summaries: Record<DemoRole, string[]> = {
    donante: ['Mis donaciones', 'Estado de envíos', 'Comunidades atendidas'],
    edil: ['Jornadas programadas', 'Donaciones recibidas', 'Voluntariados coordinados'],
    agente: ['Inventario del banco', 'Donaciones pendientes', 'Asignaciones pendientes'],
    administrador: ['Todas las donaciones', 'Usuarios activos', 'Sistema completo']
  };
  
  const formatRoleName = (r: string): string => {
    return r.charAt(0).toUpperCase() + r.slice(1);
  };
  
  if (loading) {
    return (
      <section className="workspace-section">
        <p className="eyebrow">Cargando datos</p>
        <h2>Área de {formatRoleName(role)}</h2>
        <p>Cargando información de la plataforma...</p>
      </section>
    );
  }
  
  return (
    <section className="workspace-section">
      <p className="eyebrow">Bienvenido</p>
      <h2>Área de {formatRoleName(role)}</h2>
      <p>Datos sincronizados con el backend en tiempo real.</p>
      <div className="metric-grid">
        {summaries[role].map((label, index) => (
          <article key={label}>
            <strong>{index + 1}</strong>
            <span>{label}</span>
            <small>{Array.isArray(data) ? data.length : 'Datos cargados'}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export function RoleWorkspace() {
  const params = useParams();
  const location = useLocation();
  const role = params.role as DemoRole;
  const { user, token } = useAuth();
  
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  
  const page = location.pathname.split('/').filter(Boolean)[2] ?? '';
  
  let content = page === '' ? <Dashboard role={role} /> : null;
  
  // Role-specific components
  if (role === 'donante' && page === 'donaciones') {
    content = <DonorDonations />;
  }
  if (role === 'edil' && ['voluntariado', 'recepciones'].includes(page)) {
    content = <EdilVolunteerEvents />;
  }
  if (role === 'agente' && page === 'inventario') {
    content = <AgentInventory />;
  }
  if (role === 'administrador' && page === 'agente') {
    content = <AdminDashboard />;
  }
  if (role === 'administrador' && ['jornadas', 'usuarios'].includes(page)) {
    content = <AdminVolunteerEvents />;
  }
  
  const formatRoleName = (r: string): string => {
    return r.charAt(0).toUpperCase() + r.slice(1);
  };
  
  return (
    <div className="workspace-shell">
      <WorkspaceHeader role={role} page={page} />
      <main className="workspace-main">
        <div className="workspace-context">
          <span>Área de trabajo / {formatRoleName(role)}</span>
          {user && (
            <>
              <Link to="/">{user.name}</Link>
            </>
          )}
        </div>
        <div className="live-data">
          <strong>Conectado al backend</strong> - Datos en tiempo real desde la base de datos
        </div>
        {content}
      </main>
    </div>
  );
}