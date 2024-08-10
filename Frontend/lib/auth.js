// lib/auth.js

// Function to check if the user is authenticated
export const isAuthenticated = () => {
  // Retrieve the auth token from local storage
  // The double negation (!!) converts the value to a boolean
  // If the token exists, it returns true; otherwise, it returns false
  return !!localStorage.getItem('authToken'); // Adjust based on your auth logic
};
