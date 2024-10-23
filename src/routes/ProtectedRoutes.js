import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);

  return token ? <Outlet /> : <Navigate to="auth/sign-in" />;
};

export default ProtectedRoute;
