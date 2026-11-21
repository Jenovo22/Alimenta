import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export function DonorDonations() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchDonations();
  }, [user]);
  
  async function fetchDonations() {
    setLoading(true);
    try {
      const response = await fetch('/api/donations/');
      const result = await response.json();
      setDonations(result);
    } catch (e) {
      console.error('Error fetching donations:', e);
    } finally {
      setLoading(false);
    }
  }
  
  // Filter donations by current user as donor
  const userDonations = donations.filter(d => d.donor_id === parseInt(user?.id || '0'));
  
  return (
    <section className="workspace-section">
      <div className="workspace-title">
        <div>
          <p className="eyebrow">Donante · seguimiento</p>
          <h2>Mis donaciones</h2>
          <p>Estado de envíos y recepciones en tiempo real</p>
        </div>
      </div>
      
      {loading ? (
        <p>Cargando donaciones...</p>
      ) : userDonations.length === 0 ? (
        <p>No tienes donaciones registradas.</p>
      ) : (
        <div className="volunteer-grid">
          {userDonations.map((donation) => (
            <article className="volunteer-card" key={donation.id}>
              <h3>{donation.product || 'Donación #' + donation.id} · {donation.quantity}</h3>
              <p>Oferta: {donation.status}</p>
              <p>Cita: {donation.appointment_status}</p>
              <p>Transporte: {donation.transport_status}</p>
              <p>Recepción: {donation.receipt_status}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export function EdilVolunteerEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  useEffect(() => {
    fetchData();
  }, [user]);
  
  async function fetchData() {
    setLoading(true);
    try {
      const response = await fetch('/api/jornadas/');
      const result = await response.json();
      setEvents(result);
    } catch (e) {
      console.error('Error fetching events:', e);
    } finally {
      setLoading(false);
    }
  }
  
  // Filter events for current user's community
  const userEvents = events.filter(event => 
    event.account_id?.toString() === user?.id || 
    event.edil_id?.toString() === user?.id
  );
  
  return (
    <section className="workspace-section" aria-labelledby="volunteer-title">
      <div className="workspace-title">
        <div>
          <p className="eyebrow">Edil · jornadas de voluntariado</p>
          <h2 id="volunteer-title">Jornadas programadas</h2>
          <p>Estas jornadas son independientes de las citas de recepción de donaciones.</p>
        </div>
      </div>
      <div className="notice">Los registros nuevos requieren revisión administrativa antes de aparecer en el directorio público.</div>
      
      {loading ? (
        <p>Cargando jornadas...</p>
      ) : (
        <div className="volunteer-grid">
          {userEvents.length === 0 ? (
            <p className="empty-state">No tienes jornadas programadas.</p>
          ) : (
            userEvents.map((event) => (
              <article className="volunteer-card" key={event.id}>
                <h3>{event.type || event.event_type} · {event.date}</h3>
                <p>Fecha: {event.date}</p>
                <p>Hora: {event.start} - {event.end}</p>
                <p>Lugar: {event.venue}</p>
                <p>Voluntario: {event.volunteer || event.volunteer_name}</p>
                <p>Estatus: {event.status}</p>
              </article>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export function AgentInventory() {
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchInventory();
  }, []);
  
  async function fetchInventory() {
    setLoading(true);
    try {
      const response = await fetch('/api/inventory/');
      const result = await response.json();
      setInventory(result);
    } catch (e) {
      console.error('Error fetching inventory:', e);
    } finally {
      setLoading(false);
    }
  }
  
  return (
    <section className="workspace-section">
      <p className="eyebrow">Agente · inventario del banco</p>
      <h2>Inventario disponible</h2>
      {loading ? (
        <p>Cargando inventario...</p>
      ) : (
        <div className="table-wrap">
          <table className="workspace-table" aria-label="Inventario del banco">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Disponible</th>
                <th>Reservado</th>
                <th>Recibido</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id}>
                  <th scope="row">{item.product?.name || `ID: ${item.product_id}`}</th>
                  <td>{item.available_quantity}</td>
                  <td>{item.reserved_quantity}</td>
                  <td>{item.received_quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export function AdminVolunteerEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  async function fetchEvents() {
    setLoading(true);
    try {
      const response = await fetch('/api/jornadas/');
      const result = await response.json();
      setEvents(result);
    } catch (e) {
      console.error('Error fetching events:', e);
    } finally {
      setLoading(false);
    }
  }
  
  function moderate(id: number, status: string) {
    setMessage('Moderación guardada. Actualización en el servidor...');
    // In a real app, this would call the API
    console.log('Moderating event', id, 'to status', status);
  }
  
  return (
    <section className="workspace-section" aria-labelledby="moderation-title">
      <div className="workspace-title">
        <div>
          <p className="eyebrow">Administrador · revisión</p>
          <h2 id="moderation-title">Revisión de jornadas comunitarias</h2>
          <p>Visión completa del sistema con capacidad de coordinación.</p>
        </div>
      </div>
      
      {message && <p className="form-success" role="status">{message}</p>}
      
      {loading ? (
        <p>Cargando jornadas...</p>
      ) : (
        <div className="volunteer-grid">
          {events.length === 0 ? (
            <p className="empty-state">No hay jornadas registradas.</p>
          ) : (
            events.map((item) => (
              <article key={item.id} className="volunteer-card">
                <h3>{item.type || item.event_type}</h3>
                <p>Fecha: {item.date}</p>
                <p>Estatus: {item.status}</p>
                {item.status === 'Pendiente de revisión' && (
                  <div className="card-actions">
                    <button className="button button-dark" type="button" onClick={() => moderate(item.id, 'Publicada')}>
                      Aprobar publicación
                    </button>
                    <button className="button button-light" type="button" onClick={() => moderate(item.id, 'Rechazada')}>
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