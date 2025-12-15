import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const SettingsContext = createContext(null)

const DEFAULT_SETTINGS = {
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

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('sisfom_settings')
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  // Apply theme to document
  // "system" = original theme (light), "light" = light, "dark" = dark
  const applyTheme = useCallback((theme) => {
    const root = document.documentElement
    
    // Only dark mode adds the class, everything else is the original light theme
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      // Both 'system' and 'light' use the original light theme
      root.classList.remove('dark')
    }
  }, [])

  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(settings.theme)
  }, [settings.theme, applyTheme])

  // Apply compact mode
  useEffect(() => {
    if (settings.display.compactMode) {
      document.documentElement.classList.add('compact')
    } else {
      document.documentElement.classList.remove('compact')
    }
  }, [settings.display.compactMode])

  const updateSettings = (newSettings) => {
    setSettings(newSettings)
    localStorage.setItem('sisfom_settings', JSON.stringify(newSettings))
  }

  const updateSetting = (category, key, value) => {
    const newSettings = {
      ...settings,
      [category]: typeof settings[category] === 'object' 
        ? { ...settings[category], [key]: value }
        : value
    }
    updateSettings(newSettings)
  }

  const resetSettings = () => {
    updateSettings(DEFAULT_SETTINGS)
  }

  // Play notification sound if enabled
  const playNotificationSound = () => {
    if (settings.notifications.sound && settings.notifications.push) {
      try {
        const audio = new Audio('/notification.mp3')
        audio.volume = 0.3
        audio.play().catch(() => {})
      } catch {
        // Ignore audio errors
      }
    }
  }

  // Calculate if dark mode is active (only when explicitly set to 'dark')
  const isDarkMode = settings.theme === 'dark'

  const value = {
    settings,
    updateSettings,
    updateSetting,
    resetSettings,
    playNotificationSound,
    isDarkMode,
    isCompactMode: settings.display.compactMode,
    showTips: settings.display.showTips,
    defaultSidebarOpen: settings.display.sidebarOpen,
  }

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider')
  }
  return context
}
