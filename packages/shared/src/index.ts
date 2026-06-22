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

export type OrderStatus =
  | 'PENDING'
  | 'PAID'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

/** A shipping address captured at checkout. */
export interface ShippingAddress {
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  /** Snapshot of the product name + price at purchase time. */
  name: string;
  priceInPaise: number;
  size: string;
  quantity: number;
}

export interface Order {
  id: string;
  status: OrderStatus;
  subtotalInPaise: number;
  currency: string;
  shipping: ShippingAddress;
  items: OrderItem[];
  createdAt: string;
}

/** Body for POST /orders — what the client sends to place an order. */
export interface PlaceOrderRequest {
  items: { productId: string; size: string; quantity: number }[];
  shipping: ShippingAddress;
}

/** A wishlisted product, as returned by the wishlist API. */
export interface WishlistItem {
  id: string;
  product: Product;
  createdAt: string;
}

/** A saved address in the user's address book. */
export interface Address {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  postalCode: string;
  isDefault: boolean;
}

/** A cart line, as stored server-side for a signed-in user. */
export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  priceInPaise: number;
  currency: string;
  color: string | null;
  size: string;
  quantity: number;
}

/** Convert a paise integer into a display string like "₹1,299.00". */
export function formatPrice(priceInPaise: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
  }).format(priceInPaise / 100);
}
