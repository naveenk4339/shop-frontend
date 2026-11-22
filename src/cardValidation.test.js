import { describe, expect, test } from 'vitest';
import { cardBrand, formatCardNumber, formatExpiry, validateCard } from './cardValidation.js';

// A fixed "today" so expiry checks don't depend on when the tests run.
const NOW = new Date(2026, 10, 11); // 11 Nov 2026
const valid = { name: 'Demo User', number: '4242 4242 4242 4242', expiry: '12/30', cvv: '123' };

describe('validateCard', () => {
  test('a valid card has no errors', () => {
    expect(validateCard(valid, NOW)).toEqual({});
  });

  test('card number: spaces and dashes are fine, a bad checksum is not', () => {
    expect(validateCard({ ...valid, number: '4242-4242-4242-4242' }, NOW)).toEqual({});
    expect(validateCard({ ...valid, number: '4242 4242 4242 4241' }, NOW).number).toBe('Enter a valid card number.');
  });

  test.each(['4242', '4'.repeat(20), 'abcd efgh ijkl mnop', ''])('card number %j is rejected', (number) => {
    expect(validateCard({ ...valid, number }, NOW).number).toBe('Enter a valid card number.');
  });

  test('name is required', () => {
    expect(validateCard({ ...valid, name: '  ' }, NOW).name).toBe('Enter the name on the card.');
  });

  test('expiry: this month is fine, last month has expired', () => {
    expect(validateCard({ ...valid, expiry: '11/26' }, NOW).expiry).toBeUndefined();
    expect(validateCard({ ...valid, expiry: '10/26' }, NOW).expiry).toBe('This card has expired.');
  });

  test.each(['13/30', '00/30', '1230', '12/2030', ''])('expiry %j is not MM/YY', (expiry) => {
    expect(validateCard({ ...valid, expiry }, NOW).expiry).toBe('Enter the expiry date as MM/YY.');
  });

  test('CVV is 3 digits, or 4 for American Express', () => {
    expect(validateCard({ ...valid, cvv: '12' }, NOW).cvv).toBe('Enter the 3-digit security code.');
    const amex = { ...valid, number: '3782 822463 10005' };
    expect(validateCard({ ...amex, cvv: '1234' }, NOW)).toEqual({});
    expect(validateCard({ ...amex, cvv: '123' }, NOW).cvv).toBe('Enter the 4-digit security code.');
  });

  test('an empty form reports every field at once', () => {
    const errors = validateCard({ name: '', number: '', expiry: '', cvv: '' }, NOW);
    expect(Object.keys(errors).sort()).toEqual(['cvv', 'expiry', 'name', 'number']);
  });
});

describe('cardBrand', () => {
  test.each([
    ['4242424242424242', 'Visa'],
    ['5555555555554444', 'Mastercard'],
    ['2223003122003222', 'Mastercard'],
    ['378282246310005', 'American Express'],
    ['6011111111111117', 'Discover'],
    ['9999999999999995', ''],
  ])('%s is %j', (digits, brand) => {
    expect(cardBrand(digits)).toBe(brand);
  });
});

describe('input formatters', () => {
  test('card number gets a space every 4 digits and drops anything else', () => {
    expect(formatCardNumber('4242424242424242')).toBe('4242 4242 4242 4242');
    expect(formatCardNumber('4242-42ab42')).toBe('4242 4242');
    expect(formatCardNumber('4242 ')).toBe('4242');
    expect(formatCardNumber('1'.repeat(25)).replace(/ /g, '')).toHaveLength(19);
  });

  test('expiry gets a slash after the month', () => {
    expect(formatExpiry('1')).toBe('1');
    expect(formatExpiry('12')).toBe('12');
    expect(formatExpiry('123')).toBe('12/3');
    expect(formatExpiry('1230')).toBe('12/30');
    expect(formatExpiry('12/309')).toBe('12/30');
  });
});
