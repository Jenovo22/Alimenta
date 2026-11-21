import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Carousel, type FeaturedAlly } from '../components/Carousel';
import { ServiceDirectory } from '../features/services/ServiceDirectory';
import { fallbackAllies } from '../features/services/data';
import { LoginPage } from '../components/Auth/LoginPage';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';
import { AuthGate } from '../components/Auth/AuthGate';
import { AuthProvider } from '../contexts/AuthContext';
import { RoleWorkspace } from '../features/roles/RoleWorkspace';
import '../styles/public.css';

function PublicNavigation() {
  const location = useLocation();
  return (
    <header className="public-header">
      <nav className="public-nav" aria-label="Navegación principal">
        <Link className="brand" to="/" aria-label="Alimenta, inicio"><img src="/alimenta-isotipo.svg" alt="" className="brand-logo" width={32} height={32} aria-hidden="true" /> Alimenta</Link>
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
  const [allies, setAllies] = useState<FeaturedAlly[]>(fallbackAllies);

  useEffect(() => {
    let active = true;
    fetch('/api/organizations/top10')
      .then((res) => (res.ok ? res.json() : []))
      .then((orgs: Array<{ id: number; name: string; description?: string; rank_position?: number; is_verified?: boolean }>) => {
        if (!active || !Array.isArray(orgs) || orgs.length === 0) return;
        setAllies(
          orgs.map((org) => ({
            id: org.id,
            name: org.name,
            rank: org.rank_position,
            verified: org.is_verified,
            description: org.description || 'Organización aliada de la red Alimenta.',
          })),
        );
      })
      .catch(() => {
        // Keep fallback list if offline
      });
    return () => {
      active = false;
    };
  }, []);

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

      <section className="sponsor-banner-wrap section-wrap" aria-label="Espacio publicitario demostrativo">
        <div className="sponsor-banner">
          <div className="sponsor-banner-copy">
            <div className="sponsor-badges">
              <span className="sponsor-pill">Publicidad ficticia · Demo</span>
              <span className="sponsor-tag">Padrino institucional de ejemplo</span>
            </div>
            <h2>Mercados del Eje S.A.S. — Aliados por Manizales sin desperdicio</h2>
          </div>
          <div className="sponsor-logo-slot" aria-label="Espacio de logo demostrativo">
            <span>LOGO DEMO</span>
            <small>Espacio de marca</small>
          </div>
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
    <AuthProvider>
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
    </AuthProvider>
  );
}
