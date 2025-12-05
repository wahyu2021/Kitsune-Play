import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaTrashRestore, FaInfoCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onResetLibrary: () => void
}

export default function SettingsModal({ isOpen, onClose, onResetLibrary }: SettingsModalProps): React.JSX.Element {
  const [version, setVersion] = useState<string>('')

  useEffect(() => {
    if (isOpen) {
        window.api.getAppVersion().then(setVersion)
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 shadow-2xl"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <button onClick={onClose} className="text-white/50 hover:text-white">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="flex flex-col gap-6">
                {/* App Info */}
                <div className="rounded-lg bg-white/5 p-4">
                    <div className="flex items-center gap-3 mb-2">
                        <FaInfoCircle className="text-blue-400" />
                        <h3 className="font-bold text-white">Kitsune Play v{version}</h3>
                    </div>
                    <p className="text-sm text-white/60">
                        A modern PS5-style game launcher built with Electron, React, and Tailwind CSS.
                    </p>
                </div>

                {/* Danger Zone */}
                <div>
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-red-400">Danger Zone</h3>
                    <button
                        onClick={() => {
                            if(confirm('Are you sure? This will delete all your games and reset to defaults.')) {
                                onResetLibrary()
                                onClose()
                            }
                        }}
                        className="flex w-full items-center justify-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 py-3 text-red-400 transition-colors hover:bg-red-500 hover:text-white"
                    >
                        <FaTrashRestore /> Reset Library to Defaults
                    </button>
                </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
