import Head from 'next/head'
import { useState, useEffect } from 'react'
import Toast from '../components/Toast'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [loading, setLoading] = useState(true)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState(null)
  const [bookingForm, setBookingForm] = useState({
    memberName: '',
    memberEmail: '',
    memberPhone: ''
  })
  const [toast, setToast] = useState({ show: false, message: '', type: '' })

  useEffect(() => {
    fetchClasses()
    fetchInstructors()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/instructors')
      const data = await response.json()
      setInstructors(data)
    } catch (error) {
      console.error('Error fetching instructors:', error)
    }
  }

  const getInstructorInfo = (instructorName) => {
    return instructors.find(inst => inst.name === instructorName)
  }

  const handleBookNow = (cls, day) => {
    setSelectedClass({ ...cls, day })
    setShowBookingModal(true)
  }

  const handleBookingSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...bookingForm,
          classId: selectedClass._id,
          className: selectedClass.name,
          classTime: selectedClass.time,
          classDay: selectedClass.day
        })
      })
      if (response.ok) {
        setToast({ show: true, message: 'Booking request submitted! Admin will confirm your booking.', type: 'success' })
        setShowBookingModal(false)
        setBookingForm({ memberName: '', memberEmail: '', memberPhone: '' })
      } else {
        setToast({ show: true, message: 'Booking failed. Please try again.', type: 'error' })
      }
    } catch (error) {
      setToast({ show: true, message: 'Booking failed. Please try again.', type: 'error' })
    }
  }

  const filteredClasses = selectedCategory === 'all' 
    ? classes 
    : classes.filter(cls => cls.category === selectedCategory)

  const groupedClasses = filteredClasses.reduce((acc, cls) => {
    if (!acc[cls.day]) acc[cls.day] = []
    acc[cls.day].push(cls)
    return acc
  }, {})

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <>
      <Head>
        <title>Classes - Elite Sports Academy</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <style jsx global>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Poppins', sans-serif; line-height: 1.6; color: #333; }
          .btn-primary-custom { background: linear-gradient(45deg, #f36100, #ff8c42); border: none; padding: 12px 25px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-radius: 25px; color: white; cursor: pointer; transition: all 0.3s; }
          .btn-primary-custom:hover { background: linear-gradient(45deg, #e55100, #f36100); transform: translateY(-2px); }
          .card-hover { transition: all 0.3s ease; }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 15px 35px rgba(0,0,0,0.1); }
        `}</style>
      </Head>

      {/* Header */}
      <header style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, boxShadow: '0 2px 20px rgba(0,0,0,0.1)'}}>
        <div className="container">
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0'}}>
            <div style={{display: 'flex', alignItems: 'center'}}>
              <img src="/img/eliet_logo.jpg" width="60" height="60" alt="Elite Sports Academy" style={{borderRadius: '50%', marginRight: '15px'}} />
              <div>
                <h3 style={{margin: 0, color: '#333', fontSize: '24px', fontWeight: '700'}}>Elite Sports</h3>
                <p style={{margin: 0, color: '#666', fontSize: '14px'}}>Academy</p>
              </div>
            </div>
            <nav style={{display: 'flex', alignItems: 'center', gap: '30px'}}>
              <a href="/" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px', transition: 'color 0.3s'}}>Home</a>
              <a href="/posts" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px', transition: 'color 0.3s'}}>Videos</a>
              <a href="/login" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px', transition: 'color 0.3s'}}>Member Login</a>
              <a href="/instructor-login" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px', transition: 'color 0.3s'}}>Instructor</a>
              <a href="/admin-login" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px', transition: 'color 0.3s'}}>Admin</a>
              <div style={{display: 'flex', alignItems: 'center', color: '#f36100', fontWeight: '600'}}>
                <i className="fas fa-phone" style={{marginRight: '8px'}}></i>
                <span>(+94) 77 109 5334</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Classes Hero */}
      <div style={{background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(243,97,0,0.8)), url(/img/classes-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', padding: '150px 0 100px', color: 'white', textAlign: 'center', marginTop: '90px'}}>
        <div className="container">
          <h1 style={{fontSize: '4rem', fontWeight: '800', marginBottom: '20px'}}>Our Classes</h1>
          <p style={{fontSize: '1.3rem', opacity: '0.9', maxWidth: '600px', margin: '0 auto'}}>Transform your body and mind with our expert-led fitness programs</p>
        </div>
      </div>

      {/* Filter Section */}
      <section style={{padding: '80px 0', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="container">
          <div className="text-center" style={{marginBottom: '60px'}}>
            <h2 style={{fontSize: '2.5rem', fontWeight: '700', marginBottom: '20px', color: '#333'}}>Choose Your Program</h2>
            <p style={{fontSize: '1.1rem', color: '#666', marginBottom: '40px'}}>Filter classes by category to find your perfect workout</p>
            <div style={{display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap'}}>
              <button 
                onClick={() => setSelectedCategory('all')}
                className={selectedCategory === 'all' ? 'btn-primary-custom' : ''}
                style={{
                  backgroundColor: selectedCategory === 'all' ? '' : 'white',
                  color: selectedCategory === 'all' ? '' : '#333',
                  border: selectedCategory === 'all' ? 'none' : '2px solid #f36100',
                  padding: '12px 25px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.3s'
                }}
              >
                <i className="fas fa-th-large" style={{marginRight: '8px'}}></i>
                All Classes ({classes.length})
              </button>
              <button 
                onClick={() => setSelectedCategory('crossfit')}
                className={selectedCategory === 'crossfit' ? 'btn-primary-custom' : ''}
                style={{
                  backgroundColor: selectedCategory === 'crossfit' ? '' : 'white',
                  color: selectedCategory === 'crossfit' ? '' : '#333',
                  border: selectedCategory === 'crossfit' ? 'none' : '2px solid #f36100',
                  padding: '12px 25px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.3s'
                }}
              >
                <i className="fas fa-dumbbell" style={{marginRight: '8px'}}></i>
                CrossFit ({classes.filter(c => c.category === 'crossfit').length})
              </button>
              <button 
                onClick={() => setSelectedCategory('karate')}
                className={selectedCategory === 'karate' ? 'btn-primary-custom' : ''}
                style={{
                  backgroundColor: selectedCategory === 'karate' ? '' : 'white',
                  color: selectedCategory === 'karate' ? '' : '#333',
                  border: selectedCategory === 'karate' ? 'none' : '2px solid #f36100',
                  padding: '12px 25px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.3s'
                }}
              >
                <i className="fas fa-fist-raised" style={{marginRight: '8px'}}></i>
                Karate ({classes.filter(c => c.category === 'karate').length})
              </button>
              <button 
                onClick={() => setSelectedCategory('zumba')}
                className={selectedCategory === 'zumba' ? 'btn-primary-custom' : ''}
                style={{
                  backgroundColor: selectedCategory === 'zumba' ? '' : 'white',
                  color: selectedCategory === 'zumba' ? '' : '#333',
                  border: selectedCategory === 'zumba' ? 'none' : '2px solid #f36100',
                  padding: '12px 25px',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  transition: 'all 0.3s'
                }}
              >
                <i className="fas fa-music" style={{marginRight: '8px'}}></i>
                Zumba ({classes.filter(c => c.category === 'zumba').length})
              </button>
            </div>
          </div>

          {loading ? (
            <div style={{textAlign: 'center', padding: '60px 0'}}>
              <div className="spinner-border" role="status" style={{width: '3rem', height: '3rem', color: '#f36100'}}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3" style={{color: '#666', fontSize: '1.1rem'}}>Loading classes...</p>
            </div>
          ) : (
            <div className="row">
              {days.map(day => {
                const dayClasses = groupedClasses[day]
                return (
                  <div key={day} className="col-lg-12 mb-4">
                    <div className="card-hover" style={{background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 5px 20px rgba(0,0,0,0.08)'}}>
                      <div style={{background: 'linear-gradient(45deg, #f36100, #ff8c42)', padding: '20px', color: 'white'}}>
                        <h3 style={{margin: 0, fontSize: '1.5rem', fontWeight: '700', display: 'flex', alignItems: 'center'}}>
                          <i className="fas fa-calendar-day" style={{marginRight: '10px'}}></i>
                          {day}
                          {dayClasses && <span style={{marginLeft: '15px', fontSize: '0.9rem', opacity: '0.8'}}>({dayClasses.length} classes)</span>}
                        </h3>
                      </div>
                      <div style={{padding: '0'}}>
                        {dayClasses ? (
                          dayClasses.map((cls, index) => (
                            <div key={cls._id} style={{
                              padding: '25px',
                              borderBottom: index < dayClasses.length - 1 ? '1px solid #f0f0f0' : 'none',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'background 0.3s'
                            }}>
                              <div style={{flex: 1}}>
                                <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                                  <h5 style={{margin: 0, color: '#333', fontSize: '1.3rem', fontWeight: '600'}}>{cls.name}</h5>
                                  <div style={{
                                    backgroundColor: cls.category === 'crossfit' ? '#ff5722' : cls.category === 'karate' ? '#2196f3' : '#9c27b0',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '15px',
                                    fontSize: '11px',
                                    textTransform: 'uppercase',
                                    fontWeight: '600',
                                    marginLeft: '15px'
                                  }}>
                                    {cls.category}
                                  </div>
                                  {cls.isOnline && (
                                    <span style={{
                                      backgroundColor: '#e3f2fd',
                                      color: '#1976d2',
                                      padding: '4px 10px',
                                      borderRadius: '12px',
                                      fontSize: '11px',
                                      fontWeight: '600',
                                      marginLeft: '10px'
                                    }}>
                                      <i className="fas fa-video" style={{marginRight: '5px'}}></i>
                                      Online
                                    </span>
                                  )}
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '8px', color: '#666'}}>
                                  <span><i className="fas fa-user" style={{marginRight: '5px', color: '#f36100'}}></i><strong>Instructor:</strong> {cls.instructor}</span>
                                  <span><i className="fas fa-clock" style={{marginRight: '5px', color: '#f36100'}}></i><strong>Duration:</strong> {cls.duration} mins</span>
                                  <span><i className="fas fa-users" style={{marginRight: '5px', color: '#f36100'}}></i><strong>Capacity:</strong> {cls.capacity}</span>
                                </div>
                                <div style={{display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '8px', fontSize: '13px'}}>
                                  <span style={{color: '#f36100', fontWeight: '600'}}><i className="fas fa-money-bill" style={{marginRight: '5px'}}></i>Admission: LKR {cls.admissionFee || 0}</span>
                                  <span style={{color: '#666'}}><i className="fas fa-calendar" style={{marginRight: '5px'}}></i>Monthly: LKR {cls.fees?.monthly || 0}</span>
                                </div>
                                {(() => {
                                  const instructor = getInstructorInfo(cls.instructor)
                                  return instructor && (
                                    <div style={{marginBottom: '8px'}}>
                                      <div style={{fontSize: '12px', color: '#666', marginBottom: '4px'}}>
                                        <i className="fas fa-medal" style={{marginRight: '5px', color: '#f36100'}}></i>
                                        <strong>Experience:</strong> {instructor.experience} years
                                      </div>
                                      <div style={{fontSize: '11px', color: '#888'}}>
                                        <strong>Qualifications:</strong> {instructor.qualifications.slice(0, 2).join(', ')}
                                        {instructor.qualifications.length > 2 && ` +${instructor.qualifications.length - 2} more`}
                                      </div>
                                    </div>
                                  )
                                })()}
                                {cls.description && (
                                  <p style={{margin: '8px 0 0 0', fontSize: '14px', color: '#666', lineHeight: '1.5'}}>{cls.description}</p>
                                )}
                              </div>
                              <div style={{textAlign: 'center', marginLeft: '20px'}}>
                                <div style={{fontSize: '2rem', fontWeight: '800', color: '#f36100', marginBottom: '5px'}}>
                                  {cls.time}
                                </div>
                                <button 
                                  className="btn-primary-custom" 
                                  style={{fontSize: '12px', padding: '8px 16px'}}
                                  onClick={() => handleBookNow(cls, day)}
                                >
                                  Book Now
                                </button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div style={{padding: '40px', textAlign: 'center', color: '#999'}}>
                            <i className="fas fa-calendar-times" style={{fontSize: '2rem', marginBottom: '15px', opacity: '0.5'}}></i>
                            <p style={{margin: 0, fontSize: '1.1rem'}}>No classes scheduled for {day}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer style={{background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)', color: 'white', padding: '60px 0 30px'}}>
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                <img src="/img/eliet_logo.jpg" width="50" height="50" alt="Elite Sports Academy" style={{borderRadius: '50%', marginRight: '15px'}} />
                <div>
                  <h4 style={{margin: 0, fontWeight: '700'}}>Elite Sports Academy</h4>
                  <p style={{margin: 0, fontSize: '14px', opacity: '0.7'}}>Transform Your Limits</p>
                </div>
              </div>
              <p style={{opacity: '0.8', lineHeight: '1.6'}}>Your premier destination for CrossFit, Karate, and Zumba training.</p>
            </div>
            <div className="col-lg-4 col-md-6 mb-4">
              <h5 style={{fontWeight: '600', marginBottom: '20px', color: '#f36100'}}>Quick Links</h5>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '10px'}}><a href="/" style={{color: 'white', textDecoration: 'none', opacity: '0.8'}}>← Back to Home</a></li>
                <li style={{marginBottom: '10px'}}><a href="/admin" style={{color: 'white', textDecoration: 'none', opacity: '0.8'}}>Admin Panel</a></li>
              </ul>
            </div>
            <div className="col-lg-4 mb-4">
              <h5 style={{fontWeight: '600', marginBottom: '20px', color: '#f36100'}}>Contact Info</h5>
              <div style={{display: 'flex', alignItems: 'center', marginBottom: '10px'}}>
                <i className="fas fa-phone" style={{color: '#f36100', marginRight: '10px'}}></i>
                <span style={{opacity: '0.8'}}>(+94) 77 109 5334</span>
              </div>
            </div>
          </div>
          <hr style={{border: 'none', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '30px 0 20px'}} />
          <div className="text-center">
            <p style={{margin: 0, opacity: '0.6'}}>Copyright © 2024 Elite Sports Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Booking Modal */}
      {showBookingModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '15px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, color: '#333' }}>Book Class</h3>
              <button 
                onClick={() => setShowBookingModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#666' }}
              >
                ×
              </button>
            </div>
            {selectedClass && (
              <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                <h5 style={{ color: '#f36100', margin: '0 0 10px 0' }}>{selectedClass.name}</h5>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                  <strong>Day:</strong> {selectedClass.day} | <strong>Time:</strong> {selectedClass.time} | <strong>Duration:</strong> {selectedClass.duration} mins
                </p>
                <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                  <strong>Instructor:</strong> {selectedClass.instructor} | <strong>Capacity:</strong> {selectedClass.capacity}
                </p>
              </div>
            )}
            <form onSubmit={handleBookingSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Full Name *</label>
                <input 
                  type="text" 
                  placeholder="Enter your full name" 
                  value={bookingForm.memberName}
                  onChange={(e) => setBookingForm({...bookingForm, memberName: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Email Address *</label>
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  value={bookingForm.memberEmail}
                  onChange={(e) => setBookingForm({...bookingForm, memberEmail: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600', color: '#333' }}>Phone Number *</label>
                <input 
                  type="tel" 
                  placeholder="Enter your phone number" 
                  value={bookingForm.memberPhone}
                  onChange={(e) => setBookingForm({...bookingForm, memberPhone: e.target.value})}
                  required
                  style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  type="submit"
                  className="btn-primary-custom"
                  style={{ flex: 1, padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                >
                  Submit Booking Request
                </button>
                <button 
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  style={{ 
                    flex: 1, 
                    padding: '12px', 
                    backgroundColor: '#6c757d', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '8px', 
                    cursor: 'pointer' 
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast 
        message={toast.message}
        type={toast.type}
        show={toast.show}
        onClose={() => setToast({ show: false, message: '', type: '' })}
      />
    </>
  )
}