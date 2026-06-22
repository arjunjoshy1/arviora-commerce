import type { Product } from '@arviora/shared';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import * as cart from '../store/cartSlice';
import * as cartApi from '../api/cart';
import { useAuth } from '../auth/useAuth';

/**
 * Ergonomic cart hook backed by the Redux store. Components use this instead of
 * touching dispatch/selectors directly. For signed-in users, every mutation is
 * also persisted to the DB cart (fire-and-forget) so it follows them across
 * devices; guests keep using the local/localStorage-only cart.
 */
export function useCart() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const items = useAppSelector(cart.selectCartItems);
  const count = useAppSelector(cart.selectCartCount);
  const subtotalInPaise = useAppSelector(cart.selectCartSubtotal);
  const isOpen = useAppSelector(cart.selectCartOpen);

  return {
    items,
    count,
    subtotalInPaise,
    isOpen,
    openCart: () => dispatch(cart.openCart()),
    closeCart: () => dispatch(cart.closeCart()),
    addItem: (product: Product, size: string, quantity = 1) => {
      dispatch(cart.addItem({ product, size, quantity }));
      if (isAuthenticated) {
        const existing = items.find(
          (i) => i.productId === product.id && i.size === size,
        );
        const newQuantity = (existing?.quantity ?? 0) + quantity;
        cartApi
          .upsertCartItem(product.id, size, newQuantity)
          .catch(() => undefined);
      }
    },
    updateQuantity: (productId: string, size: string, quantity: number) => {
      dispatch(cart.updateQuantity({ productId, size, quantity }));
      if (isAuthenticated) {
        cartApi
          .upsertCartItem(productId, size, quantity)
          .catch(() => undefined);
      }
    },
    removeItem: (productId: string, size: string) => {
      dispatch(cart.removeItem({ productId, size }));
      if (isAuthenticated) {
        cartApi.removeCartItem(productId, size).catch(() => undefined);
      }
    },
    clear: () => {
      dispatch(cart.clear());
      if (isAuthenticated) {
        cartApi.clearCart().catch(() => undefined);
      }
    },
  };
}
