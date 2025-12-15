import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ChevronRight, Clock, CheckCircle, AlertCircle, User, 
  MessageSquare, Star, Send 
} from 'lucide-react'
import { consultasAPI } from '../services/api'
import { formatDistanceToNow, format } from 'date-fns'
import { es } from 'date-fns/locale'
import toast from 'react-hot-toast'

const ESTADO_CONFIG = {
  pendiente: { icon: Clock, color: 'yellow', label: 'Pendiente' },
  en_revision: { icon: AlertCircle, color: 'blue', label: 'En Revisión' },
  respondida: { icon: CheckCircle, color: 'green', label: 'Respondida' },
  cerrada: { icon: CheckCircle, color: 'gray', label: 'Cerrada' },
}

export default function ConsultaDetalle() {
  const { id } = useParams()
  const [consulta, setConsulta] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState({ calificacion: 5, comentario: '' })

  useEffect(() => {
    const fetchConsulta = async () => {
      try {
        const response = await consultasAPI.obtener(id)
        setConsulta(response.data)
      } catch (error) {
        console.error('Error fetching consulta:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchConsulta()
  }, [id])

  const handleFeedback = async () => {
    try {
      await consultasAPI.feedback(id, feedback)
      toast.success('¡Gracias por tu feedback!')
      setConsulta(prev => ({ ...prev, estado: 'cerrada', ...feedback }))
      setShowFeedback(false)
    } catch (error) {
      toast.error('Error al enviar feedback')
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!consulta) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Consulta no encontrada</h2>
        <Link to="/consultas" className="text-primary-600 hover:underline mt-2 inline-block">
          Volver a mis consultas
        </Link>
      </div>
    )
  }

  const config = ESTADO_CONFIG[consulta.estado] || ESTADO_CONFIG.pendiente
  const Icon = config.icon

  return (
    <div className="max-w-3xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Inicio</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/consultas" className="hover:text-primary-600">Mis Consultas</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">#{consulta.id}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-${config.color}-100 text-${config.color}-700 mb-2`}>
              <Icon className="w-3 h-3" />
              {config.label}
            </div>
            <h1 className="text-xl font-bold text-gray-900">{consulta.asunto}</h1>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>Categoría: {consulta.categoria}</span>
          {consulta.dependencia_relacionada && (
            <span>Dependencia: {consulta.dependencia_relacionada.nombre_corto}</span>
          )}
          <span>
            Enviada: {format(new Date(consulta.created_at), "d 'de' MMMM, yyyy", { locale: es })}
          </span>
        </div>
      </div>

      {/* Pregunta */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-900">Tu consulta</span>
              <span className="text-xs text-gray-400">
                {formatDistanceToNow(new Date(consulta.created_at), { addSuffix: true, locale: es })}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{consulta.descripcion}</p>
          </div>
        </div>
      </div>

      {/* Respuesta */}
      {consulta.respuesta && (
        <div className="bg-green-50 rounded-xl shadow-sm border border-green-200 p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MessageSquare className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-green-900">Respuesta del experto</span>
                {consulta.experto_asignado && (
                  <span className="text-xs text-green-600">
                    - {consulta.experto_asignado.first_name} {consulta.experto_asignado.last_name}
                  </span>
                )}
              </div>
              <p className="text-green-800 whitespace-pre-wrap">{consulta.respuesta}</p>
              
              {consulta.respondido_en && (
                <p className="text-xs text-green-600 mt-4">
                  Respondido: {format(new Date(consulta.respondido_en), "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback */}
      {consulta.estado === 'respondida' && !consulta.calificacion && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            ¿Fue útil esta respuesta?
          </h3>
          
          {showFeedback ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Calificación
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(n => (
                    <button
                      key={n}
                      onClick={() => setFeedback(prev => ({ ...prev, calificacion: n }))}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                        feedback.calificacion >= n
                          ? 'bg-yellow-400 text-white'
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${feedback.calificacion >= n ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comentarios (opcional)
                </label>
                <textarea
                  value={feedback.comentario}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comentario: e.target.value }))}
                  placeholder="¿Cómo podemos mejorar?"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              <button
                onClick={handleFeedback}
                className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                <Send className="w-4 h-4" />
                Enviar Feedback
              </button>
            </div>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={() => { setFeedback(prev => ({ ...prev, calificacion: 5 })); setShowFeedback(true) }}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
              >
                👍 Sí, me ayudó
              </button>
              <button
                onClick={() => { setFeedback(prev => ({ ...prev, calificacion: 2 })); setShowFeedback(true) }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                👎 No del todo
              </button>
            </div>
          )}
        </div>
      )}

      {/* Already rated */}
      {consulta.calificacion && (
        <div className="bg-gray-50 rounded-xl p-6 text-center">
          <p className="text-gray-600">
            Calificaste esta respuesta con {consulta.calificacion} estrellas
          </p>
        </div>
      )}
    </div>
  )
}
