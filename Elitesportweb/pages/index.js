import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Elite Sports Academy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div style={{padding: '20px', textAlign: 'center'}}>
        <h1>Elite Sports Academy</h1>
        <p>Welcome to our fitness academy</p>
        
        <div style={{margin: '40px 0'}}>
          <h2>Our Programs</h2>
          <div style={{display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap'}}>
            <div style={{border: '1px solid #ddd', padding: '20px', borderRadius: '8px'}}>
              <h3>CrossFit</h3>
              <p>High-intensity functional fitness</p>
            </div>
            <div style={{border: '1px solid #ddd', padding: '20px', borderRadius: '8px'}}>
              <h3>Karate</h3>
              <p>Traditional martial arts</p>
            </div>
            <div style={{border: '1px solid #ddd', padding: '20px', borderRadius: '8px'}}>
              <h3>Zumba</h3>
              <p>Dance fitness classes</p>
            </div>
          </div>
        </div>

        <div style={{margin: '40px 0'}}>
          <h2>Contact Us</h2>
          <p>Phone: (+94) 77 109 5334</p>
          <p>Email: EliteSportsAcademy@gmail.com</p>
          <p>Address: 162/2/1 Colombo - Batticaloa Hwy, Avissawella</p>
        </div>

        <div style={{margin: '40px 0'}}>
          <a href="/classes" style={{background: '#f36100', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', margin: '0 10px'}}>
            View Classes
          </a>
          <a href="/login" style={{background: '#333', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', margin: '0 10px'}}>
            Member Login
          </a>
          <a href="/admin" style={{background: '#666', color: 'white', padding: '10px 20px', textDecoration: 'none', borderRadius: '5px', margin: '0 10px'}}>
            Admin Panel
          </a>
        </div>
      </div>
    </>
  )
}