import { MAX_QTY } from '../format.js';

// Quantity dropdown labelled "Qty", like most online stores.
export default function QtySelect({ id, value, onChange, disabled, max = MAX_QTY }) {
  return (
    <label className="qty-select" htmlFor={id}>
      <span>Qty:</span>
      <select id={id} value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>{n}</option>
        ))}
      </select>
    </label>
  );
}
