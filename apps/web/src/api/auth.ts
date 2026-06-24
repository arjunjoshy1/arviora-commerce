import type { AuthResponse, User } from '@arviora/shared';
import { apiFetch, setAccessToken } from '../lib/http';

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setAccessToken(data.accessToken);
  return data;
}

export async function register(
  name: string,
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setAccessToken(data.accessToken);
  return data;
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(
  token: string,
  newPassword: string,
): Promise<{ success: boolean }> {
  return apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, newPassword }),
  });
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' });
  } finally {
    setAccessToken(null);
  }
}

export function getMe(): Promise<User> {
  return apiFetch<User>('/auth/me');
}

export function updateProfile(name: string): Promise<User> {
  return apiFetch<User>('/auth/me', {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
}

export function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean }> {
  return apiFetch('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

/** Silent session restore on app load. Returns the session or null. */
export async function refreshSession(): Promise<AuthResponse | null> {
  try {
    const data = await apiFetch<AuthResponse>(
      '/auth/refresh',
      { method: 'POST' },
      false,
    );
    setAccessToken(data.accessToken);
    return data;
  } catch {
    setAccessToken(null);
    return null;
  }
}
