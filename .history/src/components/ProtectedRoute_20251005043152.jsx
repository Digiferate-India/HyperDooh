// Create this new file at: src/components/ProtectedRoute.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

function ProtectedRoute({ children }) {
  const { isLoading, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    // If the user is not loading and is not authenticated, redirect
    if (!isLoading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isLoading, isAuthenticated, navigate]);

  // While loading, show a spinner or a message
  if (isLoading) {
    return <div>Loading user...</div>;
  }

  // If authenticated, render the page
  if (isAuthenticated) {
    return children;
  }

  // If not authenticated (and not loading), this will be null while redirecting
  return null;
}

export default ProtectedRoute;