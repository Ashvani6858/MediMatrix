import React from 'react';
import './CostBreakdown.css';

const fmt = (n) => n != null
  ? `₹${Number(n).toLocaleString('en-IN')}`
  : '—';

const LINE_ITEMS = [
  { key: 'surgeonFee',      label: 'Surgeon Fee',           icon: '🩺' },
  { key: 'anesthesiaFee',   label: 'Anaesthesia',           icon: '💉' },
  { key: 'medicineCost',    label: 'Medicines',             icon: '💊' },
  { key: 'nursingCharge',   label: 'Nursing & Staff',       icon: '👩‍⚕️' },
  { key: 'diagnosticCost',  label: 'Diagnostics / Tests',   icon: '🔬' },
  { key: 'otherCharges',    label: 'Other Charges',         icon: '📋' },
];

export default function CostBreakdown({ data }) {
  if (!data) return null;
  const roomTotal = (data.roomChargePerDay || 0) * (data.estimatedDaysOfStay || 1);

  return (
    <div className="cost-breakdown">
      <div className="cost-breakdown__header">
        <h3>💰 Total Estimated Bill</h3>
        <div className="cost-breakdown__total">{fmt(data.totalEstimatedBill)}</div>
        <p className="cost-breakdown__days">
          Based on {data.estimatedDaysOfStay} day{data.estimatedDaysOfStay !== 1 ? 's' : ''} stay · No hidden charges
        </p>
      </div>

      <div className="cost-breakdown__divider" />

      <div className="cost-breakdown__lines">
        {LINE_ITEMS.map(item => (
          <div key={item.key} className="cost-breakdown__line">
            <span className="cost-breakdown__line-label">
              <span className="cost-breakdown__icon">{item.icon}</span>
              {item.label}
            </span>
            <span className="cost-breakdown__line-value">{fmt(data[item.key])}</span>
          </div>
        ))}

        {/* Room charge shows per-day × days */}
        <div className="cost-breakdown__line">
          <span className="cost-breakdown__line-label">
            <span className="cost-breakdown__icon">🛏️</span>
            Room Charge
            <span className="cost-breakdown__sub">
              {fmt(data.roomChargePerDay)}/day × {data.estimatedDaysOfStay} days
            </span>
          </span>
          <span className="cost-breakdown__line-value">{fmt(roomTotal)}</span>
        </div>
      </div>

      <div className="cost-breakdown__divider" />

      <div className="cost-breakdown__footer">
        <span>Total Estimated Bill</span>
        <span className="cost-breakdown__footer-total">{fmt(data.totalEstimatedBill)}</span>
      </div>

      <p className="cost-breakdown__disclaimer">
        * Estimates may vary ±10% based on individual medical requirements.
      </p>
    </div>
  );
}
