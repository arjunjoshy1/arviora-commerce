import type { WishlistItem } from '@arviora/shared';
import { apiFetch } from '../lib/http';

export const fetchWishlist = (): Promise<WishlistItem[]> =>
  apiFetch<WishlistItem[]>('/wishlist');

export const addToWishlist = (productId: string): Promise<WishlistItem> =>
  apiFetch<WishlistItem>('/wishlist', {
    method: 'POST',
    body: JSON.stringify({ productId }),
  });

export const removeFromWishlist = (productId: string): Promise<void> =>
  apiFetch<void>(`/wishlist/${productId}`, { method: 'DELETE' });
