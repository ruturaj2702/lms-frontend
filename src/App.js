import React, { useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark py-3">
        <div className="container">
          <span className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-mortarboard-fill text-warning"></i>
            <span>LMS Portal</span>
          </span>
          <div className="d-flex gap-2">
            <Link to="/login" className="btn btn-outline-light btn-sm px-3">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary btn-sm px-3">
              Register
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container flex-grow-1 d-flex align-items-center py-5">
        <div className="row align-items-center w-100 g-5">
          <div className="col-lg-7">
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 rounded-pill fw-semibold mb-3">
              <i className="bi bi-cloud-arrow-up-fill me-1"></i> Experiment 10: Cloud Deployment
            </span>
            <h1 className="display-4 fw-bold text-dark lh-tight mb-3">
              Full-Stack MERN Learning Management System
            </h1>
            <p className="lead text-secondary mb-4">
              Equipped with secure JWT authentication, role-based dashboards (Student, Teacher, Admin),
              and deployed across modern cloud architectures: <strong>Render</strong> for Express API &amp; 
              <strong> Vercel</strong> for React UI.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <Link to="/login" className="btn btn-primary btn-lg px-4 fw-semibold shadow-sm">
                <i className="bi bi-box-arrow-in-right me-2"></i> Get Started (Login)
              </Link>
              <Link to="/register" className="btn btn-outline-secondary btn-lg px-4 fw-semibold">
                <i className="bi bi-person-plus me-2"></i> Create Account
              </Link>
            </div>

            {/* Architecture Pills */}
            <div className="mt-4 pt-3 border-top d-flex flex-wrap gap-2 text-muted small">
              <span className="badge bg-white text-secondary border px-3 py-2">
                <i className="bi bi-cpu text-primary me-1"></i> React UI
              </span>
              <span className="badge bg-white text-secondary border px-3 py-2">
                <i className="bi bi-server text-success me-1"></i> Node/Express
              </span>
              <span className="badge bg-white text-secondary border px-3 py-2">
                <i className="bi bi-database text-warning me-1"></i> MongoDB
              </span>
              <span className="badge bg-white text-secondary border px-3 py-2">
                <i className="bi bi-cloud-check text-info me-1"></i> Render &amp; Vercel
              </span>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="card-header bg-primary text-white py-3 px-4">
                <div className="d-flex align-items-center justify-content-between">
                  <span className="fw-semibold small">Deployment Architecture</span>
                  <span className="badge bg-light text-primary">Live Setup</span>
                </div>
              </div>
              <div className="card-body p-4 bg-white">
                <div className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
                  <div className="bg-primary-subtle p-2 rounded text-primary">
                    <i className="bi bi-window-sidebar fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Frontend UI (Vercel)</h6>
                    <small className="text-muted d-block mb-1">React + Bootstrap Single Page App</small>
                    <code className="text-primary small">https://lms-mern.vercel.app</code>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3 mb-3 pb-3 border-bottom">
                  <div className="bg-success-subtle p-2 rounded text-success">
                    <i className="bi bi-hdd-rack fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Backend API (Render)</h6>
                    <small className="text-muted d-block mb-1">Express + JWT Authentication</small>
                    <code className="text-success small">https://lms-backend.onrender.com/api</code>
                  </div>
                </div>

                <div className="d-flex align-items-start gap-3">
                  <div className="bg-warning-subtle p-2 rounded text-warning">
                    <i className="bi bi-database-fill-check fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Database (MongoDB Atlas)</h6>
                    <small className="text-muted d-block mb-1">Cloud Mongo Replica Set</small>
                    <span className="badge bg-success-subtle text-success">Cluster0 Connected</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-top py-3 text-center text-muted small">
        Full Stack Web Development &bull; Experiment Number 8: Deploy MERN App to Render &amp; Vercel
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<LandingPage />} />
    </Routes>
  );
}
