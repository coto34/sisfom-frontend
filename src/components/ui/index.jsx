import { Loader2, FileX, AlertCircle, CheckCircle, Info } from 'lucide-react'

/**
 * Loading spinner component
 */
export function Loading({ size = 'md', text = 'Cargando...' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className={`${sizes[size]} text-primary-600 animate-spin`} />
      {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
    </div>
  )
}

/**
 * Full page loading
 */
export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loading size="lg" />
    </div>
  )
}

/**
 * Empty state component
 */
export function EmptyState({ 
  icon: Icon = FileX, 
  title, 
  description, 
  action,
  actionLabel = 'Acción',
  onAction
}) {
  return (
    <div className="text-center py-12 px-4">
      <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title || 'No hay datos'}
      </h3>
      {description && (
        <p className="text-gray-500 mb-4 max-w-sm mx-auto">
          {description}
        </p>
      )}
      {(action || onAction) && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  )
}

/**
 * Alert component
 */
export function Alert({ type = 'info', title, children, className = '' }) {
  const configs = {
    info: {
      icon: Info,
      classes: 'bg-blue-50 border-blue-200 text-blue-800',
      iconClass: 'text-blue-500',
    },
    success: {
      icon: CheckCircle,
      classes: 'bg-green-50 border-green-200 text-green-800',
      iconClass: 'text-green-500',
    },
    warning: {
      icon: AlertCircle,
      classes: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      iconClass: 'text-yellow-500',
    },
    error: {
      icon: AlertCircle,
      classes: 'bg-red-50 border-red-200 text-red-800',
      iconClass: 'text-red-500',
    },
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <div className={`rounded-lg border p-4 ${config.classes} ${className}`}>
      <div className="flex gap-3">
        <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconClass}`} />
        <div>
          {title && <p className="font-medium mb-1">{title}</p>}
          <div className="text-sm">{children}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Badge component
 */
export function Badge({ children, variant = 'default', size = 'md' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  }

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base',
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${variants[variant]} ${sizes[size]}`}>
      {children}
    </span>
  )
}

/**
 * Avatar component
 */
export function Avatar({ src, name, size = 'md' }) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  if (src) {
    return (
      <img 
        src={src} 
        alt={name || 'Avatar'}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    )
  }

  return (
    <div className={`${sizes[size]} rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-medium`}>
      {getInitials(name)}
    </div>
  )
}

/**
 * Card component
 */
export function Card({ children, className = '', padding = true, hover = false }) {
  return (
    <div className={`
      bg-white rounded-xl shadow-sm border border-gray-200
      ${padding ? 'p-6' : ''}
      ${hover ? 'hover:shadow-md hover:border-primary-300 transition-all cursor-pointer' : ''}
      ${className}
    `}>
      {children}
    </div>
  )
}

/**
 * Skeleton loader
 */
export function Skeleton({ className = '', rounded = 'md' }) {
  const roundedClasses = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  return (
    <div className={`animate-pulse bg-gray-200 ${roundedClasses[rounded]} ${className}`} />
  )
}

/**
 * Divider component
 */
export function Divider({ text, className = '' }) {
  if (text) {
    return (
      <div className={`flex items-center ${className}`}>
        <div className="flex-1 border-t border-gray-200"></div>
        <span className="px-3 text-sm text-gray-500">{text}</span>
        <div className="flex-1 border-t border-gray-200"></div>
      </div>
    )
  }

  return <hr className={`border-gray-200 ${className}`} />
}

/**
 * Progress bar component
 */
export function Progress({ value, max = 100, size = 'md', showLabel = false }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div 
          className="h-full bg-primary-600 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <p className="text-xs text-gray-500 mt-1 text-right">{Math.round(percentage)}%</p>
      )}
    </div>
  )
}

/**
 * Tooltip wrapper (simple CSS-based)
 */
export function Tooltip({ children, text, position = 'top' }) {
  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div className="relative group inline-block">
      {children}
      <div className={`
        absolute ${positions[position]} px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap
        opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200
      `}>
        {text}
      </div>
    </div>
  )
}
