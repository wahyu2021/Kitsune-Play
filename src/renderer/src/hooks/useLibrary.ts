import { useState, useEffect, useRef } from 'react'
import { Game } from '../types'
import { getInitialGamesData, DEFAULT_BANNER } from '../config'

interface AppData {
  games: Game[]
  mediaApps: Game[]
  userName: string
}

interface UseLibraryReturn {
  games: Game[]
  mediaApps: Game[]
  userName: string
  setUserName: (name: string) => void
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
  const [games, setGames] = useState<Game[]>([]) // Start empty, wait for load
  const [mediaApps, setMediaApps] = useState<Game[]>([])
  const [userName, setUserName] = useState('Player 1')
  const isLoaded = useRef(false)
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false)

  // 1. Load Data on Mount
  useEffect(() => {
    const initData = async (): Promise<void> => {
      const savedData = await window.api.loadData()
      const initialDefaults = getInitialGamesData()

      if (savedData) {
        try {
          const parsed: AppData = JSON.parse(savedData)
          setGames(parsed.games)
          setMediaApps(parsed.mediaApps)
          setUserName(parsed.userName)
        } catch (e) {
          console.error("Failed to parse saved data, using defaults", e)
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

  // 2. Save Data on Change (Debounced)
  useEffect(() => {
    if (!isLoaded.current) return

    const saveData = async (): Promise<void> => {
      const dataToSave: AppData = {
        games,
        mediaApps,
        userName
      }
      await window.api.saveData(JSON.stringify(dataToSave))
    }
    
    const timeout = setTimeout(saveData, 1000)
    return () => clearTimeout(timeout)
  }, [games, mediaApps, userName])

  // Actions
  const addGame = (newGame: Game, isMedia: boolean): void => {
    const gameWithDefaults = {
      ...newGame,
      bg_image: newGame.bg_image || DEFAULT_BANNER,
    }

    // Helper to add or update
    const updateList = (list: Game[]): Game[] => {
        const exists = list.some(g => g.id === gameWithDefaults.id)
        if (exists) {
            return list.map(g => g.id === gameWithDefaults.id ? gameWithDefaults : g)
        }
        return [...list, gameWithDefaults]
    }

    if (!isMedia) {
        setGames(prev => updateList(prev))
    } else {
        setMediaApps(prev => updateList(prev))
    }
  }

  const deleteGame = (id: string, isMedia: boolean): void => {
    if (!isMedia) {
        setGames(prev => prev.filter(g => g.id !== id))
    } else {
        setMediaApps(prev => prev.filter(g => g.id !== id))
    }
  }

  const resetLibrary = (): void => {
    const defaults = getInitialGamesData()
    setGames(defaults)
    setMediaApps([])
    setUserName('Player 1')
  }

  return {
    games,
    mediaApps,
    userName,
    setUserName,
    addGame,
    deleteGame,
    resetLibrary,
    isLoaded: hasLoadedInitial
  }
}
