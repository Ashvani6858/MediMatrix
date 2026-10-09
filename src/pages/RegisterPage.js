import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

const INSURANCE_OPTIONS = [
  'Star Health', 'HDFC ERGO', 'ICICI Lombard',
  'New India Assurance', 'United India Insurance',
  'Bajaj Allianz', 'Religare Health', 'Aditya Birla Health'
];

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', phone: '',
    insuranceProvider: '', insurancePolicyNumber: '', role: 'PATIENT'
  });
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authAPI.register(form);
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page">
      <div className="auth-card auth-card--wide card fade-up">
        <div className="auth-card__brand">
          <span style={{ color: 'var(--teal)', fontSize: '1.8rem' }}>✚</span>
          <span className="auth-card__brand-name">MediCompare</span>
        </div>
        <h2 className="auth-card__title">Create your account</h2>
        <p className="auth-card__subtitle">Free to join. Transparent healthcare starts here.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__grid">
            <div className="auth-form__field">
              <label>Full Name</label>
              <input className="input" placeholder="Rahul Sharma"
                value={form.fullName} onChange={set('fullName')} required />
            </div>
            <div className="auth-form__field">
              <label>Email</label>
              <input className="input" type="email" placeholder="you@example.com"
                value={form.email} onChange={set('email')} required />
            </div>
            <div className="auth-form__field">
              <label>Password</label>
              <input className="input" type="password" placeholder="Min 6 characters"
                value={form.password} onChange={set('password')} required minLength={6} />
            </div>
            <div className="auth-form__field">
              <label>Phone</label>
              <input className="input" placeholder="9876543210"
                value={form.phone} onChange={set('phone')} />
            </div>
            <div className="auth-form__field">
              <label>Insurance Provider</label>
              <select className="input" value={form.insuranceProvider} onChange={set('insuranceProvider')}>
                <option value="">None / Don't have insurance</option>
                {INSURANCE_OPTIONS.map(ins => (
                  <option key={ins} value={ins}>{ins}</option>
                ))}
              </select>
            </div>
            <div className="auth-form__field">
              <label>Insurance Policy Number</label>
              <input className="input" placeholder="Optional"
                value={form.insurancePolicyNumber} onChange={set('insurancePolicyNumber')} />
            </div>
          </div>

          <div className="auth-form__field auth-role-select">
            <label>I am a</label>
            <div className="auth-role-btns">
              {[
                { val: 'PATIENT', label: '👤 Patient', desc: 'Search hospitals & book' },
                { val: 'HOSPITAL_ADMIN', label: '🏥 Hospital Admin', desc: 'Manage my hospital' },
              ].map(r => (
                <button type="button" key={r.val}
                  className={`role-btn ${form.role === r.val ? 'role-btn--active' : ''}`}
                  onClick={() => setForm(f => ({ ...f, role: r.val }))}>
                  <span className="role-btn__label">{r.label}</span>
                  <span className="role-btn__desc">{r.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="btn btn-primary auth-form__submit" disabled={loading}>
            {loading ? 'Creating Account…' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-card__switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
