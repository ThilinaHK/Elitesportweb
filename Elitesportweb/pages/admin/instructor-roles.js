import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Toast, { showToast } from '../../components/Toast';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function InstructorRoles() {
  const [instructors, setInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('classes');
  const [filters, setFilters] = useState({
    search: '',
    position: '',
    status: ''
  });
  const router = useRouter();

  const privilegeTabs = {
    classes: {
      label: 'Class Management',
      icon: 'fas fa-dumbbell',
      privileges: [
        { key: 'canManageClasses', label: 'Manage Classes' },
        { key: 'canCreateClasses', label: 'Create Classes' },
        { key: 'canDeleteClasses', label: 'Delete Classes' },
        { key: 'canViewClassSchedule', label: 'View Schedule' },
        { key: 'canManageBookings', label: 'Manage Bookings' }
      ]
    },
    members: {
      label: 'Member Management',
      icon: 'fas fa-users',
      privileges: [
        { key: 'canManageMembers', label: 'Manage Members' },
        { key: 'canViewMembers', label: 'View Members' },
        { key: 'canEditMembers', label: 'Edit Members' },
        { key: 'canDeleteMembers', label: 'Delete Members' },
        { key: 'canViewMemberProgress', label: 'View Progress' }
      ]
    },
    financial: {
      label: 'Financial',
      icon: 'fas fa-dollar-sign',
      privileges: [
        { key: 'canViewPayments', label: 'View Payments' },
        { key: 'canManagePayments', label: 'Manage Payments' },
        { key: 'canViewRevenue', label: 'View Revenue' },
        { key: 'canGenerateInvoices', label: 'Generate Invoices' }
      ]
    },
    reports: {
      label: 'Reports & Analytics',
      icon: 'fas fa-chart-bar',
      privileges: [
        { key: 'canViewReports', label: 'View Reports' },
        { key: 'canViewAnalytics', label: 'View Analytics' },
        { key: 'canExportData', label: 'Export Data' },
        { key: 'canViewAttendance', label: 'View Attendance' }
      ]
    },
    admin: {
      label: 'Administration',
      icon: 'fas fa-cog',
      privileges: [
        { key: 'canManageInstructors', label: 'Manage Instructors' },
        { key: 'canManageSettings', label: 'Manage Settings' },
        { key: 'canViewLogs', label: 'View Logs' },
        { key: 'canBackupData', label: 'Backup Data' }
      ]
    }
  };

  useEffect(() => {
    fetchInstructors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [instructors, filters]);

  const applyFilters = () => {
    let filtered = instructors;
    
    if (filters.search) {
      filtered = filtered.filter(instructor => 
        instructor.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        instructor.email.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.position) {
      filtered = filtered.filter(instructor => instructor.position === filters.position);
    }
    
    if (filters.status) {
      filtered = filtered.filter(instructor => instructor.status === filters.status);
    }
    
    setFilteredInstructors(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', position: '', status: '' });
  };

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

  const grantAllPrivileges = (instructorId, tabKey) => {
    const instructor = instructors.find(i => i._id === instructorId);
    const updatedPrivileges = { ...instructor.privileges };
    
    privilegeTabs[tabKey].privileges.forEach(priv => {
      updatedPrivileges[priv.key] = true;
    });
    
    setInstructors(prev => prev.map(inst => 
      inst._id === instructorId 
        ? { ...inst, privileges: updatedPrivileges }
        : inst
    ));
    
    updatePrivileges(instructorId, updatedPrivileges);
  };

  const revokeAllPrivileges = (instructorId, tabKey) => {
    const instructor = instructors.find(i => i._id === instructorId);
    const updatedPrivileges = { ...instructor.privileges };
    
    privilegeTabs[tabKey].privileges.forEach(priv => {
      updatedPrivileges[priv.key] = false;
    });
    
    setInstructors(prev => prev.map(inst => 
      inst._id === instructorId 
        ? { ...inst, privileges: updatedPrivileges }
        : inst
    ));
    
    updatePrivileges(instructorId, updatedPrivileges);
  };

  if (loading) return <LoadingSpinner size="large" text="Loading instructors..." />;

  return (
    <>
      <Head>
        <title>Instructor Roles - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
        <style jsx>{`
          .avatar-sm {
            width: 32px;
            height: 32px;
            font-size: 14px;
          }
          .nav-tabs .nav-link {
            border-radius: 0;
            border: none;
            border-bottom: 3px solid transparent;
            color: #6c757d;
          }
          .nav-tabs .nav-link.active {
            background: none;
            border-bottom-color: #0d6efd;
            color: #0d6efd;
            font-weight: 600;
          }
          .table th {
            font-weight: 600;
            font-size: 0.9rem;
          }
          .form-check-input:checked {
            background-color: #198754;
            border-color: #198754;
          }
        `}</style>
      </Head>
      
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2><i className="fas fa-user-shield me-2"></i>Instructor Role Management</h2>
          <button className="btn btn-secondary" onClick={() => router.back()}>
            <i className="fas fa-arrow-left me-2"></i>Back
          </button>
        </div>

        <div className="card">
          <div className="card-header">
            <ul className="nav nav-tabs card-header-tabs" role="tablist">
              {Object.entries(privilegeTabs).map(([key, tab]) => (
                <li className="nav-item" key={key}>
                  <button
                    className={`nav-link ${activeTab === key ? 'active' : ''}`}
                    onClick={() => setActiveTab(key)}
                    type="button"
                  >
                    <i className={`${tab.icon} me-2`}></i>
                    {tab.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="card-body">
            <div className="tab-content">
              <div className="tab-pane fade show active">
                <div className="row mb-4">
                  <div className="col-md-8">
                    <h5 className="text-primary">
                      <i className={`${privilegeTabs[activeTab].icon} me-2`}></i>
                      {privilegeTabs[activeTab].label} Privileges
                    </h5>
                  </div>
                  <div className="col-md-4 text-end">
                    <span className="text-muted">
                      Showing {filteredInstructors.length} of {instructors.length} instructors
                    </span>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-4">
                    <div className="input-group">
                      <span className="input-group-text"><i className="fas fa-search"></i></span>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by name or email..."
                        value={filters.search}
                        onChange={(e) => handleFilterChange('search', e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={filters.position}
                      onChange={(e) => handleFilterChange('position', e.target.value)}
                    >
                      <option value="">All Positions</option>
                      <option value="instructor">Instructor</option>
                      <option value="senior_instructor">Senior Instructor</option>
                      <option value="chief_instructor">Chief Instructor</option>
                      <option value="head_trainer">Head Trainer</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                      <option value="ceo">CEO</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <select
                      className="form-select"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="col-md-2">
                    <button 
                      className="btn btn-outline-secondary w-100"
                      onClick={clearFilters}
                      title="Clear Filters"
                    >
                      <i className="fas fa-times"></i> Clear
                    </button>
                  </div>
                </div>
                
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead className="table-dark">
                      <tr>
                        <th>Instructor</th>
                        <th>Position</th>
                        <th>Email</th>
                        {privilegeTabs[activeTab].privileges.map(priv => (
                          <th key={priv.key} className="text-center">{priv.label}</th>
                        ))}
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredInstructors.length === 0 ? (
                        <tr>
                          <td colSpan={privilegeTabs[activeTab].privileges.length + 4} className="text-center py-4">
                            <i className="fas fa-search fa-2x text-muted mb-2"></i>
                            <p className="text-muted mb-0">No instructors found matching your filters</p>
                          </td>
                        </tr>
                      ) : (
                        filteredInstructors.map(instructor => (
                        <tr key={instructor._id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                                <i className="fas fa-user text-white"></i>
                              </div>
                              <strong>{instructor.name}</strong>
                            </div>
                          </td>
                          <td>
                            <span className={`badge ${
                              instructor.position === 'ceo' ? 'bg-danger' :
                              instructor.position === 'manager' ? 'bg-warning' :
                              instructor.position === 'senior_instructor' ? 'bg-info' :
                              'bg-secondary'
                            }`}>
                              {instructor.position?.replace('_', ' ').toUpperCase()}
                            </span>
                          </td>
                          <td>{instructor.email}</td>
                          {privilegeTabs[activeTab].privileges.map(priv => (
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
                                  style={{ transform: 'scale(1.3)' }}
                                />
                              </div>
                            </td>
                          ))}
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-outline-success"
                                onClick={() => grantAllPrivileges(instructor._id, activeTab)}
                                title="Grant All"
                              >
                                <i className="fas fa-check-double"></i>
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => revokeAllPrivileges(instructor._id, activeTab)}
                                title="Revoke All"
                              >
                                <i className="fas fa-times"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    <Toast />
    </>
  );
}