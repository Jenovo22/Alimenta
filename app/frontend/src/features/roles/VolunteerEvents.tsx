import { useState, type FormEvent, type ReactNode } from 'react';
import { moderationEvents } from './data';
import type { VolunteerEvent } from './types';

function EventCard({ event, actions }: { event: VolunteerEvent; actions?: ReactNode }) {
  return <article className="volunteer-card">
    <div className="card-heading"><div><p className="eyebrow">{event.id}</p><h3>{event.type}</h3></div><span className={`status status-${event.status.startsWith('Rechazada') ? 'danger' : event.status.startsWith('Publicada') ? 'success' : 'pending'}`}>{event.status}</span></div>
    <dl><div><dt>Responsable público</dt><dd>{event.volunteer}</dd></div><div><dt>Lugar</dt><dd>{event.venue}</dd></div><div><dt>Horario</dt><dd>{event.date} · {event.start}–{event.end}</dd></div></dl>
    {actions && <div className="card-actions">{actions}</div>}
  </article>;
}

export function EdilVolunteerEvents() {
  const [events, setEvents] = useState<VolunteerEvent[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const required = ['volunteer', 'venue', 'date', 'start', 'end'];
    if (required.some((field) => !String(values.get(field) ?? '').trim()) || !values.get('authorized')) {
      setError('Completa los campos obligatorios y confirma la autorización de publicación.');
      setMessage('');
      return;
    }
    if (String(values.get('end')) <= String(values.get('start'))) {
      setError('La hora de finalización debe ser posterior a la hora de inicio.');
      setMessage('');
      return;
    }
    const created: VolunteerEvent = {
      id: `JV-LOCAL-${events.length + 1}`,
      type: String(values.get('type')),
      volunteer: String(values.get('volunteer')),
      venue: String(values.get('venue')),
      date: String(values.get('date')),
      start: String(values.get('start')),
      end: String(values.get('end')),
      status: 'Pendiente de revisión',
    };
    setEvents((current) => [created, ...current]);
    setError('');
    setMessage('Jornada guardada solo en esta sesión como Pendiente de revisión. No se envió a un servidor ni genera reservas.');
    form.reset();
  }

  return <section className="workspace-section" aria-labelledby="volunteer-title">
    <div className="workspace-title"><div><p className="eyebrow">Edil · comunidad ficticia</p><h2 id="volunteer-title">Jornadas de voluntariado</h2><p>Estas jornadas son independientes de las citas de recepción de donaciones.</p></div></div>
    <div className="notice">Los registros nuevos requieren revisión administrativa antes de aparecer en el directorio público.</div>
    <div className="volunteer-layout">
      <form className="workspace-form" onSubmit={submit} noValidate>
        <h3>Programar una jornada</h3>
        {error && <p className="form-error" role="alert">{error}</p>}
        {message && <p className="form-success" role="status">{message}</p>}
        <label>Tipo de actividad<select name="type" defaultValue="Atención psicológica"><option>Atención psicológica</option><option>Jornada de vacunación</option><option>Atención médica</option><option>Otra actividad</option></select></label>
        <label>Nombre del voluntario responsable<input name="volunteer" /></label>
        <label>Lugar público autorizado<input name="venue" aria-describedby="venue-help" /></label><small id="venue-help">No incluyas domicilios particulares ni datos de beneficiarios.</small>
        <div className="form-row"><label>Fecha programada<input name="date" type="date" /></label><label>Hora de inicio<input name="start" type="time" /></label><label>Hora de finalización<input name="end" type="time" /></label></div>
        <label className="check-field"><input name="authorized" type="checkbox" /> Confirmo que puedo divulgar el nombre del responsable y el lugar público.</label>
        <button className="button button-dark" type="submit">Registrar jornada</button>
      </form>
      <div className="volunteer-list"><h3>Agenda local de esta sesión</h3>{events.length ? events.map((item) => <EventCard event={item} key={item.id} />) : <p className="empty-state">Todavía no registraste jornadas en esta sesión.</p>}</div>
    </div>
  </section>;
}

export function AdminVolunteerEvents() {
  const [events, setEvents] = useState(moderationEvents);
  const [message, setMessage] = useState('');
  function moderate(id: string, status: VolunteerEvent['status']) {
    setEvents((current) => current.map((item) => item.id === id ? { ...item, status } : item));
    setMessage(status.startsWith('Publicada')
      ? 'Jornada publicada solo en esta demostración. No se guardó en un servidor y se perderá al recargar.'
      : 'Jornada rechazada solo en esta demostración. No se notificó a ninguna persona real.');
  }
  return <section className="workspace-section" aria-labelledby="moderation-title">
    <div className="workspace-title"><div><p className="eyebrow">Administración · revisión local</p><h2 id="moderation-title">Revisión de jornadas comunitarias</h2><p>La interfaz no comprueba credenciales profesionales, permisos sanitarios ni consentimientos reales.</p></div></div>
    {message && <p className="form-success" role="status">{message}</p>}
    <div className="volunteer-grid">{events.map((item) => <EventCard key={item.id} event={item} actions={item.status === 'Pendiente de revisión' ? <><button className="button button-dark" type="button" onClick={() => moderate(item.id, 'Publicada (demo)')}>Aprobar publicación</button><button className="button button-light" type="button" onClick={() => moderate(item.id, 'Rechazada (demo)')}>Rechazar jornada</button></> : undefined} />)}</div>
  </section>;
}
