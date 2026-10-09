import React from 'react';

export default function BedStatusBadge({ status, size = 'sm' }) {
  const isGreen = status === 'GREEN';
  return (
    <span className={`badge ${isGreen ? 'badge-green' : 'badge-red'}`}
          style={{ fontSize: size === 'lg' ? '0.85rem' : '0.72rem' }}>
      <span style={{
        display: 'inline-block',
        width: 7, height: 7,
        borderRadius: '50%',
        background: isGreen ? 'var(--green)' : 'var(--red)',
        boxShadow: isGreen
          ? '0 0 6px rgba(46,204,143,0.8)'
          : '0 0 6px rgba(224,90,90,0.8)',
        animation: isGreen ? 'pulse-green 2s infinite' : 'none'
      }} />
      {isGreen ? 'Beds Available' : 'Full'}
      <style>{`
        @keyframes pulse-green {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </span>
  );
}
