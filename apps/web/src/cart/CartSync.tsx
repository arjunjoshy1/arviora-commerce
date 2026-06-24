import { useEffect, useRef } from 'react';
import * as cartApi from '../api/cart';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { selectCartItems, setItems, clear } from '../store/cartSlice';
import { useAuth } from '../auth/useAuth';

/**
 * Renders nothing — just keeps the DB cart in sync with auth state.
 * On sign-in, merges whatever's in the local/guest cart into the user's DB
 * cart (so it follows them across devices). On logout, wipes the local cart
 * so the next guest on this device doesn't see the previous user's items.
 */
const CartSync = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, initializing } = useAuth();
  const items = useAppSelector(selectCartItems);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  const syncedRef = useRef(false);
  const prevAuthRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (initializing) return;
    const wasAuthenticated = prevAuthRef.current;
    prevAuthRef.current = isAuthenticated;

    if (isAuthenticated && !syncedRef.current) {
      syncedRef.current = true;
      const guestLines = itemsRef.current.map(
        ({ productId, size, quantity }) => ({ productId, size, quantity }),
      );
      const load =
        guestLines.length > 0
          ? cartApi.syncCart(guestLines)
          : cartApi.fetchCart();
      load.then((merged) => dispatch(setItems(merged))).catch(() => undefined);
    }

    if (!isAuthenticated && wasAuthenticated) {
      syncedRef.current = false;
      dispatch(clear());
    }
  }, [isAuthenticated, initializing, dispatch]);

  return null;
};

export default CartSync;
