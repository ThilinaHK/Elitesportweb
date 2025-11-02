import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function InstructorRoles() {
  const router = useRouter();
  const [instructors, setInstructors] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [assignedClasses, setAssignedClasses] = useState([]);

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

  const handleInstructorSelect = (instructor) => {
    setSelectedInstructor(instructor);
    setAssignedClasses(instructor.assignedClasses || []);
  };

  const handleClassToggle = (classId) => {
    if (assignedClasses.includes(classId)) {
      setAssignedClasses(assignedClasses.filter(id => id !== classId));
    } else {
      setAssignedClasses([...assignedClasses, classId]);
    }
  };

  const saveAssignment = async () => {
    if (!selectedInstructor) return;

    try {
      const response = await fetch('/api/instructors/assign-classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instructorId: selectedInstructor._id,
          classIds: assignedClasses
        })
      });

      if (response.ok) {
        alert('Classes assigned successfully!');
        fetchData(); // Refresh data
        setSelectedInstructor(null);
        setAssignedClasses([]);
      } else {
        alert('Failed to assign classes');
      }
    } catch (error) {
      console.error('Error assigning classes:', error);
      alert('Error assigning classes');
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
            <h2 style={{ color: 'white', margin: 0 }}>Instructor Class Assignment</h2>
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Instructors List */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>Select Instructor</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {instructors.map(instructor => (
                <div 
                  key={instructor._id}
                  onClick={() => handleInstructorSelect(instructor)}
                  style={{
                    padding: '1rem',
                    border: selectedInstructor?._id === instructor._id ? '2px solid #f36100' : '1px solid #ddd',
                    borderRadius: '4px',
                    marginBottom: '0.5rem',
                    cursor: 'pointer',
                    backgroundColor: selectedInstructor?._id === instructor._id ? '#fff3e0' : 'white'
                  }}
                >
                  <div style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{instructor.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {instructor.specialization.join(', ')} | {instructor.assignedClasses?.length || 0} classes assigned
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Class Assignment */}
          <div style={{ background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginBottom: '1.5rem', color: '#333' }}>
              {selectedInstructor ? `Assign Classes to ${selectedInstructor.name}` : 'Select an Instructor'}
            </h3>
            
            {selectedInstructor ? (
              <>
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Specialization:</strong> {selectedInstructor.specialization.join(', ')}
                </div>
                
                <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '1rem' }}>
                  {classes
                    .filter(cls => selectedInstructor.specialization.includes(cls.category))
                    .map(cls => (
                      <label 
                        key={cls._id} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          padding: '0.5rem',
                          border: '1px solid #eee',
                          borderRadius: '4px',
                          marginBottom: '0.5rem',
                          cursor: 'pointer'
                        }}
                      >
                        <input 
                          type="checkbox"
                          checked={assignedClasses.includes(cls._id)}
                          onChange={() => handleClassToggle(cls._id)}
                          style={{ marginRight: '0.5rem' }}
                        />
                        <div>
                          <div style={{ fontWeight: '600' }}>{cls.name}</div>
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            {cls.day} {cls.time} | {cls.category}
                          </div>
                        </div>
                      </label>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    onClick={saveAssignment}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Save Assignment
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedInstructor(null);
                      setAssignedClasses([]);
                    }}
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <p style={{ color: '#666' }}>Please select an instructor from the left panel to assign classes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}