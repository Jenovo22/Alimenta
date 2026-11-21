import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading, authError } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      onLoginSuccess();
    }
  }, [isAuthenticated, onLoginSuccess]);

  if (isAuthenticated) {
    return (
      <main className="login-shell">
        <div className="login-card login-card-centered">
          <div className="login-brand">
            <span aria-hidden="true">A</span> Alimenta
          </div>
          <h1>Cargando...</h1>
          <p className="login-subtitle">Redirigiendo a tu panel de trabajo...</p>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email.trim(), password);
    if (success) {
      onLoginSuccess();
    } else {
      setError('');
    }
  };

  return (
    <main className="login-shell">
      <div className="login-layout">
        <section className="login-aside" aria-label="Información de Alimenta">
          <Link className="login-brand" to="/" aria-label="Alimenta, volver al inicio">
            <span aria-hidden="true">A</span> Alimenta
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
            <h1 id="login-heading">Acceder a Alimenta</h1>
            <p className="login-subtitle">Ingresa tus credenciales para acceder a tu panel</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {(error || authError) && (
              <div className="error-message" role="alert">
                {error || authError}
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
                  autoComplete="current-password"
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
              {isLoading ? 'Ingresando...' : 'Acceder'}
            </button>
          </form>

          <p className="back-link">
            <Link to="/">← Volver a inicio</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
