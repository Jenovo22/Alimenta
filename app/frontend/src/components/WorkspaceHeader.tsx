import { Link, useNavigate } from 'react-router-dom';
import { roleLabels, roleNavigation } from '../features/roles/data';
import type { DemoRole } from '../features/roles/types';

type WorkspaceHeaderProps = { role: DemoRole; page: string };

export function WorkspaceHeader({ role, page }: WorkspaceHeaderProps) {
  const base = `/demo/${role}`;
  const navigate = useNavigate();
  return <header className="workspace-header">
    <div className="workspace-header-inner">
      <Link className="brand workspace-brand" to="/" aria-label="Alimenta, volver a la portada"><span aria-hidden="true">A</span> Alimenta</Link>
      <nav className="workspace-tabs" aria-label={`Navegación de ${roleLabels[role]}`}>
        {roleNavigation[role].map((item) => {
          const active = item.path === page;
          return <Link key={item.label} to={item.path ? `${base}/${item.path}` : base} aria-current={active ? 'page' : undefined}>{item.label}</Link>;
        })}
      </nav>
      <div className="workspace-actions">
        <label>Vista demo
          <select value={role} onChange={(event) => navigate(`/demo/${event.target.value}`)} aria-label="Cambiar vista de rol en la demostración">
            {Object.entries(roleLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}
          </select>
        </label>
        <details className="workspace-options"><summary aria-label="Abrir opciones de la demostración">⋯</summary><div><Link to="/">Portada pública</Link><Link to="/acceso">Acceso de demostración</Link></div></details>
      </div>
    </div>
  </header>;
}
