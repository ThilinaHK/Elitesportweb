import { useState, useEffect } from 'react'
import Head from 'next/head'

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

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
              <a href="/" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Home</a>
              <a href="/classes" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Classes</a>
              <a href="/posts" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Videos</a>
              <a href="/articles" style={{color: '#f36100', textDecoration: 'none', fontWeight: '600', fontSize: '16px'}}>Articles</a>
              <a href="/login" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Member Login</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '120px 0 80px', marginTop: '90px', color: 'white', textAlign: 'center'}}>
        <div className="container">
          <h1 style={{fontSize: '3.5rem', fontWeight: '800', marginBottom: '20px'}}>Fitness & Health Articles</h1>
          <p style={{fontSize: '1.3rem', opacity: '0.9', maxWidth: '600px', margin: '0 auto'}}>
            Expert insights, tips, and guides to help you on your fitness journey
          </p>
        </div>
      </section>

      {/* Articles Section */}
      <section style={{padding: '80px 0', background: '#f8f9fa'}}>
        <div className="container">
          {/* Category Filter */}
          <div style={{marginBottom: '40px', textAlign: 'center'}}>
            <div style={{display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '10px'}}>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  style={{
                    backgroundColor: selectedCategory === category ? '#f36100' : 'white',
                    color: selectedCategory === category ? 'white' : '#333',
                    border: '2px solid #f36100',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                    transition: 'all 0.3s'
                  }}
                >
                  {category === 'all' ? 'All Articles' : category}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{textAlign: 'center', padding: '60px 0'}}>
              <div style={{fontSize: '1.2rem', color: '#666'}}>Loading articles...</div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div style={{textAlign: 'center', padding: '60px 0'}}>
              <i className="fas fa-newspaper" style={{fontSize: '4rem', color: '#ddd', marginBottom: '20px'}}></i>
              <h3 style={{color: '#666', marginBottom: '10px'}}>No Articles Found</h3>
              <p style={{color: '#999'}}>Check back soon for new content!</p>
            </div>
          ) : (
            <div className="row">
              {filteredArticles.map((article) => (
                <div key={article._id} className="col-lg-4 col-md-6 mb-4">
                  <div style={{
                    background: 'white',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease',
                    height: '100%',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                  >
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
                            // Create a modal or navigate to full article
                            alert('Full article view coming soon!')
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
    </>
  )
}