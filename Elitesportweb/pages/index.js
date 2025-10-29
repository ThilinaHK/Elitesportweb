import Head from 'next/head'
import { useState, useEffect } from 'react'
import EventsSection from '../components/EventsSection'
import Navbar from '../components/Navbar'

function InstructorsList() {
  const [instructors, setInstructors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInstructors()
  }, [])

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/instructors')
      const data = await response.json()
      setInstructors(data.instructors || data || [])
    } catch (error) {
      console.error('Error fetching instructors:', error)
    } finally {
      setLoading(false)
    }
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
      {instructors.map((instructor) => (
        <div key={instructor._id} className="col-lg-4 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-body text-center p-4">
              <div className="position-relative mb-3">
                {instructor.image ? (
                  <img 
                    src={instructor.image} 
                    alt={instructor.name}
                    className="rounded-circle mx-auto d-block"
                    style={{width: '120px', height: '120px', objectFit: 'cover'}}
                  />
                ) : (
                  <div 
                    className="rounded-circle mx-auto d-block d-flex align-items-center justify-content-center"
                    style={{
                      width: '120px', 
                      height: '120px', 
                      background: 'linear-gradient(45deg, #f36100, #ff8c42)',
                      color: 'white',
                      fontSize: '2.5rem',
                      fontWeight: '600'
                    }}
                  >
                    {instructor.name.charAt(0)}
                  </div>
                )}
              </div>
              <h4 className="fw-bold mb-2">{instructor.name}</h4>
              <p className="text-muted mb-3">
                {instructor.position?.replace('_', ' ').toUpperCase() || 'INSTRUCTOR'}
              </p>
              <div className="mb-3">
                {instructor.specialization?.map(spec => (
                  <span 
                    key={spec} 
                    className="badge me-1 mb-1 text-white"
                    style={{
                      backgroundColor: spec === 'crossfit' ? '#f36100' : 
                                     spec === 'karate' ? '#2196f3' : '#9c27b0'
                    }}
                  >
                    {spec.toUpperCase()}
                  </span>
                ))}
              </div>
              <p className="text-muted small mb-3">
                {instructor.bio || 'Dedicated fitness professional committed to helping you achieve your goals.'}
              </p>
              <div className="d-flex justify-content-center align-items-center text-muted small">
                <i className="fas fa-medal me-2 text-warning"></i>
                {instructor.experience} years experience
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function LatestPosts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts((data || []).filter(post => post.type === 'article').slice(0, 3))
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category) => {
    switch(category) {
      case 'fitness': return 'bg-success'
      case 'nutrition': return 'bg-info'
      case 'crossfit': return 'bg-danger'
      case 'karate': return 'bg-primary'
      case 'zumba': return 'bg-warning'
      default: return 'bg-secondary'
    }
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
      {posts.length > 0 ? posts.map((post) => (
        <div key={post._id} className="col-lg-4 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            {post.featuredImage && (
              <img src={post.featuredImage} className="card-img-top" alt={post.title} style={{height: '200px', objectFit: 'cover'}} />
            )}
            <div className="card-body">
              <div className="mb-2">
                <span className={`badge ${getCategoryColor(post.category)} text-white`}>
                  {post.category?.toUpperCase() || 'GENERAL'}
                </span>
                {post.isPublished && (
                  <span className="badge bg-success text-white ms-1">PUBLISHED</span>
                )}
              </div>
              <h5 className="card-title">{post.title}</h5>
              <p className="card-text text-muted small">
                {post.excerpt || post.content?.substring(0, 100) + '...' || 'Read this amazing article...'}
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  {new Date(post.createdAt).toLocaleDateString()}
                </small>
                <a href="/articles" className="btn btn-sm btn-outline-primary">Read More</a>
              </div>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-12 text-center py-5">
          <p className="text-muted">No articles available at the moment.</p>
        </div>
      )}
    </div>
  )
}

