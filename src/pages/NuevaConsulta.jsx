import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronRight, Send, AlertCircle } from 'lucide-react'
import { consultasAPI, bibliotecaAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function NuevaConsulta() {
  const navigate = useNavigate()
  const [dependencias, setDependencias] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    asunto: '',
    descripcion: '',
    categoria: 'procedimiento',
    dependencia_relacionada: '',
    prioridad: 'media',
  })

  useEffect(() => {
    const fetchDependencias = async () => {
      try {
        const response = await bibliotecaAPI.getDependencias()
        setDependencias(response.data)
      } catch (error) {
        console.error('Error fetching dependencias:', error)
      }
    }
    fetchDependencias()
  }, [])

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const data = { ...formData }
      if (!data.dependencia_relacionada) {
        delete data.dependencia_relacionada
      }

      await consultasAPI.crear(data)
      toast.success('Consulta enviada correctamente')
      navigate('/consultas')
    } catch (error) {
      toast.error('Error al enviar la consulta')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Inicio</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/consultas" className="hover:text-primary-600">Mis Consultas</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">Nueva Consulta</span>
      </nav>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-2">
          Nueva Consulta
        </h1>
        <p className="text-gray-600 mb-6">
          Envía tu consulta y un experto te responderá en 24-72 horas
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Asunto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Asunto *
            </label>
            <input
              type="text"
              name="asunto"
              value={formData.asunto}
              onChange={handleChange}
              placeholder="Describe brevemente tu consulta"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              required
            />
          </div>

          {/* Categoría y Dependencia */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                name="categoria"
                value={formData.categoria}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="procedimiento">Procedimiento Administrativo</option>
                <option value="normativa">Normativa Legal</option>
                <option value="tecnico">Aspecto Técnico</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dependencia Relacionada
              </label>
              <select
                name="dependencia_relacionada"
                value={formData.dependencia_relacionada}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
              >
                <option value="">Seleccionar (opcional)</option>
                {dependencias.map(dep => (
                  <option key={dep.id} value={dep.id}>
                    {dep.nombre_corto} - {dep.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción detallada *
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe tu situación con el mayor detalle posible..."
              rows={6}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Incluye contexto relevante: tipo de municipalidad, situación específica, intentos previos, etc.
            </p>
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <div className="flex gap-4">
              {[
                { value: 'baja', label: 'Baja', desc: 'No urgente' },
                { value: 'media', label: 'Media', desc: 'Normal' },
                { value: 'alta', label: 'Alta', desc: 'Importante' },
                { value: 'urgente', label: 'Urgente', desc: 'Crítico' },
              ].map(opt => (
                <label
                  key={opt.value}
                  className={`flex-1 p-3 border rounded-lg cursor-pointer text-center transition-colors ${
                    formData.prioridad === opt.value
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="prioridad"
                    value={opt.value}
                    checked={formData.prioridad === opt.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <p className="font-medium text-sm">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Info box */}
          <div className="bg-blue-50 rounded-lg p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Tiempo de respuesta</p>
              <p>Las consultas son atendidas por expertos del INFOM en un plazo de 24 a 72 horas hábiles.</p>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4 pt-4">
            <Link
              to="/consultas"
              className="px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-spin">⏳</span>
              ) : (
                <Send className="w-4 h-4" />
              )}
              Enviar Consulta
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
