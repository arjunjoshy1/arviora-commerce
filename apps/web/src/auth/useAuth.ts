import type { User } from '@arviora/shared';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import * as auth from '../store/authSlice';

/**
 * Ergonomic auth hook backed by the Redux store. login/register/logout dispatch
 * thunks; login/register resolve to the User or throw (for toast handling).
 */
export function useAuth() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(auth.selectUser);
  const initializing = useAppSelector(auth.selectInitializing);
  const isAuthenticated = useAppSelector(auth.selectIsAuthenticated);
  const isAdmin = useAppSelector(auth.selectIsAdmin);

  return {
    user,
    initializing,
    isAuthenticated,
    isAdmin,
    login: (email: string, password: string): Promise<User> =>
      dispatch(auth.login({ email, password })).unwrap(),
    register: (name: string, email: string, password: string): Promise<User> =>
      dispatch(auth.register({ name, email, password })).unwrap(),
    logout: () => dispatch(auth.logout()).unwrap(),
  };
}
