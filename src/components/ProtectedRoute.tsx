import React from 'react'; 
import { Navigate, useLocation } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext'; 
import type { UserRole } from '../types'; 
 
interface ProtectedRouteProps { 
  children: React.ReactNode; 
  allowedRoles?: UserRole[]; // Made optional with ?
} 
 
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => { 
  const { user, isAuthenticated, isLoading } = useAuth(); 
  const location = useLocation(); 
 
  if (isLoading) { 
    return ( 
      <div className="min-h-screen flex items-center justify-center"> 
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div> 
      </div> 
    ); 
  } 
 
  if (!isAuthenticated) { 
    return <Navigate to="/login" state={{ from: location }} replace />; 
  } 
 
  // Only check roles if allowedRoles is provided and user exists
  if (allowedRoles && allowedRoles.length > 0 && user?.user?.role) {
    if (!allowedRoles.includes(user.user.role)) {
      return <Navigate to="/dashboard" replace />; 
    } 
  } 
 
  return <>{children}</>; 
}; 
 
export default ProtectedRoute;