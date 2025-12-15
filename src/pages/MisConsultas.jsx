import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageSquare, Plus, Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { consultasAPI } from '../services/api'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

const ESTADO_CONFIG = {
  pendiente: { icon: Clock, color: 'yellow', label: 'Pendiente' },
  en_revision: { icon: AlertCircle, color: 'blue', label: 'En Revisión' },
  respondida: { icon: CheckCircle, color: 'green', label: 'Respondida' },
  cerrada: { icon: XCircle, color: 'gray', label: 'Cerrada' },
}

export default function MisConsultas() {
  const [consultas, setConsultas] = useState([])
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('todas')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [consRes, statsRes] = await Promise.all([
          consultasAPI.misConsultas(),
          consultasAPI.estadisticas()
        ])
        // Handle both array and paginated responses
        setConsultas(Array.isArray(consRes.data) ? consRes.data : consRes.data.results || [])
        setEstadisticas(statsRes.data || { total: 0, pendientes: 0, en_revision: 0, respondidas: 0, cerradas: 0 })
      } catch (error) {
        console.error('Error fetching consultas:', error)
        setConsultas([])
        setEstadisticas({ total: 0, pendientes: 0, en_revision: 0, respondidas: 0, cerradas: 0 })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const consultasFiltradas = consultas.filter(c => {
    if (filtro === 'todas') return true
    return c.estado === filtro
  })

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-primary-600" />
            Mis Consultas
          </h1>
          <p className="text-gray-600 mt-1">
            Historial de consultas enviadas a expertos
          </p>
        </div>
        <Link
          to="/consultas/nueva"
          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Consulta
        </Link>
      </div>

      {/* Stats */}
      {estadisticas && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total" value={estadisticas.total} />
          <StatCard label="Pendientes" value={estadisticas.pendientes + estadisticas.en_revision} color="yellow" />
          <StatCard label="Respondidas" value={estadisticas.respondidas} color="green" />
          <StatCard label="Cerradas" value={estadisticas.cerradas} color="gray" />
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['todas', 'pendiente', 'en_revision', 'respondida', 'cerrada'].map(f => (
          <button
            key={f}
            onClick={() => setFiltro(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filtro === f
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'todas' ? 'Todas' : ESTADO_CONFIG[f]?.label || f}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-xl p-5 border border-gray-200">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : consultasFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes consultas
          </h3>
          <p className="text-gray-500 mb-4">
            Envía una consulta a nuestros expertos para recibir ayuda personalizada
          </p>
          <Link
            to="/consultas/nueva"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Nueva Consulta
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {consultasFiltradas.map(consulta => (
            <ConsultaCard key={consulta.id} consulta={consulta} />
          ))}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color = 'primary' }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
    gray: 'bg-gray-50 text-gray-700',
  }

  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm opacity-80">{label}</p>
    </div>
  )
}

function ConsultaCard({ consulta }) {
  const config = ESTADO_CONFIG[consulta.estado] || ESTADO_CONFIG.pendiente
  const Icon = config.icon

  const colors = {
    yellow: 'bg-yellow-100 text-yellow-700',
    blue: 'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    gray: 'bg-gray-100 text-gray-700',
  }

  return (
    <Link
      to={`/consultas/${consulta.id}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary-300 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${colors[config.color]}`}>
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
            {!consulta.leido_por_usuario && consulta.estado === 'respondida' && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                Nueva respuesta
              </span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">
            {consulta.asunto}
          </h3>
          <p className="text-sm text-gray-500">
            {consulta.dependencia_nombre && `${consulta.dependencia_nombre} • `}
            {formatDistanceToNow(new Date(consulta.created_at), { addSuffix: true, locale: es })}
          </p>
        </div>
      </div>
    </Link>
  )
}
