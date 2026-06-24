import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Gates a route behind authentication. While the initial session restore is in
 * flight we render nothing; if the user isn't signed in we redirect to sign-in,
 * remembering where they were headed so we can return them after login.
 */
const RequireAuth = ({ children }: RequireAuthProps) => {
  const { isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return null;

  if (!isAuthenticated) {
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
