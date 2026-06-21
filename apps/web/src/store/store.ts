import { configureStore } from '@reduxjs/toolkit';
import cartReducer, { type CartItem } from './cartSlice';
import authReducer from './authSlice';

const CART_STORAGE_KEY = 'arviora_cart_v1';

/** Load persisted cart items from localStorage (used as preloaded state). */
function loadCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
  preloadedState: {
    cart: { items: loadCartItems(), isOpen: false },
  },
});

// Persist only the cart items whenever they change.
let lastItems = store.getState().cart.items;
store.subscribe(() => {
  const items = store.getState().cart.items;
  if (items !== lastItems) {
    lastItems = items;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage unavailable — ignore */
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
