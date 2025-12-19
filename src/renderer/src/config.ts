import { Game } from '@/features/library/types'

// Default Assets
import gofBanner from '@/assets/games/gof-banner.jpg'
import gofCover from '@/assets/games/god-cover.jpg'
import spiderManBanner from '@/assets/games/spiderman-miles-morales.jpg'
import spiderManCover from '@/assets/games/spiderman-miles-morales-cover.jpg'
import defaultBanner from '@/assets/games/default-banner.jpg'
import bannerBg from '@/assets/banner-game.png'

import gamesConfig from './games.json' // Keep relative for JSON adjacent file
import { Game } from '@/features/library/types'

/**
 * Mapping of filename strings (from JSON) to actual Vite imported assets.
 */
export const localAssets: Record<string, string> = {
  'gof-banner.jpg': gofBanner,
  'god-cover.jpg': gofCover,
  'spiderman-miles-morales.jpg': spiderManBanner,
  'spiderman-miles-morales-cover.jpg': spiderManCover,
  'default-banner.jpg': defaultBanner
}

/**
 * The default banner image to use when a game has no background.
 */
export const DEFAULT_BANNER = defaultBanner

/**
 * Processes the raw JSON data and attaches local asset paths.
 * Returns the initial state for the application.
 */
export const getInitialGamesData = (): Game[] => {
  return gamesConfig.map((game) => ({
    ...game,
    bg_image: localAssets[game.bg_image] || game.bg_image || DEFAULT_BANNER,
    cover_image: localAssets[game.cover_image] || game.cover_image
  }))
}
