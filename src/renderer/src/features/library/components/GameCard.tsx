/**
 * @fileoverview Game card component for library display.
 * @module renderer/features/library/components/GameCard
 */

import { motion } from 'framer-motion'
import { Game } from '@/features/library/types'
import { useRef, useEffect, memo } from 'react'
import LazyImage from '@/components/ui/LazyImage'
import { useInput } from '@/context/useInput'
import { FaStar, FaEyeSlash } from 'react-icons/fa'

interface GameCardProps {
  game: Game
  isActive: boolean
  onSelect: (id: string) => void
}

/** Interactive game card with cover image and selection state. */
const GameCard = memo(function GameCard({
  game,
  isActive,
  onSelect
}: GameCardProps): React.JSX.Element {
  const { isFocusVisible } = useInput()
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      })
    }
  }, [isActive])

  const showFocusRing = isActive && isFocusVisible

  return (
    <motion.div
      ref={cardRef}
      className={`relative h-96 w-60 flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 ease-out ${
        showFocusRing
          ? 'z-10 -translate-y-4 ring-4 ring-white ring-offset-4 ring-offset-black opacity-100 shadow-[0_0_30px_rgba(255,255,255,0.4)]'
          : isActive
            ? 'z-10 opacity-100 -translate-y-4 shadow-[0_20px_30px_rgba(0,0,0,0.5)] ring-4 ring-white ring-offset-4 ring-offset-black brightness-110'
            : 'opacity-50 hover:opacity-100 hover:z-10 hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:ring-4 hover:ring-white hover:ring-offset-4 hover:ring-offset-black hover:brightness-110'
      } ${game.isHidden ? 'grayscale contrast-50 opacity-50' : ''}`}
      onClick={() => onSelect(game.id)}
      layout
    >
      <LazyImage
        src={game.cover_image}
        alt={game.title}
        className="h-full w-full rounded-lg object-cover shadow-inner"
      />
      {game.isFavorite && (
        <div className="absolute top-2 right-2 rounded-full bg-black/50 p-2 backdrop-blur-sm z-10 shadow-lg">
          <FaStar className="text-yellow-400 text-lg" />
        </div>
      )}
      {game.isHidden && (
        <div className="absolute top-2 left-2 rounded-full bg-black/60 p-2 backdrop-blur-sm z-10 border border-white/10 shadow-lg">
          <FaEyeSlash className="text-white/70 text-lg" />
        </div>
      )}
    </motion.div>
  )
})

export default GameCard
