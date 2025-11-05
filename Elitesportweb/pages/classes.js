import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
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

  const getCategoryColor = (category) => {
    switch(category) {
      case 'crossfit': return '#f36100'
      case 'karate': return '#2196f3'
      case 'zumba': return '#9c27b0'
      default: return '#666'
    }
  }

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'crossfit': return 'fas fa-dumbbell'
      case 'karate': return 'fas fa-fist-raised'
      case 'zumba': return 'fas fa-music'
      default: return 'fas fa-star'
    }
  }

  return (
    <>
      <Head>
        <title>Classes - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
      </Head>

      <Navbar />

      <div style={{marginTop: '100px', minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="fw-bold mb-3" style={{fontSize: '3rem', color: '#333'}}>Our Classes</h1>
            <p className="text-muted fs-5">Choose from our professional fitness programs</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {classes.map((cls) => (
                <div key={cls._id} className="col-lg-4 col-md-6">
                  <div className="card h-100 border-0 shadow-sm">
                    <div className="card-body text-center p-4">
                      <div 
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                        style={{width: '80px', height: '80px', backgroundColor: getCategoryColor(cls.category)}}
                      >
                        <i className={`${getCategoryIcon(cls.category)} text-white fs-3`}></i>
                      </div>
                      <h4 className="fw-bold mb-3">{cls.name}</h4>
                      <p className="text-muted mb-4">
                        {cls.description || `Professional ${cls.category} training with expert instructors.`}
                      </p>
                      <ul className="list-unstyled text-start">
                        <li className="mb-2">
                          <i className="fas fa-user text-success me-2"></i>
                          Instructor: {cls.instructor}
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-calendar text-success me-2"></i>
                          {cls.days ? cls.days.join(', ') : cls.day} at {cls.time}
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-clock text-success me-2"></i>
                          {cls.duration} minutes
                        </li>
                        <li className="mb-2">
                          <i className="fas fa-users text-success me-2"></i>
                          Max {cls.capacity} participants
                        </li>
                      </ul>
                      <div className="mt-4">
                        <div className="mb-2">
                          <small className="text-muted">Monthly Fee:</small>
                          <div className="fw-bold text-primary">LKR {cls.fees?.monthly || 0}</div>
                        </div>
                        <button className="btn btn-primary w-100" style={{backgroundColor: getCategoryColor(cls.category), borderColor: getCategoryColor(cls.category)}}>
                          Book Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}