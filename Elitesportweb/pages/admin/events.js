import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Toast, { showToast } from '../../components/Toast'

export default function EventManagement() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [showParticipants, setShowParticipants] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [participants, setParticipants] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingParticipant, setEditingParticipant] = useState(null)
  const [editingIndex, setEditingIndex] = useState(null)
  const [editFormData, setEditFormData] = useState({})
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'general',
    maxParticipants: 50,
    price: 0,
    instructor: '',
    requirements: '',
    image: '',
    forms: []
  })
  const router = useRouter()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      const data = await response.json()
      setEvents(data)
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const eventData = {
        ...formData,
        requirements: formData.requirements.split(',').map(r => r.trim()).filter(r => r),
        forms: formData.forms || []
      }

      const url = editingEvent ? `/api/events/${editingEvent._id}` : '/api/events'
      const method = editingEvent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      })

      if (response.ok) {
        showToast(`Event ${editingEvent ? 'updated' : 'created'} successfully`, 'success')
        setShowModal(false)
        resetForm()
        fetchEvents()
      }
    } catch (error) {
      showToast('Error saving event', 'error')
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setFormData({
      ...event,
      date: new Date(event.date).toISOString().split('T')[0],
      requirements: event.requirements?.join(', ') || '',
      forms: event.forms || []
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await fetch(`/api/events/${id}`, { method: 'DELETE' })
        showToast('Event deleted successfully', 'success')
        fetchEvents()
      } catch (error) {
        showToast('Error deleting event', 'error')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'general',
      maxParticipants: 50,
      price: 0,
      instructor: '',
      requirements: '',
      image: '',
      forms: []
    })
    setEditingEvent(null)
  }

  const addForm = () => {
    setFormData({
      ...formData,
      forms: [...formData.forms, { label: '', type: 'text', required: false, options: [] }]
    })
  }

  const updateForm = (index, field, value) => {
    const updatedForms = [...formData.forms]
    updatedForms[index][field] = value
    setFormData({ ...formData, forms: updatedForms })
  }

  const removeForm = (index) => {
    setFormData({
      ...formData,
      forms: formData.forms.filter((_, i) => i !== index)
    })
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

  const viewParticipants = async (event) => {
    try {
      const response = await fetch(`/api/events/${event._id}/participants`)
      const data = await response.json()
      setParticipants(data.participants || [])
      setSelectedEvent(event)
      setShowParticipants(true)
    } catch (error) {
      showToast('Error fetching participants', 'error')
    }
  }

  const exportToPDF = () => {
    const printContent = document.getElementById('participantsList').innerHTML
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <html><head><title>Event Participants</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #000; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
      </head><body>${printContent}</body></html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const exportToExcel = () => {
    const csvContent = [
      ['#', 'Full Name', 'Phone Number', 'Member Status', 'Registration Date', 'Status'],
      ...participants.map((p, i) => [
        i + 1,
        p.memberName,
        p.phoneNumber,
        p.isMember === 'yes' ? 'Member' : 'Non-Member',
        new Date(p.registrationDate).toLocaleDateString(),
        'Registered'
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedEvent.title}_participants.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const deleteParticipant = async (index, phoneNumber) => {
    if (confirm('Are you sure you want to remove this participant?')) {
      try {
        const response = await fetch(`/api/events/${selectedEvent._id}/participants/${phoneNumber}`, {
          method: 'DELETE'
        })
        if (response.ok) {
          const updatedParticipants = participants.filter((_, i) => i !== index)
          setParticipants(updatedParticipants)
          showToast('Participant removed successfully', 'success')
          fetchEvents()
        }
      } catch (error) {
        showToast('Error removing participant', 'error')
      }
    }
  }

  const editParticipant = (index, participant) => {
    setEditingParticipant(participant)
    setEditingIndex(index)
    setEditFormData({
      memberName: participant.memberName,
      phoneNumber: participant.phoneNumber,
      isMember: participant.isMember || 'no'
    })
    setShowEditModal(true)
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    updateParticipant(editingIndex, {
      ...editFormData,
      registrationDate: editingParticipant.registrationDate
    })
    setShowEditModal(false)
  }

  const updateParticipant = async (index, updatedParticipant) => {
    try {
      const response = await fetch(`/api/events/${selectedEvent._id}/participants/${participants[index].phoneNumber}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedParticipant)
      })
      if (response.ok) {
        const updatedParticipants = [...participants]
        updatedParticipants[index] = updatedParticipant
        setParticipants(updatedParticipants)
        showToast('Participant updated successfully', 'success')
        fetchEvents()
      }
    } catch (error) {
      showToast('Error updating participant', 'error')
    }
  }

  return (
    <>
      <Head>
        <title>Event Management - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        <style>
          {`@media print {
            body * { visibility: hidden; }
            #participantsList, #participantsList * { visibility: visible; }
            #participantsList { position: absolute; left: 0; top: 0; width: 100%; padding: 20px; }
            .modal { position: static !important; }
            .modal-dialog { margin: 0 !important; max-width: none !important; width: 100% !important; }
            .modal-content { border: none !important; box-shadow: none !important; }
            .modal-header, .modal-footer { display: none !important; }
            .table { border-collapse: collapse !important; width: 100% !important; }
            .table th, .table td { border: 1px solid #000 !important; padding: 8px !important; }
            .badge { background-color: #28a745 !important; color: white !important; -webkit-print-color-adjust: exact; }
            h4, p { color: #000 !important; }
          }`}
        </style>
      </Head>

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2><i className="fas fa-calendar-alt me-2"></i>Event Management</h2>
          <div>
            <button className="btn btn-primary me-2" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus me-2"></i>Add Event
            </button>
            <button className="btn btn-secondary" onClick={() => window.close() || router.push('/admin')}>
              <i className="fas fa-arrow-left me-2"></i>Back
            </button>
          </div>
        </div>

        <div className="row g-4">
          {events.map(event => (
            <div key={event._id} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm">
                {event.image && (
                  <img src={event.image} className="card-img-top" alt={event.title} style={{height: '200px', objectFit: 'cover'}} />
                )}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <span className="badge text-white" style={{backgroundColor: getCategoryColor(event.category)}}>
                      {event.category.toUpperCase()}
                    </span>
                    <span className={`badge ${event.status === 'active' ? 'bg-success' : event.status === 'cancelled' ? 'bg-danger' : 'bg-secondary'}`}>
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
                </div>
                <div className="card-footer bg-transparent">
                  <div className="btn-group w-100">
                    <button className="btn btn-info btn-sm" onClick={() => viewParticipants(event)} title="View Participants">
                      <i className="fas fa-users me-1"></i>Participants
                    </button>
                    <button className="btn btn-primary btn-sm" onClick={() => handleEdit(event)} title="Edit Event">
                      <i className="fas fa-edit me-1"></i>Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(event._id)} title="Delete Event">
                      <i className="fas fa-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingEvent ? 'Edit Event' : 'Add New Event'}</h5>
                  <button className="btn-close" onClick={() => { setShowModal(false); resetForm(); }}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label">Title</label>
                        <input type="text" className="form-control" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Category</label>
                        <select className="form-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                          <option value="general">General</option>
                          <option value="crossfit">CrossFit</option>
                          <option value="karate">Karate</option>
                          <option value="zumba">Zumba</option>
                          <option value="competition">Competition</option>
                          <option value="workshop">Workshop</option>
                        </select>
                      </div>
                      <div className="col-12">
                        <label className="form-label">Description</label>
                        <textarea className="form-control" rows="3" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} required></textarea>
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Date</label>
                        <input type="date" className="form-control" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Time</label>
                        <input type="time" className="form-control" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Location</label>
                        <input type="text" className="form-control" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
                      </div>
                      <div className="col-md-6">
                        <label className="form-label">Instructor</label>
                        <input type="text" className="form-control" value={formData.instructor} onChange={(e) => setFormData({...formData, instructor: e.target.value})} required />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Max Participants</label>
                        <input type="number" className="form-control" value={formData.maxParticipants} onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Price (LKR)</label>
                        <input type="number" className="form-control" value={formData.price} onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})} />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Image URL</label>
                        <input type="url" className="form-control" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
                      </div>
                      <div className="col-12">
                        <label className="form-label">Requirements (comma separated)</label>
                        <input type="text" className="form-control" value={formData.requirements} onChange={(e) => setFormData({...formData, requirements: e.target.value})} placeholder="Bring water bottle, wear comfortable clothes" />
                      </div>
                      
                      <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <label className="form-label mb-0">Registration Forms</label>
                          <button type="button" className="btn btn-sm btn-outline-primary" onClick={addForm}>
                            <i className="fas fa-plus me-1"></i>Add Field
                          </button>
                        </div>
                        {formData.forms.map((form, index) => (
                          <div key={index} className="border rounded p-3 mb-3">
                            <div className="row g-2">
                              <div className="col-md-4">
                                <input 
                                  type="text" 
                                  className="form-control form-control-sm" 
                                  placeholder="Field Label" 
                                  value={form.label}
                                  onChange={(e) => updateForm(index, 'label', e.target.value)}
                                />
                              </div>
                              <div className="col-md-3">
                                <select 
                                  className="form-select form-select-sm" 
                                  value={form.type}
                                  onChange={(e) => updateForm(index, 'type', e.target.value)}
                                >
                                  <option value="text">Text</option>
                                  <option value="email">Email</option>
                                  <option value="tel">Phone</option>
                                  <option value="number">Number</option>
                                  <option value="select">Dropdown</option>
                                  <option value="textarea">Textarea</option>
                                </select>
                              </div>
                              <div className="col-md-2">
                                <div className="form-check">
                                  <input 
                                    className="form-check-input" 
                                    type="checkbox" 
                                    checked={form.required}
                                    onChange={(e) => updateForm(index, 'required', e.target.checked)}
                                  />
                                  <label className="form-check-label small">Required</label>
                                </div>
                              </div>
                              <div className="col-md-2">
                                <button 
                                  type="button" 
                                  className="btn btn-sm btn-outline-danger" 
                                  onClick={() => removeForm(index)}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </div>
                              {form.type === 'select' && (
                                <div className="col-12">
                                  <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    placeholder="Options (comma separated)" 
                                    value={form.options?.join(', ') || ''}
                                    onChange={(e) => updateForm(index, 'options', e.target.value.split(',').map(o => o.trim()))}
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{editingEvent ? 'Update' : 'Create'} Event</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Participants Modal */}
        {showParticipants && selectedEvent && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Event Participants</h5>
                  <button className="btn-close" onClick={() => setShowParticipants(false)}></button>
                </div>
                <div className="modal-body" id="participantsList">
                  <div className="text-center mb-4">
                    <h4>{selectedEvent.title}</h4>
                    <p className="text-muted mb-1">{new Date(selectedEvent.date).toLocaleDateString()} at {selectedEvent.time}</p>
                    <p className="text-muted">{selectedEvent.location}</p>
                    <hr/>
                  </div>
                  <div className="mb-3">
                    <strong>Total Participants: {participants.length}/{selectedEvent.maxParticipants}</strong>
                  </div>
                  {participants.length > 0 ? (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                        <thead className="table-dark">
                          <tr>
                            <th>#</th>
                            <th>Full Name</th>
                            <th>Phone Number</th>
                            <th>Member Status</th>
                            <th>Registration Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {participants.map((participant, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{participant.memberName}</td>
                              <td>{participant.phoneNumber}</td>
                              <td>
                                <span className={`badge ${participant.isMember === 'yes' ? 'bg-primary' : 'bg-secondary'}`}>
                                  {participant.isMember === 'yes' ? 'Member' : 'Non-Member'}
                                </span>
                              </td>
                              <td>{new Date(participant.registrationDate).toLocaleDateString()}</td>
                              <td>
                                <span className="badge bg-success">Registered</span>
                              </td>
                              <td>
                                <button className="btn btn-sm btn-outline-primary me-1" onClick={() => editParticipant(index, participant)}>
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-danger" onClick={() => deleteParticipant(index, participant.phoneNumber)}>
                                  <i className="fas fa-trash"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <i className="fas fa-users fa-3x text-muted mb-3"></i>
                      <p className="text-muted">No participants registered yet.</p>
                    </div>
                  )}
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowParticipants(false)}>Close</button>
                  {participants.length > 0 && (
                    <div className="btn-group">
                      <button className="btn btn-primary" onClick={() => window.print()}>
                        <i className="fas fa-print me-2"></i>Print
                      </button>
                      <button className="btn btn-success" onClick={() => exportToPDF()}>
                        <i className="fas fa-file-pdf me-2"></i>PDF
                      </button>
                      <button className="btn btn-info" onClick={() => exportToExcel()}>
                        <i className="fas fa-file-excel me-2"></i>Excel
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Participant Modal */}
        {showEditModal && editingParticipant && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit Participant</h5>
                  <button className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <form onSubmit={handleEditSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Full Name <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        className="form-control"
                        value={editFormData.memberName || ''}
                        onChange={(e) => setEditFormData({...editFormData, memberName: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Phone Number <span className="text-danger">*</span></label>
                      <input
                        type="tel"
                        className="form-control"
                        value={editFormData.phoneNumber || ''}
                        onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Member Status <span className="text-danger">*</span></label>
                      <select
                        className="form-select"
                        value={editFormData.isMember || 'no'}
                        onChange={(e) => setEditFormData({...editFormData, isMember: e.target.value})}
                        required
                      >
                        <option value="yes">Member</option>
                        <option value="no">Non-Member</option>
                      </select>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Update Participant</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
      <Toast />
    </>
  )
}