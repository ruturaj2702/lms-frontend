import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from './api';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }, [navigate]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [profileRes, dashRes] = await Promise.all([
        api.get('/profile/me'),
        api.get('/profile/dashboard-data')
      ]);
      setProfile(profileRes.data);
      setDashboardData(dashRes.data);
      setError('');
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Session expired or unable to reach backend API.');
      handleLogout();
    } finally {
      setLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status"></div>
          <h5 className="text-secondary fw-semibold">Loading LMS Cloud Dashboard...</h5>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger d-inline-block">
          {error || 'Error loading dashboard'}
        </div>
      </div>
    );
  }

  const roleBadgeColor = {
    student: 'bg-primary',
    teacher: 'bg-success',
    admin: 'bg-danger'
  }[profile.role] || 'bg-secondary';

  return (
    <div className="min-vh-100 bg-light">
      {/* Top Navigation */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold d-flex align-items-center gap-2">
            <i className="bi bi-mortarboard-fill text-warning"></i>
            <span>LMS Portal</span>
          </span>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end text-white-50 d-none d-sm-block">
              <div className="text-white fw-semibold small">{profile.name}</div>
              <small>{profile.email}</small>
            </div>
            <span className={`badge ${roleBadgeColor} text-uppercase px-2 py-1`}>
              {profile.role}
            </span>
            <button
              onClick={handleLogout}
              className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1"
              title="Logout"
            >
              <i className="bi bi-box-arrow-right"></i>
              <span className="d-none d-sm-inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="container py-4">
        {/* Welcome Banner */}
        <div className="card shadow-sm border-0 mb-4 bg-white">
          <div className="card-body p-4 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
            <div>
              <h3 className="fw-bold text-dark mb-1">
                Welcome back, {profile.name}! 👋
              </h3>
              <p className="text-muted mb-0 small">
                Logged in as <strong className="text-capitalize">{profile.role}</strong> &bull; Authenticated via JWT
              </p>
            </div>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 small">
                <i className="bi bi-cloud-check me-1"></i> Cloud Connected
              </span>
              <button onClick={loadData} className="btn btn-outline-secondary btn-sm" title="Refresh">
                <i className="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Role-Specific Dashboard Views */}
        {profile.role === 'student' && <StudentDashboardView data={dashboardData} />}
        {profile.role === 'teacher' && <TeacherDashboardView data={dashboardData} />}
        {profile.role === 'admin' && <AdminDashboardView data={dashboardData} />}
      </main>
    </div>
  );
}

