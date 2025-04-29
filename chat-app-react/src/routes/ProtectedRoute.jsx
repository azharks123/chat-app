import React from 'react';
import { Navigate } from 'react-router-dom';
import { getUserToken } from '../services/auth.services';

const ProtectedRoute = ({ children, requiredRole='' }) => {
  const userToken = getUserToken()

  if (!userToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;