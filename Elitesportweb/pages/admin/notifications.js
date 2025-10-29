import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Toast, { showToast } from '../../components/Toast'

export default function NotificationManagement() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingNotification, setEditingNotification] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    className: '',
    type: 'general',
    scheduledDate: '',
    scheduledTime: ''
  })
  const router = useRouter()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const notificationData = { ...formData }
      
      // If scheduled, combine date and time
      if (formData.scheduledDate && formData.scheduledTime) {
        notificationData.scheduledDate = new Date(`${formData.scheduledDate}T${formData.scheduledTime}`)
        notificationData.isSent = false
      } else {
        notificationData.isSent = true
        notificationData.scheduledDate = null
      }

      const url = editingNotification ? `/api/notifications/${editingNotification._id}` : '/api/notifications'
      const method = editingNotification ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notificationData)
      })

      if (response.ok) {
        const message = formData.scheduledDate ? 'scheduled' : (editingNotification ? 'updated' : 'sent')
        showToast(`Notification ${message} successfully`, 'success')
        setShowModal(false)
        resetForm()
        fetchNotifications()
      }
    } catch (error) {
      showToast('Error saving notification', 'error')
    }
  }

  const handleEdit = (notification) => {
    setEditingNotification(notification)
    const scheduledDate = notification.scheduledDate ? new Date(notification.scheduledDate).toISOString().split('T')[0] : ''
    const scheduledTime = notification.scheduledTime || ''
    setFormData({
      title: notification.title,
      message: notification.message,
      className: notification.className,
      type: notification.type || 'general',
      scheduledDate,
      scheduledTime
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      try {
        await fetch(`/api/notifications/${id}`, { method: 'DELETE' })
        showToast('Notification deleted successfully', 'success')
        fetchNotifications()
      } catch (error) {
        showToast('Error deleting notification', 'error')
      }
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      className: '',
      type: 'general',
      scheduledDate: '',
      scheduledTime: ''
    })
    setEditingNotification(null)
  }

  const generatePaymentReminders = async () => {
    if (confirm('Generate payment reminders for all overdue members?')) {
      try {
        const response = await fetch('/api/notifications/generate-payment-reminders', {
          method: 'POST'
        })
        const data = await response.json()
        showToast(data.message, 'success')
        fetchNotifications()
      } catch (error) {
        showToast('Error generating payment reminders', 'error')
      }
    }
  }

  return (
    <>
      <Head>
        <title>Notification Management - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>

      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2><i className="fas fa-bell me-2"></i>Class Notifications</h2>
          <div>
            <button className="btn btn-primary me-2" onClick={() => setShowModal(true)}>
              <i className="fas fa-plus me-2"></i>Add Notification
            </button>
            <button className="btn btn-warning me-2" onClick={generatePaymentReminders}>
              <i className="fas fa-credit-card me-2"></i>Payment Reminders
            </button>
            <button className="btn btn-secondary" onClick={() => router.push('/admin')}>
              <i className="fas fa-arrow-left me-2"></i>Back
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            {notifications.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Title</th>
                      <th>Message</th>
                      <th>Class</th>
                      <th>Type</th>
                      <th>Created</th>
                      <th>Scheduled</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notifications.map(notification => (
                      <tr key={notification._id}>
                        <td>{notification.title}</td>
                        <td>{notification.message.substring(0, 50)}...</td>
                        <td>{notification.className}</td>
                        <td>
                          <span className={`badge ${notification.type === 'urgent' ? 'bg-danger' : notification.type === 'important' ? 'bg-warning' : 'bg-info'}`}>
                            {notification.type}
                          </span>
                        </td>
                        <td>{new Date(notification.createdAt).toLocaleDateString()}</td>
                        <td>
                          {notification.scheduledDate && !notification.isSent ? (
                            <span className="badge bg-warning text-dark">
                              {new Date(notification.scheduledDate).toLocaleDateString()} {new Date(notification.scheduledDate).toLocaleTimeString()}
                            </span>
                          ) : (
                            <span className="badge bg-success">Sent</span>
                          )}
                        </td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(notification)}>
                            <i className="fas fa-edit"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(notification._id)}>
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
                <i className="fas fa-bell-slash fa-3x text-muted mb-3"></i>
                <p className="text-muted">No notifications found.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{editingNotification ? 'Edit Notification' : 'Add New Notification'}</h5>
                  <button className="btn-close" onClick={() => { setShowModal(false); resetForm(); }}></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Title</label>
                      <input type="text" className="form-control" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Message</label>
                      <textarea className="form-control" rows="3" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} required></textarea>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Class Name</label>
                      <input type="text" className="form-control" value={formData.className} onChange={(e) => setFormData({...formData, className: e.target.value})} required />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Type</label>
                      <select className="form-select" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                        <option value="general">General</option>
                        <option value="important">Important</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Schedule Date (Optional)</label>
                          <input type="date" className="form-control" value={formData.scheduledDate} onChange={(e) => setFormData({...formData, scheduledDate: e.target.value})} />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Schedule Time (Optional)</label>
                          <input type="time" className="form-control" value={formData.scheduledTime} onChange={(e) => setFormData({...formData, scheduledTime: e.target.value})} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancel</button>
                    <button type="submit" className="btn btn-primary">{editingNotification ? 'Update' : 'Create'} Notification</button>
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