import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Carousel } from '../components/Carousel';
import { ServiceDirectory } from '../features/services/ServiceDirectory';
import { allies } from '../features/services/data';
import { LoginPage } from '../components/Auth/LoginPage';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';
import { AuthGate } from '../components/Auth/AuthGate';
import { RoleWorkspace } from '../features/roles/RoleWorkspace';
import '../styles/public.css';

function PublicNavigation() {
  const location = useLocation();
  return (
    <header className="public-header">
      <nav className="public-nav" aria-label="Navegación principal">
        <Link className="brand" to="/" aria-label="Alimenta, incio"><span aria-hidden="true">A</span> Alimenta</Link>
        <div className="nav-links">
          <Link to="/" aria-current={location.pathname === '/' ? 'page' : undefined}>Inicio</Link>
          <Link to="/servicios" aria-current={location.pathname === '/servicios' ? 'page' : undefined}>Servicios comunitarios</Link>
        </div>
        <div className="nav-actions">
          <Link className="quiet-link" to="/login">Acceder</Link>
          <Link className="button button-dark" to="/login">Donar</Link>
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
          <p>Conectamos aportes con necesidades comunitarias a través de criterios de ponderación social.</p>
          <div className="welcome-actions">
            <Link className="button button-dark" to="/servicios">Ver servicios</Link>
            <Link className="button button-light" to="/login">Donar</Link>
          </div>
          <p className="small-note">Conecta donantes, comunidades y el agente logístico para distribuir recursos equitativamente.</p>
        </div>
      </section>

      <section className="allies-section" id="aliados" aria-label="Organizaciones aliadas">
        <div className="section-wrap">
          <div className="section-heading">
            <h2>Nuestros aliados</h2>
            <p>Entidades comprometidas con la comunidad</p>
          </div>
          <Carousel items={allies} selectedIndex={selected} onSelect={setSelected} />
        </div>
      </section>

      <section className="section-wrap process-section" id="funciones">
        <p className="eyebrow">Cómo funciona</p>
        <h2>Un proceso basado en criterios, decisiones humanas.</h2>
        <div className="three-cards">
          <article>
            <span>01</span>
            <h3>La comunidad reporta</h3>
            <p>Las necesidades se presentan de forma agregada y con criterios de vulnerabilidad.</p>
          </article>
          <article>
            <span>02</span>
            <h3>El agente coordina</h3>
            <p>La revisión y asignación se ponderan mediante un gestor logístico basado en equidad, urgencia y eficiencia.</p>
          </article>
          <article>
            <span>03</span>
            <h3>El donante aporta</h3>
            <p>La recepción solo se considera confirmada cuando el destinatario la verifica.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default function App() {
  const location = useLocation();
  const isWorkspace = location.pathname.startsWith('/donante') || 
                      location.pathname.startsWith('/edil') ||
                      location.pathname.startsWith('/agente') ||
                      location.pathname.startsWith('/admin');
  const isLoginPage = location.pathname === '/login';
  
  return (
    <>
      {!isWorkspace && !isLoginPage && <PublicNavigation />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/servicios" element={<ServiceDirectory />} />
        <Route path="/login" element={
          <AuthGate>
            <LoginPage onLoginSuccess={() => {}} />
          </AuthGate>
        } />
        <Route path="/donante/*" element={
          <ProtectedRoute allowedRoles={['donante', 'administrador', 'agente', 'edil']}>
            <RoleWorkspace />
          </ProtectedRoute>
        } />
        <Route path="/edil/*" element={
          <ProtectedRoute allowedRoles={['edil', 'administrador']}>
            <RoleWorkspace />
          </ProtectedRoute>
        } />
        <Route path="/agente/*" element={
          <ProtectedRoute allowedRoles={['agente', 'administrador']}>
            <RoleWorkspace />
          </ProtectedRoute>
        } />
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={['administrador']}>
            <RoleWorkspace />
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isWorkspace && !isLoginPage && (
        <footer className="site-footer">
          <span>Alimenta · Plataforma comunitaria</span>
          <span>Conecta donantes con necesidades comunitarias</span>
        </footer>
      )}
    </>
  );
}