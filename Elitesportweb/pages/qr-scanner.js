import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

export default function QRScanner() {
  const [memberId, setMemberId] = useState('');
  const [member, setMember] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
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

  const startCamera = async () => {
    try {
      setScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } // Use back camera on mobile
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (error) {
      setMessage('❌ Camera access denied. Please allow camera permission.');
      setScanning(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setScanning(false);
  };

  const captureAndScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // Convert to data URL and try to extract QR code
    const imageData = canvas.toDataURL('image/png');
    
    // For demo purposes, we'll simulate QR detection
    // In a real app, you'd use a QR code library like jsQR
    setMessage('📷 Image captured. Please manually enter QR data below for now.');
  };

  const markAttendance = async (qrData) => {
    if (!qrData.trim() || !memberId) {
      setMessage('Please ensure QR data is available and you are logged in');
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
        stopCamera();
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
      <div style={{ maxWidth: '400px', margin: '0 auto', paddingTop: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.95)', padding: '1.5rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h1 style={{ color: '#2c3e50', fontSize: '22px', marginBottom: '0.5rem' }}>📱 QR Scanner</h1>
            <p style={{ color: '#7f8c8d', fontSize: '14px', margin: 0 }}>Scan QR code to mark attendance</p>
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
                <div style={{ background: '#e8f5e8', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', textAlign: 'center' }}>
                  <p style={{ margin: 0, color: '#2d5a2d', fontSize: '14px' }}>
                    <strong>Welcome, {member.fullName}!</strong><br />
                    <small>ID: {member.memberId}</small>
                  </p>
                </div>
              )}

              {/* Camera Section */}
              <div style={{ marginBottom: '1rem' }}>
                {!scanning ? (
                  <button 
                    onClick={startCamera}
                    style={{
                      width: '100%',
                      padding: '1rem',
                      background: 'linear-gradient(45deg, #28a745, #20c997)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      marginBottom: '1rem'
                    }}
                  >
                    📷 Start Camera
                  </button>
                ) : (
                  <div style={{ textAlign: 'center' }}>
                    <video 
                      ref={videoRef}
                      style={{ 
                        width: '100%', 
                        maxWidth: '300px', 
                        height: '200px', 
                        borderRadius: '8px',
                        background: '#000',
                        marginBottom: '1rem'
                      }}
                      playsInline
                    />
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button 
                        onClick={captureAndScan}
                        style={{
                          padding: '0.75rem 1rem',
                          background: 'linear-gradient(45deg, #007bff, #0056b3)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        📸 Capture
                      </button>
                      <button 
                        onClick={stopCamera}
                        style={{
                          padding: '0.75rem 1rem',
                          background: '#dc3545',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        ❌ Stop
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual QR Input */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50', fontSize: '14px' }}>
                  Or enter QR data manually:
                </label>
                <input
                  type="text"
                  placeholder="Paste QR code data here..."
                  onChange={(e) => {
                    if (e.target.value.trim()) {
                      markAttendance(e.target.value);
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    border: '2px solid #667eea',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              {loading && (
                <div style={{ textAlign: 'center', padding: '1rem', color: '#007bff' }}>
                  ⏳ Marking attendance...
                </div>
              )}

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
                  <li>Click "Start Camera" to scan QR code</li>
                  <li>Point camera at QR code and capture</li>
                  <li>Or manually paste QR data in the input field</li>
                  <li>Attendance will be marked automatically</li>
                </ol>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button 
                  onClick={() => {
                    localStorage.removeItem('memberId');
                    setMemberId('');
                    setMember(null);
                    stopCamera();
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