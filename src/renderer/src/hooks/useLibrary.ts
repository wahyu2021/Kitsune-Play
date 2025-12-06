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
  const [userName, setUserName] = useState('Player 1')
  const [settings, setSettings] = useState<AppSettings>({ rawgApiKey: '', volume: 0.5, isMuted: false })
  
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
          setUserName(parsed.userName || 'Player 1')
          setSettings({ 
            rawgApiKey: '', 
            volume: 0.5, 
            isMuted: false, 
            ...parsed.settings 
          })
        } catch (e) {
          logger.error('System', 'Failed to parse saved data, using defaults', e)
          setGames(initialDefaults)
        }
      } else {
        // First run: Use defaults from config
        setGames(initialDefaults)
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
    // CRITICAL: Do not save until initial load is complete to prevent overwriting with defaults
    if (!hasLoadedInitial) {
      return
    }

    const saveData = async (): Promise<void> => {
      // Safety check for browser mode
      if (!window.api) return

      const dataToSave: AppData = {
        games,
        mediaApps,
        userName,
        settings
      }
      await window.api.saveData(JSON.stringify(dataToSave))
    }

    const timeout = setTimeout(saveData, 1000)
    return () => clearTimeout(timeout)
  }, [games, mediaApps, userName, settings, hasLoadedInitial])

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
    if (sessionMinutes <= 0) return

    setGames(prev => prev.map(game => {
        if (game.id === id) {
            return {
                ...game,
                playtime: (game.playtime || 0) + sessionMinutes,
                lastPlayed: new Date().toISOString()
            }
        }
        return game
    }))
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
