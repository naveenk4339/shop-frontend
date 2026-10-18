import { Link } from 'react-router-dom';
import { deliveryDate, discountPercent, MAX_QTY } from '../format.js';
import Price from './Price.jsx';
import Rating from './Rating.jsx';

export default function ProductCard({ product, inCart, onAdd, adding }) {
  const discount = discountPercent(product.price, product.listPrice);
  const atLimit = inCart >= MAX_QTY;

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image" tabIndex={-1} aria-hidden="true">
        <span>{product.emoji}</span>
      </Link>
      <div className="product-body">
        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <Rating rating={product.rating} reviewCount={product.reviewCount} />
        {discount > 0 && <span className="deal-badge">Limited time deal</span>}
        <div className="product-price-row">
          {discount > 0 && <span className="discount">-{discount}%</span>}
          <Price value={product.price} />
        </div>
        {discount > 0 && (
          <div className="list-price">
            List: <s>${product.listPrice.toFixed(2)}</s>
          </div>
        )}
        <p className="delivery">
          FREE delivery <strong>{deliveryDate()}</strong>
        </p>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => onAdd(product.id)}
          disabled={adding || atLimit}
        >
          {atLimit ? `Limit ${MAX_QTY} per order` : adding ? 'Adding…' : 'Add to Cart'}
        </button>
        {inCart > 0 && <p className="in-cart">✓ {inCart} in cart</p>}
      </div>
    </article>
  );
}
