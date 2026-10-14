import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import Logo from '../components/Logo.jsx';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isRegister = mode === 'register';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!EMAIL_PATTERN.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const result = isRegister ? await api.register(email, password) : await api.login(email, password);
      onLogin(result);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const switchMode = () => {
    setMode(isRegister ? 'login' : 'register');
    setError('');
  };

  const useDemoAccount = () => {
    setMode('login');
    setEmail('demo@shop.com');
    setPassword('demo123');
    setError('');
  };

  return (
    <div className="auth-page">
      <Logo dark />
      <form className="auth-box" onSubmit={handleSubmit} noValidate>
        <h1>{isRegister ? 'Create account' : 'Sign in'}</h1>
        {error && (
          <div className="alert alert-error" role="alert">
            <strong>There was a problem</strong>
            <span>{error}</span>
          </div>
        )}
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={isRegister ? 'At least 6 characters' : ''}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
        />
        <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
          {submitting ? 'Please wait…' : isRegister ? 'Create your account' : 'Sign in'}
        </button>
        {!isRegister && (
          <div className="demo-box">
            <span>Demo account: <strong>demo@shop.com</strong> / <strong>demo123</strong></span>
            <button type="button" className="btn btn-secondary btn-small" onClick={useDemoAccount}>
              Fill in demo account
            </button>
          </div>
        )}
      </form>

      <div className="auth-divider"><span>{isRegister ? 'Already have an account?' : 'New to Shopcart?'}</span></div>
      <button type="button" className="btn btn-secondary auth-switch" onClick={switchMode}>
        {isRegister ? 'Sign in to your account' : 'Create your Shopcart account'}
      </button>
    </div>
  );
}
