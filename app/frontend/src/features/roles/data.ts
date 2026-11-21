import type { DemoRole, VolunteerEvent } from './types';

export const roleLabels: Record<DemoRole, string> = {
  donante: 'Donante',
  edil: 'Edil',
  agente: 'Agente',
  administrador: 'Administrador',
};

export const roleNavigation: Record<DemoRole, Array<{ path: string; label: string }>> = {
  donante: [
    { path: '', label: 'Inicio' }, { path: 'necesidades', label: 'Necesidades' },
    { path: 'banco', label: 'Banco' }, { path: 'donaciones', label: 'Mis donaciones' },
    { path: 'transportes', label: 'Transportes' },
  ],
  edil: [
    { path: '', label: 'Inicio' }, { path: 'servicios', label: 'Servicios' },
    { path: 'voluntariado', label: 'Voluntariado' }, { path: 'solicitudes', label: 'Solicitudes' },
    { path: 'agenda', label: 'Agenda' }, { path: 'recepciones', label: 'Recepciones' },
  ],
  agente: [
    { path: '', label: 'Inicio' }, { path: 'evaluacion', label: 'Evaluación' },
    { path: 'inventario', label: 'Inventario' }, { path: 'agenda', label: 'Agenda' },
    { path: 'asignaciones', label: 'Asignaciones' }, { path: 'entregas', label: 'Entregas' },
  ],
  administrador: [
    { path: '', label: 'Inicio' }, { path: 'servicios', label: 'Servicios' },
    { path: 'jornadas', label: 'Jornadas' }, { path: 'ediles', label: 'Verificar ediles' },
    { path: 'catalogo', label: 'Catálogo' }, { path: 'auditoria', label: 'Auditoría' },
  ],
};

export const moderationEvents: VolunteerEvent[] = [
  { id: 'JV-DEMO-01', type: 'Jornada de vacunación', volunteer: 'Responsable ficticio A', venue: 'Centro comunitario de ejemplo', date: '2026-12-04', start: '08:00', end: '11:00', status: 'Pendiente de revisión' },
  { id: 'JV-DEMO-02', type: 'Orientación comunitaria', volunteer: 'Responsable ficticio B', venue: 'Salón público de demostración', date: '2026-12-06', start: '14:00', end: '16:00', status: 'Pendiente de revisión' },
];
