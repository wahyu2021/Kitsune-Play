import { motion } from 'framer-motion'
import { Game } from '@/features/library/types'
import { useRef, useEffect } from 'react'
import LazyImage from '@/components/ui/LazyImage'
import { useInput } from '@/context/InputContext'

interface GameCardProps {
  game: Game
  isActive: boolean
  onClick: () => void
}

function GameCard({ game, isActive, onClick }: GameCardProps): React.JSX.Element {
  const { isFocusVisible } = useInput()
  // Using a ref to scroll this element into view when active
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only scroll into view if focus is visible (keyboard/gamepad) or if it's strictly active
    // We keep it scrolling for mouse too because usually clicking a card centers it, which is nice.
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
            ? 'opacity-100 hover:scale-105' // Active but mouse mode: just full opacity
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
