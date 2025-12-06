import { motion } from 'framer-motion'
import { Game } from '../types'
import { useRef, useEffect } from 'react'
import LazyImage from './LazyImage'

interface GameCardProps {
  game: Game
  isActive: boolean
  onClick: () => void
}

function GameCard({ game, isActive, onClick }: GameCardProps): React.JSX.Element {
  // Using a ref to scroll this element into view when active
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

  return (
    <motion.div
      ref={cardRef}
      className={`relative h-96 w-60 flex-shrink-0 cursor-pointer rounded-xl transition-all duration-300 ${
        isActive
          ? 'z-10 scale-110 ring-4 ring-white ring-offset-4 ring-offset-black'
          : 'opacity-60 hover:opacity-100'
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
    >
      <LazyImage src={game.cover_image} alt={game.title} className="h-full w-full rounded-lg" />
    </motion.div>
  )
}

export default GameCard
