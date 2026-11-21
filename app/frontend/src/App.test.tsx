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
