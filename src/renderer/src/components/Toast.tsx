import { motion, AnimatePresence } from 'framer-motion'
import { FaInfoCircle, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa'

export type ToastType = 'info' | 'success' | 'error'

interface ToastProps {
  message: string | null
  type: ToastType
  onClose: () => void
}

export default function Toast({ message, type, onClose }: ToastProps): React.JSX.Element {
  // Auto close after 3 seconds
  if (message) {
    setTimeout(onClose, 3000)
  }

  const getIcon = (): React.JSX.Element => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-400" />
      case 'error':
        return <FaExclamationCircle className="text-red-400" />
      default:
        return <FaInfoCircle className="text-blue-400" />
    }
  }

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: 20, x: '-50%' }}
          className="fixed bottom-10 left-1/2 z-[100] flex items-center gap-3 rounded-full bg-[#202020] px-6 py-3 shadow-[0_0_20px_rgba(0,0,0,0.5)] ring-1 ring-white/10 backdrop-blur-md"
        >
          {getIcon()}
          <span className="font-medium text-white">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
