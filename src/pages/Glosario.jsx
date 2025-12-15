import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, BookOpen, ChevronRight } from 'lucide-react'
import { bibliotecaAPI } from '../services/api'

export default function Glosario() {
  const [terminos, setTerminos] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [letraActiva, setLetraActiva] = useState('')

  useEffect(() => {
    const fetchTerminos = async () => {
      try {
        const response = await bibliotecaAPI.getGlosario()
        // Handle both array and paginated responses
        setTerminos(Array.isArray(response.data) ? response.data : response.data.results || [])
      } catch (error) {
        console.error('Error fetching glosario:', error)
        setTerminos([])
      } finally {
        setLoading(false)
      }
    }
    fetchTerminos()
  }, [])

  // Filter terms - backend uses 'siglas' and 'termino' field names
  const terminosFiltrados = terminos.filter(t => {
    if (!t || !t.siglas) return false
    const matchBusqueda = !busqueda || 
      (t.siglas && t.siglas.toLowerCase().includes(busqueda.toLowerCase())) ||
      (t.termino && t.termino.toLowerCase().includes(busqueda.toLowerCase())) ||
      (t.definicion && t.definicion.toLowerCase().includes(busqueda.toLowerCase()))
    
    const matchLetra = !letraActiva || (t.siglas && t.siglas.charAt(0).toUpperCase() === letraActiva)
    
    return matchBusqueda && matchLetra
  })

  // Get unique first letters - use 'siglas' field
  const letras = [...new Set(terminos.filter(t => t && t.siglas).map(t => t.siglas.charAt(0).toUpperCase()))].sort()

  // Group by letter
  const terminosAgrupados = terminosFiltrados.reduce((acc, termino) => {
    if (!termino || !termino.siglas) return acc
    const letra = termino.siglas.charAt(0).toUpperCase()
    if (!acc[letra]) acc[letra] = []
    acc[letra].push(termino)
    return acc
  }, {})

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">Inicio</Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/biblioteca" className="hover:text-primary-600">Recursos</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900">Glosario</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-primary-600" />
          Glosario de Términos
        </h1>
        <p className="text-gray-600 mt-1">
          Siglas, acrónimos y términos utilizados en la gestión municipal
        </p>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar término o sigla..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Alphabet filter */}
        <div className="flex flex-wrap gap-1 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => setLetraActiva('')}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              !letraActiva 
                ? 'bg-primary-600 text-white' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Todos
          </button>
          {letras.map(letra => (
            <button
              key={letra}
              onClick={() => setLetraActiva(letra === letraActiva ? '' : letra)}
              className={`w-8 h-8 rounded text-sm font-medium transition-colors ${
                letraActiva === letra 
                  ? 'bg-primary-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {letra}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-gray-600 mb-4">
        {terminosFiltrados.length} término(s) encontrado(s)
      </p>

      {/* Terms list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-xl p-5 border border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      ) : terminosFiltrados.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron términos
          </h3>
          <p className="text-gray-500">
            Intenta con otros términos de búsqueda
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.keys(terminosAgrupados).sort().map(letra => (
            <div key={letra}>
              <h2 className="text-lg font-bold text-primary-600 mb-4 pb-2 border-b border-gray-200">
                {letra}
              </h2>
              <div className="space-y-4">
                {terminosAgrupados[letra].map(termino => (
                  <TerminoCard key={termino.id} termino={termino} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function TerminoCard({ termino }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-primary-300 transition-all cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-primary-100 text-primary-700 font-mono font-bold rounded-lg">
              {termino.siglas}
            </span>
            <h3 className="font-semibold text-gray-900">
              {termino.termino}
            </h3>
          </div>
          <p className={`text-gray-600 ${expanded ? '' : 'line-clamp-2'}`}>
            {termino.definicion}
          </p>
          
          {termino.articulos_relacionados?.length > 0 && expanded && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                Artículos relacionados
              </p>
              <div className="flex flex-wrap gap-2">
                {termino.articulos_relacionados.map(art => (
                  <Link
                    key={art.id}
                    to={`/biblioteca/${art.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-sm text-primary-600 hover:underline"
                  >
                    {art.titulo}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <ChevronRight 
          className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-90' : ''}`} 
        />
      </div>
    </div>
  )
}
