export default function Navbar() {
  return (
    <header className="fixed-top" style={{background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', boxShadow: '0 2px 30px rgba(0,0,0,0.08)', borderBottom: '1px solid rgba(0,0,0,0.05)'}}>
      <div className="container">
        <nav className="navbar navbar-expand-lg navbar-light p-0">
          <div className="d-flex align-items-center">
            <img src="/img/eliet_logo.jpg" width="55" height="55" alt="Elite Sports Academy" className="rounded-circle me-3" style={{boxShadow: '0 4px 15px rgba(243,97,0,0.2)'}} />
            <div>
              <h4 className="mb-0 fw-bold" style={{color: '#2c3e50', fontSize: '1.4rem'}}>Elite Sports</h4>
              <small className="text-muted fw-medium">Academy</small>
            </div>
          </div>
          
          <button className="navbar-toggler border-0 p-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" style={{boxShadow: 'none'}}>
            <span className="navbar-toggler-icon"></span>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <div className="navbar-nav ms-auto d-flex align-items-center gap-2">
              <a href="/" className="nav-link text-decoration-none fw-semibold px-3 py-2 rounded-pill" style={{color: '#f36100', background: 'rgba(243,97,0,0.1)', transition: 'all 0.3s'}}>Home</a>
              <a href="/classes" className="nav-link text-decoration-none fw-medium px-3 py-2 rounded-pill" style={{color: '#2c3e50', transition: 'all 0.3s'}}>Classes</a>
              <a href="/posts" className="nav-link text-decoration-none fw-medium px-3 py-2 rounded-pill" style={{color: '#2c3e50', transition: 'all 0.3s'}}>Videos</a>
              <a href="/articles" className="nav-link text-decoration-none fw-medium px-3 py-2 rounded-pill" style={{color: '#2c3e50', transition: 'all 0.3s'}}>Articles</a>
              <a href="/login" className="nav-link text-decoration-none fw-medium px-3 py-2 rounded-pill" style={{color: '#2c3e50', transition: 'all 0.3s'}}>Member Login</a>
              <div className="nav-link fw-semibold px-3 py-2 rounded-pill d-none d-lg-block" style={{color: '#f36100', background: 'rgba(243,97,0,0.1)'}}>
                <i className="fas fa-phone me-2"></i>
                (+94) 77 109 5334
              </div>
            </div>
          </div>
        </nav>
      </div>
      
      <style jsx>{`
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
    </header>
  )
}