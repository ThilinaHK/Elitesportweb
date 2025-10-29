import { useState, useEffect } from 'react'

export default function EventsSection() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data.slice(0, 3)) // Show only 3 upcoming events
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      crossfit: '#f36100',
      karate: '#2196f3',
      zumba: '#9c27b0',
      competition: '#ff5722',
      workshop: '#4caf50',
      general: '#6c757d'
    }
    return colors[category] || '#6c757d'
  }

  const getCategoryIcon = (category) => {
    const icons = {
      crossfit: 'fas fa-dumbbell',
      karate: 'fas fa-fist-raised',
      zumba: 'fas fa-music',
      competition: 'fas fa-trophy',
      workshop: 'fas fa-tools',
      general: 'fas fa-calendar'
    }
    return icons[category] || 'fas fa-calendar'
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="row g-4">
      {events.length > 0 ? events.map((event) => (
        <div key={event._id} className="col-lg-4 col-md-6">
          <div className="card h-100 border-0 shadow-sm">
            {event.image && (
              <img src={event.image} className="card-img-top" alt={event.title} style={{height: '200px', objectFit: 'cover'}} />
            )}
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <span className="badge text-white" style={{backgroundColor: getCategoryColor(event.category)}}>
                  <i className={`${getCategoryIcon(event.category)} me-1`}></i>
                  {event.category.toUpperCase()}
                </span>
                <span className={`badge ${event.status === 'active' ? 'bg-success' : 'bg-secondary'}`}>
                  {event.status.toUpperCase()}
                </span>
              </div>
              <h5 className="card-title">{event.title}</h5>
              <p className="card-text text-muted small">{event.description}</p>
              <div className="mb-2">
                <small className="text-muted">
                  <i className="fas fa-calendar me-1"></i>
                  {new Date(event.date).toLocaleDateString()} at {event.time}
                </small>
              </div>
              <div className="mb-2">
                <small className="text-muted">
                  <i className="fas fa-map-marker-alt me-1"></i>
                  {event.location}
                </small>
              </div>
              <div className="mb-3">
                <small className="text-muted">
                  <i className="fas fa-users me-1"></i>
                  {event.currentParticipants}/{event.maxParticipants} participants
                </small>
              </div>
              {event.price > 0 && (
                <div className="mb-3">
                  <span className="badge bg-warning text-dark">
                    LKR {event.price}
                  </span>
                </div>
              )}
              {event.forms && event.forms.length > 0 && (
                <div className="mb-3">
                  <small className="text-muted">
                    <i className="fas fa-clipboard-list me-1"></i>
                    {event.forms.length} registration fields
                  </small>
                </div>
              )}
            </div>
            <div className="card-footer bg-transparent">
              <button 
                className="btn btn-primary w-100" 
                style={{backgroundColor: getCategoryColor(event.category), borderColor: getCategoryColor(event.category)}}
                onClick={() => handleRegister(event)}
                disabled={event.currentParticipants >= event.maxParticipants}
              >
                <i className="fas fa-ticket-alt me-2"></i>
                {event.currentParticipants >= event.maxParticipants ? 'Event Full' : 'Register Now'}
              </button>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-12 text-center py-5">
          <i className="fas fa-calendar-times fa-3x text-muted mb-3"></i>
          <p className="text-muted">No upcoming events at the moment.</p>
        </div>
      )}
      
      {/* Registration Modal */}
      {showModal && selectedEvent && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Register for {selectedEvent.title}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p><strong>Date:</strong> {new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}</p>
                  <p><strong>Location:</strong> {selectedEvent.location}</p>
                  {selectedEvent.price > 0 && <p><strong>Price:</strong> LKR {selectedEvent.price}</p>}
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Are you a member? <span className="text-danger">*</span></label>
                    <select 
                      className="form-select" 
                      required
                      onChange={(e) => setFormData({...formData, isMember: e.target.value})}
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
                      required
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                    <input
                      type="tel"
                      className="form-control"
                      required
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
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
                          onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
                        />
                      )}
                      {field.type === 'email' && (
                        <input
                          type="email"
                          className="form-control"
                          required={field.required}
                          onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
                        />
                      )}
                      {field.type === 'tel' && (
                        <input
                          type="tel"
                          className="form-control"
                          required={field.required}
                          onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
                        />
                      )}
                      {field.type === 'number' && (
                        <input
                          type="number"
                          className="form-control"
                          required={field.required}
                          onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
                        />
                      )}
                      {field.type === 'select' && (
                        <select
                          className="form-select"
                          required={field.required}
                          onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
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
                          onChange={(e) => setFormData({...formData, [field.label]: e.target.value})}
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
    </div>
  )

  function handleRegister(event) {
    setSelectedEvent(event)
    setFormData({})
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    
    try {
      const response = await fetch(`/api/events/${selectedEvent._id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        alert('Registration successful!')
        setShowModal(false)
        fetchEvents()
      } else {
        const error = await response.json()
        alert(error.message || 'Registration failed. Please try again.')
      }
    } catch (error) {
      alert('Registration failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }


}