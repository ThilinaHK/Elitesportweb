import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      const activePosts = data.filter(post => post.isActive)
      // Sort by type priority: trending > featured > normal
      const sortedPosts = activePosts.sort((a, b) => {
        const typeOrder = { trending: 0, featured: 1, normal: 2 }
        return typeOrder[a.type] - typeOrder[b.type]
      })
      setPosts(sortedPosts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory)

  return (
    <>
      <Head>
        <title>Video Posts - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
          body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-weight: 400; line-height: 1.6; }
          .btn-primary-custom { background: linear-gradient(45deg, #f36100, #ff8c42); border: none; padding: 12px 25px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-radius: 25px; color: white; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 8px 25px rgba(243,97,0,0.3); }
          .btn-primary-custom:hover { background: linear-gradient(45deg, #e55100, #f36100); transform: translateY(-3px); box-shadow: 0 15px 35px rgba(243,97,0,0.4); }
          .card { transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); border: none; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
          .card:hover { transform: translateY(-8px); box-shadow: 0 20px 50px rgba(0,0,0,0.15); }
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
              <a href="/posts" className="text-decoration-none fw-semibold px-3 py-2 rounded-pill" style={{color: '#f36100', background: 'rgba(243,97,0,0.1)', transition: 'all 0.3s'}}>Videos</a>
              <a href="/articles" className="text-decoration-none fw-medium px-3 py-2 rounded-pill" style={{color: '#2c3e50', transition: 'all 0.3s'}}>Articles</a>
              <a href="/login" className="text-decoration-none fw-medium px-3 py-2 rounded-pill" style={{color: '#2c3e50', transition: 'all 0.3s'}}>Member Login</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{background: 'linear-gradient(135deg, rgba(0,0,0,0.7), rgba(243,97,0,0.8)), url(/img/video-bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', padding: '150px 0 100px', color: 'white', textAlign: 'center', marginTop: '90px'}}>
        <div className="container">
          <h1 style={{fontSize: '4rem', fontWeight: '800', marginBottom: '20px'}}>Training Videos</h1>
          <p style={{fontSize: '1.3rem', opacity: '0.9'}}>Watch our expert training sessions and tutorials</p>
        </div>
      </div>

      {/* Filter */}
      <section style={{padding: '60px 0', background: '#f8f9fa'}}>
        <div className="container">
          <div className="text-center" style={{marginBottom: '40px'}}>
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
                  fontWeight: '600'
                }}
              >
                All Videos ({posts.length})
              </button>
              {['crossfit', 'karate', 'zumba', 'general'].map(category => (
                <button 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? 'btn-primary-custom' : ''}
                  style={{
                    backgroundColor: selectedCategory === category ? '' : 'white',
                    color: selectedCategory === category ? '' : '#333',
                    border: selectedCategory === category ? 'none' : '2px solid #f36100',
                    padding: '12px 25px',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}
                >
                  {category} ({posts.filter(p => p.category === category).length})
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{textAlign: 'center', padding: '60px 0'}}>
              <div className="spinner-border text-primary" role="status" style={{width: '3rem', height: '3rem', color: '#f36100 !important'}}>
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3" style={{color: '#666'}}>Loading videos...</p>
            </div>
          ) : (
            <div className="row">
              {filteredPosts.map((post) => (
                <div key={post._id} className="col-lg-4 col-md-6 mb-4">
                  <div style={{background: 'white', borderRadius: '15px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', transition: 'transform 0.3s'}} className="h-100">
                    <div style={{position: 'relative', paddingBottom: '56.25%', height: 0}}>
                      <iframe
                        src={`https://www.youtube.com/embed/${post.videoId}`}
                        style={{position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'}}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div style={{padding: '20px'}}>
                      <div style={{marginBottom: '10px', display: 'flex', gap: '8px', flexWrap: 'wrap'}}>
                        <span style={{
                          backgroundColor: post.category === 'crossfit' ? '#ff5722' : post.category === 'karate' ? '#2196f3' : post.category === 'zumba' ? '#9c27b0' : '#666',
                          color: 'white',
                          padding: '4px 12px',
                          borderRadius: '15px',
                          fontSize: '12px',
                          textTransform: 'uppercase',
                          fontWeight: '600'
                        }}>
                          {post.category}
                        </span>
                        {post.type !== 'normal' && (
                          <span style={{
                            backgroundColor: post.type === 'trending' ? '#ff9800' : '#e91e63',
                            color: 'white',
                            padding: '4px 12px',
                            borderRadius: '15px',
                            fontSize: '12px',
                            textTransform: 'uppercase',
                            fontWeight: '600'
                          }}>
                            {post.type === 'trending' ? '🔥 TRENDING' : '⭐ FEATURED'}
                          </span>
                        )}
                      </div>
                      <h5 style={{fontSize: '1.2rem', fontWeight: '600', marginBottom: '10px', color: '#333'}}>{post.title}</h5>
                      <p style={{color: '#666', fontSize: '14px', lineHeight: '1.6'}}>{post.description}</p>
                      <div style={{fontSize: '12px', color: '#999', marginTop: '15px'}}>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  )
}