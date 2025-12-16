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
    isMuted: false
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
    isLoaded
  }
}
