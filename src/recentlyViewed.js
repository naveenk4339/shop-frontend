// Products the shopper opened most recently, newest first, kept in this browser only.
const KEY = 'shop_recently_viewed';
const LIMIT = 8;

export function getRecentlyViewed() {
  try {
    const ids = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(ids) ? ids.filter(Number.isInteger) : [];
  } catch {
    return []; // storage blocked or the saved value is corrupt
  }
}

export function addRecentlyViewed(productId) {
  const ids = [productId, ...getRecentlyViewed().filter((id) => id !== productId)].slice(0, LIMIT);
  try {
    localStorage.setItem(KEY, JSON.stringify(ids));
  } catch {
    // Not being able to remember history is harmless.
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}
