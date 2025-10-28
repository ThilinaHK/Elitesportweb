import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function MemberQR() {
  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState('');
  const [qrData, setQrData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      const data = await response.json();
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const generateQR = async () => {
    if (!selectedMember) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/members/${selectedMember}/qr-access`);
      const data = await response.json();
      setQrData(data);
    } catch (error) {
      console.error('Error generating QR:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Member QR Access - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js"></script>
      </Head>

      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', padding: '20px' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header bg-primary text-white">
                  <h3 className="mb-0">Member Door Access QR</h3>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label className="form-label">Select Member:</label>
                    <select 
                      className="form-select"
                      value={selectedMember}
                      onChange={(e) => setSelectedMember(e.target.value)}
                    >
                      <option value="">Choose member...</option>
                      {members.map(member => (
                        <option key={member._id} value={member._id}>
                          {member.fullName || member.name} - {member.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={generateQR}
                    disabled={!selectedMember || loading}
                  >
                    {loading ? 'Generating...' : 'Generate QR Code'}
                  </button>

                  {qrData && (
                    <div className="mt-4 text-center">
                      <div className={`alert ${qrData.hasAccess ? 'alert-success' : 'alert-danger'}`}>
                        <h5>{qrData.member.name}</h5>
                        <p className="mb-0">
                          {qrData.hasAccess ? '✅ Access Granted' : '❌ Payment Required'}
                        </p>
                      </div>
                      
                      <div id="qrcode" className="mb-3"></div>
                      
                      <div className="card">
                        <div className="card-body">
                          <small className="text-muted">QR Data:</small>
                          <pre style={{ fontSize: '12px', backgroundColor: '#f8f9fa', padding: '10px' }}>
                            {JSON.stringify(JSON.parse(qrData.qrData), null, 2)}
                          </pre>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{
        __html: `
          window.generateQRCode = function(data) {
            const qrDiv = document.getElementById('qrcode');
            qrDiv.innerHTML = '';
            QRCode.toCanvas(qrDiv, data, { width: 256 }, function (error) {
              if (error) console.error(error);
            });
          }
        `
      }} />

      {qrData && (
        <script dangerouslySetInnerHTML={{
          __html: `window.generateQRCode('${qrData.qrData}');`
        }} />
      )}
    </>
  );
}