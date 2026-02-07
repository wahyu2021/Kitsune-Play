/**
 * @fileoverview Media app card component for library display.
 * Compact icon-based design like mobile app icons.
 * @module renderer/features/library/components/MediaCard
 */

import { motion } from 'framer-motion'
import { Game } from '@/features/library/types'
import { useRef, useEffect, memo } from 'react'
import LazyImage from '@/components/ui/LazyImage'
import { useInput } from '@/context/useInput'
import { FaStar, FaEyeSlash, FaCode } from 'react-icons/fa'

interface MediaCardProps {
  app: Game
  isActive: boolean
  onSelect: (id: string) => void
}

/** Compact mobile-style app icon card. */
const MediaCard = memo(function MediaCard({
  app,
  isActive,
  onSelect
}: MediaCardProps): React.JSX.Element {
  const { isFocusVisible } = useInput()
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }, [isActive])

  const showFocusRing = isActive && isFocusVisible

  return (
    <motion.div
      ref={cardRef}
      className={`relative flex flex-col items-center gap-2 p-3 rounded-2xl cursor-pointer transition-all duration-200 w-28 ${
        showFocusRing
          ? 'scale-110 ring-2 ring-cyan-400 bg-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
          : isActive
            ? 'scale-110 ring-2 ring-white/60 bg-white/15 shadow-xl'
            : 'hover:scale-105 hover:bg-white/10'
      } ${app.isHidden ? 'grayscale opacity-40' : ''}`}
      onClick={() => onSelect(app.id)}
      whileHover={{ scale: isActive ? 1.1 : 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Icon Container */}
      <div
        className={`relative w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden transition-all duration-200 ${
          isActive ? 'bg-white/20 shadow-lg' : 'bg-white/10'
        }`}
      >
        {app.cover_image ? (
          <LazyImage src={app.cover_image} alt={app.title} className="w-12 h-12 object-contain" />
        ) : (
          <FaCode className="text-2xl text-cyan-400" />
        )}

        {/* Favorite Badge */}
        {app.isFavorite && (
          <div className="absolute -top-1 -right-1 rounded-full bg-yellow-500 p-1 shadow-lg">
            <FaStar className="text-white text-[8px]" />
          </div>
        )}

        {/* Hidden Badge */}
        {app.isHidden && (
          <div className="absolute -top-1 -left-1 rounded-full bg-gray-600 p-1 shadow-lg">
            <FaEyeSlash className="text-white text-[8px]" />
          </div>
        )}
      </div>

      {/* App Title */}
      <p
        className={`text-xs font-medium text-center w-full truncate transition-colors ${
          isActive ? 'text-white' : 'text-white/70'
        }`}
      >
        {app.title}
      </p>
    </motion.div>
  )
})

export default MediaCard
