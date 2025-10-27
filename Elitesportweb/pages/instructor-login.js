import { useState } from 'react';
import { useRouter } from 'next/router';

export default function InstructorLogin() {
  const [formData, setFormData] = useState({ email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch('/api/auth/instructor-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('instructorId', data.instructor._id);
        router.push('/instructor-dashboard');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Login failed');
    }
    setLoading(false);
  };

  return (
    <>
      {/* Header */}
      <header style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, boxShadow: '0 2px 20px rgba(0,0,0,0.1)'}}>
        <div style={{maxWidth: '1200px', margin: '0 auto', padding: '0 1rem'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <img src="/img/eliet_logo.jpg" width="60" height="60" alt="Elite Sports Academy" style={{borderRadius: '50%', marginRight: '15px'}} />
              <div>
                <h3 style={{margin: 0, color: '#333', fontSize: '24px', fontWeight: '700'}}>Elite Sports</h3>
                <p style={{margin: 0, color: '#666', fontSize: '14px'}}>Academy</p>
              </div>
            </div>
            <nav style={{display: 'flex', alignItems: 'center', gap: '30px'}}>
              <a href="/" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Home</a>
              <a href="/classes" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Classes</a>
              <a href="/posts" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Videos</a>
              <a href="/login" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Member Login</a>
              <a href="/instructor-login" style={{color: '#f36100', textDecoration: 'none', fontWeight: '600', fontSize: '16px'}}>Instructor</a>
              <a href="/admin-login" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Admin</a>
            </nav>
          </div>
        </div>
      </header>

      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', paddingTop: '90px' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '400px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Instructor Login</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="tel"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid #ddd', borderRadius: '4px' }}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          </form>
        </div>
      </div>
    </>
  );
}