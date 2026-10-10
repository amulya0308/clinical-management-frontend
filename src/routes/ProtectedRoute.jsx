import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '../components/Loader';
import { ROLES } from '../utils/constants';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader message="Verifying authentication..." size="lg" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to user's authorized role dashboard
    switch (role) {
      case ROLES.ADMIN:
        return <Navigate to="/admin/dashboard" replace />;
      case ROLES.DOCTOR:
        return <Navigate to="/doctor/dashboard" replace />;
      case ROLES.PATIENT:
        return <Navigate to="/patient/dashboard" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
