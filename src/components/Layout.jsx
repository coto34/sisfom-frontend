import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import ChatbotWidget from './ChatbotWidget'
import SpotlightSearch from './SpotlightSearch'
import OnboardingModal from './OnboardingModal'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'

export default function Layout() {
  const { user } = useAuth()
  const { defaultSidebarOpen, showTips } = useSettings()
  const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen)
  const [spotlightOpen, setSpotlightOpen] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Check if onboarding should show
  useEffect(() => {
    if (user && !user.onboarding_completado && showTips) {
      setShowOnboarding(true)
    }
  }, [user, showTips])

  // Keyboard shortcut for spotlight (Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setSpotlightOpen(true)
      }
      if (e.key === 'Escape') {
        setSpotlightOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenSpotlight={() => setSpotlightOpen(true)}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="p-6 pt-20">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Chatbot Widget */}
      <ChatbotWidget />

      {/* Spotlight Search Modal */}
      {spotlightOpen && (
        <SpotlightSearch onClose={() => setSpotlightOpen(false)} />
      )}

      {/* Onboarding Modal */}
      {showOnboarding && (
        <OnboardingModal onClose={() => setShowOnboarding(false)} />
      )}
    </div>
  )
}
