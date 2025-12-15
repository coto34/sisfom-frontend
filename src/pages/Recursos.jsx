import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, FileText, Download, Search, Filter, 
  FileType, File, Table, ChevronRight, Clock, FolderOpen
} from 'lucide-react'
import { bibliotecaAPI } from '../services/api'

const TIPO_ICONS = {
  pdf: FileText,
  word: FileType,
  excel: Table,
  otro: File,
}

const TIPO_COLORS = {
  pdf: 'bg-red-100 text-red-700',
  word: 'bg-blue-100 text-blue-700',
  excel: 'bg-green-100 text-green-700',
  otro: 'bg-gray-100 text-gray-700',
}

export default function Recursos() {
  const [activeTab, setActiveTab] = useState('documentos')
  const [documentos, setDocumentos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [categoriaFilter, setCategoriaFilter] = useState('')
  const [tipoFilter, setTipoFilter] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [docsRes, catsRes] = await Promise.all([
          bibliotecaAPI.getDocumentos({ 
            categoria: categoriaFilter || undefined,
            tipo: tipoFilter || undefined,
            buscar: busqueda || undefined
          }),
          bibliotecaAPI.getCategoriasDocumentos()
        ])
        setDocumentos(Array.isArray(docsRes.data) ? docsRes.data : docsRes.data.results || [])
        setCategorias(Array.isArray(catsRes.data) ? catsRes.data : catsRes.data.results || [])
      } catch (error) {
        console.error('Error fetching recursos:', error)
        setDocumentos([])
        setCategorias([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [categoriaFilter, tipoFilter, busqueda])

  const handleDownload = async (doc) => {
    try {
      const response = await bibliotecaAPI.descargarDocumento(doc.id)
      window.open(response.data.url, '_blank')
    } catch (error) {
      console.error('Error downloading:', error)
      // Fallback: usar URL directa
      if (doc.archivo_url) {
        window.open(doc.archivo_url, '_blank')
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FolderOpen className="w-7 h-7 text-primary-600" />
          Centro de Recursos
        </h1>
        <p className="text-gray-600 mt-1">
          Documentos, guías y materiales de apoyo para la gestión municipal
        </p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          to="/recursos/glosario"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              Glosario
            </h3>
            <p className="text-sm text-gray-500">Términos y definiciones</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
        </Link>

        <button
          onClick={() => setActiveTab('documentos')}
          className={`flex items-center gap-4 p-5 bg-white rounded-xl border transition-all group text-left ${
            activeTab === 'documentos' 
              ? 'border-primary-300 shadow-md ring-2 ring-primary-100' 
              : 'border-gray-200 hover:border-primary-300 hover:shadow-md'
          }`}
        >
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">Documentos</h3>
            <p className="text-sm text-gray-500">{documentos.length} archivos disponibles</p>
          </div>
        </button>

        <Link
          to="/biblioteca?tipo=recurso"
          className="flex items-center gap-4 p-5 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
            <File className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              Otros Recursos
            </h3>
            <p className="text-sm text-gray-500">Artículos y plantillas</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
        </Link>
      </div>

      {/* Documents section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar documentos..."
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category filter */}
            <select
              value={categoriaFilter}
              onChange={(e) => setCategoriaFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="">Todas las categorías</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icono} {cat.nombre}
                </option>
              ))}
            </select>

            {/* Type filter */}
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
            >
              <option value="">Todos los tipos</option>
              <option value="pdf">PDF</option>
              <option value="word">Word</option>
              <option value="excel">Excel</option>
              <option value="otro">Otros</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-sm text-gray-600">
            {loading ? 'Cargando...' : `${documentos.length} documento(s) encontrado(s)`}
          </p>
        </div>

        {/* Documents list */}
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando documentos...</p>
          </div>
        ) : documentos.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay documentos disponibles
            </h3>
            <p className="text-gray-500">
              {busqueda || categoriaFilter || tipoFilter 
                ? 'Intenta con otros filtros de búsqueda'
                : 'Los administradores pueden subir documentos desde el panel de administración'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {documentos.map(doc => {
              const Icon = TIPO_ICONS[doc.tipo] || File
              const colorClass = TIPO_COLORS[doc.tipo] || TIPO_COLORS.otro
              
              return (
                <div
                  key={doc.id}
                  className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClass}`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {doc.titulo}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                      {doc.categoria_nombre && (
                        <span className="flex items-center gap-1">
                          <FolderOpen className="w-3.5 h-3.5" />
                          {doc.categoria_nombre}
                        </span>
                      )}
                      {doc.tamano && (
                        <span>{doc.tamano}</span>
                      )}
                      <span className="flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" />
                        {doc.descargas} descargas
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(doc.created_at).toLocaleDateString('es-GT')}
                      </span>
                    </div>
                    {doc.descripcion && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {doc.descripcion}
                      </p>
                    )}
                  </div>

                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(doc)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Descargar</span>
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Categories sidebar for desktop */}
      {categorias.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Explorar por categoría
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categorias.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategoriaFilter(cat.id === parseInt(categoriaFilter) ? '' : cat.id.toString())}
                className={`p-4 rounded-xl border text-left transition-all ${
                  parseInt(categoriaFilter) === cat.id
                    ? 'border-primary-300 bg-primary-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-sm'
                }`}
              >
                <span className="text-2xl mb-2 block">{cat.icono}</span>
                <h3 className="font-medium text-gray-900">{cat.nombre}</h3>
                <p className="text-sm text-gray-500">{cat.total_documentos} documentos</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
