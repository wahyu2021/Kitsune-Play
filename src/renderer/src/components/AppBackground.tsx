/**
 * @fileoverview Application background component with video/image support.
 * @module renderer/components/AppBackground
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Game } from '@/features/library/types'
import { getGenreColor } from '@/utils/theme'
import { DEFAULT_BANNER } from '@/config'

interface AppBackgroundProps {
  selectedGame?: Game
  showVideoDelay?: number
  activeTab?: 'games' | 'media'
  mediaBg?: string
}

/**
 * Renders dynamic background based on selected game.
 * Supports video backgrounds with delayed activation.
 */
export default function AppBackground({
  selectedGame,
  showVideoDelay = 5000,
  activeTab = 'games',
  mediaBg
}: AppBackgroundProps): React.JSX.Element {
  const [showVideo, setShowVideo] = useState(false)

  useEffect(() => {
    setShowVideo(false)
    const timer = setTimeout(() => {
      setShowVideo(true)
    }, showVideoDelay)

    return () => clearTimeout(timer)
  }, [selectedGame?.id, showVideoDelay])

  // Determine background image based on tab
  const backgroundImage =
    activeTab === 'media' && mediaBg ? mediaBg : selectedGame?.bg_image || DEFAULT_BANNER

  return (
    <>
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          {selectedGame?.bg_video && showVideo && activeTab === 'games' ? (
            <motion.video
              key={selectedGame.bg_video}
              src={selectedGame.bg_video}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <motion.img
              key={backgroundImage}
              src={backgroundImage}
              alt="Background"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </AnimatePresence>
      </div>
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
      <div
        className={`absolute inset-0 z-10 bg-gradient-to-t ${getGenreColor(selectedGame?.genre || '')} via-transparent to-transparent mix-blend-overlay transition-colors duration-1000 ease-in-out opacity-75`}
      />
      <div className="absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-black/80 to-transparent" />
    </>
  )
}
