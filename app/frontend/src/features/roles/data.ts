import type { UserRole } from './types';

export const roleLabels: Record<UserRole, string> = {
  donante: 'Donante',
  edil: 'Edil comunitario',
  agente: 'Agente logístico',
  administrador: 'Administrador',
};

export const roleBasePath: Record<UserRole, string> = {
  donante: '/donante',
  edil: '/edil',
  agente: '/agente',
  administrador: '/admin',
};

export const roleNavigation: Record<UserRole, Array<{ path: string; label: string }>> = {
  donante: [
    { path: '', label: 'Resumen' },
    { path: 'donaciones', label: 'Mis donaciones' },
    { path: 'necesidades', label: 'Necesidades' },
  ],
  edil: [
    { path: '', label: 'Resumen' },
    { path: 'recepciones', label: 'Recepciones' },
    { path: 'solicitudes', label: 'Solicitudes' },
    { path: 'voluntariado', label: 'Jornadas' },
  ],
  agente: [
    { path: '', label: 'Centro logístico' },
    { path: 'inventario', label: 'Inventario y asignaciones' },
  ],
  administrador: [
    { path: '', label: 'Resumen' },
    { path: 'agente', label: 'Logística y agente' },
    { path: 'jornadas', label: 'Jornadas' },
    { path: 'usuarios', label: 'Usuarios' },
  ],
};
