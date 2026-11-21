import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'donante' | 'edil' | 'agente' | 'administrador';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User | null>;
  register: (name: string, email: string, password: string) => Promise<User | null>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function readStoredSession(): { user: User | null; token: string | null } {
  try {
    const storedToken = localStorage.getItem('alimenta_token');
    const storedUser = localStorage.getItem('alimenta_user');
    if (storedToken && storedUser) {
      return { token: storedToken, user: JSON.parse(storedUser) as User };
    }
  } catch {
    localStorage.removeItem('alimenta_token');
    localStorage.removeItem('alimenta_user');
  }
  return { user: null, token: null };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const initial = readStoredSession();
  const [user, setUser] = useState<User | null>(initial.user);
  const [token, setToken] = useState<string | null>(initial.token);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    let active = true;
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!active) return;
        if (res.status === 401 || res.status === 403 || res.status === 404) {
          localStorage.removeItem('alimenta_token');
          localStorage.removeItem('alimenta_user');
          setToken(null);
          setUser(null);
        }
      })
      .catch(() => {
        // Keep current session if network is temporarily unreachable
      });
    return () => {
      active = false;
    };
  }, [token]);

  const login = async (email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username: email.trim().toLowerCase(), password }),
      });

      if (!response.ok) {
        if (response.status >= 500) {
          setAuthError('El servidor de autenticación no responde. Verifica que el backend esté activo.');
          return null;
        }
        let detail = 'Credenciales inválidas. Verifica tu correo y contraseña.';
        try {
          const errorBody = await response.json();
          if (typeof errorBody?.detail === 'string') {
            detail = errorBody.detail;
          }
        } catch {
          // ignore non-JSON error bodies
        }
        setAuthError(detail);
        return null;
      }

      const data = await response.json();
      const accessToken = data.access_token;

      localStorage.setItem('alimenta_token', accessToken);
      localStorage.setItem('alimenta_user', JSON.stringify(data.user));

      setToken(accessToken);
      setUser(data.user);

      return data.user as User;
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError('No se pudo conectar con el servidor de autenticación.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<User | null> => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim().toLowerCase(), password }),
      });

      if (!response.ok) {
        let detail = 'No se pudo completar el registro.';
        try {
          const errorBody = await response.json();
          if (typeof errorBody?.detail === 'string') {
            detail = errorBody.detail;
          }
        } catch {
          // ignore non-JSON error bodies
        }
        setAuthError(detail);
        return null;
      }

      const data = await response.json();
      const accessToken = data.access_token;

      localStorage.setItem('alimenta_token', accessToken);
      localStorage.setItem('alimenta_user', JSON.stringify(data.user));

      setToken(accessToken);
      setUser(data.user);

      return data.user as User;
    } catch (error) {
      console.error('Register failed:', error);
      setAuthError('No se pudo conectar con el servidor de registro.');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('alimenta_token');
    localStorage.removeItem('alimenta_user');
    setToken(null);
    setUser(null);
    setAuthError(null);
  };

  const clearError = () => setAuthError(null);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      register,
      logout,
      isAuthenticated: !!user && !!token,
      isLoading,
      authError,
      clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}