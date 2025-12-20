/**
 * @fileoverview Animated splash screen component.
 * Requires user interaction to proceed (unlocks audio context).
 * @module renderer/components/SplashScreen
 */

import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaPlay } from 'react-icons/fa'
import logoIcon from '@/assets/icon.png'
import bannerBg from '@/assets/banner-game.png'
import { useTranslation } from 'react-i18next'

interface SplashScreenProps {
  onStart: () => void
}

/** Animated splash screen displayed on application launch. */
export default function SplashScreen({ onStart }: SplashScreenProps): React.JSX.Element {
  const { t } = useTranslation()

  // Handle "Press Any Key" interaction
  useEffect(() => {
    const handleKeyDown = (): void => {
      onStart()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onStart])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black text-white cursor-pointer overflow-hidden"
      onClick={onStart}
    >
      <div className="absolute inset-0 z-0">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse', ease: 'linear' }}
          className="h-full w-full"
        >
          <img src={bannerBg} alt="Background" className="h-full w-full object-cover opacity-60" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute inset-0 blur-3xl bg-orange-500/40 rounded-full scale-110"
          />

          <img
            src={logoIcon}
            alt="Kitsune Play Logo"
            className="relative h-40 w-40 object-cover rounded-3xl shadow-2xl ring-1 ring-white/20"
          />
        </motion.div>

        <div className="text-center space-y-2">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl font-black tracking-tighter text-white drop-shadow-lg"
          >
            KITSUNE PLAY
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg font-medium text-white/60 tracking-[0.3em] uppercase"
          >
            {t('splash.subtitle')}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="mt-8 group"
        >
          <div className="flex flex-col items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="h-16 w-16 flex items-center justify-center rounded-full bg-white/10 border border-white/20 backdrop-blur-md group-hover:bg-orange-600 group-hover:border-orange-500 transition-all duration-300 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              <FaPlay className="text-xl text-white group-hover:scale-110 transition-transform ml-1" />
            </motion.div>
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-xs font-bold tracking-[0.2em] text-white/70 group-hover:text-white transition-colors"
            >
              {t('splash.press_key')}
            </motion.span>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-1">
        <div className="h-[1px] w-24 bg-white/20 mb-2"></div>
        <div className="text-[10px] font-mono text-white/30 tracking-widest">
          v1.1.0 • {t('splash.system_ready')}
        </div>
      </div>
    </motion.div>
  )
}
