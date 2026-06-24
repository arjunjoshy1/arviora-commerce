import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartLine, Product } from '@arviora/shared';
import type { RootState } from './store';

/** A single line in the cart — a product snapshot at a chosen size. */
export type CartItem = CartLine;

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

const initialState: CartState = { items: [], isOpen: false };

/** A line is uniquely identified by product + chosen size. */
const sameLine = (i: CartItem, productId: string, size: string) =>
  i.productId === productId && i.size === size;

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<{
        product: Product;
        size: string;
        quantity?: number;
      }>,
    ) => {
      const { product, size, quantity = 1 } = action.payload;
      const existing = state.items.find((i) => sameLine(i, product.id, size));
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          imageUrl: product.imageUrl,
          priceInPaise: product.priceInPaise,
          currency: product.currency,
          color: product.color,
          size,
          quantity,
        });
      }
    },

    updateQuantity: (
      state,
      action: PayloadAction<{
        productId: string;
        size: string;
        quantity: number;
      }>,
    ) => {
      const { productId, size, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter((i) => !sameLine(i, productId, size));
        return;
      }
      const item = state.items.find((i) => sameLine(i, productId, size));
      if (item) item.quantity = quantity;
    },

    removeItem: (
      state,
      action: PayloadAction<{ productId: string; size: string }>,
    ) => {
      const { productId, size } = action.payload;
      state.items = state.items.filter((i) => !sameLine(i, productId, size));
    },

    clear: (state) => {
      state.items = [];
    },

    /** Replace the cart wholesale — used to load/merge the DB cart on login. */
    setItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
    },

    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
  },
});

export const {
  addItem,
  updateQuantity,
  removeItem,
  clear,
  setItems,
  openCart,
  closeCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// ---- Selectors ----
export const selectCartItems = (s: RootState) => s.cart.items;
export const selectCartOpen = (s: RootState) => s.cart.isOpen;
export const selectCartCount = (s: RootState) =>
  s.cart.items.reduce((n, i) => n + i.quantity, 0);
export const selectCartSubtotal = (s: RootState) =>
  s.cart.items.reduce((n, i) => n + i.priceInPaise * i.quantity, 0);
