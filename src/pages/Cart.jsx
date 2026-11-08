import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../CartContext.jsx';
import Price from '../components/Price.jsx';
import QtySelect from '../components/QtySelect.jsx';
import { formatPrice } from '../format.js';

export default function Cart() {
  const navigate = useNavigate();
  const cart = useCart();
  // Which row is updating, e.g. "cart-7" or "saved-7" (an item can be in both lists).
  const [busyKey, setBusyKey] = useState(null);

  const busy = async (key, action) => {
    setBusyKey(key);
    await action();
    setBusyKey(null);
  };

  const itemLabel = `${cart.totalItems} ${cart.totalItems === 1 ? 'item' : 'items'}`;

  if (!cart.loaded) return <p className="loading">Loading your cart…</p>;

  const savedList = <SavedForLater cart={cart} busyKey={busyKey} busy={busy} />;

  if (cart.lines.length === 0) {
    return (
      <div className="page-container cart-stack">
        <section className="panel empty-cart">
          <h1>Your Shopcart cart is empty</h1>
          {cart.error && <div className="alert alert-error" role="alert">{cart.error}</div>}
          <p>
            {cart.saved.length > 0
              ? 'Move items from Saved for later below, or browse for something new.'
              : "Browse today's deals and add items to your cart."}
          </p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/home')}>
            Continue shopping
          </button>
        </section>
        {savedList}
      </div>
    );
  }

  return (
    <div className="page-container cart-page">
      <div className="cart-main">
        <section className="panel cart-list">
          <div className="cart-list-head">
            <h1>Shopping Cart</h1>
            <span className="muted">Price</span>
          </div>
          {cart.error && <div className="alert alert-error" role="alert">{cart.error}</div>}
          {cart.lines.map((line) => {
            const key = `cart-${line.id}`;
            return (
              <div key={line.id} className="cart-item">
                <div className="cart-item-image" aria-hidden="true">{line.emoji}</div>
                <div className="cart-item-info">
                  <h2><Link to={`/product/${line.id}`}>{line.name}</Link></h2>
                  <p className="in-stock">In Stock</p>
                  <p className="muted small">FREE Returns · Eligible for FREE Shipping</p>
                  <div className="cart-item-actions">
                    <QtySelect
                      id={`qty-${line.id}`}
                      value={line.qty}
                      disabled={busyKey === key}
                      onChange={(qty) => busy(key, () => cart.setQty(line.id, qty))}
                    />
                    <span className="divider" aria-hidden="true">|</span>
                    <button
                      type="button"
                      className="btn btn-link"
                      disabled={busyKey === key}
                      onClick={() => busy(key, () => cart.setQty(line.id, 0))}
                    >
                      Delete
                    </button>
                    <span className="divider" aria-hidden="true">|</span>
                    <button
                      type="button"
                      className="btn btn-link"
                      disabled={busyKey === key}
                      onClick={() => busy(key, () => cart.saveForLater(line.id))}
                    >
                      Save for later
                    </button>
                  </div>
                </div>
                <div className="cart-item-price">
                  <Price value={line.price * line.qty} size="sm" />
                  {line.qty > 1 && <span className="muted small">{formatPrice(line.price)} each</span>}
                </div>
              </div>
            );
          })}
          <div className="cart-list-foot">
            <button type="button" className="btn btn-link" onClick={() => cart.clear()}>
              Remove all items
            </button>
            <p>
              Subtotal ({itemLabel}): <strong>{formatPrice(cart.totalPrice)}</strong>
            </p>
          </div>
        </section>
        {savedList}
      </div>

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

// Items moved out of the cart to buy later. Not counted in the cart total.
function SavedForLater({ cart, busyKey, busy }) {
  if (cart.saved.length === 0) return null;
  const count = cart.saved.length;

  return (
    <section className="panel saved-list" aria-labelledby="saved-title">
      <h2 id="saved-title">
        Saved for later <span className="muted">({count} {count === 1 ? 'item' : 'items'})</span>
      </h2>
      {cart.saved.map((item) => {
        const key = `saved-${item.id}`;
        return (
          <div key={item.id} className="cart-item saved-item">
            <div className="cart-item-image" aria-hidden="true">{item.emoji}</div>
            <div className="cart-item-info">
              <h3><Link to={`/product/${item.id}`}>{item.name}</Link></h3>
              <p className="in-stock">In Stock</p>
              {item.qty > 1 && <p className="muted small">Qty: {item.qty}</p>}
              <div className="cart-item-actions">
                <button
                  type="button"
                  className="btn btn-secondary btn-small"
                  disabled={busyKey === key}
                  onClick={() => busy(key, () => cart.moveToCart(item.id))}
                >
                  Move to cart
                </button>
                <button
                  type="button"
                  className="btn btn-link"
                  disabled={busyKey === key}
                  onClick={() => busy(key, () => cart.removeSaved(item.id))}
                >
                  Delete
                </button>
              </div>
            </div>
            <div className="cart-item-price">
              <Price value={item.price} size="sm" />
              {item.qty > 1 && <span className="muted small">each</span>}
            </div>
          </div>
        );
      })}
    </section>
  );
}
