// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { user, token } = useSelector((state) => state.auth);

  console.log('🔒 ProtectedRoute check:', { hasUser: !!user, hasToken: !!token });

  if (!user || !token) {
    console.log('❌ Redirecting to login - no auth');
    return <Navigate to="/login" replace />;
  }

  console.log('✅ ProtectedRoute: Rendering children via Outlet');
  return <Outlet />;
};

export default ProtectedRoute;