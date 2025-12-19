import { motion, AnimatePresence } from 'framer-motion'
import {
  FaTimes,
  FaTrashRestore,
  FaInfoCircle,
  FaKey,
  FaExternalLinkAlt,
  FaSave,
  FaVolumeUp,
  FaVolumeMute,
  FaCloudSun,
  FaMapMarkerAlt,
  FaSteam
} from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { getCoordinates } from '@/services/weather'
import { Game } from '@/features/library/types'
import { fetchGameMetadata } from '@/services/rawg'
import { Modal, ModalType } from '@/components/ui'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onResetLibrary: () => void
  apiKey: string
  onSaveApiKey: (key: string) => void
  bgMusicVolume: number
  sfxVolume: number
  isMuted: boolean
  onBgMusicVolumeChange: (vol: number) => void
  onSfxVolumeChange: (vol: number) => void
  onMuteToggle: (muted: boolean) => void
  weatherCity: string
  onSaveWeatherCity: (city: string, lat: number, lng: number) => void
  onImportGames: (games: Game[]) => void
  games: Game[] // Current library to check duplicates
}

export default function SettingsModal({
  isOpen,
  onClose,
  onResetLibrary,
  apiKey,
  onSaveApiKey,
  bgMusicVolume,
  sfxVolume,
  isMuted,
  onBgMusicVolumeChange,
  onSfxVolumeChange,
  onMuteToggle,
  weatherCity,
  onSaveWeatherCity,
  onImportGames,
  games
}: SettingsModalProps): React.JSX.Element {
  const [version, setVersion] = useState<string>('')
  const [localKey, setLocalKey] = useState(apiKey)
  const [localCity, setLocalCity] = useState(weatherCity)
  const [isLocating, setIsLocating] = useState(false)
  const [cityError, setCityError] = useState<string | null>(null)
  
  // Import State
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState('')

  // Custom Modal State
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: ModalType
    onConfirm?: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  })

  const showAlert = (title: string, message: string, type: ModalType = 'info') => {
    setModalConfig({ isOpen: true, title, message, type })
  }

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({ isOpen: true, title, message, type: 'confirm', onConfirm })
  }

  // Sync local state with prop only when modal opens
  useEffect(() => {
    if (isOpen) {
      if (window.api) {
        window.api.getAppVersion().then(setVersion)
      } else {
        setVersion('1.0.0 (Dev)')
      }
      setLocalKey(apiKey)
      setLocalCity(weatherCity)
    }
  }, [isOpen, apiKey, weatherCity])

  const handleSaveCity = async (): Promise<void> => {
    if (!localCity.trim()) return

    setIsLocating(true)
    setCityError(null)
    try {
      const coords = await getCoordinates(localCity)
      if (coords) {
        onSaveWeatherCity(coords.name, coords.lat, coords.lng)
        setLocalCity(coords.name) // Update with formatted name
      } else {
        setCityError('City not found. Try a different name.')
      }
    } catch (error) {
      setCityError('Error connecting to weather service.')
    } finally {
      setIsLocating(false)
    }
  }

  const handleImportSteam = async (): Promise<void> => {
    if (!window.api) return
    setIsImporting(true)
    setImportStatus('Selecting Steam folder...')

    try {
      const steamPath = await window.api.selectFolder()
      if (!steamPath) {
        setIsImporting(false)
        setImportStatus('')
        return
      }

      setImportStatus('Scanning library...')
      const foundGames = await window.api.scanSteamLibrary(steamPath)
      
      if (foundGames.length === 0) {
        showAlert('No Games Found', 'No Steam games found in the selected folder.\nEnsure you selected the root Steam folder (e.g., C:/Program Files/Steam).', 'warning')
        setIsImporting(false)
        setImportStatus('')
        return
      }

      setImportStatus(`Found ${foundGames.length} games. Filtering duplicates...`)

      // Helper for duplicate detection
      const createSignature = (title: string, path: string): string =>
        `${title.trim().toLowerCase()}|${path.trim().toLowerCase()}`

      const existingSignatures = new Set(games.map((g) => createSignature(g.title, g.path_to_exe)))

      // Filter out duplicates BEFORE processing
      const uniqueSteamGames = foundGames.filter((sg) => {
        const exePath = sg.executablePath || `steam://rungameid/${sg.appId}`
        const sig = createSignature(sg.name, exePath)
        return !existingSignatures.has(sig)
      })

      const duplicateCount = foundGames.length - uniqueSteamGames.length

      if (uniqueSteamGames.length === 0) {
        showAlert('Import Complete', `Found ${foundGames.length} games, but they are all already in your library.\n\nSkipped ${duplicateCount} duplicates.`, 'info')
        setIsImporting(false)
        setImportStatus('')
        return
      }

      setImportStatus(`Found ${uniqueSteamGames.length} new games (${duplicateCount} skipped). Fetching metadata...`)
      
      const newGames: Game[] = []
      
      // Process in batches to avoid rate limits
      const BATCH_SIZE = 3
      for (let i = 0; i < uniqueSteamGames.length; i += BATCH_SIZE) {
        const batch = uniqueSteamGames.slice(i, i + BATCH_SIZE)
        setImportStatus(`Importing ${i + 1} / ${uniqueSteamGames.length} (Skipped ${duplicateCount} dupe)...`)

        await Promise.all(batch.map(async (steamGame) => {
          // Debugging: Check if appId exists
          if (!steamGame.appId) {
             console.warn('Skipping game with missing AppID:', steamGame.name)
             return
          }

          let metadata = null
          if (localKey) {
            metadata = await fetchGameMetadata(steamGame.name, localKey)
          }

          newGames.push({
            id: crypto.randomUUID(),
            title: steamGame.name,
            // Use the found executable path if available (fixes user issue), otherwise fallback to Steam Protocol
            path_to_exe: steamGame.executablePath || `steam://rungameid/${steamGame.appId}`,
            // Extract filename for process tracking
            executableName: steamGame.executablePath
              ? steamGame.executablePath.split(/[\\/]/).pop() || ''
              : '',
            cover_image: metadata?.cover_image || '',
            bg_image: metadata?.bg_image || '',
            description: metadata?.description || 'Imported from Steam',
            genre: metadata?.genre || 'Game',
            playtime: 0,
            lastPlayed: '',
            launchArgs: ''
          })
        }))
        
        // Small delay between batches
        await new Promise(r => setTimeout(r, 500))
      }

      onImportGames(newGames)
      showAlert(
        'Import Successful',
        `Imported ${newGames.length} new games!\n\n${duplicateCount} duplicates were skipped.`,
        'success'
      )
      onClose()

    } catch (error: any) {
      console.error(error)
      showAlert('Import Failed', `${error.message || 'Unknown error'}. Try restarting the app.`, 'error')
    } finally {
      setIsImporting(false)
      setImportStatus('')
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Settings</h2>
                <button onClick={onClose} className="text-white/50 hover:text-white">
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {/* Audio Settings */}
                <div>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-400">
                    Audio
                  </h3>
                  <div className="rounded-lg bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <label className="flex items-center gap-2 text-sm font-bold text-white">
                        {isMuted ? <FaVolumeMute className="text-red-400" /> : <FaVolumeUp />}
                        Sound Controls
                      </label>
                      <button
                        onClick={() => onMuteToggle(!isMuted)}
                        className={`text-xs font-bold px-2 py-1 rounded ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                      >
                        {isMuted ? 'MUTED' : 'MUTE ALL'}
                      </button>
                    </div>

                    {/* Music Slider */}
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span>Music</span>
                        <span>{Math.round(bgMusicVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={bgMusicVolume}
                        onChange={(e) => onBgMusicVolumeChange(parseFloat(e.target.value))}
                        disabled={isMuted}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
                      />
                    </div>

                    {/* SFX Slider */}
                    <div>
                      <div className="flex justify-between text-xs text-white/60 mb-1">
                        <span>SFX (Navigation)</span>
                        <span>{Math.round(sfxVolume * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={sfxVolume}
                        onChange={(e) => onSfxVolumeChange(parseFloat(e.target.value))}
                        disabled={isMuted}
                        className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Import Games */}
                <div>
                   <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-green-400">
                    Library Import
                  </h3>
                  <div className="rounded-lg bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 text-sm font-bold text-white">
                        <FaSteam className="text-white/60" /> Steam Import
                      </label>
                    </div>
                    <button
                      onClick={handleImportSteam}
                      disabled={isImporting}
                      className="flex w-full items-center justify-center gap-2 rounded bg-white/10 py-2 text-sm font-bold text-white hover:bg-green-600 transition-colors disabled:opacity-50"
                    >
                      {isImporting ? <span className="animate-spin">⟳</span> : <FaSteam />}
                      {isImporting ? 'Scanning...' : 'Scan Steam Library'}
                    </button>
                    {importStatus && (
                      <p className="mt-2 text-xs text-green-400 text-center animate-pulse">{importStatus}</p>
                    )}
                    <p className="mt-2 text-xs text-white/40">
                      Select your main Steam folder (e.g. C:/Program Files/Steam). Metadata will be fetched via RAWG.
                    </p>
                  </div>
                </div>

                {/* Weather Settings */}
                <div>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-cyan-400">
                    Weather Widget
                  </h3>
                  <div className="rounded-lg bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-white">
                        <FaCloudSun className="text-white/60" /> Location
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={localCity}
                        onChange={(e) => setLocalCity(e.target.value)}
                        placeholder="Enter city (e.g. Tokyo)"
                        className="flex-1 rounded bg-black/20 px-3 py-2 text-sm text-white border border-white/10 focus:border-cyan-500 focus:outline-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveCity()
                        }}
                      />
                      <button
                        onClick={handleSaveCity}
                        disabled={isLocating}
                        className="flex items-center gap-2 rounded bg-white/10 px-4 text-sm font-bold text-white hover:bg-cyan-500 hover:text-white transition-colors disabled:opacity-50"
                      >
                        {isLocating ? <span className="animate-spin">⟳</span> : <FaMapMarkerAlt />}
                        Set
                      </button>
                    </div>
                    {cityError && <p className="mt-2 text-xs text-red-400">{cityError}</p>}
                    <p className="mt-2 text-xs text-white/40">
                      Shows weather info in the Top Bar.
                    </p>
                  </div>
                </div>

                {/* API Integration */}
                <div>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-orange-400">
                    Metadata Provider
                  </h3>
                  <div className="rounded-lg bg-white/5 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="flex items-center gap-2 text-sm font-bold text-white">
                        <FaKey className="text-white/60" /> RAWG API Key
                      </label>
                      <a
                        href="https://rawg.io/apidocs"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-blue-400 hover:underline"
                      >
                        Get Key <FaExternalLinkAlt />
                      </a>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={localKey}
                        onChange={(e) => setLocalKey(e.target.value)}
                        placeholder="Paste your API key here..."
                        className="flex-1 rounded bg-black/20 px-3 py-2 text-sm text-white border border-white/10 focus:border-orange-500 focus:outline-none"
                      />
                      <button
                        onClick={() => onSaveApiKey(localKey)}
                        className="flex items-center gap-2 rounded bg-white/10 px-4 text-sm font-bold text-white hover:bg-orange-500 hover:text-white transition-colors"
                      >
                        <FaSave /> Save
                      </button>
                    </div>
                    <p className="mt-2 text-xs text-white/40">
                      Used to auto-fetch game covers and descriptions.
                    </p>
                  </div>
                </div>

                {/* App Info */}
                <div className="rounded-lg bg-white/5 p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <FaInfoCircle className="text-blue-400" />
                    <h3 className="font-bold text-white">Kitsune Play v{version}</h3>
                  </div>
                  <p className="text-sm text-white/60">
                    A modern PS5-style game launcher built with Electron, React, and Tailwind CSS.
                  </p>
                </div>

                {/* Danger Zone */}
                <div>
                  <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-red-400">
                    Danger Zone
                  </h3>
                  <button
                    onClick={() => {
                      showConfirm(
                        'Reset Library',
                        'Are you sure you want to reset your library?\n\nThis will remove all games and settings. This action cannot be undone.',
                        () => {
                           onResetLibrary()
                           onClose()
                        }
                      )
                    }}
                    className="flex w-full items-center justify-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 py-3 text-red-400 transition-colors hover:bg-red-500 hover:text-white"
                  >
                    <FaTrashRestore /> Reset Library to Defaults
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
        confirmLabel={modalConfig.type === 'confirm' ? 'Yes, I am sure' : 'OK'}
      />
    </>
  )
}
