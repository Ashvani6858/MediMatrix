import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { hospitalAPI, bedAPI, appointmentAPI, reviewAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import BedStatusBadge from '../components/BedStatusBadge';
import './HospitalDashboardPage.css';

export default function HospitalDashboardPage() {
  const { isLoggedIn, user } = useAuth();
  const navigate             = useNavigate();

  const [tab, setTab]             = useState('beds');
  const [beds, setBeds]           = useState(null);
  const [bedForm, setBedForm]     = useState({});
  const [appointments, setAppointments] = useState([]);
  const [reviews, setReviews]     = useState([]);
  const [hospitalId, setHospitalId] = useState(null);
  const [loading, setLoading]     = useState(true);
  const [msg, setMsg]             = useState('');
  const [replyText, setReplyText] = useState({});

  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'HOSPITAL_ADMIN') {
      navigate('/login'); return;
    }
    // Get hospital by searching admin's hospitals
    hospitalAPI.search({ page: 0, size: 1 }).then(r => {
      const h = r.data?.content?.[0];
      if (!h) { setLoading(false); return; }
      const hid = h.id;
      setHospitalId(hid);
      return Promise.all([
        bedAPI.getStatus(hid),
        appointmentAPI.getMine ? null : null,
        reviewAPI.getByHospital(hid, { page: 0, size: 20 }),
      ]);
    }).then(results => {
      if (!results) return;
      const [b, , r] = results;
      if (b) { setBeds(b.data); setBedForm(b.data); }
      if (r) setReviews(r.data?.content || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [isLoggedIn, user, navigate]);

  const updateBeds = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await bedAPI.update(hospitalId, {
        generalTotal: +bedForm.generalTotal, generalAvailable: +bedForm.generalAvailable,
        privateTotal: +bedForm.privateTotal, privateAvailable: +bedForm.privateAvailable,
        icuTotal: +bedForm.icuTotal, icuAvailable: +bedForm.icuAvailable,
        emergencyTotal: +bedForm.emergencyTotal, emergencyAvailable: +bedForm.emergencyAvailable,
      });
      setBeds(res.data);
      setMsg('✅ Bed counts updated successfully!');
    } catch { setMsg('❌ Update failed. Please try again.'); }
  };

  const handleReply = async (reviewId) => {
    const reply = replyText[reviewId];
    if (!reply) return;
    try {
      await reviewAPI.reply(reviewId, { reply });
      setReviews(prev => prev.map(r =>
        r.id === reviewId ? { ...r, hospitalReply: reply } : r));
      setReplyText(t => ({ ...t, [reviewId]: '' }));
    } catch { alert('Reply failed.'); }
  };

  if (loading) return <div className="page"><div className="spinner" /></div>;

  return (
    <div className="dashboard page">
      <div className="container">
        <div className="dashboard__header fade-up">
          <div>
            <h1>Hospital Dashboard</h1>
            <p>Manage your hospital's beds, appointments, and reputation.</p>
          </div>
          {beds && <BedStatusBadge status={beds.status} size="lg" />}
        </div>

        {/* Tabs */}
        <div className="hd-tabs">
          {['beds', 'appointments', 'reviews'].map(t => (
            <button key={t}
              className={`hd-tab ${tab === t ? 'hd-tab--active' : ''}`}
              onClick={() => setTab(t)}>
              {{ beds: '🛏️ Manage Beds', appointments: '📅 Appointments', reviews: '⭐ Reviews' }[t]}
            </button>
          ))}
        </div>

        {/* Beds Tab */}
        {tab === 'beds' && (
          <div className="dash-section fade-up">
            <div className="dash-section__title">
              <h3>Live Bed Availability</h3>
              <p>Updates reflect immediately for all patients searching your hospital.</p>
            </div>
            {msg && <div className={`alert ${msg.startsWith('✅') ? 'alert-success' : 'alert-error'}`}>{msg}</div>}
            <form className="bed-form card" onSubmit={updateBeds}>
              <div className="bed-form__grid">
                {[
                  { label: 'General Ward', totalKey: 'generalTotal', availKey: 'generalAvailable', icon: '🛏️' },
                  { label: 'Private Room', totalKey: 'privateTotal', availKey: 'privateAvailable', icon: '🏠' },
                  { label: 'ICU',          totalKey: 'icuTotal',     availKey: 'icuAvailable',     icon: '🏥' },
                  { label: 'Emergency',    totalKey: 'emergencyTotal',availKey: 'emergencyAvailable',icon: '🚨' },
                ].map(b => (
                  <div key={b.label} className="bed-form__row card">
                    <div className="bed-form__row-header">
                      <span className="bed-form__icon">{b.icon}</span>
                      <span className="bed-form__label">{b.label}</span>
                    </div>
                    <div className="bed-form__inputs">
                      <div>
                        <label className="search-field__label">Total</label>
                        <input type="number" min="0" className="input"
                          value={bedForm[b.totalKey] ?? ''}
                          onChange={e => setBedForm(f => ({ ...f, [b.totalKey]: e.target.value }))} />
                      </div>
                      <div>
                        <label className="search-field__label">Available</label>
                        <input type="number" min="0" className="input"
                          value={bedForm[b.availKey] ?? ''}
                          onChange={e => setBedForm(f => ({ ...f, [b.availKey]: e.target.value }))} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button type="submit" className="btn btn-primary" style={{ marginTop: 8 }}>
                💾 Update Bed Counts
              </button>
            </form>
          </div>
        )}

        {/* Reviews Tab */}
        {tab === 'reviews' && (
          <div className="dash-section fade-up">
            <div className="dash-section__title">
              <h3>Patient Reviews</h3>
              <p>Respond to reviews to build trust with future patients.</p>
            </div>
            {reviews.length === 0
              ? <p style={{ color: 'var(--text-muted)' }}>No reviews yet.</p>
              : reviews.map(r => (
                <div key={r.id} className="dash-review card">
                  <div className="dash-review__top">
                    <span className="dash-review__patient">{r.patientName}</span>
                    <div className="dash-review__stars">
                      {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                    </div>
                    <span className="dash-review__date">
                      {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  {r.comment && <p className="dash-review__comment">{r.comment}</p>}
                  {r.hospitalReply
                    ? (
                      <div className="dash-review__reply-shown">
                        <span>Your reply:</span> {r.hospitalReply}
                      </div>
                    ) : (
                      <div className="dash-review__reply-form">
                        <input className="input" placeholder="Write a reply…"
                          value={replyText[r.id] || ''}
                          onChange={e => setReplyText(t => ({ ...t, [r.id]: e.target.value }))} />
                        <button className="btn btn-outline" onClick={() => handleReply(r.id)}>
                          Reply
                        </button>
                      </div>
                    )}
                </div>
              ))}
          </div>
        )}

        {/* Appointments tab placeholder */}
        {tab === 'appointments' && (
          <div className="dash-section fade-up">
            <div className="dash-section__title">
              <h3>Incoming Appointments</h3>
              <p>Appointments booked by patients at your hospital.</p>
            </div>
            <div className="appointments-empty" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '3rem', marginBottom: 12 }}>📅</div>
              <p>Appointment management is available via the backend API.<br />
                Use <code style={{ color: 'var(--teal)', fontFamily: 'var(--font-mono)' }}>PATCH /api/appointments/{'{id}'}/confirm</code> to confirm bookings.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
