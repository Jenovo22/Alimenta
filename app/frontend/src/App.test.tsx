import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, describe, expect, it } from 'vitest';
import App from './app/App';

afterEach(cleanup);

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
    expect(screen.getByRole('heading', { name: 'Comedor solidario de ejemplo B' })).toBeVisible();
    expect(screen.getByText(/no es un mapa real/i)).toBeVisible();
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
    expect(screen.getByText(/no autentica ni registra usuarios reales/i)).toBeVisible();
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

    expect(screen.getByText('Intención registrada')).toBeVisible();
    expect(screen.getByText('Cita pendiente de aceptación')).toBeVisible();
    expect(screen.getByText('En transporte')).toBeVisible();
    expect(screen.getByText('Recepción confirmada')).toBeVisible();
    await user.click(screen.getByRole('button', { name: /registrar intención/i }));
    expect(screen.getByRole('status')).toHaveTextContent(/solo en este navegador.*no confirma una recepción/i);
  });

  it('validates and submits an edil volunteer event only to transient state', async () => {
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

    expect(screen.getByRole('status')).toHaveTextContent(/guardada solo en esta sesión.*pendiente de revisión/i);
    expect(screen.getByRole('heading', { name: /atención psicológica/i })).toBeVisible();
  });

  it('lets an administrator moderate volunteer events without implying persistence', async () => {
    const user = userEvent.setup();
    renderAt('/demo/administrador/jornadas');

    await user.click(screen.getAllByRole('button', { name: /aprobar publicación/i })[0]);
    expect(screen.getByRole('status')).toHaveTextContent(/publicada solo en esta demostración.*no se guardó en un servidor/i);
    expect(screen.getByText('Publicada (demo)')).toBeVisible();

    await user.click(screen.getAllByRole('button', { name: /rechazar jornada/i })[0]);
    expect(screen.getByRole('status')).toHaveTextContent(/rechazada solo en esta demostración/i);
    expect(screen.getByText('Rechazada (demo)')).toBeVisible();
  });

  it('shows the agent inventory states as separate quantities', () => {
    renderAt('/demo/agente/inventario');

    const table = screen.getByRole('table', { name: /inventario demostrativo/i });
    expect(within(table).getByRole('columnheader', { name: 'Recibido' })).toBeVisible();
    expect(within(table).getByRole('columnheader', { name: 'Disponible' })).toBeVisible();
    expect(within(table).getByRole('columnheader', { name: 'Reservado' })).toBeVisible();
    expect(within(table).getByRole('columnheader', { name: 'Despachado' })).toBeVisible();
    expect(screen.getByText(/una promesa no aumenta lo disponible/i)).toBeVisible();
  });
});
