import { useState } from 'react'

let showConfirmFunction = null

export const showConfirm = (message, onConfirm, onCancel) => {
  if (showConfirmFunction) {
    showConfirmFunction(message, onConfirm, onCancel)
  }
}

export default function ConfirmDialog() {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [onConfirm, setOnConfirm] = useState(null)
  const [onCancel, setOnCancel] = useState(null)

  useState(() => {
    showConfirmFunction = (msg, confirmCallback, cancelCallback) => {
      setMessage(msg)
      setOnConfirm(() => confirmCallback)
      setOnCancel(() => cancelCallback)
      setIsVisible(true)
    }
  }, [])

  const handleConfirm = () => {
    setIsVisible(false)
    if (onConfirm) onConfirm()
  }

  const handleCancel = () => {
    setIsVisible(false)
    if (onCancel) onCancel()
  }

  if (!isVisible) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 10000
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        maxWidth: '400px',
        width: '90%'
      }}>
        <p style={{ margin: '0 0 1.5rem 0', fontSize: '16px', lineHeight: '1.5' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button
            onClick={handleCancel}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}