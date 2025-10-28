import { useState, useEffect } from 'react'
import Head from 'next/head'
import * as XLSX from 'xlsx'
import Toast, { showToast } from '../components/Toast'
import LoadingSpinner from '../components/LoadingSpinner'

export default function Reports() {
  const [reportType, setReportType] = useState('class-members')
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedInstructor, setSelectedInstructor] = useState('')
  const [classes, setClasses] = useState([])
  const [instructors, setInstructors] = useState([])
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchClasses()
    fetchInstructors()
  }, [])

  const fetchClasses = async () => {
    try {
      const response = await fetch('/api/classes')
      const data = await response.json()
      setClasses(data)
    } catch (error) {
      console.error('Error fetching classes:', error)
    }
  }

  const fetchInstructors = async () => {
    try {
      const response = await fetch('/api/instructors')
      const data = await response.json()
      setInstructors(data.instructors || data)
    } catch (error) {
      console.error('Error fetching instructors:', error)
    }
  }

  const generateReport = async () => {
    setLoading(true)
    try {
      let url = `/api/reports/${reportType}`
      const params = new URLSearchParams()
      
      if (selectedClass) params.append('classId', selectedClass)
      if (selectedMonth) params.append('month', selectedMonth)
      if (selectedInstructor) params.append('instructor', selectedInstructor)
      
      if (params.toString()) url += `?${params.toString()}`
      
      const response = await fetch(url)
      const data = await response.json()
      setReportData(data)
    } catch (error) {
      console.error('Error generating report:', error)
    }
    setLoading(false)
  }

  const exportToPDF = async () => {
    const jsPDF = (await import('jspdf')).default
    await import('jspdf-autotable')
    
    const doc = new jsPDF()
    doc.text('Elite Sports Academy Report', 20, 20)
    doc.text(getReportTitle(), 20, 30)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 40)
    
    const tableData = reportData.map(item => {
      if (reportType === 'class-members') {
        return [item.memberName, item.email, item.phone, item.className, item.status]
      } else if (reportType === 'class-list') {
        return [item.name, item.instructor, item.category, `${item.duration} mins`, item.capacity]
      } else if (reportType === 'instructor-classes') {
        return [item.instructorName, item.totalClasses, item.classes.map(c => `${c.name} (${c.day} ${c.time})`).join(', ')]
      } else {
        return [item.memberName, item.className, `LKR ${item.amount}`, new Date(item.dueDate).toLocaleDateString(), item.status]
      }
    })
    
    const headers = reportType === 'class-members' 
      ? ['Member Name', 'Email', 'Phone', 'Class', 'Status']
      : reportType === 'class-list'
      ? ['Class Name', 'Instructor', 'Category', 'Duration', 'Capacity']
      : reportType === 'instructor-classes'
      ? ['Instructor', 'Total Classes', 'Class Details']
      : ['Member', 'Class', 'Amount', 'Due Date', 'Status']
    
    doc.autoTable({
      head: [headers],
      body: tableData,
      startY: 50
    })
    
    doc.save(`${getReportTitle()}.pdf`)
  }

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(reportData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Report')
    XLSX.writeFile(wb, `${getReportTitle()}.xlsx`)
  }

  const printReport = () => {
    window.print()
  }

  const getReportTitle = () => {
    switch (reportType) {
      case 'class-members': return 'Class-wise Member List'
      case 'class-list': return 'Classes List'
      case 'instructor-classes': return 'Instructor-wise Classes'
      case 'payment-unpaid': return 'Unpaid Payments'
      case 'payment-paid': return 'Paid Payments'
      default: return 'Report'
    }
  }

  return (
    <>
      <Head>
        <title>Reports - Elite Sports Academy</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" />
      </Head>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 bg-dark text-white p-4" style={{minHeight: '100vh'}}>
            <h4 className="mb-4">
              <i className="fas fa-chart-bar me-2"></i>
              Reports
            </h4>
            
            <div className="mb-4">
              <label className="form-label">Report Type</label>
              <select 
                className="form-select"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <option value="class-members">Class-wise Members</option>
                <option value="class-list">Classes List</option>
                <option value="instructor-classes">Instructor-wise Classes</option>
                <option value="payment-unpaid">Unpaid Payments</option>
                <option value="payment-paid">Paid Payments</option>
              </select>
            </div>

            {reportType === 'instructor-classes' && (
              <div className="mb-4">
                <label className="form-label">Select Instructor</label>
                <select 
                  className="form-select"
                  value={selectedInstructor}
                  onChange={(e) => setSelectedInstructor(e.target.value)}
                >
                  <option value="">All Instructors</option>
                  {instructors.map(instructor => (
                    <option key={instructor._id} value={instructor.name}>{instructor.name}</option>
                  ))}
                </select>
              </div>
            )}

            {(reportType === 'class-members' || reportType === 'payment-unpaid' || reportType === 'payment-paid') && (
              <div className="mb-4">
                <label className="form-label">Select Class</label>
                <select 
                  className="form-select"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                >
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls._id} value={cls._id}>{cls.name}</option>
                  ))}
                </select>
              </div>
            )}

            {(reportType === 'payment-unpaid' || reportType === 'payment-paid') && (
              <div className="mb-4">
                <label className="form-label">Select Month</label>
                <input 
                  type="month"
                  className="form-control"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            )}

            <button 
              className="btn btn-primary w-100 mb-3"
              onClick={generateReport}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-chart-line me-2"></i>
                  Generate Report
                </>
              )}
            </button>

            {reportData.length > 0 && (
              <div>
                <button 
                  className="btn btn-danger w-100 mb-2"
                  onClick={exportToPDF}
                >
                  <i className="fas fa-file-pdf me-2"></i>
                  Export PDF
                </button>
                <button 
                  className="btn btn-success w-100 mb-2"
                  onClick={exportToExcel}
                >
                  <i className="fas fa-file-excel me-2"></i>
                  Export Excel
                </button>
                <button 
                  className="btn btn-info w-100"
                  onClick={printReport}
                >
                  <i className="fas fa-print me-2"></i>
                  Print
                </button>
              </div>
            )}

            <div className="mt-4">
              <a href="/admin" className="btn btn-outline-light w-100">
                <i className="fas fa-arrow-left me-2"></i>
                Back to Admin
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9 p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2>{getReportTitle()}</h2>
              <div className="text-muted">
                <i className="fas fa-calendar me-2"></i>
                {new Date().toLocaleDateString()}
              </div>
            </div>

            <div id="report-content">
              {loading ? (
                <LoadingSpinner size="large" text="Generating report..." />
              ) : reportData.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-chart-bar text-muted" style={{fontSize: '4rem'}}></i>
                  <h4 className="mt-3 text-muted">No Data Available</h4>
                  <p className="text-muted">Select report parameters and click "Generate Report"</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <div className="mb-3">
                    <h4>{getReportTitle()}</h4>
                    <p className="text-muted">Generated on {new Date().toLocaleString()}</p>
                  </div>
                  
                  <table className="table table-striped table-hover">
                    <thead className="table-dark">
                      <tr>
                        {reportType === 'class-members' && (
                          <>
                            <th>Member Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Class</th>
                            <th>Status</th>
                          </>
                        )}
                        {reportType === 'class-list' && (
                          <>
                            <th>Class Name</th>
                            <th>Instructor</th>
                            <th>Category</th>
                            <th>Duration</th>
                            <th>Capacity</th>
                          </>
                        )}
                        {reportType === 'instructor-classes' && (
                          <>
                            <th>Instructor</th>
                            <th>Total Classes</th>
                            <th>Class Details</th>
                          </>
                        )}
                        {(reportType === 'payment-unpaid' || reportType === 'payment-paid') && (
                          <>
                            <th>Member</th>
                            <th>Class</th>
                            <th>Amount</th>
                            <th>Due Date</th>
                            <th>Status</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {reportData.map((item, index) => (
                        <tr key={index}>
                          {reportType === 'class-members' && (
                            <>
                              <td>{item.memberName}</td>
                              <td>{item.email}</td>
                              <td>{item.phone}</td>
                              <td>{item.className}</td>
                              <td>
                                <span className={`badge ${item.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                                  {item.status}
                                </span>
                              </td>
                            </>
                          )}
                          {reportType === 'class-list' && (
                            <>
                              <td>{item.name}</td>
                              <td>{item.instructor}</td>
                              <td>
                                <span className={`badge ${
                                  item.category === 'crossfit' ? 'bg-danger' : 
                                  item.category === 'karate' ? 'bg-primary' : 'bg-info'
                                }`}>
                                  {item.category}
                                </span>
                              </td>
                              <td>{item.duration} mins</td>
                              <td>{item.capacity}</td>
                            </>
                          )}
                          {reportType === 'instructor-classes' && (
                            <>
                              <td><strong>{item.instructorName}</strong></td>
                              <td><span className="badge bg-primary">{item.totalClasses}</span></td>
                              <td>
                                {item.classes.map((cls, idx) => (
                                  <div key={idx} className="mb-1">
                                    <strong>{cls.name}</strong> - {cls.category} 
                                    <small className="text-muted">({cls.day} {cls.time})</small>
                                  </div>
                                ))}
                              </td>
                            </>
                          )}
                          {(reportType === 'payment-unpaid' || reportType === 'payment-paid') && (
                            <>
                              <td>{item.memberName}</td>
                              <td>{item.className}</td>
                              <td>LKR {item.amount}</td>
                              <td>{new Date(item.dueDate).toLocaleDateString()}</td>
                              <td>
                                <span className={`badge ${item.status === 'paid' ? 'bg-success' : 'bg-danger'}`}>
                                  {item.status}
                                </span>
                              </td>
                            </>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  
                  <div className="mt-4">
                    <p className="text-muted">
                      <strong>Total Records:</strong> {reportData.length}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @media print {
          .col-md-3 {
            display: none !important;
          }
          .col-md-9 {
            width: 100% !important;
            max-width: 100% !important;
          }
          .btn {
            display: none !important;
          }
        }
      `}</style>
    <Toast />
    </>
  )
}