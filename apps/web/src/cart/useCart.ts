import type { Product } from '@arviora/shared';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import * as cart from '../store/cartSlice';

/**
 * Ergonomic cart hook backed by the Redux store. Components use this instead of
 * touching dispatch/selectors directly.
 */
export function useCart() {
  const dispatch = useAppDispatch();
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
    addItem: (product: Product, size: string, quantity = 1) =>
      dispatch(cart.addItem({ product, size, quantity })),
    updateQuantity: (productId: string, size: string, quantity: number) =>
      dispatch(cart.updateQuantity({ productId, size, quantity })),
    removeItem: (productId: string, size: string) =>
      dispatch(cart.removeItem({ productId, size })),
    clear: () => dispatch(cart.clear()),
  };
}
