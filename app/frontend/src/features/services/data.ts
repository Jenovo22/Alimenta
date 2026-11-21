export type PublicService = {
  name: string;
  type: string;
  community: string;
  days: string[];
  schedule: string;
  description: string;
  x: number;
  y: number;
};

export const allies = [
  { name: 'Organización aliada 01', confirmed: 24, description: 'Entidad jurídica ficticia reconocida en este escenario local.' },
  { name: 'Cooperativa comunitaria 02', confirmed: 21, description: 'Organización de ejemplo; no representa una alianza real.' },
  { name: 'Empresa solidaria 03', confirmed: 19, description: 'Entidad ficticia incluida para ilustrar el carrusel.' },
  { name: 'Fundación colaboradora 04', confirmed: 17, description: 'Fundación de demostración sin actividad operativa.' },
  { name: 'Organización aliada 05', confirmed: 16, description: 'Organización ilustrativa con datos completamente ficticios.' },
  { name: 'Asociación empresarial 06', confirmed: 14, description: 'Entidad de ejemplo, no asociada a donaciones reales.' },
  { name: 'Compañía donante 07', confirmed: 12, description: 'Nombre ficticio usado únicamente para esta demostración.' },
  { name: 'Fundación colaboradora 08', confirmed: 11, description: 'Entidad ilustrativa sin relación comercial.' },
  { name: 'Organización aliada 09', confirmed: 9, description: 'Ejemplo local de organización comunitaria.' },
  { name: 'Cooperativa solidaria 10', confirmed: 8, description: 'Cooperativa ficticia incluida en el listado de muestra.' },
];

export const serviceLocations: PublicService[] = [
  { name: 'Punto comunitario de alimentación A', type: 'Olla comunitaria', community: 'San Javier', days: ['Lunes', 'Miércoles', 'Viernes'], schedule: '11:30–13:30', description: 'Almuerzo comunitario orientativo. Confirmar jornada con la organización.', x: 31, y: 38 },
  { name: 'Comedor solidario de ejemplo B', type: 'Almuerzo comunitario', community: 'Manrique', days: ['Martes', 'Jueves', 'Sábado'], schedule: '12:00–14:00', description: 'Servicio ilustrativo, sin cupos garantizados.', x: 66, y: 55 },
  { name: 'Centro de apoyo comunitario C', type: 'Otro servicio', community: 'Popular', days: ['Lunes', 'Viernes'], schedule: '09:00–12:00', description: 'Orientación comunitaria de ejemplo.', x: 75, y: 25 },
];

export const serviceTypes = [...new Set(serviceLocations.map((service) => service.type))];
export const serviceDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
