import { describe, it, expect } from 'vitest'
import { sortGames } from './useLibrary'
import { Game } from '@/features/library/types'

// Mock Data
const mockGames: Game[] = [
  { id: '1', title: 'Zelda', isFavorite: false } as Game,
  { id: '2', title: 'Mario', isFavorite: true } as Game,
  { id: '3', title: 'Apex', isFavorite: false } as Game,
  { id: '4', title: 'Halo', isFavorite: true } as Game
]

describe('useLibrary Logic', () => {
  it('sortGames should prioritize favorites then alphabetical', () => {
    const sorted = sortGames(mockGames)

    // Expected order:
    // 1. Halo (Fav, 'H' before 'M')
    // 2. Mario (Fav)
    // 3. Apex (Non-Fav, 'A')
    // 4. Zelda (Non-Fav, 'Z')

    expect(sorted[0].title).toBe('Halo')
    expect(sorted[1].title).toBe('Mario')
    expect(sorted[2].title).toBe('Apex')
    expect(sorted[3].title).toBe('Zelda')
  })

  it('sortGames should handle empty list', () => {
    expect(sortGames([])).toEqual([])
  })
})
