import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api.js';
import { formatOrderDate, formatPrice } from '../format.js';

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.orders().then(setOrders).catch((err) => setError(err.message));
  }, []);

  return (
    <div className="page-container orders-page">
      <h1 className="page-title">Your Orders</h1>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {!orders && !error && <p className="loading">Loading…</p>}
      {orders && orders.length === 0 && (
        <section className="panel empty-cart">
          <h2>You have not placed any orders yet</h2>
          <button type="button" className="btn btn-primary" onClick={() => navigate('/home')}>
            Start shopping
          </button>
        </section>
      )}
      {orders?.map((order) => (
        <section key={order.id} className="order-card">
          <header className="order-card-head">
            <div><span>Order placed</span><strong>{formatOrderDate(order.createdAt)}</strong></div>
            <div><span>Total</span><strong>{formatPrice(order.totalAmount)}</strong></div>
            <div><span>Items</span><strong>{order.totalItems}</strong></div>
            <div className="order-number"><span>Order #</span><strong className="mono">{order.id}</strong></div>
          </header>
          <div className="order-card-body">
            <div>
              <p className="order-status">✓ Payment approved · {order.card.brand} ending in {order.card.last4}</p>
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.productId}>
                    {item.name} <span className="muted">× {item.qty}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate(`/order/${order.id}`)}
            >
              View order details
            </button>
          </div>
        </section>
      ))}
    </div>
  );
}
