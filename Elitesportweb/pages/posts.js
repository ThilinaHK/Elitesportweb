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
          body { font-family: 'Poppins', sans-serif; }
          .btn-primary-custom { background: linear-gradient(45deg, #f36100, #ff8c42); border: none; padding: 12px 25px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; border-radius: 25px; color: white; cursor: pointer; transition: all 0.3s; }
          .btn-primary-custom:hover { background: linear-gradient(45deg, #e55100, #f36100); transform: translateY(-2px); }
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
              <a href="/" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Home</a>
              <a href="/classes" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Classes</a>
              <a href="/posts" style={{color: '#f36100', textDecoration: 'none', fontWeight: '600', fontSize: '16px'}}>Videos</a>
              <a href="/login" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Member Login</a>
              <a href="/instructor-login" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Instructor</a>
              <a href="/admin-login" style={{color: '#333', textDecoration: 'none', fontWeight: '500', fontSize: '16px'}}>Admin</a>
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
              <p>Loading videos...</p>
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