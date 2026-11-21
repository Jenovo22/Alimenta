import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './LoginPage.css';

interface LoginPageProps {
  onLoginSuccess: () => void;
}

export function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      onLoginSuccess();
    }
  }, [isAuthenticated, onLoginSuccess]);

  if (isAuthenticated) {
    return (
      <main className="login-page section-wrap">
        <div className="login-container">
          <h1>Cargando...</h1>
          <p className="login-subtitle">Redirigiendo al panel...</p>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = await login(email, password);
    if (success) {
      onLoginSuccess();
    } else {
      setError('Credenciales inválidas. Verifica el email y contraseña.');
    }
  };

  // Demo credentials helper
  const fillDemoCredentials = (role: 'donante' | 'edil' | 'agente' | 'administrador') => {
    const creds: Record<string, { email: string; password: string }> = {
      donante: { email: 'donante@alimenta.app', password: 'donante123' },
      edil: { email: 'edil@alimenta.app', password: 'edil123' },
      agente: { email: 'agente@alimenta.app', password: 'agente123' },
      administrador: { email: 'admin@alimenta.app', password: 'admin123' },
    };
    setEmail(creds[role].email);
    setPassword(creds[role].password);
  };

  return (
    <main className="login-page section-wrap">
      <div className="login-container">
        <h1>Acceder a Alimenta</h1>
        <p className="login-subtitle">Conecta para gestionar donaciones y comunidades</p>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message" role="alert">{error}</div>}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={isLoading} className="login-btn">
            {isLoading ? 'Ingresando...' : 'Acceder'}
          </button>
        </form>

        <div className="divider">
          <span>o usar credenciales de demostración</span>
        </div>

        <div className="demo-credentials">
          <button 
            className="demo-btn active"
            onClick={() => fillDemoCredentials('donante')}
          >
            Donante: donante@alimenta.app / donante123
          </button>
          <button 
            className="demo-btn"
            onClick={() => fillDemoCredentials('edil')}
          >
            Edil: edil@alimenta.app / edil123
          </button>
          <button 
            className="demo-btn"
            onClick={() => fillDemoCredentials('agente')}
          >
            Agente: agente@alimenta.app / agente123
          </button>
          <button 
            className="demo-btn"
            onClick={() => fillDemoCredentials('administrador')}
          >
            Admin: admin@alimenta.app / admin123
          </button>
        </div>

        <p className="back-link">
          <a href="/">← Volver a inicio</a>
        </p>
      </div>
    </main>
  );
}