import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function ClassAssignment() {
  const router = useRouter();
  const [instructors, setInstructors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      router.push('/admin-login');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [instructorsRes, classesRes] = await Promise.all([
        fetch('/api/instructors'),
        fetch('/api/classes')
      ]);
      
      const instructorsData = await instructorsRes.json();
      const classesData = await classesRes.json();
      
      setInstructors(instructorsData);
      setClasses(classesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const autoAssignClasses = async () => {
    try {
      for (const instructor of instructors) {
        const matchingClasses = classes.filter(cls => 
          instructor.specialization.includes(cls.category) && 
          (!cls.instructor || cls.instructor === instructor.name)
        );
        
        if (matchingClasses.length > 0) {
          await fetch('/api/instructors/assign-classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              instructorId: instructor._id,
              classIds: matchingClasses.map(c => c._id)
            })
          });
        }
      }
      alert('Auto-assignment completed!');
      fetchData();
    } catch (error) {
      alert('Auto-assignment failed');
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <nav style={{ backgroundColor: '#1a1a1a', padding: '15px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ color: 'white', margin: 0 }}>Class Assignment Management</h2>
            <button 
              onClick={() => router.push('/admin')}
              style={{ background: '#28a745', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
            >
              Back to Admin
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '5px', border: '1px solid #ffeaa7', marginBottom: '20px' }}>
          <h6 style={{ color: '#856404', marginBottom: '10px' }}>Quick Actions:</h6>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button 
              onClick={autoAssignClasses}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Auto-Assign by Specialization
            </button>
            <button 
              onClick={() => {
                const unassignedClasses = classes.filter(cls => !cls.instructor || cls.instructor === '');
                alert(`Found ${unassignedClasses.length} unassigned classes: ${unassignedClasses.map(c => c.name).join(', ')}`);
              }}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Check Unassigned Classes
            </button>
          </div>
        </div>

        <div style={{ backgroundColor: '#e3f2fd', padding: '20px', borderRadius: '8px' }}>
          <h5 style={{ color: '#1976d2', marginBottom: '15px' }}>Class Assignment Overview</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '15px' }}>
            {instructors.map(instructor => (
              <div key={instructor._id} style={{ backgroundColor: 'white', padding: '15px', borderRadius: '5px', border: '1px solid #ddd' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{instructor.name}</strong>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      {instructor.specialization.join(', ')}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#f36100' }}>
                      {instructor.assignedClasses?.length || 0} Classes
                    </div>
                  </div>
                </div>
                {instructor.assignedClasses && instructor.assignedClasses.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    {instructor.assignedClasses.slice(0, 3).map(classId => {
                      const cls = classes.find(c => c._id === classId);
                      return cls ? (
                        <span key={classId} style={{ 
                          backgroundColor: cls.category === 'crossfit' ? '#ff5722' : cls.category === 'karate' ? '#2196f3' : '#9c27b0',
                          color: 'white',
                          padding: '2px 6px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          marginRight: '5px'
                        }}>
                          {cls.name}
                        </span>
                      ) : null;
                    })}
                    {instructor.assignedClasses.length > 3 && (
                      <span style={{ fontSize: '10px', color: '#666' }}>+{instructor.assignedClasses.length - 3} more</span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}