import { showToast } from '../components/Toast'

export const confirmDelete = (itemName, onConfirm) => {
  const userConfirmed = confirm(`Are you sure you want to delete this ${itemName}?`)
  if (userConfirmed) {
    onConfirm()
  }
}

export const confirmAction = (message, onConfirm) => {
  const userConfirmed = confirm(message)
  if (userConfirmed) {
    onConfirm()
  }
}

export const handleDeleteWithToast = async (itemName, deleteFunction, refreshFunction) => {
  const userConfirmed = confirm(`Are you sure you want to delete this ${itemName}?`)
  if (userConfirmed) {
    try {
      await deleteFunction()
      showToast(`${itemName} deleted successfully`, 'success')
      if (refreshFunction) refreshFunction()
    } catch (error) {
      showToast(`Failed to delete ${itemName}`, 'error')
    }
  }
}