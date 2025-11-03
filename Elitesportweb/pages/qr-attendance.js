import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'qrcode';

export default function QRAttendance() {
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [qrData, setQrData] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin-login');
      return;
    }
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes');
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const generateQR = async () => {
    if (!selectedClass) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/qr-generate?classId=${selectedClass}`);
      const data = await response.json();
      
      if (response.ok) {
        setQrData(data.qrData);
        const qrUrl = await QRCode.toDataURL(data.qrData, {
          width: 300,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeUrl(qrUrl);
      }
    } catch (error) {
      console.error('Error generating QR:', error);
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '2rem' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
          <h1 style={{ textAlign: 'center', color: '#2c3e50', marginBottom: '2rem' }}>📱 QR Attendance</h1>
          
          <div style={{ marginBottom: '2rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>Select Class:</label>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '2px solid #667eea', borderRadius: '8px', fontSize: '16px' }}
            >
              <option value="">Choose a class...</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} - {cls.day} {cls.time}
                </option>
              ))}
            </select>
          </div>

          <button 
            onClick={generateQR}
            disabled={!selectedClass || loading}
            style={{
              width: '100%',
              padding: '1rem',
              background: selectedClass ? 'linear-gradient(45deg, #28a745, #20c997)' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: selectedClass ? 'pointer' : 'not-allowed',
              marginBottom: '2rem'
            }}
          >
            {loading ? 'Generating...' : 'Generate QR Code'}
          </button>

          {qrCodeUrl && (
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Scan to Mark Attendance</h3>
              <div style={{ background: 'white', padding: '1rem', borderRadius: '12px', display: 'inline-block', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <img src={qrCodeUrl} alt="QR Code" style={{ display: 'block' }} />
              </div>
              <p style={{ marginTop: '1rem', color: '#7f8c8d', fontSize: '14px' }}>
                Static QR Code • Can be used for all classes of this type
              </p>
              <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#6c757d', wordBreak: 'break-all' }}>
                  QR Data: {qrData}
                </p>
              </div>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            onClick={() => router.push('/admin')}
            style={{
              padding: '0.75rem 1.5rem',
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            ← Back to Admin Panel
          </button>
        </div>
      </div>
    </div>
  );
}