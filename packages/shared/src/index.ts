/**
 * Shared types used by both the API and the web app.
 * Keeping these in one place means the frontend and backend can never
 * drift out of sync about the shape of a Product or Category.
 */

export type Role = 'CUSTOMER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'DISABLED';

/** A user as exposed by the API (never includes the password hash). */
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
}

/** Returned by login / register / refresh. */
export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Price in paise (smallest currency unit) to avoid floating-point money bugs. */
  priceInPaise: number;
  currency: string;
  imageUrl: string | null;
  /** Primary colour as a hex string, shown as a swatch dot. */
  color: string | null;
  stock: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

/** Standard shape for paginated list responses from the API. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

/** Convert a paise integer into a display string like "₹1,299.00". */
export function formatPrice(priceInPaise: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(priceInPaise / 100);
}
