const TOKEN_KEY = 'shop_token';

// Where the shop-backend API lives. Empty means "same origin", which uses the
// Vite dev proxy locally. Set VITE_API_URL when the backend is hosted elsewhere.
const API_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) =>
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = getToken();
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
  // A non-JSON error means the dev proxy could not reach the backend.
  if (!data && !res.ok) {
    throw new Error('Cannot reach the server. Make sure shop-backend is running.');
  }
  if (!res.ok) {
    const error = new Error(data.error || `Request failed (${res.status})`);
    error.fields = data.fields;
    throw error;
  }
  return data;
}

export const api = {
  register: (email, password) => request('/register', { method: 'POST', body: { email, password } }),
  login: (email, password) => request('/login', { method: 'POST', body: { email, password } }),
  logout: () => request('/logout', { method: 'POST' }),
  me: () => request('/me'),
  products: () => request('/products'),
  cart: () => request('/cart'),
  setQty: (productId, qty) => request(`/cart/${productId}`, { method: 'PUT', body: { qty } }),
  clearCart: () => request('/cart', { method: 'DELETE' }),
  checkout: (card) => request('/checkout', { method: 'POST', body: { card } }),
  order: (orderId) => request(`/orders/${encodeURIComponent(orderId)}`),
};
