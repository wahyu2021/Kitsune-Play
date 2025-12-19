import { useState } from 'react'
import { Game } from '@/features/library/types'
import { AppSettings } from '@/features/settings/types'
import { getInitialGamesData, DEFAULT_BANNER } from '@/config'
import { usePersistence } from '@/hooks/usePersistence'

interface UseLibraryReturn {
  games: Game[]
  mediaApps: Game[]
  userName: string
  settings: AppSettings
  setUserName: (name: string) => void
  setSettings: (settings: AppSettings) => void
  addGame: (game: Game, isMedia: boolean) => void
  addGames: (games: Game[], isMedia: boolean) => void
  deleteGame: (id: string, isMedia: boolean) => void
  updateGamePlaytime: (id: string, sessionMinutes: number) => void
  resetLibrary: () => void
  isLoaded: boolean
}

/**
 * Custom hook to manage the application's data library.
 * Logic for persistence is delegated to usePersistence hook.
 */
export function useLibrary(): UseLibraryReturn {
  const [games, setGames] = useState<Game[]>([])
  const [mediaApps, setMediaApps] = useState<Game[]>([])
  const [userName, setUserName] = useState('')
  const [settings, setSettings] = useState<AppSettings>({
    rawgApiKey: '',
    bgMusicVolume: 0.3,
    sfxVolume: 0.8,
    isMuted: false,
    weather: {
      city: 'Jakarta',
      latitude: -6.2088,
      longitude: 106.8456,
      unit: 'celsius'
    }
  })

  const { isLoaded } = usePersistence({
    games,
    mediaApps,
    userName,
    settings,
    setGames,
    setMediaApps,
    setUserName,
    setSettings
  })

  // Actions
  // Helper for duplicate detection
  const createSignature = (title: string, path: string): string => {
    return `${title.trim().toLowerCase()}|${path.trim().toLowerCase()}`
  }

  const addGame = (newGame: Game, isMedia: boolean): void => {
    const gameWithDefaults = {
      ...newGame,
      bg_image: newGame.bg_image || DEFAULT_BANNER
    }

    const updateList = (list: Game[]): Game[] => {
      // Check for strict duplicate (same title AND same path)
      // Normalize to handle case sensitivity (Windows paths)
      const newSig = createSignature(gameWithDefaults.title, gameWithDefaults.path_to_exe)
      const isDuplicate = list.some(
        (g) => createSignature(g.title, g.path_to_exe) === newSig
      )

      if (isDuplicate) {
        // If ID matches, we update (edit mode).
        const idMatch = list.some(g => g.id === gameWithDefaults.id)
        if (idMatch) {
             return list.map((g) => (g.id === gameWithDefaults.id ? gameWithDefaults : g))
        }
        console.warn('Skipping duplicate game add:', newGame.title)
        return list
      }

      // Allow editing existing ID
      const existsId = list.some((g) => g.id === gameWithDefaults.id)
      if (existsId) {
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

  const addGames = (newGames: Game[], isMedia: boolean): void => {
    const gamesWithDefaults = newGames.map(g => ({
      ...g,
      bg_image: g.bg_image || DEFAULT_BANNER
    }))

    const updateList = (list: Game[]): Game[] => {
      // Filter out existing ones to avoid duplicates or overwrite? 
      // For bulk import, check if title+path already exists in the CURRENT list
      const existingSignatures = new Set(list.map(g => createSignature(g.title, g.path_to_exe)))
      
      const uniqueNewGames = gamesWithDefaults.filter(g => {
        const signature = createSignature(g.title, g.path_to_exe)
        if (existingSignatures.has(signature)) return false
        
        // Also ensure no duplicates within the IMPORT batch itself
        existingSignatures.add(signature) 
        return true
      })
      
      return [...list, ...uniqueNewGames]
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
    addGames,
    deleteGame,
    updateGamePlaytime,
    resetLibrary,
    isLoaded
  }
}
