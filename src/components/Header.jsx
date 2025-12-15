import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  Menu, Search, Bell, User, LogOut, Settings, 
  ChevronDown, HelpCircle, MessageSquare
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { notificacionesAPI } from '../services/api'

export default function Header({ onToggleSidebar, onOpenSpotlight }) {
  const { user, logout, isExperto } = useAuth()
  const navigate = useNavigate()
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [notifMenuOpen, setNotifMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const userMenuRef = useRef(null)
  const notifMenuRef = useRef(null)

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificacionesAPI.noLeidas()
        setNotifications(response.data.notificaciones || [])
        setUnreadCount(response.data.count || 0)
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }
    fetchNotifications()
    
    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false)
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setNotifMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleNotificationClick = async (notif) => {
    try {
      await notificacionesAPI.marcarLeida(notif.id)
      setNotifications(prev => prev.filter(n => n.id !== notif.id))
      setUnreadCount(prev => Math.max(0, prev - 1))
      if (notif.url) {
        navigate(notif.url)
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
    setNotifMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button 
            onClick={onToggleSidebar}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/logo-infom.png" 
              alt="INFOM" 
              className="h-10 w-auto"
            />
            <span className="font-bold text-xl text-gray-900 hidden sm:inline">SISFOM</span>
          </Link>

          {/* Navigation menu */}
          <nav className="hidden md:flex items-center gap-1 ml-8">
            <NavLink to="/biblioteca?tipo=fundamento">Fundamentos</NavLink>
            <NavLink to="/biblioteca?tipo=procedimiento">Procedimientos</NavLink>
            <NavLink to="/recursos">Recursos</NavLink>
            {isExperto && (
              <NavLink to="/expertos" highlight>Panel Expertos</NavLink>
            )}
          </nav>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-2">
          {/* Search button */}
          <button
            onClick={onOpenSpotlight}
            className="flex items-center gap-2 px-3 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="hidden md:inline text-sm">Buscar</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 text-xs bg-gray-100 rounded">⌘K</kbd>
          </button>

          {/* Chat indicator */}
          <button 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            title="Asistente Virtual"
          >
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifMenuRef}>
            <button
              onClick={() => setNotifMenuOpen(!notifMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {notifMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">Notificaciones</h3>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hay notificaciones nuevas</p>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <button
                        key={notif.id}
                        onClick={() => handleNotificationClick(notif)}
                        className="w-full px-4 py-3 hover:bg-gray-50 text-left"
                      >
                        <p className="font-medium text-gray-900 text-sm">{notif.titulo}</p>
                        <p className="text-gray-500 text-xs mt-1">{notif.mensaje}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-primary-600" />
              </div>
              <span className="hidden md:inline text-sm font-medium text-gray-700">
                {user?.first_name || user?.username}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* User dropdown */}
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-medium text-gray-900">{user?.first_name} {user?.last_name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  {user?.municipalidad && (
                    <p className="text-xs text-gray-400 mt-1">{user.municipalidad.nombre}</p>
                  )}
                </div>
                <div className="py-1">
                  <MenuItem icon={User} onClick={() => navigate('/perfil')}>
                    Mi Perfil
                  </MenuItem>
                  <MenuItem icon={Settings} onClick={() => navigate('/configuracion')}>
                    Configuración
                  </MenuItem>
                  <MenuItem icon={HelpCircle} onClick={() => navigate('/ayuda')}>
                    Ayuda
                  </MenuItem>
                </div>
                <div className="border-t border-gray-100 py-1">
                  <MenuItem icon={LogOut} onClick={handleLogout} danger>
                    Cerrar Sesión
                  </MenuItem>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function NavLink({ to, children, highlight }) {
  return (
    <Link
      to={to}
      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        highlight 
          ? 'text-primary-600 hover:bg-primary-50' 
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {children}
    </Link>
  )
}

function MenuItem({ icon: Icon, children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`w-full px-4 py-2 text-left text-sm flex items-center gap-3 hover:bg-gray-50 ${
        danger ? 'text-red-600' : 'text-gray-700'
      }`}
    >
      <Icon className="w-4 h-4" />
      {children}
    </button>
  )
}
