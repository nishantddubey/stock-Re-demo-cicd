import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '../utils/auth';

// Higher-Order Component to add authentication check
const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      // Check if user is not authenticated
      if (!isAuthenticated()) {
        router.push('/login'); // Redirect to login if not authenticated
      }
    }, []); // Empty dependency array means this effect runs once on mount

    // Double-check authentication status before rendering the component
    if (!isAuthenticated()) {
      return null; // Render nothing until redirect happens
    }

    // If authenticated, render the wrapped component with all props
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
