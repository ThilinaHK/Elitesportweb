import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MemberDashboard() {
  const [member, setMember] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [activeTab, setActiveTab] = useState('attendance');
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const router = useRouter();

  useEffect(() => {
    const storedMemberId = localStorage.getItem('memberId');
    if (!storedMemberId) {
      router.push('/member-login');
      return;
    }
    setMemberId(storedMemberId);
    fetchMemberData(storedMemberId);
  }, []);

  const fetchMemberData = async (id) => {
    try {
      const [memberRes, attendanceRes] = await Promise.all([
        fetch(`/api/members/${id}`),
        fetch(`/api/attendance/member/${id}?month=${selectedMonth.split('-')[1]}&year=${selectedMonth.split('-')[0]}`)
      ]);

      if (memberRes.ok) {
        const memberData = await memberRes.json();
        setMember(memberData);
      }

      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        setAttendance(attendanceData.attendance || []);
        setStatistics(attendanceData.statistics || {});
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('memberId');
    router.push('/');
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #007bff', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Header */}
      <div style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '1.5rem 0', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '50px', height: '50px', background: 'linear-gradient(45deg, #007bff, #0056b3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
              {member?.fullName?.charAt(0) || 'M'}
            </div>
            <div>
              <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '28px', fontWeight: '700' }}>My Dashboard</h1>
              {member && (
                <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span><strong>{member.fullName}</strong></span>
                  <span style={{ background: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>ID: {member.memberId || 'N/A'}</span>
                  <span style={{ background: '#27ae60', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{member.membershipType}</span>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={logout} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'linear-gradient(45deg, #e74c3c, #c0392b)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(231,76,60,0.3)'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', overflowX: 'auto', padding: '0.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
          {[
            { key: 'attendance', label: '📊 My Attendance', icon: '📊' },
            { key: 'profile', label: '👤 Profile', icon: '👤' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '1rem 1.5rem',
                background: activeTab === tab.key ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.1)',
                color: activeTab === tab.key ? '#2c3e50' : 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === tab.key ? '0 4px 12px rgba(0,0,0,0.15)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'attendance' && (
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '32px' }}>📊</div>
                <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>My Attendance</h2>
              </div>
              <input 
                type="month"
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  fetchMemberData(memberId);
                }}
                style={{ padding: '0.75rem', border: '2px solid #667eea', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>

            {/* Statistics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>✅</div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>{statistics.present || 0}</div>
                <div style={{ fontSize: '14px', opacity: '0.9' }}>Present</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #ffc107 0%, #e0a800 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>⏰</div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>{statistics.late || 0}</div>
                <div style={{ fontSize: '14px', opacity: '0.9' }}>Late</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>❌</div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>{statistics.absent || 0}</div>
                <div style={{ fontSize: '14px', opacity: '0.9' }}>Absent</div>
              </div>
              <div style={{ background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '0.5rem' }}>📈</div>
                <div style={{ fontSize: '24px', fontWeight: '700' }}>{statistics.attendancePercentage || 0}%</div>
                <div style={{ fontSize: '14px', opacity: '0.9' }}>Attendance Rate</div>
              </div>
            </div>

            {/* Attendance Records */}
            {attendance.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📊</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No attendance records for this month</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Date</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Class</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((record, index) => (
                      <tr key={record._id} style={{ background: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', fontWeight: '600', color: '#2c3e50' }}>
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ 
                              background: record.classId?.category === 'crossfit' ? '#ff5722' : record.classId?.category === 'karate' ? '#2196f3' : '#9c27b0',
                              color: 'white',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '12px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {record.classId?.name}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
                          <span style={{
                            backgroundColor: 
                              record.status === 'present' ? '#27ae60' :
                              record.status === 'late' ? '#f39c12' : '#e74c3c',
                            color: 'white',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {record.status === 'present' ? '✓ Present' : record.status === 'late' ? '⏰ Late' : '✗ Absent'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', color: '#7f8c8d' }}>
                          {record.notes || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '32px' }}>👤</div>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>My Profile</h2>
            </div>
            
            {member && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div>
                  <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Personal Information</h4>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <div><strong>Name:</strong> {member.fullName}</div>
                    <div><strong>Email:</strong> {member.email}</div>
                    <div><strong>Phone:</strong> {member.phone}</div>
                    <div><strong>NIC:</strong> {member.nic}</div>
                    <div><strong>Address:</strong> {member.address}</div>
                    <div><strong>Gender:</strong> {member.gender}</div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Physical Information</h4>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <div><strong>Weight:</strong> {member.weight} kg</div>
                    <div><strong>Height:</strong> {member.height} cm</div>
                    <div><strong>Date of Birth:</strong> {new Date(member.dateOfBirth).toLocaleDateString()}</div>
                    <div><strong>Emergency Contact:</strong> {member.emergencyContact}</div>
                    <div><strong>Medical Conditions:</strong> {member.medicalConditions || 'None'}</div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Membership Information</h4>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <div><strong>Member ID:</strong> {member.memberId}</div>
                    <div><strong>Membership Type:</strong> {member.membershipType}</div>
                    <div><strong>Status:</strong> <span style={{ color: member.status === 'active' ? '#27ae60' : '#e74c3c' }}>{member.status}</span></div>
                    <div><strong>Join Date:</strong> {new Date(member.joinDate).toLocaleDateString()}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}