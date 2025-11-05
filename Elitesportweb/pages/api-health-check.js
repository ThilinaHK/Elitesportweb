import { useState, useEffect } from 'react';

export default function APIHealthCheck() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);
  const [testMemberId, setTestMemberId] = useState('');

  const apiEndpoints = [
    { name: 'Member Details', path: '/api/members/', method: 'GET', requiresId: true },
    { name: 'Member Attendance', path: '/api/attendance/member/', method: 'GET', requiresId: true, params: '?month=12&year=2024' },
    { name: 'Member Classes', path: '/api/member-classes/', method: 'GET', requiresId: true },
    { name: 'Member Notifications', path: '/api/member-notifications/', method: 'GET', requiresId: true },
    { name: 'Member Diet Plans', path: '/api/member-diet/', method: 'GET', requiresId: true },
    { name: 'Member Exercise Plans', path: '/api/member-exercises/', method: 'GET', requiresId: true },
  ];

  const testAPI = async (endpoint) => {
    try {
      const url = endpoint.requiresId 
        ? `${endpoint.path}${testMemberId}${endpoint.params || ''}`
        : endpoint.path;
      
      const response = await fetch(url);
      const data = await response.json();
      
      return {
        status: response.ok ? 'success' : 'error',
        statusCode: response.status,
        data: data,
        error: response.ok ? null : data.error || 'Unknown error'
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 0,
        data: null,
        error: error.message
      };
    }
  };

  const runAllTests = async () => {
    if (!testMemberId.trim()) {
      alert('Please enter a Member ID to test');
      return;
    }

    setLoading(true);
    const testResults = {};

    for (const endpoint of apiEndpoints) {
      console.log(`Testing ${endpoint.name}...`);
      testResults[endpoint.name] = await testAPI(endpoint);
    }

    setResults(testResults);
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return '#28a745';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', padding: '2rem', borderRadius: '12px', marginBottom: '2rem' }}>
        <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>🔍 Member Dashboard API Health Check</h1>
        <p style={{ margin: '0.5rem 0 0 0', opacity: 0.9 }}>Test all member dashboard API endpoints and view user details</p>
      </div>

      <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '2rem' }}>
        <h3 style={{ marginTop: 0, color: '#2c3e50' }}>Test Configuration</h3>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
          <label style={{ fontWeight: '600', color: '#2c3e50' }}>Member ID:</label>
          <input
            type="text"
            value={testMemberId}
            onChange={(e) => setTestMemberId(e.target.value)}
            placeholder="Enter member ID (e.g., 507f1f77bcf86cd799439011)"
            style={{ 
              flex: 1, 
              padding: '0.75rem', 
              border: '2px solid #e9ecef', 
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />
          <button
            onClick={runAllTests}
            disabled={loading}
            style={{
              padding: '0.75rem 1.5rem',
              background: loading ? '#6c757d' : 'linear-gradient(45deg, #007bff, #0056b3)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {loading ? '🔄 Testing...' : '🚀 Run Tests'}
          </button>
        </div>
        <p style={{ fontSize: '14px', color: '#7f8c8d', margin: 0 }}>
          💡 Get a member ID from your admin panel or database. You can also create a test member first.
        </p>
      </div>

      {Object.keys(results).length > 0 && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {apiEndpoints.map((endpoint) => {
            const result = results[endpoint.name];
            if (!result) return null;

            return (
              <div key={endpoint.name} style={{ 
                background: 'white', 
                padding: '1.5rem', 
                borderRadius: '12px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${getStatusColor(result.status)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h4 style={{ margin: 0, color: '#2c3e50' }}>{endpoint.name}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      background: getStatusColor(result.status),
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {result.status === 'success' ? '✅ SUCCESS' : '❌ ERROR'}
                    </span>
                    <span style={{ fontSize: '14px', color: '#7f8c8d' }}>
                      {result.statusCode}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '14px', color: '#7f8c8d', marginBottom: '1rem' }}>
                  <strong>Endpoint:</strong> {endpoint.method} {endpoint.path}{endpoint.requiresId ? '[id]' : ''}{endpoint.params || ''}
                </div>

                {result.error && (
                  <div style={{ background: '#f8d7da', color: '#721c24', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <strong>Error:</strong> {result.error}
                  </div>
                )}

                {result.status === 'success' && result.data && (
                  <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px', fontSize: '14px' }}>
                    <strong>Response Data:</strong>
                    <div style={{ marginTop: '0.5rem' }}>
                      {endpoint.name === 'Member Details' && result.data.member && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                          <div><strong>Name:</strong> {result.data.member.fullName}</div>
                          <div><strong>Email:</strong> {result.data.member.email}</div>
                          <div><strong>Phone:</strong> {result.data.member.phone}</div>
                          <div><strong>Member ID:</strong> {result.data.member.memberId}</div>
                          <div><strong>Status:</strong> {result.data.member.status}</div>
                          <div><strong>Membership:</strong> {result.data.member.membershipType}</div>
                        </div>
                      )}
                      
                      {endpoint.name === 'Member Attendance' && result.data.statistics && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem' }}>
                          <div><strong>Total Classes:</strong> {result.data.statistics.totalClasses}</div>
                          <div><strong>Present:</strong> {result.data.statistics.present}</div>
                          <div><strong>Absent:</strong> {result.data.statistics.absent}</div>
                          <div><strong>Late:</strong> {result.data.statistics.late}</div>
                          <div><strong>Attendance Rate:</strong> {result.data.statistics.attendancePercentage}%</div>
                        </div>
                      )}
                      
                      {endpoint.name === 'Member Classes' && result.data.classes && (
                        <div>
                          <strong>Classes Count:</strong> {result.data.classes.length}
                          {result.data.classes.length > 0 && (
                            <div style={{ marginTop: '0.5rem' }}>
                              {result.data.classes.map((cls, index) => (
                                <div key={index} style={{ marginBottom: '0.25rem' }}>
                                  • {cls.name} ({cls.category}) - {cls.instructor}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {endpoint.name === 'Member Notifications' && result.data.notifications && (
                        <div><strong>Notifications Count:</strong> {result.data.notifications.length}</div>
                      )}
                      
                      {endpoint.name === 'Member Diet Plans' && result.data.diets && (
                        <div><strong>Diet Plans Count:</strong> {result.data.diets.length}</div>
                      )}
                      
                      {endpoint.name === 'Member Exercise Plans' && result.data.exercises && (
                        <div><strong>Exercise Plans Count:</strong> {result.data.exercises.length}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {Object.keys(results).length === 0 && !loading && (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
        }}>
          <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🔍</div>
          <h3 style={{ color: '#2c3e50', marginBottom: '0.5rem' }}>Ready to Test APIs</h3>
          <p style={{ color: '#7f8c8d', margin: 0 }}>Enter a member ID and click "Run Tests" to check all endpoints</p>
        </div>
      )}
    </div>
  );
}