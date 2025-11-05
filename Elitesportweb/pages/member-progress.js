import { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function MemberProgress() {
  const router = useRouter()
  const [progress, setProgress] = useState([])
  const [progressForm, setProgressForm] = useState({
    weight: '',
    bodyFat: '',
    muscleMass: '',
    measurements: { chest: '', waist: '', hips: '', arms: '', thighs: '' },
    goals: '',
    achievements: '',
    notes: ''
  })
  const [member, setMember] = useState(null)

  useEffect(() => {
    const memberToken = localStorage.getItem('memberToken')
    const memberData = localStorage.getItem('memberData')
    if (!memberToken || !memberData) {
      router.push('/member-login')
      return
    }
    const parsedMember = JSON.parse(memberData)
    setMember(parsedMember)
    fetchProgress(parsedMember._id)
  }, [])

  const fetchProgress = async (memberId) => {
    try {
      const response = await fetch(`/api/progress?memberId=${memberId}`)
      const data = await response.json()
      setProgress(data)
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...progressForm,
          memberId: member._id,
          memberName: member.fullName || member.name
        })
      })
      if (response.ok) {
        fetchProgress(member._id)
        setProgressForm({
          weight: '',
          bodyFat: '',
          muscleMass: '',
          measurements: { chest: '', waist: '', hips: '', arms: '', thighs: '' },
          goals: '',
          achievements: '',
          notes: ''
        })
        alert('Progress updated successfully!')
      }
    } catch (error) {
      console.error('Error saving progress:', error)
    }
  }

  return (
    <>
      <Head>
        <title>My Progress - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      </Head>
      
      <nav style={{ backgroundColor: '#f36100', padding: '15px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'white', margin: 0 }}>My Progress</h2>
            <button 
              onClick={() => router.push('/member-dashboard')}
              style={{ background: 'white', color: '#f36100', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ padding: '30px 0' }}>
        <div className="row">
          <div className="col-md-6">
            <h3>Update Progress</h3>
            <form onSubmit={handleSubmit} style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <div className="row">
                <div className="col-md-6">
                  <label>Weight (kg)</label>
                  <input 
                    type="number" 
                    value={progressForm.weight}
                    onChange={(e) => setProgressForm({...progressForm, weight: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
                <div className="col-md-6">
                  <label>Body Fat (%)</label>
                  <input 
                    type="number" 
                    value={progressForm.bodyFat}
                    onChange={(e) => setProgressForm({...progressForm, bodyFat: e.target.value})}
                    style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                  />
                </div>
              </div>
              
              <label>Goals</label>
              <textarea 
                value={progressForm.goals}
                onChange={(e) => setProgressForm({...progressForm, goals: e.target.value})}
                style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }}
              />
              
              <label>Achievements</label>
              <textarea 
                value={progressForm.achievements}
                onChange={(e) => setProgressForm({...progressForm, achievements: e.target.value})}
                style={{ width: '100%', padding: '8px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px', height: '60px' }}
              />
              
              <button type="submit" style={{ backgroundColor: '#f36100', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '4px', cursor: 'pointer' }}>
                Save Progress
              </button>
            </form>
          </div>
          
          <div className="col-md-6">
            <h3>Progress History</h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {progress.map((prog) => (
                <div key={prog._id} style={{ backgroundColor: 'white', padding: '15px', marginBottom: '10px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                  <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                    {new Date(prog.date).toLocaleDateString()}
                  </div>
                  <div><strong>Weight:</strong> {prog.weight ? `${prog.weight} kg` : 'N/A'}</div>
                  <div><strong>Body Fat:</strong> {prog.bodyFat ? `${prog.bodyFat}%` : 'N/A'}</div>
                  {prog.goals && <div><strong>Goals:</strong> {prog.goals}</div>}
                  {prog.achievements && <div><strong>Achievements:</strong> {prog.achievements}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}