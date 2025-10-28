import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Toast, { showToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function InstructorRoles() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const privileges = [
    { key: 'canManageClasses', label: 'Manage Classes' },
    { key: 'canViewReports', label: 'View Reports' },
    { key: 'canManageMembers', label: 'Manage Members' },
    { key: 'canViewPayments', label: 'View Payments' }
  ];

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/instructors');
      const data = await response.json();
      setInstructors(data.instructors || []);
    } catch (error) {
      console.error('Error fetching instructors:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePrivileges = async (instructorId, privileges) => {
    try {
      const response = await fetch(`/api/instructors/${instructorId}/privileges`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privileges })
      });
      
      if (response.ok) {
        fetchInstructors();
        showToast('Privileges updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error updating privileges:', error);
    }
  };

  const handlePrivilegeChange = (instructorId, privilegeKey, checked) => {
    // Update state immediately for UI feedback
    setInstructors(prev => prev.map(instructor => 
      instructor._id === instructorId 
        ? { 
            ...instructor, 
            privileges: { 
              ...instructor.privileges, 
              [privilegeKey]: checked 
            }
          }
        : instructor
    ));
    
    const instructor = instructors.find(i => i._id === instructorId);
    const updatedPrivileges = {
      ...instructor.privileges,
      [privilegeKey]: checked
    };
    updatePrivileges(instructorId, updatedPrivileges);
  };

  if (loading) return <LoadingSpinner size="large" text="Loading instructors..." />;

  return (
    <>
      <Head>
        <title>Instructor Roles - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>
      
      <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Instructor Role Management</h2>
        <button className="btn btn-secondary" onClick={() => router.back()}>
          Back
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Instructor</th>
                  <th>Email</th>
                  {privileges.map(priv => (
                    <th key={priv.key} className="text-center">{priv.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {instructors.map(instructor => (
                  <tr key={instructor._id}>
                    <td>{instructor.name}</td>
                    <td>{instructor.email}</td>
                    {privileges.map(priv => (
                      <td key={priv.key} className="text-center">
                        <div className="form-check d-flex justify-content-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`${instructor._id}-${priv.key}`}
                            checked={instructor.privileges?.[priv.key] || false}
                            onChange={(e) => handlePrivilegeChange(
                              instructor._id, 
                              priv.key, 
                              e.target.checked
                            )}
                            style={{ transform: 'scale(1.2)' }}
                          />
                          <label 
                            className="form-check-label" 
                            htmlFor={`${instructor._id}-${priv.key}`}
                            style={{ display: 'none' }}
                          ></label>
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    <Toast />
    </>
  );
}