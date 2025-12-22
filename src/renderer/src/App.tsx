/**
 * @fileoverview Root application component.
 * Manages global state, modals, navigation, and audio playback.
 * @module renderer/App
 */

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import WeatherWidget from '@/features/navigation/components/WeatherWidget'

import { GameList, InfoPanel, AddGameModal, LibraryToolbar } from '@/features/library'
import { TopBar, BottomBar } from '@/features/navigation'
import { ProfileModal } from '@/features/profile'
import { SearchModal } from '@/features/search'
import { SettingsModal } from '@/features/settings'

import { Toast, ToastType, Modal } from '@/components/ui'
import SplashScreen from '@/components/SplashScreen'
import Screensaver from '@/components/Screensaver'
import AppBackground from '@/components/AppBackground'
import PowerMenuModal from '@/components/PowerMenuModal'

import { Game, useLibrary } from '@/features/library'
import { useNavigation } from '@/features/navigation'
import { useIdleTimer } from '@/hooks/useIdleTimer'
import { useAppSounds } from '@/hooks/useAppSounds'
import { logger } from '@/utils/logger'
import { useGameLauncher } from '@/hooks/useGameLauncher'
import { useAppModals } from '@/hooks/useAppModals'
import MainLayout from '@/layouts/MainLayout'

/** Main application component. */
function App(): React.JSX.Element {
  const [showSplash, setShowSplash] = useState(true)

  const {
    games,
    mediaApps,
    userName,
    setUserName,
    settings,
    setSettings,
    addGame,
    addGames,
    deleteGame,
    toggleFavorite,
    toggleHidden,
    updateGamePlaytime,
    resetLibrary,
    isLoaded,
    sortOption,
    setSortOption,
    showHidden,
    setShowHidden
  } = useLibrary()
  const isIdle = useIdleTimer(30000)

  const {
    isAddModalOpen,
    setIsAddModalOpen,
    isProfileModalOpen,
    setIsProfileModalOpen,
    isSearchModalOpen,
    setIsSearchModalOpen,
    isSettingsModalOpen,
    setIsSettingsModalOpen,
    isPowerModalOpen,
    setIsPowerModalOpen,
    gameToEdit,
    setGameToEdit,
    modalConfig,
    setModalConfig,
    showConfirm,
    closeAllModals,
    openAddGameModal,
    isAnyModalOpen
  } = useAppModals()

  const { startAudio, playHover, playSelect, playBack } = useAppSounds(
    showSplash,
    settings?.bgMusicVolume ?? 0.3,
    settings?.sfxVolume ?? 0.8,
    settings?.isMuted ?? false,
    settings?.customBgMusicPath
  )

  const [activeTab, setActiveTab] = useState<'games' | 'media'>('games')
  const [selectedGameId, setSelectedGameId] = useState<string>('')

  const [toast, setToast] = useState<{ message: string | null; type: ToastType }>({
    message: null,
    type: 'info'
  })
  const showToast = (message: string, type: ToastType): void => setToast({ message, type })

  const { playingGame, launchGame } = useGameLauncher({ updateGamePlaytime, showToast })
  const isPlaying = !!playingGame

  const currentContent = activeTab === 'games' ? games : mediaApps
  const selectedGame = currentContent.find((g) => g.id === selectedGameId)

  useEffect(() => {
    if (isPlaying) return

    if (window.api) {
      if (isIdle) {
        window.api.updateDiscordStatus('Idle')
      } else {
        window.api.updateDiscordStatus('In Menu')
      }
    }
  }, [isIdle, isPlaying])

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
      const isEdit = !!gameToEdit
      showToast(`${gameData.title} ${isEdit ? 'updated' : 'added'}!`, 'success')
      setGameToEdit(null)
    },
    [addGame, activeTab, gameToEdit, setGameToEdit]
  )

  const handleDeleteAction = useCallback((): void => {
    if (!selectedGame) return

    showConfirm('Delete Game', `Are you sure you want to delete "${selectedGame.title}"?`, () => {
      deleteGame(selectedGameId, activeTab === 'media')
      showToast('Item deleted.', 'info')
    })
  }, [selectedGame, selectedGameId, activeTab, deleteGame, showConfirm])

  const handleToggleFavoriteAction = useCallback((): void => {
    if (selectedGame) {
      toggleFavorite(selectedGame.id, activeTab === 'media')
    }
  }, [selectedGame, activeTab, toggleFavorite])

  const handleToggleHiddenAction = useCallback((): void => {
    if (selectedGame) {
      toggleHidden(selectedGame.id, activeTab === 'media')
    }
  }, [selectedGame, activeTab, toggleHidden])

  const handleOpenEdit = useCallback((): void => {
    if (selectedGame) {
      openAddGameModal(selectedGame)
    }
  }, [selectedGame, openAddGameModal])

  const handleResetLibraryAction = useCallback((): void => {
    resetLibrary()
    showToast('Library reset to defaults.', 'info')
  }, [resetLibrary])

  useEffect(() => {
    if (isLoaded && currentContent.length > 0 && !selectedGame) {
      setSelectedGameId(currentContent[0].id)
    }
  }, [isLoaded, currentContent, selectedGame])

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
          onOpenAddGame={() => openAddGameModal(null)}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onOpenSearch={() => setIsSearchModalOpen(true)}
          onOpenPower={() => setIsPowerModalOpen(true)}
          playingGame={playingGame}
        />

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
              onToggleFavorite={handleToggleFavoriteAction}
              onToggleHidden={handleToggleHiddenAction}
            />
          )}

          <LibraryToolbar
            sortOption={sortOption}
            setSortOption={setSortOption}
            showHidden={showHidden}
            setShowHidden={setShowHidden}
          />

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
        customBgMusicPath={settings?.customBgMusicPath}
        onSaveCustomBgMusic={(path) => {
          setSettings({ ...settings, customBgMusicPath: path })
          showToast(path ? 'Background music updated!' : 'Background music reset.', 'success')
        }}
        weatherCity={settings?.weather?.city || ''}
        onSaveWeatherCity={(city, lat, lng) => {
          setSettings({
            ...settings,
            weather: { city, latitude: lat, longitude: lng, unit: 'celsius' }
          })
          showToast(`Location set to ${city}`, 'success')
        }}
        onImportGames={(newGames) => {
          addGames(newGames, activeTab === 'media')
        }}
        games={[...games, ...mediaApps]}
      />

      <PowerMenuModal isOpen={isPowerModalOpen} onClose={() => setIsPowerModalOpen(false)} />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, message: null })}
      />

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
        confirmLabel={modalConfig.type === 'confirm' ? 'Delete' : 'OK'}
      />
    </MainLayout>
  )
}

export default App
