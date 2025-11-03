import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MobileAttendance() {
  const [memberId, setMemberId] = useState('');
  const [qrData, setQrData] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [member, setMember] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const storedMemberId = localStorage.getItem('memberId');
    if (storedMemberId) {
      setMemberId(storedMemberId);
      fetchMember(storedMemberId);
    }
  }, []);

  const fetchMember = async (id) => {
    try {
      const response = await fetch(`/api/members/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMember(data);
      }
    } catch (error) {
      console.error('Error fetching member:', error);
    }
  };

  const handleQRScan = async () => {
    if (!qrData.trim() || !memberId) {
      setMessage('Please enter QR code data and ensure you are logged in');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/attendance/qr-scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrData: qrData.trim(), memberId })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ Success! Attendance marked as ${data.status.toUpperCase()} for ${data.className} at ${data.time}`);
        setQrData('');
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Network error. Please try again.');
    }
    setLoading(false);
  };

  const handleLogin = () => {
    const id = prompt('Enter your Member ID:');
    if (id) {
      localStorage.setItem('memberId', id);
      setMemberId(id);
      fetchMember(id);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '1rem' }}>
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '2rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: '#2c3e50', fontSize: '24px', marginBottom: '0.5rem' }}>📱 Mobile Attendance</h1>
            <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>Scan QR code to mark your attendance</p>
          </div>

          {!memberId ? (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>Please login first</p>
              <button 
                onClick={handleLogin}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: 'linear-gradient(45deg, #007bff, #0056b3)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Login with Member ID
              </button>
            </div>
          ) : (
            <>
              {member && (
                <div style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
                  <p style={{ margin: 0, color: '#2d5a2d' }}>
                    <strong>Welcome, {member.fullName}!</strong><br />
                    <small>ID: {member.memberId}</small>
                  </p>
                </div>
              )}

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>
                  QR Code Data:
                </label>
                <textarea
                  value={qrData}
                  onChange={(e) => setQrData(e.target.value)}
                  placeholder="Paste QR code data here or scan with camera..."
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #667eea',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minHeight: '80px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <button 
                onClick={handleQRScan}
                disabled={loading || !qrData.trim()}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: qrData.trim() ? 'linear-gradient(45deg, #28a745, #20c997)' : '#ccc',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: qrData.trim() ? 'pointer' : 'not-allowed',
                  marginBottom: '1rem'
                }}
              >
                {loading ? '⏳ Marking Attendance...' : '✓ Mark Attendance'}
              </button>

              {message && (
                <div style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: message.includes('Success') ? '#d4edda' : '#f8d7da',
                  color: message.includes('Success') ? '#155724' : '#721c24',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  marginBottom: '1rem'
                }}>
                  {message}
                </div>
              )}

              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', fontSize: '12px', color: '#6c757d' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontWeight: '600' }}>How to use:</p>
                <ol style={{ margin: 0, paddingLeft: '1rem' }}>
                  <li>Get QR code from instructor/admin</li>
                  <li>Scan or paste the QR data above</li>
                  <li>Click "Mark Attendance"</li>
                  <li>Attendance will be marked automatically</li>
                </ol>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                <button 
                  onClick={() => {
                    localStorage.removeItem('memberId');
                    setMemberId('');
                    setMember(null);
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'transparent',
                    color: '#dc3545',
                    border: '1px solid #dc3545',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}