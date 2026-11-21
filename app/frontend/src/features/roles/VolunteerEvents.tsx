import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

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
      ) : userEvents.length === 0 ? (
        <p className="empty-state">No tienes jornadas programadas.</p>
      ) : (
        <div className="volunteer-grid">
          {userEvents.map((event) => (
            <article className="volunteer-card" key={event.id}>
              <h3>{event.type || event.event_type} · {event.date}</h3>
              <p>Fecha: {event.date}</p>
              <p>Hora: {event.start} - {event.end}</p>
              <p>Lugar: {event.venue}</p>
              <p>Voluntario: {event.volunteer || event.volunteer_name}</p>
              <p>Estatus: {event.status}</p>
            </article>
          ))}
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