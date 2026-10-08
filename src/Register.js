import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from './api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.post('/auth/register', { name, email, password, role });
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center py-5">
      <div className="card shadow border-0" style={{ maxWidth: '460px', width: '100%' }}>
        <div className="card-header bg-success text-white text-center py-4 rounded-top">
          <i className="bi bi-person-plus-fill display-5 d-block mb-2"></i>
          <h4 className="fw-bold mb-0">Create an Account</h4>
          <small className="text-white-50">LMS Role-Based Management System</small>
        </div>
        <div className="card-body p-4">
          {error && (
            <div className="alert alert-danger py-2 small" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success py-2 small" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold small text-secondary">
                <i className="bi bi-person me-1"></i> Full Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div className="mb-3">
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

            <div className="mb-4">
              <label className="form-label fw-semibold small text-secondary">
                <i className="bi bi-shield-lock me-1"></i> Select Role
              </label>
              <select
                className="form-select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">🎓 Student (Access Courses &amp; Assignments)</option>
                <option value="teacher">👨‍🏫 Teacher (Manage Courses &amp; Submissions)</option>
                <option value="admin">⚙️ Admin (System Oversight &amp; User Directory)</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn btn-success w-100 py-2 fw-semibold"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Registering...
                </span>
              ) : (
                <>
                  <i className="bi bi-check2-circle me-1"></i> Register Account
                </>
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <span className="text-muted small">Already have an account? </span>
            <Link to="/login" className="fw-semibold text-decoration-none small text-success">
              Login here
            </Link>
          </div>
        </div>
        <div className="card-footer bg-light text-center py-2 text-muted small">
          Connects to MongoDB Atlas Cloud Database
        </div>
      </div>
    </div>
  );
}
