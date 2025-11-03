import { useState, useEffect } from 'react';

export default function AttendanceTab({ classes, attendanceData, setAttendanceData, selectedClass, setSelectedClass, attendanceDate, setAttendanceDate }) {
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyMonth, setHistoryMonth] = useState(new Date().toISOString().slice(0, 7));

  const fetchAttendanceData = async () => {
    if (!selectedClass || !attendanceDate) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/attendance/class/${selectedClass}?date=${attendanceDate}`);
      const data = await response.json();
      setAttendanceData(data.members || []);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
    setLoading(false);
  };

  const markAttendance = async (memberId, status, notes = '') => {
    try {
      const response = await fetch('/api/attendance/mark', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          classId: selectedClass,
          date: attendanceDate,
          status,
          markedBy: 'admin',
          notes
        })
      });

      if (response.ok) {
        fetchAttendanceData();
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedClass, attendanceDate]);

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h3 style={{ margin: 0, color: '#333' }}>Attendance Management</h3>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            style={{
              backgroundColor: showHistory ? '#6c757d' : '#17a2b8',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {showHistory ? 'Mark Attendance' : 'View History'}
          </button>
          <select 
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
          >
            <option value="">Select Class</option>
            {classes.map(cls => (
              <option key={cls._id} value={cls._id}>{cls.name} - {cls.day} {cls.time}</option>
            ))}
          </select>
          <input 
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
          />
          <button 
            onClick={fetchAttendanceData}
            disabled={!selectedClass || loading}
            style={{
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            {loading ? 'Loading...' : 'Load Attendance'}
          </button>
        </div>
      </div>

      {showHistory ? (
        <>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
            >
              <option value="">Select Class</option>
              {classes.map(cls => (
                <option key={cls._id} value={cls._id}>{cls.name} - {cls.day} {cls.time}</option>
              ))}
            </select>
            <input 
              type="month"
              value={historyMonth}
              onChange={(e) => setHistoryMonth(e.target.value)}
              style={{ padding: '8px 15px', border: '2px solid #f36100', borderRadius: '5px', fontSize: '14px' }}
            />
            <button 
              onClick={async () => {
                if (!selectedClass) return;
                try {
                  const [year, month] = historyMonth.split('-');
                  const response = await fetch(`/api/attendance/history?classId=${selectedClass}&month=${month}&year=${year}`);
                  const data = await response.json();
                  setHistoryData(data.attendance || []);
                } catch (error) {
                  console.error('Error fetching history:', error);
                }
              }}
              disabled={!selectedClass}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '5px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Load History
            </button>
          </div>
          
          {historyData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              <p>No attendance history found</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                  <tr>
                    <th>Date</th>
                    <th>Student</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Marked By</th>
                    <th>Marked At</th>
                  </tr>
                </thead>
                <tbody>
                  {historyData.map((record) => (
                    <tr key={record._id}>
                      <td>{new Date(record.date).toLocaleDateString()}</td>
                      <td>{record.memberId?.fullName}</td>
                      <td>
                        <span style={{
                          backgroundColor: 
                            record.status === 'present' ? '#d4edda' :
                            record.status === 'late' ? '#fff3cd' : '#f8d7da',
                          color: 
                            record.status === 'present' ? '#155724' :
                            record.status === 'late' ? '#856404' : '#721c24',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {record.status.toUpperCase()}
                        </span>
                      </td>
                      <td>{record.notes || '-'}</td>
                      <td>{record.markedBy === 'admin' ? 'Admin' : 'Instructor'}</td>
                      <td>{new Date(record.markedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : (
        <>
          {!selectedClass ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              <p>Please select a class and date to view attendance</p>
            </div>
          ) : attendanceData.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '50px', color: '#666' }}>
              <p>No students enrolled in this class</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead style={{ backgroundColor: '#f36100', color: 'white' }}>
                  <tr>
                    <th>Student</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Notes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceData.map((member) => (
                    <tr key={member.memberId}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '50%', 
                            background: 'linear-gradient(45deg, #f36100, #ff8c42)', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            color: 'white', 
                            fontSize: '14px', 
                            fontWeight: '600'
                          }}>
                            {member.memberName?.charAt(0)}
                          </div>
                          <strong>{member.memberName}</strong>
                        </div>
                      </td>
                      <td>{member.email}</td>
                      <td>{member.phone}</td>
                      <td>
                        <span style={{
                          backgroundColor: 
                            member.status === 'present' ? '#d4edda' :
                            member.status === 'late' ? '#fff3cd' :
                            member.status === 'absent' ? '#f8d7da' : '#e2e3e5',
                          color: 
                            member.status === 'present' ? '#155724' :
                            member.status === 'late' ? '#856404' :
                            member.status === 'absent' ? '#721c24' : '#6c757d',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {member.status === 'not_marked' ? 'Not Marked' : member.status.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <input 
                          type="text"
                          value={member.notes || ''}
                          onChange={(e) => {
                            const updatedData = attendanceData.map(m => 
                              m.memberId === member.memberId ? {...m, notes: e.target.value} : m
                            );
                            setAttendanceData(updatedData);
                          }}
                          placeholder="Add notes..."
                          style={{ width: '100%', padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}
                        />
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '5px' }}>
                          <button 
                            onClick={() => markAttendance(member.memberId, 'present', member.notes)}
                            style={{
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}
                          >
                            Present
                          </button>
                          <button 
                            onClick={() => markAttendance(member.memberId, 'late', member.notes)}
                            style={{
                              backgroundColor: '#ffc107',
                              color: 'black',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}
                          >
                            Late
                          </button>
                          <button 
                            onClick={() => markAttendance(member.memberId, 'absent', member.notes)}
                            style={{
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '11px'
                            }}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </>
  );
}