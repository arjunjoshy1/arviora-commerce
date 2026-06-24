import type {
  AdminSummary,
  Category,
  CreateCategoryRequest,
  CreateProductRequest,
  Order,
  OrderStatus,
  Product,
  SupportTicket,
  SupportTicketStatus,
  UpdateProductRequest,
} from '@arviora/shared';
import { apiFetch } from '../lib/http';

export const fetchAdminSummary = (): Promise<AdminSummary> =>
  apiFetch<AdminSummary>('/admin/summary');

export const fetchAdminProducts = (): Promise<Product[]> =>
  apiFetch<Product[]>('/products/admin');

export const createProduct = (body: CreateProductRequest): Promise<Product> =>
  apiFetch<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const updateProduct = (
  id: string,
  body: UpdateProductRequest,
): Promise<Product> =>
  apiFetch<Product>(`/products/admin/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  });

export const createCategory = (
  body: CreateCategoryRequest,
): Promise<Category> =>
  apiFetch<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const fetchAdminOrders = (): Promise<Order[]> =>
  apiFetch<Order[]>('/orders/admin');

export const updateOrderStatus = (
  id: string,
  status: OrderStatus,
): Promise<Order> =>
  apiFetch<Order>(`/orders/admin/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });

export const fetchAdminTickets = (): Promise<SupportTicket[]> =>
  apiFetch<SupportTicket[]>('/support/admin');

export const updateTicketStatus = (
  id: string,
  status: SupportTicketStatus,
): Promise<SupportTicket> =>
  apiFetch<SupportTicket>(`/support/admin/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
