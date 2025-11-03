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
  const [activeTab, setActiveTab] = useState('attendance');
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
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
      const [memberRes, attendanceRes, classesRes, notificationsRes, dietRes, exerciseRes] = await Promise.all([
        fetch(`/api/members/${id}`),
        fetch(`/api/attendance/member/${id}?month=${selectedMonth.split('-')[1]}&year=${selectedMonth.split('-')[0]}`),
        fetch(`/api/member-classes/${id}`),
        fetch(`/api/member-notifications/${id}`),
        fetch(`/api/member-diet/${id}`),
        fetch(`/api/member-exercises/${id}`)
      ]);

      if (memberRes.ok) {
        const memberData = await memberRes.json();
        const member = memberData.member || memberData;
        setMember(member);
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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('memberId');
    router.push('/');
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await fetch(`/api/members/${memberId}`, {
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
            { key: 'attendance', label: '📊 Attendance', icon: '📊' },
            { key: 'classes', label: '🏋️ My Classes', icon: '🏋️' },
            { key: 'notifications', label: '🔔 Notifications', icon: '🔔' },
            { key: 'diet', label: '🥗 Diet Plans', icon: '🥗' },
            { key: 'exercise', label: '💪 Exercise Plans', icon: '💪' },
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
                      <span style={{ background: cls.category === 'crossfit' ? '#ff5722' : cls.category === 'karate' ? '#2196f3' : '#9c27b0', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '12px', fontSize: '12px' }}>
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
                        {diet.calories && <span style={{ background: '#28a745', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '12px' }}>{diet.calories} cal</span>}
                        {diet.duration && <span style={{ background: '#007bff', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '12px' }}>{diet.duration}</span>}
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
                        <span style={{ background: '#007bff', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '12px', marginTop: '0.5rem', display: 'inline-block' }}>
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
                  background: isEditing ? 'linear-gradient(45deg, #28a745, #20c997)' : 'linear-gradient(45deg, #007bff, #0056b3)',
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