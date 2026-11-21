import { useEffect, useState } from 'react';
import { AgentLogistics } from './AgentLogistics';
import { AgentInventory } from './RoleComponents';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalDonations: 0,
    acceptedDonations: 0,
    inTransit: 0,
    confirmed: 0,
    pending: 0,
    activeUsers: 0,
    communities: 0,
    openNeeds: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [donationsRes, usersRes, commRes, needsRes] = await Promise.all([
          fetch('/api/donations/'),
          fetch('/api/users'),
          fetch('/api/communities'),
          fetch('/api/needs'),
        ]);

        const donationsData = donationsRes.ok ? await donationsRes.json() : [];
        const usersData = usersRes.ok ? await usersRes.json() : [];
        const commData = commRes.ok ? await commRes.json() : [];
        const needsData = needsRes.ok ? await needsRes.json() : [];

        setStats({
          totalDonations: donationsData.length,
          acceptedDonations: donationsData.filter((d: { appointment_status: string }) => d.appointment_status === 'Aceptada').length,
          inTransit: donationsData.filter((d: { transport_status: string }) => d.transport_status === 'En transporte').length,
          confirmed: donationsData.filter((d: { receipt_status: string }) => d.receipt_status === 'Confirmada').length,
          pending: donationsData.filter((d: { appointment_status: string }) => d.appointment_status === 'Pendiente de aceptación').length,
          activeUsers: usersData.filter((u: { is_active: boolean }) => u.is_active).length,
          communities: commData.length,
          openNeeds: needsData.filter((n: { is_satisfied: boolean }) => !n.is_satisfied).length,
        });
      } catch (e) {
        console.error('Error cargando estadísticas:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <section className="workspace-section">
      <p className="eyebrow">Administrador · panel de control</p>
      <h2>Resumen general de la plataforma</h2>

      {loading ? (
        <p>Cargando estadísticas...</p>
      ) : (
        <div className="metric-grid metric-grid-4">
          <article>
            <strong>{stats.totalDonations}</strong>
            <span>Donaciones totales</span>
            <small>{stats.pending} pendientes · {stats.acceptedDonations} aceptadas</small>
          </article>
          <article>
            <strong>{stats.inTransit}</strong>
            <span>En transporte</span>
            <small>{stats.confirmed} confirmadas</small>
          </article>
          <article>
            <strong>{stats.openNeeds}</strong>
            <span>Necesidades abiertas</span>
            <small>En {stats.communities} comunidades</small>
          </article>
          <article>
            <strong>{stats.activeUsers}</strong>
            <span>Usuarios activos</span>
            <small>Cuentas habilitadas en la red</small>
          </article>
        </div>
      )}

      <AgentLogistics allowWeightEdit />
      <AgentInventory />
    </section>
  );
}
