import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext'; // Import your authentication context

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Access the current user's authentication status

  if (!isAuthenticated) {
    // If the user is not authenticated, redirect them to the login page
    return <Navigate to="/login" />;
  }

  // If the user is authenticated, allow them to access the child routes
  return children;
};

export default ProtectedRoute;
