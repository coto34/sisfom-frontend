import { useState } from 'react'
import { 
  HelpCircle, Book, MessageSquare, Mail, Phone, 
  ChevronDown, ChevronRight, ExternalLink, Search,
  BookOpen, FileText, Users, Lightbulb
} from 'lucide-react'

const FAQ_DATA = [
  {
    category: 'General',
    icon: BookOpen,
    questions: [
      {
        q: '¿Qué es SISFOM?',
        a: 'SISFOM (Sistema de Fortalecimiento Municipal) es una plataforma digital diseñada para apoyar a las municipalidades de Guatemala en la gestión de procedimientos administrativos. Proporciona acceso a manuales, guías metodológicas, procedimientos estandarizados y un sistema de consultas con expertos.'
      },
      {
        q: '¿Quién puede usar SISFOM?',
        a: 'SISFOM está diseñado para funcionarios municipales de Guatemala, especialmente aquellos que trabajan en áreas administrativas, planificación, finanzas, recursos humanos y otras dependencias municipales.'
      },
      {
        q: '¿SISFOM tiene costo?',
        a: 'El acceso básico a SISFOM es gratuito para funcionarios municipales registrados. El sistema es una iniciativa de fortalecimiento institucional apoyada por INFOM.'
      }
    ]
  },
  {
    category: 'Biblioteca',
    icon: Book,
    questions: [
      {
        q: '¿Cómo busco un procedimiento específico?',
        a: 'Puedes usar la barra de búsqueda (Ctrl+K o ⌘K) para encontrar procedimientos por nombre, dependencia o palabras clave. También puedes navegar por la biblioteca usando los filtros de sección y dependencia en el menú lateral.'
      },
      {
        q: '¿Qué son los procedimientos estándar?',
        a: 'Los procedimientos estándar son guías paso a paso basadas en las mejores prácticas y la normativa vigente. Cada procedimiento incluye: objetivo, alcance, normativa aplicable, pasos detallados con responsables, y documentos adjuntos requeridos.'
      },
      {
        q: '¿Puedo guardar procedimientos favoritos?',
        a: 'Sí, puedes marcar cualquier artículo como favorito haciendo clic en el icono de estrella. Tus favoritos aparecerán en el menú lateral para acceso rápido.'
      },
      {
        q: '¿Qué significan las siglas en los documentos?',
        a: 'SISFOM incluye un glosario completo con más de 100 términos y siglas utilizadas en la administración municipal. Puedes acceder al glosario desde el menú Recursos o simplemente pasar el cursor sobre las siglas resaltadas en los documentos.'
      }
    ]
  },
  {
    category: 'Consultas',
    icon: MessageSquare,
    questions: [
      {
        q: '¿Cómo hago una consulta a un experto?',
        a: 'Ve a "Mis Consultas" y haz clic en "Nueva Consulta". Selecciona el tema relacionado, escribe tu pregunta de forma clara y detallada, y envíala. Un experto te responderá lo antes posible.'
      },
      {
        q: '¿Cuánto tiempo tarda la respuesta?',
        a: 'El tiempo de respuesta varía según la complejidad de la consulta y la disponibilidad de expertos. Las consultas simples suelen responderse en 24-48 horas hábiles. Recibirás una notificación cuando tu consulta sea respondida.'
      },
      {
        q: '¿Puedo adjuntar documentos a mi consulta?',
        a: 'Actualmente el sistema permite adjuntar contexto adicional en formato de texto. Para compartir documentos específicos, puedes describir su contenido en la consulta o coordinar con el experto asignado.'
      }
    ]
  },
  {
    category: 'Cuenta',
    icon: Users,
    questions: [
      {
        q: '¿Cómo cambio mi contraseña?',
        a: 'Ve a "Mi Perfil" desde el menú de usuario (esquina superior derecha), selecciona la pestaña "Cambiar Contraseña" e ingresa tu contraseña actual y la nueva contraseña.'
      },
      {
        q: '¿Cómo actualizo mis datos personales?',
        a: 'En "Mi Perfil" puedes actualizar tu nombre, correo electrónico, teléfono y cargo. La municipalidad asignada solo puede ser modificada por un administrador del sistema.'
      },
      {
        q: '¿Qué hago si olvidé mi contraseña?',
        a: 'En la pantalla de inicio de sesión, haz clic en "¿Olvidaste tu contraseña?" e ingresa tu correo electrónico registrado. Recibirás instrucciones para restablecerla.'
      }
    ]
  }
]

const QUICK_GUIDES = [
  {
    title: 'Primeros pasos en SISFOM',
    description: 'Aprende a navegar y usar las funciones básicas',
    icon: Lightbulb,
    steps: [
      'Explora el Dashboard para ver estadísticas y accesos rápidos',
      'Navega por la Biblioteca para conocer los procedimientos disponibles',
      'Usa la búsqueda rápida (Ctrl+K) para encontrar contenido',
      'Marca tus procedimientos favoritos para acceso rápido',
      'Realiza consultas cuando necesites apoyo especializado'
    ]
  },
  {
    title: 'Cómo usar la Biblioteca',
    description: 'Encuentra y consulta procedimientos eficientemente',
    icon: Book,
    steps: [
      'Usa los filtros del menú lateral para navegar por sección o dependencia',
      'Haz clic en un procedimiento para ver sus detalles completos',
      'Revisa los pasos, responsables y documentos requeridos',
      'Guarda como favorito los procedimientos que uses frecuentemente',
      'Consulta el glosario si encuentras términos desconocidos'
    ]
  },
  {
    title: 'Sistema de Consultas',
    description: 'Obtén respuestas de expertos municipales',
    icon: MessageSquare,
    steps: [
      'Ve a "Mis Consultas" desde el menú principal',
      'Haz clic en "Nueva Consulta"',
      'Selecciona el tema más relacionado con tu pregunta',
      'Escribe tu consulta de forma clara y detallada',
      'Espera la respuesta y proporciona feedback si fue útil'
    ]
  }
]

