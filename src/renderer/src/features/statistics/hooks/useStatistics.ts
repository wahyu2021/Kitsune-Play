/**
 * @fileoverview Statistics computation hook.
 * Derives all dashboard metrics from the games array using shared utilities.
 * @module renderer/features/statistics/hooks/useStatistics
 */

import { useMemo } from 'react'
import { Game } from '@/features/library/types'
import { formatPlaytime, getUniqueGenres, aggregatePlayHistory } from '@/utils/format'

export interface GenreDistribution {
  genre: string
  count: number
  percentage: number
}

export interface GameStats {
  totalGames: number
  totalPlaytime: number
  totalPlaytimeFormatted: string
  averageSessionFormatted: string
  mostPlayedGame: Game | null
  lastPlayedGame: Game | null
  genreDistribution: GenreDistribution[]
  topGames: Game[]
  favoriteCount: number
  unplayedCount: number
  dailyActivity: Record<string, number>
  genres: string[]
}

/**
 * Computes all statistics from the games array.
 * Uses shared utilities for formatting and data aggregation — no duplicated logic.
 */
export function useStatistics(games: Game[]): GameStats {
  return useMemo(() => {
    const totalGames = games.length
    const totalPlaytime = games.reduce((sum, g) => sum + (g.playtime || 0), 0)
    const playedGames = games.filter((g) => (g.playtime || 0) > 0)
    const averageMinutes = playedGames.length > 0 ? totalPlaytime / playedGames.length : 0

    // Most played (by playtime)
    const mostPlayedGame =
      playedGames.length > 0
        ? playedGames.reduce((best, g) => ((g.playtime || 0) > (best.playtime || 0) ? g : best))
        : null

    // Last played (by date)
    const gamesWithLastPlayed = games.filter((g) => g.lastPlayed)
    const lastPlayedGame =
      gamesWithLastPlayed.length > 0
        ? gamesWithLastPlayed.reduce((latest, g) =>
            new Date(g.lastPlayed!) > new Date(latest.lastPlayed!) ? g : latest
          )
        : null

    // Genre distribution
    const genres = getUniqueGenres(games)
    const genreCounts = new Map<string, number>()
    for (const game of games) {
      if (!game.genre) continue
      for (const part of game.genre.split(',')) {
        const trimmed = part.trim()
        if (trimmed) genreCounts.set(trimmed, (genreCounts.get(trimmed) || 0) + 1)
      }
    }
    const genreDistribution: GenreDistribution[] = Array.from(genreCounts.entries())
      .map(([genre, count]) => ({
        genre,
        count,
        percentage: totalGames > 0 ? (count / totalGames) * 100 : 0
      }))
      .sort((a, b) => b.count - a.count)

    // Top 5 by playtime
    const topGames = [...playedGames]
      .sort((a, b) => (b.playtime || 0) - (a.playtime || 0))
      .slice(0, 5)

    return {
      totalGames,
      totalPlaytime,
      totalPlaytimeFormatted: formatPlaytime(totalPlaytime),
      averageSessionFormatted: formatPlaytime(Math.round(averageMinutes)),
      mostPlayedGame,
      lastPlayedGame,
      genreDistribution,
      topGames,
      favoriteCount: games.filter((g) => g.isFavorite).length,
      unplayedCount: games.filter((g) => !g.playtime || g.playtime === 0).length,
      dailyActivity: aggregatePlayHistory(games),
      genres
    }
  }, [games])
}
