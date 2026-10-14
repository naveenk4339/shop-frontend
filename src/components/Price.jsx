// Store-style price: small "$", large dollars, raised cents.
export default function Price({ value, size = 'md' }) {
  const [dollars, cents] = value.toFixed(2).split('.');
  return (
    <span className={`price-tag price-${size}`} aria-label={`$${dollars}.${cents}`}>
      <span className="price-symbol">$</span>
      <span className="price-whole">{dollars}</span>
      <span className="price-fraction">{cents}</span>
    </span>
  );
}
