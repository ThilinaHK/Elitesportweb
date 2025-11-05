import { useState, useEffect } from 'react';

export default function GymDashboard() {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    totalClasses: 0,
    totalInstructors: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    todayBookings: 0,
    memberGrowth: 0
  });
  const [dbStats, setDbStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [membersRes, classesRes, instructorsRes, paymentsRes, dbStatsRes] = await Promise.all([
        fetch('/api/members'),
        fetch('/api/classes'),
        fetch('/api/instructors'),
        fetch('/api/payments'),
        fetch('/api/stats/database')
      ]);

      const members = await membersRes.json();
      const classes = await classesRes.json();
      const instructors = await instructorsRes.json();
      const payments = await paymentsRes.json();
      const dbStatsData = await dbStatsRes.json();
      setDbStats(dbStatsData);

      const currentMonth = new Date().toISOString().slice(0, 7);
      const monthlyPayments = payments.filter(p => p.paymentMonth === currentMonth);
      const monthlyRevenue = monthlyPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
      
      const activeMembers = members.filter(m => m.status === 'active').length;
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);
      const lastMonthMembers = members.filter(m => 
        new Date(m.joinDate) >= lastMonth
      ).length;

      setStats({
        totalMembers: members.length,
        activeMembers,
        totalClasses: classes.length,
        totalInstructors: instructors.length,
        monthlyRevenue,
        pendingPayments: payments.filter(p => p.status === 'pending').length,
        todayBookings: 0, // Would need bookings API
        memberGrowth: lastMonthMembers
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#666' }}>Loading dashboard...</div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon, color, subtitle }) => (
    <div style={{
      background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
      borderRadius: '16px',
      padding: '28px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)',
      position: 'relative',
      overflow: 'hidden',
      transition: 'all 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
    }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '20px'
      }}>
        {icon}
      </div>
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '4px',
        background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)`
      }}></div>
      <div style={{ fontSize: '14px', color: '#6c757d', marginBottom: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {title}
      </div>
      <div style={{ fontSize: '36px', fontWeight: '800', color: '#2c3e50', marginBottom: '8px', lineHeight: '1' }}>
        {value}
      </div>
      {subtitle && (
        <div style={{ fontSize: '13px', color: color, fontWeight: '600', padding: '6px 12px', backgroundColor: `${color}15`, borderRadius: '20px', display: 'inline-block' }}>
          {subtitle}
        </div>
      )}
    </div>
  );

  const QuickAction = ({ title, description, color, onClick }) => (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        borderLeft: `4px solid ${color}`
      }}
      onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
    >
      <div style={{ fontSize: '14px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
        {title}
      </div>
      <div style={{ fontSize: '12px', color: '#666' }}>
        {description}
      </div>
    </div>
  );

  return (
    <div style={{ 
      padding: '30px', 
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', 
      minHeight: '100vh' 
    }}>
      {/* Header */}
      <div style={{ 
        marginBottom: '40px',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '15px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: 'linear-gradient(135deg, #f36100 0%, #ff8c42 100%)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 8px 25px rgba(243, 97, 0, 0.3)'
          }}>
            📊
          </div>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: '800', 
              background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: '0 0 5px 0' 
            }}>
              Dashboard Overview
            </h1>
            <p style={{ 
              fontSize: '16px', 
              color: '#6c757d', 
              margin: 0,
              fontWeight: '500'
            }}>
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>
        <div style={{
          padding: '15px 20px',
          background: 'linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)',
          borderRadius: '12px',
          border: '1px solid #c3e6c3'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#155724', marginBottom: '5px' }}>
            🎆 Welcome to Elite Sports Academy Management System
          </div>
          <div style={{ fontSize: '13px', color: '#155724' }}>
            Monitor your gym's performance, manage members, and track revenue all in one place.
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px', 
        marginBottom: '30px' 
      }}>
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon="👥"
          color="#f36100"
          subtitle={`${stats.activeMembers} active`}
        />
        <StatCard
          title="Monthly Revenue"
          value={`LKR ${stats.monthlyRevenue.toLocaleString()}`}
          icon="💰"
          color="#28a745"
          subtitle="Current month"
        />
        <StatCard
          title="Active Classes"
          value={stats.totalClasses}
          icon="🏃"
          color="#007bff"
          subtitle="CrossFit, Karate, Zumba"
        />
        <StatCard
          title="Instructors"
          value={stats.totalInstructors}
          icon="👨‍🏫"
          color="#6f42c1"
          subtitle="Professional trainers"
        />
      </div>

      {/* Secondary Metrics */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '15px', 
        marginBottom: '30px' 
      }}>
        <StatCard
          title="New Members"
          value={stats.memberGrowth}
          icon="📈"
          color="#17a2b8"
          subtitle="This month"
        />
        <StatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          icon="⏰"
          color="#ffc107"
          subtitle="Requires attention"
        />
        <StatCard
          title="Member Retention"
          value="94%"
          icon="🎯"
          color="#20c997"
          subtitle="Last 6 months"
        />
        <StatCard
          title="Class Utilization"
          value="87%"
          icon="📊"
          color="#e83e8c"
          subtitle="Average capacity"
        />
      </div>

      {/* Quick Actions & Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Quick Actions */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
            Quick Actions
          </h3>
          <div style={{ display: 'grid', gap: '12px' }}>
            <QuickAction
              title="Add New Member"
              description="Register a new gym member"
              color="#f36100"
              onClick={() => window.location.href = '/admin#members'}
            />
            <QuickAction
              title="Schedule Class"
              description="Create or modify class schedules"
              color="#007bff"
              onClick={() => window.location.href = '/admin#classes'}
            />
            <QuickAction
              title="Process Payments"
              description="Handle member payments and dues"
              color="#28a745"
              onClick={() => window.location.href = '/admin#payments'}
            />
            <QuickAction
              title="Send Notifications"
              description="Notify members about updates"
              color="#6f42c1"
              onClick={() => window.location.href = '/admin#notifications'}
            />
          </div>
        </div>

        {/* Database Usage & Performance Insights */}
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
            Database Usage & Insights
          </h3>
          
          {/* Database Stats */}
          {dbStats && (
            <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', marginBottom: '20px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>
                📊 Database Statistics
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#f36100' }}>{dbStats.collections.members}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Members</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#007bff' }}>{dbStats.collections.classes}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Classes</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#6f42c1' }}>{dbStats.collections.instructors}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Instructors</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#28a745' }}>{dbStats.collections.payments}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Payments</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
                  <div style={{ fontSize: '20px', fontWeight: '700', color: '#ff6b35' }}>{dbStats.collections.events}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Events</div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#e8f5e8', borderRadius: '8px', border: '1px solid #c3e6c3' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#2d5a2d' }}>Storage Usage</div>
                  <div style={{ fontSize: '12px', color: '#2d5a2d' }}>Estimated database size</div>
                </div>
                <div style={{ fontSize: '18px', fontWeight: '700', color: '#2d5a2d' }}>{dbStats.storage.estimatedSize}</div>
              </div>
            </div>
          )}
          
          <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '16px' }}>
            📈 Performance Insights
          </h4>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>CrossFit Classes</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#ff5722' }}>92%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px' }}>
                <div style={{ width: '92%', height: '100%', backgroundColor: '#ff5722', borderRadius: '3px' }}></div>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Karate Classes</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#2196f3' }}>85%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px' }}>
                <div style={{ width: '85%', height: '100%', backgroundColor: '#2196f3', borderRadius: '3px' }}></div>
              </div>
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '14px', color: '#666' }}>Zumba Classes</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#9c27b0' }}>78%</span>
              </div>
              <div style={{ width: '100%', height: '6px', backgroundColor: '#f0f0f0', borderRadius: '3px' }}>
                <div style={{ width: '78%', height: '100%', backgroundColor: '#9c27b0', borderRadius: '3px' }}></div>
              </div>
            </div>

            <div style={{ 
              marginTop: '20px', 
              padding: '12px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              borderLeft: '4px solid #28a745'
            }}>
              <div style={{ fontSize: '12px', fontWeight: '600', color: '#28a745', marginBottom: '4px' }}>
                💡 System Insight
              </div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                {dbStats ? `Database contains ${Object.values(dbStats.collections).reduce((a, b) => a + b, 0)} total records. ` : ''}
                CrossFit classes show highest engagement. Consider adding more morning slots.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>
          Recent Activity
        </h3>
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f36100', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
              <span style={{ color: 'white', fontSize: '16px' }}>👤</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>New member registration</div>
              <div style={{ fontSize: '12px', color: '#666' }}>John Doe joined CrossFit program</div>
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>2 hours ago</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#28a745', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
              <span style={{ color: 'white', fontSize: '16px' }}>💰</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Payment received</div>
              <div style={{ fontSize: '12px', color: '#666' }}>Monthly fee payment - LKR 5,000</div>
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>4 hours ago</div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', padding: '12px 0' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#007bff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
              <span style={{ color: 'white', fontSize: '16px' }}>📅</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#333' }}>Class scheduled</div>
              <div style={{ fontSize: '12px', color: '#666' }}>New Karate session added for tomorrow</div>
            </div>
            <div style={{ fontSize: '12px', color: '#999' }}>6 hours ago</div>
          </div>
        </div>
      </div>
    </div>
  );
}