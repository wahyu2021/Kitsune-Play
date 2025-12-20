/**
 * @fileoverview Theme utilities for genre-based styling.
 * @module renderer/utils/theme
 */

/**
 * Returns a Tailwind CSS gradient class based on game genre.
 * @param genre - Game genre string (e.g., "Action, RPG")
 * @returns Tailwind gradient class
 */
export const getGenreColor = (genre: string): string => {
  if (!genre) return 'from-gray-800/40'

  const g = genre.toLowerCase()

  if (g.includes('action')) return 'from-red-600/40'
  if (g.includes('rpg') || g.includes('role')) return 'from-blue-600/40'
  if (g.includes('adventure')) return 'from-emerald-600/40'
  if (g.includes('shooter') || g.includes('fps')) return 'from-orange-600/40'
  if (g.includes('horror')) return 'from-purple-600/40'

  if (g.includes('video') || g.includes('movie')) return 'from-red-700/40'
  if (g.includes('music') || g.includes('audio')) return 'from-green-500/40'
  if (g.includes('stream') || g.includes('live')) return 'from-purple-700/40'

  return 'from-gray-800/40'
}
