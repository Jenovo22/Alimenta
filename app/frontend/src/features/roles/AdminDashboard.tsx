import { useState, useEffect } from 'react';
import { AgentInventory } from './RoleComponents';

export function AdminDashboard() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchData();
  }, []);
  
  async function fetchData() {
    setLoading(true);
    try {
      const [donationsRes, usersRes] = await Promise.all([
        fetch('/api/donations/'),
        fetch('/api/users/')
      ]);
      
      const donationsData = await donationsRes.json();
      const usersData = await usersRes.json();
      
      // Calculate stats
      const totalDonations = donationsData.length;
      const acceptedDonations = donationsData.filter((d: any) => d.appointment_status === 'Aceptada').length;
      const inTransit = donationsData.filter((d: any) => d.transport_status === 'En transporte').length;
      const confirmed = donationsData.filter((d: any) => d.receipt_status === 'Confirmada').length;
      const pending = donationsData.filter((d: any) => d.appointment_status === 'Pendiente de aceptación').length;
      const rejected = donationsData.filter((d: any) => d.status === 'Rechazada').length;
      
      setStats({
        totalDonations,
        acceptedDonations,
        inTransit,
        confirmed,
        pending,
        rejected,
        activeUsers: usersData.filter((u: any) => u.is_active).length
      });
    } catch (e) {
      console.error('Error fetching data:', e);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <section className="workspace-section">
      <p className="eyebrow">Administrador · panel de control</p>
      <h2>Resumen de la plataforma</h2>
      
      {loading ? (
        <p>Cargando estadísticas...</p>
      ) : (
        <>
          <div className="metric-grid">
            <article>
              <strong>Donaciones totales</strong>
              <span>{stats.totalDonations}</span>
            </article>
            <article>
              <strong>Pendientes</strong>
              <span>{stats.pending}</span>
            </article>
            <article>
              <strong>Aceptadas</strong>
              <span>{stats.acceptedDonations}</span>
            </article>
            <article>
              <strong>En tránsito</strong>
              <span>{stats.inTransit}</span>
            </article>
            <article>
              <strong>Confirmadas</strong>
              <span>{stats.confirmed}</span>
            </article>
            <article>
              <strong>Rechazadas</strong>
              <span>{stats.rejected}</span>
            </article>
            <article>
              <strong>Usuarios activos</strong>
              <span>{stats.activeUsers}</span>
            </article>
          </div>
          
          <div className="agent-section">
            <h3>Gestor Logístico - Análisis de donaciones</h3>
            <p>El agente pondera donaciones usando: equidad comunitaria (30%), urgencia (25%), eficiencia logística (25%), impacto social (20%)</p>
            <AgentInventory />
          </div>
        </>
      )}
    </section>
  );
}