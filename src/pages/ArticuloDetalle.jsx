import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ChevronRight, Clock, Eye, Star, Printer, Download, Share2,
  BookOpen, FileText, AlertCircle, CheckCircle
} from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { bibliotecaAPI, usuarioAPI } from '../services/api'
import toast from 'react-hot-toast'

export default function ArticuloDetalle() {
  const { slug } = useParams()
  const [articulo, setArticulo] = useState(null)
  const [relacionados, setRelacionados] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [esFavorito, setEsFavorito] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const contentRef = useRef(null)

  useEffect(() => {
    const fetchArticulo = async () => {
      setLoading(true)
      setError(null)
      try {
        const [artRes, relRes] = await Promise.all([
          bibliotecaAPI.getArticulo(slug),
          bibliotecaAPI.getRelacionados(slug)
        ])
        setArticulo(artRes.data)
        setRelacionados(relRes.data)
        setEsFavorito(artRes.data.es_favorito)
        
        // Register reading
        usuarioAPI.registrarLectura(artRes.data.id, 0)
      } catch (err) {
        setError('No se pudo cargar el artículo')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticulo()
  }, [slug])

  // Reading progress tracker
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return
      
      const element = contentRef.current
      const rect = element.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementHeight = element.scrollHeight
      
      const scrolled = Math.max(0, -rect.top)
      const visible = Math.min(windowHeight, rect.bottom) - Math.max(0, rect.top)
      const total = elementHeight - windowHeight
      
      if (total > 0) {
        const progress = Math.min(100, Math.max(0, (scrolled / total) * 100))
        setReadingProgress(progress)
        
        // Update reading progress in backend when completed
        if (progress > 90 && articulo) {
          usuarioAPI.registrarLectura(articulo.id, Math.round(progress))
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [articulo])

  const handleToggleFavorito = async () => {
    try {
      await usuarioAPI.toggleFavorito(articulo.id)
      setEsFavorito(!esFavorito)
      toast.success(esFavorito ? 'Eliminado de favoritos' : 'Agregado a favoritos')
    } catch (err) {
      toast.error('Error al actualizar favoritos')
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: articulo.titulo,
        text: articulo.resumen,
        url: window.location.href,
      })
    } catch (err) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast.success('Enlace copiado al portapapeles')
    }
  }

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error || !articulo) {
    return (
      <div className="max-w-3xl mx-auto text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {error || 'Artículo no encontrado'}
        </h2>
        <Link to="/biblioteca" className="text-primary-600 hover:underline">
          Volver a la biblioteca
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Reading progress bar */}
      <div 
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
      />

      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <Link to="/" className="hover:text-primary-600">Inicio</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/biblioteca" className="hover:text-primary-600">Biblioteca</Link>
          {articulo.dependencia && (
            <>
              <ChevronRight className="w-4 h-4" />
              <Link 
                to={`/biblioteca/dependencia/${articulo.dependencia.id}`}
                className="hover:text-primary-600"
              >
                {articulo.dependencia.nombre_corto}
              </Link>
            </>
          )}
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 truncate max-w-xs">{articulo.titulo}</span>
        </nav>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              {articulo.codigo && (
                <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-mono rounded mb-2">
                  {articulo.codigo}
                </span>
              )}
              <h1 className="text-2xl font-bold text-gray-900">
                {articulo.titulo}
              </h1>
            </div>
            <button
              onClick={handleToggleFavorito}
              className={`p-2 rounded-lg transition-colors ${
                esFavorito 
                  ? 'bg-yellow-100 text-yellow-600' 
                  : 'hover:bg-gray-100 text-gray-400'
              }`}
            >
              <Star className={`w-5 h-5 ${esFavorito ? 'fill-current' : ''}`} />
            </button>
          </div>

          {articulo.resumen && (
            <p className="text-gray-600 mb-4">{articulo.resumen}</p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            {articulo.dependencia && (
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {articulo.dependencia.nombre}
              </span>
            )}
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {articulo.tiempo_lectura} min de lectura
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {articulo.vistas} vistas
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
            >
              <Printer className="w-4 h-4" />
              Imprimir
            </button>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg text-sm"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content */}
          <div className="lg:col-span-2" ref={contentRef}>
            {/* Objetivo y Alcance */}
            {(articulo.objetivo || articulo.alcance) && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Identificación
                </h2>
                
                {articulo.objetivo && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Objetivo y Alcance</h3>
                    <p className="text-gray-600">{articulo.objetivo}</p>
                  </div>
                )}
                
                {articulo.alcance && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 mb-1">Alcance</h3>
                    <p className="text-gray-600">{articulo.alcance}</p>
                  </div>
                )}
              </div>
            )}

            {/* Normativa */}
            {articulo.normativa && (
              <div className="bg-blue-50 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Normativa Aplicable
                </h2>
                <div className="text-blue-800 whitespace-pre-line">
                  {articulo.normativa}
                </div>
              </div>
            )}

            {/* Pasos del procedimiento */}
            {articulo.pasos && articulo.pasos.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Descripción del Procedimiento
                </h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                          #
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                          Responsable
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                          Actividad
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/4">
                          Control Interno
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {articulo.pasos.map((paso, index) => (
                        <tr key={paso.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {paso.numero.toString().padStart(2, '0')}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {paso.responsable}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800">
                            {paso.actividad}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500">
                            {paso.control_interno || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Contenido markdown */}
            {articulo.contenido && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                <div className="markdown-content">
                  <ReactMarkdown>{articulo.contenido}</ReactMarkdown>
                </div>
              </div>
            )}

            {/* Documentos adjuntos */}
            {articulo.documentos_adjuntos && (
              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <h2 className="text-lg font-semibold text-green-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Documentos Adjuntos
                </h2>
                <div className="text-green-800 whitespace-pre-line">
                  {articulo.documentos_adjuntos}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related articles */}
            {relacionados.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Artículos Relacionados
                </h3>
                <div className="space-y-3">
                  {relacionados.map(rel => (
                    <Link
                      key={rel.id}
                      to={`/biblioteca/${rel.slug}`}
                      className="block p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <p className="font-medium text-gray-900 text-sm line-clamp-2">
                        {rel.titulo}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {rel.dependencia_nombre}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Help CTA */}
            <div className="bg-primary-50 rounded-xl p-5">
              <h3 className="font-semibold text-primary-900 mb-2">
                ¿Tienes dudas?
              </h3>
              <p className="text-primary-700 text-sm mb-4">
                Nuestro asistente virtual puede ayudarte con este procedimiento.
              </p>
              <button className="w-full py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors">
                Preguntar al asistente
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

function LoadingSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  )
}
