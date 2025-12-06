import { logger } from '../utils/logger'

const RAWG_BASE_URL = 'https://api.rawg.io/api'

export interface GameMetadata {
  description: string
  genre: string
  cover_image: string
  bg_image: string
  release_date: string
}

// --- RAWG API Response Interfaces ---

interface RawgGenre {
  id: number
  name: string
  slug: string
}

interface RawgGameResult {
  id: number
  name: string
  background_image: string | null
}

interface RawgSearchResponse {
  count: number
  results: RawgGameResult[]
}

interface RawgGameDetail {
  id: number
  name: string
  description: string
  description_raw: string
  released: string
  background_image: string | null
  background_image_additional: string | null
  genres: RawgGenre[]
}

/**
 * Fetches game metadata from RAWG.io
 * @param title The game title to search for
 * @param apiKey The user's RAWG API Key
 */
export const fetchGameMetadata = async (
  title: string,
  apiKey: string
): Promise<GameMetadata | null> => {
  if (!apiKey) {
    logger.warn('System', 'Fetch skipped: No API Key provided')
    return null
  }

  try {
    logger.info('System', `Fetching metadata for: ${title}`)

    // 1. Search for the game
    const searchUrl = `${RAWG_BASE_URL}/games?key=${apiKey}&search=${encodeURIComponent(title)}&page_size=1`
    const searchRes = await fetch(searchUrl)

    if (!searchRes.ok) {
      throw new Error(`RAWG Search API Error: ${searchRes.status} ${searchRes.statusText}`)
    }

    const searchData: RawgSearchResponse = await searchRes.json()

    if (!searchData.results || searchData.results.length === 0) {
      logger.warn('System', 'No results found on RAWG')
      return null
    }

    const gameSummary = searchData.results[0]
    const gameId = gameSummary.id

    // 2. Get detailed info
    const detailUrl = `${RAWG_BASE_URL}/games/${gameId}?key=${apiKey}`
    const detailRes = await fetch(detailUrl)

    if (!detailRes.ok) {
      throw new Error(`RAWG Detail API Error: ${detailRes.status} ${detailRes.statusText}`)
    }

    const detailData: RawgGameDetail = await detailRes.json()

    return {
      description: detailData.description_raw || detailData.description || '',
      genre: detailData.genres?.map((g) => g.name).join(', ') || 'Unknown',
      cover_image: detailData.background_image || '', // RAWG uses bg as cover often
      bg_image: detailData.background_image_additional || detailData.background_image || '',
      release_date: detailData.released || ''
    }
  } catch (error) {
    logger.error('System', 'Error fetching from RAWG', error)
    return null
  }
}
