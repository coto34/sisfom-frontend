import { useState, useEffect } from 'react'
import { 
  Settings, Bell, Moon, Sun, Monitor, Volume2, VolumeX,
  Mail, MessageSquare, Save, CheckCircle, RotateCcw
} from 'lucide-react'
import { useSettings } from '../context/SettingsContext'

export default function Configuracion() {
  const [saved, setSaved] = useState(false)
  const { settings, updateSettings, resetSettings } = useSettings()
  
  // Local copy for editing
  const [localSettings, setLocalSettings] = useState(settings)

  // Apply theme preview immediately when changed
  const handleThemeChange = (theme) => {
    setLocalSettings({ ...localSettings, theme })
    // Apply immediately for preview
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      // 'system' and 'light' both use the original theme (no dark class)
      root.classList.remove('dark')
    }
  }

  const updateLocalSetting = (category, key, value) => {
    const newSettings = {
      ...localSettings,
      [category]: typeof localSettings[category] === 'object' 
        ? { ...localSettings[category], [key]: value }
        : value
    }
    setLocalSettings(newSettings)
  }

  const handleSave = () => {
    updateSettings(localSettings)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleReset = () => {
    const defaultSettings = {
      theme: 'system',
      notifications: {
        email: true,
        push: true,
        sound: true,
        consultas: true,
        respuestas: true,
        sistema: true,
      },
      display: {
        sidebarOpen: true,
        compactMode: false,
        showTips: true,
      }
    }
    resetSettings()
    setLocalSettings(defaultSettings)
    // Reset to original light theme
    document.documentElement.classList.remove('dark')
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
        <p className="text-gray-600 mt-1">
          Personaliza tu experiencia en SISFOM
        </p>
      </div>

      {/* Success message */}
      {saved && (
        <div className="mb-6 p-4 bg-green-50 text-green-800 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Configuración guardada correctamente
        </div>
      )}

      <div className="space-y-6">
        {/* Appearance */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Sun className="w-5 h-5 text-primary-600" />
              Apariencia
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Tema de la aplicación
              </label>
              <div className="grid grid-cols-3 gap-4">
                <ThemeOption
                  icon={Monitor}
                  label="Original"
                  description="Tema por defecto"
                  value="system"
                  selected={localSettings.theme === 'system'}
                  onClick={() => handleThemeChange('system')}
                />
                <ThemeOption
                  icon={Sun}
                  label="Claro"
                  description="Fondo blanco"
                  value="light"
                  selected={localSettings.theme === 'light'}
                  onClick={() => handleThemeChange('light')}
                />
                <ThemeOption
                  icon={Moon}
                  label="Oscuro"
                  description="Fondo oscuro"
                  value="dark"
                  selected={localSettings.theme === 'dark'}
                  onClick={() => handleThemeChange('dark')}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary-600" />
              Notificaciones
            </h2>
          </div>
          <div className="p-6 space-y-6">
            {/* Notification channels */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Canales de notificación</h3>
              <div className="space-y-3">
                <ToggleSetting
                  icon={Mail}
                  label="Notificaciones por correo"
                  description="Recibe notificaciones importantes en tu email"
                  checked={localSettings.notifications.email}
                  onChange={(v) => updateLocalSetting('notifications', 'email', v)}
                />
                <ToggleSetting
                  icon={Bell}
                  label="Notificaciones push"
                  description="Muestra notificaciones en la aplicación"
                  checked={localSettings.notifications.push}
                  onChange={(v) => updateLocalSetting('notifications', 'push', v)}
                />
                <ToggleSetting
                  icon={localSettings.notifications.sound ? Volume2 : VolumeX}
                  label="Sonido de notificaciones"
                  description="Reproduce un sonido al recibir notificaciones"
                  checked={localSettings.notifications.sound}
                  onChange={(v) => updateLocalSetting('notifications', 'sound', v)}
                />
              </div>
            </div>

            {/* Notification types */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-4">Tipos de notificación</h3>
              <div className="space-y-3">
                <ToggleSetting
                  icon={MessageSquare}
                  label="Nuevas consultas"
                  description="Cuando recibes una nueva consulta (expertos)"
                  checked={localSettings.notifications.consultas}
                  onChange={(v) => updateLocalSetting('notifications', 'consultas', v)}
                />
                <ToggleSetting
                  icon={MessageSquare}
                  label="Respuestas a consultas"
                  description="Cuando responden a tus consultas"
                  checked={localSettings.notifications.respuestas}
                  onChange={(v) => updateLocalSetting('notifications', 'respuestas', v)}
                />
                <ToggleSetting
                  icon={Settings}
                  label="Notificaciones del sistema"
                  description="Actualizaciones y avisos importantes"
                  checked={localSettings.notifications.sistema}
                  onChange={(v) => updateLocalSetting('notifications', 'sistema', v)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Display preferences */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-primary-600" />
              Preferencias de visualización
            </h2>
          </div>
          <div className="p-6 space-y-3">
            <ToggleSetting
              icon={Settings}
              label="Menú lateral abierto por defecto"
              description="Mostrar el menú lateral expandido al iniciar"
              checked={localSettings.display.sidebarOpen}
              onChange={(v) => updateLocalSetting('display', 'sidebarOpen', v)}
            />
            <ToggleSetting
              icon={Settings}
              label="Modo compacto"
              description="Reduce el espaciado para ver más contenido"
              checked={localSettings.display.compactMode}
              onChange={(v) => updateLocalSetting('display', 'compactMode', v)}
            />
            <ToggleSetting
              icon={Settings}
              label="Mostrar consejos"
              description="Muestra tips y sugerencias de uso"
              checked={localSettings.display.showTips}
              onChange={(v) => updateLocalSetting('display', 'showTips', v)}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restablecer valores predeterminados
          </button>
          
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Save className="w-4 h-4" />
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  )
}

function ThemeOption({ icon: Icon, label, description, value, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
        selected
          ? 'border-primary-600 bg-primary-50 text-primary-700'
          : 'border-gray-200 hover:border-gray-300 text-gray-600'
      }`}
    >
      <Icon className="w-6 h-6" />
      <span className="text-sm font-medium">{label}</span>
      {description && (
        <span className={`text-xs ${selected ? 'text-primary-500' : 'text-gray-400'}`}>
          {description}
        </span>
      )}
    </button>
  )
}

function ToggleSetting({ icon: Icon, label, description, checked, onChange }) {
  return (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 text-gray-400 mt-0.5" />
        <div>
          <p className="font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-primary-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  )
}
