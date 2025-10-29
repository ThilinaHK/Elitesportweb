import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

export default function Posts() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/posts')
      const data = await response.json()
      setPosts((data || []).filter(post => post.type !== 'article'))
    } catch (error) {
      console.error('Error fetching posts:', error)
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

  return (
    <>
      <Head>
        <title>Videos - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
      </Head>

      <Navbar />

      <div style={{marginTop: '100px', minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="fw-bold mb-3" style={{fontSize: '3rem', color: '#333'}}>Training Videos</h1>
            <p className="text-muted fs-5">Watch our expert training videos and tutorials</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {posts.map((video) => (
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
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}