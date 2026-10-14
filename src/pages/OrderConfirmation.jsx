import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';
import { deliveryDate, formatOrderDate, formatPrice, parseServerDate } from '../format.js';

export default function OrderConfirmation() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const location = useLocation();
  // Use the order passed from checkout; otherwise (e.g. after a reload) load it.
  const [order, setOrder] = useState(location.state?.order ?? null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (order) return;
    api.order(orderId).then(setOrder).catch((err) => setError(err.message));
  }, [order, orderId]);

  if (!order) {
    return (
      <div className="page-container">
        {error ? <div className="alert alert-error" role="alert">{error}</div> : <p className="loading">Loading…</p>}
      </div>
    );
  }

  const justPlaced = Boolean(location.state?.order);

  return (
    <div className="page-container confirmation-page">
      <section className="panel confirmation">
        <div className="confirmation-head">
          <span className="confirm-icon" aria-hidden="true">✓</span>
          <div>
            <h1>{justPlaced ? 'Order placed, thank you!' : 'Order details'}</h1>
            <p className="approved">
              Payment approved: <strong>{formatPrice(order.totalAmount)}</strong>
            </p>
          </div>
        </div>

        <dl className="order-facts">
          <div><dt>Order number</dt><dd className="mono">{order.id}</dd></div>
          <div><dt>Order placed</dt><dd>{formatOrderDate(order.createdAt)}</dd></div>
          <div><dt>Total items</dt><dd>{order.totalItems}</dd></div>
          <div><dt>Paid with</dt><dd>{order.card.brand} ending in {order.card.last4}</dd></div>
          <div><dt>Arriving</dt><dd>{deliveryDate(parseServerDate(order.createdAt))}</dd></div>
        </dl>

        <table className="order-table">
          <thead>
            <tr><th>Item</th><th>Qty</th><th>Price</th><th>Total</th></tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.productId}>
                <td>{item.name}</td>
                <td>{item.qty}</td>
                <td>{formatPrice(item.price)}</td>
                <td>{formatPrice(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr><td colSpan="3">Total items</td><td>{order.totalItems}</td></tr>
            <tr className="grand-total"><td colSpan="3">Approved amount</td><td>{formatPrice(order.totalAmount)}</td></tr>
          </tfoot>
        </table>

        <div className="button-row">
          <button type="button" className="btn btn-primary" onClick={() => navigate('/home')}>
            Continue shopping
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/orders')}>
            View your orders
          </button>
        </div>
      </section>
    </div>
  );
}
