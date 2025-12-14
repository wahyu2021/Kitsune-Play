import { useState, useEffect, useRef } from 'react'
import { Game, AppSettings } from '../types'
import { getInitialGamesData, DEFAULT_BANNER } from '../config'
import { logger } from '../utils/logger'

interface AppData {
  games: Game[]
  mediaApps: Game[]
  userName: string
  settings: AppSettings
}

interface UseLibraryReturn {
  games: Game[]
  mediaApps: Game[]
  userName: string
  settings: AppSettings
  setUserName: (name: string) => void
  setSettings: (settings: AppSettings) => void
  addGame: (game: Game, isMedia: boolean) => void
  deleteGame: (id: string, isMedia: boolean) => void
  updateGamePlaytime: (id: string, sessionMinutes: number) => void
  resetLibrary: () => void
  isLoaded: boolean
}

/**
 * Custom hook to manage the application's data library.
 * Handles persistence (loading/saving to disk) automatically.
 */
export function useLibrary(): UseLibraryReturn {
  const [games, setGames] = useState<Game[]>([]) 
  const [mediaApps, setMediaApps] = useState<Game[]>([])
  const [userName, setUserName] = useState('') // Start empty to avoid overwriting
  const [settings, setSettings] = useState<AppSettings>({ rawgApiKey: '', bgMusicVolume: 0.3, sfxVolume: 0.8, isMuted: false })
  
  const isLoaded = useRef(false)
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false)

  /**
   * Initialize data from persistent storage or fall back to defaults.
   */
  useEffect(() => {
    const initData = async (): Promise<void> => {
      const initialDefaults = getInitialGamesData()

      // Safety check: If running in a regular browser (not Electron), window.api is undefined
      if (!window.api) {
        logger.warn('System', 'Electron API not found. Running in browser mode with mock data.')
        setGames(initialDefaults)
        setUserName('Player 1') // Mock default
        isLoaded.current = true
        setHasLoadedInitial(true)
        return
      }

      const savedData = await window.api.loadData()

      if (savedData) {
        try {
          const parsed: AppData = JSON.parse(savedData)
          setGames(parsed.games || [])
          setMediaApps(parsed.mediaApps || [])
          
          // Only use 'Player 1' if the saved name is truly falsy/empty
          const loadedName = parsed.userName
          logger.info('System', `Loaded Name from file: "${loadedName}"`)
          setUserName(loadedName || 'Player 1')
          
          // Merge loaded settings with defaults safely
          const defaultSettings: AppSettings = { 
            rawgApiKey: '', 
            bgMusicVolume: 0.3, 
            sfxVolume: 0.8, 
            isMuted: false 
          }
          
          setSettings({ 
            ...defaultSettings, 
            ...(parsed.settings || {}) 
          })
        } catch (e) {
          logger.error('System', 'Failed to parse saved data, using defaults', e)
          setGames(initialDefaults)
          setUserName('Player 1')
        }
      } else {
        // First run
        setGames(initialDefaults)
        setUserName('Player 1')
      }
      isLoaded.current = true
      setHasLoadedInitial(true)
    }
    initData()
  }, [])

  /**
   * Persist data changes to disk with a debounce to prevent excessive writes.
   */
  useEffect(() => {
    // CRITICAL: Use the REF isLoaded to prevent saving before loading is done.
    if (!isLoaded.current) return

    const saveData = async (): Promise<void> => {
      // Safety check for browser mode
      if (!window.api) return

      // logger.debug('System', `Saving Library... User: "${userName}"`)

      const dataToSave: AppData = {
        games,
        mediaApps,
        userName: userName || 'Player 1', // Ensure we never save empty string
        settings
      }
      await window.api.saveData(JSON.stringify(dataToSave))
    }

    const timeout = setTimeout(saveData, 1000)
    return () => clearTimeout(timeout)
  }, [games, mediaApps, userName, settings])

  // Actions
  const addGame = (newGame: Game, isMedia: boolean): void => {
    const gameWithDefaults = {
      ...newGame,
      bg_image: newGame.bg_image || DEFAULT_BANNER
    }

    const updateList = (list: Game[]): Game[] => {
      const exists = list.some((g) => g.id === gameWithDefaults.id)
      if (exists) {
        return list.map((g) => (g.id === gameWithDefaults.id ? gameWithDefaults : g))
      }
      return [...list, gameWithDefaults]
    }

    if (!isMedia) {
      setGames((prev) => updateList(prev))
    } else {
      setMediaApps((prev) => updateList(prev))
    }
  }

  const deleteGame = (id: string, isMedia: boolean): void => {
    if (!isMedia) {
      setGames((prev) => prev.filter((g) => g.id !== id))
    } else {
      setMediaApps((prev) => prev.filter((g) => g.id !== id))
    }
  }

  const resetLibrary = (): void => {
    const defaults = getInitialGamesData()
    setGames(defaults)
    setMediaApps([])
    setUserName('Player 1')
  }

  const updateGamePlaytime = (id: string, sessionMinutes: number): void => {
    setGames((prev) =>
      prev.map((game) => {
        if (game.id === id) {
          return {
            ...game,
            playtime: (game.playtime || 0) + (sessionMinutes > 0 ? sessionMinutes : 0),
            lastPlayed: new Date().toISOString()
          }
        }
        return game
      })
    )
  }

  return {
    games,
    mediaApps,
    userName,
    settings,
    setUserName,
    setSettings,
    addGame,
    deleteGame,
    updateGamePlaytime,
    resetLibrary,
    isLoaded: hasLoadedInitial
  }
}
