// Utility functions for SISFOM

/**
 * Format date to locale string
 */
export function formatDate(date, options = {}) {
  const d = new Date(date)
  return d.toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  })
}

/**
 * Format date with time
 */
export function formatDateTime(date) {
  const d = new Date(date)
  return d.toLocaleString('es-GT', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format relative time (e.g., "hace 2 días")
 */
export function formatRelativeTime(date) {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now - d
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSecs < 60) return 'hace un momento'
  if (diffMins < 60) return `hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`
  if (diffHours < 24) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`
  if (diffDays < 7) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`
  if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semana${diffDays >= 14 ? 's' : ''}`
  
  return formatDate(date)
}

/**
 * Truncate text to max length
 */
export function truncate(text, maxLength = 100) {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Capitalize first letter
 */
export function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

/**
 * Generate initials from name
 */
export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

/**
 * Format file size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Debounce function
 */
export function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Check if user has role
 */
export function hasRole(user, role) {
  if (!user) return false
  return user.role === role
}

/**
 * Get status color class
 */
export function getStatusColor(status) {
  const colors = {
    pendiente: 'bg-yellow-100 text-yellow-700',
    en_revision: 'bg-blue-100 text-blue-700',
    respondida: 'bg-green-100 text-green-700',
    cerrada: 'bg-gray-100 text-gray-700',
  }
  return colors[status] || 'bg-gray-100 text-gray-700'
}

/**
 * Get priority color class
 */
export function getPriorityColor(priority) {
  const colors = {
    baja: 'bg-gray-100 text-gray-700',
    media: 'bg-blue-100 text-blue-700',
    alta: 'bg-orange-100 text-orange-700',
    urgente: 'bg-red-100 text-red-700',
  }
  return colors[priority] || 'bg-gray-100 text-gray-700'
}

/**
 * Slugify string
 */
export function slugify(text) {
  return text
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    console.error('Failed to copy:', err)
    return false
  }
}

/**
 * Check if mobile device
 */
export function isMobile() {
  return window.innerWidth < 768
}

/**
 * Generate random ID
 */
export function generateId() {
  return Math.random().toString(36).substring(2, 9)
}
