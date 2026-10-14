import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import Logo from './Logo.jsx';

export const CATEGORIES = ['Grocery', 'Electronics', 'Home & Kitchen', 'Books'];

export default function Header({ user, onLogout }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { totalItems } = useCart();
  const [query, setQuery] = useState(params.get('q') || '');
  const [category, setCategory] = useState(params.get('category') || '');

  // Keep the search box in step with the address (e.g. after clicking a category).
  useEffect(() => {
    setQuery(params.get('q') || '');
    setCategory(params.get('category') || '');
  }, [params]);

  const goTo = (next) => {
    const search = new URLSearchParams();
    for (const [key, value] of Object.entries(next)) if (value) search.set(key, value);
    const qs = search.toString();
    navigate(qs ? `/home?${qs}` : '/home');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    goTo({ q: query.trim(), category });
  };

  const handleLogout = async () => {
    await onLogout();
    navigate('/login');
  };

  const firstName = user.email.split('@')[0];
  const activeCategory = params.get('category') || '';
  const dealsActive = params.get('deals') === '1';

  return (
    <header className="site-header">
      <div className="header-main">
        <Link to="/home" className="header-logo" aria-label="Shopcart home">
          <Logo />
        </Link>

        <form className="search" onSubmit={handleSearch} role="search">
          <select
            id="search-category"
            aria-label="Search in category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <input
            id="search-query"
            type="search"
            placeholder="Search Shopcart"
            aria-label="Search products"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="search-button">Search</button>
        </form>

        <div className="header-account">
          <span className="header-small">Hello, {firstName}</span>
          <button type="button" className="header-link-button" onClick={handleLogout}>
            Sign out
          </button>
        </div>

        <Link to="/orders" className="header-block">
          <span className="header-small">Returns</span>
          <span className="header-strong">&amp; Orders</span>
        </Link>

        <Link to="/cart" className="header-cart" aria-label={`Cart, ${totalItems} items`}>
          <span className="cart-count">{totalItems}</span>
          <span className="header-strong">Cart</span>
        </Link>
      </div>

      <nav className="header-nav" aria-label="Departments">
        <button type="button" className={!activeCategory && !dealsActive ? 'active' : ''} onClick={() => goTo({})}>
          All
        </button>
        <button type="button" className={dealsActive ? 'active' : ''} onClick={() => goTo({ deals: '1' })}>
          Today's Deals
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            className={activeCategory === c ? 'active' : ''}
            onClick={() => goTo({ category: c })}
          >
            {c}
          </button>
        ))}
      </nav>
    </header>
  );
}
