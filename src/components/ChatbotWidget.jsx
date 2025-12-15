import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { MessageSquare, X, Send, Sparkles, RotateCcw } from 'lucide-react'
import { chatbotAPI } from '../services/api'
import ReactMarkdown from 'react-markdown'

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sugerencias, setSugerencias] = useState([])
  const [articuloContexto, setArticuloContexto] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const location = useLocation()

  // Detect article context from URL
  useEffect(() => {
    const match = location.pathname.match(/^\/biblioteca\/(.+)$/)
    if (match && !match[1].startsWith('dependencia')) {
      // We're viewing an article, could fetch its ID here
      // For now, just set a flag
      setArticuloContexto({ slug: match[1] })
    } else {
      setArticuloContexto(null)
    }
  }, [location])

  // Fetch suggestions when context changes
  useEffect(() => {
    const fetchSugerencias = async () => {
      try {
        const response = await chatbotAPI.sugerencias()
        setSugerencias(response.data.sugerencias || [])
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }
    if (isOpen) {
      fetchSugerencias()
    }
  }, [isOpen, articuloContexto])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{
        id: 'welcome',
        rol: 'assistant',
        contenido: '¡Hola! 👋 Soy el asistente virtual de SISFOM. Puedo ayudarte con:\n\n• Información sobre procedimientos administrativos\n• Explicar términos y conceptos\n• Orientarte sobre normativa municipal\n\n¿En qué puedo ayudarte hoy?'
      }])
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e?.preventDefault()
    if (!input.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      rol: 'user',
      contenido: input.trim()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const response = await chatbotAPI.enviar(userMessage.contenido)
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        rol: 'assistant',
        contenido: response.data.respuesta,
        metadata: response.data.metadata
      }])
      
      if (response.data.sugerencias) {
        setSugerencias(response.data.sugerencias)
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        rol: 'assistant',
        contenido: 'Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.',
        error: true
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSugerencia = (sugerencia) => {
    setInput(sugerencia)
    inputRef.current?.focus()
  }

  const handleNewConversation = async () => {
    try {
      await chatbotAPI.nuevaConversacion()
      setMessages([{
        id: 'welcome-new',
        rol: 'assistant',
        contenido: '¡Nueva conversación iniciada! ¿En qué puedo ayudarte?'
      }])
    } catch (error) {
      console.error('Error starting new conversation:', error)
    }
  }

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`
          fixed bottom-6 right-6 w-14 h-14 bg-primary-600 text-white 
          rounded-full shadow-lg hover:bg-primary-700 transition-all
          flex items-center justify-center z-50
          ${isOpen ? 'scale-0' : 'scale-100'}
        `}
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute top-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
      </button>

      {/* Chat window */}
      <div className={`
        fixed bottom-6 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl 
        flex flex-col z-50 transition-all duration-300 overflow-hidden
        ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-primary-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Asistente SISFOM</h3>
              <p className="text-xs text-primary-200 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                En línea
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleNewConversation}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Nueva conversación"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Context indicator */}
        {articuloContexto && (
          <div className="px-4 py-2 bg-primary-50 border-b border-primary-100 text-sm text-primary-700">
            <span className="text-primary-500">Contexto:</span> Estás viendo un procedimiento
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map(message => (
            <div
              key={message.id}
              className={`flex ${message.rol === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            >
              <div className={`
                max-w-[85%] rounded-2xl px-4 py-2.5
                ${message.rol === 'user' 
                  ? 'bg-primary-600 text-white rounded-br-md' 
                  : message.error
                    ? 'bg-red-50 text-red-800 rounded-bl-md'
                    : 'bg-gray-100 text-gray-800 rounded-bl-md'
                }
              `}>
                {message.rol === 'assistant' ? (
                  <div className="prose prose-sm max-w-none">
                    <ReactMarkdown
                      components={{
                        a: ({ href, children }) => (
                          <a href={href} className="text-primary-600 hover:underline">
                            {children}
                          </a>
                        ),
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
                        li: ({ children }) => <li className="mb-0.5">{children}</li>,
                      }}
                    >
                      {message.contenido}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm">{message.contenido}</p>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {loading && (
            <div className="flex justify-start animate-fade-in-up">
              <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Suggestions */}
        {sugerencias.length > 0 && messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 mb-2">Sugerencias:</p>
            <div className="flex flex-wrap gap-1">
              {sugerencias.map((sug, i) => (
                <button
                  key={i}
                  onClick={() => handleSugerencia(sug)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
