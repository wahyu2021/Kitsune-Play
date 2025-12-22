/**
 * @fileoverview Library state management hook.
 * @module renderer/features/library/hooks/useLibrary
 */

import { useState, useMemo } from 'react'
import { Game } from '@/features/library/types'
import { AppSettings } from '@/features/settings/types'
import { getInitialGamesData, DEFAULT_BANNER } from '@/config'
import { usePersistence } from '@/hooks/usePersistence'

export type SortOption = 'name' | 'lastPlayed' | 'playtime' | 'genre'

interface UseLibraryReturn {
  games: Game[]
  mediaApps: Game[]
  userName: string
  settings: AppSettings
  sortOption: SortOption
  showHidden: boolean
  setUserName: (name: string) => void
  setSettings: (settings: AppSettings) => void
  setSortOption: (opt: SortOption) => void
  setShowHidden: (show: boolean) => void
  addGame: (game: Game, isMedia: boolean) => void
  addGames: (games: Game[], isMedia: boolean) => void
  deleteGame: (id: string, isMedia: boolean) => void
  toggleFavorite: (id: string, isMedia: boolean) => void
  toggleHidden: (id: string, isMedia: boolean) => void
  updateGamePlaytime: (id: string, sessionMinutes: number) => void
  resetLibrary: () => void
  isLoaded: boolean
}

const createSignature = (title: string, path: string): string => {
  return `${title.trim().toLowerCase()}|${path.trim().toLowerCase()}`
}

/**
 * Sorts and filters games based on user preferences.
 * Favorites are always prioritized regardless of sort option.
 */
export const processGames = (list: Game[], sort: SortOption, showHidden: boolean): Game[] => {
  let processed = [...list]

  if (!showHidden) {
    processed = processed.filter((g) => !g.isHidden)
  }

  return processed.sort((a, b) => {
    if (a.isFavorite && !b.isFavorite) return -1
    if (!a.isFavorite && b.isFavorite) return 1

    switch (sort) {
      case 'lastPlayed':
        return new Date(b.lastPlayed || 0).getTime() - new Date(a.lastPlayed || 0).getTime()
      case 'playtime':
        return (b.playtime || 0) - (a.playtime || 0)
      case 'genre':
        return (a.genre || '').localeCompare(b.genre || '')
      case 'name':
      default:
        return a.title.localeCompare(b.title)
    }
  })
}

/** Manages game library state with persistence. */
export function useLibrary(): UseLibraryReturn {
  const [games, setGames] = useState<Game[]>([])
  const [mediaApps, setMediaApps] = useState<Game[]>([])
  const [userName, setUserName] = useState('')
  const [sortOption, setSortOption] = useState<SortOption>('name')
  const [showHidden, setShowHidden] = useState(false)
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

  const sortedGames = useMemo(
    () => processGames(games, sortOption, showHidden),
    [games, sortOption, showHidden]
  )
  const sortedMediaApps = useMemo(
    () => processGames(mediaApps, sortOption, showHidden),
    [mediaApps, sortOption, showHidden]
  )

  const addGame = (newGame: Game, isMedia: boolean): void => {
    const gameWithDefaults = {
      ...newGame,
      bg_image: newGame.bg_image || DEFAULT_BANNER
    }

    const updateList = (list: Game[]): Game[] => {
      const newSig = createSignature(gameWithDefaults.title, gameWithDefaults.path_to_exe)
      const isDuplicate = list.some((g) => createSignature(g.title, g.path_to_exe) === newSig)

      if (isDuplicate) {
        const idMatch = list.some((g) => g.id === gameWithDefaults.id)
        if (idMatch) {
          return list.map((g) => (g.id === gameWithDefaults.id ? gameWithDefaults : g))
        }
        console.warn('Skipping duplicate game add:', newGame.title)
        return list
      }

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
    const gamesWithDefaults = newGames.map((g) => ({
      ...g,
      bg_image: g.bg_image || DEFAULT_BANNER
    }))

    const updateList = (list: Game[]): Game[] => {
      const existingSignatures = new Set(list.map((g) => createSignature(g.title, g.path_to_exe)))

      const uniqueNewGames = gamesWithDefaults.filter((g) => {
        const signature = createSignature(g.title, g.path_to_exe)
        if (existingSignatures.has(signature)) return false

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

  const toggleFavorite = (id: string, isMedia: boolean): void => {
    const updater = (prev: Game[]): Game[] =>
      prev.map((g) => (g.id === id ? { ...g, isFavorite: !g.isFavorite } : g))

    if (!isMedia) {
      setGames(updater)
    } else {
      setMediaApps(updater)
    }
  }

  const toggleHidden = (id: string, isMedia: boolean): void => {
    const updater = (prev: Game[]): Game[] =>
      prev.map((g) => (g.id === id ? { ...g, isHidden: !g.isHidden } : g))

    if (!isMedia) {
      setGames(updater)
    } else {
      setMediaApps(updater)
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
    games: sortedGames,
    mediaApps: sortedMediaApps,
    userName,
    settings,
    sortOption,
    showHidden,
    setUserName,
    setSettings,
    setSortOption,
    setShowHidden,
    addGame,
    addGames,
    deleteGame,
    toggleFavorite,
    toggleHidden,
    updateGamePlaytime,
    resetLibrary,
    isLoaded
  }
}
