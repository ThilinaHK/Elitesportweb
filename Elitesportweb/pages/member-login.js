import { useState } from 'react';
import { useRouter } from 'next/router';

export default function MemberLogin() {
  const [memberId, setMemberId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!memberId.trim()) {
      setError('Please enter your Member ID');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/member-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ memberId }),
      });
      
      if (response.ok) {
        router.push('/member-dashboard');
      } else {
        setError('Invalid Member ID. Please check and try again.');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: 'white', padding: '3rem', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#2c3e50', fontSize: '28px', fontWeight: '700', margin: '0 0 0.5rem 0' }}>Member Login</h1>
          <p style={{ color: '#7f8c8d', margin: 0 }}>Enter your Member ID to access your dashboard</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#2c3e50', fontWeight: '600' }}>
              Member ID
            </label>
            <input
              type="text"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              placeholder="Enter your Member ID"
              style={{
                width: '100%',
                padding: '1rem',
                border: '2px solid #e9ecef',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none',
                transition: 'border-color 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
            />
          </div>

          {error && (
            <div style={{ 
              background: '#fee', 
              color: '#c33', 
              padding: '0.75rem', 
              borderRadius: '8px', 
              marginBottom: '1.5rem',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: loading ? '#ccc' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
          <p style={{ margin: '0 0 0.5rem 0', fontSize: '14px', color: '#6c757d' }}>Demo Member ID:</p>
          <code style={{ background: '#e9ecef', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '14px' }}>
            ESA4954513317
          </code>
        </div>
      </div>
    </div>
  );
}