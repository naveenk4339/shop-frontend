import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Orders from './pages/Orders.jsx';
import { api, getToken, setToken } from './api.js';

export default function App() {
  const [user, setUser] = useState(null);
  // Restore the session from a saved token before deciding where to route.
  const [checking, setChecking] = useState(Boolean(getToken()));

  useEffect(() => {
    if (!getToken()) return;
    api
      .me()
      .then(({ user }) => setUser(user))
      .catch(() => setToken(null))
      .finally(() => setChecking(false));
  }, []);

  const handleLogin = ({ token, user }) => {
    setToken(token);
    setUser(user);
  };

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch {
      // Log out locally even if the server call fails.
    }
    setToken(null);
    setUser(null);
  };

  if (checking) return <p className="loading">Loading…</p>;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />} />
      <Route element={user ? <Layout user={user} onLogout={handleLogout} /> : <Navigate to="/login" replace />}>
        <Route path="/home" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:orderId" element={<OrderConfirmation />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/home' : '/login'} replace />} />
    </Routes>
  );
}
