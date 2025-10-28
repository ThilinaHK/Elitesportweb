import { useState } from 'react'
import Head from 'next/head'
import Toast from '../components/Toast'

export default function ForgotPassword() {
  const [formData, setFormData] = useState({ email: '', userType: 'member' })
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  const [credentials, setCredentials] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        setCredentials(data.credentials)
        setToast({ show: true, message: 'Credentials retrieved successfully!', type: 'success' })
      } else {
        setToast({ show: true, message: data.message, type: 'error' })
      }
    } catch (error) {
      setToast({ show: true, message: 'Failed to retrieve credentials', type: 'error' })
    }
    
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Forgot Password - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm fixed-top">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between py-3">
            <div className="d-flex align-items-center">
              <img src="/img/eliet_logo.jpg" width="50" height="50" alt="Elite Sports Academy" className="rounded-circle me-3" />
              <div>
                <h4 className="mb-0 text-dark fw-bold">Elite Sports</h4>
                <small className="text-muted">Academy</small>
              </div>
            </div>
            <nav className="d-flex align-items-center gap-4">
              <a href="/" className="text-decoration-none text-dark">Home</a>
              <a href="/login" className="text-decoration-none text-dark">Login</a>
            </nav>
          </div>
        </div>
      </header>

      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light" style={{paddingTop: '100px'}}>
        <div className="bg-white p-4 rounded shadow" style={{width: '500px'}}>
          <div className="text-center mb-4">
            <i className="fas fa-key text-primary mb-3" style={{fontSize: '3rem', color: '#f36100 !important'}}></i>
            <h2 className="text-dark">Forgot Password?</h2>
            <p className="text-muted">Enter your email to retrieve your login credentials</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">User Type</label>
              <select 
                className="form-select"
                value={formData.userType}
                onChange={(e) => setFormData({...formData, userType: e.target.value})}
                required
              >
                <option value="member">Member</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label fw-semibold">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter your registered email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn w-100 text-white fw-semibold py-2 mb-3"
              style={{backgroundColor: '#f36100', border: 'none'}}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Retrieving...
                </>
              ) : (
                <>
                  <i className="fas fa-search me-2"></i>
                  Get My Credentials
                </>
              )}
            </button>
          </form>

          {credentials && (
            <div className="alert alert-success">
              <h6 className="fw-bold mb-2">
                <i className="fas fa-check-circle me-2"></i>
                Credentials Found
              </h6>
              {credentials.username && (
                <p className="mb-1"><strong>Username:</strong> {credentials.username}</p>
              )}
              {credentials.email && (
                <p className="mb-1"><strong>Email:</strong> {credentials.email}</p>
              )}
              {credentials.phone && (
                <p className="mb-1"><strong>Phone:</strong> {credentials.phone}</p>
              )}
              <p className="mb-0 text-primary">
                <i className="fas fa-info-circle me-1"></i>
                {credentials.loginMethod}
              </p>
            </div>
          )}

          <div className="text-center">
            <p className="text-muted small mb-2">Remember your password?</p>
            <div className="d-flex gap-2 justify-content-center">
              <a href="/login" className="btn btn-outline-primary btn-sm">Member Login</a>
              <a href="/instructor-login" className="btn btn-outline-primary btn-sm">Instructor Login</a>
              <a href="/admin-login" className="btn btn-outline-primary btn-sm">Admin Login</a>
            </div>
          </div>
        </div>
      </div>

      <Toast 
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ show: false, message: '', type: '' })}
      />
    </>
  )
}