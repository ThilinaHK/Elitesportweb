import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedArticle, setSelectedArticle] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      const articlePosts = data.filter(post => post.type === 'article' && post.isPublished)
      setArticles(articlePosts)
    } catch (error) {
      console.error('Error fetching articles:', error)
      // Mock articles data
      const mockArticles = [
        {
          _id: '1',
          title: '10 Essential CrossFit Tips for Beginners',
          excerpt: 'Starting your CrossFit journey? Here are the essential tips every beginner should know to get started safely and effectively.',
          category: 'fitness',
          featuredImage: '/img/blog/blog-1.jpg',
          tags: ['crossfit', 'beginners', 'tips'],
          createdAt: new Date('2024-01-15')
        },
        {
          _id: '2',
          title: 'Nutrition Guide for Athletes',
          excerpt: 'Fuel your workouts with proper nutrition. Learn what to eat before and after training to maximize your performance.',
          category: 'nutrition',
          featuredImage: '/img/blog/blog-2.jpg',
          tags: ['nutrition', 'athletes', 'diet'],
          createdAt: new Date('2024-01-10')
        },
        {
          _id: '3',
          title: 'New Class Schedule Updates',
          excerpt: 'We have updated our class schedules to better serve our members. Check out the new timings and additional classes.',
          category: 'academy',
          featuredImage: '/img/blog/blog-3.jpg',
          tags: ['schedule', 'classes', 'updates'],
          createdAt: new Date('2024-01-05')
        }
      ]
      setArticles(mockArticles)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory)

  const categories = ['all', ...new Set(articles.map(article => article.category))]

  return (
    <>
      <Head>
        <title>Articles - Elite Sports Academy</title>
        <meta name="description" content="Read our latest fitness and health articles" />
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 400; line-height: 1.6; }
          .card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
          .card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
          .btn { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); font-weight: 600; }
          .btn:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(0,0,0,0.2) !important; }
        `}</style>
      </Head>

      {/* Header */}
      <header className="fixed-top" style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 2px 30px rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.05)'}}>
        <div className="container">
          <div className="d-flex align-items-center justify-content-between py-3">
            <div className="d-flex align-items-center">
              <img src="/img/eliet_logo.jpg" width="55" height="55" alt="Elite Sports Academy" className="rounded-circle me-3" style={{boxShadow: '0 4px 15px rgba(243,97,0,0.2)'}} />
              <div>
                <h4 className="mb-0 fw-bold" style={{color: '#2c3e50', fontSize: '1.4rem'}}>Elite Sports</h4>
                <small className="text-muted fw-medium">Academy</small>
              </div>
            </div>
            <nav className="d-flex align-items-center gap-4">
              <a href="/" className="text-decoration-none fw-medium px-3 py-2 rounded-pill" style={{color: '#2c3e50', transition: 'all 0.3s'}}>Home</a>
              <a href="/classes" className="text-decoration-none fw-medium px-3 py-2 rounded-pill" style={{color: '#2c3e50', transition: 'all 0.3s'}}>Classes</a>
              <a href="/posts" className="text-decoration-none fw-medium px-3 py-2 rounded-pill" style={{color: '#2c3e50', transition: 'all 0.3s'}}>Videos</a>
              <a href="/articles" className="text-decoration-none fw-semibold px-3 py-2 rounded-pill" style={{color: '#f36100', background: 'rgba(243,97,0,0.1)', transition: 'all 0.3s'}}>Articles</a>
              <a href="/login" className="text-decoration-none fw-medium px-3 py-2 rounded-pill" style={{color: '#2c3e50', transition: 'all 0.3s'}}>Member Login</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="position-relative overflow-hidden" style={{background: 'linear-gradient(135deg, rgba(0,0,0,0.6), rgba(243,97,0,0.8)), url(/img/articles-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', padding: '150px 0 100px', marginTop: '80px', color: 'white', textAlign: 'center'}}>
        <div className="position-absolute w-100 h-100" style={{background: 'linear-gradient(45deg, rgba(243,97,0,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)'}}></div>
        <div className="container position-relative">
          <div className="mb-4">
            <span className="badge px-4 py-2" style={{background: 'linear-gradient(45deg, rgba(243,97,0,0.9), rgba(255,140,66,0.9))', backdropFilter: 'blur(15px)', borderRadius: '30px', fontSize: '16px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 32px rgba(243,97,0,0.3)'}}>
              📰 EXPERT INSIGHTS
            </span>
          </div>
          <h1 style={{fontSize: '4rem', fontWeight: '800', marginBottom: '20px', textShadow: '3px 3px 6px rgba(0,0,0,0.7)', lineHeight: '1.1'}}>Fitness & Health <span style={{background: 'linear-gradient(45deg, #f36100, #ff8c42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textShadow: 'none'}}>Articles</span></h1>
          <p style={{fontSize: '1.4rem', opacity: '0.95', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6', textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>
            Expert insights, tips, and guides to help you on your fitness journey
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <section style={{padding: '100px 0', background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)', position: 'relative'}}>
        <div className="position-absolute w-100 h-100" style={{background: 'radial-gradient(circle at 30% 80%, rgba(243,97,0,0.03), transparent 70%)'}}></div>
        <div className="container position-relative">
          {/* Category Filter */}
          <div style={{marginBottom: '60px', textAlign: 'center'}}>
            <div className="mb-4">
              <span className="badge px-4 py-3" style={{background: 'linear-gradient(45deg, #f36100, #ff8c42)', color: 'white', borderRadius: '30px', fontSize: '16px', fontWeight: '600', boxShadow: '0 8px 25px rgba(243,97,0,0.3)', border: '1px solid rgba(255,255,255,0.2)'}}>
                📚 BROWSE CATEGORIES
              </span>
            </div>
            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px'}}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    backgroundColor: selectedCategory === category ? '#f36100' : 'white',
                    color: selectedCategory === category ? 'white' : '#2c3e50',
                    border: '2px solid #f36100',
                    padding: '12px 25px',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: selectedCategory === category ? '0 8px 25px rgba(243,97,0,0.3)' : '0 4px 15px rgba(0,0,0,0.08)',
                    fontSize: '14px',
                    letterSpacing: '0.5px'
                  }}
                >
                  {category === 'all' ? 'All Articles' : category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{textAlign: 'center', padding: '80px 0'}}>
              <div className="spinner-border" role="status" style={{width: '3rem', height: '3rem', color: '#f36100'}}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3" style={{color: '#666', fontSize: '1.2rem'}}>Loading articles...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div style={{textAlign: 'center', padding: '80px 0'}}>
              <div className="p-5 rounded-4" style={{background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0,0,0,0.05)', maxWidth: '500px', margin: '0 auto'}}>
                <i className="fas fa-newspaper" style={{fontSize: '4rem', color: '#f36100', marginBottom: '20px', opacity: '0.7'}}></i>
                <h3 style={{color: '#2c3e50', marginBottom: '15px', fontWeight: '700'}}>No Articles Found</h3>
                <p style={{color: '#666', margin: 0}}>Check back soon for new content!</p>
              </div>
            </div>
          ) : (
            <div className="row">
              {filteredArticles.map((article) => (
                <div key={article._id} className="col-lg-4 col-md-6 mb-4">
                  <div className="card h-100" style={{
                    background: 'white',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: 'none'
                  }}>
                    {article.featuredImage && (
                      <div style={{height: '200px', overflow: 'hidden'}}>
                        <img 
                          src={article.featuredImage} 
                          alt={article.title}
                          style={{width: '100%', height: '100%', objectFit: 'cover'}}
                        />
                      </div>
                    )}
                    <div style={{padding: '25px'}}>
                      <div style={{marginBottom: '15px'}}>
                        <span style={{
                          backgroundColor: article.category === 'crossfit' ? '#ff5722' : 
                                         article.category === 'karate' ? '#2196f3' : 
                                         article.category === 'zumba' ? '#9c27b0' : 
                                         article.category === 'fitness' ? '#4caf50' : 
                                         article.category === 'nutrition' ? '#ff9800' : '#666',
                          color: 'white',
                          padding: '5px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          fontWeight: '600'
                        }}>
                          {article.category}
                        </span>
                      </div>
                      <h4 style={{fontSize: '1.4rem', fontWeight: '700', marginBottom: '15px', color: '#333', lineHeight: '1.4'}}>
                        {article.title}
                      </h4>
                      <p style={{color: '#666', lineHeight: '1.6', marginBottom: '20px', fontSize: '14px'}}>
                        {article.excerpt}
                      </p>
                      {article.tags && article.tags.length > 0 && (
                        <div style={{marginBottom: '20px'}}>
                          {article.tags.slice(0, 3).map(tag => (
                            <span key={tag} style={{
                              backgroundColor: '#e3f2fd',
                              color: '#1976d2',
                              padding: '3px 8px',
                              borderRadius: '10px',
                              fontSize: '11px',
                              marginRight: '5px',
                              marginBottom: '5px',
                              display: 'inline-block'
                            }}>
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f0f0f0', paddingTop: '15px'}}>
                        <small style={{color: '#999', fontSize: '12px'}}>
                          {new Date(article.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </small>
                        <button 
                          onClick={() => {
                            setSelectedArticle(article)
                            setShowModal(true)
                          }}
                          style={{
                            backgroundColor: '#f36100',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s'
                          }}
                        >
                          Read More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
              <p style={{opacity: '0.8', lineHeight: '1.6'}}>Your premier destination for fitness articles, expert advice, and wellness tips.</p>
            </div>
            <div className="col-lg-2 col-md-6 mb-4">
              <h5 style={{fontWeight: '600', marginBottom: '20px', color: '#f36100'}}>Quick Links</h5>
              <ul style={{listStyle: 'none', padding: 0}}>
                <li style={{marginBottom: '10px'}}><a href="/" style={{color: 'white', textDecoration: 'none', opacity: '0.8'}}>Home</a></li>
                <li style={{marginBottom: '10px'}}><a href="/classes" style={{color: 'white', textDecoration: 'none', opacity: '0.8'}}>Classes</a></li>
                <li style={{marginBottom: '10px'}}><a href="/posts" style={{color: 'white', textDecoration: 'none', opacity: '0.8'}}>Videos</a></li>
                <li style={{marginBottom: '10px'}}><a href="/articles" style={{color: 'white', textDecoration: 'none', opacity: '0.8'}}>Articles</a></li>
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
            </div>
            <div className="col-lg-3 mb-4">
              <h5 style={{fontWeight: '600', marginBottom: '20px', color: '#f36100'}}>Follow Us</h5>
              <div style={{display: 'flex', gap: '15px'}}>
                <a href="#" style={{width: '45px', height: '45px', background: 'linear-gradient(45deg, #3b5998, #4267B2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'}}>
                  <i className="fab fa-facebook-f" style={{color: 'white', fontSize: '18px'}}></i>
                </a>
                <a href="#" style={{width: '45px', height: '45px', background: 'linear-gradient(45deg, #FF0000, #FF4444)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none'}}>
                  <i className="fab fa-youtube" style={{color: 'white', fontSize: '18px'}}></i>
                </a>
              </div>
            </div>
          </div>
          <hr style={{border: 'none', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '40px 0 20px'}} />
          <div className="row">
            <div className="col-12 text-center">
              <p style={{margin: 0, opacity: '0.6', fontSize: '14px'}}>
                Copyright © 2024 Elite Sports Academy. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Article Modal */}
      {showModal && selectedArticle && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowModal(false)}
        >
          <div 
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              maxWidth: '800px',
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setShowModal(false)}
              style={{
                position: 'absolute',
                top: '15px',
                right: '15px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                zIndex: 1,
                color: '#666'
              }}
            >
              ×
            </button>
            
            {selectedArticle.featuredImage && (
              <div style={{ height: '300px', overflow: 'hidden', borderRadius: '15px 15px 0 0' }}>
                <img 
                  src={selectedArticle.featuredImage} 
                  alt={selectedArticle.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            )}
            
            <div style={{ padding: '30px' }}>
              <div style={{ marginBottom: '20px' }}>
                <span style={{
                  backgroundColor: selectedArticle.category === 'crossfit' ? '#ff5722' : 
                                 selectedArticle.category === 'karate' ? '#2196f3' : 
                                 selectedArticle.category === 'zumba' ? '#9c27b0' : 
                                 selectedArticle.category === 'fitness' ? '#4caf50' : 
                                 selectedArticle.category === 'nutrition' ? '#ff9800' : '#666',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  textTransform: 'uppercase',
                  fontWeight: '600'
                }}>
                  {selectedArticle.category}
                </span>
              </div>
              
              <h2 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '15px', color: '#333' }}>
                {selectedArticle.title}
              </h2>
              
              <div style={{ marginBottom: '20px', color: '#666', fontSize: '14px' }}>
                <i className="fas fa-calendar me-2"></i>
                {new Date(selectedArticle.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              
              <div style={{ lineHeight: '1.8', color: '#444', fontSize: '16px', marginBottom: '20px' }}>
                {selectedArticle.content ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedArticle.content.replace(/\n/g, '<br>') }} />
                ) : (
                  <div>
                    <p>{selectedArticle.excerpt}</p>
                    <p>This is a sample article content. In a real application, this would contain the full article text with proper formatting, images, and rich content.</p>
                    <p>The article would include detailed information about the topic, expert insights, practical tips, and actionable advice for readers.</p>
                  </div>
                )}
              </div>
              
              {selectedArticle.tags && selectedArticle.tags.length > 0 && (
                <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
                  <h6 style={{ marginBottom: '10px', color: '#666' }}>Tags:</h6>
                  {selectedArticle.tags.map(tag => (
                    <span key={tag} style={{
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2',
                      padding: '5px 12px',
                      borderRadius: '15px',
                      fontSize: '12px',
                      marginRight: '8px',
                      marginBottom: '8px',
                      display: 'inline-block'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}