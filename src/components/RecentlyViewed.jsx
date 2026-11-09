import { Link } from 'react-router-dom';
import Price from './Price.jsx';

// A scrollable row of products the shopper opened recently.
export default function RecentlyViewed({ products, onClear }) {
  return (
    <section className="recently-viewed" aria-labelledby="recently-viewed-title">
      <div className="recently-viewed-head">
        <h2 id="recently-viewed-title">Your recently viewed items</h2>
        <button type="button" className="btn btn-link" onClick={onClear}>
          Clear history
        </button>
      </div>
      <ul className="recently-viewed-list">
        {products.map((p) => (
          <li key={p.id}>
            <Link to={`/product/${p.id}`} className="recent-item">
              <span className="recent-image" aria-hidden="true">{p.emoji}</span>
              <span className="recent-name">{p.name}</span>
              <Price value={p.price} size="sm" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
