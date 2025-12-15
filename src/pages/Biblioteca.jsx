import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Search, Filter, Clock, Eye, ChevronRight, BookOpen } from 'lucide-react'
import { bibliotecaAPI } from '../services/api'

export default function Biblioteca() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [articulos, setArticulos] = useState([])
  const [secciones, setSecciones] = useState([])
  const [dependencias, setDependencias] = useState([])
  const [loading, setLoading] = useState(true)
  const [busqueda, setBusqueda] = useState('')

  // Filters from URL
  const tipoFilter = searchParams.get('tipo') || ''
  const seccionFilter = searchParams.get('seccion') || ''
  const dependenciaFilter = searchParams.get('dependencia') || ''

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [artRes, secRes, depRes] = await Promise.all([
          bibliotecaAPI.getArticulos({
            tipo: tipoFilter,
            seccion: seccionFilter,
            dependencia: dependenciaFilter,
          }),
          bibliotecaAPI.getSecciones(),
          bibliotecaAPI.getDependencias()
        ])
        // Handle both array and paginated responses
        setArticulos(Array.isArray(artRes.data) ? artRes.data : artRes.data.results || [])
        setSecciones(Array.isArray(secRes.data) ? secRes.data : secRes.data.results || [])
        setDependencias(Array.isArray(depRes.data) ? depRes.data : depRes.data.results || [])
      } catch (error) {
        console.error('Error fetching biblioteca:', error)
        setArticulos([])
        setSecciones([])
        setDependencias([])
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [tipoFilter, seccionFilter, dependenciaFilter])

  const handleFilterChange = (key, value) => {
    if (value) {
      searchParams.set(key, value)
    } else {
      searchParams.delete(key)
    }
    setSearchParams(searchParams)
  }

  const filteredArticulos = articulos.filter(art => 
    !busqueda || 
    art.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
    art.resumen?.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-primary-600" />
          Biblioteca de Procedimientos
        </h1>
        <p className="text-gray-600 mt-1">
          Explora todos los procedimientos administrativos municipales
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar procedimientos..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Type filter */}
          <select
            value={tipoFilter}
            onChange={(e) => handleFilterChange('tipo', e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            <option value="">Todos los tipos</option>
            <option value="fundamento">Fundamentos</option>
            <option value="guia">Guías</option>
            <option value="procedimiento">Procedimientos</option>
            <option value="recurso">Recursos</option>
          </select>

          {/* Dependencia filter */}
          <select
            value={dependenciaFilter}
            onChange={(e) => handleFilterChange('dependencia', e.target.value)}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white"
          >
            <option value="">Todas las dependencias</option>
            {dependencias.map(dep => (
              <option key={dep.id} value={dep.id}>
                {dep.nombre_corto}
              </option>
            ))}
          </select>
        </div>

        {/* Active filters */}
        {(tipoFilter || dependenciaFilter) && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Filtros activos:</span>
            {tipoFilter && (
              <FilterTag 
                label={tipoFilter} 
                onRemove={() => handleFilterChange('tipo', '')} 
              />
            )}
            {dependenciaFilter && (
              <FilterTag 
                label={dependencias.find(d => d.id == dependenciaFilter)?.nombre_corto || dependenciaFilter}
                onRemove={() => handleFilterChange('dependencia', '')} 
              />
            )}
            <button
              onClick={() => setSearchParams({})}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Limpiar todo
            </button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {loading ? 'Cargando...' : `${filteredArticulos.length} resultado(s)`}
        </p>
      </div>

      {/* Articles grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      ) : filteredArticulos.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No se encontraron resultados
          </h3>
          <p className="text-gray-500">
            Intenta con otros términos de búsqueda o filtros
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredArticulos.map(articulo => (
            <ArticuloCard key={articulo.id} articulo={articulo} />
          ))}
        </div>
      )}

      {/* Quick access by section */}
      {!tipoFilter && !dependenciaFilter && !busqueda && (
        <div className="mt-12">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Explorar por sección
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {secciones.map(seccion => (
              <button
                key={seccion.id}
                onClick={() => handleFilterChange('seccion', seccion.id)}
                className="p-4 bg-white border border-gray-200 rounded-xl hover:border-primary-300 hover:shadow-sm transition-all text-left"
              >
                <span className="text-2xl mb-2 block">{seccion.icono}</span>
                <h3 className="font-medium text-gray-900">{seccion.nombre}</h3>
                <p className="text-sm text-gray-500">{seccion.total_articulos} artículos</p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ArticuloCard({ articulo }) {
  const tipoColors = {
    fundamento: 'bg-blue-100 text-blue-700',
    guia: 'bg-purple-100 text-purple-700',
    procedimiento: 'bg-green-100 text-green-700',
    recurso: 'bg-orange-100 text-orange-700',
  }

  return (
    <Link
      to={`/biblioteca/${articulo.slug}`}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md hover:border-primary-300 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`px-2 py-0.5 text-xs font-medium rounded ${tipoColors[articulo.tipo] || 'bg-gray-100 text-gray-700'}`}>
          {articulo.tipo}
        </span>
        {articulo.destacado && (
          <span className="text-yellow-500 text-xs">⭐</span>
        )}
      </div>

      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
        {articulo.titulo}
      </h3>

      {articulo.resumen && (
        <p className="text-sm text-gray-500 mb-4 line-clamp-2">
          {articulo.resumen}
        </p>
      )}

      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {articulo.tiempo_lectura} min
        </span>
        {articulo.dependencia_nombre && (
          <span>{articulo.dependencia_nombre}</span>
        )}
        <span className="flex items-center gap-1">
          <Eye className="w-3.5 h-3.5" />
          {articulo.vistas}
        </span>
      </div>
    </Link>
  )
}

function FilterTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-sm">
      {label}
      <button onClick={onRemove} className="hover:text-primary-900">
        ×
      </button>
    </span>
  )
}

function LoadingCard() {
  return (
    <div className="animate-pulse bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
      <div className="flex justify-between pt-3 border-t border-gray-100">
        <div className="h-3 bg-gray-200 rounded w-16"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
  )
}
