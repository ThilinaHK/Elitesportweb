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
            backgroundColor: 
              toast.type === 'success' ? '#28a745' : 
              toast.type === 'error' ? '#dc3545' : 
              toast.type === 'warning' ? '#ffc107' : 
              toast.type === 'info' ? '#17a2b8' : '#6c757d',
            color: toast.type === 'warning' ? '#212529' : 'white',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: '300px',
            maxWidth: '500px'
          }}
        >
          <span style={{ fontSize: '16px' }}>
            {toast.type === 'success' ? '✅' : 
             toast.type === 'error' ? '❌' : 
             toast.type === 'warning' ? '⚠️' : 
             toast.type === 'info' ? 'ℹ️' : '📢'}
          </span>
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
            style={{
              background: 'none',
              border: 'none',
              color: 'inherit',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '0',
              opacity: '0.7'
            }}
          >
            ×
          </button>
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