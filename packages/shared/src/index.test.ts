import { describe, it, expect } from 'vitest';
import { formatPrice } from './index';

describe('formatPrice', () => {
  it('formats paise as Indian rupees', () => {
    // ₹1,299.00 = 129900 paise
    expect(formatPrice(129900)).toBe('₹1,299.00');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('₹0.00');
  });

  it('formats sub-rupee amounts', () => {
    expect(formatPrice(50)).toBe('₹0.50');
  });
});
