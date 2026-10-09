
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hospitalAPI } from '../services/api';
import './HospitalDetailPage.css';

export default function HospitalDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function loadHospital() {
      setLoading(true);
      setError('');

      try {
        const res = await hospitalAPI.getById(id);

        if (active) {
          setHospital(res.data);
        }
      } catch (err) {
        console.error('Hospital details error:', err);

        if (active) {
          setError('Unable to load hospital details.');
          setHospital(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadHospital();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="page">
        <div className="spinner" />
      </div>
    );
  }

  if (error || !hospital) {
    return (
      <div className="page">
        <div className="container">
          <h2>Hospital details unavailable</h2>
          <p>{error || 'Hospital not found.'}</p>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/search')}
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const treatments = Array.isArray(hospital.treatments)
    ? hospital.treatments
    : [];

  const verificationText =
    hospital.verificationStatus === 'official-website'
      ? 'Specialties listed on official website'
      : hospital.verificationStatus === 'public-specialty-listing'
      ? 'Specialties from public listings'
      : 'Treatment information not verified';

  return (
    <div className="hospital-detail page">
      <div className="container">

        {/* HOSPITAL HEADER */}
        <div className="hd-header fade-up">
          <div className="hd-header__main">
            <div>
              <h1 className="hd-header__name">
                {hospital.name}
              </h1>

              <p className="hd-header__address">
                📍 {hospital.city}
              </p>

              {hospital.address && (
                <p className="hd-header__address">
                  {hospital.address}
                </p>
              )}

              <span className="badge badge-teal">
                {verificationText}
              </span>
            </div>
          </div>
        </div>

        {/* CONTACT DETAILS */}
        <div className="hd-section card">
          <h3>Hospital Contact Details</h3>

          <p>
            <strong>Hospital:</strong> {hospital.name}
          </p>

          <p>
            <strong>City:</strong> {hospital.city}
          </p>

          <p>
            <strong>Address:</strong>{' '}
            {hospital.address || 'Not available'}
          </p>

          <p>
            <strong>Phone:</strong>{' '}
            {hospital.phone ? (
              <a href={`tel:${hospital.phone}`}>
                {hospital.phone}
              </a>
            ) : (
              'Not available'
            )}
          </p>

          {hospital.sourceUrl && (
            <p>
              <strong>Website / Source:</strong>{' '}
              <a
                href={hospital.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Source ↗
              </a>
            </p>
          )}
        </div>

        {/* TREATMENTS */}
        <div
          className="hd-section card"
          style={{ marginTop: '20px' }}
        >
          <h3>Listed Treatments & Specialties</h3>

          {treatments.length > 0 ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '10px',
                marginTop: '15px'
              }}
            >
              {treatments.map((t, index) => (
                <span
                  key={`${t}-${index}`}
                  className="badge badge-teal"
                  style={{
                    padding: '10px 14px'
                  }}
                >
                  ✓ {t}
                </span>
              ))}
            </div>
          ) : (
            <p>
              No treatment information has been
              verified for this hospital yet.
            </p>
          )}

          <p
            style={{
              marginTop: '18px',
              fontSize: '13px',
              opacity: 0.8
            }}
          >
            Note: Listed specialties do not guarantee
            that a specific procedure, doctor or
            appointment is currently available.
            Confirm directly with the hospital.
          </p>
        </div>

        {/* BED AVAILABILITY */}
        <div
          className="hd-section card"
          style={{ marginTop: '20px' }}
        >
          <h3>Bed Availability</h3>
          <p>
            Current bed and ICU availability
            has not been verified.
          </p>
        </div>

        {/* ACTIONS */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginTop: '24px'
          }}
        >
          {hospital.phone && (
            <a
              href={`tel:${hospital.phone}`}
              className="btn btn-primary"
            >
              📞 Call Hospital
            </a>
          )}

          {hospital.address && (
            <a
              href={
                'https://www.google.com/maps/search/?api=1&query=' +
                encodeURIComponent(
                  hospital.name + ', ' +
                  hospital.address + ', ' +
                  hospital.city
                )
              }
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              📍 View on Google Maps
            </a>
          )}

          <button
            className="btn btn-outline"
            onClick={() => navigate('/search')}
          >
            ← Back to Search
          </button>
        </div>

      </div>
    </div>
  );
}
