import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Carousel } from '../components/Carousel';
import { ServiceDirectory } from '../features/services/ServiceDirectory';
import { RoleWorkspace } from '../features/roles/RoleWorkspace';
import { allies, serviceLocations } from '../features/services/data';
import '../styles/public.css';
import { getDemoState, selectDemoProfile, subscribeDemoState } from '../features/roles/demoStore';
import { useSyncExternalStore } from 'react';

function PublicNavigation() {
  const location = useLocation();
  return (
    <header className="public-header">
      <nav className="public-nav" aria-label="Navegación principal">
        <Link className="brand" to="/" aria-label="Alimenta, inicio"><span aria-hidden="true">A</span> Alimenta</Link>
        <div className="nav-links">
          <Link to="/" aria-current={location.pathname === '/' ? 'page' : undefined}>Inicio</Link>
          <Link to="/servicios" aria-current={location.pathname === '/servicios' ? 'page' : undefined}>Servicios comunitarios</Link>
        </div>
        <div className="nav-actions">
          <Link className="quiet-link" to="/acceso">Ingresar</Link>
          <Link className="button button-dark" to="/acceso">Quiero donar</Link>
        </div>
      </nav>
    </header>
  );
}

function LandingPage() {
  const [selected, setSelected] = useState(0);
  return (
    <main>
      <section className="welcome section-wrap" id="inicio">
        <div className="welcome-copy">
          <p className="eyebrow">Alimenta · Plataforma comunitaria</p>
          <h1>Donaciones coordinadas <em>hasta la recepción.</em></h1>
          <p>Conectamos aportes con necesidades comunitarias. El donante transporta; el receptor confirma lo recibido.</p>
          <div className="welcome-actions"><Link className="button button-dark" to="/servicios">Explorar servicios</Link><Link className="button button-light" to="/acceso">Quiero donar</Link></div>
          <p className="demo-note">Demostración local con información ficticia. No registra donaciones reales.</p>
        </div>
        <NeedPreview />
      </section>

      <section className="allies-section" id="aliados" aria-label="Organizaciones aliadas">
        <div className="section-wrap">
          <p className="eyebrow">Reconocimientos · datos ficticios</p>
          <div className="section-heading"><h2>Organizaciones aliadas</h2><p>Entidades de ejemplo destacadas por aportes confirmados en esta demostración.</p></div>
          <Carousel items={allies} selectedIndex={selected} onSelect={setSelected} />
          <div className="ally-list" aria-label="Listado de organizaciones aliadas">
            {allies.map((ally, index) => <div className="ally-row" key={ally.name}><span>{String(index + 1).padStart(2, '0')}</span><strong>{ally.name}</strong><small>{ally.confirmed} aportes de ejemplo</small></div>)}
          </div>
          <p className="small-note">Listado ilustrativo. No representa una clasificación real ni mide impacto social.</p>
        </div>
      </section>

      <section className="section-wrap process-section" id="funciones">
        <p className="eyebrow">Cómo funciona</p><h2>Un proceso claro, decisiones humanas.</h2>
        <div className="three-cards"><article><span>01</span><h3>La comunidad reporta</h3><p>Las necesidades se presentan de forma agregada y sin datos personales.</p></article><article><span>02</span><h3>El agente coordina</h3><p>La revisión y asignación requieren criterio humano.</p></article><article><span>03</span><h3>El donante aporta</h3><p>La recepción solo se considera confirmada cuando el destinatario la verifica.</p></article></div>
      </section>

      <section className="routes-section"><div className="section-wrap routes-grid"><div><p className="eyebrow eyebrow-light">Tres maneras de colaborar</p><h2>El aporte sigue el camino que la comunidad necesita.</h2><p>Estas rutas describen una propuesta; esta interfaz no agenda ni confirma entregas.</p></div><ul><li><strong>Necesidad publicada</strong><span>Apoyo dirigido a una solicitud demostrativa.</span></li><li><strong>Banco de donaciones</strong><span>Aporte que requiere recepción y verificación.</span></li><li><strong>Aporte a un edil</strong><span>Oferta comunitaria sujeta a aceptación.</span></li></ul></div></section>

      <section className="services-teaser section-wrap" id="servicios"><div><p className="eyebrow">Información pública</p><h2>Servicios comunitarios</h2><p>Consulta ejemplos de puntos comunitarios y sus horarios informativos.</p><Link className="button button-dark" to="/servicios">Ver directorio de servicios</Link></div><div className="service-teaser-list">{serviceLocations.slice(0, 2).map((service) => <article key={service.name}><span aria-hidden="true">⌖</span><div><strong>{service.name}</strong><p>{service.community} · horario ilustrativo</p></div></article>)}</div></section>

      <section className="faq-section"><div className="section-wrap"><p className="eyebrow">Preguntas frecuentes</p><h2>Una demostración, no un servicio operativo.</h2><details><summary>¿Los horarios y puntos están activos?</summary><p>No. Toda la información es ficticia y no indica disponibilidad real.</p></details><details><summary>¿Puedo confirmar una donación?</summary><p>No. Esta entrega solo cubre la experiencia pública; no hay backend ni registro de aportes.</p></details></div></section>
    </main>
  );
}

