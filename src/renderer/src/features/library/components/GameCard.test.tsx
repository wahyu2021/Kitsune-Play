import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import GameCard from './GameCard'
import { InputProvider } from '@/context/InputContext'
import { Game } from '@/features/library/types'

// Mock the Game object
const mockGame: Game = {
  id: '123',
  title: 'Cyberpunk 2077',
  description: 'Future rpg',
  genre: 'RPG',
  path_to_exe: 'C:/game.exe',
  cover_image: 'cover.jpg',
  bg_image: 'bg.jpg',
  isFavorite: true
}

describe('GameCard Component', () => {
  it('renders the game cover image', () => {
    render(
      <InputProvider>
        <GameCard game={mockGame} isActive={false} onClick={vi.fn()} />
      </InputProvider>
    )

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'cover.jpg')
    expect(img).toHaveAttribute('alt', 'Cyberpunk 2077')
  })

  it('shows the star icon if game is favorite', () => {
    // Note: react-icons often render as <svg>, so we look for that or by title if we added one.
    // I didn't add a title to the star in GameCard, so checking for svg presence in the corner wrapper is best.
    const { container } = render(
      <InputProvider>
        <GameCard game={mockGame} isActive={false} onClick={vi.fn()} />
      </InputProvider>
    )

    // The star is rendered when isFavorite is true
    // We can query by the wrapper class we added: "absolute top-2 right-2"
    const starWrapper = container.querySelector('.absolute.top-2.right-2')
    expect(starWrapper).toBeInTheDocument()
  })

  it('does NOT show star icon if game is NOT favorite', () => {
    const nonFavGame = { ...mockGame, isFavorite: false }
    const { container } = render(
      <InputProvider>
        <GameCard game={nonFavGame} isActive={false} onClick={vi.fn()} />
      </InputProvider>
    )

    const starWrapper = container.querySelector('.absolute.top-2.right-2')
    expect(starWrapper).toBeNull()
  })
})
