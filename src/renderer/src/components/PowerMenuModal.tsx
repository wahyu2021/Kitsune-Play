import { motion, AnimatePresence } from 'framer-motion'
import { FaPowerOff, FaRedo, FaMoon, FaDoorOpen } from 'react-icons/fa'

interface PowerMenuModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PowerMenuModal({
  isOpen,
  onClose
}: PowerMenuModalProps): React.JSX.Element {
  const handleAction = (action: 'shutdown' | 'restart' | 'sleep' | 'quit'): void => {
    if (window.api) {
      switch (action) {
        case 'shutdown':
          window.api.shutdownSystem()
          break
        case 'restart':
          window.api.restartSystem()
          break
        case 'sleep':
          window.api.sleepSystem()
          break
        case 'quit':
          window.api.quit()
          break
      }
    }
    onClose()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    },
    exit: { opacity: 0 }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
    exit: { y: 20, opacity: 0 }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="absolute inset-0" onClick={onClose} /> {/* Click outside to close */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-4xl p-8 text-center"
          >
            <motion.h2
              variants={itemVariants}
              className="mb-12 text-3xl font-light text-white tracking-widest uppercase"
            >
              Power Options
            </motion.h2>

            <div className="flex flex-wrap items-center justify-center gap-8">
              {/* Sleep */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction('sleep')}
                className="group flex flex-col items-center gap-4"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all duration-300 group-hover:bg-blue-600 group-hover:ring-blue-400 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]">
                  <FaMoon className="text-3xl text-white/80 group-hover:text-white" />
                </div>
                <div className="space-y-1">
                  <span className="block text-lg font-medium text-white group-hover:text-blue-400">
                    Sleep
                  </span>
                  <span className="block text-xs text-white/40 uppercase tracking-wider">
                    Suspend
                  </span>
                </div>
              </motion.button>

              {/* Restart */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction('restart')}
                className="group flex flex-col items-center gap-4"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all duration-300 group-hover:bg-orange-600 group-hover:ring-orange-400 group-hover:shadow-[0_0_30px_rgba(234,88,12,0.5)]">
                  <FaRedo className="text-3xl text-white/80 group-hover:text-white" />
                </div>
                <div className="space-y-1">
                  <span className="block text-lg font-medium text-white group-hover:text-orange-400">
                    Restart
                  </span>
                  <span className="block text-xs text-white/40 uppercase tracking-wider">
                    Reboot
                  </span>
                </div>
              </motion.button>

              {/* Shutdown */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction('shutdown')}
                className="group flex flex-col items-center gap-4"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all duration-300 group-hover:bg-red-600 group-hover:ring-red-400 group-hover:shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                  <FaPowerOff className="text-3xl text-white/80 group-hover:text-white" />
                </div>
                <div className="space-y-1">
                  <span className="block text-lg font-medium text-white group-hover:text-red-400">
                    Turn Off
                  </span>
                  <span className="block text-xs text-white/40 uppercase tracking-wider">
                    Shutdown
                  </span>
                </div>
              </motion.button>

              {/* Exit App */}
              <motion.button
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleAction('quit')}
                className="group flex flex-col items-center gap-4"
              >
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 transition-all duration-300 group-hover:bg-gray-600 group-hover:ring-gray-400 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                  <FaDoorOpen className="text-3xl text-white/80 group-hover:text-white" />
                </div>
                <div className="space-y-1">
                  <span className="block text-lg font-medium text-white group-hover:text-gray-400">
                    Exit App
                  </span>
                  <span className="block text-xs text-white/40 uppercase tracking-wider">
                    Desktop
                  </span>
                </div>
              </motion.button>
            </div>

            <motion.button
              variants={itemVariants}
              onClick={onClose}
              className="mt-16 rounded-full px-8 py-2 text-sm font-bold text-white/30 transition-colors hover:bg-white/10 hover:text-white"
            >
              CANCEL
            </motion.button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
