import { Link, useNavigate } from 'react-router-dom';
import { roleLabels, roleNavigation } from '../features/roles/data';
import type { DemoRole } from '../features/roles/types';
import { getDemoState, selectDemoProfile, subscribeDemoState } from '../features/roles/demoStore';
import { useSyncExternalStore } from 'react';

type WorkspaceHeaderProps = { role: DemoRole; page: string };

export function WorkspaceHeader({ role, page }: WorkspaceHeaderProps) {
  const base = `/demo/${role}`;
  const navigate = useNavigate();
  const state = useSyncExternalStore(subscribeDemoState, getDemoState, getDemoState);
  const profile = state.profiles.find((item) => item.role === role)!;
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
          <select value={profile.id} onChange={(event) => { const selected = state.profiles.find((item) => item.id === event.target.value)!; selectDemoProfile(selected.id); navigate(`/demo/${selected.role}`); }} aria-label="Cambiar vista de rol en la demostración">
            {state.profiles.map((item) => <option value={item.id} key={item.id}>{item.name} · {roleLabels[item.role]}</option>)}
          </select>
        </label>
        <details className="workspace-options"><summary aria-label="Abrir opciones de la demostración">⋯</summary><div><Link to="/">Portada pública</Link><Link to="/acceso">Acceso de demostración</Link></div></details>
      </div>
    </div>
  </header>;
}
