import { useState, useEffect } from 'react'

export default function Toast({ message, type, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  if (!show) return null

  const getIcon = () => {
    switch (type) {
      case 'success': return 'fas fa-check-circle'
      case 'error': return 'fas fa-exclamation-circle'
      case 'warning': return 'fas fa-exclamation-triangle'
      default: return 'fas fa-info-circle'
    }
  }

  const getColor = () => {
    switch (type) {
      case 'success': return '#28a745'
      case 'error': return '#dc3545'
      case 'warning': return '#ffc107'
      default: return '#17a2b8'
    }
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      background: 'white',
      border: `3px solid ${getColor()}`,
      borderRadius: '8px',
      padding: '15px 20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      minWidth: '300px',
      animation: 'slideIn 0.3s ease'
    }}>
      <i className={getIcon()} style={{ color: getColor(), fontSize: '20px' }}></i>
      <span style={{ flex: 1, color: '#333', fontWeight: '500' }}>{message}</span>
      <button 
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#666',
          fontSize: '18px',
          cursor: 'pointer',
          padding: '0',
          width: '20px',
          height: '20px'
        }}
      >
        ×
      </button>
      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}