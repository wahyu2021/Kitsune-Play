import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import WeatherWidget from '@/features/navigation/components/WeatherWidget'

// Features
import { GameList, InfoPanel, AddGameModal } from '@/features/library'
import { TopBar, BottomBar } from '@/features/navigation'
import { ProfileModal } from '@/features/profile'
import { SearchModal } from '@/features/search'
import { SettingsModal } from '@/features/settings'

// Shared UI
import { Toast, ToastType } from '@/components/ui'
import SplashScreen from '@/components/SplashScreen'
import Screensaver from '@/components/Screensaver'
import AppBackground from '@/components/AppBackground'
import PowerMenuModal from '@/components/PowerMenuModal'

// Logic & Config
import { Game, useLibrary } from '@/features/library'
import { useNavigation } from '@/features/navigation'
import { useIdleTimer } from '@/hooks/useIdleTimer'
import { useAppSounds } from '@/hooks/useAppSounds'
import { logger } from '@/utils/logger'
import { useGameLauncher } from '@/hooks/useGameLauncher'
import MainLayout from '@/layouts/MainLayout'

/**
 * Main application component responsible for rendering the game launcher UI.
 * Manages global state, audio playback, splash screen, and user interactions.
 */
function App(): React.JSX.Element {
  /**
   * State for controlling the splash screen visibility.
   */
  const [showSplash, setShowSplash] = useState(true)

  /**
   * Core business logic hooks.
   */
  const {
    games,
    mediaApps,
    userName,
    setUserName,
    settings,
    setSettings,
    addGame,
    deleteGame,
    updateGamePlaytime,
    resetLibrary,
    isLoaded
  } = useLibrary()
  const isIdle = useIdleTimer(30000)

  /**
   * Audio hooks for background music and sound effects.
   */
  const { startAudio, playHover, playSelect, playBack } = useAppSounds(
    showSplash,
    settings?.bgMusicVolume ?? 0.3,
    settings?.sfxVolume ?? 0.8,
    settings?.isMuted ?? false
  )

  /**
   * Local UI state management.
   */
  const [activeTab, setActiveTab] = useState<'games' | 'media'>('games')
  const [selectedGameId, setSelectedGameId] = useState<string>('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isPowerModalOpen, setIsPowerModalOpen] = useState(false)
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null)

  const [toast, setToast] = useState<{ message: string | null; type: ToastType }>({
    message: null,
    type: 'info'
  })
  const showToast = (message: string, type: ToastType): void => setToast({ message, type })

  const { isPlaying, launchGame } = useGameLauncher({ updateGamePlaytime, showToast })

  /**
   * Derived state based on active tab.
   */
  const currentContent = activeTab === 'games' ? games : mediaApps
  const selectedGame = currentContent.find((g) => g.id === selectedGameId)

  /**
   * Discord RPC: Handle Idle State
   */
  useEffect(() => {
    if (isPlaying) return // Don't override status if game is running

    if (window.api) {
      if (isIdle) {
        window.api.updateDiscordStatus('Idle')
      } else {
        window.api.updateDiscordStatus('In Menu')
      }
    }
  }, [isIdle, isPlaying])

  /**
   * UI Event Handlers.
   */
  const handleStart = useCallback(() => {
    startAudio()
    setShowSplash(false)
  }, [startAudio])

  const handleTabChange = useCallback((tab: 'games' | 'media'): void => {
    setActiveTab(tab)
  }, [])

  const handlePlay = useCallback((): void => {
    if (selectedGame) launchGame(selectedGame)
  }, [selectedGame, launchGame])

  const handleSaveGame = useCallback(
    (gameData: Game): void => {
      addGame(gameData, activeTab === 'media')
      const isEdit = gameToEdit !== null
      showToast(`${gameData.title} ${isEdit ? 'updated' : 'added'}!`, 'success')
      setGameToEdit(null)
    },
    [addGame, activeTab, gameToEdit]
  )

  const handleDeleteAction = useCallback((): void => {
    if (!selectedGame) return

    if (confirm(`Delete "${selectedGame.title}"?`)) {
      deleteGame(selectedGameId, activeTab === 'media')
      showToast('Item deleted.', 'info')
    }
  }, [selectedGame, selectedGameId, activeTab, deleteGame])

  const handleOpenEdit = useCallback((): void => {
    if (selectedGame) {
      setGameToEdit(selectedGame)
      setIsAddModalOpen(true)
    }
  }, [selectedGame])

  const handleResetLibraryAction = useCallback((): void => {
    resetLibrary()
    showToast('Library reset to defaults.', 'info')
  }, [resetLibrary])

  /**
   * Effect to select the first game by default when content loads.
   */
  useEffect(() => {
    if (isLoaded && currentContent.length > 0 && !selectedGame) {
      setSelectedGameId(currentContent[0].id)
    }
  }, [isLoaded, currentContent, selectedGame])

  const isAnyModalOpen =
    isAddModalOpen ||
    isProfileModalOpen ||
    isSearchModalOpen ||
    isSettingsModalOpen ||
    isPowerModalOpen

  const closeAllModals = useCallback(() => {
    setIsSearchModalOpen(false)
    setIsSettingsModalOpen(false)
    setIsAddModalOpen(false)
    setIsProfileModalOpen(false)
    setIsPowerModalOpen(false)
    setGameToEdit(null)
  }, [])

  useNavigation({
    currentContent,
    selectedGameId,
    setSelectedGameId,
    activeTab,
    onTabChange: handleTabChange,
    isAnyModalOpen,
    closeAllModals,
    openSearch: () => setIsSearchModalOpen(true),
    handlePlay,
    handleDelete: handleDeleteAction,
    audio: { playHover, playSelect, playBack },
    showSplash
  })

  return (
    <MainLayout>
      <AnimatePresence>{showSplash && <SplashScreen onStart={handleStart} />}</AnimatePresence>

      <AnimatePresence>
        {isIdle && !isPlaying && !showSplash && <Screensaver activeGame={selectedGame} />}
      </AnimatePresence>

      <AppBackground selectedGame={selectedGame} />

      <motion.div
        className="relative z-20 flex h-full flex-col justify-between px-16 pt-8 pb-4"
        animate={{ opacity: isIdle ? 0 : 1, y: isIdle ? 20 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <TopBar
          userName={userName}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onOpenAddGame={() => {
            setGameToEdit(null)
            setIsAddModalOpen(true)
          }}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenPower={() => setIsPowerModalOpen(true)}
        />

        {/* Dashboard Widgets Area */}
        {settings?.weather?.latitude && (
          <div className="absolute top-24 right-16 z-10 pointer-events-none select-none">
            <WeatherWidget
              lat={settings.weather.latitude}
              lng={settings.weather.longitude}
              city={settings.weather.city}
              variant="large"
            />
          </div>
        )}

        <main className="flex flex-grow flex-col justify-end gap-4">
          {selectedGame && (
            <InfoPanel
              game={selectedGame}
              onPlay={handlePlay}
              onEdit={handleOpenEdit}
              onDelete={handleDeleteAction}
            />
          )}

          <GameList
            games={currentContent}
            selectedGameId={selectedGameId}
            onSelectGame={setSelectedGameId}
          />
        </main>

        <BottomBar />
      </motion.div>

      <AddGameModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setGameToEdit(null)
        }}
        onAddGame={handleSaveGame}
        editGame={gameToEdit}
        apiKey={settings.rawgApiKey}
      />

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        userName={userName}
        onSaveName={(name) => {
          logger.info('UI', `Updating username to: ${name}`)
          setUserName(name)
          showToast('Profile updated!', 'success')
        }}
      />

      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        games={[...games, ...mediaApps]}
        onSelectGame={(id) => {
          const isMedia = mediaApps.some((m) => m.id === id)
          handleTabChange(isMedia ? 'media' : 'games')
          setSelectedGameId(id)
        }}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onResetLibrary={handleResetLibraryAction}
        apiKey={settings?.rawgApiKey || ''}
        onSaveApiKey={(key) => {
          setSettings({ ...settings, rawgApiKey: key })
          showToast('API Key saved!', 'success')
        }}
        bgMusicVolume={settings?.bgMusicVolume ?? 0.3}
        sfxVolume={settings?.sfxVolume ?? 0.8}
        isMuted={settings?.isMuted ?? false}
        onBgMusicVolumeChange={(vol) => setSettings({ ...settings, bgMusicVolume: vol })}
        onSfxVolumeChange={(vol) => setSettings({ ...settings, sfxVolume: vol })}
        onMuteToggle={(muted) => setSettings({ ...settings, isMuted: muted })}
        weatherCity={settings?.weather?.city || ''}
        onSaveWeatherCity={(city, lat, lng) => {
          setSettings({
            ...settings,
            weather: { city, latitude: lat, longitude: lng, unit: 'celsius' }
          })
          showToast(`Location set to ${city}`, 'success')
        }}
      />

      <PowerMenuModal isOpen={isPowerModalOpen} onClose={() => setIsPowerModalOpen(false)} />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: null })}
      />
    </MainLayout>
  )
}

export default App
