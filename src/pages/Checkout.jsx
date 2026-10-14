import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { useCart } from '../CartContext.jsx';
import { cardBrand, formatCardNumber, formatExpiry, validateCard } from '../cardValidation.js';
import { deliveryDate, formatPrice } from '../format.js';

export default function Checkout() {
  const navigate = useNavigate();
  const cart = useCart();
  const [card, setCard] = useState({ name: '', number: '', expiry: '', cvv: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  const update = (field, format = (v) => v) => (e) => {
    setCard((prev) => ({ ...prev, [field]: format(e.target.value) }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    const errors = validateCard(card);
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setError('Please correct the highlighted card details.');
      return;
    }

    setError('');
    setPaying(true);
    try {
      const order = await api.checkout(card);
      await cart.reload(); // the server empties the cart after payment
      navigate(`/order/${order.id}`, { replace: true, state: { order } });
    } catch (err) {
      setError(err.message);
      if (err.fields) setFieldErrors(err.fields);
      setPaying(false);
    }
  };

  if (!cart.loaded) return <p className="loading">Loading your cart…</p>;

  if (cart.lines.length === 0 && !paying) {
    return (
      <div className="page-container">
        <section className="panel empty-cart">
          <h1>Your cart is empty</h1>
          <p>Add some items before checking out.</p>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/home')}>
            Continue shopping
          </button>
        </section>
      </div>
    );
  }

  const brand = cardBrand(card.number.replace(/\s/g, ''));
  const itemLabel = `${cart.totalItems} ${cart.totalItems === 1 ? 'item' : 'items'}`;
  const invalid = (field) => (fieldErrors[field] ? 'invalid' : '');

  return (
    <div className="page-container checkout-page">
      <div className="checkout-main">
        <h1 className="checkout-title">Checkout ({itemLabel})</h1>

        <form id="payment-form" className="panel checkout-step" onSubmit={handlePay} noValidate>
          <h2><span className="step-number">1</span> Payment method</h2>
          <p className="muted small">Credit or debit card. Visa, Mastercard, American Express and Discover accepted.</p>
          {error && (
            <div className="alert alert-error" role="alert">
              <strong>There was a problem</strong>
              <span>{error}</span>
            </div>
          )}
          <div className="form-grid">
            <div className="field field-wide">
              <label htmlFor="card-name">Name on card</label>
              <input id="card-name" className={invalid('name')} value={card.name} onChange={update('name')} autoComplete="cc-name" />
              {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
            </div>
            <div className="field field-wide">
              <label htmlFor="card-number">
                Card number {brand && <span className="card-brand">{brand}</span>}
              </label>
              <input
                id="card-number"
                className={invalid('number')}
                value={card.number}
                onChange={update('number', formatCardNumber)}
                placeholder="1234 5678 9012 3456"
                inputMode="numeric"
                autoComplete="cc-number"
              />
              {fieldErrors.number && <span className="field-error">{fieldErrors.number}</span>}
            </div>
            <div className="field">
              <label htmlFor="card-expiry">Expiration date</label>
              <input
                id="card-expiry"
                className={invalid('expiry')}
                value={card.expiry}
                onChange={update('expiry', formatExpiry)}
                placeholder="MM/YY"
                inputMode="numeric"
                autoComplete="cc-exp"
              />
              {fieldErrors.expiry && <span className="field-error">{fieldErrors.expiry}</span>}
            </div>
            <div className="field">
              <label htmlFor="card-cvv">Security code (CVV)</label>
              <input
                id="card-cvv"
                type="password"
                className={invalid('cvv')}
                value={card.cvv}
                onChange={update('cvv', (v) => v.replace(/\D/g, '').slice(0, 4))}
                placeholder="123"
                inputMode="numeric"
                autoComplete="cc-csc"
              />
              {fieldErrors.cvv && <span className="field-error">{fieldErrors.cvv}</span>}
            </div>
          </div>
          <p className="test-note">
            Test mode, no real charge. Card <strong>4242 4242 4242 4242</strong> is approved;{' '}
            <strong>4000 0000 0000 0002</strong> is declined. Use any future date and any 3-digit CVV.
          </p>
        </form>

        <section className="panel checkout-step">
          <h2><span className="step-number">2</span> Review items and delivery</h2>
          <p className="delivery-estimate">Arriving <strong>{deliveryDate()}</strong> · FREE Shipping</p>
          {cart.lines.map((line) => (
            <div key={line.id} className="review-item">
              <div className="review-item-image" aria-hidden="true">{line.emoji}</div>
              <div className="review-item-info">
                <span>{line.name}</span>
                <span className="muted small">Qty: {line.qty} · {formatPrice(line.price)} each</span>
              </div>
              <strong>{formatPrice(line.price * line.qty)}</strong>
            </div>
          ))}
          <button type="button" className="btn btn-link" onClick={() => navigate('/cart')}>
            Change quantities in cart
          </button>
        </section>
      </div>

      <aside className="panel order-summary">
        <button type="submit" form="payment-form" className="btn btn-buy btn-block" disabled={paying}>
          {paying ? 'Processing payment…' : 'Place your order'}
        </button>
        <p className="muted small center">By placing your order you agree to this demo store's terms.</p>
        <h2>Order Summary</h2>
        <dl className="summary-rows">
          <div><dt>Items ({cart.totalItems}):</dt><dd>{formatPrice(cart.totalPrice)}</dd></div>
          <div><dt>Shipping &amp; handling:</dt><dd>$0.00</dd></div>
          <div className="summary-total"><dt>Order total:</dt><dd>{formatPrice(cart.totalPrice)}</dd></div>
        </dl>
      </aside>
    </div>
  );
}
