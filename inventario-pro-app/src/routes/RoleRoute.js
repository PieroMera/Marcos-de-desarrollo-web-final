import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RoleRoute({ roles }) {
  const { user } = useAuth();

  if (roles && !roles.includes(user?.rol)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export default RoleRoute;
