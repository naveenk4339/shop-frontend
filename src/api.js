const TOKEN_KEY = 'shop_token';
export const SESSION_ENDED_EVENT = 'shop:session-ended';

// Where the shop-backend API lives. Empty means "same origin", which uses the
// Vite dev proxy locally. Set VITE_API_URL when the backend is hosted elsewhere.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

export function clearSession() {
  setToken(null);
  window.dispatchEvent(new Event(SESSION_ENDED_EVENT));
}

async function request(path, { method = 'GET', body, authenticated = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = authenticated ? getToken() : null;
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${API_URL}/api${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the server. Make sure shop-backend is running.');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    // A response for an older session must not clear a newer token.
    if (res.status === 401 && token && getToken() === token) {
      clearSession();
    }
    const error = new Error(data?.error || `Request failed (${res.status})`);
    error.status = res.status;
    error.fields = data?.fields;
    throw error;
  }
  return data;
}

export const api = {
  register: (email, password) => request('/register', { method: 'POST', body: { email, password }, authenticated: false }),
  login: (email, password) => request('/login', { method: 'POST', body: { email, password }, authenticated: false }),
  logout: () => request('/logout', { method: 'POST' }),
  me: () => request('/me'),
  products: () => request('/products', { authenticated: false }),
  cart: () => request('/cart'),
  setQty: (productId, qty) => request(`/cart/${productId}`, { method: 'PUT', body: { qty } }),
  clearCart: () => request('/cart', { method: 'DELETE' }),
  checkout: (card) => request('/checkout', { method: 'POST', body: { card } }),
  orders: () => request('/orders'),
  order: (orderId) => request(`/orders/${encodeURIComponent(orderId)}`),
};
