import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { User } from '@arviora/shared';
import * as authApi from '../api/auth';
import { ApiError } from '../lib/http';
import type { RootState } from './store';

interface AuthState {
  user: User | null;
  /** True only during the initial silent session restore on app load. */
  initializing: boolean;
}

const initialState: AuthState = { user: null, initializing: true };

const errorMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError || err instanceof Error ? err.message : fallback;

// ---- Thunks ----

/** Restore a session from the httpOnly refresh cookie on app load. */
export const restoreSession = createAsyncThunk('auth/restore', async () => {
  const session = await authApi.refreshSession();
  return session?.user ?? null;
});

export const login = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const { user } = await authApi.login(email, password);
    return user;
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Sign in failed'));
  }
});

export const register = createAsyncThunk<
  User,
  { name: string; email: string; password: string },
  { rejectValue: string }
>('auth/register', async ({ name, email, password }, { rejectWithValue }) => {
  try {
    const { user } = await authApi.register(name, email, password);
    return user;
  } catch (err) {
    return rejectWithValue(errorMessage(err, 'Sign up failed'));
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await authApi.logout();
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initializing = false;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.user = null;
        state.initializing = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;

// ---- Selectors ----
export const selectUser = (s: RootState) => s.auth.user;
export const selectInitializing = (s: RootState) => s.auth.initializing;
export const selectIsAuthenticated = (s: RootState) => !!s.auth.user;
export const selectIsAdmin = (s: RootState) => s.auth.user?.role === 'ADMIN';
