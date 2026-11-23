import { useState } from 'react';
import { api } from '../api.js';
import { formatPrice } from '../format.js';

// "Cancel order" with an in-page confirmation step. Calls onCancelled with the updated order.
export default function CancelOrder({ order, onCancelled }) {
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (order.status !== 'APPROVED') return null;

  const cancel = async () => {
    setBusy(true);
    setError('');
    try {
      onCancelled(await api.cancelOrder(order.id));
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  if (!confirming) {
    return (
      <button type="button" className="btn btn-secondary" onClick={() => setConfirming(true)}>
        Cancel order
      </button>
    );
  }

  return (
    <div className="cancel-confirm" role="group" aria-label="Confirm cancellation">
      <p>
        Cancel this order? <strong>{formatPrice(order.totalAmount)}</strong> will be refunded to{' '}
        {order.card.brand} ending in {order.card.last4}.
      </p>
      {error && <p className="field-error" role="alert">{error}</p>}
      <div className="button-row">
        <button type="button" className="btn btn-danger" onClick={cancel} disabled={busy}>
          {busy ? 'Cancelling…' : 'Yes, cancel order'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => setConfirming(false)} disabled={busy}>
          Keep order
        </button>
      </div>
    </div>
  );
}
