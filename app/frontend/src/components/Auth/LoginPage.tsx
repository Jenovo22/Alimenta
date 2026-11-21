import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

const DEMO_ACCOUNTS = [
  { label: 'Donante', email: 'donante@alimenta.app', password: 'donante123' },
  { label: 'Edil', email: 'edil@alimenta.app', password: 'edil123' },
  { label: 'Agente', email: 'agente@alimenta.app', password: 'agente123' },
  { label: 'Admin', email: 'admin@alimenta.app', password: 'admin123' },
];

function roleHomePath(role: string): string {
  if (role === 'administrador') return '/admin';
  if (role === 'agente') return '/agente';
  if (role === 'edil') return '/edil';
  return '/donante';
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, register, isLoading, authError, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    clearError();

    const loggedUser =
      mode === 'login'
        ? await login(email.trim(), password)
        : await register(name.trim(), email.trim(), password);

    if (loggedUser) {
      onLoginSuccess();
      navigate(roleHomePath(loggedUser.role), { replace: true });
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPassword: string) => {
    setMode('login');
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
    clearError();
    const loggedUser = await login(demoEmail, demoPassword);
    if (loggedUser) {
      onLoginSuccess();
      navigate(roleHomePath(loggedUser.role), { replace: true });
    }
  };

  return (
    <main className="login-shell">
      <div className="login-layout">
        <section className="login-aside" aria-label="Información de Alimenta">
          <Link className="login-brand" to="/" aria-label="Alimenta, volver al inicio">
            <img src="/alimenta-isotipo.svg" alt="" className="brand-logo" width={32} height={32} aria-hidden="true" /> Alimenta
          </Link>
          <p className="login-eyebrow">Plataforma comunitaria</p>
          <h2 className="login-aside-title">
            Donaciones coordinadas <em>hasta la recepción.</em>
          </h2>
          <p className="login-aside-copy">
            Ingresa con tu cuenta institucional para coordinar entregas, consultar necesidades comunitarias y gestionar la logística en tiempo real.
          </p>
          <ul className="login-highlights">
            <li>
              <strong>Equidad y trazabilidad</strong>
              <span>Priorización basada en criterios de ponderación social.</span>
            </li>
            <li>
              <strong>Confirmación real</strong>
              <span>Cada entrega queda verificada por la comunidad receptora.</span>
            </li>
          </ul>
        </section>

        <section className="login-card" aria-labelledby="login-heading">
          <div className="login-card-header">
            <h1 id="login-heading">
              {mode === 'login' ? 'Acceder a Alimenta' : 'Crear cuenta de donante'}
            </h1>
            <p className="login-subtitle">
              {mode === 'login'
                ? 'Ingresa tus credenciales para acceder a tu panel'
                : 'Regístrate para aportar a necesidades comunitarias'}
            </p>
          </div>

          <div className="login-mode-tabs" role="tablist" aria-label="Modo de acceso">
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              className={`mode-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(''); clearError(); }}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              className={`mode-tab ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(''); clearError(); }}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {(error || authError) && (
              <div className="error-message" role="alert">
                {error || authError}
              </div>
            )}

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  required
                  minLength={2}
                  autoComplete="name"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@alimenta.app"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="password-field">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-pressed={showPassword}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="login-btn">
              {isLoading
                ? 'Procesando...'
                : mode === 'login'
                  ? 'Acceder'
                  : 'Registrarme y entrar'}
            </button>
          </form>

          {mode === 'login' && (
            <div className="quick-login-box">
              <p className="quick-login-title">Acceso rápido por rol (cuentas de prueba):</p>
              <div className="quick-login-grid">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    className="quick-login-btn"
                    disabled={isLoading}
                    onClick={() => handleQuickLogin(acc.email, acc.password)}
                  >
                    <strong>{acc.label}</strong>
                    <span>{acc.email}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <p className="back-link">
            <Link to="/">← Volver a inicio</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
