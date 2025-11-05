import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import GymDashboard from '../components/GymDashboard';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin-login');
    }
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>
      
      <nav style={{ 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)', 
        padding: '20px 0', 
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        borderBottom: '3px solid #f36100'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: 'linear-gradient(135deg, #f36100 0%, #ff8c42 100%)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                boxShadow: '0 4px 15px rgba(243, 97, 0, 0.3)'
              }}>
                🏋️
              </div>
              <div>
                <h2 style={{ color: 'white', margin: 0, fontSize: '24px', fontWeight: '700' }}>Elite Sports Academy</h2>
                <p style={{ color: '#ccc', margin: 0, fontSize: '14px' }}>Management Dashboard</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => router.push('/admin')}
                style={{ 
                  background: 'linear-gradient(135deg, #f36100 0%, #ff8c42 100%)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px 20px', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: '0 4px 15px rgba(243, 97, 0, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                ⚙️ Admin Panel
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  router.push('/admin-login');
                }}
                style={{ 
                  background: 'linear-gradient(135deg, #dc3545 0%, #e85d75 100%)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '12px 20px', 
                  borderRadius: '8px', 
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <GymDashboard />
    </>
  );
}