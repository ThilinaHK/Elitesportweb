import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    address: '',
    dateOfBirth: '',
    gender: 'male',
    weight: '',
    height: '',
    emergencyContact: '',
    medicalConditions: '',
    membershipType: 'trial'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.fullName || !formData.email || !formData.phone) {
      setMessage('Please fill in required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          weight: Number(formData.weight) || 0,
          height: Number(formData.height) || 0
        })
      })

      if (response.ok) {
        setMessage('Registration successful!')
        setTimeout(() => router.push('/classes'), 2000)
      } else {
        const error = await response.json()
        setMessage(error.error || 'Registration failed')
      }
    } catch (error) {
      setMessage('Registration failed')
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Register - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      </Head>
      
      <div className="min-vh-100 d-flex align-items-center" style={{
        background: 'linear-gradient(135deg, #f36100 0%, #ff8c42 100%)'
      }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6">
              <div className="card shadow-lg border-0" style={{ borderRadius: '15px' }}>
                <div className="card-body p-4">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark mb-2">Join Elite Sports</h2>
                    <p className="text-muted">Create your member account</p>
                  </div>

                  {message && (
                    <div className={`alert ${message.includes('successful') ? 'alert-success' : 'alert-danger'}`}>
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Full Name *</label>
                        <input
                          type="text"
                          name="fullName"
                          className="form-control"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Phone *</label>
                        <input
                          type="tel"
                          name="phone"
                          className="form-control"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">NIC Number</label>
                        <input
                          type="text"
                          name="nic"
                          className="form-control"
                          value={formData.nic}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Address</label>
                      <textarea
                        name="address"
                        className="form-control"
                        rows="2"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Date of Birth</label>
                        <input
                          type="date"
                          name="dateOfBirth"
                          className="form-control"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Gender</label>
                        <select
                          name="gender"
                          className="form-control"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                        </select>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Membership</label>
                        <select
                          name="membershipType"
                          className="form-control"
                          value={formData.membershipType}
                          onChange={handleChange}
                        >
                          <option value="trial">Trial</option>
                          <option value="monthly">Monthly</option>
                          <option value="yearly">Yearly</option>
                        </select>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Weight (kg)</label>
                        <input
                          type="number"
                          name="weight"
                          className="form-control"
                          value={formData.weight}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Height (cm)</label>
                        <input
                          type="number"
                          name="height"
                          className="form-control"
                          value={formData.height}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Emergency Contact</label>
                      <input
                        type="tel"
                        name="emergencyContact"
                        className="form-control"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Medical Conditions (Optional)</label>
                      <textarea
                        name="medicalConditions"
                        className="form-control"
                        rows="2"
                        value={formData.medicalConditions}
                        onChange={handleChange}
                        placeholder="Any medical conditions we should know about..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="btn btn-lg w-100 fw-semibold"
                      disabled={loading}
                      style={{
                        background: 'linear-gradient(135deg, #f36100 0%, #ff8c42 100%)',
                        border: 'none',
                        color: 'white'
                      }}
                    >
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </form>

                  <div className="text-center mt-4">
                    <p className="text-muted">
                      Already have an account?{' '}
                      <a href="/login" className="text-decoration-none" style={{ color: '#f36100' }}>
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
    </>
  )
}