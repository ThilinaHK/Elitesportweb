import { useState } from 'react';
import { useRouter } from 'next/router';
import { showToast } from '../components/Toast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    emergencyContact: '',
    medicalConditions: ''
  });
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (formData.password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          emergencyContact: formData.emergencyContact,
          medicalConditions: formData.medicalConditions,
          joinDate: new Date().toISOString(),
          membershipStatus: 'active'
        })
      });

      if (response.ok) {
        showToast('Registration successful! Please login.', 'success');
        setTimeout(() => router.push('/login'), 2000);
      } else {
        const error = await response.json();
        showToast(error.message || 'Registration failed', 'error');
      }
    } catch (error) {
      showToast('Registration failed. Please try again.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-vh-100 d-flex align-items-center" style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Inter, sans-serif'
    }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-lg border-0" style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px'
            }}>
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-dark mb-2">Join Elite Sports</h2>
                  <p className="text-muted">Create your member account</p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '12px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '12px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      className="form-control form-control-lg"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '12px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control form-control-lg"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '12px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Confirm Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      className="form-control form-control-lg"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      style={{ borderRadius: '12px' }}
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Emergency Contact</label>
                    <input
                      type="tel"
                      name="emergencyContact"
                      className="form-control form-control-lg"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      style={{ borderRadius: '12px' }}
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Medical Conditions (Optional)</label>
                    <textarea
                      name="medicalConditions"
                      className="form-control"
                      rows="3"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      style={{ borderRadius: '12px' }}
                      placeholder="Any medical conditions we should know about..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-100 fw-semibold"
                    disabled={loading}
                    style={{
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none'
                    }}
                  >
                    {loading ? <LoadingSpinner size="sm" /> : 'Create Account'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <p className="text-muted">
                    Already have an account?{' '}
                    <a href="/login" className="text-primary fw-semibold text-decoration-none">
                      Sign In
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
}