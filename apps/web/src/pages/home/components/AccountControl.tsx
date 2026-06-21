import { Link } from 'react-router-dom';
import { useAuth } from '../../../auth/useAuth';
import { useToast } from '../../../components/Toast';

/** Shows Sign in when logged out, or the user's name + a logout control. */
const AccountControl = () => {
  const { user, initializing, logout } = useAuth();
  const toast = useToast();

  const handleLogout = async () => {
    await logout();
    toast('Signed out', 'info');
  };

  if (initializing) {
    return (
      <div className="ml-auto h-9 w-20 animate-pulse rounded-full bg-surface sm:ml-0" />
    );
  }

  if (!user) {
    return (
      <Link
        to="/signin"
        className="ml-auto rounded-full px-4 py-2 text-sm font-medium hover:text-ink sm:ml-0"
      >
        Sign in
      </Link>
    );
  }

  const initial = user.name.trim().charAt(0).toUpperCase() || 'U';

  return (
    <div className="ml-auto flex items-center gap-2 sm:ml-0">
      <span className="hidden items-center gap-2 sm:flex">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-xs font-semibold text-white">
          {initial}
        </span>
        <span className="text-sm font-medium">
          {user.name.split(' ')[0]}
          {user.role === 'ADMIN' && (
            <span className="ml-1.5 rounded-full bg-ink px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
              Admin
            </span>
          )}
        </span>
      </span>
      <button
        onClick={handleLogout}
        className="rounded-full px-3 py-2 text-sm font-medium text-muted transition hover:text-ink"
      >
        Sign out
      </button>
    </div>
  );
};

export default AccountControl;
