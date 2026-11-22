import { describe, expect, test } from 'vitest';
import { deliveryDate, discountPercent, formatOrderDate, formatPrice, parseServerDate } from './format.js';

describe('formatPrice', () => {
  test('always shows two decimals', () => {
    expect(formatPrice(4.99)).toBe('$4.99');
    expect(formatPrice(5)).toBe('$5.00');
    expect(formatPrice(0.1 + 0.2)).toBe('$0.30');
    expect(formatPrice(274.95)).toBe('$274.95');
  });
});

describe('discountPercent', () => {
  test('rounds to a whole percent', () => {
    expect(discountPercent(129.99, 179.99)).toBe(28);
    expect(discountPercent(4.99, 5.49)).toBe(9);
  });

  test('is 0 when there is no real discount', () => {
    expect(discountPercent(5.49, null)).toBe(0);
    expect(discountPercent(5.49, 5.49)).toBe(0);
    expect(discountPercent(6, 5)).toBe(0);
  });
});

describe('dates', () => {
  test('delivery is three days later, across month ends', () => {
    expect(deliveryDate(new Date(2026, 9, 14))).toBe('Saturday, October 17');
    expect(deliveryDate(new Date(2026, 9, 30))).toBe('Monday, November 2');
  });

  test('SQLite timestamps are read as UTC', () => {
    expect(parseServerDate('2026-10-14 07:07:04').toISOString()).toBe('2026-10-14T07:07:04.000Z');
    expect(parseServerDate('2026-10-14T07:07:04.000Z').toISOString()).toBe('2026-10-14T07:07:04.000Z');
  });

  test('order dates read like "October 14, 2026"', () => {
    expect(formatOrderDate('2026-10-14 12:00:00')).toBe('October 14, 2026');
  });
});
