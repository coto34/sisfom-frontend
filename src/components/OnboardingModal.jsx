import { useState } from 'react'
import { BookOpen, MessageSquare, FileQuestion, Home, ArrowRight, ArrowLeft, Check } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STEPS = [
  {
    icon: BookOpen,
    title: 'Biblioteca de Procedimientos',
    description: 'Accede a todos los procedimientos administrativos municipales organizados por dependencia. Encuentra guías paso a paso, normativa aplicable y documentos de soporte.',
    color: 'blue',
  },
  {
    icon: MessageSquare,
    title: 'Asistente Virtual',
    description: 'Nuestro chatbot con inteligencia artificial puede resolver tus dudas al instante. Pregunta sobre cualquier procedimiento y obtén respuestas claras y precisas.',
    color: 'purple',
  },
  {
    icon: FileQuestion,
    title: 'Consultas a Expertos',
    description: 'Para casos específicos que requieren atención personalizada, envía una consulta y un experto te responderá en 24-72 horas.',
    color: 'green',
  },
  {
    icon: Home,
    title: '¡Listo para comenzar!',
    description: 'Tu panel de inicio te muestra accesos rápidos, artículos recientes y el estado de tus consultas. Explora SISFOM y fortalece tu gestión municipal.',
    color: 'orange',
  },
]

const COLORS = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', ring: 'ring-blue-500' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', ring: 'ring-purple-500' },
  green: { bg: 'bg-green-100', text: 'text-green-600', ring: 'ring-green-500' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', ring: 'ring-orange-500' },
}

export default function OnboardingModal({ onClose }) {
  const [currentStep, setCurrentStep] = useState(0)
  const { completeOnboarding } = useAuth()

  const step = STEPS[currentStep]
  const colors = COLORS[step.color]
  const isLastStep = currentStep === STEPS.length - 1

  const handleNext = async () => {
    if (isLastStep) {
      try {
        await completeOnboarding()
      } catch (error) {
        console.error('Error:', error)
      }
      onClose()
    } else {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(0, prev - 1))
  }

  const handleSkip = async () => {
    try {
      await completeOnboarding()
    } catch (error) {
      console.error('Error:', error)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Progress bar */}
        <div className="h-1 bg-gray-100">
          <div 
            className="h-full bg-primary-500 transition-all duration-300"
            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Content */}
        <div className="p-8 text-center">
          {/* Icon */}
          <div className={`w-20 h-20 ${colors.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
            <step.icon className={`w-10 h-10 ${colors.text}`} />
          </div>

          {/* Step indicator */}
          <p className="text-sm text-gray-500 mb-2">
            Paso {currentStep + 1} de {STEPS.length}
          </p>

          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {step.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-8">
            {step.description}
          </p>

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  index === currentStep 
                    ? `${colors.bg} ring-2 ${colors.ring} ring-offset-2` 
                    : index < currentStep 
                      ? 'bg-primary-500' 
                      : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              Saltar tour
            </button>

            <div className="flex items-center gap-3">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Anterior
                </button>
              )}
              
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
              >
                {isLastStep ? (
                  <>
                    <Check className="w-4 h-4" />
                    Comenzar
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
