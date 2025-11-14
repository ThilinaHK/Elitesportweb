import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'

export default function Articles() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles')
      const data = await response.json()
      setArticles(data.articles || [])
    } catch (error) {
      console.error('Error fetching articles:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryColor = (category) => {
    switch(category) {
      case 'fitness': return '#28a745'
      case 'nutrition': return '#17a2b8'
      case 'crossfit': return '#f36100'
      case 'karate': return '#2196f3'
      case 'zumba': return '#9c27b0'
      default: return '#6c757d'
    }
  }

  return (
    <>
      <Head>
        <title>Articles - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
      </Head>

      <Navbar />

      <div style={{marginTop: '100px', minHeight: '100vh', background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
        <div className="container py-5">
          <div className="text-center mb-5">
            <h1 className="fw-bold mb-3" style={{fontSize: '3rem', color: '#333'}}>Fitness Articles</h1>
            <p className="text-muted fs-5">Read our latest fitness tips and expert advice</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              {articles.map((article) => (
                <div key={article._id} className="col-lg-4 col-md-6">
                  <div className="card border-0 shadow-sm h-100">
                    {article.featuredImage && (
                      <img src={article.featuredImage} className="card-img-top" alt={article.title} style={{height: '200px', objectFit: 'cover'}} />
                    )}
                    <div className="card-body">
                      <div className="mb-2">
                        <span className={`badge text-white`} style={{backgroundColor: getCategoryColor(article.category)}}>
                          {article.category?.toUpperCase() || 'GENERAL'}
                        </span>
                        {article.isPublished && (
                          <span className="badge bg-success text-white ms-1">PUBLISHED</span>
                        )}
                      </div>
                      <h5 className="card-title">{article.title}</h5>
                      <p className="card-text text-muted small">
                        {article.excerpt || article.content?.substring(0, 100) + '...' || 'Read this amazing article...'}
                      </p>
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </small>
                        <a href={`/articles/${article._id}`} className="btn btn-sm btn-outline-primary">Read More</a>
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