import { Link } from 'react-router-dom';
import { roleLabels } from '../features/roles/data';
import type { DemoRole } from '../features/roles/types';
import { useAuth } from '../contexts/AuthContext';

type WorkspaceHeaderProps = { role: DemoRole; page: string };

export function WorkspaceHeader({ role, page }: WorkspaceHeaderProps) {
  const { user } = useAuth();
  
  const profileName = user?.name || roleLabels[role] || role;
  
  return (
    <header className="workspace-header">
      <div className="workspace-header-inner">
        <Link className="brand workspace-brand" to="/" aria-label="Alimenta, volver a la portada">
          <span aria-hidden="true">A</span> Alimenta
        </Link>
        <nav className="workspace-tabs" aria-label={`Navegación de ${roleLabels[role]}`}>
          <Link to={`/${role}`} aria-current={page === '' ? 'page' : undefined}>
            Inicio
          </Link>
          {role === 'donante' && (
            <>
              <Link to={`/${role}/donaciones`} aria-current={page === 'donaciones' ? 'page' : undefined}>
                Donaciones
              </Link>
            </>
          )}
          {role === 'edil' && (
            <>
              <Link to={`/${role}/voluntariado`} aria-current={page === 'voluntariado' ? 'page' : undefined}>
                Jornadas
              </Link>
              <Link to={`/${role}/recepciones`} aria-current={page === 'recepciones' ? 'page' : undefined}>
                Recepciones
              </Link>
            </>
          )}
          {role === 'agente' && (
            <Link to={`/${role}/inventario`} aria-current={page === 'inventario' ? 'page' : undefined}>
              Inventario
            </Link>
          )}
          {role === 'administrador' && (
            <>
              <Link to={`/${role}/agente`} aria-current={page === 'agente' ? 'page' : undefined}>
                Dashboard
              </Link>
              <Link to={`/${role}/jornadas`} aria-current={page === 'jornadas' ? 'page' : undefined}>
                Jornadas
              </Link>
            </>
          )}
        </nav>
        <div className="workspace-actions">
          <span className="profile-name">{profileName}</span>
          {user && (
            <details className="workspace-options">
              <summary aria-label="Abrir opciones">⋯</summary>
              <div>
                <Link to="/">{user.role === 'administrador' ? 'Panel admin' : user.role === 'agente' ? 'Dashboard agente' : 'Mi área'}</Link>
                <button 
                  type="button" 
                  onClick={() => {
                    localStorage.removeItem('alimenta_token');
                    localStorage.removeItem('alimenta_user');
                    window.location.reload();
                  }}
                >
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