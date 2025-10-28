import { useState, useEffect } from 'react'

let showToastFunction = null

export const showToast = (message, type = 'success') => {
  if (showToastFunction) {
    showToastFunction(message, type)
  }
}

export default function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    showToastFunction = (message, type) => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id))
      }, 4000)
    }
  }, [])

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999
    }}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          style={{
            backgroundColor: toast.type === 'success' ? '#28a745' : toast.type === 'error' ? '#dc3545' : '#ffc107',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '5px',
            marginBottom: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {toast.message}
        </div>
      ))}
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}