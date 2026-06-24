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
  /** Full gallery for the product detail carousel; mirrors [imageUrl] at minimum. */
  images: string[];
  /** Primary colour as a hex string, shown as a swatch dot. */
  color: string | null;
  stock: number;
  /** Soft-delete flag; inactive products are hidden from the public catalogue. */
  isActive: boolean;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

/** Body for POST /products (admin only). */
export interface CreateProductRequest {
  name: string;
  description?: string;
  priceInPaise: number;
  currency?: string;
  imageUrl?: string;
  images?: string[];
  color?: string;
  stock?: number;
  categorySlug: string;
}

/** Body for POST /categories (admin only). */
export interface CreateCategoryRequest {
  name: string;
}

/** Body for PATCH /products/admin/:id (admin only). All fields optional. */
export interface UpdateProductRequest {
  name?: string;
  description?: string;
  priceInPaise?: number;
  currency?: string;
  imageUrl?: string;
  images?: string[];
  color?: string;
  stock?: number;
  categorySlug?: string;
  isActive?: boolean;
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
  /** Present only on admin list responses. */
  userName?: string;
  userEmail?: string;
}

/** Body for PATCH /orders/admin/:id/status (admin only). */
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
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

export type SupportTicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';

/** A customer support ticket raised against a specific order. */
export interface SupportTicket {
  id: string;
  orderId: string;
  subject: string;
  message: string;
  status: SupportTicketStatus;
  createdAt: string;
  /** Present only on admin list responses. */
  userName?: string;
  userEmail?: string;
}

/** Body for POST /support — what the client sends to raise a ticket. */
export interface CreateTicketRequest {
  orderId: string;
  subject: string;
  message: string;
}

/** Body for PATCH /support/admin/:id/status (admin only). */
export interface UpdateTicketStatusRequest {
  status: SupportTicketStatus;
}

/** Returned by GET /admin/summary — the admin dashboard landing page. */
export interface AdminSummary {
  totalProducts: number;
  totalOrders: number;
  totalRevenueInPaise: number;
  openTickets: number;
  totalUsers: number;
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
