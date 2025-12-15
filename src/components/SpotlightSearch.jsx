import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, FileText, Building2, BookOpen, MessageSquare, ArrowRight } from 'lucide-react'
import { bibliotecaAPI } from '../services/api'

const TIPO_ICONS = {
  articulo: FileText,
  dependencia: Building2,
  glosario: BookOpen,
}

const TIPO_LABELS = {
  articulo: 'Procedimiento',
  dependencia: 'Dependencia',
  glosario: 'Glosario',
}

export default function SpotlightSearch({ onClose }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Search when query changes
  useEffect(() => {
    const search = async () => {
      if (query.length < 2) {
        setResults([])
        return
      }

      setLoading(true)
      try {
        const response = await bibliotecaAPI.buscar(query)
        setResults(response.data)
        setSelectedIndex(0)
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [query])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex(prev => Math.min(prev + 1, results.length))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex(prev => Math.max(prev - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (selectedIndex === results.length) {
          // "Ask assistant" option
          handleAskAssistant()
        } else if (results[selectedIndex]) {
          handleSelect(results[selectedIndex])
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [results, selectedIndex, query])

  const handleSelect = (result) => {
    navigate(result.url)
    onClose()
  }

  const handleAskAssistant = () => {
    // Open chatbot with the query
    // For now, just close and let them use the chatbot
    onClose()
  }

  return (
    <div className="spotlight-overlay" onClick={onClose}>
      <div 
        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl bg-white rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-gray-200">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar procedimientos, dependencias, términos..."
            className="flex-1 text-lg outline-none placeholder:text-gray-400"
          />
          <kbd className="px-2 py-1 text-xs bg-gray-100 rounded text-gray-500">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-2 text-sm">Buscando...</p>
            </div>
          ) : query.length < 2 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Escribe al menos 2 caracteres para buscar</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <QuickAction onClick={() => setQuery('fondo rotativo')}>
                  Fondo rotativo
                </QuickAction>
                <QuickAction onClick={() => setQuery('licencia construcción')}>
                  Licencia construcción
                </QuickAction>
                <QuickAction onClick={() => setQuery('DAFIM')}>
                  DAFIM
                </QuickAction>
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500">
              <p className="text-sm">No se encontraron resultados para "{query}"</p>
            </div>
          ) : (
            <div className="py-2">
              {/* Group results by type */}
              {['articulo', 'dependencia', 'glosario'].map(tipo => {
                const tipoResults = results.filter(r => r.tipo === tipo)
                if (tipoResults.length === 0) return null
                
                return (
                  <div key={tipo} className="mb-2">
                    <p className="px-4 py-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      {TIPO_LABELS[tipo]}s
                    </p>
                    {tipoResults.map((result, idx) => {
                      const globalIdx = results.indexOf(result)
                      const Icon = TIPO_ICONS[result.tipo] || FileText
                      
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleSelect(result)}
                          className={`
                            w-full px-4 py-3 flex items-start gap-3 text-left transition-colors
                            ${globalIdx === selectedIndex ? 'bg-primary-50' : 'hover:bg-gray-50'}
                          `}
                        >
                          <div className={`
                            w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                            ${globalIdx === selectedIndex ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}
                          `}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`font-medium truncate ${globalIdx === selectedIndex ? 'text-primary-700' : 'text-gray-900'}`}>
                              {result.titulo}
                            </p>
                            {result.descripcion && (
                              <p className="text-sm text-gray-500 truncate mt-0.5">
                                {result.descripcion}
                              </p>
                            )}
                          </div>
                          {globalIdx === selectedIndex && (
                            <ArrowRight className="w-4 h-4 text-primary-500 flex-shrink-0 mt-1" />
                          )}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}

          {/* Ask assistant option */}
          {query.length >= 2 && (
            <div className="border-t border-gray-200">
              <button
                onClick={handleAskAssistant}
                className={`
                  w-full px-4 py-3 flex items-center gap-3 text-left transition-colors
                  ${selectedIndex === results.length ? 'bg-primary-50' : 'hover:bg-gray-50'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${selectedIndex === results.length ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-500'}
                `}>
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className={`font-medium ${selectedIndex === results.length ? 'text-primary-700' : 'text-gray-900'}`}>
                    Preguntar al asistente sobre "{query}"
                  </p>
                  <p className="text-sm text-gray-500">
                    Obtén una respuesta personalizada
                  </p>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-white rounded border">↓</kbd>
              navegar
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white rounded border">↵</kbd>
              seleccionar
            </span>
          </div>
          <span>SISFOM</span>
        </div>
      </div>
    </div>
  )
}

function QuickAction({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
    >
      {children}
    </button>
  )
}
