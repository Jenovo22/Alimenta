export type MapPoint = {
  id: string;
  communityId?: number;
  name: string;
  code?: string;
  latitude: number;
  longitude: number;
  source: string;
  description?: string;
  isVerified?: boolean;
  needsCount?: number;
  eventsCount?: number;
  note?: string;
};

export const initialMapCenter = { latitude: 5.0703, longitude: -75.5138 };

// Coordenadas de referencia en Manizales para enlazar comunidades de la base de datos
const MANIZALES_COORDINATES: Record<string, { latitude: number; longitude: number; source: string }> = {
  'MAN-MR': { latitude: 5.078985, longitude: -75.486459, source: 'Manizales · Zona Norte' },
  'MAN-LR': { latitude: 5.06889, longitude: -75.5052, source: 'Manizales · Zona Centro' },
  'MAN-LL': { latitude: 5.0598, longitude: -75.5155, source: 'Manizales · Zona Sur' },
  manrique: { latitude: 5.078985, longitude: -75.486459, source: 'Manizales · Zona Norte' },
  laureles: { latitude: 5.06889, longitude: -75.5052, source: 'Manizales · Zona Centro' },
  lleras: { latitude: 5.0598, longitude: -75.5155, source: 'Manizales · Zona Sur' },
  samaria: { latitude: 5.078985, longitude: -75.486459, source: 'Manizales · Comuna Ciudadela del Norte' },
  'bosques del norte': { latitude: 5.0829919, longitude: -75.4892998, source: 'Manizales · Comuna Ciudadela del Norte' },
  'la isla': { latitude: 5.0631788, longitude: -75.517745, source: 'Manizales · Acceso sector La Isla' },
};

export const defaultMapPoints: MapPoint[] = [
  { id: 'manrique', name: 'Comunidad Manrique', code: 'MAN-MR', latitude: 5.078985, longitude: -75.486459, source: 'Manizales · Zona Norte' },
  { id: 'laureles', name: 'Comunidad Laureles', code: 'MAN-LR', latitude: 5.06889, longitude: -75.5052, source: 'Manizales · Zona Centro' },
  { id: 'lleras', name: 'Comunidad Lleras', code: 'MAN-LL', latitude: 5.0598, longitude: -75.5155, source: 'Manizales · Zona Sur' },
];

export function resolveCommunityCoords(
  community: { id: number; name: string; code?: string | null; description?: string | null },
  index: number,
): { latitude: number; longitude: number; source: string } {
  const codeKey = community.code?.trim().toUpperCase() ?? '';
  if (codeKey && MANIZALES_COORDINATES[codeKey]) {
    return MANIZALES_COORDINATES[codeKey];
  }

  const normalizedName = community.name.toLowerCase();
  for (const [key, coords] of Object.entries(MANIZALES_COORDINATES)) {
    if (normalizedName.includes(key.toLowerCase())) {
      return coords;
    }
  }

  // Distribución determinística alrededor de Manizales para comunidades nuevas sin coordenadas explícitas
  const angle = (index * 137.5 * Math.PI) / 180;
  const radius = 0.008 + (index % 3) * 0.004;
  return {
    latitude: initialMapCenter.latitude + Math.sin(angle) * radius,
    longitude: initialMapCenter.longitude + Math.cos(angle) * radius,
    source: community.description || 'Manizales · Comunidad registrada',
  };
}
