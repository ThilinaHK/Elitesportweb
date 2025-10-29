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
      
      <nav style={{ backgroundColor: '#1a1a1a', padding: '15px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'white', margin: 0 }}>Elite Sports Academy</h2>
            <div style={{ display: 'flex', gap: '15px' }}>
              <button 
                onClick={() => router.push('/admin')}
                style={{ 
                  background: '#f36100', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Admin Panel
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('adminToken');
                  router.push('/admin-login');
                }}
                style={{ 
                  background: '#dc3545', 
                  color: 'white', 
                  border: 'none', 
                  padding: '8px 16px', 
                  borderRadius: '4px', 
                  cursor: 'pointer' 
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <GymDashboard />
    </>
  );
}