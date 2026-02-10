import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomeRedirector: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/post" replace />;
  } else {
    return <Navigate to="/view" replace />;
  }
};

export default HomeRedirector;