/**
 * @fileoverview Shared formatting and data utilities.
 * Centralizes common logic to avoid duplication across components.
 * @module renderer/utils/format
 */
import { Game } from '@/features/library/types'

/**
 * Formats a playtime duration in minutes to a human-readable string.
 * @param minutes - Total playtime in minutes
 * @returns Formatted string (e.g., "12h 30m", "45m", "0m")
 */
export const formatPlaytime = (minutes: number): string => {
  const safeMinutes = Math.max(0, Math.floor(minutes))
  const hours = Math.floor(safeMinutes / 60)
  const mins = safeMinutes % 60
  if (hours > 0) return `${hours}h ${mins}m`
  return `${mins}m`
}

/**
 * Extracts a sorted list of unique genres from a games array.
 * Handles comma-separated genre strings (e.g., "Action, RPG").
 * @param games - Array of games to extract genres from
 * @returns Sorted array of unique genre strings
 */
export const getUniqueGenres = (games: Game[]): string[] => {
  const genreSet = new Set<string>()
  for (const game of games) {
    if (!game.genre) continue
    const parts = game.genre.split(',')
    for (const part of parts) {
      const trimmed = part.trim()
      if (trimmed) genreSet.add(trimmed)
    }
  }
  return Array.from(genreSet).sort((a, b) => a.localeCompare(b))
}

/**
 * Aggregates playHistory from all games into a single date→minutes map.
 * Used by the activity calendar heatmap.
 * @param games - Array of games with optional playHistory
 * @returns Combined daily activity record { "YYYY-MM-DD": totalMinutes }
 */
export const aggregatePlayHistory = (games: Game[]): Record<string, number> => {
  const combined: Record<string, number> = {}
  for (const game of games) {
    if (!game.playHistory) continue
    for (const [date, minutes] of Object.entries(game.playHistory)) {
      combined[date] = (combined[date] || 0) + minutes
    }
  }
  return combined
}
