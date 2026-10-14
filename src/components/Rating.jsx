// Star rating such as "4.5 ★★★★★ (2,341)", with the stars filled to the exact rating.
export default function Rating({ rating, reviewCount }) {
  return (
    <div className="rating" aria-label={`${rating} out of 5 stars, ${reviewCount.toLocaleString()} ratings`}>
      <span className="rating-value">{rating.toFixed(1)}</span>
      <span className="stars" aria-hidden="true">
        <span className="stars-empty">★★★★★</span>
        <span className="stars-filled" style={{ width: `${(rating / 5) * 100}%` }}>★★★★★</span>
      </span>
      <span className="rating-count">({reviewCount.toLocaleString()})</span>
    </div>
  );
}
