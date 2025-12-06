import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaSave, FaUserCircle } from 'react-icons/fa'
import { logger } from '../utils/logger'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  userName: string
  onSaveName: (newName: string) => void
}

export default function ProfileModal({
  isOpen,
  onClose,
  userName,
  onSaveName
}: ProfileModalProps): React.JSX.Element {
  const [name, setName] = useState(userName)

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    if (name.trim()) {
      logger.info('UI', `ProfileModal: Saving name as "${name}"`)
      onSaveName(name)
      onClose()
    }
  }

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
              <h2 className="text-2xl font-bold text-white">Profile Settings</h2>
              <button onClick={onClose} className="text-white/50 hover:text-white">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="mb-8 flex flex-col items-center justify-center gap-4">
              <div className="rounded-full bg-white/5 p-4 ring-2 ring-white/20">
                <FaUserCircle className="text-8xl text-white/80" />
              </div>
              <p className="text-sm text-white/50">Avatar editing coming soon</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center text-xl font-bold text-white focus:border-white/30 focus:outline-none"
                  placeholder="Enter your name"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-white py-3 font-bold text-black transition-transform hover:scale-105"
              >
                <FaSave /> Save Profile
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
