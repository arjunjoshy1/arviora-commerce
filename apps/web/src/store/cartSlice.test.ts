import { describe, it, expect } from 'vitest';
import type { Product } from '@arviora/shared';
import reducer, {
  addItem,
  updateQuantity,
  removeItem,
  clear,
  openCart,
  closeCart,
  selectCartCount,
  selectCartSubtotal,
  type CartItem,
} from './cartSlice';
import type { RootState } from './store';

const product = (over: Partial<Product> = {}): Product => ({
  id: 'p1',
  slug: 'tee',
  name: 'Organic Cotton Tee',
  description: '',
  priceInPaise: 79900,
  currency: 'INR',
  imageUrl: null,
  images: [],
  color: null,
  isActive: true,
  stock: 10,
  category: { id: 'c1', name: 'Clothing', slug: 'clothing' },
  createdAt: '',
  updatedAt: '',
  ...over,
});

const initial = () => reducer(undefined, { type: '@@INIT' });
const withItems = (items: CartItem[]) => ({ items, isOpen: false });
const rootWith = (items: CartItem[]) =>
  ({ cart: withItems(items) }) as unknown as RootState;

describe('cartSlice — addItem', () => {
  it('adds a new line', () => {
    const state = reducer(
      initial(),
      addItem({ product: product(), size: 'M' }),
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({
      productId: 'p1',
      size: 'M',
      quantity: 1,
      priceInPaise: 79900,
    });
  });

  it('merges quantity for the same product + size', () => {
    let state = reducer(initial(), addItem({ product: product(), size: 'M' }));
    state = reducer(
      state,
      addItem({ product: product(), size: 'M', quantity: 2 }),
    );
    expect(state.items).toHaveLength(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('keeps different sizes as separate lines', () => {
    let state = reducer(initial(), addItem({ product: product(), size: 'M' }));
    state = reducer(state, addItem({ product: product(), size: 'L' }));
    expect(state.items).toHaveLength(2);
  });
});

describe('cartSlice — updateQuantity', () => {
  it('updates the quantity of a line', () => {
    const start = withItems([{ ...buildItem(), quantity: 1 }]);
    const state = reducer(
      start,
      updateQuantity({ productId: 'p1', size: 'M', quantity: 5 }),
    );
    expect(state.items[0].quantity).toBe(5);
  });

  it('removes the line when quantity drops to zero', () => {
    const start = withItems([{ ...buildItem(), quantity: 1 }]);
    const state = reducer(
      start,
      updateQuantity({ productId: 'p1', size: 'M', quantity: 0 }),
    );
    expect(state.items).toHaveLength(0);
  });
});

describe('cartSlice — removeItem & clear', () => {
  it('removes a specific line', () => {
    const start = withItems([
      buildItem({ size: 'M' }),
      buildItem({ size: 'L' }),
    ]);
    const state = reducer(start, removeItem({ productId: 'p1', size: 'M' }));
    expect(state.items).toHaveLength(1);
    expect(state.items[0].size).toBe('L');
  });

  it('clears the whole cart', () => {
    const start = withItems([buildItem()]);
    expect(reducer(start, clear()).items).toHaveLength(0);
  });
});

describe('cartSlice — drawer', () => {
  it('opens and closes', () => {
    let state = reducer(initial(), openCart());
    expect(state.isOpen).toBe(true);
    state = reducer(state, closeCart());
    expect(state.isOpen).toBe(false);
  });
});

describe('cartSlice — selectors', () => {
  it('counts total units and sums the subtotal', () => {
    const root = rootWith([
      buildItem({ quantity: 2, priceInPaise: 10000 }),
      buildItem({ size: 'L', quantity: 1, priceInPaise: 5000 }),
    ]);
    expect(selectCartCount(root)).toBe(3);
    expect(selectCartSubtotal(root)).toBe(25000);
  });
});

function buildItem(over: Partial<CartItem> = {}): CartItem {
  return {
    productId: 'p1',
    slug: 'tee',
    name: 'Organic Cotton Tee',
    imageUrl: null,
    priceInPaise: 79900,
    currency: 'INR',
    color: null,
    size: 'M',
    quantity: 1,
    ...over,
  };
}
