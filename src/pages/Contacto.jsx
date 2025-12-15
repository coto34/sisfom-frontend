import { Phone, Mail, Clock, MapPin, MessageCircle } from 'lucide-react'

export default function Contacto() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Contacto
      </h1>
      <p className="text-gray-600 mb-8">
        Opciones para obtener ayuda inmediata
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Call Center */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
            <Phone className="w-6 h-6 text-primary-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Call Center INFOM
          </h2>
          <p className="text-gray-600 mb-4">
            Atención telefónica directa con personal capacitado
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <a href="tel:+50224223500" className="text-primary-600 font-medium hover:underline">
                2422-3500
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                Lunes a Viernes, 8:00 AM - 5:00 PM
              </span>
            </div>
          </div>

          <a
            href="tel:+50224223500"
            className="mt-6 w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Llamar Ahora
          </a>
        </div>

        {/* WhatsApp */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <MessageCircle className="w-6 h-6 text-green-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            WhatsApp
          </h2>
          <p className="text-gray-600 mb-4">
            Escríbenos por WhatsApp para una respuesta rápida
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">+502 2422-3500</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                Respuesta en horario laboral
              </span>
            </div>
          </div>

          <a
            href="https://wa.me/50224223500?text=Hola,%20necesito%20ayuda%20con%20un%20procedimiento%20municipal"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Abrir WhatsApp
          </a>
        </div>

        {/* Email */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Correo Electrónico
          </h2>
          <p className="text-gray-600 mb-4">
            Para consultas formales o documentación
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <a href="mailto:fortalecimiento@infom.gob.gt" className="text-primary-600 hover:underline">
                fortalecimiento@infom.gob.gt
              </a>
            </div>
          </div>

          <a
            href="mailto:fortalecimiento@infom.gob.gt"
            className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Enviar Correo
          </a>
        </div>

        {/* Ubicación */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-4">
            <MapPin className="w-6 h-6 text-orange-600" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Oficinas INFOM
          </h2>
          <p className="text-gray-600 mb-4">
            Visítanos en nuestras oficinas centrales
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <span className="text-gray-600">
                2a. Calle 6-67 Zona 9, Ciudad de Guatemala
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="text-gray-600">
                Lunes a Viernes, 8:00 AM - 4:00 PM
              </span>
            </div>
          </div>

          <a
            href="https://maps.google.com/?q=INFOM+Guatemala"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 w-full py-3 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            Ver en Mapa
          </a>
        </div>
      </div>

      {/* Additional info */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          ¿Prefieres una consulta detallada?
        </h3>
        <p className="text-gray-600 mb-4">
          Si tu caso requiere atención especializada, puedes enviar una consulta formal 
          a través de nuestro sistema y un experto te responderá en 24-72 horas.
        </p>
        <a
          href="/consultas/nueva"
          className="inline-flex items-center gap-2 text-primary-600 font-medium hover:underline"
        >
          Enviar consulta a expertos →
        </a>
      </div>
    </div>
  )
}
