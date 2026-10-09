
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { hospitalAPI } from '../services/api';
import BedStatusBadge from '../components/BedStatusBadge';
import StarRating from '../components/StarRating';
import './SearchPage.css';

const fmt = (n) =>
  n != null ? `₹${Number(n).toLocaleString('en-IN')}` : null;

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [treatment, setTreatment] = useState(
    searchParams.get('treatment') || ''
  );
  const [insurance, setInsurance] = useState(
    searchParams.get('insurance') || ''
  );
  const [city, setCity] = useState(
    searchParams.get('city') || ''
  );

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);

  const search = useCallback(async (pg = 0) => {
    setLoading(true);
    setError('');

    try {
      const params = { page: pg, size: 9 };

      if (treatment.trim()) {
        params.treatment = treatment.trim();
      }

      if (insurance.trim()) {
        params.insurance = insurance.trim();
      }

      if (city.trim()) {
        params.city = city.trim();
      }

      const res = await hospitalAPI.search(params);

      const data = res.data;

      setResults(
        Array.isArray(data) ? data : data.content || []
      );

      setTotalPages(
        Array.isArray(data) ? 0 : data.totalPages || 0
      );

      setPage(pg);
    } catch (err) {
      console.error('Hospital search error:', err);
      setResults([]);
      setTotalPages(0);
      setError(
        'Unable to load hospitals. Please check your backend server.'
      );
    } finally {
      setLoading(false);
    }
  }, [treatment, insurance, city]);

  useEffect(() => {
    search(0);
    // Initial load uses URL query values.
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    const p = {};

    if (treatment.trim()) {
      p.treatment = treatment.trim();
    }

    if (insurance.trim()) {
      p.insurance = insurance.trim();
    }

    if (city.trim()) {
      p.city = city.trim();
    }

    setSearchParams(p);
    search(0);
  };

  return (
    <div className="search-page page">
      <div className="container">

        {/* SEARCH BAR */}
        <form
          className="search-bar card"
          onSubmit={handleSubmit}
        >
          <input
            className="input search-bar__input"
            placeholder="Treatment (e.g. Knee Replacement)"
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
          />

          <input
            className="input search-bar__input"
            placeholder="Insurance Provider"
            value={insurance}
            onChange={(e) => setInsurance(e.target.value)}
          />

          <input
            className="input search-bar__input"
            placeholder="City (Delhi, Jamner, Noida, Gurgaon)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button
            type="submit"
            className="btn btn-primary"
          >
            Search
          </button>
        </form>

        {/* RESULTS HEADER */}
        <div className="search-results__header">
          <h2>
            {treatment
              ? (
                <>
                  Results for{' '}
                  <span className="search-results__query">
                    "{treatment}"
                  </span>
                </>
              )
              : 'All Hospitals'}
          </h2>

          {insurance && (
            <span className="badge badge-teal">
              🛡️ {insurance}
            </span>
          )}
        </div>

        {/* LOADING */}
        {loading && <div className="spinner" />}

        {/* ERROR */}
        {!loading && error && (
          <div className="search-empty">
            <h3>Something went wrong</h3>
            <p>{error}</p>
          </div>
        )}

        {/* NO RESULTS */}
        {!loading && !error && results.length === 0 && (
          <div className="search-empty">
            <div className="search-empty__icon">🏥</div>

            <h3>No matching hospital records found</h3>

            <p>
              No hospital with documented treatment
              information matched your search.
              Try another city or remove a filter.
            </p>
          </div>
        )}

        {/* HOSPITAL CARDS */}
        {!loading && !error && (
          <div className="results-grid">
            {results.map((h, i) => (
              <div
                key={h.id}
                className="hospital-card card fade-up"
                style={{
                  animationDelay: `${i * 0.06}s`
                }}
                onClick={() =>
                  navigate(`/hospital/${h.id}`)
                }
              >

                {/* NAME + BED STATUS */}
                <div className="hospital-card__top">
                  <div>
                    <h3 className="hospital-card__name">
                      {h.name}
                    </h3>

                    <p className="hospital-card__location">
                      📍 {h.city}
                    </p>
                  </div>

                  {h.hasBedsAvailable == null ? (
                    <span className="badge">
                      Beds: Not Verified
                    </span>
                  ) : (
                    <BedStatusBadge
                      status={
                        h.hasBedsAvailable
                          ? 'GREEN'
                          : 'RED'
                      }
                    />
                  )}
                </div>

                {/* FULL ADDRESS */}
                {h.address && (
                  <p className="hospital-card__location">
                    📍 {h.address}
                  </p>
                )}

                {/* PHONE NUMBER */}
                {h.phone && (
                  <p className="hospital-card__location">
                    📞{' '}
                    <a
                      href={`tel:${h.phone}`}
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >
                      {h.phone}
                    </a>
                  </p>
                )}

                {/* WEBSITE */}
                {h.sourceUrl && (
                  <p className="hospital-card__location">
                    🌐{' '}
                    <a
                      href={h.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) =>
                        e.stopPropagation()
                      }
                    >
                      Hospital website / Source
                    </a>
                  </p>
                )}

                {/* VERIFICATION STATUS */}
                <div
                  style={{
                    marginTop: '10px',
                    marginBottom: '10px'
                  }}
                >
                  {h.verificationStatus ===
                  'official-website' ? (
                    <span className="badge badge-teal">
                      ✓ Specialty listed on official website
                    </span>
                  ) : h.verificationStatus ===
                    'public-specialty-listing' ? (
                    <span className="badge badge-gold">
                      ⚠ Publicly listed specialty
                    </span>
                  ) : (
                    <span className="badge">
                      Treatment details not verified
                    </span>
                  )}
                </div>

                {/* DOCUMENTED TREATMENTS */}
                {Array.isArray(h.treatments) &&
                  h.treatments.length > 0 && (
                    <div
                      style={{
                        marginBottom: '12px'
                      }}
                    >
                      <strong>
                        Listed Treatments:
                      </strong>

                      <p
                        style={{
                          marginTop: '6px',
                          fontSize: '13px',
                          lineHeight: '1.6'
                        }}
                      >
                        {h.treatments.join(', ')}
                      </p>
                    </div>
                  )}

                {/* HOSPITAL META */}
                <div className="hospital-card__meta">
                  {h.accreditation && (
                    <span className="badge badge-gold">
                      🏅 {h.accreditation}
                    </span>
                  )}

                  {h.type && (
                    <span className="badge badge-teal">
                      {h.type}
                    </span>
                  )}
                </div>

                {/* RATING */}
                {h.averageRating != null && (
                  <div className="hospital-card__rating">
                    <StarRating
                      rating={h.averageRating}
                    />

                    <span className="hospital-card__rating-text">
                      {Number(h.averageRating).toFixed(1)}
                      {' '}({h.reviewCount ?? 0} reviews)
                    </span>
                  </div>
                )}

                {/* PRICE */}
                {h.lowestTreatmentPrice != null && (
                  <div className="hospital-card__price">
                    <span className="hospital-card__price-label">
                      Starting from
                    </span>

                    <span className="hospital-card__price-value">
                      {fmt(h.lowestTreatmentPrice)}
                    </span>
                  </div>
                )}

                {/* ICU */}
                {h.hasIcuAvailable === true && (
                  <div className="hospital-card__icu">
                    <span className="badge badge-green">
                      🏥 ICU Available
                    </span>
                  </div>
                )}

                {/* DETAILS BUTTON */}
                <div className="hospital-card__cta">
                  View Details →
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        {!loading && !error && totalPages > 1 && (
          <div className="pagination">
            {Array.from(
              { length: totalPages },
              (_, i) => (
                <button
                  key={i}
                  type="button"
                  className={
                    `pagination__btn ${
                      i === page
                        ? 'pagination__btn--active'
                        : ''
                    }`
                  }
                  onClick={() => search(i)}
                >
                  {i + 1}
                </button>
              )
            )}
          </div>
        )}

        <p
          style={{
            textAlign: 'center',
            fontSize: '12px',
            marginTop: '20px',
            opacity: 0.7
          }}
        >
          Hospital specialties are based on published
          information. Confirm current treatment
          availability directly with the hospital
          before visiting.
        </p>

      </div>
    </div>
  );
}
