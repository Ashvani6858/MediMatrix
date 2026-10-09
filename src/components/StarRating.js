import React from 'react';

export default function StarRating({ rating, size = 'sm' }) {
  const r = Math.round(rating || 0);
  return (
    <span className="stars" style={{ fontSize: size === 'lg' ? '1.1rem' : '0.9rem' }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} className={i <= r ? 'star' : 'star-empty'}>★</span>
      ))}
    </span>
  );
}
