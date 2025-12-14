import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

// Components
import GameList from './components/GameList'
import InfoPanel from './components/InfoPanel'
import TopBar from './components/TopBar'
import BottomBar from './components/BottomBar'
import AddGameModal from './components/AddGameModal'
import ProfileModal from './components/ProfileModal'
import SearchModal from './components/SearchModal'
import SettingsModal from './components/SettingsModal'
import Toast, { ToastType } from './components/Toast'
import SplashScreen from './components/SplashScreen'
import Screensaver from './components/Screensaver'

// Logic & Config
import { Game } from './types'
import { useLibrary } from './hooks/useLibrary'
import { useIdleTimer } from './hooks/useIdleTimer'
import { getGenreColor } from './utils/theme'
import { DEFAULT_BANNER } from './config'
import { useAppSounds } from './hooks/useAppSounds'
import { logger } from './utils/logger'
import { useGamepad } from './hooks/useGamepad'

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
  const [gameToEdit, setGameToEdit] = useState<Game | null>(null)
  const [isPlaying, setIsPlaying] = useState(false) // Track if a game is running
  const [showVideo, setShowVideo] = useState(false) // Delayed video preview state

  const [toast, setToast] = useState<{ message: string | null; type: ToastType }>({
    message: null,
    type: 'info'
  })
  const showToast = (message: string, type: ToastType): void => setToast({ message, type })

  /**
   * Derived state based on active tab.
   */
  const currentContent = activeTab === 'games' ? games : mediaApps
  const selectedGame = currentContent.find((g) => g.id === selectedGameId)

  /**
   * Delayed Video Preview Logic
   * Resets showVideo on selection change, then enables it after N seconds.
   */
  useEffect(() => {
    setShowVideo(false)
    const timer = setTimeout(() => {
      setShowVideo(true)
    }, 5000) // 3 seconds delay

    return () => clearTimeout(timer)
  }, [selectedGameId])

  /**
   * Discord RPC: Handle Idle State
   */
  useEffect(() => {
    if (isPlaying) return // Don't override status if game is running

    if (isIdle) {
      window.api.updateDiscordStatus('Idle')
    } else {
      window.api.updateDiscordStatus('In Menu')
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
    if (!selectedGame) return
    logger.info('Game', `Launching: ${selectedGame.title}`)
    showToast(`Launching ${selectedGame.title}...`, 'success')
    setIsPlaying(true)

    // launchGame now waits for the process to exit
    window.api
      .launchGame(selectedGame.path_to_exe, selectedGame.title, selectedGame.launchArgs)
      .then((duration) => {
        logger.info('Game', `Session ended. Duration: ${duration} mins`)
        setIsPlaying(false)

        if (duration > 0) {
          updateGamePlaytime(selectedGame.id, duration)
          showToast(`Played for ${duration} mins`, 'info')
        }
      })
      .catch((err) => {
        logger.error('Game', 'Failed to launch game', err)
        setIsPlaying(false)
        const msg = err instanceof Error ? err.message : String(err)
        showToast(`Failed: ${msg}`, 'error')
      })
  }, [selectedGame, updateGamePlaytime])

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

  const handleNavRight = useCallback((): void => {
    if (currentContent.length === 0) return
    const currentIndex = currentContent.findIndex((g) => g.id === selectedGameId)
    const nextIndex = (currentIndex + 1) % currentContent.length
    playHover()
    setSelectedGameId(currentContent[nextIndex].id)
  }, [currentContent, selectedGameId, playHover])

  const handleNavLeft = useCallback((): void => {
    if (currentContent.length === 0) return
    const currentIndex = currentContent.findIndex((g) => g.id === selectedGameId)
    const prevIndex = (currentIndex - 1 + currentContent.length) % currentContent.length
    playHover()
    setSelectedGameId(currentContent[prevIndex].id)
  }, [currentContent, selectedGameId, playHover])

  /**
   * Gamepad Integration.
   * Maps controller inputs to UI actions.
   */
  const handleGamepadBack = useCallback(() => {
    if (isAddModalOpen || isProfileModalOpen || isSearchModalOpen || isSettingsModalOpen) {
      playBack()
      setIsSearchModalOpen(false)
      setIsSettingsModalOpen(false)
      setIsAddModalOpen(false)
      setIsProfileModalOpen(false)
      setGameToEdit(null)
    }
  }, [isAddModalOpen, isProfileModalOpen, isSearchModalOpen, isSettingsModalOpen, playBack])

  useGamepad(
    {
      onNavigateLeft: handleNavLeft,
      onNavigateRight: handleNavRight,
      onSelect: () => {
        playSelect()
        if (!isAddModalOpen && !isSettingsModalOpen) {
          handlePlay()
        }
      },
      onBack: handleGamepadBack,
      onSearch: () => {
        playSelect()
        setIsSearchModalOpen(true)
      },
      onTabSwitch: () => {
        playHover()
        handleTabChange(activeTab === 'games' ? 'media' : 'games')
      }
    },
    !showSplash
  )

  // 2. Keyboard Navigation
  useEffect(() => {
    // Block input while splash is showing
    if (showSplash) return

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (isAddModalOpen || isProfileModalOpen || isSearchModalOpen || isSettingsModalOpen) {
        if (e.key === 'Escape') {
          playBack()
          setIsSearchModalOpen(false)
          setIsSettingsModalOpen(false)
          setIsAddModalOpen(false)
          setGameToEdit(null)
        }
        return
      }

      if (currentContent.length === 0) {
        if (e.key === 'Tab') {
          e.preventDefault()
          handleTabChange(activeTab === 'games' ? 'media' : 'games')
        }
        return
      }

      if (e.key === 'ArrowRight') {
        handleNavRight()
      } else if (e.key === 'ArrowLeft') {
        handleNavLeft()
      } else if (e.key === 'Enter') {
        playSelect()
        handlePlay()
      } else if (e.ctrlKey && e.key === 'f') {
        playSelect()
        setIsSearchModalOpen(true)
      } else if (e.key === 'Tab') {
        e.preventDefault()
        playHover()
        handleTabChange(activeTab === 'games' ? 'media' : 'games')
      } else if (e.key === 'Delete') {
        handleDeleteAction()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    selectedGameId,
    currentContent,
    activeTab,
    isAddModalOpen,
    isProfileModalOpen,
    isSearchModalOpen,
    isSettingsModalOpen,
    handlePlay,
    handleDeleteAction,
    handleTabChange,
    showSplash,
    playHover,
    playSelect,
    playBack,
    handleNavRight,
    handleNavLeft
  ])

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#0f0f0f] font-sans text-white selection:bg-transparent">
      <AnimatePresence>{showSplash && <SplashScreen onStart={handleStart} />}</AnimatePresence>

      <AnimatePresence>
        {isIdle && !isPlaying && !showSplash && <Screensaver activeGame={selectedGame} />}
      </AnimatePresence>

      {/* Layer 0: Background */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          {selectedGame?.bg_video && showVideo ? (
            <motion.video
              key={selectedGame.bg_video}
              src={selectedGame.bg_video}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <motion.img
              key={selectedGame?.bg_image || 'default'}
              src={selectedGame?.bg_image || DEFAULT_BANNER}
              alt="Background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div
        className={`absolute inset-0 z-10 bg-gradient-to-t ${getGenreColor(selectedGame?.genre || '')} via-transparent to-transparent mix-blend-overlay transition-colors duration-1000 ease-in-out opacity-75`}
      />
      <div className="absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black/80 to-transparent" />

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
        />

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
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: null })}
      />
    </div>
  )
}

export default App
