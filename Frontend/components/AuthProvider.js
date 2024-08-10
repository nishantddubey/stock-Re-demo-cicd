// Import necessary libraries and hooks
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Create an authentication context
const AuthContext = createContext();

// AuthProvider component to wrap around child components
export const AuthProvider = ({ children, isAuthenticated: initialAuth }) => {
  // State to track authentication status
  const [isAuth, setIsAuth] = useState(initialAuth);
  // Get the Next.js router instance
  const router = useRouter();

  // Effect to redirect to login page if not authenticated
  useEffect(() => {
    if (!isAuth) {
      router.push('/login'); // Redirect to login page
    }
  }, [isAuth, router]); // Run this effect whenever isAuth or router changes

  return (
    // Provide authentication context to child components
    <AuthContext.Provider value={{ isAuth, setIsAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access the authentication context
export const useAuth = () => useContext(AuthContext);
