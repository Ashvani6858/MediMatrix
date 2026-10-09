import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar              from './components/Navbar';
import HomePage            from './pages/HomePage';
import SearchPage          from './pages/SearchPage';
import HospitalDetailPage  from './pages/HospitalDetailPage';
import TreatmentsPage      from './pages/TreatmentsPage';
import LoginPage           from './pages/LoginPage';
import RegisterPage        from './pages/RegisterPage';
import MyAppointmentsPage  from './pages/MyAppointmentsPage';
import HospitalDashboardPage from './pages/HospitalDashboardPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/"                   element={<HomePage />} />
          <Route path="/search"             element={<SearchPage />} />
          <Route path="/hospital/:id"       element={<HospitalDetailPage />} />
          <Route path="/treatments"         element={<TreatmentsPage />} />
          <Route path="/login"              element={<LoginPage />} />
          <Route path="/register"           element={<RegisterPage />} />
          <Route path="/my-appointments"    element={<MyAppointmentsPage />} />
          <Route path="/hospital-dashboard" element={<HospitalDashboardPage />} />
          <Route path="*" element={
            <div className="page" style={{ textAlign: 'center', paddingTop: '120px' }}>
              <div style={{ fontSize: '5rem' }}>🏥</div>
              <h2 style={{ color: 'var(--white)', marginTop: 20 }}>Page not found</h2>
              <a href="/" style={{ color: 'var(--teal)', marginTop: 16, display: 'block' }}>
                Back to Home
              </a>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
