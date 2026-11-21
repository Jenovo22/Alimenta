export type NeighborhoodReference = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  source: string;
  note?: string;
};

export const neighborhoodReferences: NeighborhoodReference[] = [
  { id: 'samaria', name: 'Samaria', latitude: 5.078985, longitude: -75.486459, source: 'OSM neighborhood node' },
  { id: 'bosques-del-norte', name: 'Bosques del Norte', latitude: 5.0829919, longitude: -75.4892998, source: 'OSM neighborhood node' },
  { id: 'la-isla', name: 'La Isla', latitude: 5.0631788, longitude: -75.517745, source: 'OSM-mapped access stairs', note: 'Punto de acceso: escaleras de acceso al barrio La Isla; no es el centroide ni el límite del barrio.' },
];

export const initialMapCenter = { latitude: 5.0735, longitude: -75.5 };
