import axios from 'axios'

// Use environment variable or default to /api for development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token from localStorage if exists
const token = localStorage.getItem('token')
if (token) {
  api.defaults.headers.common['Authorization'] = `Token ${token}`
}

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// API functions for different modules

// Auth
export const authAPI = {
  login: (data) => api.post('/auth/login/', data),
  register: (data) => api.post('/auth/register/', data),
  logout: () => api.post('/auth/logout/'),
  profile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
}

// Biblioteca
export const bibliotecaAPI = {
  getSecciones: () => api.get('/biblioteca/secciones/'),
  getDependencias: () => api.get('/biblioteca/dependencias/'),
  getArticulos: (params) => api.get('/biblioteca/articulos/', { params }),
  getArticulo: (slug) => api.get(`/biblioteca/articulos/${slug}/`),
  getDestacados: () => api.get('/biblioteca/articulos/destacados/'),
  getRelacionados: (slug) => api.get(`/biblioteca/articulos/${slug}/relacionados/`),
  buscar: (q) => api.get('/biblioteca/buscar/', { params: { q } }),
  getGlosario: () => api.get('/biblioteca/glosario/'),
  getTermino: (sigla) => api.get('/biblioteca/glosario/por_sigla/', { params: { sigla } }),
  // Documentos
  getCategoriasDocumentos: () => api.get('/biblioteca/categorias-documentos/'),
  getDocumentos: (params) => api.get('/biblioteca/documentos/', { params }),
  getDocumento: (id) => api.get(`/biblioteca/documentos/${id}/`),
  descargarDocumento: (id) => api.post(`/biblioteca/documentos/${id}/descargar/`),
  getDocumentosDestacados: () => api.get('/biblioteca/documentos/destacados/'),
  getDocumentosRecientes: () => api.get('/biblioteca/documentos/recientes/'),
}

// Consultas
export const consultasAPI = {
  listar: (params) => api.get('/consultas/consultas/', { params }),
  obtener: (id) => api.get(`/consultas/consultas/${id}/`),
  crear: (data) => api.post('/consultas/consultas/', data),
  misConsultas: () => api.get('/consultas/consultas/mis_consultas/'),
  pendientes: () => api.get('/consultas/consultas/pendientes/'),
  asignar: (id, expertoId) => api.post(`/consultas/consultas/${id}/asignar/`, { experto_id: expertoId }),
  responder: (id, respuesta) => api.post(`/consultas/consultas/${id}/responder/`, { respuesta }),
  feedback: (id, data) => api.post(`/consultas/consultas/${id}/feedback/`, data),
  estadisticas: () => api.get('/consultas/consultas/estadisticas/'),
}

// Notificaciones
export const notificacionesAPI = {
  listar: () => api.get('/consultas/notificaciones/'),
  noLeidas: () => api.get('/consultas/notificaciones/no_leidas/'),
  marcarLeida: (id) => api.post(`/consultas/notificaciones/${id}/marcar_leida/`),
  marcarTodasLeidas: () => api.post('/consultas/notificaciones/marcar_todas_leidas/'),
}

// Chatbot
export const chatbotAPI = {
  enviar: (mensaje, articuloId = null) => api.post('/chatbot/enviar/', { 
    mensaje, 
    articulo_contexto_id: articuloId 
  }),
  conversacionActual: () => api.get('/chatbot/conversacion_actual/'),
  historial: () => api.get('/chatbot/historial/'),
  nuevaConversacion: (articuloId = null) => api.post('/chatbot/nueva_conversacion/', { 
    articulo_contexto_id: articuloId 
  }),
  sugerencias: (articuloId = null) => api.get('/chatbot/sugerencias/', { 
    params: { articulo_id: articuloId } 
  }),
  preguntasFrecuentes: () => api.get('/chatbot/preguntas_frecuentes/'),
}

// Favoritos e Historial
export const usuarioAPI = {
  getFavoritos: () => api.get('/auth/favoritos/'),
  toggleFavorito: (articuloId) => api.post('/auth/favoritos/toggle/', { articulo_id: articuloId }),
  getHistorial: () => api.get('/auth/historial/'),
  registrarLectura: (articuloId, progreso = 0) => api.post('/auth/historial/registrar/', { 
    articulo_id: articuloId, 
    progreso 
  }),
}
