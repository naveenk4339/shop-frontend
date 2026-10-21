import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { useCart } from '../CartContext.jsx';
import Price from '../components/Price.jsx';
import QtySelect from '../components/QtySelect.jsx';
import Rating from '../components/Rating.jsx';
import { deliveryDate, discountPercent, formatPrice, MAX_QTY } from '../format.js';

export default function Product() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const cart = useCart();
  const [product, setProduct] = useState(undefined); // undefined = loading, null = not found
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .products()
      .then((list) => setProduct(list.find((p) => p.id === Number(productId)) ?? null))
      .catch((err) => setError(err.message));
  }, [productId]);

  if (error) return <div className="page-container"><div className="alert alert-error" role="alert">{error}</div></div>;
  if (product === undefined) return <p className="loading">Loading…</p>;
  if (product === null) {
    return (
      <div className="page-container">
        <section className="panel empty-cart">
          <h1>We couldn't find that product</h1>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/home')}>
            Back to all products
          </button>
        </section>
      </div>
    );
  }

  const inCart = cart.qtyOf(product.id);
  const canAdd = Math.max(0, MAX_QTY - inCart);
  const discount = discountPercent(product.price, product.listPrice);

  // Adds the chosen quantity on top of what is already in the cart.
  const addToCart = async () => {
    setBusy(true);
    const ok = await cart.setQty(product.id, inCart + Math.min(qty, canAdd));
    setBusy(false);
    if (ok) setAdded(true);
    return ok;
  };

  const buyNow = async () => {
    if (await addToCart()) navigate('/checkout');
  };

  return (
    <div className="page-container product-page">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/home">All products</Link>
        <span aria-hidden="true">›</span>
        <Link to={`/home?category=${encodeURIComponent(product.category)}`}>{product.category}</Link>
      </nav>

      <div className="product-detail">
        <div className="product-detail-image" aria-hidden="true">{product.emoji}</div>

        <section className="product-detail-info">
          <h1>{product.name}</h1>
          <Rating rating={product.rating} reviewCount={product.reviewCount} />
          <hr />
          {discount > 0 && <span className="deal-badge">Limited time deal</span>}
          <div className="product-price-row">
            {discount > 0 && <span className="discount">-{discount}%</span>}
            <Price value={product.price} />
          </div>
          {discount > 0 && (
            <p className="list-price">
              List Price: <s>{formatPrice(product.listPrice)}</s> · You save {formatPrice(product.listPrice - product.price)}
            </p>
          )}
          <dl className="product-facts">
            <div><dt>Category</dt><dd>{product.category}</dd></div>
            <div><dt>Customer rating</dt><dd>{product.rating.toFixed(1)} out of 5</dd></div>
            <div><dt>Ratings</dt><dd>{product.reviewCount.toLocaleString()}</dd></div>
          </dl>
          {product.highlights?.length > 0 && (
            <section className="about-item" aria-labelledby="about-item-title">
              <h2 id="about-item-title">About this item</h2>
              <ul>
                {product.highlights.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </section>
          )}
        </section>

        <aside className="panel buy-box">
          <Price value={product.price} />
          <p className="delivery">FREE delivery <strong>{deliveryDate()}</strong></p>
          <p className="in-stock big">In Stock</p>
          {canAdd > 0 ? (
            <>
              <QtySelect id="product-qty" value={Math.min(qty, canAdd)} max={canAdd} onChange={setQty} disabled={busy} />
              <button type="button" className="btn btn-primary btn-block" onClick={addToCart} disabled={busy}>
                {busy ? 'Adding…' : 'Add to Cart'}
              </button>
              <button type="button" className="btn btn-buy btn-block" onClick={buyNow} disabled={busy}>
                Buy Now
              </button>
            </>
          ) : (
            <p className="muted small">You already have the limit of {MAX_QTY} in your cart.</p>
          )}
          {cart.error && <div className="alert alert-error" role="alert">{cart.error}</div>}
          {added && (
            <div className="added-note" role="status">
              <span>✓ Added to cart. You have {cart.qtyOf(product.id)} in your cart.</span>
              <button type="button" className="btn btn-secondary btn-small" onClick={() => navigate('/cart')}>
                Go to Cart
              </button>
            </div>
          )}
          {!added && inCart > 0 && <p className="in-cart">✓ {inCart} already in cart</p>}
          <p className="muted small">Ships from and sold by Shopcart. FREE Returns.</p>
        </aside>
      </div>
    </div>
  );
}
