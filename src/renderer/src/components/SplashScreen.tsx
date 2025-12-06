import { motion } from 'framer-motion'
import logoIcon from '../assets/icon.png'

/**
 * Renders an animated splash screen for the application startup.
 * Requires user interaction to proceed, ensuring audio context is unlocked.
 * @param onStart - Callback function triggered when the user clicks start.
 */
export default function SplashScreen({ onStart }: { onStart: () => void }): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a] text-white cursor-pointer"
      onClick={onStart} 
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black/80" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent" />

      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
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
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-black tracking-tighter uppercase">
            Kitsune <span className="text-orange-500">Play</span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
            className="mt-6 text-sm font-bold tracking-[0.5em] text-white/60"
          >
            PRESS ANY KEY
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}
