import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const CartContext = createContext(null);

// Holds the signed-in user's cart so every page (and the header count) stays in sync.
export function CartProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(() => {
    return api
      .cart()
      .then((cart) => {
        setLines(cart);
        setError('');
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  const run = async (call) => {
    try {
      setLines(await call());
      setError('');
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const qtyOf = (productId) => lines.find((l) => l.id === productId)?.qty || 0;

  const value = {
    lines,
    loaded,
    error,
    reload,
    qtyOf,
    totalItems: lines.reduce((sum, l) => sum + l.qty, 0),
    totalPrice: lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    setQty: (productId, qty) => run(() => api.setQty(productId, qty)),
    add: (productId) => run(() => api.setQty(productId, qtyOf(productId) + 1)),
    clear: () => run(() => api.clearCart()),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
