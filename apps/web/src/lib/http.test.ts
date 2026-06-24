import { describe, it, expect } from 'vitest';
import { ApiError, getAccessToken, setAccessToken } from './http';

describe('access token store', () => {
  it('starts empty, stores, and clears', () => {
    setAccessToken(null);
    expect(getAccessToken()).toBeNull();

    setAccessToken('abc.def.ghi');
    expect(getAccessToken()).toBe('abc.def.ghi');

    setAccessToken(null);
    expect(getAccessToken()).toBeNull();
  });
});

describe('ApiError', () => {
  it('carries a message and status code', () => {
    const err = new ApiError('Invalid email or password', 401);
    expect(err).toBeInstanceOf(Error);
    expect(err.name).toBe('ApiError');
    expect(err.message).toBe('Invalid email or password');
    expect(err.status).toBe(401);
  });
});
