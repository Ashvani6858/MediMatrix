import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './AuthPages.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate   = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      login(res.data);
      const role = res.data.role;
      if (role === 'HOSPITAL_ADMIN') navigate('/hospital-dashboard');
      else if (role === 'SUPER_ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page">
      <div className="auth-card card fade-up">
        <div className="auth-card__brand">
          <span style={{ color: 'var(--teal)', fontSize: '1.8rem' }}>✚</span>
          <span className="auth-card__brand-name">MediCompare</span>
        </div>
        <h2 className="auth-card__title">Welcome back</h2>
        <p className="auth-card__subtitle">Login to book appointments & track your health journey.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form__field">
            <label>Email</label>
            <input className="input" type="email" placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="auth-form__field">
            <label>Password</label>
            <input className="input" type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary auth-form__submit" disabled={loading}>
            {loading ? 'Logging in…' : 'Login →'}
          </button>
        </form>

        <p className="auth-card__switch">
          Don't have an account? <Link to="/register">Sign up free</Link>
        </p>

        <div className="auth-card__demo">
          <p className="auth-card__demo-title">Demo Accounts</p>
          <div className="auth-card__demo-grid">
            {[
              { role: 'Patient', email: 'patient@example.com', pw: 'Patient@1234' },
              { role: 'Hospital', email: 'hospital@aiims.in', pw: 'Hospital@1234' },
              { role: 'Admin', email: 'admin@medicompare.in', pw: 'Admin@1234' },
            ].map(d => (
              <button key={d.role} type="button" className="demo-btn"
                onClick={() => { setEmail(d.email); setPassword(d.pw); }}>
                <span className="demo-btn__role">{d.role}</span>
                <span className="demo-btn__email">{d.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
