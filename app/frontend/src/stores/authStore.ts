import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'donante' | 'edil' | 'agente' | 'administrador';
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

// Simple client-side store (not persisted across sessions for now)
let state: AuthState = {
  user: null,
  token: localStorage.getItem('alimenta_token'),
  isLoading: false,
  error: null,
  isAuthenticated: !!localStorage.getItem('alimenta_token'),
  
  login: async function(email: string, password: string) {
    setAuthState({ isLoading: true, error: null });
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ username: email, password }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Error de autenticación');
      }
      
      const data = await response.json();
      const token = data.access_token;
      
      localStorage.setItem('alimenta_token', token);
      localStorage.setItem('alimenta_user', JSON.stringify(data.user));
      
      setAuthState({
        user: data.user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      setAuthState({
        error: error instanceof Error ? error.message : 'Error desconocido',
        isLoading: false,
      });
      return false;
    }
  },
  
  logout: function() {
    localStorage.removeItem('alimenta_token');
    localStorage.removeItem('alimenta_user');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
    });
  },
  
  clearError: function() {
    setAuthState({ error: null });
  }
};

const listeners = new Set<() => void>();

function setAuthState(newState: Partial<AuthState>) {
  state = { ...state, ...newState };
  listeners.forEach(listener => listener());
}

export function useAuthState() {
  const [_, setState] = useState(0);
  
  useEffect(() => {
    listeners.add(() => setState(c => c + 1));
    return () => {
      listeners.delete(() => setState(c => c + 1));
    };
  }, []);
  
  return state;
}

// Initialize token from localStorage on load
if (state.token && !state.user) {
  try {
    const storedUser = localStorage.getItem('alimenta_user');
    if (storedUser) {
      state.user = JSON.parse(storedUser);
      state.isAuthenticated = !!state.token;
    }
  } catch (e) {
    state = { ...state, token: null, user: null, isAuthenticated: false };
  }
}