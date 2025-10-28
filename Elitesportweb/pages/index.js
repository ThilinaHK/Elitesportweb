import Head from 'next/head'
import { useState, useEffect } from 'react'

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
      </Head>

      {/* Header */}
      <header className="bg-white shadow-sm fixed-top">
        <div className="container">
          <div className="d-flex align-items-center justify-content-between py-3">
            <div className="d-flex align-items-center">
              <img src="/img/eliet_logo.jpg" width="50" height="50" alt="Elite Sports Academy" className="rounded-circle me-3" />
              <div>
                <h4 className="mb-0 text-dark fw-bold">Elite Sports</h4>
                <small className="text-muted">Academy</small>
              </div>
            </div>
            <nav className="d-flex align-items-center gap-4">
              <a href="/" className="text-decoration-none fw-semibold" style={{color: '#f36100'}}>Home</a>
              <a href="/posts" className="text-decoration-none text-dark">Videos</a>
              <a href="/login" className="text-decoration-none text-dark">Member Login</a>
              <a href="/instructor-login" className="text-decoration-none text-dark">Instructor</a>
              <a href="/admin-login" className="text-decoration-none text-dark">Admin</a>
              <div className="text-primary fw-semibold">
                <i className="fas fa-phone me-2"></i>
                (+94) 77 109 5334
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="position-relative" style={{marginTop: '80px', height: '70vh', background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(/img/slide-1.jpg)', backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="container h-100 d-flex align-items-center">
          <div className="text-white">
            <h1 className="display-4 fw-bold mb-4">Transform Your Body with Elite Training</h1>
            <p className="lead mb-4">Professional CrossFit, Karate, and Zumba classes with expert instructors</p>
            <div className="d-flex gap-3">
              <a href="/classes" className="btn btn-lg text-white fw-semibold px-4" style={{backgroundColor: '#f36100', border: 'none'}}>
                View Classes
              </a>
              <a href="/login" className="btn btn-outline-light btn-lg px-4">
                Member Login
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Our Premium Programs</h2>
            <p className="text-muted">Transform your body and mind with our expertly designed fitness programs</p>
          </div>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px', backgroundColor: '#f36100'}}>
                    <i className="fas fa-dumbbell text-white fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-3">CrossFit Training</h4>
                  <p className="text-muted mb-4">High-intensity functional fitness that builds strength, endurance, and mental toughness through varied workouts.</p>
                  <ul className="list-unstyled text-start">
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Olympic Weightlifting</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Metabolic Conditioning</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Gymnastics Skills</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px', backgroundColor: '#2196f3'}}>
                    <i className="fas fa-fist-raised text-white fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Karate Classes</h4>
                  <p className="text-muted mb-4">Traditional martial arts training that develops discipline, self-defense skills, and mental focus.</p>
                  <ul className="list-unstyled text-start">
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Traditional Kata Forms</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Self-Defense Techniques</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Mental Discipline</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{width: '80px', height: '80px', backgroundColor: '#9c27b0'}}>
                    <i className="fas fa-music text-white fs-3"></i>
                  </div>
                  <h4 className="fw-bold mb-3">Zumba Fitness</h4>
                  <p className="text-muted mb-4">High-energy dance fitness that combines Latin rhythms with easy-to-follow moves for a fun workout.</p>
                  <ul className="list-unstyled text-start">
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Latin Dance Moves</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Cardio Conditioning</li>
                    <li className="mb-2"><i className="fas fa-check text-success me-2"></i>Fun Group Atmosphere</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-5 text-white" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3 col-6 mb-4">
              <div className="display-4 fw-bold">50+</div>
              <h5 className="fw-semibold mt-2">Happy Members</h5>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="display-4 fw-bold">5+</div>
              <h5 className="fw-semibold mt-2">Expert Trainers</h5>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="display-4 fw-bold">15+</div>
              <h5 className="fw-semibold mt-2">Weekly Classes</h5>
            </div>
            <div className="col-md-3 col-6 mb-4">
              <div className="display-4 fw-bold">5</div>
              <h5 className="fw-semibold mt-2">Years Experience</h5>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Videos Section */}
      <section className="py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">🔥 Trending Videos</h2>
            <p className="text-muted">Watch our most popular training videos</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="ratio ratio-16x9">
                  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <span className="badge text-white me-2" style={{backgroundColor: '#f36100'}}>CROSSFIT</span>
                    <span className="badge bg-warning text-dark">🔥 TRENDING</span>
                  </div>
                  <h5 className="card-title">CrossFit Workout Basics</h5>
                  <p className="card-text text-muted small">Learn the fundamental movements of CrossFit training...</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="ratio ratio-16x9">
                  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <span className="badge text-white me-2" style={{backgroundColor: '#2196f3'}}>KARATE</span>
                    <span className="badge bg-warning text-dark">🔥 TRENDING</span>
                  </div>
                  <h5 className="card-title">Karate Kata Techniques</h5>
                  <p className="card-text text-muted small">Master traditional karate forms and techniques...</p>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="ratio ratio-16x9">
                  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameBorder="0" allowFullScreen></iframe>
                </div>
                <div className="card-body">
                  <div className="mb-2">
                    <span className="badge text-white me-2" style={{backgroundColor: '#9c27b0'}}>ZUMBA</span>
                    <span className="badge bg-warning text-dark">🔥 TRENDING</span>
                  </div>
                  <h5 className="card-title">Zumba Dance Moves</h5>
                  <p className="card-text text-muted small">High-energy dance workout for all fitness levels...</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <a href="/posts" className="btn text-white fw-semibold px-4" style={{backgroundColor: '#f36100', border: 'none'}}>
              <i className="fas fa-play me-2"></i>View All Videos
            </a>
          </div>
        </div>
      </section>

      {/* Latest Posts Panel */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">Latest Posts & Articles</h2>
            <p className="text-muted">Stay updated with fitness tips and academy news</p>
          </div>
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <img src="/img/blog/blog-1.jpg" className="card-img-top" alt="Fitness Tips" style={{height: '200px', objectFit: 'cover'}} />
                <div className="card-body">
                  <div className="mb-2">
                    <span className="badge bg-success">FITNESS TIPS</span>
                    <span className="badge bg-warning text-dark ms-1">🔥 TRENDING</span>
                  </div>
                  <h5 className="card-title">10 Essential CrossFit Tips for Beginners</h5>
                  <p className="card-text text-muted small">Starting your CrossFit journey? Here are the essential tips every beginner should know...</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">2 days ago</small>
                    <a href="/articles" className="btn btn-sm btn-outline-primary">Read More</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <img src="/img/blog/blog-2.jpg" className="card-img-top" alt="Nutrition" style={{height: '200px', objectFit: 'cover'}} />
                <div className="card-body">
                  <div className="mb-2">
                    <span className="badge bg-info text-white">NUTRITION</span>
                  </div>
                  <h5 className="card-title">Nutrition Guide for Athletes</h5>
                  <p className="card-text text-muted small">Fuel your workouts with proper nutrition. Learn what to eat before and after training...</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">5 days ago</small>
                    <a href="/articles" className="btn btn-sm btn-outline-primary">Read More</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4 col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <img src="/img/blog/blog-3.jpg" className="card-img-top" alt="Academy News" style={{height: '200px', objectFit: 'cover'}} />
                <div className="card-body">
                  <div className="mb-2">
                    <span className="badge bg-warning text-dark">ACADEMY NEWS</span>
                    <span className="badge bg-danger text-white ms-1">🔥 TRENDING</span>
                  </div>
                  <h5 className="card-title">New Class Schedule Updates</h5>
                  <p className="card-text text-muted small">We've updated our class schedules to better serve our members. Check out the new timings...</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">1 week ago</small>
                    <a href="/articles" className="btn btn-sm btn-outline-primary">Read More</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <a href="/articles" className="btn text-white fw-semibold px-4" style={{backgroundColor: '#f36100', border: 'none'}}>
              <i className="fas fa-newspaper me-2"></i>View All Articles
            </a>
          </div>
        </div>
      </section>

      {/* Member Registration Section */}
      <section className="py-5" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <div className="position-relative">
                <img src="/img/booking.jpg" alt="Join Elite Sports Academy" className="img-fluid rounded shadow" style={{height: '400px', width: '100%', objectFit: 'cover'}} />
                <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center rounded" style={{background: 'linear-gradient(45deg, rgba(243,97,0,0.8), rgba(0,0,0,0.3))'}}>
                  <div className="text-center text-white">
                    <h2 className="fw-bold mb-3">Start Your Fitness Journey</h2>
                    <p className="fs-5">Join thousands of satisfied members</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="fw-bold mb-4 text-dark">Member Registration</h3>
                <form>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Full Name *</label>
                      <input type="text" className="form-control" placeholder="Enter your full name" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Email Address *</label>
                      <input type="email" className="form-control" placeholder="Enter your email" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Phone Number *</label>
                      <input type="tel" className="form-control" placeholder="Enter your phone" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">NIC Number *</label>
                      <input type="text" className="form-control" placeholder="Enter your NIC" required />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label fw-semibold">Address *</label>
                      <textarea className="form-control" rows="2" placeholder="Enter your address" required></textarea>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Date of Birth *</label>
                      <input type="date" className="form-control" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Gender *</label>
                      <select className="form-select" required>
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Weight (kg) *</label>
                      <input type="number" className="form-control" placeholder="Enter weight" required />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label fw-semibold">Height (cm) *</label>
                      <input type="number" className="form-control" placeholder="Enter height" required />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label fw-semibold">Emergency Contact *</label>
                      <input type="tel" className="form-control" placeholder="Emergency contact number" required />
                    </div>
                    <div className="col-12 mb-3">
                      <label className="form-label fw-semibold">Medical Conditions</label>
                      <textarea className="form-control" rows="2" placeholder="Any medical conditions (optional)"></textarea>
                    </div>
                  </div>
                  <button type="submit" className="btn w-100 text-white fw-semibold py-2" style={{backgroundColor: '#f36100', border: 'none'}}>
                    <i className="fas fa-user-plus me-2"></i>
                    Complete Registration
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspirational Quotes Section */}
      <section className="py-5" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-3">💪 Daily Motivation</h2>
            <p className="opacity-75">Get inspired with quotes from fitness experts and champions</p>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="bg-white bg-opacity-10 p-4 rounded shadow" style={{backdropFilter: 'blur(10px)'}}>
                <div className="text-center">
                  <i className="fas fa-quote-left mb-3" style={{fontSize: '2rem', opacity: '0.7'}}></i>
                  <blockquote className="fs-4 fw-light mb-4" style={{lineHeight: '1.6'}}>
                    "{currentQuote.text}"
                  </blockquote>
                  <div className="d-flex align-items-center justify-content-center">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                      <i className="fas fa-user text-white"></i>
                    </div>
                    <div className="text-start">
                      <h6 className="mb-0 fw-bold">{currentQuote.author}</h6>
                      <small className="opacity-75">{currentQuote.title || 'Motivational Speaker'}</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-center mt-4">
            <button className="btn btn-light btn-sm px-4" onClick={getRandomQuote}>
              <i className="fas fa-sync-alt me-2"></i>
              New Quote
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
                <li className="mb-2"><a href="/posts" className="text-muted text-decoration-none small">Videos</a></li>
                <li className="mb-2"><a href="/login" className="text-muted text-decoration-none small">Member Login</a></li>
                <li className="mb-2"><a href="/instructor-login" className="text-muted text-decoration-none small">Instructor</a></li>
                <li className="mb-2"><a href="/admin-login" className="text-muted text-decoration-none small">Admin</a></li>
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
    </>
  )
}