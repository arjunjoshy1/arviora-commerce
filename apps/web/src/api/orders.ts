import type { Order, PlaceOrderRequest } from '@arviora/shared';
import { apiFetch } from '../lib/http';

export const placeOrder = (body: PlaceOrderRequest): Promise<Order> =>
  apiFetch<Order>('/orders', {
    method: 'POST',
    body: JSON.stringify(body),
  });

export const fetchOrders = (): Promise<Order[]> => apiFetch<Order[]>('/orders');

export const fetchOrder = (id: string): Promise<Order> =>
  apiFetch<Order>(`/orders/${id}`);
