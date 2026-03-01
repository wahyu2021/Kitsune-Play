/**
 * @fileoverview Hook for random game picking logic.
 * @module renderer/features/library/hooks/useGamePicker
 */

import { useState, useCallback } from 'react'
import { Game } from '@/features/library/types'
import { getUniqueGenres } from '@/utils/format'

interface UseGamePickerReturn {
  /** List of unique genres from the provided games. */
  genres: string[]
  /** Currently selected genre filter ("" = all genres). */
  selectedGenre: string
  /** Update the genre filter. */
  setSelectedGenre: (genre: string) => void
  /** The randomly picked game, null before first spin. */
  pickedGame: Game | null
  /** Whether the spinner animation is active. */
  isSpinning: boolean
  /** Triggers random selection from the given games list. */
  spin: (games: Game[]) => void
  /** Resets the picker state. */
  reset: () => void
}

/**
 * Manages random game picker state and logic.
 * Filters by genre and simulates a brief spin animation before revealing the result.
 */
export function useGamePicker(): UseGamePickerReturn {
  const [selectedGenre, setSelectedGenre] = useState('')
  const [pickedGame, setPickedGame] = useState<Game | null>(null)
  const [isSpinning, setIsSpinning] = useState(false)
  const [cachedGenres, setCachedGenres] = useState<string[]>([])

  const updateGenres = useCallback((games: Game[]) => {
    setCachedGenres(getUniqueGenres(games))
  }, [])

  const spin = useCallback(
    (games: Game[]) => {
      updateGenres(games)

      const pool = selectedGenre
        ? games.filter((g) => g.genre?.toLowerCase().includes(selectedGenre.toLowerCase()))
        : games

      if (pool.length === 0) {
        setPickedGame(null)
        return
      }

      setIsSpinning(true)
      setPickedGame(null)

      // Simulate spin delay for animation
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * pool.length)
        setPickedGame(pool[randomIndex])
        setIsSpinning(false)
      }, 1200)
    },
    [selectedGenre, updateGenres]
  )

  const reset = useCallback(() => {
    setPickedGame(null)
    setSelectedGenre('')
    setIsSpinning(false)
  }, [])

  return {
    genres: cachedGenres,
    selectedGenre,
    setSelectedGenre,
    pickedGame,
    isSpinning,
    spin,
    reset
  }
}
