import { describe, it, expect } from 'vitest'
import { processGames } from './useLibrary'
import { Game } from '@/features/library/types'

// Mock Data
const mockGames: Game[] = [
  { id: '1', title: 'Zelda', isFavorite: false } as Game,
  { id: '2', title: 'Mario', isFavorite: true } as Game,
  { id: '3', title: 'Apex', isFavorite: false } as Game,
  { id: '4', title: 'Halo', isFavorite: true } as Game
]

describe('useLibrary Logic', () => {
  it('processGames should prioritize favorites then alphabetical by default', () => {
    // Sort by name, show hidden doesn't matter here
    const sorted = processGames(mockGames, 'name', true)

    // Expected order:
    // 1. Apex (Fav logic? Wait, logic is: Favs first. Among Favs, sort by X. Among Non-Favs, sort by X)
    // Halo (Fav) -> H
    // Mario (Fav) -> M
    // Apex (Non-Fav) -> A
    // Zelda (Non-Fav) -> Z
    
    // Halo comes before Mario (H < M)
    // Apex comes before Zelda (A < Z)

    expect(sorted[0].title).toBe('Halo')
    expect(sorted[1].title).toBe('Mario')
    expect(sorted[2].title).toBe('Apex')
    expect(sorted[3].title).toBe('Zelda')
  })

  it('processGames should handle empty list', () => {
    expect(processGames([], 'name', true)).toEqual([])
  })
})
