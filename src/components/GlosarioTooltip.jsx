import { useState, useEffect, useRef } from 'react'
import { BookOpen } from 'lucide-react'
import { bibliotecaAPI } from '../services/api'

// Cache for glossary terms
let glosarioCache = null

/**
 * GlosarioTooltip - Shows definition on hover for glossary terms
 * Usage: <GlosarioTooltip sigla="DAFIM">DAFIM</GlosarioTooltip>
 */
export default function GlosarioTooltip({ sigla, children }) {
  const [termino, setTermino] = useState(null)
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState(false)
  const timeoutRef = useRef(null)

  // Fetch term definition
  const fetchTermino = async () => {
    if (termino || loading) return

    setLoading(true)
    try {
      // First check cache
      if (glosarioCache) {
        const found = glosarioCache.find(t => 
          t.sigla.toLowerCase() === sigla.toLowerCase()
        )
        if (found) {
          setTermino(found)
          setLoading(false)
          return
        }
      }

      // Fetch from API
      const response = await bibliotecaAPI.getTermino(sigla)
      setTermino(response.data)
    } catch (error) {
      console.error('Error fetching term:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMouseEnter = () => {
    timeoutRef.current = setTimeout(() => {
      setShow(true)
      fetchTermino()
    }, 300)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setShow(false)
  }

  return (
    <span 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span className="border-b border-dashed border-primary-400 text-primary-700 cursor-help">
        {children}
      </span>
      
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 z-50 animate-fade-in-up">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
            {loading ? (
              <div className="flex items-center gap-2 text-gray-500">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-sm">Cargando...</span>
              </div>
            ) : termino ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-primary-500" />
                  <span className="font-bold text-primary-700">{termino.sigla}</span>
                </div>
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {termino.nombre}
                </p>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {termino.definicion}
                </p>
              </>
            ) : (
              <p className="text-sm text-gray-500">
                Término no encontrado
              </p>
            )}
            
            {/* Arrow */}
            <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
          </div>
        </div>
      )}
    </span>
  )
}

/**
 * Pre-load glossary cache
 * Call this on app init if desired
 */
export async function preloadGlosario() {
  try {
    const response = await bibliotecaAPI.getGlosario()
    glosarioCache = response.data
    return glosarioCache
  } catch (error) {
    console.error('Error preloading glossary:', error)
    return []
  }
}

/**
 * Parse text and wrap known terms with GlosarioTooltip
 * This is a simple implementation - could be enhanced with regex
 */
export function parseTextWithGlosario(text, knownTerms = []) {
  if (!text || knownTerms.length === 0) return text

  // Sort terms by length (longest first) to match longer terms first
  const sortedTerms = [...knownTerms].sort((a, b) => b.sigla.length - a.sigla.length)

  let result = text
  sortedTerms.forEach(term => {
    const regex = new RegExp(`\\b(${term.sigla})\\b`, 'gi')
    result = result.replace(regex, `<glosario-term sigla="${term.sigla}">$1</glosario-term>`)
  })

  return result
}