/* ==================== Student Dashboard Component ==================== */
function StudentDashboardView({ data }) {
  const summary = data?.summary || {};
  const courses = data?.courses || [];
  const assignments = data?.assignments || [];

  return (
    <div>
      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-primary border-4">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Enrolled Courses</div>
              <div className="fs-3 fw-bold text-primary mt-1">{summary.enrolledCourses || 4}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-warning border-4">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Pending Tasks</div>
              <div className="fs-3 fw-bold text-warning mt-1">{summary.pendingAssignments || 2}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-success border-4">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Completed Quizzes</div>
              <div className="fs-3 fw-bold text-success mt-1">{summary.completedQuizzes || 6}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-info border-4">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Attendance</div>
              <div className="fs-3 fw-bold text-info mt-1">{summary.attendance || '92%'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Enrolled Courses */}
        <div className="col-lg-7">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="card-title fw-bold mb-0 text-primary">
                <i className="bi bi-journal-bookmark me-2"></i>My Enrolled Courses
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {courses.map((c) => (
                  <div key={c.id} className="list-group-item px-0 py-3">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <span className="fw-semibold text-dark">{c.title}</span>
                      <span className="badge bg-secondary-subtle text-secondary">{c.id}</span>
                    </div>
                    <div className="text-muted small mb-2">Instructor: {c.instructor}</div>
                    <div className="d-flex align-items-center gap-2">
                      <div className="progress flex-grow-1" style={{ height: '8px' }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          style={{ width: `${c.progress}%` }}
                          aria-valuenow={c.progress}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <small className="text-muted fw-semibold">{c.progress}%</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Assignments Table */}
        <div className="col-lg-5">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="card-title fw-bold mb-0 text-dark">
                <i className="bi bi-file-earmark-check me-2"></i>Assignments
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Title</th>
                      <th>Due</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assignments.map((a) => (
                      <tr key={a.id}>
                        <td className="fw-semibold small">{a.title}</td>
                        <td className="small text-muted">{a.due}</td>
                        <td>
                          <span
                            className={`badge ${
                              a.status === 'Submitted' ? 'bg-success' : 'bg-warning text-dark'
                            }`}
                          >
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== Teacher Dashboard Component ==================== */
function TeacherDashboardView({ data }) {
  const summary = data?.summary || {};
  const classes = data?.classes || [];
  const submissions = data?.recentSubmissions || [];

  return (
    <div>
      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-success border-4">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Active Classes</div>
              <div className="fs-3 fw-bold text-success mt-1">{summary.activeCourses || 3}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-info border-4">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Total Students</div>
              <div className="fs-3 fw-bold text-info mt-1">{summary.totalStudents || 142}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-warning border-4">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">To Grade</div>
              <div className="fs-3 fw-bold text-warning mt-1">{summary.pendingSubmissions || 18}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-primary border-4">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Avg Class Score</div>
              <div className="fs-3 fw-bold text-primary mt-1">{summary.avgClassScore || '81%'}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Classes Managed */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="card-title fw-bold mb-0 text-success">
                <i className="bi bi-people-fill me-2"></i>My Teaching Batches
              </h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                {classes.map((cls) => (
                  <div key={cls.id} className="list-group-item d-flex justify-content-between align-items-center px-0 py-3">
                    <div>
                      <h6 className="fw-semibold mb-1">{cls.name}</h6>
                      <small className="text-muted">Batch ID: {cls.id}</small>
                    </div>
                    <span className="badge bg-success-subtle text-success px-3 py-2">
                      {cls.students} Students
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Student Submissions Queue */}
        <div className="col-lg-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-3 border-bottom">
              <h5 className="card-title fw-bold mb-0 text-dark">
                <i className="bi bi-inbox-fill me-2"></i>Recent Submissions
              </h5>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Student</th>
                      <th>Assignment</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((s) => (
                      <tr key={s.id}>
                        <td className="fw-semibold small">{s.studentName}</td>
                        <td className="small text-muted">{s.assignment}</td>
                        <td className="small text-muted">{s.submittedAt}</td>
                        <td>
                          <button className="btn btn-outline-success btn-sm py-0">Grade</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ==================== Admin Dashboard Component ==================== */
function AdminDashboardView({ data }) {
  const summary = data?.summary || {};
  const recentUsers = data?.recentUsers || [];

  return (
    <div>
      {/* Stat Cards */}
      <div className="row g-3 mb-4">
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-danger border-4">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Total Users</div>
              <div className="fs-3 fw-bold text-danger mt-1">{summary.totalUsers || 0}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-primary border-4">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Students</div>
              <div className="fs-3 fw-bold text-primary mt-1">{summary.totalStudents || 0}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-success border-4">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Teachers</div>
              <div className="fs-3 fw-bold text-success mt-1">{summary.totalTeachers || 0}</div>
            </div>
          </div>
        </div>
        <div className="col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 border-start border-dark border-4">
            <div className="card-body">
              <div className="text-muted small fw-semibold text-uppercase">Admins</div>
              <div className="fs-3 fw-bold text-dark mt-1">{summary.totalAdmins || 0}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Architecture Panel */}
      <div className="card shadow-sm border-0 mb-4 bg-white">
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="card-title fw-bold mb-0 text-dark">
            <i className="bi bi-hdd-network-fill me-2 text-danger"></i>Cloud Deployment Topology
          </h5>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="p-3 border rounded bg-light">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-semibold">Backend API</span>
                  <span className="badge bg-success">Online</span>
                </div>
                <div className="small text-muted">Platform: Render Web Service</div>
                <div className="small text-primary text-truncate">https://lms-backend.onrender.com</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 border rounded bg-light">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-semibold">Frontend App</span>
                  <span className="badge bg-success">Online</span>
                </div>
                <div className="small text-muted">Platform: Vercel Cloud Edge</div>
                <div className="small text-primary text-truncate">https://lms-mern.vercel.app</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-3 border rounded bg-light">
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <span className="fw-semibold">Database</span>
                  <span className="badge bg-success">Connected</span>
                </div>
                <div className="small text-muted">Platform: MongoDB Atlas</div>
                <div className="small text-muted text-truncate">Cluster0 (Cloud Database)</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users Table */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-white py-3 border-bottom">
          <h5 className="card-title fw-bold mb-0 text-dark">
            <i className="bi bi-people me-2"></i>Registered Users Directory
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {recentUsers.map((u) => (
                  <tr key={u._id}>
                    <td className="fw-semibold">{u.name}</td>
                    <td className="text-muted small">{u.email}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.role === 'admin'
                            ? 'bg-danger'
                            : u.role === 'teacher'
                            ? 'bg-success'
                            : 'bg-primary'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="small text-muted">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
