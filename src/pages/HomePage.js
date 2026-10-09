import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { treatmentAPI } from '../services/api';
import './HomePage.css';

const INSURANCE_OPTIONS = [
  'Star Health', 'HDFC ERGO', 'ICICI Lombard',
  'New India Assurance', 'United India Insurance',
  'Bajaj Allianz', 'Religare Health', 'Aditya Birla Health'
];

const POPULAR_SEARCHES = [
  'Knee Replacement', 'Angioplasty', 'Dialysis',
  'Appendectomy', 'Cataract Surgery', 'Hip Replacement'
];

export default function HomePage() {
  const navigate = useNavigate();
  const [treatment, setTreatment] = useState('');
  const [insurance, setInsurance] = useState('');
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (treatment.length > 1) {
      treatmentAPI.search(treatment)
        .then(r => setSuggestions(r.data.map(t => t.name)))
        .catch(() => setSuggestions([]));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [treatment]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (treatment) params.set('treatment', treatment);
    if (insurance) params.set('insurance', insurance);
    if (city) params.set('city', city);
    navigate(`/search?${params.toString()}`);
  };

  const pickSuggestion = (name) => {
    setTreatment(name);
    setShowSuggestions(false);
  };

  return (
    <div className="home">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero__bg-grid" />
        <div className="container hero__content">
          <div className="hero__eyebrow fade-up fade-up-1">
            <span className="badge badge-teal">🇮🇳 India's Transparent Healthcare Platform</span>
          </div>
          <h1 className="hero__title fade-up fade-up-2">
            Find the Right Hospital.<br />
            <span className="hero__title-accent">No Hidden Charges.</span>
          </h1>
          <p className="hero__subtitle fade-up fade-up-3">
            Compare hospitals like you compare phones. See full cost breakdowns,
            real-time bed availability, and genuine patient reviews — all in one place.
          </p>

          {/* Search Card */}
          <form className="search-card fade-up fade-up-4" onSubmit={handleSearch}>
            <div className="search-card__fields">

              {/* Treatment input with autocomplete */}
              <div className="search-field" style={{ position: 'relative' }}>
                <label className="search-field__label">Treatment / Procedure</label>
                <div className="search-field__icon-wrap">
                  <span className="search-field__icon">🩺</span>
                  <input
                    className="input search-field__input"
                    placeholder="e.g. Knee Replacement"
                    value={treatment}
                    onChange={e => setTreatment(e.target.value)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                  />
                </div>
                {showSuggestions && suggestions.length > 0 && (
                  <ul className="search-suggestions">
                    {suggestions.map(s => (
                      <li key={s} onClick={() => pickSuggestion(s)}>{s}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Insurance */}
              <div className="search-field">
                <label className="search-field__label">Insurance Provider</label>
                <div className="search-field__icon-wrap">
                  <span className="search-field__icon">🛡️</span>
                  <select className="input search-field__input" value={insurance}
                          onChange={e => setInsurance(e.target.value)}>
                    <option value="">All Insurance</option>
                    {INSURANCE_OPTIONS.map(ins => (
                      <option key={ins} value={ins}>{ins}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* City */}
              <div className="search-field">
                <label className="search-field__label">City</label>
                <div className="search-field__icon-wrap">
                  <span className="search-field__icon">📍</span>
                  <input className="input search-field__input"
                    placeholder="Delhi, Mumbai…"
                    value={city}
                    onChange={e => setCity(e.target.value)} />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-primary search-card__btn">
              Search Hospitals →
            </button>
          </form>

          {/* Popular searches */}
          <div className="hero__popular fade-up fade-up-4">
            <span className="hero__popular-label">Popular:</span>
            {POPULAR_SEARCHES.map(s => (
              <button key={s} className="hero__pill"
                onClick={() => { setTreatment(s); }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="features container">
        <div className="features__grid">
          {[
            { icon: '🔍', title: 'Smart Search', desc: 'Filter by treatment, insurance provider, city, and accreditation instantly.' },
            { icon: '📊', title: 'No Hidden Costs', desc: 'See surgeon fees, room charges, medicines — every rupee broken down before you decide.' },
            { icon: '🟢', title: 'Live Bed Status', desc: 'Real-time ICU and general ward availability. Green means go, red means full.' },
            { icon: '⭐', title: 'Verified Reviews', desc: 'Honest patient ratings on doctors, cleanliness, staff, and value for money.' },
            { icon: '📅', title: 'Easy Booking', desc: 'Book appointments like a movie ticket. Get a confirmation code instantly.' },
            { icon: '🛡️', title: 'Insurance Filter', desc: 'Only see hospitals where your insurance is accepted. Zero wasted calls.' },
          ].map(f => (
            <div key={f.title} className="feature-card card">
              <div className="feature-card__icon">{f.icon}</div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="stats container">
        <div className="stats__grid">
          {[
            { number: '500+', label: 'Hospitals Listed' },
            { number: '₹0', label: 'Hidden Charges' },
            { number: 'Live', label: 'Bed Updates' },
            { number: '24/7', label: 'Availability Info' },
          ].map(s => (
            <div key={s.label} className="stat-item">
              <div className="stat-item__number">{s.number}</div>
              <div className="stat-item__label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
