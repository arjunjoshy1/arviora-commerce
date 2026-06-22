import type { CartLine } from '@arviora/shared';
import { apiFetch } from '../lib/http';

export const fetchCart = (): Promise<CartLine[]> =>
  apiFetch<CartLine[]>('/cart');

/** Merge a guest cart into the signed-in user's DB cart. */
export const syncCart = (
  items: { productId: string; size: string; quantity: number }[],
): Promise<CartLine[]> =>
  apiFetch<CartLine[]>('/cart/sync', {
    method: 'POST',
    body: JSON.stringify({ items }),
  });

export const upsertCartItem = (
  productId: string,
  size: string,
  quantity: number,
): Promise<void> =>
  apiFetch<void>('/cart/items', {
    method: 'PUT',
    body: JSON.stringify({ productId, size, quantity }),
  });

export const removeCartItem = (
  productId: string,
  size: string,
): Promise<void> =>
  apiFetch<void>(
    `/cart/items?productId=${encodeURIComponent(productId)}&size=${encodeURIComponent(size)}`,
    { method: 'DELETE' },
  );

export const clearCart = (): Promise<void> =>
  apiFetch<void>('/cart', { method: 'DELETE' });
