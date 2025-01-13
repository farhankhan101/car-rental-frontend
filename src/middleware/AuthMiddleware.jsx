import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
const AuthMiddleware = ({ children, requiredRole }) => {
  const authToken = Cookies.get('authToken');

  // Early return if no token exists
  if (!authToken) {
    console.log('No auth token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(authToken);
    console.log('Decoded Token:', decodedToken);

    const { role } = decodedToken;

    // Handle role-based access
    if (requiredRole && role !== requiredRole) {
      console.log(`Role mismatch: Required ${requiredRole}, got ${role}`);
      const redirectPath = role === 'Lister' ? '/dashboard' : '/';
      return <Navigate to={redirectPath} replace />;
    }

    console.log('Access granted:', { role, requiredRole });
    return children;

  } catch (error) {
    console.error('Token validation failed:', error);
    Cookies.remove('authToken'); // Clear invalid token
    return <Navigate to="/login" replace />;
  }
};

export default AuthMiddleware;