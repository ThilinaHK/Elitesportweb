                {activeTab === 'roles' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Instructor Role Management</h3>
                    </div>

                    <div className="row">
                      {instructors.map((instructor) => (
                        <div key={instructor._id} className="col-md-6" style={{ marginBottom: '20px' }}>
                          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', border: '1px solid #dee2e6' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                              {instructor.image ? (
                                <img 
                                  src={instructor.image} 
                                  alt={instructor.name}
                                  style={{ width: '50px', height: '50px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                              ) : (
                                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(45deg, #f36100, #ff8c42)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '18px', fontWeight: '600' }}>
                                  {instructor.name.charAt(0)}
                                </div>
                              )}
                              <div>
                                <h5 style={{ margin: 0, color: '#333' }}>{instructor.name}</h5>
                                <span style={{ 
                                  backgroundColor: instructor.position === 'ceo' ? '#dc3545' : instructor.position === 'chief_instructor' ? '#fd7e14' : instructor.position === 'head_trainer' ? '#6f42c1' : instructor.position === 'senior_instructor' ? '#20c997' : '#6c757d',
                                  color: 'white',
                                  padding: '3px 8px',
                                  borderRadius: '12px',
                                  fontSize: '11px',
                                  textTransform: 'uppercase'
                                }}>
                                  {instructor.position?.replace('_', ' ') || 'instructor'}
                                </span>
                              </div>
                            </div>
                            
                            <div style={{ marginBottom: '15px' }}>
                              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#333' }}>Admin Panel Access & Permissions:</label>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {[
                                  { key: 'members', label: '👤 Members' },
                                  { key: 'classes', label: '🏅 Classes' },
                                  { key: 'attendance', label: '📊 Attendance' },
                                  { key: 'payments', label: '💳 Payments' },
                                  { key: 'diets', label: '🥗 Diet Plans' },
                                  { key: 'exercises', label: '💪 Exercise Plans' },
                                  { key: 'posts', label: '🎥 Video Posts' },
                                  { key: 'articles', label: '📰 Articles' },
                                  { key: 'bookings', label: '📅 Bookings' },
                                  { key: 'notifications', label: '🔔 Notifications' },
                                  { key: 'reports', label: '📊 Reports' },
                                  { key: 'videos', label: '🎬 Videos' }
                                ].map(tab => {
                                  const permissions = instructor.adminPermissions || {}
                                  const tabPermissions = permissions[tab.key] || { access: false, read: false, write: false }
                                  
                                  return (
                                    <div key={tab.key} style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      justifyContent: 'space-between',
                                      padding: '8px 12px',
                                      backgroundColor: tabPermissions.access ? '#e8f5e8' : '#f8f9fa',
                                      borderRadius: '6px',
                                      border: '1px solid #dee2e6'
                                    }}>
                                      <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                        <input 
                                          type="checkbox" 
                                          checked={tabPermissions.access}
                                          onChange={async (e) => {
                                            const newPermissions = {
                                              ...permissions,
                                              [tab.key]: {
                                                access: e.target.checked,
                                                read: e.target.checked ? tabPermissions.read : false,
                                                write: e.target.checked ? tabPermissions.write : false
                                              }
                                            }
                                            
                                            try {
                                              const response = await fetch(`/api/instructors/${instructor._id}`, {
                                                method: 'PUT',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ ...instructor, adminPermissions: newPermissions })
                                              })
                                              if (response.ok) {
                                                fetchInstructors()
                                                showToast(`${tab.label} access updated for ${instructor.name}`, 'success')
                                              }
                                            } catch (error) {
                                              console.error('Error updating access:', error)
                                            }
                                          }}
                                          style={{ marginRight: '8px' }}
                                        />
                                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{tab.label}</span>
                                      </div>
                                      
                                      {tabPermissions.access && (
                                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                          <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', cursor: 'pointer' }}>
                                            <input 
                                              type="checkbox" 
                                              checked={tabPermissions.read}
                                              onChange={async (e) => {
                                                const newPermissions = {
                                                  ...permissions,
                                                  [tab.key]: {
                                                    ...tabPermissions,
                                                    read: e.target.checked
                                                  }
                                                }
                                                
                                                try {
                                                  const response = await fetch(`/api/instructors/${instructor._id}`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ ...instructor, adminPermissions: newPermissions })
                                                  })
                                                  if (response.ok) {
                                                    fetchInstructors()
                                                  }
                                                } catch (error) {
                                                  console.error('Error updating permissions:', error)
                                                }
                                              }}
                                              style={{ marginRight: '4px' }}
                                            />
                                            <span style={{ color: '#28a745' }}>📖 Read</span>
                                          </label>
                                          
                                          <label style={{ display: 'flex', alignItems: 'center', fontSize: '12px', cursor: 'pointer' }}>
                                            <input 
                                              type="checkbox" 
                                              checked={tabPermissions.write}
                                              onChange={async (e) => {
                                                const newPermissions = {
                                                  ...permissions,
                                                  [tab.key]: {
                                                    ...tabPermissions,
                                                    write: e.target.checked
                                                  }
                                                }
                                                
                                                try {
                                                  const response = await fetch(`/api/instructors/${instructor._id}`, {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ ...instructor, adminPermissions: newPermissions })
                                                  })
                                                  if (response.ok) {
                                                    fetchInstructors()
                                                  }
                                                } catch (error) {
                                                  console.error('Error updating permissions:', error)
                                                }
                                              }}
                                              style={{ marginRight: '4px' }}
                                            />
                                            <span style={{ color: '#dc3545' }}>✏️ Write</span>
                                          </label>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                              <button 
                                onClick={async () => {
                                  const allTabs = ['members', 'classes', 'attendance', 'payments', 'diets', 'exercises', 'posts', 'articles', 'bookings', 'notifications', 'reports', 'videos']
                                  const fullPermissions = {}
                                  allTabs.forEach(tab => {
                                    fullPermissions[tab] = { access: true, read: true, write: true }
                                  })
                                  
                                  try {
                                    const response = await fetch(`/api/instructors/${instructor._id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ ...instructor, adminPermissions: fullPermissions })
                                    })
                                    if (response.ok) {
                                      fetchInstructors()
                                      showToast(`Full access with read/write granted to ${instructor.name}`, 'success')
                                    }
                                  } catch (error) {
                                    console.error('Error granting full access:', error)
                                  }
                                }}
                                style={{
                                  backgroundColor: '#28a745',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                Grant All
                              </button>
                              <button 
                                onClick={async () => {
                                  const allTabs = ['members', 'classes', 'attendance', 'payments', 'diets', 'exercises', 'posts', 'articles', 'bookings', 'notifications', 'reports', 'videos']
                                  const readOnlyPermissions = {}
                                  allTabs.forEach(tab => {
                                    readOnlyPermissions[tab] = { access: true, read: true, write: false }
                                  })
                                  
                                  try {
                                    const response = await fetch(`/api/instructors/${instructor._id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ ...instructor, adminPermissions: readOnlyPermissions })
                                    })
                                    if (response.ok) {
                                      fetchInstructors()
                                      showToast(`Read-only access granted to ${instructor.name}`, 'success')
                                    }
                                  } catch (error) {
                                    console.error('Error granting read-only access:', error)
                                  }
                                }}
                                style={{
                                  backgroundColor: '#17a2b8',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                Read Only
                              </button>
                              <button 
                                onClick={async () => {
                                  try {
                                    const response = await fetch(`/api/instructors/${instructor._id}`, {
                                      method: 'PUT',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({ ...instructor, adminPermissions: {} })
                                    })
                                    if (response.ok) {
                                      fetchInstructors()
                                      showToast(`All access revoked from ${instructor.name}`, 'success')
                                    }
                                  } catch (error) {
                                    console.error('Error revoking access:', error)
                                  }
                                }}
                                style={{
                                  backgroundColor: '#dc3545',
                                  color: 'white',
                                  border: 'none',
                                  padding: '6px 12px',
                                  borderRadius: '4px',
                                  cursor: 'pointer',
                                  fontSize: '12px'
                                }}
                              >
                                Revoke All
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {instructors.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                        <p>No instructors found. Add instructors first to manage their roles.</p>
                      </div>
                    )}
                  </>
                )}