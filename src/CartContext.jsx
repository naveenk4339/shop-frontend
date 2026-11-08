import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from './api.js';

const CartContext = createContext(null);

// Holds the signed-in user's cart (and "Saved for later" list) so every page
// and the header count stay in sync.
export function CartProvider({ children }) {
  const [lines, setLines] = useState([]);
  const [saved, setSaved] = useState([]);
  const [error, setError] = useState('');
  const [loaded, setLoaded] = useState(false);

  const reload = useCallback(() => {
    // An older backend has no saved list; the cart still works without it.
    return Promise.all([api.cart(), api.saved().catch(() => [])])
      .then(([cart, savedItems]) => {
        setLines(cart);
        setSaved(savedItems);
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

  // For calls that return both lists ({ cart, saved }), since a move changes both.
  const runBoth = (call) =>
    run(async () => {
      const result = await call();
      setSaved(result.saved);
      return result.cart;
    });

  const qtyOf = (productId) => lines.find((l) => l.id === productId)?.qty || 0;

  const value = {
    lines,
    saved,
    loaded,
    error,
    reload,
    qtyOf,
    totalItems: lines.reduce((sum, l) => sum + l.qty, 0),
    totalPrice: lines.reduce((sum, l) => sum + l.price * l.qty, 0),
    setQty: (productId, qty) => run(() => api.setQty(productId, qty)),
    add: (productId) => run(() => api.setQty(productId, qtyOf(productId) + 1)),
    clear: () => run(() => api.clearCart()),
    saveForLater: (productId) => runBoth(() => api.saveForLater(productId)),
    moveToCart: (productId) => runBoth(() => api.moveToCart(productId)),
    removeSaved: (productId) => runBoth(() => api.removeSaved(productId)),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
