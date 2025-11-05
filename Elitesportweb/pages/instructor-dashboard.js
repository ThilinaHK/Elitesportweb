import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { showToast } from '../components/Toast';

export default function InstructorDashboard() {
  const [instructor, setInstructor] = useState(null);
  const [instructorId, setInstructorId] = useState(null);
  const [classes, setClasses] = useState([]);
  const [members, setMembers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [dietPlans, setDietPlans] = useState([]);
  const [exercisePlans, setExercisePlans] = useState([]);
  const [salaryHistory, setSalaryHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('classes');
  const [loading, setLoading] = useState(true);
  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    category: 'general'
  });
  const [showPostForm, setShowPostForm] = useState(false);
  const [dietForm, setDietForm] = useState({
    memberId: '',
    title: '',
    description: '',
    meals: [{ name: '', time: '', foods: [''], calories: '', notes: '' }],
    totalCalories: '',
    duration: '',
    goals: [''],
    restrictions: ['']
  });
  const [exerciseForm, setExerciseForm] = useState({
    memberId: '',
    title: '',
    description: '',
    exercises: [{ name: '', sets: '', reps: '', weight: '', restTime: '', notes: '' }],
    category: 'general',
    difficulty: 'beginner',
    duration: '',
    frequency: '',
    goals: ['']
  });
  const [showDietForm, setShowDietForm] = useState(false);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const router = useRouter();

  useEffect(() => {
    const storedInstructorId = localStorage.getItem('instructorId');
    if (!storedInstructorId) {
      router.push('/instructor-login');
      return;
    }
    setInstructorId(storedInstructorId);
    fetchInstructorData(storedInstructorId);
  }, []);

  const fetchInstructorData = async (id) => {
    try {
      const [instructorRes, classesRes, membersRes, postsRes, dietRes, exerciseRes, salaryRes] = await Promise.all([
        fetch(`/api/instructors/${id}`),
        fetch(`/api/instructor-classes/${id}`),
        fetch(`/api/instructor-members/${id}`),
        fetch(`/api/instructor-posts/${id}`),
        fetch(`/api/instructor-diet-plans/${id}`),
        fetch(`/api/instructor-exercise-plans/${id}`),
        fetch(`/api/instructor-salary/${id}`)
      ]);

      if (instructorRes.ok) {
        const instructorData = await instructorRes.json();
        setInstructor(instructorData);
      }

      const classesData = await classesRes.json();
      const membersData = await membersRes.json();
      const postsData = await postsRes.json();
      const dietData = await dietRes.json();
      const exerciseData = await exerciseRes.json();
      const salaryData = await salaryRes.json();

      setClasses(classesData.classes || []);
      setMembers(membersData.members || []);
      setPosts(postsData.posts || []);
      setDietPlans(dietData.dietPlans || []);
      setExercisePlans(exerciseData.exercisePlans || []);
      setSalaryHistory(salaryData.salaryHistory || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!instructorId) {
      showToast('Instructor ID not found. Please login again.', 'error');
      return;
    }
    
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...postForm,
          instructorId: instructorId,
          instructorName: 'Instructor',
          type: 'normal'
        })
      });
      
      if (response.ok) {
        fetchInstructorData(instructorId);
        setShowPostForm(false);
        setPostForm({ title: '', description: '', youtubeUrl: '', category: 'general' });
        showToast('Post created successfully!', 'success');
      } else {
        const errorData = await response.json();
        showToast('Failed to create post: ' + (errorData.error || 'Unknown error'), 'error');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      showToast('Failed to create post: ' + error.message, 'error');
    }
  };

  const handleDietSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/instructor-diet-plans/${instructorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dietForm)
      });
      
      if (response.ok) {
        fetchInstructorData(instructorId);
        setShowDietForm(false);
        setDietForm({
          memberId: '',
          title: '',
          description: '',
          meals: [{ name: '', time: '', foods: [''], calories: '', notes: '' }],
          totalCalories: '',
          duration: '',
          goals: [''],
          restrictions: ['']
        });
        showToast('Diet plan created successfully!', 'success');
      } else {
        showToast('Failed to create diet plan', 'error');
      }
    } catch (error) {
      console.error('Error creating diet plan:', error);
      showToast('Failed to create diet plan', 'error');
    }
  };

  const handleExerciseSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/instructor-exercise-plans/${instructorId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exerciseForm)
      });
      
      if (response.ok) {
        fetchInstructorData(instructorId);
        setShowExerciseForm(false);
        setExerciseForm({
          memberId: '',
          title: '',
          description: '',
          exercises: [{ name: '', sets: '', reps: '', weight: '', restTime: '', notes: '' }],
          category: 'general',
          difficulty: 'beginner',
          duration: '',
          frequency: '',
          goals: ['']
        });
        showToast('Exercise plan created successfully!', 'success');
      } else {
        showToast('Failed to create exercise plan', 'error');
      }
    } catch (error) {
      console.error('Error creating exercise plan:', error);
      showToast('Failed to create exercise plan', 'error');
    }
  };

  const logout = () => {
    localStorage.removeItem('instructorId');
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
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)' }}>
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .tab-button {
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .tab-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,123,255,0.3);
        }
        .card {
          transition: all 0.3s ease;
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }
        .btn-primary {
          background: linear-gradient(45deg, #007bff, #0056b3);
          transition: all 0.3s ease;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,123,255,0.4);
        }
      `}</style>
      
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', padding: '20px 0', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', borderBottom: '3px solid #f36100' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '50px', height: '50px', background: 'linear-gradient(45deg, #007bff, #0056b3)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', fontWeight: 'bold' }}>
              {instructor?.name?.charAt(0) || 'I'}
            </div>
            <div>
              <h1 style={{ margin: 0, color: '#2c3e50', fontSize: '28px', fontWeight: '700' }}>Instructor Dashboard</h1>
              {instructor && (
                <div style={{ fontSize: '14px', color: '#7f8c8d', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span><strong>{instructor.name}</strong></span>
                  <span style={{ background: '#e74c3c', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>ID: {instructor.instructorId || 'N/A'}</span>
                  <span style={{ background: '#27ae60', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>{instructor.specialization}</span>
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
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(231,76,60,0.3)'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(231,76,60,0.4)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(231,76,60,0.3)';
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
            { key: 'classes', label: '📚 My Classes', icon: '📚' },
            { key: 'members', label: '👥 Students', icon: '👥' },
            { key: 'attendance', label: '📋 Attendance', icon: '📋' },
            { key: 'diet-plans', label: '🥗 Diet Plans', icon: '🥗' },
            { key: 'exercise-plans', label: '💪 Exercise Plans', icon: '💪' },
            { key: 'salary', label: '💰 Salary', icon: '💰' },
            { key: 'posts', label: '📝 Posts', icon: '📝' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="tab-button"
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

        {activeTab === 'classes' && (
          <div className="card" style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '32px' }}>📚</div>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>My Classes</h2>
            </div>
            {classes.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📅</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No classes assigned yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {classes.map(cls => (
                  <div key={cls._id} className="card" style={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                    padding: '1.5rem', 
                    borderRadius: '12px', 
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '20px', fontWeight: '700', position: 'relative', zIndex: 1 }}>{cls.name}</h3>
                    <div style={{ display: 'grid', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '16px' }}>📅</span>
                        <span><strong>Day:</strong> {cls.day}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '16px' }}>⏰</span>
                        <span><strong>Time:</strong> {cls.time}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '16px' }}>⏱️</span>
                        <span><strong>Duration:</strong> {cls.duration} minutes</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '16px' }}>🏷️</span>
                        <span><strong>Category:</strong> {cls.category}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="card" style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '32px' }}>📋</div>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>Mark Attendance</h2>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', alignItems: 'center' }}>
              <select 
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                style={{ padding: '0.75rem', border: '2px solid #667eea', borderRadius: '8px', fontSize: '14px', minWidth: '200px' }}
              >
                <option value="">Select Class</option>
                {classes.map(cls => (
                  <option key={cls._id} value={cls._id}>{cls.name} - {cls.day} {cls.time}</option>
                ))}
              </select>
              <input 
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                style={{ padding: '0.75rem', border: '2px solid #667eea', borderRadius: '8px', fontSize: '14px' }}
              />
              <button 
                onClick={async () => {
                  if (!selectedClass || !attendanceDate) return;
                  try {
                    const response = await fetch(`/api/attendance/class/${selectedClass}?date=${attendanceDate}`);
                    const data = await response.json();
                    setAttendanceData(data.members || []);
                  } catch (error) {
                    console.error('Error fetching attendance:', error);
                  }
                }}
                disabled={!selectedClass}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'linear-gradient(45deg, #28a745, #20c997)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600'
                }}
              >
                Load Students
              </button>
            </div>

            {!selectedClass ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📋</div>
                <p style={{ fontSize: '18px', margin: 0 }}>Select a class and date to mark attendance</p>
              </div>
            ) : attendanceData.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>👥</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No students enrolled in this class</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Student</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Notes</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((member, index) => (
                      <tr key={member.memberId} style={{ background: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(45deg, #007bff, #0056b3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                              {member.memberName?.charAt(0)}
                            </div>
                            <span style={{ fontWeight: '600', color: '#2c3e50' }}>{member.memberName}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
                          <span style={{
                            backgroundColor: 
                              member.status === 'present' ? '#27ae60' :
                              member.status === 'late' ? '#f39c12' :
                              member.status === 'absent' ? '#e74c3c' : '#95a5a6',
                            color: 'white',
                            padding: '0.5rem 0.75rem',
                            borderRadius: '12px',
                            fontSize: '12px',
                            fontWeight: '600'
                          }}>
                            {member.status === 'not_marked' ? 'Not Marked' : member.status === 'present' ? '✓ Present' : member.status === 'late' ? '⏰ Late' : '✗ Absent'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
                          <input 
                            type="text"
                            value={member.notes || ''}
                            onChange={(e) => {
                              const updatedData = attendanceData.map(m => 
                                m.memberId === member.memberId ? {...m, notes: e.target.value} : m
                              );
                              setAttendanceData(updatedData);
                            }}
                            placeholder="Add notes..."
                            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px', fontSize: '12px' }}
                          />
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={async () => {
                                try {
                                  await fetch('/api/attendance/mark', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      memberId: member.memberId,
                                      classId: selectedClass,
                                      date: attendanceDate,
                                      status: 'present',
                                      markedBy: instructorId,
                                      notes: member.notes || ''
                                    })
                                  });
                                  // Refresh data
                                  const response = await fetch(`/api/attendance/class/${selectedClass}?date=${attendanceDate}`);
                                  const data = await response.json();
                                  setAttendanceData(data.members || []);
                                } catch (error) {
                                  console.error('Error marking attendance:', error);
                                }
                              }}
                              style={{
                                padding: '0.5rem 0.75rem',
                                background: 'linear-gradient(45deg, #28a745, #20c997)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}
                            >
                              Present
                            </button>
                            <button 
                              onClick={async () => {
                                try {
                                  await fetch('/api/attendance/mark', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      memberId: member.memberId,
                                      classId: selectedClass,
                                      date: attendanceDate,
                                      status: 'late',
                                      markedBy: instructorId,
                                      notes: member.notes || ''
                                    })
                                  });
                                  const response = await fetch(`/api/attendance/class/${selectedClass}?date=${attendanceDate}`);
                                  const data = await response.json();
                                  setAttendanceData(data.members || []);
                                } catch (error) {
                                  console.error('Error marking attendance:', error);
                                }
                              }}
                              style={{
                                padding: '0.5rem 0.75rem',
                                background: 'linear-gradient(45deg, #ffc107, #e0a800)',
                                color: 'black',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}
                            >
                              Late
                            </button>
                            <button 
                              onClick={async () => {
                                try {
                                  await fetch('/api/attendance/mark', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      memberId: member.memberId,
                                      classId: selectedClass,
                                      date: attendanceDate,
                                      status: 'absent',
                                      markedBy: instructorId,
                                      notes: member.notes || ''
                                    })
                                  });
                                  const response = await fetch(`/api/attendance/class/${selectedClass}?date=${attendanceDate}`);
                                  const data = await response.json();
                                  setAttendanceData(data.members || []);
                                } catch (error) {
                                  console.error('Error marking attendance:', error);
                                }
                              }}
                              style={{
                                padding: '0.5rem 0.75rem',
                                background: 'linear-gradient(45deg, #dc3545, #c82333)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontWeight: '600'
                              }}
                            >
                              Absent
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="card" style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '32px' }}>👥</div>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>My Students</h2>
            </div>
            {members.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>👥</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No students in your classes yet</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Name</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Email</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Phone</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Classes</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {members.map((member, index) => (
                      <tr key={member._id} style={{ background: index % 2 === 0 ? '#f8f9fa' : 'white', transition: 'all 0.3s ease' }}>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <div style={{ width: '32px', height: '32px', background: 'linear-gradient(45deg, #007bff, #0056b3)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 'bold' }}>
                              {(member.fullName || member.name)?.charAt(0)}
                            </div>
                            <span style={{ fontWeight: '600', color: '#2c3e50' }}>{member.fullName || member.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', color: '#7f8c8d' }}>{member.email}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', color: '#7f8c8d' }}>{member.phone}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                            {(member.classNames || []).map(className => (
                              <span key={className} style={{ background: '#e3f2fd', color: '#1976d2', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '12px', fontWeight: '500' }}>
                                {className}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              onClick={() => {
                                setDietForm({...dietForm, memberId: member._id});
                                setActiveTab('diet-plans');
                                setShowDietForm(true);
                              }}
                              style={{ 
                                padding: '0.5rem 0.75rem', 
                                background: 'linear-gradient(45deg, #28a745, #20c997)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '6px', 
                                cursor: 'pointer', 
                                fontSize: '12px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              🥗 Diet
                            </button>
                            <button 
                              onClick={() => {
                                setExerciseForm({...exerciseForm, memberId: member._id});
                                setActiveTab('exercise-plans');
                                setShowExerciseForm(true);
                              }}
                              style={{ 
                                padding: '0.5rem 0.75rem', 
                                background: 'linear-gradient(45deg, #17a2b8, #138496)', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '6px', 
                                cursor: 'pointer', 
                                fontSize: '12px',
                                fontWeight: '600',
                                transition: 'all 0.3s ease'
                              }}
                            >
                              💪 Exercise
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'diet-plans' && (
          <div className="card" style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '32px' }}>🥗</div>
                <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>Diet Plans</h2>
              </div>
              <button 
                onClick={() => setShowDietForm(!showDietForm)}
                className="btn-primary"
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  background: 'linear-gradient(45deg, #28a745, #20c997)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(40,167,69,0.3)'
                }}
              >
                {showDietForm ? '❌ Cancel' : '➕ Create Diet Plan'}
              </button>
            </div>

            {showDietForm && (
              <form onSubmit={handleDietSubmit} style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <select
                    value={dietForm.memberId}
                    onChange={(e) => setDietForm({...dietForm, memberId: e.target.value})}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="">Select Member</option>
                    {members.map(member => (
                      <option key={member._id} value={member._id}>{member.fullName}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Diet Plan Title"
                    value={dietForm.title}
                    onChange={(e) => setDietForm({...dietForm, title: e.target.value})}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={dietForm.description}
                  onChange={(e) => setDietForm({...dietForm, description: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', height: '60px', marginBottom: '1rem' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <input
                    type="number"
                    placeholder="Total Calories"
                    value={dietForm.totalCalories}
                    onChange={(e) => setDietForm({...dietForm, totalCalories: e.target.value})}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="text"
                    placeholder="Duration (e.g., 4 weeks)"
                    value={dietForm.duration}
                    onChange={(e) => setDietForm({...dietForm, duration: e.target.value})}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="text"
                    placeholder="Goals (comma separated)"
                    value={dietForm.goals.join(', ')}
                    onChange={(e) => setDietForm({...dietForm, goals: e.target.value.split(', ')})}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <button type="submit" style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Create Diet Plan
                </button>
              </form>
            )}

            {dietPlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>🥗</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No diet plans created yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {dietPlans.map(plan => (
                  <div key={plan._id} className="card" style={{ 
                    background: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)', 
                    padding: '1.5rem', 
                    borderRadius: '12px', 
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '18px', fontWeight: '700', position: 'relative', zIndex: 1 }}>{plan.title}</h4>
                    <div style={{ display: 'grid', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
                      <div><strong>Member:</strong> {plan.memberId?.fullName}</div>
                      <div><strong>Duration:</strong> {plan.duration}</div>
                      <div><strong>Total Calories:</strong> {plan.totalCalories}</div>
                      <div><strong>Status:</strong> {plan.status}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong>Approval:</strong> 
                        <span style={{ 
                          background: plan.approvalStatus === 'approved' ? '#27ae60' : plan.approvalStatus === 'rejected' ? '#e74c3c' : '#f39c12',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {plan.approvalStatus === 'approved' ? '✓ Approved' : plan.approvalStatus === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', opacity: '0.8', marginTop: '0.5rem' }}>
                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'exercise-plans' && (
          <div className="card" style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '32px' }}>💪</div>
                <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>Exercise Plans</h2>
              </div>
              <button 
                onClick={() => setShowExerciseForm(!showExerciseForm)}
                className="btn-primary"
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  background: 'linear-gradient(45deg, #17a2b8, #138496)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(23,162,184,0.3)'
                }}
              >
                {showExerciseForm ? '❌ Cancel' : '➕ Create Exercise Plan'}
              </button>
            </div>

            {showExerciseForm && (
              <form onSubmit={handleExerciseSubmit} style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <select
                    value={exerciseForm.memberId}
                    onChange={(e) => setExerciseForm({...exerciseForm, memberId: e.target.value})}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="">Select Member</option>
                    {members.map(member => (
                      <option key={member._id} value={member._id}>{member.fullName}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    placeholder="Exercise Plan Title"
                    value={exerciseForm.title}
                    onChange={(e) => setExerciseForm({...exerciseForm, title: e.target.value})}
                    required
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <textarea
                  placeholder="Description"
                  value={exerciseForm.description}
                  onChange={(e) => setExerciseForm({...exerciseForm, description: e.target.value})}
                  style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', height: '60px', marginBottom: '1rem' }}
                />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <select
                    value={exerciseForm.category}
                    onChange={(e) => setExerciseForm({...exerciseForm, category: e.target.value})}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="general">General</option>
                    <option value="crossfit">CrossFit</option>
                    <option value="karate">Karate</option>
                    <option value="zumba">Zumba</option>
                  </select>
                  <select
                    value={exerciseForm.difficulty}
                    onChange={(e) => setExerciseForm({...exerciseForm, difficulty: e.target.value})}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Duration"
                    value={exerciseForm.duration}
                    onChange={(e) => setExerciseForm({...exerciseForm, duration: e.target.value})}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={exerciseForm.frequency}
                    onChange={(e) => setExerciseForm({...exerciseForm, frequency: e.target.value})}
                    style={{ padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <button type="submit" style={{ padding: '0.5rem 1rem', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Create Exercise Plan
                </button>
              </form>
            )}

            {exercisePlans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>💪</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No exercise plans created yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {exercisePlans.map(plan => (
                  <div key={plan._id} className="card" style={{ 
                    background: 'linear-gradient(135deg, #17a2b8 0%, #138496 100%)', 
                    padding: '1.5rem', 
                    borderRadius: '12px', 
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '18px', fontWeight: '700', position: 'relative', zIndex: 1 }}>{plan.title}</h4>
                    <div style={{ display: 'grid', gap: '0.5rem', position: 'relative', zIndex: 1 }}>
                      <div><strong>Member:</strong> {plan.memberId?.fullName}</div>
                      <div><strong>Category:</strong> {plan.category}</div>
                      <div><strong>Difficulty:</strong> {plan.difficulty}</div>
                      <div><strong>Duration:</strong> {plan.duration}</div>
                      <div><strong>Frequency:</strong> {plan.frequency}</div>
                      <div><strong>Status:</strong> {plan.status}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <strong>Approval:</strong> 
                        <span style={{ 
                          background: plan.approvalStatus === 'approved' ? '#27ae60' : plan.approvalStatus === 'rejected' ? '#e74c3c' : '#f39c12',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {plan.approvalStatus === 'approved' ? '✓ Approved' : plan.approvalStatus === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                        </span>
                      </div>
                      <div style={{ fontSize: '12px', opacity: '0.8', marginTop: '0.5rem' }}>
                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'salary' && (
          <div className="card" style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ fontSize: '32px' }}>💰</div>
              <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>Salary History</h2>
            </div>
            {salaryHistory.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>💰</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No salary history available</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white' }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)', color: 'white' }}>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Month</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Base Salary</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Bonuses</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Deductions</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Total</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Status</th>
                      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600' }}>Payment Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salaryHistory.map((salary, index) => (
                      <tr key={salary._id} style={{ background: index % 2 === 0 ? '#f8f9fa' : 'white', transition: 'all 0.3s ease' }}>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', fontWeight: '600', color: '#2c3e50' }}>{salary.month}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', color: '#27ae60', fontWeight: '600' }}>Rs. {salary.baseSalary.toLocaleString()}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', color: '#3498db', fontWeight: '600' }}>Rs. {salary.bonuses.toLocaleString()}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', color: '#e74c3c', fontWeight: '600' }}>Rs. {salary.deductions.toLocaleString()}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', fontWeight: 'bold', fontSize: '16px', color: '#2c3e50' }}>Rs. {salary.totalSalary.toLocaleString()}</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef' }}>
                          <span style={{ 
                            padding: '0.5rem 0.75rem', 
                            borderRadius: '12px', 
                            fontSize: '12px',
                            fontWeight: '600',
                            background: salary.status === 'paid' ? '#27ae60' : salary.status === 'pending' ? '#f39c12' : '#e74c3c',
                            color: 'white'
                          }}>
                            {salary.status === 'paid' ? '✓ Paid' : salary.status === 'pending' ? '⏳ Pending' : '✗ ' + salary.status}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid #e9ecef', color: '#7f8c8d' }}>
                          {salary.paymentDate ? new Date(salary.paymentDate).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'posts' && (
          <div className="card" style={{ background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.1)', backdropFilter: 'blur(10px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ fontSize: '32px' }}>📝</div>
                <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: '700' }}>My Posts</h2>
              </div>
              <button 
                onClick={() => setShowPostForm(!showPostForm)}
                className="btn-primary"
                style={{ 
                  padding: '0.75rem 1.5rem', 
                  background: 'linear-gradient(45deg, #007bff, #0056b3)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  boxShadow: '0 2px 8px rgba(0,123,255,0.3)'
                }}
              >
                {showPostForm ? '❌ Cancel' : '➕ Create Post'}
              </button>
            </div>

            {showPostForm && (
              <form onSubmit={handlePostSubmit} style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <input
                    type="text"
                    placeholder="Post Title"
                    value={postForm.title}
                    onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <input
                    type="url"
                    placeholder="YouTube URL"
                    value={postForm.youtubeUrl}
                    onChange={(e) => setPostForm({...postForm, youtubeUrl: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <select
                    value={postForm.category}
                    onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
                  >
                    <option value="general">General</option>
                    <option value="crossfit">CrossFit</option>
                    <option value="karate">Karate</option>
                    <option value="zumba">Zumba</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <textarea
                    placeholder="Description"
                    value={postForm.description}
                    onChange={(e) => setPostForm({...postForm, description: e.target.value})}
                    required
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', height: '80px' }}
                  />
                </div>
                <button type="submit" style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Create Post
                </button>
              </form>
            )}

            {posts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: '#7f8c8d' }}>
                <div style={{ fontSize: '48px', marginBottom: '1rem' }}>📝</div>
                <p style={{ fontSize: '18px', margin: 0 }}>No posts created yet</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {posts.map(post => (
                  <div key={post._id} className="card" style={{ 
                    background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)', 
                    padding: '1.5rem', 
                    borderRadius: '12px', 
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '80px', height: '80px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></div>
                    <h4 style={{ margin: '0 0 1rem 0', fontSize: '18px', fontWeight: '700', position: 'relative', zIndex: 1 }}>{post.title}</h4>
                    <p style={{ margin: '0 0 1rem 0', opacity: '0.9', position: 'relative', zIndex: 1, lineHeight: '1.5' }}>{post.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
                      <span style={{ background: 'rgba(255,255,255,0.2)', padding: '0.25rem 0.5rem', borderRadius: '12px', fontSize: '12px', fontWeight: '600' }}>
                        {post.category}
                      </span>
                      <span style={{ 
                        background: (post.approvalStatus || 'pending') === 'approved' ? '#27ae60' : (post.approvalStatus || 'pending') === 'rejected' ? '#e74c3c' : '#f39c12',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {(post.approvalStatus || 'pending') === 'approved' ? '✓ Approved' : (post.approvalStatus || 'pending') === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', opacity: '0.8', marginTop: '1rem', position: 'relative', zIndex: 1 }}>
                      Created: {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}