import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  Home, BookOpen, MessageSquare, Phone, ChevronDown, ChevronRight,
  Star, FileText, Users, Building2, Scale, Landmark, HardHat,
  ClipboardList, UserCog, UsersRound, Shield, TrafficCone, Map, FolderOpen
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { bibliotecaAPI, usuarioAPI } from '../services/api'

const DEPENDENCIA_ICONS = {
  'Secretaría': FileText,
  'Auditoría': ClipboardList,
  'DAFIM': Landmark,
  'DMP': HardHat,
  'DMM': Users,
  'UAIP': FileText,
  'Servicios': Building2,
  'JAM': Scale,
  'RRHH': UserCog,
  'Org. Comunitaria': UsersRound,
  'PM': Shield,
  'PMT': TrafficCone,
  'Catastro': Map,
}

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const { isExperto } = useAuth()
  const [dependencias, setDependencias] = useState([])
  const [favoritos, setFavoritos] = useState([])
  const [bibliotecaOpen, setBibliotecaOpen] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [depRes, favRes] = await Promise.all([
          bibliotecaAPI.getDependencias(),
          usuarioAPI.getFavoritos()
        ])
        setDependencias(Array.isArray(depRes.data) ? depRes.data : depRes.data.results || [])
        setFavoritos(Array.isArray(favRes.data) ? favRes.data : favRes.data.results || [])
      } catch (error) {
        console.error('Error fetching sidebar data:', error)
        setDependencias([])
        setFavoritos([])
      }
    }
    fetchData()
  }, [])

  const isActive = (path) => location.pathname === path
  const isBibliotecaActive = location.pathname.startsWith('/biblioteca')

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-gray-100 
        z-30 transition-transform duration-300 overflow-y-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <nav className="p-3 space-y-1">
          {/* Main navigation */}
          <SidebarLink 
            to="/" 
            icon={Home} 
            active={isActive('/')}
          >
            Inicio
          </SidebarLink>

          {/* Biblioteca with submenu */}
          <div>
            <button
              onClick={() => setBibliotecaOpen(!bibliotecaOpen)}
              className={`
                w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                transition-all duration-200 group
                ${isBibliotecaActive 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <BookOpen className={`w-5 h-5 ${isBibliotecaActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
                <span className="font-medium">Biblioteca</span>
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${bibliotecaOpen ? '' : '-rotate-90'}`} />
            </button>

            {/* Submenu */}
            {bibliotecaOpen && (
              <div className="ml-6 mt-1 space-y-0.5">
                <SubLink to="/biblioteca?tipo=fundamento" icon="📖">
                  Fundamentos
                </SubLink>
                <SubLink to="/biblioteca?tipo=guia" icon="✏️">
                  Cómo Elaborar
                </SubLink>
                
                {/* Dependencias */}
                <div className="pt-3 pb-1">
                  <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Dependencias
                  </p>
                </div>
                
                <div className="max-h-52 overflow-y-auto space-y-0.5 pr-1">
                  {dependencias.map(dep => {
                    const Icon = DEPENDENCIA_ICONS[dep.nombre_corto] || FileText
                    const isDepActive = location.pathname === `/biblioteca/dependencia/${dep.id}`
                    return (
                      <Link
                        key={dep.id}
                        to={`/biblioteca/dependencia/${dep.id}`}
                        className={`
                          flex items-center gap-2.5 px-3 py-2 text-sm rounded-md transition-all duration-200
                          ${isDepActive 
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }
                        `}
                      >
                        <Icon className={`w-4 h-4 flex-shrink-0 ${isDepActive ? 'text-blue-500' : 'text-gray-400'}`} />
                        <span className="truncate flex-1">{dep.nombre_corto}</span>
                        <span className={`text-xs tabular-nums ${
                          isDepActive ? 'text-blue-500' : 'text-gray-400'
                        }`}>
                          {dep.total_procedimientos}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <SidebarLink 
            to="/consultas" 
            icon={MessageSquare} 
            active={isActive('/consultas')}
          >
            Mis Consultas
          </SidebarLink>

          <SidebarLink 
            to="/recursos" 
            icon={FolderOpen} 
            active={location.pathname.startsWith('/recursos')}
          >
            Recursos
          </SidebarLink>

          <SidebarLink 
            to="/contacto" 
            icon={Phone} 
            active={isActive('/contacto')}
          >
            Contacto
          </SidebarLink>

          {/* Expert panel link */}
          {isExperto && (
            <>
              <div className="pt-4 pb-2">
                <p className="px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Administración
                </p>
              </div>
              <SidebarLink 
                to="/expertos" 
                icon={Users} 
                active={isActive('/expertos')}
                highlight
              >
                Panel Expertos
              </SidebarLink>
            </>
          )}
        </nav>

        {/* Favorites section */}
        {favoritos.length > 0 && (
          <div className="border-t border-gray-100 p-3 mt-2">
            <p className="flex items-center gap-2 px-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
              <Star className="w-3 h-3" />
              Favoritos
            </p>
            <div className="space-y-0.5">
              {favoritos.slice(0, 5).map(fav => (
                <Link
                  key={fav.id}
                  to={`/biblioteca/${fav.articulo}`}
                  className="block px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-md truncate transition-colors"
                >
                  {fav.articulo_titulo}
                </Link>
              ))}
            </div>
          </div>
        )}
      </aside>
    </>
  )
}

function SidebarLink({ to, icon: Icon, children, active, highlight }) {
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group
        ${active 
          ? 'bg-blue-50 text-blue-600 font-medium' 
          : highlight
            ? 'text-blue-600 hover:bg-blue-50'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }
      `}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-blue-500' : highlight ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'}`} />
      <span>{children}</span>
    </Link>
  )
}

function SubLink({ to, icon, children }) {
  const location = useLocation()
  const isActive = location.pathname + location.search === to
  
  return (
    <Link
      to={to}
      className={`
        flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-all duration-200
        ${isActive 
          ? 'bg-blue-50 text-blue-600 font-medium' 
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }
      `}
    >
      <span className="text-base">{icon}</span>
      <span>{children}</span>
    </Link>
  )
}
