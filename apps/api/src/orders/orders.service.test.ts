import { describe, it, expect } from 'vitest';
import type { Order, OrderItem } from '@prisma/client';
import { toApiOrder } from './orders.service';

const baseOrder: Order & { items: OrderItem[] } = {
  id: 'o1',
  userId: 'u1',
  status: 'PENDING',
  subtotalInPaise: 159800,
  currency: 'INR',
  shippingName: 'Asha',
  shippingPhone: '9876543210',
  shippingLine1: '12 MG Road',
  shippingLine2: null,
  shippingCity: 'Bengaluru',
  shippingState: 'KA',
  shippingPostalCode: '560001',
  createdAt: new Date('2026-06-20T18:56:53.127Z'),
  updatedAt: new Date('2026-06-20T18:56:53.127Z'),
  items: [
    {
      id: 'oi1',
      orderId: 'o1',
      productId: 'p1',
      name: 'Organic Cotton Tee',
      priceInPaise: 79900,
      size: 'M',
      quantity: 2,
    },
  ],
};

describe('toApiOrder', () => {
  it('maps a Prisma order to the API shape', () => {
    const api = toApiOrder(baseOrder);
    expect(api.id).toBe('o1');
    expect(api.status).toBe('PENDING');
    expect(api.subtotalInPaise).toBe(159800);
    expect(api.createdAt).toBe('2026-06-20T18:56:53.127Z');
  });

  it('nests the shipping address and converts null line2 to undefined', () => {
    const api = toApiOrder(baseOrder);
    expect(api.shipping).toEqual({
      name: 'Asha',
      phone: '9876543210',
      line1: '12 MG Road',
      line2: undefined,
      city: 'Bengaluru',
      state: 'KA',
      postalCode: '560001',
    });
  });

  it('maps order items to snapshots without internal fields', () => {
    const api = toApiOrder(baseOrder);
    expect(api.items).toHaveLength(1);
    expect(api.items[0]).toEqual({
      id: 'oi1',
      productId: 'p1',
      name: 'Organic Cotton Tee',
      priceInPaise: 79900,
      size: 'M',
      quantity: 2,
    });
  });
});
