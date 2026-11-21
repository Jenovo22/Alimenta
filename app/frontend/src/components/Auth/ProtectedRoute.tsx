import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('donante' | 'edil' | 'agente' | 'administrador')[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="loading">Cargando...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to user's default page based on role
    const redirectPath = user.role === 'administrador' 
      ? '/admin' 
      : user.role === 'agente' 
        ? '/agente' 
        : user.role === 'edil'
          ? '/edil'
          : '/donante';
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
}