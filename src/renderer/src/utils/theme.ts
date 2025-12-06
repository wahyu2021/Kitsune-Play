/**
 * Determines the atmospheric lighting color based on the game's genre.
 *
 * @param genre - The genre string of the game (e.g., "Action, RPG")
 * @returns A Tailwind CSS gradient class string (e.g., "from-red-600/40")
 */
export const getGenreColor = (genre: string): string => {
  if (!genre) return 'from-gray-800/40'

  const g = genre.toLowerCase()

  if (g.includes('action')) return 'from-red-600/40'
  if (g.includes('rpg') || g.includes('role')) return 'from-blue-600/40'
  if (g.includes('adventure')) return 'from-emerald-600/40'
  if (g.includes('shooter') || g.includes('fps')) return 'from-orange-600/40'
  if (g.includes('horror')) return 'from-purple-600/40'

  // Media Specific Colors
  if (g.includes('video') || g.includes('movie')) return 'from-red-700/40'
  if (g.includes('music') || g.includes('audio')) return 'from-green-500/40'
  if (g.includes('stream') || g.includes('live')) return 'from-purple-700/40'

  return 'from-gray-800/40' // Default Fallback
}
