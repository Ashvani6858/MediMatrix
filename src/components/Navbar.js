import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setMenuOpen(false), [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const getDashboardLink = () => {
    if (!user) return '/';
    if (user.role === 'HOSPITAL_ADMIN') return '/hospital-dashboard';
    if (user.role === 'SUPER_ADMIN') return '/admin';
    return '/my-appointments';
  };

  return (
    <nav className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        <Link to="/" className="navbar__brand">
          <span className="navbar__cross">✚</span>
          <span className="navbar__name">MediCompare</span>
        </Link>

        <div className={`navbar__links ${menuOpen ? 'navbar__links--open' : ''}`}>
          <Link to="/search" className="navbar__link">Find Hospitals</Link>
          <Link to="/treatments" className="navbar__link">Treatments</Link>
          {isLoggedIn ? (
            <>
              <Link to={getDashboardLink()} className="navbar__link">Dashboard</Link>
              <div className="navbar__user">
                <span className="navbar__user-name">Hi, {user?.name?.split(' ')[0]}</span>
                <button className="btn btn-ghost navbar__logout" onClick={handleLogout}>Logout</button>
              </div>
            </>
          ) : (
            <div className="navbar__auth">
              <Link to="/login" className="btn btn-ghost">Login</Link>
              <Link to="/register" className="btn btn-primary">Sign Up</Link>
            </div>
          )}
        </div>

        <button className="navbar__hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </div>
    </nav>
  );
}
