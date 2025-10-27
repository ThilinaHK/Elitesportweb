export default function Navigation({ currentPage = '' }) {
  return (
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
            <a href="/" className={`text-decoration-none ${currentPage === 'home' ? 'fw-semibold' : 'text-dark'}`} style={currentPage === 'home' ? {color: '#f36100'} : {}}>Home</a>
            <a href="/posts" className={`text-decoration-none ${currentPage === 'videos' ? 'fw-semibold' : 'text-dark'}`} style={currentPage === 'videos' ? {color: '#f36100'} : {}}>Videos</a>
            <a href="/login" className={`text-decoration-none ${currentPage === 'member' ? 'fw-semibold' : 'text-dark'}`} style={currentPage === 'member' ? {color: '#f36100'} : {}}>Member Login</a>
            <a href="/instructor-login" className={`text-decoration-none ${currentPage === 'instructor' ? 'fw-semibold' : 'text-dark'}`} style={currentPage === 'instructor' ? {color: '#f36100'} : {}}>Instructor</a>
            <a href="/admin-login" className={`text-decoration-none ${currentPage === 'admin' ? 'fw-semibold' : 'text-dark'}`} style={currentPage === 'admin' ? {color: '#f36100'} : {}}>Admin</a>
            <div className="text-primary fw-semibold">
              <i className="fas fa-phone me-2"></i>
              (+94) 77 109 5334
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}