/**
 * @fileoverview Generic modal component for alerts and confirmations.
 * @module renderer/components/ui/Modal
 */

import { motion, AnimatePresence } from 'framer-motion'
import { FaInfoCircle, FaExclamationTriangle, FaCheckCircle, FaTimes } from 'react-icons/fa'

export type ModalType = 'info' | 'success' | 'warning' | 'error' | 'confirm'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm?: () => void
  title: string
  message: string
  type?: ModalType
  confirmLabel?: string
  cancelLabel?: string
}

/** Multi-purpose modal for alerts, warnings, and confirmations. */
export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'info',
  confirmLabel = 'OK',
  cancelLabel = 'Cancel'
}: ModalProps): React.JSX.Element {
  const getIcon = (): React.JSX.Element => {
    switch (type) {
      case 'warning':
      case 'confirm':
        return <FaExclamationTriangle className="text-4xl text-orange-400" />
      case 'error':
        return <FaTimes className="text-4xl text-red-500" />
      case 'success':
        return <FaCheckCircle className="text-4xl text-green-400" />
      default:
        return <FaInfoCircle className="text-4xl text-blue-400" />
    }
  }

  const getButtonColor = (): string => {
    switch (type) {
      case 'warning':
      case 'confirm':
      case 'error':
        return 'bg-red-600 hover:bg-red-500'
      case 'success':
        return 'bg-green-600 hover:bg-green-500'
      default:
        return 'bg-blue-600 hover:bg-blue-500'
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#222] shadow-2xl"
          >
            <div className="flex flex-col items-center p-8 text-center">
              <div className="mb-6">{getIcon()}</div>
              <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
              <p className="mb-8 text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                {message}
              </p>

              <div className="flex w-full gap-3">
                {(type === 'confirm' || type === 'warning') && (
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-lg bg-white/10 py-3 text-sm font-bold text-white hover:bg-white/20 transition-colors"
                  >
                    {cancelLabel}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (onConfirm) onConfirm()
                    onClose()
                  }}
                  className={`flex-1 rounded-lg py-3 text-sm font-bold text-white transition-colors ${getButtonColor()}`}
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
