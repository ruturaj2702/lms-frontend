import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="card shadow border-0" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-header bg-primary text-white text-center py-4 rounded-top">
          <i className="bi bi-mortarboard-fill display-5 d-block mb-2"></i>
          <h4 className="fw-bold mb-0">LMS Portal Login</h4>
          <small className="text-white-50">Cloud-Hosted MERN Web Application</small>
        </div>
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">
                <i className="bi bi-envelope me-1"></i> Email Address
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label fw-semibold small text-secondary">
                <i className="bi bi-lock me-1"></i> Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing in...
                </span>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-1"></i> Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-muted small">Don't have an account? </span>
            <Link to="/register" className="fw-semibold text-decoration-none small">
              Register here
            </Link>
          </div>
        </div>
        <div className="card-footer bg-light text-center py-2 text-muted small">
          Deployed on Render (API) &amp; Vercel (UI)
        </div>
      </div>
    </div>
  );
}
