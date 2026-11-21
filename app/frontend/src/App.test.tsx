import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './app/App';
import { resetDemoState } from './features/roles/demoStore';

afterEach(cleanup);
beforeEach(() => resetDemoState());

function renderAt(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
}

describe('public experience', () => {
  it('shows the public landing and navigates to the services directory', async () => {
    const user = userEvent.setup();
    renderAt('/');

    expect(screen.getByRole('heading', { name: /donaciones coordinadas/i })).toBeVisible();
    expect(screen.getByRole('region', { name: /organizaciones aliadas/i })).toBeVisible();
    await user.click(screen.getByRole('link', { name: /servicios comunitarios/i }));
    expect(await screen.findByRole('heading', { name: /servicios comunitarios/i })).toBeVisible();
    expect(screen.getByRole('navigation', { name: /principal/i })).toBeVisible();
  });

  it('filters the public service list and clears filters', async () => {
    const user = userEvent.setup();
    renderAt('/servicios');

    expect(within(screen.getByRole('list', { name: /servicios publicados/i })).getByText('Punto comunitario de alimentación A')).toBeVisible();
    await user.selectOptions(screen.getByLabelText(/comunidad/i), 'Manrique');
    expect(within(screen.getByRole('list', { name: /servicios publicados/i })).queryByText('Punto comunitario de alimentación A')).not.toBeInTheDocument();
    expect(within(screen.getByRole('list', { name: /servicios publicados/i })).getByText('Comedor solidario de ejemplo B')).toBeVisible();
    await user.click(screen.getByRole('button', { name: /limpiar filtros/i }));
    expect(within(screen.getByRole('list', { name: /servicios publicados/i })).getByText('Punto comunitario de alimentación A')).toBeVisible();
  });

  it('offers a text list alternative and synchronized service selection', async () => {
    const user = userEvent.setup();
    renderAt('/servicios');

    const list = screen.getByRole('list', { name: /servicios publicados/i });
    await user.click(within(list).getByRole('button', { name: /comedor solidario de ejemplo b/i }));
    expect(screen.getByRole('region', { name: /mapa de referencia de manizales/i })).toBeVisible();
  });

  it('shows static Manizales reference markers with their coordinates and neutral labels', async () => {
    renderAt('/servicios');

    expect(screen.getByRole('heading', { name: /barrios de referencia para la demo/i })).toBeVisible();
    expect(document.querySelector('.reference-marker[aria-label="Samaria, 5.0789850, -75.4864590"]')).toBeVisible();
    expect(document.querySelector('.reference-marker[aria-label="Bosques del Norte, 5.0829919, -75.4892998"]')).toBeVisible();
    expect(document.querySelector('.reference-marker[aria-label="La Isla, 5.0631788, -75.5177450, acceso"]')).toBeVisible();
    expect(screen.getAllByText(/escaleras de acceso.*no.*centroide.*límite/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/vulnerable/i)).not.toBeInTheDocument();
  });

  it('synchronizes geographic marker and accessible list selection', async () => {
    const user = userEvent.setup();
    renderAt('/servicios');

    const samariaMarker = document.querySelector<HTMLButtonElement>('.reference-marker[aria-label^="Samaria"]')!;
    const bosquesMarker = document.querySelector<HTMLButtonElement>('.reference-marker[aria-label^="Bosques del Norte"]')!;
    await user.click(samariaMarker);
    expect(samariaMarker).toHaveAttribute('aria-pressed', 'true');
    await user.click(within(screen.getByRole('list', { name: /barrios de referencia/i })).getByRole('button', { name: /bosques del norte/i }));
    expect(bosquesMarker).toHaveAttribute('aria-pressed', 'true');
  });

  it('attributes OpenStreetMap tiles and keeps the reference list usable after a tile error', () => {
    renderAt('/servicios');

    expect(screen.getByRole('link', { name: /© openstreetmap contributors/i })).toHaveAttribute('href', 'https://www.openstreetmap.org/copyright');
    const tile = document.querySelector<HTMLImageElement>('.reference-map img');
    expect(tile?.src).toMatch(/^https:\/\/tile\.openstreetmap\.org\/\d+\/\d+\/\d+\.png$/);
    tile?.dispatchEvent(new Event('error'));
    expect(screen.getByRole('list', { name: /barrios de referencia/i })).toBeVisible();
  });

  it('controls the allies carousel manually and does not autoplay', async () => {
    const user = userEvent.setup();
    renderAt('/');
    const carousel = screen.getByRole('region', { name: /organizaciones aliadas/i });

    expect(within(carousel).getByRole('heading', { name: 'Organización aliada 01' })).toBeVisible();
    expect(within(carousel).getByText(/01\s*\/\s*10/)).toBeVisible();
    await user.click(within(carousel).getByRole('button', { name: /siguiente organización/i }));
    expect(within(carousel).getByRole('heading', { name: 'Cooperativa comunitaria 02' })).toBeVisible();
    expect(within(carousel).getByText(/02\s*\/\s*10/)).toBeVisible();
  });

  it('routes donation calls to the demo access notice rather than submitting', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(within(screen.getByRole('navigation', { name: /principal/i })).getByRole('link', { name: /quiero donar/i }));
    expect(await screen.findByRole('heading', { name: /acceso de demostración/i })).toBeVisible();
    expect(screen.getByText(/no autentica ni concede permisos/i)).toBeVisible();
  });
});

