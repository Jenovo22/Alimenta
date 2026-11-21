export type DemoRole = 'donante' | 'edil' | 'agente' | 'administrador';

export type VolunteerEventStatus = 'Pendiente de revisión' | 'Publicada' | 'Rechazada';

export type VolunteerEvent = {
  id: string;
  type: string;
  volunteer: string;
  venue: string;
  date: string;
  start: string;
  end: string;
  status: VolunteerEventStatus;
};