function PremiumPrograms() {
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClasses()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      setClasses((data || []).slice(0, 3))
    } catch (error) {
      console.error('Error fetching classes:', error)
    } finally {
      setLoading(false)
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

  const getCategoryColor = (category) => {
    switch(category) {
      case 'crossfit': return '#f36100'
      case 'karate': return '#2196f3'
      case 'zumba': return '#9c27b0'
      default: return '#666'
    }
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
      {classes.length > 0 ? classes.map((cls) => (
        <div key={cls._id} className="col-md-4">
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
                  <i className="fas fa-check text-success me-2"></i>
                  Instructor: {cls.instructor}
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  {cls.day} at {cls.time}
                </li>
                <li className="mb-2">
                  <i className="fas fa-check text-success me-2"></i>
                  {cls.duration} minutes
                </li>
              </ul>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-12 text-center py-5">
          <p className="text-muted">No classes available at the moment.</p>
        </div>
      )}
    </div>
  )
}

function TrendingVideos() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setVideos((data || []).filter(post => post.type === 'trending' || post.type === 'normal').slice(0, 3))
    } catch (error) {
      console.error('Error fetching videos:', error)
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

  const getVideoId = (url) => {
    const match = url?.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    return match ? match[1] : 'dQw4w9WgXcQ'
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
      {videos.length > 0 ? videos.map((video) => (
        <div key={video._id} className="col-lg-4 col-md-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="ratio ratio-16x9">
              <iframe 
                src={`https://www.youtube.com/embed/${getVideoId(video.youtubeUrl)}`} 
                frameBorder="0" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="card-body">
              <div className="mb-2">
                <span 
                  className="badge text-white me-2" 
                  style={{backgroundColor: getCategoryColor(video.category)}}
                >
                  {video.category?.toUpperCase() || 'GENERAL'}
                </span>
                {video.type === 'trending' && (
                  <span className="badge bg-warning text-dark">🔥 TRENDING</span>
                )}
              </div>
              <h5 className="card-title">{video.title}</h5>
              <p className="card-text text-muted small">
                {video.description?.substring(0, 80) + '...' || 'Watch this amazing video...'}
              </p>
            </div>
          </div>
        </div>
      )) : (
        <div className="col-12 text-center py-5">
          <p className="text-muted">No videos available at the moment.</p>
        </div>
      )}
    </div>
  )
}

