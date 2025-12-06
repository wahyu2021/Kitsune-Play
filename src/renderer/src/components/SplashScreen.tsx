import { motion } from 'framer-motion'
import logoIcon from '../assets/icon.png'

/**
 * Renders an animated splash screen for the application startup.
 * Displays a logo, application title, and a loading indicator.
 * Provides a "CLICK TO START" prompt if audio autoplay is blocked.
 * @param needsInteraction - Boolean indicating if the user needs to interact to start audio.
 */
export default function SplashScreen({
  needsInteraction = false
}: {
  needsInteraction?: boolean
}): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] text-white"
      onClick={() => {}}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="relative"
        >
          <div className="absolute inset-0 blur-3xl bg-orange-500/20 rounded-full scale-150" />
          <img
            src={logoIcon}
            alt="Kitsune Play Logo"
            className="relative h-32 w-32 object-cover rounded-full drop-shadow-[0_0_25px_rgba(249,115,22,0.4)]"
          />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black tracking-tighter uppercase">
            Kitsune <span className="text-orange-500">Play</span>
          </h1>

          {needsInteraction ? (
            <motion.p
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="mt-4 text-sm font-bold tracking-[0.3em] text-orange-500 cursor-pointer"
            >
              CLICK TO START
            </motion.p>
          ) : (
            <p className="mt-2 text-sm font-medium tracking-[0.3em] text-white/40">
              LOADING SYSTEM
            </p>
          )}
        </motion.div>

        {!needsInteraction && (
          <div className="mt-12 h-1 w-64 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '0%' }}
              transition={{ duration: 2.5, ease: 'easeInOut' }}
              className="h-full w-full bg-gradient-to-r from-orange-600 to-white"
            />
          </div>
        )}
      </div>
    </motion.div>
  )
}
