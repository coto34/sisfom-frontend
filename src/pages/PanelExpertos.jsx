import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Clock, CheckCircle, AlertCircle, Search,
  ChevronRight, Send, MessageSquare
} from 'lucide-react'
import { consultasAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'

const PRIORIDAD_COLORS = {
  baja: 'bg-gray-100 text-gray-700',
  media: 'bg-blue-100 text-blue-700',
  alta: 'bg-orange-100 text-orange-700',
  urgente: 'bg-red-100 text-red-700',
}

export default function PanelExpertos() {
  const { user } = useAuth()
  const [consultas, setConsultas] = useState([])
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('pendientes')
  const [selectedConsulta, setSelectedConsulta] = useState(null)
  const [respuesta, setRespuesta] = useState('')
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    fetchData()
  }, [filtro])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [consRes, statsRes] = await Promise.all([
        filtro === 'pendientes' 
          ? consultasAPI.pendientes()
          : consultasAPI.listar({ estado: filtro === 'todas' ? '' : filtro }),
        consultasAPI.estadisticas()
      ])
      setConsultas(consRes.data.results || consRes.data)
      setEstadisticas(statsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAsignar = async (consultaId) => {
    try {
      await consultasAPI.asignar(consultaId, user.id)
      toast.success('Consulta asignada')
      fetchData()
    } catch (error) {
      toast.error('Error al asignar')
    }
  }

  const handleResponder = async () => {
    if (!respuesta.trim()) {
      toast.error('Escribe una respuesta')
      return
    }

    setEnviando(true)
    try {
      await consultasAPI.responder(selectedConsulta.id, respuesta)
      toast.success('Respuesta enviada')
      setSelectedConsulta(null)
      setRespuesta('')
      fetchData()
    } catch (error) {
      toast.error('Error al responder')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-primary-600" />
            Panel de Expertos
          </h1>
          <p className="text-gray-600 mt-1">
            Gestión de consultas de funcionarios municipales
          </p>
        </div>
      </div>

      {/* Stats */}
      {estadisticas && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <StatCard 
            label="Sin asignar" 
            value={estadisticas.sin_asignar || 0} 
            color="red" 
          />
          <StatCard 
            label="Mis asignadas" 
            value={estadisticas.mis_asignadas || 0} 
            color="yellow" 
          />
          <StatCard 
            label="En revisión" 
            value={estadisticas.en_revision} 
            color="blue" 
          />
          <StatCard 
            label="Respondidas" 
            value={estadisticas.respondidas} 
            color="green" 
          />
          <StatCard 
            label="Total" 
            value={estadisticas.total} 
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de consultas */}
        <div className="lg:col-span-2">
          {/* Filters */}
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {[
              { value: 'pendientes', label: 'Pendientes' },
              { value: 'en_revision', label: 'En revisión' },
              { value: 'respondida', label: 'Respondidas' },
              { value: 'todas', label: 'Todas' },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFiltro(f.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filtro === f.value
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.label}
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
          ) : consultas.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                ¡Todo al día!
              </h3>
              <p className="text-gray-500">
                No hay consultas pendientes en esta categoría
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {consultas.map(consulta => (
                <div
                  key={consulta.id}
                  onClick={() => setSelectedConsulta(consulta)}
                  className={`bg-white rounded-xl shadow-sm border p-5 cursor-pointer transition-all ${
                    selectedConsulta?.id === consulta.id
                      ? 'border-primary-500 ring-2 ring-primary-100'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${PRIORIDAD_COLORS[consulta.prioridad]}`}>
                          {consulta.prioridad}
                        </span>
                        {!consulta.experto_asignado && consulta.estado === 'pendiente' && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                            Sin asignar
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">
                        {consulta.asunto}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {consulta.usuario_nombre} • {consulta.usuario_municipalidad || 'Sin municipalidad'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(consulta.created_at), { addSuffix: true, locale: es })}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail panel */}
        <div className="lg:col-span-1">
          {selectedConsulta ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">
                Detalle de Consulta
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Asunto</p>
                  <p className="font-medium text-gray-900">{selectedConsulta.asunto}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Descripción</p>
                  <p className="text-gray-700 text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                    {selectedConsulta.descripcion || 'Sin descripción'}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Solicitante</p>
                  <p className="text-gray-700">{selectedConsulta.usuario_nombre}</p>
                  <p className="text-sm text-gray-500">{selectedConsulta.usuario_municipalidad}</p>
                </div>

                {/* Actions */}
                {selectedConsulta.estado === 'pendiente' && !selectedConsulta.experto_asignado && (
                  <button
                    onClick={() => handleAsignar(selectedConsulta.id)}
                    className="w-full py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                  >
                    Asignarme esta consulta
                  </button>
                )}

                {(selectedConsulta.estado === 'pendiente' || selectedConsulta.estado === 'en_revision') && 
                 selectedConsulta.experto_asignado?.id === user?.id && (
                  <div className="space-y-3">
                    <textarea
                      value={respuesta}
                      onChange={(e) => setRespuesta(e.target.value)}
                      placeholder="Escribe tu respuesta..."
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none text-sm"
                    />
                    <button
                      onClick={handleResponder}
                      disabled={enviando}
                      className="w-full py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {enviando ? (
                        <span className="animate-spin">⏳</span>
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      Enviar Respuesta
                    </button>
                  </div>
                )}

                {selectedConsulta.respuesta && (
                  <div className="bg-green-50 rounded-lg p-3">
                    <p className="text-xs text-green-600 uppercase tracking-wider mb-1">Respuesta enviada</p>
                    <p className="text-green-800 text-sm">{selectedConsulta.respuesta}</p>
                  </div>
                )}

                <Link
                  to={`/consultas/${selectedConsulta.id}`}
                  className="block text-center text-primary-600 text-sm hover:underline"
                >
                  Ver detalle completo →
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Selecciona una consulta para ver el detalle
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color = 'gray' }) {
  const colors = {
    gray: 'bg-gray-50 text-gray-700',
    red: 'bg-red-50 text-red-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
  }

  return (
    <div className={`rounded-xl p-4 ${colors[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm opacity-80">{label}</p>
    </div>
  )
}
