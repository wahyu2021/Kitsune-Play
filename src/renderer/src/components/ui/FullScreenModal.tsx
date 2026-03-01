/**
 * @fileoverview Reusable full-screen modal wrapper with backdrop and animations.
 * Eliminates duplicated overlay/animation pattern across feature modals.
 * @module renderer/components/ui/FullScreenModal
 */

import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes } from 'react-icons/fa'

interface FullScreenModalProps {
  /** Whether the modal is visible. */
  isOpen: boolean
  /** Callback to close the modal. */
  onClose: () => void
  /** Optional title displayed in the header. */
  title?: string
  /** Modal content. */
  children: React.ReactNode
  /** Tailwind max-width class (default: "max-w-4xl"). */
  maxWidth?: string
  /** Whether to show the close button (default: true). */
  showCloseButton?: boolean
}

/** Full-screen modal with animated backdrop, header, and scrollable content area. */
export default function FullScreenModal({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'max-w-4xl',
  showCloseButton = true
}: FullScreenModalProps): React.JSX.Element {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className={`relative w-full ${maxWidth} max-h-[90vh] overflow-hidden rounded-2xl border border-white/10 bg-[#1a1a1a]/95 shadow-2xl backdrop-blur-xl flex flex-col`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 shrink-0">
                {title && <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="ml-auto flex items-center gap-2 text-white/50 hover:text-white transition-colors"
                  >
                    <span className="text-xs font-bold uppercase tracking-wider border border-white/20 px-2 py-1 rounded">
                      ESC
                    </span>
                    <FaTimes />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
