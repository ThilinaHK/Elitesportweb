import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function MemberDashboard() {
  const [member, setMember] = useState(null);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
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
      const [memberRes, classesRes, paymentsRes, notificationsRes] = await Promise.all([
        fetch(`/api/members/${memberId}`),
        fetch(`/api/member-classes/${memberId}`),
        fetch(`/api/member-payments/${memberId}`),
        fetch(`/api/member-notifications/${memberId}`)
      ]);

      const memberData = await memberRes.json();
      const classesData = await classesRes.json();
      const paymentsData = await paymentsRes.json();
      const notificationsData = await notificationsRes.json();

      setMember(memberData.member);
      setClasses(classesData.classes || []);
      setPayments(paymentsData.payments || []);
      setNotifications(notificationsData.notifications || []);
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
      name: member.name,
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

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <div style={{ background: 'white', padding: '1rem', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ margin: 0, color: '#333' }}>Member Dashboard</h1>
          <button onClick={logout} style={{ padding: '0.5rem 1rem', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ display: 'flex', marginBottom: '2rem', borderBottom: '1px solid #ddd' }}>
          {['profile', 'classes', 'payments', 'notifications'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '1rem 2rem',
                background: activeTab === tab ? '#007bff' : 'transparent',
                color: activeTab === tab ? 'white' : '#333',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #007bff' : '2px solid transparent',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'profile' && member && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ margin: 0, color: '#333' }}>Profile Information</h2>
              {!editing ? (
                <button onClick={startEdit} style={{ padding: '0.5rem 1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                  Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={saveProfile} style={{ padding: '0.5rem 1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Save
                  </button>
                  <button onClick={cancelEdit} style={{ padding: '0.5rem 1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
            
            {!editing ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <div><strong>Member ID:</strong> {member.memberId}</div>
                <div><strong>Name:</strong> {member.name}</div>
                <div><strong>Email:</strong> {member.email}</div>
                <div><strong>Phone:</strong> {member.phone}</div>
                <div><strong>Age:</strong> {member.age}</div>
                <div><strong>Gender:</strong> {member.gender}</div>
                <div><strong>Address:</strong> {member.address}</div>
                <div><strong>Emergency Contact:</strong> {member.emergencyContact}</div>
                <div><strong>Medical Conditions:</strong> {member.medicalConditions || 'None'}</div>
                <div><strong>Join Date:</strong> {new Date(member.joinDate).toLocaleDateString()}</div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                <div><strong>Member ID:</strong> {member.memberId}</div>
                <div>
                  <strong>Name:</strong><br/>
                  <input
                    type="text"
                    value={editData.name}
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.25rem' }}
                  />
                </div>
                <div>
                  <strong>Email:</strong><br/>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.25rem' }}
                  />
                </div>
                <div>
                  <strong>Phone:</strong><br/>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.25rem' }}
                  />
                </div>
                <div><strong>Age:</strong> {member.age}</div>
                <div><strong>Gender:</strong> {member.gender}</div>
                <div>
                  <strong>Address:</strong><br/>
                  <textarea
                    value={editData.address}
                    onChange={(e) => setEditData({...editData, address: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.25rem', height: '60px' }}
                  />
                </div>
                <div>
                  <strong>Emergency Contact:</strong><br/>
                  <input
                    type="tel"
                    value={editData.emergencyContact}
                    onChange={(e) => setEditData({...editData, emergencyContact: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.25rem' }}
                  />
                </div>
                <div>
                  <strong>Medical Conditions:</strong><br/>
                  <textarea
                    value={editData.medicalConditions}
                    onChange={(e) => setEditData({...editData, medicalConditions: e.target.value})}
                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px', marginTop: '0.25rem', height: '60px' }}
                    placeholder="None"
                  />
                </div>
                <div><strong>Join Date:</strong> {new Date(member.joinDate).toLocaleDateString()}</div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'classes' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>My Classes</h2>
            {classes.length === 0 ? (
              <p>No classes assigned yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {classes.map(cls => (
                  <div key={cls._id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '4px' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: '#007bff' }}>{cls.name}</h3>
                    <p><strong>Time:</strong> {cls.time}</p>
                    <p><strong>Duration:</strong> {cls.duration}</p>
                    <p><strong>Instructor:</strong> {cls.instructor}</p>
                    <p><strong>Type:</strong> {cls.type}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Payment History</h2>
            {payments.length === 0 ? (
              <p>No payment records found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8f9fa' }}>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Amount</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Type</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Month</th>
                      <th style={{ padding: '0.75rem', border: '1px solid #ddd', textAlign: 'left' }}>Class</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(payment => (
                      <tr key={payment._id}>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>₹{payment.amount}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{payment.paymentType}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{payment.paymentMonth}</td>
                        <td style={{ padding: '0.75rem', border: '1px solid #ddd' }}>{payment.className}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notifications' && (
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Class Notifications</h2>
            {notifications.length === 0 ? (
              <p>No notifications yet.</p>
            ) : (
              <div style={{ display: 'grid', gap: '1rem' }}>
                {notifications.map(notification => (
                  <div key={notification._id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', background: '#f8f9fa' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, color: '#007bff' }}>{notification.title}</h4>
                      <span style={{ fontSize: '12px', color: '#666' }}>
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ margin: '0.5rem 0', color: '#333' }}>{notification.message}</p>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      <strong>Class:</strong> {notification.className}
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