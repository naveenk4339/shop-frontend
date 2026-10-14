export const formatPrice = (value) => `$${value.toFixed(2)}`;

export const MAX_QTY = 10;

// Estimated delivery: three days from the given date, e.g. "Friday, October 17".
export function deliveryDate(from = new Date()) {
  const date = new Date(from);
  date.setDate(date.getDate() + 3);
  return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

// The API returns SQLite UTC timestamps like "2026-10-14 07:07:04".
export function parseServerDate(value) {
  if (!value) return new Date();
  return new Date(value.includes('T') ? value : `${value.replace(' ', 'T')}Z`);
}

export const formatOrderDate = (value) =>
  parseServerDate(value).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

export const discountPercent = (price, listPrice) =>
  listPrice && listPrice > price ? Math.round((1 - price / listPrice) * 100) : 0;
