import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

interface RequireAdminProps {
  children: React.ReactNode;
}

/**
 * Gates a route behind authentication AND the ADMIN role. Non-admins are sent
 * back to the storefront rather than to sign-in, since they may already be
 * signed in as a regular customer.
 */
const RequireAdmin = ({ children }: RequireAdminProps) => {
  const { isAuthenticated, isAdmin, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return null;

  if (!isAuthenticated) {
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default RequireAdmin;
