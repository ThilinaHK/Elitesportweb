                {activeTab === 'plan-approval' && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                      <h3 style={{ margin: 0, color: '#333' }}>Plan Approval Management</h3>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Pending: {pendingPlans.dietPlans.length + pendingPlans.exercisePlans.length}</span>
                        <button 
                          onClick={fetchPendingPlans}
                          style={{
                            backgroundColor: '#17a2b8',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Refresh
                        </button>
                      </div>
                    </div>

                    {pendingPlans.dietPlans.length === 0 && pendingPlans.exercisePlans.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
                        <i className="fas fa-check-circle" style={{ fontSize: '48px', marginBottom: '20px', color: '#28a745' }}></i>
                        <h4>No Pending Plans</h4>
                        <p>All diet and exercise plans have been reviewed and approved.</p>
                      </div>
                    ) : (
                      <>
                        {pendingPlans.dietPlans.length > 0 && (
                          <>
                            <h4 style={{ color: '#28a745', marginBottom: '20px' }}>Pending Diet Plans ({pendingPlans.dietPlans.length})</h4>
                            <div className="row">
                              {pendingPlans.dietPlans.map((plan) => (
                                <div key={plan._id} className="col-md-6 col-lg-4" style={{ marginBottom: '20px' }}>
                                  <div style={{ backgroundColor: 'white', border: '1px solid #28a745', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                    <div style={{ marginBottom: '15px' }}>
                                      <h5 style={{ margin: '0 0 10px 0', color: '#28a745' }}>{plan.title}</h5>
                                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                                        <strong>Member:</strong> {plan.memberId?.fullName}<br/>
                                        <strong>Instructor:</strong> {plan.instructorId?.name}<br/>
                                        <strong>Duration:</strong> {plan.duration}<br/>
                                        <strong>Total Calories:</strong> {plan.totalCalories}
                                      </p>
                                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                                        {plan.description}
                                      </p>
                                      <div style={{ fontSize: '12px', color: '#999' }}>
                                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                                      <button 
                                        onClick={() => handlePlanApproval(plan._id, 'diet', 'approved')}
                                        style={{
                                          backgroundColor: '#28a745',
                                          color: 'white',
                                          border: 'none',
                                          padding: '8px 16px',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          flex: 1
                                        }}
                                      >
                                        <i className="fas fa-check"></i> Approve
                                      </button>
                                      <button 
                                        onClick={() => {
                                          const reason = prompt('Enter rejection reason (optional):')
                                          if (reason !== null) {
                                            handlePlanApproval(plan._id, 'diet', 'rejected', reason)
                                          }
                                        }}
                                        style={{
                                          backgroundColor: '#dc3545',
                                          color: 'white',
                                          border: 'none',
                                          padding: '8px 16px',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          flex: 1
                                        }}
                                      >
                                        <i className="fas fa-times"></i> Reject
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}

                        {pendingPlans.exercisePlans.length > 0 && (
                          <>
                            <h4 style={{ color: '#17a2b8', marginBottom: '20px', marginTop: '30px' }}>Pending Exercise Plans ({pendingPlans.exercisePlans.length})</h4>
                            <div className="row">
                              {pendingPlans.exercisePlans.map((plan) => (
                                <div key={plan._id} className="col-md-6 col-lg-4" style={{ marginBottom: '20px' }}>
                                  <div style={{ backgroundColor: 'white', border: '1px solid #17a2b8', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                                    <div style={{ marginBottom: '15px' }}>
                                      <h5 style={{ margin: '0 0 10px 0', color: '#17a2b8' }}>{plan.title}</h5>
                                      <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                        <span style={{ 
                                          backgroundColor: plan.category === 'crossfit' ? '#ff5722' : plan.category === 'karate' ? '#2196f3' : plan.category === 'zumba' ? '#9c27b0' : '#666',
                                          color: 'white',
                                          padding: '2px 8px',
                                          borderRadius: '12px',
                                          fontSize: '11px',
                                          textTransform: 'uppercase'
                                        }}>
                                          {plan.category}
                                        </span>
                                        <span style={{ 
                                          backgroundColor: plan.difficulty === 'beginner' ? '#28a745' : plan.difficulty === 'intermediate' ? '#ffc107' : '#dc3545',
                                          color: 'white',
                                          padding: '2px 8px',
                                          borderRadius: '12px',
                                          fontSize: '11px',
                                          textTransform: 'uppercase'
                                        }}>
                                          {plan.difficulty}
                                        </span>
                                      </div>
                                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666' }}>
                                        <strong>Member:</strong> {plan.memberId?.fullName}<br/>
                                        <strong>Instructor:</strong> {plan.instructorId?.name}<br/>
                                        <strong>Duration:</strong> {plan.duration}<br/>
                                        <strong>Frequency:</strong> {plan.frequency}
                                      </p>
                                      <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', lineHeight: '1.4' }}>
                                        {plan.description}
                                      </p>
                                      <div style={{ fontSize: '12px', color: '#999' }}>
                                        Created: {new Date(plan.createdAt).toLocaleDateString()}
                                      </div>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-between' }}>
                                      <button 
                                        onClick={() => handlePlanApproval(plan._id, 'exercise', 'approved')}
                                        style={{
                                          backgroundColor: '#28a745',
                                          color: 'white',
                                          border: 'none',
                                          padding: '8px 16px',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          flex: 1
                                        }}
                                      >
                                        <i className="fas fa-check"></i> Approve
                                      </button>
                                      <button 
                                        onClick={() => {
                                          const reason = prompt('Enter rejection reason (optional):')
                                          if (reason !== null) {
                                            handlePlanApproval(plan._id, 'exercise', 'rejected', reason)
                                          }
                                        }}
                                        style={{
                                          backgroundColor: '#dc3545',
                                          color: 'white',
                                          border: 'none',
                                          padding: '8px 16px',
                                          borderRadius: '4px',
                                          cursor: 'pointer',
                                          fontSize: '12px',
                                          flex: 1
                                        }}
                                      >
                                        <i className="fas fa-times"></i> Reject
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}