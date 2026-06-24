import { describe, it, expect } from 'vitest';
import type { User } from '@arviora/shared';
import reducer, { restoreSession, login, logout } from './authSlice';

const user: User = {
  id: 'u1',
  email: 'a@b.com',
  name: 'Asha Rao',
  role: 'CUSTOMER',
  status: 'ACTIVE',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const initial = () => reducer(undefined, { type: '@@INIT' });

describe('authSlice', () => {
  it('starts initializing with no user', () => {
    const state = initial();
    expect(state.user).toBeNull();
    expect(state.initializing).toBe(true);
  });

  it('restoreSession.fulfilled sets the user and finishes initializing', () => {
    const state = reducer(
      initial(),
      restoreSession.fulfilled(user, 'req', undefined),
    );
    expect(state.user).toEqual(user);
    expect(state.initializing).toBe(false);
  });

  it('restoreSession.rejected clears the user and finishes initializing', () => {
    const state = reducer(
      initial(),
      restoreSession.rejected(new Error('no session'), 'req', undefined),
    );
    expect(state.user).toBeNull();
    expect(state.initializing).toBe(false);
  });

  it('login.fulfilled sets the user', () => {
    const state = reducer(
      initial(),
      login.fulfilled(user, 'req', { email: 'a@b.com', password: 'x' }),
    );
    expect(state.user).toEqual(user);
  });

  it('logout.fulfilled clears the user', () => {
    const loggedIn = reducer(
      initial(),
      login.fulfilled(user, 'req', { email: 'a@b.com', password: 'x' }),
    );
    const state = reducer(
      loggedIn,
      logout.fulfilled(undefined, 'req', undefined),
    );
    expect(state.user).toBeNull();
  });
});
