import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Game } from '@/features/library/types'
import { DEFAULT_BANNER } from '../config'

interface ScreensaverProps {
  activeGame?: Game | null
}

/**
 * Screensaver component displayed when the application is idle.
 * Features:
 * - Ken Burns effect (slow zoom) on background.
 * - Cinematic vignette overlay.
 * - Pixel-shifting clock for burn-in protection.
 */
export default function Screensaver({ activeGame }: ScreensaverProps): React.JSX.Element {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white overflow-hidden"
    >
      {/* Layer 1: Animated Background (Ken Burns Effect) */}
      <div className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="h-full w-full"
        >
          {activeGame?.bg_video ? (
            <video
              src={activeGame.bg_video}
              className="h-full w-full object-cover opacity-60"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img
              src={activeGame?.bg_image || DEFAULT_BANNER}
              alt="Screensaver BG"
              className="h-full w-full object-cover opacity-60"
            />
          )}
        </motion.div>
      </div>

      {/* Layer 2: Vignette & Gradient Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/20 to-black opacity-80" />
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />

      {/* Layer 3: Content with Pixel Shift */}
      <motion.div
        className="z-20 flex flex-col items-center text-center px-8 max-w-5xl antialiased"
        style={{ willChange: 'transform', backfaceVisibility: 'hidden' }}
        animate={{
          x: [0, -10, 0, 10, 0],
          y: [0, 5, 0, -5, 0]
        }}
        transition={{
          duration: 60, // 1 minute loop
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {/* Game Title - THE HERO ELEMENT */}
        {activeGame && (
          <motion.h2
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1.5, ease: 'easeOut' }}
            className="mb-8 text-7xl font-black uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/50 drop-shadow-lg leading-tight"
          >
            {activeGame.title}
          </motion.h2>
        )}

        {/* Digital Clock - Secondary Element */}
        <motion.h1
          className="text-8xl font-thin tracking-widest text-white/80 drop-shadow-2xl font-mono"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </motion.h1>

        {/* Date */}
        <div className="mt-4 flex items-center gap-4 justify-center">
          <div className="h-[1px] w-20 bg-orange-500/50" />
          <p className="text-xl font-medium tracking-[0.2em] text-orange-400 uppercase">
            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <div className="h-[1px] w-20 bg-orange-500/50" />
        </div>

        {/* Resume Hint */}
        <motion.div
          animate={{ opacity: [0, 0.4, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-12 flex flex-col items-center gap-2"
        >
          <span className="text-xs font-bold tracking-[0.5em] uppercase text-white/40">
            Press any key to resume
          </span>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
