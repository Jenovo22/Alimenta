import { Link, useNavigate } from 'react-router-dom';
import { roleBasePath, roleLabels, roleNavigation } from '../features/roles/data';
import type { UserRole } from '../features/roles/types';
import { useAuth } from '../contexts/AuthContext';

type WorkspaceHeaderProps = { role: UserRole; page: string };

export function WorkspaceHeader({ role, page }: WorkspaceHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const profileName = user?.name || roleLabels[role] || role;
  const basePath = roleBasePath[role];
  const tabs = roleNavigation[role] ?? [];

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="workspace-header">
      <div className="workspace-header-inner">
        <Link className="brand workspace-brand" to="/" aria-label="Alimenta, volver a la portada">
          <img src="/alimenta-isotipo.svg" alt="" className="brand-logo" width={32} height={32} aria-hidden="true" /> Alimenta
        </Link>
        <nav className="workspace-tabs" aria-label={`Navegación de ${roleLabels[role]}`}>
          {tabs.map((tab) => {
            const target = tab.path ? `${basePath}/${tab.path}` : basePath;
            return (
              <Link key={tab.path || 'home'} to={target} aria-current={page === tab.path ? 'page' : undefined}>
                {tab.label}
              </Link>
            );
          })}
        </nav>
        <div className="workspace-actions">
          <span className="profile-name">{profileName}</span>
          {user && (
            <details className="workspace-options">
              <summary aria-label="Abrir opciones">⋯</summary>
              <div>
                <Link to="/servicios">Directorio y mapa</Link>
                {user.role === 'administrador' && (
                  <>
                    <Link to="/agente">Vista de agente</Link>
                    <Link to="/edil">Vista de edil</Link>
                    <Link to="/donante">Vista de donante</Link>
                  </>
                )}
                <button type="button" className="workspace-logout-btn" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </div>
            </details>
          )}
        </div>
      </div>
    </header>
  );
}
