import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useOktaAuth } from '@okta/okta-react';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { authState } = useOktaAuth();
  const location = useLocation();

  if (!authState) {
    return null; // Loading state
  }

  if (!authState?.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.some(role => 
    authState.idToken?.claims.groups?.includes(role.toLowerCase())
  )) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;