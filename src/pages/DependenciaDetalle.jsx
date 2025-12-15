import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, FileText, Clock, Eye } from 'lucide-react'
import { bibliotecaAPI } from '../services/api'

export default function DependenciaDetalle() {
  const { id } = useParams()
  const [dependencia, setDependencia] = useState(null)
  const [articulos, setArticulos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [depRes, artRes] = await Promise.all([
          bibliotecaAPI.getDependencias(),
          bibliotecaAPI.getArticulos({ dependencia: id })
        ])
        const dep = depRes.data.find(d => d.id == id)
        setDependencia(dep)
        setArticulos(artRes.data.results || artRes.data)
      } catch (error) {
        console.error('Error fetching dependencia:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    )
  }

  if (!dependencia) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-900">Dependencia no encontrada</h2>
        <Link to="/biblioteca" className="text-primary-600 hover:underline mt-2 inline-block">
          Volver a la biblioteca
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Inicio</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/biblioteca" className="hover:text-primary-600">Biblioteca</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">{dependencia.nombre_corto}</span>
      </nav>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className={`w-14 h-14 bg-${dependencia.color}-100 rounded-xl flex items-center justify-center text-2xl`}>
            {dependencia.icono}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{dependencia.nombre}</h1>
            <p className="text-gray-500">{dependencia.nombre_corto}</p>
          </div>
        </div>
        
        {dependencia.descripcion && (
          <p className="text-gray-600">{dependencia.descripcion}</p>
        )}
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            {dependencia.total_procedimientos} procedimientos disponibles
          </p>
        </div>
      </div>

      {/* Procedimientos */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Procedimientos de {dependencia.nombre_corto}
      </h2>

      {articulos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No hay procedimientos disponibles aún</p>
        </div>
      ) : (
        <div className="space-y-4">
          {articulos.map(articulo => (
            <Link
              key={articulo.id}
              to={`/biblioteca/${articulo.slug}`}
              className="block bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary-300 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {articulo.codigo && (
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-mono rounded mb-2">
                      {articulo.codigo}
                    </span>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {articulo.titulo}
                  </h3>
                  {articulo.resumen && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {articulo.resumen}
                    </p>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
              
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {articulo.tiempo_lectura} min
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {articulo.vistas} vistas
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