export default function Ayuda() {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedCategory, setExpandedCategory] = useState('General')
  const [expandedQuestion, setExpandedQuestion] = useState(null)
  const [activeGuide, setActiveGuide] = useState(null)

  // Filter FAQ based on search
  const filteredFAQ = FAQ_DATA.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.a.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0)

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Centro de Ayuda</h1>
        <p className="text-gray-600 mt-1">
          Encuentra respuestas y aprende a usar SISFOM
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Buscar en la ayuda..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickLink
          icon={Book}
          title="Guías Rápidas"
          description="Aprende lo básico"
          onClick={() => document.getElementById('guides')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <QuickLink
          icon={MessageSquare}
          title="Preguntas Frecuentes"
          description="Respuestas comunes"
          onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <QuickLink
          icon={Mail}
          title="Contactar Soporte"
          description="¿Necesitas más ayuda?"
          onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
        />
      </div>

      {/* Quick Guides */}
      <section id="guides" className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary-600" />
          Guías Rápidas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {QUICK_GUIDES.map((guide, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setActiveGuide(activeGuide === index ? null : index)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <guide.icon className="w-5 h-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{guide.title}</h3>
                  <p className="text-sm text-gray-500">{guide.description}</p>
                </div>
              </div>
              
              {activeGuide === index && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <ol className="space-y-2">
                    {guide.steps.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm">
                        <span className="w-5 h-5 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-medium">
                          {i + 1}
                        </span>
                        <span className="text-gray-600">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mb-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-primary-600" />
          Preguntas Frecuentes
        </h2>
        
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {filteredFAQ.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No se encontraron resultados para "{searchTerm}"</p>
            </div>
          ) : (
            filteredFAQ.map((category) => (
              <div key={category.category} className="border-b border-gray-200 last:border-0">
                <button
                  onClick={() => setExpandedCategory(
                    expandedCategory === category.category ? null : category.category
                  )}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <category.icon className="w-5 h-5 text-primary-600" />
                    <span className="font-medium text-gray-900">{category.category}</span>
                    <span className="text-sm text-gray-400">
                      ({category.questions.length} preguntas)
                    </span>
                  </div>
                  {expandedCategory === category.category ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                
                {expandedCategory === category.category && (
                  <div className="px-6 pb-4">
                    {category.questions.map((item, index) => (
                      <div key={index} className="border-t border-gray-100 first:border-0">
                        <button
                          onClick={() => setExpandedQuestion(
                            expandedQuestion === `${category.category}-${index}` 
                              ? null 
                              : `${category.category}-${index}`
                          )}
                          className="w-full py-3 flex items-start justify-between text-left"
                        >
                          <span className="font-medium text-gray-700 pr-4">{item.q}</span>
                          {expandedQuestion === `${category.category}-${index}` ? (
                            <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1" />
                          )}
                        </button>
                        {expandedQuestion === `${category.category}-${index}` && (
                          <p className="pb-3 text-gray-600 text-sm leading-relaxed">
                            {item.a}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>

      {/* Contact Support */}
      <section id="contact">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Mail className="w-5 h-5 text-primary-600" />
          ¿Necesitas más ayuda?
        </h2>
        
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-lg mb-2">Contacta al equipo de soporte</h3>
              <p className="text-primary-100 text-sm mb-4">
                Si no encontraste respuesta a tu pregunta, nuestro equipo está listo para ayudarte.
              </p>
              <div className="space-y-2">
                <a
                  href="mailto:soporte@sisfom.gob.gt"
                  className="flex items-center gap-2 text-sm hover:text-primary-200 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  soporte@sisfom.gob.gt
                </a>
                <a
                  href="tel:+50222223333"
                  className="flex items-center gap-2 text-sm hover:text-primary-200 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +502 2222-3333
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">Recursos adicionales</h3>
              <p className="text-primary-100 text-sm mb-4">
                Consulta la documentación oficial y guías de INFOM.
              </p>
              <div className="space-y-2">
                <a
                  href="https://infom.gob.gt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm hover:text-primary-200 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Portal INFOM
                </a>
                <a
                  href="/contacto"
                  className="flex items-center gap-2 text-sm hover:text-primary-200 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  Formulario de contacto
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Version info */}
      <div className="mt-8 text-center text-sm text-gray-400">
        <p>SISFOM v1.0.0 • Última actualización: Diciembre 2025</p>
      </div>
    </div>
  )
}

function QuickLink({ icon: Icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-primary-300 hover:shadow-md transition-all text-left"
    >
      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary-600" />
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
    </button>
  )
}