function NeedPreview() {
  return <aside className="need-preview" aria-label="Vista previa demostrativa de necesidad"><div className="browser-bar"><span aria-hidden="true">● ● ●</span><span>Exploración demostrativa</span></div><div className="need-preview-body"><p className="eyebrow">Necesidad ficticia · San Javier</p><h2>Mercados familiares</h2><p>Apoyo alimentario para hogares de la comunidad.</p><div className="balance"><strong>60 kits</strong><span>pendientes de confirmar</span></div><p className="small-note">Ejemplo estático. No permite comprometer ni reservar aportes.</p></div></aside>;
}

function AccessPage() {
  const roles = [
    ['donante', 'Donante', 'Explora necesidades y distingue cada etapa de una donación.'],
    ['edil', 'Edil', 'Representa una comunidad ficticia y programa jornadas para revisión.'],
    ['agente', 'Agente', 'Consulta evaluación, inventario y coordinación del banco.'],
    ['administrador', 'Administrador', 'Revisa servicios, representantes y jornadas demostrativas.'],
  ];
  const state = useSyncExternalStore(subscribeDemoState, getDemoState, getDemoState);
  const [message, setMessage] = useState('');
  return <main className="section-wrap access-page"><p className="eyebrow">Acceso y registro</p><h1>Acceso de demostración</h1><p>Elegí un perfil ficticio para continuar. Cambiar de perfil es solo una simulación: no autentica ni concede permisos.</p><label>Perfil de demostración<select aria-label="Perfil de demostración" value={state.selectedProfileId} onChange={(event) => { selectDemoProfile(event.target.value); setMessage('Perfil demostrativo seleccionado. Este cambio no autentica ni concede permisos.'); }}>{state.profiles.map((profile) => <option key={profile.id} value={profile.id}>{profile.name} · {profile.role}</option>)}</select></label>{message && <p role="status">{message}</p>}<div className="role-access-grid">{roles.map(([path, label, description]) => <article key={path}><h2>{label}</h2><p>{description}</p><Link className="button button-dark" to={`/demo/${path}`}>Abrir vista de {label}</Link></article>)}</div><Link className="button button-light" to="/">Volver al inicio</Link></main>;
}

export default function App() {
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/demo/');
  return <>{!isWorkspace && <PublicNavigation />}<Routes><Route path="/" element={<LandingPage />} /><Route path="/servicios" element={<ServiceDirectory />} /><Route path="/acceso" element={<AccessPage />} /><Route path="/demo/:role/*" element={<RoleWorkspace />} /><Route path="*" element={<Navigate to="/" replace />} /></Routes>{!isWorkspace && <footer className="site-footer"><span>Alimenta · Prototipo público</span><span>Demostración cliente · sin operaciones reales</span></footer>}</>;
}
