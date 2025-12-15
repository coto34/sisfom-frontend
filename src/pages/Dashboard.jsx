import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, MessageSquare, Phone, FileText, 
  TrendingUp, Clock, Star, ArrowRight, ChevronRight
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { bibliotecaAPI, consultasAPI, usuarioAPI } from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [destacados, setDestacados] = useState([])
  const [historial, setHistorial] = useState([])
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, histRes, statsRes] = await Promise.all([
          bibliotecaAPI.getDestacados(),
          usuarioAPI.getHistorial(),
          consultasAPI.estadisticas()
        ])
        // Handle both array and paginated responses
        setDestacados(Array.isArray(destRes.data) ? destRes.data : destRes.data.results || [])
        setHistorial(Array.isArray(histRes.data) ? histRes.data : histRes.data.results || [])
        setEstadisticas(statsRes.data)
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        // Set empty defaults on error
        setDestacados([])
        setHistorial([])
        setEstadisticas({ total: 0, pendientes: 0, en_revision: 0, respondidas: 0 })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          ¡Hola, {user?.first_name || user?.username}! 👋
        </h1>
        <p className="text-gray-500 mt-1">
          Bienvenido al Sistema de Fortalecimiento Municipal
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <QuickAction
          to="/biblioteca"
          icon={BookOpen}
          title="Biblioteca"
          description="Procedimientos y guías"
          color="blue"
        />
        <QuickAction
          to="/consultas/nueva"
          icon={MessageSquare}
          title="Nueva Consulta"
          description="Pregunta a un experto"
          color="purple"
        />
        <QuickAction
          to="/contacto"
          icon={Phone}
          title="Call Center"
          description="Ayuda inmediata"
          color="green"
        />
        <QuickAction
          to="/recursos/glosario"
          icon={FileText}
          title="Glosario"
          description="Términos y definiciones"
          color="orange"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Destacados */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Procedimientos Destacados
              </h2>
              <Link 
                to="/biblioteca" 
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                Ver todos <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            {loading ? (
              <LoadingCards count={4} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destacados.map(articulo => (
                  <ArticleCard key={articulo.id} articulo={articulo} />
                ))}
              </div>
            )}
          </div>

          {/* Historial */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                Vistos Recientemente
              </h2>
            </div>
            
            {loading ? (
              <LoadingList count={5} />
            ) : historial.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Aún no has visto ningún procedimiento
              </p>
            ) : (
              <div className="space-y-2">
                {historial.slice(0, 5).map(item => (
                  <Link
                    key={item.id}
                    to={`/biblioteca/${item.articulo}`}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{item.articulo_titulo}</p>
                        <p className="text-xs text-gray-500">{item.articulo_dependencia}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary-500" 
                          style={{ width: `${item.progreso}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{item.progreso}%</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Mi Actividad
            </h2>
            
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <StatItem 
                  label="Consultas enviadas" 
                  value={estadisticas?.total || 0}
                />
                <StatItem 
                  label="Pendientes de respuesta" 
                  value={estadisticas?.pendientes + estadisticas?.en_revision || 0}
                  highlight
                />
                <StatItem 
                  label="Respondidas" 
                  value={estadisticas?.respondidas || 0}
                />
              </div>
            )}

            <Link
              to="/consultas"
              className="mt-4 w-full py-2 text-center text-primary-600 hover:bg-primary-50 rounded-lg text-sm font-medium transition-colors block"
            >
              Ver mis consultas
            </Link>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
            <h3 className="font-semibold text-lg mb-2">¿Necesitas ayuda?</h3>
            <p className="text-primary-100 text-sm mb-4">
              Nuestro asistente virtual puede resolver tus dudas al instante.
            </p>
            <button 
              className="w-full py-2.5 bg-white text-primary-700 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center justify-center gap-2"
              onClick={() => {
                // The chatbot widget will handle this
              }}
            >
              <MessageSquare className="w-4 h-4" />
              Iniciar chat
            </button>
          </div>

          {/* Contact info */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Call Center INFOM</h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4" />
                2422-3500
              </p>
              <p className="text-gray-500">
                Lunes a Viernes<br />
                8:00 AM - 5:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickAction({ to, icon: Icon, title, description, color }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-100',
    purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-100',
    green: 'bg-green-50 text-green-600 group-hover:bg-green-100',
    orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-100',
  }

  return (
    <Link
      to={to}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${colors[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </Link>
  )
}

function ArticleCard({ articulo }) {
  return (
    <Link
      to={`/biblioteca/${articulo.slug}`}
      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
          {articulo.dependencia_nombre}
        </span>
        <span className="text-xs text-gray-400">
          {articulo.tiempo_lectura} min
        </span>
      </div>
      <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">
        {articulo.titulo}
      </h3>
      <p className="text-sm text-gray-500 line-clamp-2">
        {articulo.resumen}
      </p>
    </Link>
  )
}

function StatItem({ label, value, highlight }) {
  return (
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold ${highlight ? 'text-primary-600' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  )
}

function LoadingCards({ count }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse p-4 border border-gray-200 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
      ))}
    </div>
  )
}

function LoadingList({ count }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse flex items-center gap-3 p-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      ))}
    </div>
  )
}