describe('role demonstrations', () => {
  it.each([
    ['Donante', '/demo/donante'],
    ['Edil', '/demo/edil'],
    ['Agente', '/demo/agente'],
    ['Administrador', '/demo/administrador'],
  ])('opens the %s workspace with an explicit demo boundary', (role, path) => {
    renderAt(path);

    expect(screen.getByRole('heading', { name: new RegExp(`Área de ${role}`, 'i') })).toBeVisible();
    expect(screen.getByText(/modo demostración.*no autentica/i)).toBeVisible();
    expect(screen.getByRole('navigation', { name: new RegExp(role, 'i') })).toBeVisible();
  });

  it('keeps donor intent, appointment, dispatch, and receipt language distinct', async () => {
    const user = userEvent.setup();
    renderAt('/demo/donante/donaciones');

    expect(screen.getByText(/ofrecimiento, aceptación\/cita, transporte y recepción son estados independientes/i)).toBeVisible();
    await user.type(screen.getByLabelText(/producto/i), 'Arroz');
    await user.type(screen.getByLabelText(/cantidad ofrecida/i), '2');
    await user.click(screen.getByRole('button', { name: /crear ofrecimiento/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/no es una donación real ni una recepción/i);
  });

  it('validates and persists an edil volunteer event for admin moderation', async () => {
    const user = userEvent.setup();
    renderAt('/demo/edil/voluntariado');

    await user.click(screen.getByRole('button', { name: /registrar jornada/i }));
    expect(screen.getByRole('alert')).toHaveTextContent(/completa los campos obligatorios/i);

    await user.type(screen.getByLabelText(/nombre del voluntario responsable/i), 'María Demo');
    await user.type(screen.getByLabelText(/lugar público autorizado/i), 'Centro comunitario de ejemplo');
    await user.type(screen.getByLabelText(/fecha programada/i), '2026-12-02');
    await user.type(screen.getByLabelText(/hora de inicio/i), '09:00');
    await user.type(screen.getByLabelText(/hora de finalización/i), '11:00');
    await user.click(screen.getByLabelText(/confirmo que puedo divulgar/i));
    await user.click(screen.getByRole('button', { name: /registrar jornada/i }));

    expect(screen.getByRole('status')).toHaveTextContent(/guardada en este navegador.*pendiente de revisión/i);
    window.dispatchEvent(new StorageEvent('storage', { key: 'alimenta-demo-store-v1' }));
    expect(screen.getByRole('heading', { name: /atención psicológica/i })).toBeVisible();
    await user.click(screen.getByRole('link', { name: /inicio/i }));
    await user.click(screen.getByRole('link', { name: /voluntariado/i }));
    expect(screen.getByRole('heading', { name: /atención psicológica/i })).toBeVisible();
    await user.selectOptions(screen.getByLabelText(/cambiar vista de rol/i), 'admin-demo-01');
    await user.click(screen.getByRole('link', { name: /jornadas/i }));
    expect(screen.getByText('María Demo')).toBeVisible();
  });

  it('lets an administrator moderate volunteer events persistently', async () => {
    const user = userEvent.setup();
    renderAt('/demo/administrador/jornadas');

    await user.click(screen.getAllByRole('button', { name: /aprobar publicación/i })[0]);
    expect(screen.getByRole('status')).toHaveTextContent(/guardada en este navegador/i);
    expect(screen.getByText('Publicada (demo)')).toBeVisible();
    await user.selectOptions(screen.getByLabelText(/cambiar vista de rol/i), 'edil-demo-01');
    await user.click(screen.getByRole('link', { name: /voluntariado/i }));
    expect(screen.getByText('Publicada (demo)')).toBeVisible();
    await user.selectOptions(screen.getByLabelText(/cambiar vista de rol/i), 'admin-demo-01');
    await user.click(screen.getByRole('link', { name: /jornadas/i }));

    await user.click(screen.getAllByRole('button', { name: /rechazar jornada/i })[0]);
    expect(screen.getByRole('status')).toHaveTextContent(/guardada en este navegador/i);
    expect(screen.getByText('Rechazada (demo)')).toBeVisible();
  });

  it('shows the agent inventory states as separate quantities', () => {
    renderAt('/demo/agente/inventario');

    const table = screen.getByRole('table', { name: /inventario demostrativo/i });
    expect(within(table).getByRole('columnheader', { name: 'Recibido' })).toBeVisible();
    expect(within(table).getByRole('columnheader', { name: 'Disponible' })).toBeVisible();
    expect(within(table).getByRole('columnheader', { name: 'Reservado' })).toBeVisible();
    expect(within(table).getByRole('columnheader', { name: 'Despachado' })).toBeVisible();
    expect(screen.getByText(/solo las recepciones físicas confirmadas incrementan/i)).toBeVisible();
  });
});

describe('shared browser-local demo workflow', () => {
  it('offers fictional seeded profiles and keeps profile switching demo-only', async () => {
    const user = userEvent.setup();
    renderAt('/acceso');
    for (const account of ['Donante de ejemplo', 'Edil de ejemplo', 'Agente de ejemplo', 'Administradora de ejemplo']) {
      expect(screen.getByRole('option', { name: new RegExp(account, 'i') })).toBeInTheDocument();
    }
    expect(screen.getByText(/no autentica ni concede permisos/i)).toBeVisible();
    await user.selectOptions(screen.getByLabelText(/perfil de demostración/i), 'donante-demo-01');
    expect(screen.getByRole('status')).toHaveTextContent(/perfil demostrativo/i);
    expect(screen.getByRole('status')).toHaveTextContent(/no autentica/i);
  });

  it('persists donor offer and Edil decision, transport, receipt across profile views', async () => {
    const user = userEvent.setup();
    renderAt('/demo/donante/donaciones');
    await user.type(screen.getByLabelText(/producto/i), 'Arroz');
    await user.type(screen.getByLabelText(/cantidad ofrecida/i), '5');
    await user.click(screen.getByRole('button', { name: /crear ofrecimiento/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/ofrecimiento creado/i);
    window.dispatchEvent(new StorageEvent('storage', { key: 'alimenta-demo-store-v1' }));
    await user.selectOptions(screen.getByLabelText(/cambiar vista de rol/i), 'edil-demo-01');
    await user.click(screen.getByRole('link', { name: /recepciones/i }));
    expect(screen.getAllByText(/Arroz/)[0]).toBeVisible();
    await user.click(screen.getByRole('button', { name: /aceptar ofrecimiento/i }));
    expect(JSON.parse(window.localStorage.getItem('alimenta-demo-store-v1') ?? '{}').offers[0].donorId).toBe('donante-demo-01');
    await user.selectOptions(screen.getByLabelText(/cambiar vista de rol/i), 'donante-demo-01');
    await user.click(screen.getByRole('link', { name: /mis donaciones/i }));
    expect(screen.getByText(/aceptada/i)).toBeVisible();
    await user.click(screen.getByRole('button', { name: /marcar transporte/i }));
    await user.selectOptions(screen.getByLabelText(/cambiar vista de rol/i), 'edil-demo-01');
    await user.click(screen.getByRole('link', { name: /recepciones/i }));
    await user.click(screen.getByRole('button', { name: /confirmar recepción física/i }));
    await user.selectOptions(screen.getByLabelText(/cambiar vista de rol/i), 'donante-demo-01');
    await user.click(screen.getByRole('link', { name: /mis donaciones/i }));
    expect(screen.getByText(/Recepción: Confirmada/i)).toBeVisible();
    await user.type(screen.getByLabelText(/producto/i), 'Avena');
    await user.type(screen.getByLabelText(/cantidad ofrecida/i), '3');
    await user.click(screen.getByRole('button', { name: /crear ofrecimiento/i }));
    await user.selectOptions(screen.getByLabelText(/cambiar vista de rol/i), 'edil-demo-01');
    await user.click(screen.getByRole('link', { name: /recepciones/i }));
    await user.click(screen.getAllByRole('button', { name: /rechazar ofrecimiento/i })[0]);
    await user.selectOptions(screen.getByLabelText(/cambiar vista de rol/i), 'donante-demo-01');
    await user.click(screen.getByRole('link', { name: /mis donaciones/i }));
    expect(screen.getByText(/Oferta: Rechazada · Cita: Rechazada/i)).toBeVisible();
    await user.selectOptions(screen.getByLabelText(/cambiar vista de rol/i), 'agente-demo-01');
    await user.click(screen.getByRole('link', { name: /inventario/i }));
    expect(within(screen.getByRole('table', { name: /inventario demostrativo/i })).getByRole('row', { name: /Arroz 5 5 0 0/i })).toBeVisible();
  });

  it('updates agent inventory only on confirmed physical receipt and recovers malformed storage/reset', async () => {
    const user = userEvent.setup();
    renderAt('/demo/donante/donaciones');
    await user.type(screen.getByLabelText(/producto/i), 'Lentejas');
    await user.type(screen.getByLabelText(/cantidad ofrecida/i), '7');
    await user.click(screen.getByRole('button', { name: /crear ofrecimiento/i }));
    await user.selectOptions(screen.getByLabelText(/cambiar vista de rol/i), 'agente-demo-01');
    await user.click(screen.getByRole('link', { name: /inventario/i }));
    expect(within(screen.getByRole('table', { name: /inventario demostrativo/i })).queryByText('Lentejas')).not.toBeInTheDocument();
    window.localStorage.setItem('alimenta-demo-store-v1', '{broken');
    window.dispatchEvent(new StorageEvent('storage', { key: 'alimenta-demo-store-v1' }));
    cleanup();
    renderAt('/demo/agente/inventario');
    expect(screen.getByText(/se restableció el estado demo/i)).toBeVisible();
    expect(screen.getByRole('button', { name: /restablecer demo/i })).toBeVisible();
    window.confirm = () => true;
    await user.click(screen.getByRole('button', { name: /restablecer demo/i }));
    expect(screen.getAllByRole('status').some((status) => /se restablecieron los datos ficticios/i.test(status.textContent ?? ''))).toBe(true);
  });
});