export default function Home() {
  const [currentQuote, setCurrentQuote] = useState({
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    title: "British Prime Minister"
  })
  const [quotes, setQuotes] = useState([])

  useEffect(() => {
    fetchQuotes()
  }, [])

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/quotes')
      const data = await response.json()
      if (data.length > 0) {
        setQuotes(data)
        setCurrentQuote(data[Math.floor(Math.random() * data.length)])
      }
    } catch (error) {
      console.error('Error fetching quotes:', error)
    }
  }

  const getRandomQuote = () => {
    if (quotes.length > 0) {
      const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
      setCurrentQuote(randomQuote)
    }
  }
  return (
    <>
      <Head>
        <title>Elite Sports Academy - Transform Your Fitness Journey</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
      </Head>

      <Navbar />

      {/* Hero Section */}
      <section className="position-relative overflow-hidden" style={{marginTop: '80px', height: '100vh', background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(243,97,0,0.8)), url(/img/slide-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed'}}>
        <div className="position-absolute w-100 h-100" style={{background: 'linear-gradient(45deg, rgba(243,97,0,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)'}}></div>
        <div className="container h-100 d-flex align-items-center position-relative">
          <div className="row w-100">
            <div className="col-lg-8">
              <div className="text-white" style={{animation: 'fadeInUp 1s ease-out'}}>
                <div className="mb-4">
                  <span className="badge px-4 py-2" style={{background: 'linear-gradient(45deg, rgba(243,97,0,0.9), rgba(255,140,66,0.9))', backdropFilter: 'blur(15px)', borderRadius: '30px', fontSize: '16px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(243,97,0,0.3)'}}>
                    🏆 #1 Fitness Academy in Sri Lanka
                  </span>
                </div>
                <h1 className="display-2 fw-bold mb-4" style={{color: 'white', textShadow: '3px 3px 6px rgba(0,0,0,0.7)', lineHeight: '1.1', letterSpacing: '-1px'}}>
                  Transform Your Body with <span style={{background: 'linear-gradient(45deg, #f36100, #ff8c42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none'}}>Elite Training</span>
                </h1>
                <p className="lead mb-5" style={{fontSize: '1.5rem', color: 'rgba(255,255,255,0.95)', maxWidth: '650px', lineHeight: '1.6', textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>
                  Join thousands of members in our premium CrossFit, Karate, and Zumba programs designed by world-class instructors
                </p>
                <div className="d-flex gap-3 flex-wrap justify-content-center justify-content-lg-start">
                  <a href="/classes" className="btn btn-lg text-white fw-bold px-4 py-3" style={{background: 'linear-gradient(45deg, #f36100, #ff8c42)', border: 'none', borderRadius: '50px', boxShadow: '0 12px 35px rgba(243,97,0,0.4)', transition: 'all 0.3s', fontSize: '16px', minWidth: '180px'}}>
                    <i className="fas fa-rocket me-2"></i>Start Journey
                  </a>
                  <a href="/login" className="btn btn-outline-light btn-lg px-4 py-3" style={{borderRadius: '50px', borderWidth: '2px', backdropFilter: 'blur(15px)', background: 'rgba(255,255,255,0.15)', fontSize: '16px', minWidth: '160px', fontWeight: '600'}}>
                    <i className="fas fa-user me-2"></i>Login
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-4 d-none d-lg-block">
              <div className="position-relative h-100 d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <div className="mb-4" style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', borderRadius: '20px', padding: '30px', border: '1px solid rgba(255,255,255,0.2)'}}>
                    <i className="fas fa-dumbbell" style={{fontSize: '4rem', color: '#f36100', marginBottom: '20px'}}></i>
                    <h4 className="text-white fw-bold mb-2">Premium Equipment</h4>
                    <p className="text-white-50 small">State-of-the-art fitness equipment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute bottom-0 start-50 translate-middle-x mb-5">
          <div className="text-white text-center" style={{animation: 'bounce 2s infinite'}}>
            <div style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.2)'}}>
              <i className="fas fa-chevron-down fs-5"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-6" style={{background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', position: 'relative', paddingTop: '100px', paddingBottom: '100px'}}>
        <div className="position-absolute w-100 h-100" style={{background: 'radial-gradient(circle at 30% 80%, rgba(243,97,0,0.03), transparent 70%)'}}></div>
        <div className="container position-relative">
          <div className="text-center mb-6" style={{animation: 'fadeInUp 0.8s ease-out', marginBottom: '80px'}}>
            <div className="mb-4">
              <span className="badge px-4 py-3" style={{background: 'linear-gradient(45deg, #f36100, #ff8c42)', color: 'white', borderRadius: '30px', fontSize: '16px', fontWeight: '600', boxShadow: '0 8px 25px rgba(243,97,0,0.3)', border: '1px solid rgba(255,255,255,0.2)'}}>
                💪 PREMIUM PROGRAMS
              </span>
            </div>
            <h2 className="fw-bold mb-4" style={{fontSize: '3.5rem', color: '#2c3e50', lineHeight: '1.2', letterSpacing: '-1px'}}>
              Our <span style={{background: 'linear-gradient(45deg, #f36100, #ff8c42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>Premium</span> Programs
            </h2>
            <p className="text-muted fs-5" style={{maxWidth: '700px', margin: '0 auto', lineHeight: '1.7', fontSize: '1.3rem'}}>
              Transform your body and mind with our expertly designed fitness programs led by certified professionals
            </p>
          </div>
          <PremiumPrograms />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-6 text-white position-relative overflow-hidden" style={{background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #f36100 100%)', paddingTop: '100px', paddingBottom: '100px'}}>
        <div className="position-absolute w-100 h-100" style={{background: 'radial-gradient(circle at 20% 50%, rgba(243,97,0,0.2), transparent 70%)'}}></div>
        <div className="container position-relative">
          <div className="row text-center g-4">
            <div className="col-lg-3 col-md-6">
              <div className="p-5 rounded-4 h-100" style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease'}}>
                <div className="mb-3">
                  <i className="fas fa-users" style={{fontSize: '3rem', color: '#f36100'}}></i>
                </div>
                <div className="display-2 fw-bold mb-3" style={{color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>50+</div>
                <h4 className="fw-bold mb-2">Happy Members</h4>
                <p className="text-white-50 small">Growing fitness community</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="p-5 rounded-4 h-100" style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease'}}>
                <div className="mb-3">
                  <i className="fas fa-medal" style={{fontSize: '3rem', color: '#f36100'}}></i>
                </div>
                <div className="display-2 fw-bold mb-3" style={{color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>5+</div>
                <h4 className="fw-bold mb-2">Expert Trainers</h4>
                <p className="text-white-50 small">Certified professionals</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="p-5 rounded-4 h-100" style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease'}}>
                <div className="mb-3">
                  <i className="fas fa-calendar" style={{fontSize: '3rem', color: '#f36100'}}></i>
                </div>
                <div className="display-2 fw-bold mb-3" style={{color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>15+</div>
                <h4 className="fw-bold mb-2">Weekly Classes</h4>
                <p className="text-white-50 small">Flexible scheduling</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-6">
              <div className="p-5 rounded-4 h-100" style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', transition: 'transform 0.3s ease'}}>
                <div className="mb-3">
                  <i className="fas fa-trophy" style={{fontSize: '3rem', color: '#f36100'}}></i>
                </div>
                <div className="display-2 fw-bold mb-3" style={{color: 'white', textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>5</div>
                <h4 className="fw-bold mb-2">Years Experience</h4>
                <p className="text-white-50 small">Proven track record</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Videos Section */}
      <section className="py-5 position-relative">
        <div className="position-absolute w-100 h-100" style={{background: 'linear-gradient(45deg, rgba(243,97,0,0.02), transparent 50%)'}}></div>
        <div className="container position-relative">
          <div className="text-center mb-5">
            <div className="mb-3">
              <span className="badge px-3 py-2" style={{background: 'linear-gradient(45deg, #ff4444, #ff6b6b)', color: 'white', borderRadius: '25px', fontSize: '14px'}}>
                🔥 TRENDING NOW
              </span>
            </div>
            <h2 className="fw-bold mb-3" style={{fontSize: '3rem', background: 'linear-gradient(45deg, #333, #f36100)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Trending Videos
            </h2>
            <p className="text-muted fs-5">Watch our most popular training videos and get inspired</p>
          </div>
          <TrendingVideos />
          <div className="text-center mt-5">
            <a href="/posts" className="btn btn-lg text-white fw-semibold px-5 py-3" style={{background: 'linear-gradient(45deg, #f36100, #ff8c42)', border: 'none', borderRadius: '50px', boxShadow: '0 8px 25px rgba(243,97,0,0.3)'}}>
              <i className="fas fa-play me-2"></i>View All Videos
            </a>
          </div>
        </div>
      </section>

      {/* Latest Posts Panel */}
      <section className="py-5" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="container">
          <div className="text-center mb-5">
            <div className="mb-3">
              <span className="badge px-3 py-2" style={{background: 'linear-gradient(45deg, #28a745, #20c997)', color: 'white', borderRadius: '25px', fontSize: '14px'}}>
                📰 LATEST UPDATES
              </span>
            </div>
            <h2 className="fw-bold mb-3" style={{fontSize: '3rem', background: 'linear-gradient(45deg, #333, #f36100)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Latest Posts & Articles
            </h2>
            <p className="text-muted fs-5">Stay updated with fitness tips, nutrition advice, and academy news</p>
          </div>
          <LatestPosts />
          <div className="text-center mt-5">
            <a href="/articles" className="btn btn-lg text-white fw-semibold px-5 py-3" style={{background: 'linear-gradient(45deg, #f36100, #ff8c42)', border: 'none', borderRadius: '50px', boxShadow: '0 8px 25px rgba(243,97,0,0.3)'}}>
              <i className="fas fa-newspaper me-2"></i>View All Articles
            </a>
          </div>
        </div>
      </section>

      {/* Instructors Section */}
      <section className="py-5 position-relative">
        <div className="position-absolute w-100 h-100" style={{background: 'radial-gradient(circle at 30% 80%, rgba(243,97,0,0.05), transparent 50%)'}}></div>
        <div className="container position-relative">
          <div className="text-center mb-5">
            <div className="mb-3">
              <span className="badge px-3 py-2" style={{background: 'linear-gradient(45deg, #6f42c1, #e83e8c)', color: 'white', borderRadius: '25px', fontSize: '14px'}}>
                👨‍🏫 EXPERT TEAM
              </span>
            </div>
            <h2 className="fw-bold mb-3" style={{fontSize: '3rem', background: 'linear-gradient(45deg, #333, #f36100)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Meet Our Expert Instructors
            </h2>
            <p className="text-muted fs-5" style={{maxWidth: '600px', margin: '0 auto'}}>
              Train with certified professionals who are passionate about your success and dedicated to helping you achieve your fitness goals
            </p>
          </div>
          <InstructorsList />
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-5 position-relative" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="position-absolute w-100 h-100" style={{background: 'radial-gradient(circle at 30% 80%, rgba(243,97,0,0.05), transparent 50%)'}}></div>
        <div className="container position-relative">
          <div className="text-center mb-5">
            <div className="mb-3">
              <span className="badge px-3 py-2" style={{background: 'linear-gradient(45deg, #ff6b35, #f7931e)', color: 'white', borderRadius: '25px', fontSize: '14px'}}>
                🎯 UPCOMING EVENTS
              </span>
            </div>
            <h2 className="fw-bold mb-3" style={{fontSize: '3rem', background: 'linear-gradient(45deg, #333, #f36100)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Upcoming Events
            </h2>
            <p className="text-muted fs-5">Join our exciting events, competitions, and workshops</p>
          </div>
          <EventsSection />
        </div>
      </section>

      {/* Inspirational Quotes Section */}
      <section className="py-5 position-relative overflow-hidden" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
        <div className="position-absolute w-100 h-100" style={{background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1), transparent 50%)'}}></div>
        <div className="container position-relative">
          <div className="text-center mb-5">
            <div className="mb-3">
              <span className="badge px-3 py-2" style={{background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', borderRadius: '25px', fontSize: '14px', border: '1px solid rgba(255,255,255,0.3)'}}>
                💪 DAILY MOTIVATION
              </span>
            </div>
            <h2 className="fw-bold mb-3" style={{fontSize: '3rem'}}>
              Get Inspired Daily
            </h2>
            <p className="opacity-75 fs-5">Motivational quotes from fitness experts and champions to fuel your journey</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="p-5 rounded-4 position-relative" style={{background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}}>
                <div className="text-center">
                  <div className="mb-4" style={{fontSize: '4rem', opacity: '0.3'}}>
                    <i className="fas fa-quote-left"></i>
                  </div>
                  <blockquote className="fs-3 fw-light mb-4" style={{lineHeight: '1.6', fontStyle: 'italic'}}>
                    "{currentQuote.text}"
                  </blockquote>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '60px', height: '60px', background: 'linear-gradient(45deg, #f36100, #ff8c42)'}}>
                      <i className="fas fa-user text-white fs-4"></i>
                    </div>
                    <div className="text-start">
                      <h5 className="mb-1 fw-bold">{currentQuote.author}</h5>
                      <small className="opacity-75">{currentQuote.title || 'Motivational Speaker'}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <button className="btn btn-lg px-5 py-3" onClick={getRandomQuote} style={{background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', borderRadius: '50px'}}>
              <i className="fas fa-sync-alt me-2"></i>
              Get New Quote
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-dark text-white text-center">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 className="fw-bold mb-3">Ready to Transform Your Life?</h2>
              <p className="lead mb-4">Join our elite fitness community and start your transformation journey today</p>
              <div className="d-flex gap-3 justify-content-center flex-wrap">
                <a href="/classes" className="btn btn-lg text-white fw-semibold px-4" style={{backgroundColor: '#f36100', border: 'none'}}>
                  <i className="fas fa-rocket me-2"></i>Start Your Journey
                </a>
                <a href="/login" className="btn btn-outline-light btn-lg px-4">
                  <i className="fas fa-user me-2"></i>Member Login
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="position-relative">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8977!2d80.2015719!3d6.9537892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3a97a9266e939%3A0x447841913a8b1b0e!2sElite%20Sports%20Academy!5e0!3m2!1sen!2slk!4v1234567890"
          width="100%"
          height="400"
          style={{border: 0}}
          allowFullScreen
          loading="lazy"
        ></iframe>
        <div className="position-absolute top-0 start-0 m-4 bg-dark text-white p-3 rounded shadow">
          <h5 className="mb-2" style={{color: '#f36100'}}>
            <i className="fas fa-map-marker-alt me-2"></i>
            Visit Our Academy
          </h5>
          <div className="small">
            <div className="mb-1">162/2/1 Colombo - Batticaloa Hwy</div>
            <div className="mb-1">Avissawella Code 10700</div>
            <div className="mb-1">
              <i className="fas fa-phone me-2"></i>
              (+94) 77 109 5334
            </div>
            <div>
              <i className="fas fa-envelope me-2"></i>
              EliteSportsAcademy@gmail.com
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-white py-5">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 mb-4">
              <div className="d-flex align-items-center mb-3">
                <img src="/img/eliet_logo.jpg" width="40" height="40" alt="Elite Sports Academy" className="rounded-circle me-3" />
                <div>
                  <h5 className="mb-0 fw-bold">Elite Sports Academy</h5>
                  <small className="text-muted">Transform Your Limits</small>
                </div>
              </div>
              <p className="text-muted">Your premier destination for CrossFit, Karate, and Zumba training. Join our community and transform your fitness journey.</p>
            </div>
            <div className="col-lg-4 mb-4">
              <h5 className="fw-semibold mb-3" style={{color: '#f36100'}}>Contact Info</h5>
              <div className="mb-2">
                <i className="fas fa-map-marker-alt me-2" style={{color: '#f36100'}}></i>
                <span className="text-muted small">162/2/1 Colombo - Batticaloa Hwy, Avissawella</span>
              </div>
              <div className="mb-2">
                <i className="fas fa-phone me-2" style={{color: '#f36100'}}></i>
                <span className="text-muted small">(+94) 77 109 5334</span>
              </div>
              <div>
                <i className="fas fa-envelope me-2" style={{color: '#f36100'}}></i>
                <span className="text-muted small">EliteSportsAcademy@gmail.com</span>
              </div>
            </div>
            <div className="col-lg-4 mb-4">
              <h5 className="fw-semibold mb-3" style={{color: '#f36100'}}>Quick Links</h5>
              <ul className="list-unstyled">
                <li className="mb-2"><a href="/" className="text-muted text-decoration-none small">Home</a></li>
                <li className="mb-2"><a href="/classes" className="text-muted text-decoration-none small">Classes</a></li>
                <li className="mb-2"><a href="/posts" className="text-muted text-decoration-none small">Videos</a></li>
                <li className="mb-2"><a href="/articles" className="text-muted text-decoration-none small">Articles</a></li>
                <li className="mb-2"><a href="/login" className="text-muted text-decoration-none small">Member Login</a></li>
              </ul>
            </div>
          </div>
          <hr className="my-4" style={{borderColor: '#444'}} />
          <div className="text-center">
            <p className="mb-0 text-muted small">
              Copyright © 2024 Elite Sports Academy. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          font-weight: 400;
          line-height: 1.6;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
          }
          40% {
            transform: translateY(-12px);
          }
          60% {
            transform: translateY(-6px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .btn {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-weight: 600;
        }
        
        .btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.2) !important;
        }
        
        .card {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
        }
        
        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 50px rgba(0,0,0,0.15);
        }
        
        .stats-card:hover {
          transform: translateY(-5px) scale(1.02);
        }
        
        .section-spacing {
          padding: 120px 0;
        }
        
        .text-gradient {
          background: linear-gradient(45deg, #f36100, #ff8c42);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .navbar-toggler {
          border: none !important;
          padding: 8px 12px;
          border-radius: 8px;
          background: rgba(243,97,0,0.1);
        }
        
        .navbar-toggler:focus {
          box-shadow: none !important;
        }
        
        .navbar-toggler-icon {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='%23f36100' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='m4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
        }
        
        @media (max-width: 991.98px) {
          .navbar-collapse {
            background: rgba(255,255,255,0.98);
            backdrop-filter: blur(20px);
            border-radius: 15px;
            padding: 20px;
            margin-top: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border: 1px solid rgba(0,0,0,0.05);
          }
          
          .navbar-nav {
            gap: 8px !important;
          }
          
          .nav-link {
            text-align: center;
            margin: 4px 0;
            border-radius: 12px !important;
          }
        }
      `}</style>
    </>
  )
}