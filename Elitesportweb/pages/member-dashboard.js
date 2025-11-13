import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { showToast } from '../components/Toast';

export default function MemberDashboard() {
  const [member, setMember] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [classes, setClasses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [exercisePlans, setExercisePlans] = useState([]);
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [activeTab, setActiveTab] = useState('attendance');
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [progress, setProgress] = useState([]);
  const [progressForm, setProgressForm] = useState({
    weight: '',
    bodyFat: '',
    goals: '',
    achievements: '',
    notes: ''
  });
  const router = useRouter();

  useEffect(() => {
    fetchMemberData();
  }, []);

  const fetchMemberData = async () => {
    try {
      const [memberRes, attendanceRes, classesRes, notificationsRes, dietRes, exerciseRes, videosRes, articlesRes, progressRes] = await Promise.all([
        fetch(`/api/member-profile`),
        fetch(`/api/member-attendance?month=${selectedMonth.split('-')[1]}&year=${selectedMonth.split('-')[0]}`),
        fetch(`/api/member-classes`),
        fetch(`/api/member-notifications`),
        fetch(`/api/member-diet`),
        fetch(`/api/member-exercises`),
        fetch(`/api/videos`),
        fetch(`/api/articles`),
        fetch(`/api/member-progress`)
      ]);

      if (memberRes.ok) {
        const memberData = await memberRes.json();
        const member = memberData.member || memberData;
        setMember(member);
        setMemberId(member._id);
        setEditForm({
          fullName: member.fullName || '',
          phone: member.phone || '',
          nic: member.nic || '',
          address: member.address || '',
          weight: member.weight || '',
          height: member.height || '',
          emergencyContact: member.emergencyContact || '',
          medicalConditions: member.medicalConditions || ''
        });
      } else {
        router.push('/member-login');
        return;
      }

      if (attendanceRes.ok) {
        const attendanceData = await attendanceRes.json();
        setAttendance(attendanceData.attendance || []);
        setStatistics(attendanceData.statistics || {});
      }

      if (classesRes.ok) {
        const classesData = await classesRes.json();
        setClasses(classesData.classes || []);
      }

      if (notificationsRes.ok) {
        const notificationsData = await notificationsRes.json();
        setNotifications(notificationsData.notifications || []);
      }

      if (dietRes.ok) {
        const dietData = await dietRes.json();
        setDietPlans(dietData.diets || []);
      }

      if (exerciseRes.ok) {
        const exerciseData = await exerciseRes.json();
        setExercisePlans(exerciseData.exercises || []);
      }

      if (videosRes.ok) {
        const videosData = await videosRes.json();
        setVideos(videosData.videos || []);
      }

      if (articlesRes.ok) {
        const articlesData = await articlesRes.json();
        setArticles(articlesData.articles || []);
      }

      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const logout = async () => {
    await fetch('/api/member-logout', { method: 'POST' });
    router.push('/');
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`/api/member-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (response.ok) {
        const updatedData = await response.json();
        setMember(updatedData.member);
        setIsEditing(false);
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast('Failed to update profile', 'error');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Error updating profile', 'error');
    }
  };

  const handleProgressSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/member-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progressForm)
      });
      if (response.ok) {
        fetchMemberData();
        setProgressForm({ weight: '', bodyFat: '', goals: '', achievements: '', notes: '' });
        showToast('Progress updated successfully!', 'success');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      showToast('Error saving progress', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' }}>
        <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid #f3f3f3', borderTop: '4px solid #11998e', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }}></div>
          <p style={{ margin: 0, color: '#666', fontSize: '16px' }}>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)' }}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', padding: '20px 0', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', borderBottom: '3px solid #f36100' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '50px', height: '50px', background: 'linear-gradient(45deg, #11998e, #0d7377)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
              {member?.fullName?.charAt(0) || 'M'}
            </div>
            <div>
              <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '28px', fontWeight: '700' }}>My Dashboard</h1>
              {member && (
                <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span><strong>{member.fullName}</strong></span>
                  <span style={{ background: '#ff6b6b', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>ID: {member.memberId || 'N/A'}</span>
                  <span style={{ background: '#11998e', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{member.membershipType}</span>
                </div>
              )}
            </div>
          </div>
          <button 
            onClick={logout} 
            style={{ 
              padding: '0.75rem 1.5rem', 
              background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)', 
              color: 'white', 
              border: 'none', 
              borderRadius: '8px', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              boxShadow: '0 2px 8px rgba(255,107,107,0.3)'
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        {/* Navigation Tabs */}
        <div style={{ background: 'linear-gradient(135deg, #6c757d 0%, #495057 100%)', borderRadius: '12px', padding: '20px', marginBottom: '30px', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
          {[
            { key: 'attendance', label: '📊 Attendance', icon: '📊' },
            { key: 'classes', label: '🏋️ My Classes', icon: '🏋️' },
            { key: 'notifications', label: '🔔 Notifications', icon: '🔔' },
            { key: 'diet', label: '🥗 Diet Plans', icon: '🥗' },
            { key: 'exercise', label: '💪 Exercise Plans', icon: '💪' },
            { key: 'videos', label: '🎥 Videos', icon: '🎥' },
            { key: 'articles', label: '📰 Articles', icon: '📰' },
            { key: 'progress', label: '📈 Progress', icon: '📈' },
            { key: 'profile', label: '👤 Profile', icon: '👤' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: activeTab === tab.key ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.15)',
                color: activeTab === tab.key ? '#2c3e50' : '#ffffff',
                border: activeTab === tab.key ? '2px solid #f36100' : '2px solid rgba(255,255,255,0.3)',
                padding: '12px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                whiteSpace: 'nowrap',
                boxShadow: activeTab === tab.key ? '0 4px 12px rgba(0,0,0,0.15)' : '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)',
                textShadow: activeTab === tab.key ? 'none' : '1px 1px 2px rgba(0,0,0,0.8)'
              }}
            >
              {tab.label}
            </button>
          ))}
          </div>
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
                  fetchMemberData();
                }}
                style={{ padding: '0.75rem', border: '2px solid #11998e', borderRadius: '8px', fontSize: '14px' }}
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
              <div style={{ background: 'linear-gradient(135deg, #11998e 0%, #0d7377 100%)', padding: '1.5rem', borderRadius: '12px', color: 'white', textAlign: 'center' }}>
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
                    <tr style={{ background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', color: 'white' }}>
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
                              background: record.classId?.category === 'crossfit' ? '#ff6b6b' : record.classId?.category === 'karate' ? '#4ecdc4' : '#a8e6cf',
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

        {activeTab === 'classes' && (
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '32px' }}>🏋️</div>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>My Classes</h2>
            </div>
            
            {classes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🏋️</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No classes assigned yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {classes.map(cls => (
                  <div key={cls._id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0, color: '#2c3e50' }}>{cls.name}</h3>
                      <span style={{ background: cls.category === 'crossfit' ? '#ff6b6b' : cls.category === 'karate' ? '#4ecdc4' : cls.category === 'zumba' ? '#a8e6cf' : '#11998e', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '12px' }}>
                        {cls.category}
                      </span>
                    </div>
                    <p style={{ color: '#7f8c8d', marginBottom: '1rem' }}>{cls.description}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.5rem', fontSize: '14px' }}>
                      <div><strong>Instructor:</strong> {cls.instructor}</div>
                      <div><strong>Schedule:</strong> {cls.schedule}</div>
                      <div><strong>Duration:</strong> {cls.duration} min</div>
                      <div><strong>Capacity:</strong> {cls.capacity}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '32px' }}>🔔</div>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>Notifications</h2>
            </div>
            
            {notifications.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🔔</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No notifications</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {notifications.map(notification => (
                  <div key={notification._id} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: `4px solid ${notification.type === 'info' ? '#007bff' : notification.type === 'warning' ? '#ffc107' : '#dc3545'}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, color: '#2c3e50' }}>{notification.title}</h4>
                      <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{new Date(notification.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ margin: 0, color: '#7f8c8d' }}>{notification.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'diet' && (
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '32px' }}>🥗</div>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>Diet Plans</h2>
            </div>
            
            {dietPlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🥗</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No diet plans assigned</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '2rem' }}>
                {dietPlans.map(diet => (
                  <div key={diet._id} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, color: '#2c3e50', marginBottom: '0.5rem' }}>{diet.planName}</h3>
                      <p style={{ color: '#7f8c8d', margin: 0 }}>{diet.description}</p>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '14px' }}>
                        {diet.calories && <span style={{ background: '#11998e', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '12px' }}>{diet.calories} cal</span>}
                        {diet.duration && <span style={{ background: '#4ecdc4', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '12px' }}>{diet.duration}</span>}
                      </div>
                    </div>
                    
                    {diet.meals && diet.meals.length > 0 && (
                      <div>
                        <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Meals:</h4>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                          {diet.meals.map((meal, index) => (
                            <div key={index} style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <strong style={{ color: '#2c3e50' }}>{meal.name}</strong>
                                {meal.time && <span style={{ fontSize: '12px', color: '#7f8c8d' }}>{meal.time}</span>}
                              </div>
                              <div style={{ fontSize: '14px', color: '#7f8c8d' }}>
                                {meal.foods && meal.foods.map((food, i) => (
                                  <span key={i} style={{ marginRight: '0.5rem' }}>• {food}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {diet.notes && (
                      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#fff3cd', borderRadius: '8px', borderLeft: '4px solid #ffc107' }}>
                        <strong style={{ color: '#856404' }}>Notes:</strong>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#856404' }}>{diet.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'exercise' && (
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '32px' }}>💪</div>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>Exercise Plans</h2>
            </div>
            
            {exercisePlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>💪</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No exercise plans assigned</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '2rem' }}>
                {exercisePlans.map(exercise => (
                  <div key={exercise._id} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{ margin: 0, color: '#2c3e50', marginBottom: '0.5rem' }}>{exercise.planName}</h3>
                      <p style={{ color: '#7f8c8d', margin: 0 }}>{exercise.description}</p>
                      {exercise.duration && (
                        <span style={{ background: '#11998e', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '12px', marginTop: '0.5rem', display: 'inline-block' }}>
                          {exercise.duration}
                        </span>
                      )}
                    </div>
                    
                    {exercise.exercises && exercise.exercises.length > 0 && (
                      <div>
                        <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Exercises:</h4>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                          {exercise.exercises.map((ex, index) => (
                            <div key={index} style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '8px' }}>
                              <h5 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{ex.name}</h5>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem', fontSize: '14px', marginBottom: '0.5rem' }}>
                                <div><strong>Sets:</strong> {ex.sets}</div>
                                <div><strong>Reps:</strong> {ex.reps}</div>
                                {ex.weight && <div><strong>Weight:</strong> {ex.weight}</div>}
                                {ex.duration && <div><strong>Duration:</strong> {ex.duration}</div>}
                              </div>
                              {ex.instructions && (
                                <p style={{ margin: 0, fontSize: '14px', color: '#7f8c8d' }}>{ex.instructions}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {exercise.notes && (
                      <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#d1ecf1', borderRadius: '8px', borderLeft: '4px solid #17a2b8' }}>
                        <strong style={{ color: '#0c5460' }}>Notes:</strong>
                        <p style={{ margin: '0.5rem 0 0 0', color: '#0c5460' }}>{exercise.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'videos' && (
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '32px' }}>🎥</div>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>Training Videos</h2>
            </div>
            
            {videos.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🎥</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No videos available</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {videos.map(video => (
                  <div key={video._id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    {video.thumbnail && (
                      <img src={video.thumbnail} alt={video.title} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                    )}
                    <div style={{ padding: '1.5rem' }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#2c3e50' }}>{video.title}</h4>
                      <p style={{ color: '#7f8c8d', fontSize: '14px', marginBottom: '1rem' }}>{video.description}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ background: '#11998e', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '12px' }}>
                          {video.category}
                        </span>
                        <span style={{ fontSize: '12px', color: '#7f8c8d' }}>
                          {new Date(video.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {video.videoUrl && (
                        <a href={video.videoUrl} target="_blank" rel="noopener noreferrer" style={{
                          display: 'inline-block',
                          background: 'linear-gradient(45deg, #11998e, #4ecdc4)',
                          color: 'white',
                          padding: '0.75rem 1.5rem',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '14px',
                          fontWeight: '600'
                        }}>
                          ▶️ Watch Video
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'articles' && (
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '32px' }}>📰</div>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>Articles & Tips</h2>
            </div>
            
            {articles.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📰</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No articles available</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '2rem' }}>
                {articles.map(article => (
                  <div key={article._id} style={{ background: 'white', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ margin: 0, color: '#2c3e50' }}>{article.title}</h3>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <span style={{ background: '#4ecdc4', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '12px' }}>
                          {article.category}
                        </span>
                        <span style={{ fontSize: '12px', color: '#7f8c8d' }}>
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p style={{ color: '#7f8c8d', lineHeight: '1.6', marginBottom: '1rem' }}>{article.content}</p>
                    {article.author && (
                      <div style={{ fontSize: '14px', color: '#11998e', fontWeight: '600' }}>
                        By: {article.author}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'progress' && (
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '32px' }}>📈</div>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>My Progress</h2>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Update Progress</h3>
                <form onSubmit={handleProgressSubmit} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>Weight (kg)</label>
                      <input 
                        type="number" 
                        value={progressForm.weight}
                        onChange={(e) => setProgressForm({...progressForm, weight: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>Body Fat (%)</label>
                      <input 
                        type="number" 
                        value={progressForm.bodyFat}
                        onChange={(e) => setProgressForm({...progressForm, bodyFat: e.target.value})}
                        style={{ width: '100%', padding: '0.75rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>Goals</label>
                    <textarea 
                      value={progressForm.goals}
                      onChange={(e) => setProgressForm({...progressForm, goals: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px', minHeight: '80px' }}
                      placeholder="What are your fitness goals?"
                    />
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#2c3e50' }}>Achievements</label>
                    <textarea 
                      value={progressForm.achievements}
                      onChange={(e) => setProgressForm({...progressForm, achievements: e.target.value})}
                      style={{ width: '100%', padding: '0.75rem', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px', minHeight: '80px' }}
                      placeholder="What have you achieved recently?"
                    />
                  </div>
                  
                  <button type="submit" style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'linear-gradient(45deg, #11998e, #38ef7d)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600'
                  }}>
                    💾 Save Progress
                  </button>
                </form>
              </div>
              
              <div>
                <h3 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Progress History</h3>
                <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {progress.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: '#7f8c8d' }}>
                      <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📈</div>
                      <p>No progress records yet</p>
                    </div>
                  ) : (
                    progress.map((prog) => (
                      <div key={prog._id} style={{ background: 'white', padding: '1.5rem', marginBottom: '1rem', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                          <div style={{ fontSize: '14px', color: '#7f8c8d', fontWeight: '600' }}>
                            {new Date(prog.date).toLocaleDateString()}
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {prog.weight && <span style={{ background: '#11998e', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '12px' }}>{prog.weight} kg</span>}
                            {prog.bodyFat && <span style={{ background: '#4ecdc4', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '12px' }}>{prog.bodyFat}%</span>}
                          </div>
                        </div>
                        {prog.goals && (
                          <div style={{ marginBottom: '0.5rem' }}>
                            <strong style={{ color: '#2c3e50' }}>Goals:</strong>
                            <p style={{ margin: '0.25rem 0 0 0', color: '#7f8c8d', fontSize: '14px' }}>{prog.goals}</p>
                          </div>
                        )}
                        {prog.achievements && (
                          <div>
                            <strong style={{ color: '#2c3e50' }}>Achievements:</strong>
                            <p style={{ margin: '0.25rem 0 0 0', color: '#7f8c8d', fontSize: '14px' }}>{prog.achievements}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '32px' }}>👤</div>
                <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>My Profile</h2>
              </div>
              <button
                onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: isEditing ? 'linear-gradient(45deg, #11998e, #38ef7d)' : 'linear-gradient(45deg, #4ecdc4, #11998e)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                {isEditing ? '💾 Save Changes' : '✏️ Edit Profile'}
              </button>
            </div>
            
            {member && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                <div>
                  <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Personal Information</h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong>Name:</strong>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.fullName}
                          onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : member.fullName}
                    </div>
                    <div><strong>Email:</strong> {member.email} <span style={{ fontSize: '12px', color: '#7f8c8d' }}>(cannot be changed)</span></div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong>Phone:</strong>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : member.phone}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong>NIC:</strong>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.nic}
                          onChange={(e) => setEditForm({...editForm, nic: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : member.nic}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong>Address:</strong>
                      {isEditing ? (
                        <textarea
                          value={editForm.address}
                          onChange={(e) => setEditForm({...editForm, address: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
                        />
                      ) : member.address}
                    </div>
                    <div><strong>Gender:</strong> {member.gender}</div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Physical Information</h4>
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong>Weight (kg):</strong>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.weight}
                          onChange={(e) => setEditForm({...editForm, weight: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : `${member.weight} kg`}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong>Height (cm):</strong>
                      {isEditing ? (
                        <input
                          type="number"
                          value={editForm.height}
                          onChange={(e) => setEditForm({...editForm, height: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : `${member.height} cm`}
                    </div>
                    <div><strong>Date of Birth:</strong> {member.dateOfBirth ? new Date(member.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong>Emergency Contact:</strong>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.emergencyContact}
                          onChange={(e) => setEditForm({...editForm, emergencyContact: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      ) : member.emergencyContact}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <strong>Medical Conditions:</strong>
                      {isEditing ? (
                        <textarea
                          value={editForm.medicalConditions}
                          onChange={(e) => setEditForm({...editForm, medicalConditions: e.target.value})}
                          style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', minHeight: '60px' }}
                        />
                      ) : (member.medicalConditions || 'None')}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 style={{ color: '#2c3e50', marginBottom: '1rem' }}>Membership Information</h4>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <div><strong>Member ID:</strong> {member.memberId}</div>
                    <div><strong>Membership Type:</strong> {member.membershipType}</div>
                    <div><strong>Status:</strong> <span style={{ color: member.status === 'active' ? '#27ae60' : '#e74c3c' }}>{member.status}</span></div>
                    <div><strong>Join Date:</strong> {member.joinDate ? new Date(member.joinDate).toLocaleDateString() : 'N/A'}</div>
                  </div>
                </div>
              </div>
            )}
            
            {isEditing && (
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    marginLeft: '1rem'
                  }}
                >
                  ❌ Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}