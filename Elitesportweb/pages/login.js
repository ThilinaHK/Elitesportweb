import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Toast from '../components/Toast';
import Navbar from '../components/Navbar';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: '' })
  const [showRegisterModal, setShowRegisterModal] = useState(false)
  const [registerForm, setRegisterForm] = useState({
    fullName: '', email: '', phone: '', nic: '', address: '', dateOfBirth: '',
    gender: 'male', weight: '', height: '', emergencyContact: '', medicalConditions: '', membershipType: 'trial'
  })
  const [registerLoading, setRegisterLoading] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        setToast({ show: true, message: 'Login successful! Redirecting...', type: 'success' });
        localStorage.setItem('memberId', data.member._id);
        setTimeout(() => router.push('/member-dashboard'), 1000);
      } else {
        setToast({ show: true, message: data.message || 'Invalid credentials', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Login failed. Please try again.', type: 'error' });
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Member Login - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 400; line-height: 1.6; }
          .btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-weight: 600; }
          .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important; }
          .form-control { transition: all 0.3s ease; }
          .form-control:focus { border-color: #f36100; box-shadow: 0 0 0 0.2rem rgba(243,97,0,0.25); }
        `}</style>
      </Head>

      <Navbar />

      {/* Login Section */}
      <section className="position-relative overflow-hidden" style={{minHeight: '100vh', background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(243,97,0,0.8)), url(/img/member-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', display: 'flex', alignItems: 'center', paddingTop: '100px'}}>
        <div className="position-absolute w-100 h-100" style={{background: 'linear-gradient(45deg, rgba(243,97,0,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)'}}></div>
        <div className="container position-relative">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-7">
              <div className="text-center mb-5">
                <div className="mb-4">
                  <span className="badge px-4 py-2" style={{background: 'linear-gradient(45deg, rgba(243,97,0,0.9), rgba(255,140,66,0.9))', backdropFilter: 'blur(15px)', borderRadius: '30px', fontSize: '16px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(243,97,0,0.3)', color: 'white'}}>
                    💪 MEMBER ACCESS
                  </span>
                </div>
                <h1 className="text-white fw-bold mb-3" style={{fontSize: '2.5rem', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>Member Login</h1>
                <p className="text-white-50" style={{fontSize: '1.1rem'}}>Access your fitness dashboard</p>
              </div>
              
              <div className="p-5 rounded-4" style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}}>
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{color: '#2c3e50'}}>Email Address</label>
                    <div className="position-relative">
                      <i className="fas fa-envelope position-absolute" style={{left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#f36100'}}></i>
                      <input
                        type="email"
                        className="form-control ps-5"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        style={{padding: '15px 15px 15px 45px', borderRadius: '12px', border: '2px solid #e9ecef', fontSize: '16px'}}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{color: '#2c3e50'}}>Phone Number</label>
                    <div className="position-relative">
                      <i className="fas fa-phone position-absolute" style={{left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#f36100'}}></i>
                      <input
                        type="tel"
                        className="form-control ps-5"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        style={{padding: '15px 15px 15px 45px', borderRadius: '12px', border: '2px solid #e9ecef', fontSize: '16px'}}
                        required
                      />
                    </div>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn w-100 text-white fw-bold py-3 mb-4"
                    style={{
                      background: 'linear-gradient(45deg, #f36100, #ff8c42)',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      boxShadow: '0 8px 25px rgba(243,97,0,0.3)',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Logging in...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Access Dashboard
                      </>
                    )}
                  </button>
                </form>
                
                <div className="text-center">
                  <div className="mb-3 pb-3" style={{borderBottom: '1px solid #e9ecef'}}>
                    <p className="text-muted mb-2">Don't have an account?</p>
                    <button 
                      type="button"
                      onClick={() => setShowRegisterModal(true)}
                      className="text-decoration-none fw-semibold" 
                      style={{color: '#f36100', background: 'none', border: 'none', cursor: 'pointer'}}
                    >
                      <i className="fas fa-user-plus me-1"></i>
                      Register as New Member
                    </button>
                  </div>
                  <a href="/forgot-password" className="text-muted text-decoration-none small">
                    <i className="fas fa-key me-1"></i>
                    Forgot Password?
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Registration Modal */}
      {showRegisterModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '15px', padding: '30px',
            maxWidth: '600px', width: '90%', maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Register as Member</h3>
              <button onClick={() => setShowRegisterModal(false)} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}>×</button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault()
              setRegisterLoading(true)
              try {
                const response = await fetch('/api/members', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ ...registerForm, weight: Number(registerForm.weight) || 0, height: Number(registerForm.height) || 0 })
                })
                
                if (response.ok) {
                  setToast({ show: true, message: 'Registration successful! You can now login.', type: 'success' })
                  setShowRegisterModal(false)
                  setRegisterForm({ fullName: '', email: '', phone: '', nic: '', address: '', dateOfBirth: '', gender: 'male', weight: '', height: '', emergencyContact: '', medicalConditions: '', membershipType: 'trial' })
                } else {
                  const error = await response.json()
                  setToast({ show: true, message: error.error || 'Registration failed', type: 'error' })
                }
              } catch (error) {
                setToast({ show: true, message: 'Registration failed', type: 'error' })
              }
              setRegisterLoading(false)
            }}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Full Name *</label>
                  <input type="text" value={registerForm.fullName} onChange={(e) => setRegisterForm({...registerForm, fullName: e.target.value})} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div className="col-md-6 mb-3">
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Email *</label>
                  <input type="email" value={registerForm.email} onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Phone *</label>
                  <input type="tel" value={registerForm.phone} onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})} required style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div className="col-md-6 mb-3">
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>NIC Number</label>
                  <input type="text" value={registerForm.nic} onChange={(e) => setRegisterForm({...registerForm, nic: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>
              <div className="mb-3">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Address</label>
                <textarea value={registerForm.address} onChange={(e) => setRegisterForm({...registerForm, address: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }} />
              </div>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Date of Birth</label>
                  <input type="date" value={registerForm.dateOfBirth} onChange={(e) => setRegisterForm({...registerForm, dateOfBirth: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div className="col-md-4 mb-3">
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Gender</label>
                  <select value={registerForm.gender} onChange={(e) => setRegisterForm({...registerForm, gender: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Membership</label>
                  <select value={registerForm.membershipType} onChange={(e) => setRegisterForm({...registerForm, membershipType: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                    <option value="trial">Trial</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Weight (kg)</label>
                  <input type="number" value={registerForm.weight} onChange={(e) => setRegisterForm({...registerForm, weight: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
                <div className="col-md-6 mb-3">
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Height (cm)</label>
                  <input type="number" value={registerForm.height} onChange={(e) => setRegisterForm({...registerForm, height: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
                </div>
              </div>
              <div className="mb-3">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Emergency Contact</label>
                <input type="tel" value={registerForm.emergencyContact} onChange={(e) => setRegisterForm({...registerForm, emergencyContact: e.target.value})} style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }} />
              </div>
              <div className="mb-4">
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>Medical Conditions (Optional)</label>
                <textarea value={registerForm.medicalConditions} onChange={(e) => setRegisterForm({...registerForm, medicalConditions: e.target.value})} placeholder="Any medical conditions we should know about..." style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={registerLoading} style={{ flex: 1, padding: '12px', background: 'linear-gradient(45deg, #f36100, #ff8c42)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  {registerLoading ? 'Creating Account...' : 'Create Account'}
                </button>
                <button type="button" onClick={() => setShowRegisterModal(false)} style={{ flex: 1, padding: '12px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <Toast 
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ show: false, message: '', type: '' })}
      />
    </>
  );
}