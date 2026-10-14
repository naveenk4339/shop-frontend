import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import Price from '../components/Price.jsx';
import QtySelect from '../components/QtySelect.jsx';
import { formatPrice } from '../format.js';

export default function Cart() {
  const navigate = useNavigate();
  const cart = useCart();
  const [busyId, setBusyId] = useState(null);

  const update = async (productId, qty) => {
    setBusyId(productId);
    await cart.setQty(productId, qty);
    setBusyId(null);
  };

  const itemLabel = `${cart.totalItems} ${cart.totalItems === 1 ? 'item' : 'items'}`;

  if (!cart.loaded) return <p className="loading">Loading your cart…</p>;

  if (cart.lines.length === 0) {
    return (
      <div className="page-container cart-page">
        <section className="panel empty-cart">
          <h1>Your Shopcart cart is empty</h1>
          {cart.error && <div className="alert alert-error" role="alert">{cart.error}</div>}
          <p>Browse today's deals and add items to your cart.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/home')}>
            Continue shopping
          </button>
        </section>
      </div>
    );
  }

  return (
    <div className="page-container cart-page">
      <section className="panel cart-list">
        <div className="cart-list-head">
          <h1>Shopping Cart</h1>
          <span className="muted">Price</span>
        </div>
        {cart.error && <div className="alert alert-error" role="alert">{cart.error}</div>}
        {cart.lines.map((line) => (
          <div key={line.id} className="cart-item">
            <div className="cart-item-image" aria-hidden="true">{line.emoji}</div>
            <div className="cart-item-info">
              <h2>{line.name}</h2>
              <p className="in-stock">In Stock</p>
              <p className="muted small">FREE Returns · Eligible for FREE Shipping</p>
              <div className="cart-item-actions">
                <QtySelect
                  id={`qty-${line.id}`}
                  value={line.qty}
                  disabled={busyId === line.id}
                  onChange={(qty) => update(line.id, qty)}
                />
                <span className="divider" aria-hidden="true">|</span>
                <button
                  type="button"
                  className="btn btn-link"
                  disabled={busyId === line.id}
                  onClick={() => update(line.id, 0)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="cart-item-price">
              <Price value={line.price * line.qty} size="sm" />
              {line.qty > 1 && <span className="muted small">{formatPrice(line.price)} each</span>}
            </div>
          </div>
        ))}
        <div className="cart-list-foot">
          <button type="button" className="btn btn-link" onClick={() => cart.clear()}>
            Remove all items
          </button>
          <p>
            Subtotal ({itemLabel}): <strong>{formatPrice(cart.totalPrice)}</strong>
          </p>
        </div>
      </section>

      <aside className="panel cart-summary">
        <p className="free-shipping">✓ Your order qualifies for FREE Shipping.</p>
        <p className="summary-subtotal">
          Subtotal ({itemLabel}): <strong>{formatPrice(cart.totalPrice)}</strong>
        </p>
        <button type="button" className="btn btn-primary btn-block" onClick={() => navigate('/checkout')}>
          Proceed to checkout
        </button>
        <button type="button" className="btn btn-secondary btn-block" onClick={() => navigate('/home')}>
          Continue shopping
        </button>
      </aside>
    </div>
  );
}
