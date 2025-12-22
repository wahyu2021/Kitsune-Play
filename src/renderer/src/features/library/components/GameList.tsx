/**
 * @fileoverview Horizontal scrollable game list component.
 * @module renderer/features/library/components/GameList
 */

import { useRef } from 'react'
import { Game } from '@/features/library/types'
import GameCard from './GameCard'
import { FaGhost } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

interface GameListProps {
  games: Game[]
  selectedGameId: string
  onSelectGame: (id: string) => void
}

/** Horizontal scrollable list displaying game cards. */
export default function GameList({
  games,
  selectedGameId,
  onSelectGame
}: GameListProps): React.JSX.Element {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)

  if (games.length === 0) {
    return (
      <div className="flex h-[29rem] w-full flex-col items-center justify-center gap-4 text-white/30">
        <FaGhost className="text-6xl" />
        <p className="text-xl font-medium">{t('library.empty_title')}</p>
        <p className="text-sm">{t('library.empty_desc')}</p>
      </div>
    )
  }

  return (
    <div className="h-[29rem] w-full">
      <div
        className="custom-scrollbar flex h-full w-full gap-8 overflow-x-auto overflow-y-hidden px-10 pt-4 pb-2 items-start"
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
