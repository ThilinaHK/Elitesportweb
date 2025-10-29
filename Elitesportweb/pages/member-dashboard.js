import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function MemberDashboard() {
  const [member, setMember] = useState(null);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [instructorProfile, setInstructorProfile] = useState(null);
  const [dietPlan, setDietPlan] = useState(null);
  const [posts, setPosts] = useState([]);
  const [articles, setArticles] = useState([]);
  const [events, setEvents] = useState([]);
  const [exercisePlan, setExercisePlan] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [newNotifications, setNewNotifications] = useState([]);
  const [showNotificationAlert, setShowNotificationAlert] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const memberId = localStorage.getItem('memberId');
    if (!memberId) {
      router.push('/login');
      return;
    }
    fetchMemberData(memberId);
  }, []);

  const fetchMemberData = async (memberId) => {
    try {
      const [memberRes, classesRes, paymentsRes, notificationsRes, dietRes, postsRes, eventsRes, exerciseRes] = await Promise.all([
        fetch(`/api/members/${memberId}`),
        fetch(`/api/member-classes/${memberId}`),
        fetch(`/api/member-payments/${memberId}`),
        fetch(`/api/member-notifications/${memberId}`),
        fetch(`/api/member-diet/${memberId}`),
        fetch('/api/posts'),
        fetch('/api/events'),
        fetch(`/api/member-exercises/${memberId}`)
      ]);

      const memberData = await memberRes.json();
      const classesData = await classesRes.json();
      const paymentsData = await paymentsRes.json();
      const notificationsData = await notificationsRes.json();
      const dietData = await dietRes.json();
      const postsData = await postsRes.json();
      const eventsData = await eventsRes.json();
      const exerciseData = await exerciseRes.json();

      setMember(memberData.member);
      setClasses(classesData.classes || []);
      setPayments(paymentsData.payments || []);
      const allNotifications = notificationsData.notifications || [];
      setNotifications(allNotifications);
      
      // Check for new notifications (last 24 hours)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentNotifications = allNotifications.filter(n => new Date(n.createdAt) > yesterday);
      if (recentNotifications.length > 0) {
        setNewNotifications(recentNotifications);
        setShowNotificationAlert(true);
      }
      
      setDietPlan(dietData.diets && dietData.diets.length > 0 ? dietData.diets[0] : null);
      const allPosts = Array.isArray(postsData) ? postsData : (postsData.posts || []);
      setPosts(allPosts.filter(post => post.type !== 'article'));
      setArticles(allPosts.filter(post => post.type === 'article'));
      setEvents(Array.isArray(eventsData) ? eventsData : (eventsData.events || []));
      setExercisePlan(exerciseData.exercises && exerciseData.exercises.length > 0 ? exerciseData.exercises[0] : null);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('memberId');
    router.push('/');
  };

  const startEdit = () => {
    setEditData({
      fullName: member.fullName,
      email: member.email,
      phone: member.phone,
      address: member.address,
      emergencyContact: member.emergencyContact,
      medicalConditions: member.medicalConditions || ''
    });
    setEditing(true);
  };

  const saveProfile = async () => {
    try {
      const res = await fetch(`/api/members/${member._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData)
      });
      
      if (res.ok) {
        setMember({...member, ...editData});
        setEditing(false);
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile');
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setEditData({});
  };

  const requestVerification = async (paymentId) => {
    try {
      const res = await fetch(`/api/payments/${paymentId}/verify`, {
        method: 'POST'
      });
      
      if (res.ok) {
        alert('Verification request submitted successfully!');
        const memberId = localStorage.getItem('memberId');
        fetchMemberData(memberId); // Refresh data
      } else {
        alert('Failed to submit verification request');
      }
    } catch (error) {
      alert('Error submitting verification request');
    }
  };

  const fetchInstructorProfile = async (instructorName) => {
    try {
      const res = await fetch(`/api/instructors/by-name/${encodeURIComponent(instructorName)}`);
      if (res.ok) {
        const data = await res.json();
        setInstructorProfile(data.instructor);
      }
    } catch (error) {
      console.error('Error fetching instructor profile:', error);
    }
  };

  useEffect(() => {
    if (selectedInstructor) {
      fetchInstructorProfile(selectedInstructor);
    }
  }, [selectedInstructor]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const res = await fetch('/api/upload/profile-picture', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageData: event.target.result,
            memberId: member._id
          })
        });
        
        if (res.ok) {
          const data = await res.json();
          setMember({...member, profilePicture: data.profilePicture});
          alert('Profile picture updated successfully!');
        } else {
          alert('Failed to upload profile picture');
        }
      } catch (error) {
        alert('Error uploading profile picture');
      }
    };
    reader.readAsDataURL(file);
  };

  const openEventRegistration = (event) => {
    setSelectedEvent(event);
    setEventFormData({ fullName: member.fullName, phoneNumber: member.phone });
    setShowEventModal(true);
  };

  const handleEventRegistration = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch(`/api/events/${selectedEvent._id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventFormData)
      });
      
      if (res.ok) {
        alert('Successfully registered for the event!');
        setShowEventModal(false);
        const memberId = localStorage.getItem('memberId');
        fetchMemberData(memberId);
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to register for event');
      }
    } catch (error) {
      alert('Error registering for event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <>
      <Head>
        <title>Member Dashboard - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
          body { font-family: 'Poppins', sans-serif; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); }
          .dark-card { background: rgba(0,0,0,0.3); backdrop-filter: blur(15px); border: 1px solid rgba(255,255,255,0.1); }
          .card-hover { transition: all 0.3s ease; }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
        `}</style>
      </Head>
      
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
        <div className="dark-card" style={{ padding: '1.5rem 0', marginBottom: '2rem' }}>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="me-3" style={{ width: '60px', height: '60px', background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fas fa-user text-white" style={{ fontSize: '24px' }}></i>
                </div>
                <div>
                  <h1 className="text-white mb-0" style={{ fontSize: '2rem', fontWeight: '700' }}>Welcome Back!</h1>
                  <p className="text-white-50 mb-0">{member?.fullName}</p>
                </div>
              </div>
              <button onClick={logout} className="btn btn-outline-light px-4 py-2" style={{ borderRadius: '25px', fontWeight: '600' }}>
                <i className="fas fa-sign-out-alt me-2"></i>Logout
              </button>
            </div>
          </div>
        </div>

        <div className="container pb-5">
          <div className="row mb-4">
            <div className="col-lg-2 col-md-3 col-6 mb-3">
              <div className="card border-0 card-hover" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)' }}>
                <div className="card-body text-center text-white p-3">
                  <i className="fas fa-dumbbell fa-2x mb-2"></i>
                  <h6 className="card-title mb-1">Classes</h6>
                  <h4 className="mb-0">{classes.length}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-6 mb-3">
              <div className="card border-0 card-hover" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #00d2d3, #54a0ff)' }}>
                <div className="card-body text-center text-white p-3">
                  <i className="fas fa-credit-card fa-2x mb-2"></i>
                  <h6 className="card-title mb-1">Payments</h6>
                  <h4 className="mb-0">{payments.length}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-6 mb-3">
              <div className="card border-0 card-hover" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #feca57, #ff9ff3)' }}>
                <div className="card-body text-center text-white p-3">
                  <i className="fas fa-bell fa-2x mb-2"></i>
                  <h6 className="card-title mb-1">Notifications</h6>
                  <h4 className="mb-0">{notifications.length}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-6 mb-3">
              <div className="card border-0 card-hover" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #5f27cd, #00d2d3)' }}>
                <div className="card-body text-center text-white p-3">
                  <i className="fas fa-calendar fa-2x mb-2"></i>
                  <h6 className="card-title mb-1">Member Since</h6>
                  <small className="mb-0">{member ? new Date(member.joinDate).getFullYear() : ''}</small>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-6 mb-3">
              <div className="card border-0 card-hover" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #2ed573, #7bed9f)' }}>
                <div className="card-body text-center text-white p-3">
                  <i className="fas fa-apple-alt fa-2x mb-2"></i>
                  <h6 className="card-title mb-1">Diet Plans</h6>
                  <h4 className="mb-0">{dietPlan ? '1' : '0'}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-6 mb-3">
              <div className="card border-0 card-hover" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #ff6348, #ff7675)' }}>
                <div className="card-body text-center text-white p-3">
                  <i className="fas fa-dumbbell fa-2x mb-2"></i>
                  <h6 className="card-title mb-1">Exercise Plan</h6>
                  <h4 className="mb-0">{exercisePlan ? '1' : '0'}</h4>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-3 col-6 mb-3">
              <div className="card border-0 card-hover" style={{ borderRadius: '15px', background: 'linear-gradient(135deg, #a55eea, #26de81)' }}>
                <div className="card-body text-center text-white p-3">
                  <i className="fas fa-play-circle fa-2x mb-2"></i>
                  <h6 className="card-title mb-1">Videos</h6>
                  <h4 className="mb-0">{posts.length}</h4>
                </div>
              </div>
            </div>
          </div>
          <div className="card border-0 mb-4" style={{ borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <div className="card-body p-2">
              <div className="d-flex flex-wrap justify-content-center">
                {[
                  { key: 'profile', icon: 'fas fa-user', label: 'Profile' },
                  { key: 'classes', icon: 'fas fa-dumbbell', label: 'Classes' },
                  { key: 'payments', icon: 'fas fa-credit-card', label: 'Payments' },
                  { key: 'notifications', icon: 'fas fa-bell', label: 'Notifications' },
                  { key: 'diet', icon: 'fas fa-apple-alt', label: 'Diet Plan' },
                  { key: 'exercise', icon: 'fas fa-dumbbell', label: 'Exercise Plan' },
                  { key: 'videos', icon: 'fas fa-play-circle', label: 'Videos' },
                  { key: 'articles', icon: 'fas fa-newspaper', label: 'Articles' },
                  { key: 'events', icon: 'fas fa-calendar-alt', label: 'Events' }
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`btn flex-fill mx-1 my-1 ${activeTab === tab.key ? 'btn-primary' : 'btn-outline-dark'}`}
                    style={{ borderRadius: '10px', fontWeight: '600' }}
                  >
                    <i className={`${tab.icon} me-2`}></i>
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeTab === 'profile' && member && (
            <div className="card border-0" style={{ borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#333' }}>
              <div className="card-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <div className="d-flex align-items-center">
                    <div className="me-3">
                      {member.profilePicture ? (
                        <img src={member.profilePicture} alt="Profile" className="rounded-circle" style={{width: '80px', height: '80px', objectFit: 'cover'}} />
                      ) : (
                        <div className="rounded-circle bg-secondary d-flex align-items-center justify-content-center" style={{width: '80px', height: '80px'}}>
                          <i className="fas fa-user fa-2x text-white"></i>
                        </div>
                      )}
                    </div>
                    <h2 className="text-dark mb-0"><i className="fas fa-user-circle me-2"></i>Profile Information</h2>
                  </div>
                  <div className="d-flex gap-2">
                    <input 
                      type="file" 
                      id="profilePicture" 
                      accept="image/*" 
                      style={{display: 'none'}} 
                      onChange={handleImageUpload}
                    />
                    <button onClick={() => document.getElementById('profilePicture').click()} className="btn btn-outline-primary px-3" style={{ borderRadius: '25px' }}>
                      <i className="fas fa-camera me-2"></i>Photo
                    </button>
                    {!editing ? (
                      <button onClick={startEdit} className="btn btn-primary px-4" style={{ borderRadius: '25px' }}>
                        <i className="fas fa-edit me-2"></i>Edit Profile
                      </button>
                    ) : (
                    <div className="d-flex gap-2">
                      <button onClick={saveProfile} className="btn btn-success px-3" style={{ borderRadius: '25px' }}>
                        <i className="fas fa-save me-2"></i>Save
                      </button>
                      <button onClick={cancelEdit} className="btn btn-secondary px-3" style={{ borderRadius: '25px' }}>
                        <i className="fas fa-times me-2"></i>Cancel
                      </button>
                    </div>
                    )}
                  </div>
                </div>
            
                {!editing ? (
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="card h-100" style={{ backgroundColor: 'rgba(248,249,250,0.8)', border: '1px solid #dee2e6' }}>
                        <div className="card-body">
                          <h6 className="card-title text-primary mb-3"><i className="fas fa-id-card me-2"></i>Personal Information</h6>
                          <div className="mb-2"><small className="text-muted">Member ID</small><br/><strong>{member.memberId}</strong></div>
                          <div className="mb-2"><small className="text-muted">Full Name</small><br/><strong>{member.fullName}</strong></div>
                          <div className="mb-2"><small className="text-muted">Date of Birth</small><br/><strong>{new Date(member.dateOfBirth).toLocaleDateString()}</strong></div>
                          <div className="mb-0"><small className="text-muted">Gender</small><br/><strong className="text-capitalize">{member.gender}</strong></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card h-100" style={{ backgroundColor: 'rgba(248,249,250,0.8)', border: '1px solid #dee2e6' }}>
                        <div className="card-body">
                          <h6 className="card-title text-success mb-3"><i className="fas fa-phone me-2"></i>Contact Information</h6>
                          <div className="mb-2"><small className="text-muted">Email Address</small><br/><strong>{member.email}</strong></div>
                          <div className="mb-2"><small className="text-muted">Phone Number</small><br/><strong>{member.phone}</strong></div>
                          <div className="mb-2"><small className="text-muted">Address</small><br/><strong>{member.address}</strong></div>
                          <div className="mb-0"><small className="text-muted">Emergency Contact</small><br/><strong>{member.emergencyContact}</strong></div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="card" style={{ backgroundColor: 'rgba(248,249,250,0.8)', border: '1px solid #dee2e6' }}>
                        <div className="card-body">
                          <h6 className="card-title text-warning mb-3"><i className="fas fa-notes-medical me-2"></i>Additional Information</h6>
                          <div className="row">
                            <div className="col-md-6">
                              <div className="mb-0"><small className="text-muted">Medical Conditions</small><br/><strong>{member.medicalConditions || 'None reported'}</strong></div>
                            </div>
                            <div className="col-md-6">
                              <div className="mb-0"><small className="text-muted">Member Since</small><br/><strong>{new Date(member.joinDate).toLocaleDateString()}</strong></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="card h-100" style={{ backgroundColor: 'rgba(248,249,250,0.9)', border: '1px solid #dee2e6' }}>
                          <div className="card-body">
                            <h6 className="card-title text-primary mb-3"><i className="fas fa-id-card me-2"></i>Personal Information</h6>
                            <div className="mb-3">
                              <label className="form-label text-muted small">Member ID</label>
                              <input type="text" className="form-control" value={member.memberId} disabled />
                            </div>
                            <div className="mb-3">
                              <label className="form-label text-muted small">Full Name *</label>
                              <input
                                type="text"
                                className="form-control"
                                value={editData.fullName}
                                onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label text-muted small">Date of Birth</label>
                              <input type="text" className="form-control" value={new Date(member.dateOfBirth).toLocaleDateString()} disabled />
                            </div>
                            <div className="mb-0">
                              <label className="form-label text-muted small">Gender</label>
                              <input type="text" className="form-control text-capitalize" value={member.gender} disabled />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="card h-100" style={{ backgroundColor: 'rgba(248,249,250,0.9)', border: '1px solid #dee2e6' }}>
                          <div className="card-body">
                            <h6 className="card-title text-success mb-3"><i className="fas fa-phone me-2"></i>Contact Information</h6>
                            <div className="mb-3">
                              <label className="form-label text-muted small">Email Address *</label>
                              <input
                                type="email"
                                className="form-control"
                                value={editData.email}
                                onChange={(e) => setEditData({...editData, email: e.target.value})}
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label text-muted small">Phone Number *</label>
                              <input
                                type="tel"
                                className="form-control"
                                value={editData.phone}
                                onChange={(e) => setEditData({...editData, phone: e.target.value})}
                                required
                              />
                            </div>
                            <div className="mb-3">
                              <label className="form-label text-muted small">Address</label>
                              <textarea
                                className="form-control"
                                rows="2"
                                value={editData.address}
                                onChange={(e) => setEditData({...editData, address: e.target.value})}
                              />
                            </div>
                            <div className="mb-0">
                              <label className="form-label text-muted small">Emergency Contact</label>
                              <input
                                type="tel"
                                className="form-control"
                                value={editData.emergencyContact}
                                onChange={(e) => setEditData({...editData, emergencyContact: e.target.value})}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="card" style={{ backgroundColor: 'rgba(248,249,250,0.9)', border: '1px solid #dee2e6' }}>
                          <div className="card-body">
                            <h6 className="card-title text-warning mb-3"><i className="fas fa-notes-medical me-2"></i>Additional Information</h6>
                            <div className="row">
                              <div className="col-md-6">
                                <label className="form-label text-muted small">Medical Conditions</label>
                                <textarea
                                  className="form-control"
                                  rows="3"
                                  value={editData.medicalConditions}
                                  onChange={(e) => setEditData({...editData, medicalConditions: e.target.value})}
                                  placeholder="None reported"
                                />
                              </div>
                              <div className="col-md-6">
                                <label className="form-label text-muted small">Member Since</label>
                                <input type="text" className="form-control" value={new Date(member.joinDate).toLocaleDateString()} disabled />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}

          {activeTab === 'classes' && (
            <div className="card border-0" style={{ borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#333' }}>
              <div className="card-body p-4">
                <h2 className="text-dark mb-4"><i className="fas fa-dumbbell me-2"></i>My Classes</h2>
                {classes.length === 0 ? (
                  <p className="text-muted">No classes assigned yet.</p>
                ) : (
                  <div className="accordion" id="classesAccordion">
                    {classes.map((cls, index) => (
                      <div key={cls._id} className="accordion-item" style={{ backgroundColor: 'rgba(255,255,255,0.9)', marginBottom: '10px', borderRadius: '10px', border: 'none' }}>
                        <h2 className="accordion-header" id={`heading${index}`}>
                          <button 
                            className="accordion-button collapsed" 
                            type="button" 
                            data-bs-toggle="collapse" 
                            data-bs-target={`#collapse${index}`} 
                            aria-expanded="false" 
                            aria-controls={`collapse${index}`}
                            style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '10px' }}
                          >
                            <strong className="text-primary">{cls.name}</strong>
                          </button>
                        </h2>
                        <div 
                          id={`collapse${index}`} 
                          className="accordion-collapse collapse" 
                          aria-labelledby={`heading${index}`} 
                          data-bs-parent="#classesAccordion"
                        >
                          <div className="accordion-body">
                            <p className="text-dark mb-1"><strong>Time:</strong> {cls.time}</p>
                            <p className="text-dark mb-1"><strong>Duration:</strong> {cls.duration}</p>
                            <p className="text-dark mb-1"><strong>Instructor:</strong> 
                              <button 
                                className="btn btn-link p-0 ms-1 text-primary" 
                                onClick={() => setSelectedInstructor(cls.instructor)}
                                style={{ textDecoration: 'underline' }}
                              >
                                {cls.instructor}
                              </button>
                            </p>
                            <p className="text-dark mb-0"><strong>Type:</strong> {cls.type}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="card border-0" style={{ borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#333' }}>
              <div className="card-body p-4">
                <h2 className="text-dark mb-4"><i className="fas fa-credit-card me-2"></i>Payment History</h2>
                {payments.length === 0 ? (
                  <p className="text-muted">No payment records found.</p>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-light table-hover" style={{ backgroundColor: 'rgba(255,255,255,0.9)' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'rgba(0,0,0,0.1)' }}>
                          <th className="text-dark">Date</th>
                          <th className="text-dark">Amount</th>
                          <th className="text-dark">Type</th>
                          <th className="text-dark">Month</th>
                          <th className="text-dark">Class</th>
                          <th className="text-dark">Status</th>
                          <th className="text-dark">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map(payment => (
                          <tr key={payment._id}>
                            <td className="text-dark">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                            <td className="text-dark">LKR {payment.amount}</td>
                            <td className="text-dark">{payment.paymentType}</td>
                            <td className="text-dark">{payment.paymentMonth}</td>
                            <td className="text-dark">{payment.className}</td>
                            <td>
                              <span className={`badge ${
                                payment.verificationStatus === 'verified' ? 'bg-success' : 
                                payment.verificationStatus === 'requested' ? 'bg-warning' : 
                                payment.verificationStatus === 'disputed' ? 'bg-danger' : 'bg-secondary'
                              }`}>
                                {payment.verificationStatus || 'unverified'}
                              </span>
                            </td>
                            <td>
                              {(!payment.verificationStatus || payment.verificationStatus === 'unverified') && (
                                <button
                                  onClick={() => requestVerification(payment._id)}
                                  className="btn btn-primary btn-sm"
                                >
                                  Request Verify
                                </button>
                              )}
                              {payment.verificationStatus === 'requested' && (
                                <span className="text-warning small">Pending</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card border-0" style={{ borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#333' }}>
              <div className="card-body p-4">
                <h2 className="text-dark mb-4"><i className="fas fa-bell me-2"></i>Class Notifications</h2>
                {notifications.length === 0 ? (
                  <p className="text-muted">No notifications yet.</p>
                ) : (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {notifications.map(notification => (
                      <div key={notification._id} className="card" style={{ backgroundColor: 'rgba(255,255,255,0.9)', color: '#333', borderRadius: '10px' }}>
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h5 className="card-title text-primary mb-0">{notification.title}</h5>
                            <span className="text-muted small">
                              {new Date(notification.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-dark mb-2">{notification.message}</p>
                          <div className="text-muted small">
                            <strong>Class:</strong> {notification.className}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'diet' && (
            <div className="card border-0" style={{ borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#333' }}>
              <div className="card-body p-4">
                <h2 className="text-dark mb-4"><i className="fas fa-apple-alt me-2"></i>My Diet Plan</h2>
                {dietPlan ? (
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card" style={{ background: 'linear-gradient(135deg, #2ed573, #7bed9f)', border: 'none' }}>
                        <div className="card-body text-white">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h4 className="mb-1">{dietPlan.planName}</h4>
                              <p className="mb-0 opacity-75">{dietPlan.description}</p>
                            </div>
                            <div className="text-end">
                              <div className="mb-2">
                                {dietPlan.calories && <span className="badge bg-light text-dark me-2">{dietPlan.calories} cal</span>}
                                {dietPlan.duration && <span className="badge bg-warning text-dark">{dietPlan.duration}</span>}
                              </div>
                              <small className="opacity-75">by {dietPlan.assignedBy}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {dietPlan.meals && dietPlan.meals.map((meal, index) => (
                      <div key={index} className="col-lg-4 col-md-6">
                        <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                          <div className="card-header text-center" style={{ background: 'linear-gradient(45deg, #ff6b6b, #ee5a24)', borderRadius: '15px 15px 0 0' }}>
                            <h5 className="text-white mb-0">
                              <i className={`fas ${
                                meal.name.toLowerCase().includes('breakfast') ? 'fa-sun' :
                                meal.name.toLowerCase().includes('lunch') ? 'fa-cloud-sun' :
                                meal.name.toLowerCase().includes('dinner') ? 'fa-moon' : 'fa-utensils'
                              } me-2`}></i>
                              {meal.name}
                            </h5>
                            {meal.time && <small className="text-white opacity-75">{meal.time}</small>}
                          </div>
                          <div className="card-body">
                            <ul className="list-group list-group-flush">
                              {meal.foods && meal.foods.map((food, i) => (
                                <li key={i} className="list-group-item border-0 px-0 py-2">
                                  <i className="fas fa-check-circle text-success me-2"></i>
                                  {food}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {dietPlan.notes && (
                      <div className="col-12">
                        <div className="card border-0" style={{ background: 'linear-gradient(135deg, #feca57, #ff9ff3)', borderRadius: '15px' }}>
                          <div className="card-body">
                            <h5 className="text-white mb-3">
                              <i className="fas fa-sticky-note me-2"></i>
                              Special Instructions
                            </h5>
                            <p className="text-white mb-0 opacity-90">{dietPlan.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-apple-alt fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">No Diet Plan Assigned</h5>
                    <p className="text-muted">Contact your instructor for a personalized nutrition plan.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'exercise' && (
            <div className="card border-0" style={{ borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#333' }}>
              <div className="card-body p-4">
                <h2 className="text-dark mb-4"><i className="fas fa-dumbbell me-2"></i>My Exercise Plan</h2>
                {exercisePlan ? (
                  <div className="row g-4">
                    <div className="col-12">
                      <div className="card" style={{ background: 'linear-gradient(135deg, #ff6b6b, #ee5a24)', border: 'none' }}>
                        <div className="card-body text-white">
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <h4 className="mb-1">{exercisePlan.planName}</h4>
                              <p className="mb-0 opacity-75">{exercisePlan.description}</p>
                            </div>
                            <div className="text-end">
                              {exercisePlan.duration && <span className="badge bg-warning text-dark">{exercisePlan.duration}</span>}
                              <br/>
                              <small className="opacity-75">by {exercisePlan.assignedBy}</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {exercisePlan.exercises && exercisePlan.exercises.map((exercise, index) => (
                      <div key={index} className="col-lg-6 col-md-12">
                        <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                          <div className="card-header text-center" style={{ background: 'linear-gradient(45deg, #2196f3, #21cbf3)', borderRadius: '15px 15px 0 0' }}>
                            <h5 className="text-white mb-0">
                              <i className="fas fa-dumbbell me-2"></i>
                              {exercise.name}
                            </h5>
                          </div>
                          <div className="card-body">
                            <div className="row g-2">
                              <div className="col-6">
                                <div className="text-center p-2 bg-light rounded">
                                  <strong className="text-primary">{exercise.sets}</strong>
                                  <br/><small>Sets</small>
                                </div>
                              </div>
                              <div className="col-6">
                                <div className="text-center p-2 bg-light rounded">
                                  <strong className="text-success">{exercise.reps}</strong>
                                  <br/><small>Reps</small>
                                </div>
                              </div>
                              {exercise.weight && (
                                <div className="col-6">
                                  <div className="text-center p-2 bg-light rounded">
                                    <strong className="text-warning">{exercise.weight}</strong>
                                    <br/><small>Weight</small>
                                  </div>
                                </div>
                              )}
                              {exercise.duration && (
                                <div className="col-6">
                                  <div className="text-center p-2 bg-light rounded">
                                    <strong className="text-info">{exercise.duration}</strong>
                                    <br/><small>Duration</small>
                                  </div>
                                </div>
                              )}
                            </div>
                            {exercise.instructions && (
                              <div className="mt-3">
                                <h6 className="text-primary">Instructions:</h6>
                                <p className="small text-muted">{exercise.instructions}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {exercisePlan.notes && (
                      <div className="col-12">
                        <div className="card border-0" style={{ background: 'linear-gradient(135deg, #9c27b0, #e91e63)', borderRadius: '15px' }}>
                          <div className="card-body">
                            <h5 className="text-white mb-3">
                              <i className="fas fa-sticky-note me-2"></i>
                              Special Notes
                            </h5>
                            <p className="text-white mb-0 opacity-90">{exercisePlan.notes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-dumbbell fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">No Exercise Plan Assigned</h5>
                    <p className="text-muted">Contact your instructor for a personalized workout plan.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="card border-0" style={{ borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#333' }}>
              <div className="card-body p-4">
                <h2 className="text-dark mb-4"><i className="fas fa-play-circle me-2"></i>Exercise Videos</h2>
                {posts.length > 0 ? (
                  <div className="row">
                    {posts.map(post => (
                      <div key={post._id} className="col-md-4 mb-3">
                        <div className="card h-100 shadow-sm">
                          <div className="card-img-top bg-dark d-flex align-items-center justify-content-center position-relative" style={{height: '200px'}}>
                            {post.featuredImage ? (
                              <img src={post.featuredImage} alt={post.title} className="w-100 h-100" style={{objectFit: 'cover'}} />
                            ) : post.videoId ? (
                              <img src={`https://img.youtube.com/vi/${post.videoId}/maxresdefault.jpg`} alt={post.title} className="w-100 h-100" style={{objectFit: 'cover'}} />
                            ) : (
                              <i className="fas fa-video fa-3x text-white"></i>
                            )}
                            <div className="position-absolute top-50 start-50 translate-middle">
                              <i className="fas fa-play-circle fa-3x text-white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.7)'}}></i>
                            </div>
                          </div>
                          <div className="card-body">
                            <h6 className="card-title">{post.title}</h6>
                            <p className="card-text small text-muted">{post.description}</p>
                            <div className="d-flex justify-content-between align-items-center">
                              <small className="text-muted">{new Date(post.createdAt).toLocaleDateString()}</small>
                              {(post.youtubeUrl || post.videoId) && (
                                <a href={post.youtubeUrl || `https://www.youtube.com/watch?v=${post.videoId}`} target="_blank" className="btn btn-primary btn-sm">
                                  <i className="fas fa-play me-1"></i>Watch
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-video fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">No Videos Available</h5>
                    <p className="text-muted">Check back later for new exercise videos.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'articles' && (
            <div className="card border-0" style={{ borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#333' }}>
              <div className="card-body p-4">
                <h2 className="text-dark mb-4"><i className="fas fa-newspaper me-2"></i>Health Articles</h2>
                {articles.length > 0 ? (
                  <div className="row">
                    {articles.map(article => (
                      <div key={article._id} className="col-md-6 mb-3">
                        <div className="card h-100 shadow-sm">
                          {article.featuredImage && (
                            <img src={article.featuredImage} className="card-img-top" alt={article.title} style={{height: '200px', objectFit: 'cover'}} />
                          )}
                          <div className="card-body d-flex flex-column">
                            <div className="mb-2">
                              <span className="badge bg-primary">{article.category}</span>
                              {article.type === 'featured' && <span className="badge bg-warning text-dark ms-1">Featured</span>}
                            </div>
                            <h6 className="card-title text-primary">{article.title}</h6>
                            <p className="card-text small flex-grow-1">{article.excerpt || article.description}</p>
                            <div className="mt-auto">
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">Published: {new Date(article.createdAt).toLocaleDateString()}</small>
                                <button className="btn btn-outline-primary btn-sm" onClick={() => setSelectedArticle(article)}>
                                  Read More
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-newspaper fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">No Articles Available</h5>
                    <p className="text-muted">Check back later for new health and fitness articles.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="card border-0" style={{ borderRadius: '15px', backgroundColor: 'rgba(255,255,255,0.95)', color: '#333' }}>
              <div className="card-body p-4">
                <h2 className="text-dark mb-4"><i className="fas fa-calendar-alt me-2"></i>Upcoming Events</h2>
                {events.length > 0 ? (
                  <div className="row">
                    {events.map(event => (
                      <div key={event._id} className="col-md-6 mb-3">
                        <div className="card border-primary h-100">
                          {event.image && (
                            <img src={event.image} className="card-img-top" alt={event.title} style={{height: '200px', objectFit: 'cover'}} />
                          )}
                          <div className="card-body d-flex flex-column">
                            <div className="mb-2">
                              <span className="badge bg-primary">{event.category}</span>
                              {event.status === 'active' && <span className="badge bg-success ms-1">Active</span>}
                            </div>
                            <h6 className="card-title text-primary">{event.title}</h6>
                            <p className="card-text small flex-grow-1">{event.description}</p>
                            <div className="mt-auto">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <small className="text-muted"><i className="fas fa-calendar me-1"></i>{new Date(event.date).toLocaleDateString()}</small>
                                <small className="text-muted"><i className="fas fa-clock me-1"></i>{event.time}</small>
                              </div>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted"><i className="fas fa-map-marker-alt me-1"></i>{event.location}</small>
                                {event.price > 0 && <span className="badge bg-warning text-dark">LKR {event.price}</span>}
                              </div>
                              <div className="mt-2 d-flex justify-content-between align-items-center">
                                <small className="text-muted">{event.currentParticipants}/{event.maxParticipants} participants</small>
                                <button 
                                  className="btn btn-primary btn-sm"
                                  onClick={() => openEventRegistration(event)}
                                  disabled={event.currentParticipants >= event.maxParticipants}
                                >
                                  {event.currentParticipants >= event.maxParticipants ? 'Full' : 'Register'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-5">
                    <i className="fas fa-calendar-times fa-4x text-muted mb-3"></i>
                    <h5 className="text-muted">No Upcoming Events</h5>
                    <p className="text-muted">Check back later for new events and activities.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Event Registration Modal */}
          {showEventModal && selectedEvent && (
            <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Register for {selectedEvent.title}</h5>
                    <button type="button" className="btn-close" onClick={() => setShowEventModal(false)}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}</p>
                      <p><strong>Location:</strong> {selectedEvent.location}</p>
                      {selectedEvent.price > 0 && <p><strong>Price:</strong> LKR {selectedEvent.price}</p>}
                    </div>
                    
                    <form onSubmit={handleEventRegistration}>
                      <div className="mb-3">
                        <label className="form-label">Are you a member? <span className="text-danger">*</span></label>
                        <select 
                          className="form-select" 
                          value={eventFormData.isMember || ''}
                          onChange={(e) => setEventFormData({...eventFormData, isMember: e.target.value})}
                          required
                        >
                          <option value="">Select...</option>
                          <option value="yes">Yes, I am a member</option>
                          <option value="no">No, I am not a member</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Full Name <span className="text-danger">*</span></label>
                        <input
                          type="text"
                          className="form-control"
                          value={eventFormData.fullName || ''}
                          onChange={(e) => setEventFormData({...eventFormData, fullName: e.target.value})}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                        <input
                          type="tel"
                          className="form-control"
                          value={eventFormData.phoneNumber || ''}
                          onChange={(e) => setEventFormData({...eventFormData, phoneNumber: e.target.value})}
                          required
                        />
                      </div>
                      {selectedEvent.forms && selectedEvent.forms.map((field, index) => (
                        <div key={index} className="mb-3">
                          <label className="form-label">
                            {field.label} {field.required && <span className="text-danger">*</span>}
                          </label>
                          {field.type === 'text' && (
                            <input
                              type="text"
                              className="form-control"
                              required={field.required}
                              onChange={(e) => setEventFormData({...eventFormData, [field.label]: e.target.value})}
                            />
                          )}
                          {field.type === 'email' && (
                            <input
                              type="email"
                              className="form-control"
                              required={field.required}
                              onChange={(e) => setEventFormData({...eventFormData, [field.label]: e.target.value})}
                            />
                          )}
                          {field.type === 'tel' && (
                            <input
                              type="tel"
                              className="form-control"
                              required={field.required}
                              onChange={(e) => setEventFormData({...eventFormData, [field.label]: e.target.value})}
                            />
                          )}
                          {field.type === 'select' && (
                            <select
                              className="form-select"
                              required={field.required}
                              onChange={(e) => setEventFormData({...eventFormData, [field.label]: e.target.value})}
                            >
                              <option value="">Select...</option>
                              {field.options?.map((option, i) => (
                                <option key={i} value={option}>{option}</option>
                              ))}
                            </select>
                          )}
                          {field.type === 'textarea' && (
                            <textarea
                              className="form-control"
                              rows="3"
                              required={field.required}
                              onChange={(e) => setEventFormData({...eventFormData, [field.label]: e.target.value})}
                            />
                          )}
                        </div>
                      ))}
                      <button type="submit" className="btn btn-primary" disabled={submitting}>
                        {submitting ? 'Registering...' : 'Complete Registration'}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Instructor Profile Modal */}
          {selectedInstructor && instructorProfile && (
            <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
              <div className="modal-dialog modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Instructor Profile - {instructorProfile.name}</h5>
                    <button type="button" className="btn-close" onClick={() => {setSelectedInstructor(null); setInstructorProfile(null);}}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-4 text-center mb-3">
                        {instructorProfile.profilePicture ? (
                          <img src={instructorProfile.profilePicture} alt={instructorProfile.name} className="rounded-circle" style={{width: '150px', height: '150px', objectFit: 'cover'}} />
                        ) : (
                          <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{width: '150px', height: '150px', margin: '0 auto'}}>
                            <i className="fas fa-user fa-4x text-white"></i>
                          </div>
                        )}
                      </div>
                      <div className="col-md-8">
                        <h4>{instructorProfile.name}</h4>
                        <p><strong>Email:</strong> {instructorProfile.email}</p>
                        <p><strong>Phone:</strong> {instructorProfile.phone}</p>
                        <p><strong>Specialization:</strong> {instructorProfile.specialization}</p>
                        <p><strong>Experience:</strong> {instructorProfile.experience} years</p>
                        <p><strong>Bio:</strong> {instructorProfile.bio || 'No bio available'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notification Alert */}
        {showNotificationAlert && (
          <div className="position-fixed top-0 end-0 p-3" style={{zIndex: 1050}}>
            <div className="toast show" role="alert">
              <div className="toast-header">
                <i className="fas fa-bell text-primary me-2"></i>
                <strong className="me-auto">New Notifications</strong>
                <button type="button" className="btn-close" onClick={() => setShowNotificationAlert(false)}></button>
              </div>
              <div className="toast-body">
                <p className="mb-2">You have {newNotifications.length} new notification{newNotifications.length > 1 ? 's' : ''}:</p>
                {newNotifications.slice(0, 2).map(notification => (
                  <div key={notification._id} className="mb-2 p-2 bg-light rounded">
                    <strong>{notification.title}</strong>
                    <br/>
                    <small className="text-muted">{notification.className}</small>
                  </div>
                ))}
                {newNotifications.length > 2 && (
                  <small className="text-muted">...and {newNotifications.length - 2} more</small>
                )}
                <div className="mt-2">
                  <button className="btn btn-primary btn-sm" onClick={() => {setActiveTab('notifications'); setShowNotificationAlert(false);}}>
                    View All
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}