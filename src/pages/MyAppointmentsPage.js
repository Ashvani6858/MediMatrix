import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { appointmentAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './MyAppointmentsPage.css';

const STATUS_BADGE = {
  PENDING:   { cls: 'badge-gold',  icon: '⏳' },
  CONFIRMED: { cls: 'badge-green', icon: '✅' },
  CANCELLED: { cls: 'badge-red',   icon: '❌' },
  COMPLETED: { cls: 'badge-teal',  icon: '🏁' },
};

export default function MyAppointmentsPage() {
  const { isLoggedIn } = useAuth();
  const navigate       = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    if (!isLoggedIn) { navigate('/login'); return; }
    appointmentAPI.getMine({ page: 0, size: 20 })
      .then(r => setAppointments(r.data?.content || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isLoggedIn, navigate]);

  const cancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await appointmentAPI.cancel(id);
      setAppointments(prev =>
        prev.map(a => a.id === id ? { ...a, status: 'CANCELLED' } : a));
    } catch { alert('Could not cancel. Please try again.'); }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="appointments-page page">
      <div className="container">
        <div className="appointments-header fade-up">
          <h1>My Appointments</h1>
          <button className="btn btn-primary" onClick={() => navigate('/search')}>
            + Book New
          </button>
        </div>

        {appointments.length === 0 ? (
          <div className="appointments-empty fade-up">
            <div style={{ fontSize: '4rem', marginBottom: 16 }}>📅</div>
            <h3>No appointments yet</h3>
            <p>Find a hospital and book your first appointment.</p>
            <button className="btn btn-primary" onClick={() => navigate('/search')}>
              Find Hospitals
            </button>
          </div>
        ) : (
          <div className="appointments-list">
            {appointments.map((a, i) => {
              const badge = STATUS_BADGE[a.status] || STATUS_BADGE.PENDING;
              return (
                <div key={a.id}
                     className="appointment-card card fade-up"
                     style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="appointment-card__top">
                    <div className="appointment-card__info">
                      <h3 className="appointment-card__hospital">{a.hospitalName}</h3>
                      {a.treatmentName && (
                        <p className="appointment-card__treatment">🩺 {a.treatmentName}</p>
                      )}
                    </div>
                    <span className={`badge ${badge.cls}`}>
                      {badge.icon} {a.status}
                    </span>
                  </div>

                  <div className="appointment-card__details">
                    <div className="appt-detail">
                      <span className="appt-detail__label">Date</span>
                      <span className="appt-detail__value">
                        {new Date(a.appointmentDate).toLocaleDateString('en-IN', {
                          weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                        })}
                      </span>
                    </div>
                    {a.appointmentTime && (
                      <div className="appt-detail">
                        <span className="appt-detail__label">Time</span>
                        <span className="appt-detail__value">{a.appointmentTime}</span>
                      </div>
                    )}
                    <div className="appt-detail">
                      <span className="appt-detail__label">Confirmation Code</span>
                      <span className="appt-detail__value appt-detail__code">
                        {a.confirmationCode}
                      </span>
                    </div>
                    <div className="appt-detail">
                      <span className="appt-detail__label">Booked On</span>
                      <span className="appt-detail__value">
                        {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : '—'}
                      </span>
                    </div>
                  </div>

                  {a.status === 'PENDING' || a.status === 'CONFIRMED' ? (
                    <div className="appointment-card__actions">
                      <button className="btn btn-ghost"
                        onClick={() => navigate(`/hospital/${a.hospitalId}`)}>
                        View Hospital
                      </button>
                      <button className="btn btn-outline"
                        style={{ borderColor: 'var(--red)', color: 'var(--red)' }}
                        onClick={() => cancel(a.id)}>
                        Cancel
                      </button>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
