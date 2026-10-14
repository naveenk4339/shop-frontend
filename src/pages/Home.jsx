import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../api.js';
import { useCart } from '../CartContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { discountPercent, formatPrice } from '../format.js';

const SORTS = {
  featured: { label: 'Featured', compare: (a, b) => a.id - b.id },
  'price-asc': { label: 'Price: Low to High', compare: (a, b) => a.price - b.price },
  'price-desc': { label: 'Price: High to Low', compare: (a, b) => b.price - a.price },
  rating: { label: 'Avg. Customer Review', compare: (a, b) => b.rating - a.rating },
};

export default function Home() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const cart = useCart();
  const [products, setProducts] = useState(null);
  const [error, setError] = useState('');
  const [addingId, setAddingId] = useState(null);
  const [justAdded, setJustAdded] = useState(null);

  const query = (params.get('q') || '').trim();
  const category = params.get('category') || '';
  const dealsOnly = params.get('deals') === '1';
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'featured';

  useEffect(() => {
    api.products().then(setProducts).catch((err) => setError(err.message));
  }, []);

  const results = useMemo(() => {
    if (!products) return [];
    const words = query.toLowerCase().split(/\s+/).filter(Boolean);
    return products
      .filter((p) => !category || p.category === category)
      .filter((p) => !dealsOnly || discountPercent(p.price, p.listPrice) > 0)
      .filter((p) => words.every((w) => `${p.name} ${p.category}`.toLowerCase().includes(w)))
      .sort(SORTS[sort].compare);
  }, [products, query, category, dealsOnly, sort]);

  const handleAdd = async (productId) => {
    setAddingId(productId);
    const ok = await cart.add(productId);
    setAddingId(null);
    if (ok) setJustAdded(products.find((p) => p.id === productId));
  };

  const setSort = (value) => {
    const next = new URLSearchParams(params);
    if (value === 'featured') next.delete('sort');
    else next.set('sort', value);
    setParams(next);
  };

  const heading = dealsOnly ? "Today's Deals" : category || (query ? 'Results' : 'Shop all products');

  return (
    <div className="home">
      {justAdded && (
        <div className="added-banner" role="status">
          <div className="added-info">
            <span className="added-check">✓</span>
            <div>
              <strong>Added to cart</strong>
              <span className="added-name">{justAdded.name}</span>
            </div>
          </div>
          <div className="added-actions">
            <span className="added-subtotal">
              Cart subtotal ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'}): <strong>{formatPrice(cart.totalPrice)}</strong>
            </span>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/cart')}>Go to Cart</button>
            <button type="button" className="btn btn-primary" onClick={() => navigate('/checkout')}>Proceed to checkout</button>
            <button type="button" className="btn btn-link" onClick={() => setJustAdded(null)}>Close</button>
          </div>
        </div>
      )}

      <div className="results-bar">
        <p>
          {products ? `${results.length} ${results.length === 1 ? 'result' : 'results'}` : 'Loading products…'}
          {query && <> for <span className="query">"{query}"</span></>}
          {category && query && <> in {category}</>}
        </p>
        <label className="sort-select">
          <span>Sort by:</span>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)}>
            {Object.entries(SORTS).map(([key, s]) => (
              <option key={key} value={key}>{s.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="page-container">
        <h1 className="page-title">{heading}</h1>
        {(error || cart.error) && <div className="alert alert-error" role="alert">{error || cart.error}</div>}

        {products && results.length === 0 ? (
          <div className="empty-state">
            <h2>No results{query && <> for "{query}"</>}</h2>
            <p>Check the spelling or try a different search.</p>
            <Link className="btn btn-secondary" to="/home">Clear search and show all products</Link>
          </div>
        ) : (
          <div className="product-grid">
            {results.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                inCart={cart.qtyOf(p.id)}
                adding={addingId === p.id}
                onAdd={handleAdd}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
