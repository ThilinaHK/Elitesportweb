import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Home() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    nic: '',
    address: '',
    dateOfBirth: '',
    gender: 'male',
    weight: '',
    height: '',
    emergencyContact: '',
    medicalConditions: '',
    profilePicture: ''
  })
  const [currentSlide, setCurrentSlide] = useState(0)
  const [instructors, setInstructors] = useState([])
  const [trendingVideos, setTrendingVideos] = useState([])
  const [stats, setStats] = useState({
    members: 0,
    instructors: 0,
    classes: 0,
    experience: 5
  })
  const [selectedInstructor, setSelectedInstructor] = useState(null)
  const [showInstructorModal, setShowInstructorModal] = useState(false)
  const slides = [
    {
      image: '/img/slide-1.jpg',
      title: 'Transform Your Body with CrossFit',
      subtitle: 'High-intensity functional fitness that delivers real results',
      description: 'Join our elite CrossFit community and push your limits with expert coaching and state-of-the-art equipment.'
    },
    {
      image: '/img/slide-2.jpg', 
      title: 'Master the Art of Karate',
      subtitle: 'Traditional martial arts training for mind and body',
      description: 'Develop discipline, strength, and self-defense skills through authentic karate techniques and philosophy.'
    },
    {
      image: '/img/slide-3.jpg',
      title: 'Dance Your Way to Fitness with Zumba',
      subtitle: 'Fun, energetic workouts that feel like a party',
      description: 'Burn calories and boost your mood with our high-energy Zumba classes led by certified instructors.'
    }
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    fetchInstructors()
    fetchTrendingVideos()
    fetchStats()
    return () => clearInterval(timer)
  }, [])

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/instructors')
      if (response.ok) {
        const data = await response.json()
        setInstructors(data.slice(0, 3)) // Show only top 3 instructors
      }
    } catch (error) {
      console.error('Error fetching instructors:', error)
      setInstructors([]) // Set empty array on error
    }
  }

  const fetchTrendingVideos = async () => {
    try {
      const response = await fetch('/api/posts')
      if (response.ok) {
        const data = await response.json()
        const trending = data.filter(post => post.type === 'trending' && post.isActive).slice(0, 3)
        setTrendingVideos(trending)
      }
    } catch (error) {
      console.error('Error fetching trending videos:', error)
      setTrendingVideos([]) // Set empty array on error
    }
  }

  const fetchStats = async () => {
    try {
      const [membersRes, instructorsRes, classesRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/instructors'),
        fetch('/api/classes')
      ])
      
      const members = membersRes.ok ? await membersRes.json() : []
      const instructors = instructorsRes.ok ? await instructorsRes.json() : []
      const classes = classesRes.ok ? await classesRes.json() : []
      
      setStats({
        members: members.length || 0,
        instructors: instructors.length || 0,
        classes: classes.length || 0,
        experience: 5
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
      setStats({ members: 0, instructors: 0, classes: 0, experience: 5 })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, membershipType: 'trial' })
      })
      if (response.ok) {
        alert('Registration successful!')
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          nic: '',
          address: '',
          dateOfBirth: '',
          gender: 'male',
          weight: '',
          height: '',
          emergencyContact: '',
          medicalConditions: '',
          profilePicture: ''
        })
      }
    } catch (error) {
      alert('Registration failed. Please try again.')
    }
  }

  return (
    <>
      <Head>
        <title>Elite Sports Academy - Transform Your Fitness Journey</title>
        <meta name="description" content="Premier fitness academy offering CrossFit, Karate, and Zumba classes. Professional training, expert instructors, modern facilities." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <style jsx global>{`
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Poppins', sans-serif; line-height: 1.6; color: #333; }
          .btn-primary-custom { 
            background: #f36100; 
            border: none; 
            padding: 15px 30px; 
            font-weight: 600; 
            text-transform: uppercase; 
            letter-spacing: 1px;
            color: white;
            cursor: pointer;
            transition: all 0.3s;
            border-radius: 5px;
          }
          .btn-primary-custom:hover { 
            background: #e55100; 
            transform: translateY(-2px); 
          }
          .card-hover { transition: all 0.3s ease; }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.1); }
          .stats-counter { font-size: 3rem; font-weight: 800; color: #f36100; }
          .hero-gradient { background: rgba(0,0,0,0.4); }
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
              <a href="/" style={{color: '#f36100', textDecoration: 'none', fontWeight: '600', fontSize: '16px'}}>Home</a>
              <a href="/classes" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px', transition: 'color 0.3s'}}>Classes</a>
              <a href="/posts" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px', transition: 'color 0.3s'}}>Videos</a>
              <a href="/articles" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px', transition: 'color 0.3s'}}>Articles</a>
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

      {/* Hero Section */}
      <div style={{position: 'relative', height: '100vh', overflow: 'hidden', marginTop: '90px'}}>
        {slides.map((slide, index) => (
          <div key={index} style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: currentSlide === index ? 1 : 0,
            transition: 'opacity 1s ease-in-out'
          }}>
            <div className="hero-gradient" style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}></div>
          </div>
        ))}
        <div className="container" style={{position: 'relative', zIndex: 2, height: '100%', display: 'flex', alignItems: 'center'}}>
          <div className="row w-100">
            <div className="col-lg-8">
              <div style={{color: 'white', animation: 'fadeInUp 1s ease'}}>
                <h1 style={{fontSize: '4rem', fontWeight: '800', marginBottom: '20px', lineHeight: '1.2'}}>
                  {slides[currentSlide].title}
                </h1>
                <h3 style={{fontSize: '1.5rem', fontWeight: '400', marginBottom: '30px', opacity: '0.9'}}>
                  {slides[currentSlide].subtitle}
                </h3>
                <p style={{fontSize: '1.2rem', marginBottom: '40px', maxWidth: '600px', lineHeight: '1.8'}}>
                  {slides[currentSlide].description}
                </p>
                <div style={{display: 'flex', gap: '20px', flexWrap: 'wrap'}}>
                  <button className="btn-primary-custom" style={{border: 'none', borderRadius: '50px', cursor: 'pointer'}} onClick={() => document.getElementById('booking').scrollIntoView({behavior: 'smooth'})}>
                    Start Your Journey
                  </button>
                  <a href="/classes" style={{background: 'transparent', border: '2px solid white', color: 'white', padding: '15px 30px', textDecoration: 'none', borderRadius: '50px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s'}}>
                    View Classes
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Slide Indicators */}
        <div style={{position: 'absolute', bottom: '30px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '10px', zIndex: 3}}>
          {slides.map((_, index) => (
            <button key={index} onClick={() => setCurrentSlide(index)} style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              border: 'none',
              background: currentSlide === index ? '#f36100' : 'rgba(255,255,255,0.5)',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}></button>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <section style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '80px 0', color: 'white'}}>
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="stats-counter">{stats.members}+</div>
              <h5 style={{fontWeight: '600', marginTop: '10px'}}>Happy Members</h5>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stats-counter">{stats.instructors}+</div>
              <h5 style={{fontWeight: '600', marginTop: '10px'}}>Expert Trainers</h5>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stats-counter">{stats.classes}+</div>
              <h5 style={{fontWeight: '600', marginTop: '10px'}}>Weekly Classes</h5>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="stats-counter">{stats.experience}</div>
              <h5 style={{fontWeight: '600', marginTop: '10px'}}>Years Experience</h5>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Section */}
      <section id="booking" style={{padding: '100px 0', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div style={{position: 'relative', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}}>
                <img src="/img/booking.jpg" alt="Book Your Class" style={{width: '100%', height: '400px', objectFit: 'cover'}} />
                <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, rgba(243,97,0,0.8), rgba(0,0,0,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <div style={{textAlign: 'center', color: 'white'}}>
                    <h2 style={{fontSize: '2.5rem', fontWeight: '700', marginBottom: '20px'}}>Start Your Fitness Journey</h2>
                    <p style={{fontSize: '1.2rem', opacity: '0.9'}}>Join thousands of satisfied members</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{background: 'white', padding: '40px', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', maxHeight: '600px', overflowY: 'auto'}}>
                <h3 style={{fontSize: '1.8rem', fontWeight: '700', marginBottom: '25px', color: '#333'}}>Complete Member Registration</h3>
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#333'}}>Full Name *</label>
                      <input 
                        type="text" 
                        placeholder="Enter your full name" 
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        required
                        style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px'}}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#333'}}>Email Address *</label>
                      <input 
                        type="email" 
                        placeholder="Enter your email address" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                        style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px'}}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#333'}}>Phone Number *</label>
                      <input 
                        type="tel" 
                        placeholder="Enter your phone number" 
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        required
                        style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px'}}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#333'}}>NIC Number *</label>
                      <input 
                        type="text" 
                        placeholder="Enter your NIC number" 
                        value={formData.nic}
                        onChange={(e) => setFormData({...formData, nic: e.target.value})}
                        required
                        style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px'}}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#333'}}>Address *</label>
                      <textarea 
                        placeholder="Enter your full address" 
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        required
                        style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px', height: '60px'}}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#333'}}>Date of Birth *</label>
                      <input 
                        type="date" 
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                        required
                        style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px'}}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#333'}}>Gender *</label>
                      <select 
                        value={formData.gender}
                        onChange={(e) => setFormData({...formData, gender: e.target.value})}
                        required
                        style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px'}}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#333'}}>Weight (kg) *</label>
                      <input 
                        type="number" 
                        placeholder="Enter weight in kg" 
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        required
                        style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px'}}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#333'}}>Height (cm) *</label>
                      <input 
                        type="number" 
                        placeholder="Enter height in cm" 
                        value={formData.height}
                        onChange={(e) => setFormData({...formData, height: e.target.value})}
                        required
                        style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px'}}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#333'}}>Emergency Contact Number *</label>
                      <input 
                        type="tel" 
                        placeholder="Enter emergency contact number" 
                        value={formData.emergencyContact}
                        onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                        required
                        style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px'}}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600', color: '#333'}}>Medical Conditions</label>
                      <textarea 
                        placeholder="Enter any medical conditions (optional)" 
                        value={formData.medicalConditions}
                        onChange={(e) => setFormData({...formData, medicalConditions: e.target.value})}
                        style={{width: '100%', padding: '12px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px', height: '50px'}}
                      />
                    </div>
                    <div className="col-12 mb-3">
                      <label style={{display: 'block', marginBottom: '5px', fontSize: '14px', fontWeight: '600'}}>Profile Picture:</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                              setFormData({...formData, profilePicture: e.target.result})
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        style={{width: '100%', padding: '8px', border: '2px solid #e9ecef', borderRadius: '8px', fontSize: '14px'}}
                      />
                      {formData.profilePicture && (
                        <div style={{textAlign: 'center', marginTop: '10px'}}>
                          <img 
                            src={formData.profilePicture} 
                            alt="Preview" 
                            style={{width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #f36100'}}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    className="btn-primary-custom"
                    style={{width: '100%', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', padding: '12px'}}
                  >
                    <i className="fas fa-user-plus" style={{marginRight: '8px'}}></i>
                    Complete Registration
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" style={{padding: '120px 0', background: 'white'}}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <div className="section-title">
                <h2 style={{fontSize: '3rem', fontWeight: '800', color: '#333', marginBottom: '20px'}}>Our Premium Programs</h2>
                <p style={{fontSize: '1.2rem', color: '#666', maxWidth: '600px', margin: '0 auto'}}>Transform your body and mind with our expertly designed fitness programs</p>
              </div>
            </div>
          </div>
          <div className="row" style={{marginTop: '80px'}}>
            <div className="col-lg-4 col-md-6 mb-5">
              <div className="card-hover" style={{background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: 'none', height: '100%'}}>
                <div style={{width: '80px', height: '80px', background: 'linear-gradient(45deg, #ff5722, #ff8a50)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px'}}>
                  <i className="fas fa-dumbbell" style={{fontSize: '30px', color: 'white'}}></i>
                </div>
                <h4 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#333'}}>CrossFit Training</h4>
                <p style={{color: '#666', lineHeight: '1.8', marginBottom: '30px'}}>High-intensity functional fitness that builds strength, endurance, and mental toughness through varied workouts.</p>
                <ul style={{listStyle: 'none', padding: 0, textAlign: 'left'}}>
                  <li style={{padding: '5px 0', color: '#666'}}><i className="fas fa-check" style={{color: '#f36100', marginRight: '10px'}}></i>Olympic Weightlifting</li>
                  <li style={{padding: '5px 0', color: '#666'}}><i className="fas fa-check" style={{color: '#f36100', marginRight: '10px'}}></i>Metabolic Conditioning</li>
                  <li style={{padding: '5px 0', color: '#666'}}><i className="fas fa-check" style={{color: '#f36100', marginRight: '10px'}}></i>Gymnastics Skills</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-5">
              <div className="card-hover" style={{background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: 'none', height: '100%'}}>
                <div style={{width: '80px', height: '80px', background: 'linear-gradient(45deg, #2196f3, #64b5f6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px'}}>
                  <i className="fas fa-fist-raised" style={{fontSize: '30px', color: 'white'}}></i>
                </div>
                <h4 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#333'}}>Karate Classes</h4>
                <p style={{color: '#666', lineHeight: '1.8', marginBottom: '30px'}}>Traditional martial arts training that develops discipline, self-defense skills, and mental focus.</p>
                <ul style={{listStyle: 'none', padding: 0, textAlign: 'left'}}>
                  <li style={{padding: '5px 0', color: '#666'}}><i className="fas fa-check" style={{color: '#f36100', marginRight: '10px'}}></i>Traditional Kata Forms</li>
                  <li style={{padding: '5px 0', color: '#666'}}><i className="fas fa-check" style={{color: '#f36100', marginRight: '10px'}}></i>Self-Defense Techniques</li>
                  <li style={{padding: '5px 0', color: '#666'}}><i className="fas fa-check" style={{color: '#f36100', marginRight: '10px'}}></i>Mental Discipline</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 mb-5">
              <div className="card-hover" style={{background: 'white', borderRadius: '20px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: 'none', height: '100%'}}>
                <div style={{width: '80px', height: '80px', background: 'linear-gradient(45deg, #9c27b0, #ba68c8)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px'}}>
                  <i className="fas fa-music" style={{fontSize: '30px', color: 'white'}}></i>
                </div>
                <h4 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '20px', color: '#333'}}>Zumba Fitness</h4>
                <p style={{color: '#666', lineHeight: '1.8', marginBottom: '30px'}}>High-energy dance fitness that combines Latin rhythms with easy-to-follow moves for a fun workout.</p>
                <ul style={{listStyle: 'none', padding: 0, textAlign: 'left'}}>
                  <li style={{padding: '5px 0', color: '#666'}}><i className="fas fa-check" style={{color: '#f36100', marginRight: '10px'}}></i>Latin Dance Moves</li>
                  <li style={{padding: '5px 0', color: '#666'}}><i className="fas fa-check" style={{color: '#f36100', marginRight: '10px'}}></i>Cardio Conditioning</li>
                  <li style={{padding: '5px 0', color: '#666'}}><i className="fas fa-check" style={{color: '#f36100', marginRight: '10px'}}></i>Fun Group Atmosphere</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section style={{background: 'linear-gradient(135deg, rgba(0,0,0,0.8), rgba(243,97,0,0.8)), url(/img/client-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', padding: '120px 0', color: 'white'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 text-center">
              <div style={{marginBottom: '40px'}}>
                <i className="fas fa-quote-left" style={{fontSize: '3rem', color: '#f36100', opacity: '0.7'}}></i>
              </div>
              <h2 style={{fontSize: '2.5rem', fontWeight: '400', lineHeight: '1.6', marginBottom: '40px', fontStyle: 'italic'}}>"During the hard times, it's important to focus on the things you can change in that moment instead of what you should have or could have done differently."</h2>
              <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px'}}>
                <div style={{width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(45deg, #f36100, #ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <i className="fas fa-user" style={{color: 'white', fontSize: '24px'}}></i>
                </div>
                <div style={{textAlign: 'left'}}>
                  <h4 style={{margin: 0, fontSize: '1.3rem', fontWeight: '600'}}>Annie Thorisdottir</h4>
                  <p style={{margin: 0, opacity: '0.8'}}>Professional CrossFit Athlete</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lifestyle Section */}
      <section style={{padding: '120px 0', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div style={{position: 'relative'}}>
                <img src="/img/lifestyle.jpg" alt="Healthy Lifestyle" style={{width: '100%', borderRadius: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)'}} />
                <div style={{position: 'absolute', top: '20px', right: '20px', background: 'rgba(243,97,0,0.9)', color: 'white', padding: '15px 20px', borderRadius: '10px', textAlign: 'center'}}>
                  <div style={{fontSize: '2rem', fontWeight: '800'}}>24/7</div>
                  <div style={{fontSize: '0.9rem'}}>Support</div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div style={{paddingLeft: '40px'}}>
                <h2 style={{fontSize: '2.8rem', fontWeight: '800', color: '#333', marginBottom: '30px'}}>Complete Lifestyle Transformation</h2>
                <p style={{fontSize: '1.2rem', color: '#666', marginBottom: '40px', lineHeight: '1.8'}}>We don't just focus on workouts. Our holistic approach includes nutrition guidance, lifestyle coaching, and mental wellness support.</p>
                
                <div style={{marginBottom: '30px'}}>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                    <div style={{width: '50px', height: '50px', background: 'linear-gradient(45deg, #f36100, #ff8c42)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px'}}>
                      <i className="fas fa-apple-alt" style={{color: 'white', fontSize: '20px'}}></i>
                    </div>
                    <div>
                      <h5 style={{margin: 0, fontWeight: '600', color: '#333'}}>Nutrition Guidance</h5>
                      <p style={{margin: 0, color: '#666', fontSize: '0.95rem'}}>Personalized meal plans and dietary advice</p>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', marginBottom: '20px'}}>
                    <div style={{width: '50px', height: '50px', background: 'linear-gradient(45deg, #2196f3, #64b5f6)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px'}}>
                      <i className="fas fa-brain" style={{color: 'white', fontSize: '20px'}}></i>
                    </div>
                    <div>
                      <h5 style={{margin: 0, fontWeight: '600', color: '#333'}}>Mental Wellness</h5>
                      <p style={{margin: 0, color: '#666', fontSize: '0.95rem'}}>Stress management and mindfulness training</p>
                    </div>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <div style={{width: '50px', height: '50px', background: 'linear-gradient(45deg, #4caf50, #81c784)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '20px'}}>
                      <i className="fas fa-heart" style={{color: 'white', fontSize: '20px'}}></i>
                    </div>
                    <div>
                      <h5 style={{margin: 0, fontWeight: '600', color: '#333'}}>Lifestyle Coaching</h5>
                      <p style={{margin: 0, color: '#666', fontSize: '0.95rem'}}>Sustainable habits for long-term success</p>
                    </div>
                  </div>
                </div>
                
                <button className="btn-primary-custom" style={{border: 'none', borderRadius: '10px', cursor: 'pointer'}}>
                  <i className="fas fa-info-circle" style={{marginRight: '10px'}}></i>
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Videos Section */}
      {trendingVideos.length > 0 && (
        <section style={{padding: '120px 0', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
          <div className="container">
            <div className="row">
              <div className="col-lg-8 mx-auto text-center">
                <h2 style={{fontSize: '3rem', fontWeight: '800', marginBottom: '20px'}}>🔥 Trending Videos</h2>
                <p style={{fontSize: '1.2rem', marginBottom: '60px', opacity: '0.9'}}>Watch our most popular training videos</p>
              </div>
            </div>
            <div className="row">
              {trendingVideos.map((video) => (
                <div key={video._id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card-hover" style={{background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', height: '100%'}}>
                    <div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
                      <iframe
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div style={{padding: '20px', color: '#333'}}>
                      <div style={{marginBottom: '10px', display: 'flex', gap: '8px'}}>
                        <span style={{
                          backgroundColor: video.category === 'crossfit' ? '#ff5722' : video.category === 'karate' ? '#2196f3' : video.category === 'zumba' ? '#9c27b0' : '#666',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          fontWeight: '600'
                        }}>
                          {video.category}
                        </span>
                        <span style={{
                          backgroundColor: '#ff9800',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          fontWeight: '600'
                        }}>
                          🔥 TRENDING
                        </span>
                      </div>
                      <h5 style={{fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px'}}>{video.title}</h5>
                      <p style={{color: '#666', fontSize: '14px', lineHeight: '1.6'}}>{video.description.substring(0, 100)}...</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{textAlign: 'center', marginTop: '40px'}}>
              <a href="/posts" className="btn-primary-custom" style={{textDecoration: 'none', display: 'inline-block'}}>
                <i className="fas fa-play" style={{marginRight: '10px'}}></i>
                View All Videos
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Instructors Section */}
      <section style={{padding: '120px 0', background: 'white'}}>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 mx-auto text-center">
              <h2 style={{fontSize: '3rem', fontWeight: '800', color: '#333', marginBottom: '20px'}}>Meet Our Expert Instructors</h2>
              <p style={{fontSize: '1.2rem', color: '#666', marginBottom: '60px'}}>Learn from certified professionals with years of experience</p>
            </div>
          </div>
          <div className="row">
            {instructors.map((instructor) => (
              <div key={instructor._id} className="col-lg-4 col-md-6 mb-5">
                <div 
                  className="card-hover" 
                  style={{background: 'white', borderRadius: '20px', padding: '30px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', height: '100%', cursor: 'pointer'}}
                  onClick={() => {
                    setSelectedInstructor(instructor)
                    setShowInstructorModal(true)
                  }}
                >
                  <div style={{width: '120px', height: '120px', borderRadius: '50%', margin: '0 auto 20px', overflow: 'hidden', border: '4px solid #f36100'}}>
                    {instructor.image ? (
                      <img 
                        src={instructor.image} 
                        alt={instructor.name}
                        style={{width: '100%', height: '100%', objectFit: 'cover'}}
                      />
                    ) : (
                      <div style={{width: '100%', height: '100%', background: 'linear-gradient(45deg, #f36100, #ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'white', fontWeight: '700'}}>
                        {instructor.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <h4 style={{fontSize: '1.5rem', fontWeight: '700', marginBottom: '10px', color: '#333'}}>{instructor.name}</h4>
                  <div style={{marginBottom: '15px'}}>
                    {instructor.specialization.map(spec => (
                      <span key={spec} style={{
                        backgroundColor: spec === 'crossfit' ? '#ff5722' : spec === 'karate' ? '#2196f3' : '#9c27b0',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        marginRight: '5px',
                        fontWeight: '600'
                      }}>{
                        spec
                      }</span>
                    ))}
                  </div>
                  <p style={{color: '#666', fontSize: '14px', marginBottom: '15px'}}>
                    <i className="fas fa-medal" style={{color: '#f36100', marginRight: '5px'}}></i>
                    {instructor.experience} years experience
                  </p>
                  {instructor.bio && (
                    <p style={{color: '#666', lineHeight: '1.6', marginBottom: '20px', fontSize: '14px'}}>
                      {instructor.bio.length > 100 ? instructor.bio.substring(0, 100) + '...' : instructor.bio}
                    </p>
                  )}
                  <div style={{borderTop: '1px solid #f0f0f0', paddingTop: '15px'}}>
                    <h6 style={{color: '#333', marginBottom: '10px', fontSize: '12px', fontWeight: '600'}}>Key Qualifications:</h6>
                    {instructor.qualifications.slice(0, 2).map((qual, index) => (
                      <div key={index} style={{fontSize: '11px', color: '#666', marginBottom: '3px'}}>
                        <i className="fas fa-check" style={{color: '#f36100', marginRight: '5px'}}></i>
                        {qual}
                      </div>
                    ))}
                    {instructor.qualifications.length > 2 && (
                      <div style={{fontSize: '10px', color: '#999', marginTop: '5px'}}>+{instructor.qualifications.length - 2} more certifications</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {instructors.length === 0 && (
            <div style={{textAlign: 'center', padding: '60px 0', color: '#666'}}>
              <i className="fas fa-users" style={{fontSize: '3rem', marginBottom: '20px', opacity: '0.3'}}></i>
              <p>Loading instructor profiles...</p>
            </div>
          )}
        </div>
      </section>

      {/* Programs Showcase */}
      <section style={{padding: '0', background: 'white'}}>
        <div className="container-fluid p-0">
          <div className="row g-0">
            <div className="col-lg-4">
              <div style={{position: 'relative', height: '400px', overflow: 'hidden', cursor: 'pointer'}} className="card-hover">
                <img src="/img/box-1.jpg" alt="CrossFit Training" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease'}} />
                <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, rgba(255,87,34,0.8), rgba(0,0,0,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease'}}>
                  <div style={{textAlign: 'center', color: 'white'}}>
                    <i className="fas fa-dumbbell" style={{fontSize: '3rem', marginBottom: '20px'}}></i>
                    <h3 style={{fontSize: '2rem', fontWeight: '700', marginBottom: '15px'}}>CrossFit</h3>
                    <p style={{fontSize: '1.1rem', opacity: '0.9'}}>High-intensity functional fitness</p>
                    <a href="/classes" style={{background: 'white', color: '#f36100', padding: '12px 25px', textDecoration: 'none', borderRadius: '25px', fontWeight: '600', marginTop: '15px', display: 'inline-block'}}>View Classes</a>
                  </div>
                </div>
                <div style={{position: 'absolute', bottom: '30px', left: '30px', color: 'white'}}>
                  <h2 style={{fontSize: '2.5rem', fontWeight: '800', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>CrossFit</h2>
                  <p style={{fontSize: '1.1rem', opacity: '0.9'}}>Transform your limits</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div style={{position: 'relative', height: '400px', overflow: 'hidden', cursor: 'pointer'}} className="card-hover">
                <img src="/img/box-2.jpg" alt="Karate Training" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease'}} />
                <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, rgba(33,150,243,0.8), rgba(0,0,0,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease'}}>
                  <div style={{textAlign: 'center', color: 'white'}}>
                    <i className="fas fa-fist-raised" style={{fontSize: '3rem', marginBottom: '20px'}}></i>
                    <h3 style={{fontSize: '2rem', fontWeight: '700', marginBottom: '15px'}}>Karate</h3>
                    <p style={{fontSize: '1.1rem', opacity: '0.9'}}>Traditional martial arts mastery</p>
                    <a href="/classes" style={{background: 'white', color: '#2196f3', padding: '12px 25px', textDecoration: 'none', borderRadius: '25px', fontWeight: '600', marginTop: '15px', display: 'inline-block'}}>View Classes</a>
                  </div>
                </div>
                <div style={{position: 'absolute', bottom: '30px', left: '30px', color: 'white'}}>
                  <h2 style={{fontSize: '2.5rem', fontWeight: '800', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>Karate</h2>
                  <p style={{fontSize: '1.1rem', opacity: '0.9'}}>Master your discipline</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div style={{position: 'relative', height: '400px', overflow: 'hidden', cursor: 'pointer'}} className="card-hover">
                <img src="/img/box-3.jpg" alt="Zumba Fitness" style={{width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease'}} />
                <div style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(45deg, rgba(156,39,176,0.8), rgba(0,0,0,0.3))', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.3s ease'}}>
                  <div style={{textAlign: 'center', color: 'white'}}>
                    <i className="fas fa-music" style={{fontSize: '3rem', marginBottom: '20px'}}></i>
                    <h3 style={{fontSize: '2rem', fontWeight: '700', marginBottom: '15px'}}>Zumba</h3>
                    <p style={{fontSize: '1.1rem', opacity: '0.9'}}>Dance your way to fitness</p>
                    <a href="/classes" style={{background: 'white', color: '#9c27b0', padding: '12px 25px', textDecoration: 'none', borderRadius: '25px', fontWeight: '600', marginTop: '15px', display: 'inline-block'}}>View Classes</a>
                  </div>
                </div>
                <div style={{position: 'absolute', bottom: '30px', left: '30px', color: 'white'}}>
                  <h2 style={{fontSize: '2.5rem', fontWeight: '800', textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>Zumba</h2>
                  <p style={{fontSize: '1.1rem', opacity: '0.9'}}>Feel the rhythm</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Call to Action */}
      <section style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '100px 0', textAlign: 'center', color: 'white'}}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h2 style={{fontSize: '3rem', fontWeight: '800', marginBottom: '20px'}}>Ready to Transform Your Life?</h2>
              <p style={{fontSize: '1.3rem', marginBottom: '40px', opacity: '0.9'}}>Join thousands of members who have already started their fitness journey with us</p>
              <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
                <button className="btn-primary-custom" style={{border: 'none', borderRadius: '50px', cursor: 'pointer'}} onClick={() => document.getElementById('booking').scrollIntoView({behavior: 'smooth'})}>
                  <i className="fas fa-rocket" style={{marginRight: '10px'}}></i>
                  Start Free Trial
                </button>
                <a href="/classes" style={{background: 'transparent', border: '2px solid white', color: 'white', padding: '15px 30px', textDecoration: 'none', borderRadius: '50px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px', transition: 'all 0.3s'}}>
                  <i className="fas fa-calendar" style={{marginRight: '10px'}}></i>
                  View Schedule
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <div className="map" style={{position: 'relative'}}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.8977!2d80.2015719!3d6.9537892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3a97a9266e939%3A0x447841913a8b1b0e!2sElite%20Sports%20Academy!5e0!3m2!1sen!2slk!4v1234567890"
          width="100%"
          height="585"
          style={{border: 0}}
          allowFullScreen
          loading="lazy"
        ></iframe>
        <div style={{position: 'absolute', top: '50px', left: '50px', backgroundColor: 'rgba(0,0,0,0.8)', color: 'white', padding: '20px'}}>
          <ul style={{listStyle: 'none', margin: 0, padding: 0}}>
            <li>162/2/1 Colombo - Batticaloa Hwy</li>
            <li>Avissawella Code 10700</li>
            <li>+94771095334</li>
            <li>EliteSportsAcademy@gmail.com</li>
          </ul>
        </div>
      </div>

      {/* Instructor Profile Modal */}
      {showInstructorModal && selectedInstructor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative'
          }}>
            <button 
              onClick={() => setShowInstructorModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: '#f36100',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                fontSize: '20px',
                zIndex: 1
              }}
            >
              ×
            </button>
            <div style={{padding: '40px'}}>
              <div style={{textAlign: 'center', marginBottom: '30px'}}>
                <div style={{width: '150px', height: '150px', borderRadius: '50%', margin: '0 auto 20px', overflow: 'hidden', border: '5px solid #f36100'}}>
                  {selectedInstructor.image ? (
                    <img 
                      src={selectedInstructor.image} 
                      alt={selectedInstructor.name}
                      style={{width: '100%', height: '100%', objectFit: 'cover'}}
                    />
                  ) : (
                    <div style={{width: '100%', height: '100%', background: 'linear-gradient(45deg, #f36100, #ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', color: 'white', fontWeight: '700'}}>
                      {selectedInstructor.name.charAt(0)}
                    </div>
                  )}
                </div>
                <h2 style={{color: '#333', marginBottom: '10px'}}>{selectedInstructor.name}</h2>
                <div style={{marginBottom: '20px'}}>
                  {selectedInstructor.specialization.map(spec => (
                    <span key={spec} style={{
                      backgroundColor: spec === 'crossfit' ? '#ff5722' : spec === 'karate' ? '#2196f3' : '#9c27b0',
                      color: 'white',
                      padding: '6px 15px',
                      borderRadius: '20px',
                      fontSize: '14px',
                      textTransform: 'uppercase',
                      marginRight: '10px',
                      fontWeight: '600'
                    }}>{
                      spec
                    }</span>
                  ))}
                </div>
                <p style={{color: '#f36100', fontSize: '18px', fontWeight: '600', marginBottom: '5px'}}>
                  {selectedInstructor.experience} Years Experience
                </p>
                <p style={{color: '#666', fontSize: '16px', textTransform: 'capitalize'}}>
                  {selectedInstructor.position?.replace('_', ' ') || 'Instructor'}
                </p>
              </div>
              
              <div style={{marginBottom: '30px'}}>
                <h4 style={{color: '#333', marginBottom: '15px', borderBottom: '2px solid #f36100', paddingBottom: '10px'}}>About</h4>
                <p style={{color: '#666', lineHeight: '1.8', fontSize: '16px'}}>
                  {selectedInstructor.bio || 'Dedicated fitness professional committed to helping members achieve their goals through expert guidance and motivation.'}
                </p>
              </div>
              
              <div style={{marginBottom: '30px'}}>
                <h4 style={{color: '#333', marginBottom: '15px', borderBottom: '2px solid #f36100', paddingBottom: '10px'}}>Contact Information</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <i className="fas fa-envelope" style={{color: '#f36100', marginRight: '15px', width: '20px'}}></i>
                    <span style={{color: '#666'}}>{selectedInstructor.email}</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <i className="fas fa-phone" style={{color: '#f36100', marginRight: '15px', width: '20px'}}></i>
                    <span style={{color: '#666'}}>{selectedInstructor.phone}</span>
                  </div>
                </div>
              </div>
              
              <div style={{marginBottom: '30px'}}>
                <h4 style={{color: '#333', marginBottom: '15px', borderBottom: '2px solid #f36100', paddingBottom: '10px'}}>Qualifications & Certifications</h4>
                <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                  {selectedInstructor.qualifications.map((qual, index) => (
                    <div key={index} style={{display: 'flex', alignItems: 'center'}}>
                      <i className="fas fa-certificate" style={{color: '#f36100', marginRight: '15px', width: '20px'}}></i>
                      <span style={{color: '#666'}}>{qual}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div style={{textAlign: 'center', paddingTop: '20px', borderTop: '1px solid #f0f0f0'}}>
                <button 
                  onClick={() => setShowInstructorModal(false)}
                  style={{
                    backgroundColor: '#f36100',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  Close Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <p style={{opacity: '0.8', lineHeight: '1.6'}}>Your premier destination for CrossFit, Karate, and Zumba training. Join our community and transform your fitness journey.</p>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h5 style={{fontWeight: '600', marginBottom: '20px', color: '#f36100'}}>Quick Links</h5>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '10px'}}><a href="/" style={{color: 'white', textDecoration: 'none', opacity: '0.8', transition: 'opacity 0.3s'}}>Home</a></li>
                <li style={{marginBottom: '10px'}}><a href="/classes" style={{color: 'white', textDecoration: 'none', opacity: '0.8', transition: 'opacity 0.3s'}}>Classes</a></li>
                <li style={{marginBottom: '10px'}}><a href="/admin" style={{color: 'white', textDecoration: 'none', opacity: '0.8', transition: 'opacity 0.3s'}}>Admin</a></li>
              </ul>
            </div>
            <div className="col-lg-3 col-md-6 mb-4">
              <h5 style={{fontWeight: '600', marginBottom: '20px', color: '#f36100'}}>Contact Info</h5>
              <div style={{marginBottom: '15px', display: 'flex', alignItems: 'center'}}>
                <i className="fas fa-map-marker-alt" style={{color: '#f36100', marginRight: '10px', width: '20px'}}></i>
                <span style={{opacity: '0.8', fontSize: '14px'}}>162/2/1 Colombo - Batticaloa Hwy, Avissawella</span>
              </div>
              <div style={{marginBottom: '15px', display: 'flex', alignItems: 'center'}}>
                <i className="fas fa-phone" style={{color: '#f36100', marginRight: '10px', width: '20px'}}></i>
                <span style={{opacity: '0.8', fontSize: '14px'}}>(+94) 77 109 5334</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <i className="fas fa-envelope" style={{color: '#f36100', marginRight: '10px', width: '20px'}}></i>
                <span style={{opacity: '0.8', fontSize: '14px'}}>EliteSportsAcademy@gmail.com</span>
              </div>
            </div>
            <div className="col-lg-3 mb-4">
              <h5 style={{fontWeight: '600', marginBottom: '20px', color: '#f36100'}}>Follow Us</h5>
              <div style={{display: 'flex', gap: '15px'}}>
                <a href="https://web.facebook.com/Promoddilan/?_rdc=1&_rdr" style={{width: '45px', height: '45px', background: 'linear-gradient(45deg, #3b5998, #4267B2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'transform 0.3s'}}>
                  <i className="fab fa-facebook-f" style={{color: 'white', fontSize: '18px'}}></i>
                </a>
                <a href="https://www.youtube.com/@elitesportsacademy7790" style={{width: '45px', height: '45px', background: 'linear-gradient(45deg, #FF0000, #FF4444)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'transform 0.3s'}}>
                  <i className="fab fa-youtube" style={{color: 'white', fontSize: '18px'}}></i>
                </a>
                <a href="#" style={{width: '45px', height: '45px', background: 'linear-gradient(45deg, #1DA1F2, #55ACEE)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'transform 0.3s'}}>
                  <i className="fab fa-twitter" style={{color: 'white', fontSize: '18px'}}></i>
                </a>
                <a href="#" style={{width: '45px', height: '45px', background: 'linear-gradient(45deg, #E4405F, #F56040)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'transform 0.3s'}}>
                  <i className="fab fa-instagram" style={{color: 'white', fontSize: '18px'}}></i>
                </a>
              </div>
            </div>
          </div>
          <hr style={{border: 'none', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '40px 0 20px'}} />
          <div className="row">
            <div className="col-12 text-center">
              <p style={{margin: 0, opacity: '0.6', fontSize: '14px'}}>
                Copyright © 2024 Elite Sports Academy. All rights reserved. | Designed with love for fitness enthusiasts
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}