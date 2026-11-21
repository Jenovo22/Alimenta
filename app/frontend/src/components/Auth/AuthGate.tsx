import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface AuthGateProps {
  children: React.ReactNode;
}

/**
 * AuthGate - Handles auth flow for login page
 * Redirects to workspace if user is already authenticated
 */
export function AuthGate({ children }: AuthGateProps) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  // If already authenticated, redirect to user's workspace
  if (isAuthenticated && user) {
    const redirectPath = user.role === 'administrador' 
      ? '/admin' 
      : user.role === 'agente' 
        ? '/agente' 
        : user.role === 'edil'
          ? '/edil'
          : '/donante';
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  return <>{children}</>;
}