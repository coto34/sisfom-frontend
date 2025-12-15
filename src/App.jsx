import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Biblioteca from './pages/Biblioteca'
import ArticuloDetalle from './pages/ArticuloDetalle'
import DependenciaDetalle from './pages/DependenciaDetalle'
import MisConsultas from './pages/MisConsultas'
import ConsultaDetalle from './pages/ConsultaDetalle'
import NuevaConsulta from './pages/NuevaConsulta'
import Contacto from './pages/Contacto'
import PanelExpertos from './pages/PanelExpertos'
import Glosario from './pages/Glosario'
import Recursos from './pages/Recursos'
import Perfil from './pages/Perfil'
import Configuracion from './pages/Configuracion'
import Ayuda from './pages/Ayuda'

// Protected Route Component
function ProtectedRoute({ children, requireExperto = false }) {
  const { isAuthenticated, loading, isExperto } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requireExperto && !isExperto) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected routes with layout */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="biblioteca" element={<Biblioteca />} />
        <Route path="biblioteca/:slug" element={<ArticuloDetalle />} />
        <Route path="biblioteca/dependencia/:id" element={<DependenciaDetalle />} />
        <Route path="consultas" element={<MisConsultas />} />
        <Route path="consultas/nueva" element={<NuevaConsulta />} />
        <Route path="consultas/:id" element={<ConsultaDetalle />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="recursos" element={<Recursos />} />
        <Route path="recursos/glosario" element={<Glosario />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="configuracion" element={<Configuracion />} />
        <Route path="ayuda" element={<Ayuda />} />
        
        {/* Expert routes */}
        <Route path="expertos" element={
          <ProtectedRoute requireExperto>
            <PanelExpertos />
          </ProtectedRoute>
        } />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
