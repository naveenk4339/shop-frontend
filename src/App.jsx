import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Login from './pages/Login.jsx';
import Home from './pages/Home.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderConfirmation from './pages/OrderConfirmation.jsx';
import Orders from './pages/Orders.jsx';
import Product from './pages/Product.jsx';
import { api, clearSession, getToken, SESSION_ENDED_EVENT, setToken } from './api.js';

export default function App() {
  const [user, setUser] = useState(null);
  // Restore the session from a saved token before deciding where to route.
  const [checking, setChecking] = useState(Boolean(getToken()));
  const [restoreAttempt, setRestoreAttempt] = useState(0);
  const [restoreError, setRestoreError] = useState('');
  const [logoutFailed, setLogoutFailed] = useState(false);

  useEffect(() => {
    const endSession = () => {
      setUser(null);
      setRestoreError('');
      setLogoutFailed(false);
    };
    window.addEventListener(SESSION_ENDED_EVENT, endSession);
    return () => window.removeEventListener(SESSION_ENDED_EVENT, endSession);
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setChecking(false);
      return;
    }
    let active = true;
    api
      .me()
      .then(({ user }) => {
        if (active && getToken() === token) setUser(user);
      })
      .catch((err) => {
        if (active && err.status !== 401) setRestoreError(err.message);
      })
      .finally(() => {
        if (active) setChecking(false);
      });
    return () => { active = false; };
  }, [restoreAttempt]);

  const retryRestore = () => {
    setRestoreError('');
    setChecking(true);
    setRestoreAttempt((attempt) => attempt + 1);
  };

  const handleLogin = ({ token, user }) => {
    setToken(token);
    setUser(user);
  };

  const handleLogout = async () => {
    const token = getToken();
    setLogoutFailed(false);
    try {
      await api.logout();
    } catch (err) {
      if (err.status !== 401 && getToken() === token) {
        setLogoutFailed(true);
      }
      return;
    }
    if (getToken() === token) clearSession();
  };

  if (checking) return <p className="loading">Loading…</p>;
  if (restoreError) {
    return (
      <div className="loading">
        <p role="alert">Could not restore your session. {restoreError}</p>
        <button type="button" className="btn btn-primary" onClick={retryRestore}>Try again</button>
        <p>Signing out on this device may leave the server session active.</p>
        <button type="button" className="btn btn-secondary" onClick={clearSession}>Sign out on this device</button>
      </div>
    );
  }

  const sessionNotice = logoutFailed && (
    <div className="alert alert-error">
      <p role="alert">Could not end the server session. Try Sign out again, or sign out on this device only.</p>
      <button type="button" className="btn btn-secondary" onClick={clearSession}>Sign out on this device</button>
    </div>
  );

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/home" replace /> : <Login onLogin={handleLogin} />} />
      <Route element={user ? <Layout user={user} onLogout={handleLogout} sessionNotice={sessionNotice} /> : <Navigate to="/login" replace />}>
        <Route path="/home" element={<Home />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:orderId" element={<OrderConfirmation />} />
      </Route>
      <Route path="*" element={<Navigate to={user ? '/home' : '/login'} replace />} />
    </Routes>
  );
}
