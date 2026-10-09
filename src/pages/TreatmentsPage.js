import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { treatmentAPI } from '../services/api';
import './TreatmentsPage.css';

const CATEGORY_ICONS = {
  'Orthopedics': '🦴', 'Cardiology': '❤️', 'Nephrology': '🫁',
  'General Surgery': '🔪', 'Neurology': '🧠', 'Oncology': '🎗️',
  'Ophthalmology': '👁️', 'Gynecology': '🤰', 'Dermatology': '🌿',
};

export default function TreatmentsPage() {
  const navigate = useNavigate();
  const [treatments, setTreatments] = useState([]);
  const [search, setSearch]         = useState('');
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    treatmentAPI.getAll()
      .then(r => {
        const data = r.data;
        // Backend may return a plain array or a paginated object { content: [] }
        if (Array.isArray(data)) {
          setTreatments(data);
        } else if (data && Array.isArray(data.content)) {
          setTreatments(data.content);
        } else {
          setTreatments([]);
        }
      })
      .catch(() => setTreatments([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = treatments.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    (t.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const grouped = filtered.reduce((acc, t) => {
    const cat = t.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(t);
    return acc;
  }, {});

  return (
    <div className="treatments-page page">
      <div className="container">
        <div className="treatments-header fade-up">
          <h1>All Treatments</h1>
          <p>Browse every procedure available on MediCompare and compare costs across hospitals.</p>
          <input className="input treatments-search"
            placeholder="🔍  Search treatments or specialty…"
            value={search}
            onChange={e => setSearch(e.target.value)} />
        </div>

        {loading && <div className="spinner" />}

        {!loading && Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="treatment-category fade-up">
            <h2 className="treatment-category__title">
              <span>{CATEGORY_ICONS[category] || '🏥'}</span> {category}
            </h2>
            <div className="treatment-category__grid">
              {items.map(t => (
                <div key={t.id} className="treatment-tile card"
                  onClick={() => navigate(`/search?treatment=${encodeURIComponent(t.name)}`)}>
                  <div className="treatment-tile__name">{t.name}</div>
                  {t.description && (
                    <p className="treatment-tile__desc">{t.description}</p>
                  )}
                  <span className="treatment-tile__cta">Compare prices →</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem' }}>🔍</div>
            <p>No treatments found for "{search}"</p>
          </div>
        )}
      </div>
    </div>
  );
}
