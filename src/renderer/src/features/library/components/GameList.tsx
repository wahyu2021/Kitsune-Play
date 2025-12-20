import { useRef } from 'react'
import { Game } from '@/features/library/types'
import GameCard from './GameCard'
import { FaGhost } from 'react-icons/fa'

interface GameListProps {
  /** Array of games to display. */
  games: Game[]
  /** ID of the currently selected game. */
  selectedGameId: string
  /** Callback triggered when a game is clicked. */
  onSelectGame: (id: string) => void
}

/**
 * Horizontal scrollable list of games.
 * Handles empty state and renders `GameCard` components.
 */
export default function GameList({
  games,
  selectedGameId,
  onSelectGame
}: GameListProps): React.JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null)

  if (games.length === 0) {
    return (
      <div className="flex h-64 w-full flex-col items-center justify-center gap-4 text-white/30">
        <FaGhost className="text-6xl" />
        <p className="text-xl font-medium">Library is empty</p>
        <p className="text-sm">Click the + button to add content</p>
      </div>
    )
  }

  return (
    <div>
      <div
        className="custom-scrollbar flex gap-8 overflow-x-auto px-10 pt-10 pb-6"
        ref={containerRef}
      >
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isActive={game.id === selectedGameId}
            onClick={() => onSelectGame(game.id)}
          />
        ))}
      </div>
    </div>
  )
}
