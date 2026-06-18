import { describe, it, expect } from 'vitest';
import { normalizeEmail, slugify } from './strings';

describe('normalizeEmail', () => {
  it('lowercases and trims', () => {
    expect(normalizeEmail('  User@Example.COM ')).toBe('user@example.com');
  });

  it('leaves an already-normal email unchanged', () => {
    expect(normalizeEmail('a@b.com')).toBe('a@b.com');
  });
});

describe('slugify', () => {
  it('lowercases and hyphenates spaces', () => {
    expect(slugify('Sleeveless Cotton Kurta')).toBe('sleeveless-cotton-kurta');
  });

  it('strips punctuation and collapses separators', () => {
    expect(slugify('  Hand-block  Print!! Kurta ')).toBe(
      'hand-block-print-kurta',
    );
  });

  it('trims leading/trailing hyphens', () => {
    expect(slugify('--Hello--')).toBe('hello');
  });
});
