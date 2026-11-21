import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './app/App';

afterEach(cleanup);

function renderAt(path: string) {
  return render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
}

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn(function(key: string) { return store[key] || null }),
    setItem: vi.fn(function(key: string, value: string) { store[key] = value; }),
    removeItem: vi.fn(function(key: string) { delete store[key]; }),
    clear: vi.fn(function() { store = {}; }),
  };
})();

describe('public experience', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('shows the public landing page', () => {
    const { getByRole } = renderAt('/');
    
    expect(getByRole('heading', { name: /donaciones coordinadas/i })).toBeVisible();
    expect(getByRole('navigation', { name: /principal/i })).toBeVisible();
  });

  it('navigates to the services directory', async () => {
    const user = userEvent.setup();
    const { getByRole, findByRole } = renderAt('/');

    await user.click(getByRole('link', { name: /servicios comunitarios/i }));
    expect(await findByRole('heading', { name: /servicios comunitarios/i })).toBeVisible();
  });

  it('shows login page for authenticated access', async () => {
    const user = userEvent.setup();
    const { getByRole, findByRole } = renderAt('/');

    await user.click(getByRole('link', { name: /acceder/i }));
    expect(await findByRole('heading', { name: /acceder a alimenta/i })).toBeVisible();
  });

  it('shows login form', () => {
    const { getByLabelText, getByRole } = renderAt('/login');

    expect(getByLabelText(/email/i)).toBeVisible();
    expect(getByLabelText(/contraseña/i)).toBeVisible();
    expect(getByRole('button', { name: /acceder/i })).toBeVisible();
  });
});

describe('authentication', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('redirects unauthenticated users to login from protected routes', () => {
    const { queryByRole } = renderAt('/donante');
    
    // Should redirect to login since no token is set
    expect(queryByRole('heading', { name: /área de donante/i })).not.toBeInTheDocument();
  });
});