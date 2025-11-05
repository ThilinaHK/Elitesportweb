import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminPlanApproval() {
  const [pendingPlans, setPendingPlans] = useState({ dietPlans: [], exercisePlans: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const adminId = localStorage.getItem('adminId');
    if (!adminId) {
      router.push('/admin-login');
      return;
    }
    fetchPendingPlans();
  }, []);

  const fetchPendingPlans = async () => {
    try {
      const [dietRes, exerciseRes] = await Promise.all([
        fetch('/api/diet-plans/pending'),
        fetch('/api/exercise-plans/pending')
      ]);

      const dietData = dietRes.ok ? await dietRes.json() : { plans: [] };
      const exerciseData = exerciseRes.ok ? await exerciseRes.json() : { plans: [] };

      setPendingPlans({
        dietPlans: dietData.plans || [],
        exercisePlans: exerciseData.plans || []
      });
    } catch (error) {
      console.error('Error fetching pending plans:', error);
    }
    setLoading(false);
  };

  const handlePlanApproval = async (planId, type, status, reason = '') => {
    try {
      const response = await fetch(`/api/${type === 'diet' ? 'diet-plans' : 'exercise-plans'}/${planId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason })
      });

      if (response.ok) {
        fetchPendingPlans();
      }
    } catch (error) {
      console.error('Error updating plan status:', error);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  return (
    <div style={{ padding: '2rem', background: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, color: '#333' }}>Plan Approval Management</h2>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#666' }}>
              Pending: {pendingPlans.dietPlans.length + pendingPlans.exercisePlans.length}
            </span>
            <button 
              onClick={fetchPendingPlans}
              style={{
                backgroundColor: '#17a2b8',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh
            </button>
          </div>
        </div>

        {pendingPlans.dietPlans.length === 0 && pendingPlans.exercisePlans.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
            <h4>No Pending Plans</h4>
            <p>All plans have been reviewed.</p>
          </div>
        ) : (
          <>
            {pendingPlans.dietPlans.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h4 style={{ color: '#28a745', marginBottom: '20px' }}>
                  Pending Diet Plans ({pendingPlans.dietPlans.length})
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {pendingPlans.dietPlans.map((plan) => (
                    <div key={plan._id} style={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #28a745', 
                      borderRadius: '8px', 
                      padding: '20px' 
                    }}>
                      <h5 style={{ color: '#28a745' }}>{plan.title}</h5>
                      <p><strong>Member:</strong> {plan.memberId?.fullName}</p>
                      <p><strong>Duration:</strong> {plan.duration}</p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button 
                          onClick={() => handlePlanApproval(plan._id, 'diet', 'approved')}
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            flex: 1
                          }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handlePlanApproval(plan._id, 'diet', 'rejected')}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            flex: 1
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pendingPlans.exercisePlans.length > 0 && (
              <div>
                <h4 style={{ color: '#17a2b8', marginBottom: '20px' }}>
                  Pending Exercise Plans ({pendingPlans.exercisePlans.length})
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {pendingPlans.exercisePlans.map((plan) => (
                    <div key={plan._id} style={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #17a2b8', 
                      borderRadius: '8px', 
                      padding: '20px' 
                    }}>
                      <h5 style={{ color: '#17a2b8' }}>{plan.title}</h5>
                      <p><strong>Member:</strong> {plan.memberId?.fullName}</p>
                      <p><strong>Duration:</strong> {plan.duration}</p>
                      <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
                        <button 
                          onClick={() => handlePlanApproval(plan._id, 'exercise', 'approved')}
                          style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            flex: 1
                          }}
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handlePlanApproval(plan._id, 'exercise', 'rejected')}
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            flex: 1
                          }}
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}