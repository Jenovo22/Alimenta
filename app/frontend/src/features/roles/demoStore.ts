import seed from './demo-seed.json';

export type DemoProfile = { id: string; name: string; role: 'donante' | 'edil' | 'agente' | 'administrador' };
export type Offer = {
  id: string; donorId: string; edilId: string; product: string; quantity: number;
  offerStatus: 'Ofrecida' | 'Rechazada'; appointmentStatus: 'Pendiente de aceptación' | 'Aceptada' | 'Rechazada';
  transportStatus: 'Pendiente' | 'En transporte'; receiptStatus: 'Pendiente' | 'Confirmada';
};
export type DemoEvent = {
  id: string; accountId: string; type: string; volunteer: string; venue: string;
  date: string; start: string; end: string; status: 'Pendiente de revisión' | 'Publicada (demo)' | 'Rechazada (demo)';
};
export type DemoState = { version: 1; selectedProfileId: string; profiles: DemoProfile[]; offers: Offer[]; events: DemoEvent[] };

export const STORAGE_KEY = 'alimenta-demo-store-v1';
const initialSeed = seed as Omit<DemoState, 'version' | 'selectedProfileId'>;
const seedState = (): DemoState => ({ version: 1, selectedProfileId: initialSeed.profiles[0].id, ...structuredClone(initialSeed) });
let state: DemoState;
let recoveryMessage = '';
const listeners = new Set<() => void>();

function validState(value: unknown): value is DemoState {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<DemoState>;
  return data.version === 1 && Array.isArray(data.profiles) && data.profiles.length === initialSeed.profiles.length
    && Array.isArray(data.offers) && Array.isArray(data.events)
    && data.profiles.every((profile) => initialSeed.profiles.some((known) => known.id === profile.id && known.role === profile.role && known.name === profile.name))
    && data.profiles.some((profile) => profile.id === data.selectedProfileId)
    && data.offers.every((offer) => data.profiles?.some((profile) => profile.id === offer.donorId && profile.role === 'donante')
      && data.profiles?.some((profile) => profile.id === offer.edilId && profile.role === 'edil')
      && typeof offer.id === 'string' && typeof offer.product === 'string' && Number.isFinite(offer.quantity) && offer.quantity > 0
      && ['Ofrecida', 'Rechazada'].includes(offer.offerStatus) && ['Pendiente de aceptación', 'Aceptada', 'Rechazada'].includes(offer.appointmentStatus)
      && ['Pendiente', 'En transporte'].includes(offer.transportStatus) && ['Pendiente', 'Confirmada'].includes(offer.receiptStatus))
    && data.events.every((event) => data.profiles?.some((profile) => profile.id === event.accountId && profile.role === 'edil')
      && typeof event.id === 'string' && typeof event.type === 'string' && typeof event.volunteer === 'string'
      && typeof event.venue === 'string' && typeof event.date === 'string' && typeof event.start === 'string' && typeof event.end === 'string'
      && ['Pendiente de revisión', 'Publicada (demo)', 'Rechazada (demo)'].includes(event.status));
}

function load(): DemoState {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return seedState();
    const parsed: unknown = JSON.parse(saved);
    if (validState(parsed)) return parsed;
  } catch { /* Malformed or unavailable browser storage falls back to fixtures. */ }
  recoveryMessage = 'El estado local no era válido; se restableció el estado demo con los datos ficticios.';
  try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* Storage can be disabled by the browser. */ }
  return seedState();
}

state = load();
function persist() {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { recoveryMessage = 'No se pudo guardar en el almacenamiento de este navegador.'; }
  listeners.forEach((listener) => listener());
}

export function getDemoState() { return state; }
export function getRecoveryMessage() { return recoveryMessage; }
export function subscribeDemoState(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener); }
export function updateDemoState(update: (current: DemoState) => DemoState) { state = update(state); persist(); }
export function resetDemoState() { state = seedState(); recoveryMessage = ''; persist(); }
export function selectDemoProfile(id: string) {
  if (!initialSeed.profiles.some((profile) => profile.id === id)) return;
  updateDemoState((current) => ({ ...current, selectedProfileId: id }));
}

window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY) return;
  state = load();
  listeners.forEach((listener) => listener());
});
