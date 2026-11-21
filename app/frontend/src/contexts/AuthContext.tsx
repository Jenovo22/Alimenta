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
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('alimenta_token');
    const storedUser = localStorage.getItem('alimenta_user');

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        setToken(storedToken);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem('alimenta_token');
        localStorage.removeItem('alimenta_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setAuthError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username: email, password }),
      });

      if (!response.ok) {
        if (response.status >= 500) {
          setAuthError('El servidor de autenticación no responde. Verifica que el backend esté activo.');
          return false;
        }
        let detail = 'Credenciales inválidas. Verifica tu correo y contraseña.';
        try {
          const errorBody = await response.json();
          if (typeof errorBody?.detail === 'string' && response.status === 403) {
            detail = errorBody.detail;
          }
        } catch {
          // ignore non-JSON error bodies
        }
        setAuthError(detail);
        return false;
      }

      const data = await response.json();
      const accessToken = data.access_token;

      localStorage.setItem('alimenta_token', accessToken);
      localStorage.setItem('alimenta_user', JSON.stringify(data.user));

      setToken(accessToken);
      setUser(data.user);

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      setAuthError('No se pudo conectar con el servidor de autenticación.');
      return false;
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

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!user,
      isLoading,
      authError,
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