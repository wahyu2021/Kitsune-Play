/**
 * @fileoverview Game card component for library display.
 * @module renderer/features/library/components/GameCard
 */

import { motion } from 'framer-motion'
import { Game } from '@/features/library/types'
import { useRef, useEffect } from 'react'
import LazyImage from '@/components/ui/LazyImage'
import { useInput } from '@/context/useInput'
import { FaStar, FaEyeSlash } from 'react-icons/fa'

interface GameCardProps {
  game: Game
  isActive: boolean
  onClick: () => void
}

/** Interactive game card with cover image and selection state. */
function GameCard({ game, isActive, onClick }: GameCardProps): React.JSX.Element {
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
      className={`relative h-96 w-60 flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 ${
        showFocusRing
          ? 'z-10 scale-110 ring-4 ring-white ring-offset-4 ring-offset-black opacity-100'
          : isActive
            ? 'opacity-100 hover:scale-105'
            : 'opacity-60 hover:opacity-100'
      } ${game.isHidden ? 'grayscale contrast-50 opacity-50' : ''}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
    >
      <LazyImage src={game.cover_image} alt={game.title} className="h-full w-full rounded-lg" />
      {game.isFavorite && (
        <div className="absolute top-2 right-2 rounded-full bg-black/50 p-2 backdrop-blur-sm z-10">
          <FaStar className="text-yellow-400 text-lg" />
        </div>
      )}
      {game.isHidden && (
        <div className="absolute top-2 left-2 rounded-full bg-black/60 p-2 backdrop-blur-sm z-10 border border-white/10">
          <FaEyeSlash className="text-white/70 text-lg" />
        </div>
      )}
    </motion.div>
  )
}

export default GameCard
