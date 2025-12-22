/**
 * @fileoverview User profile modal component.
 * @module renderer/features/profile/components/ProfileModal
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaUserCircle, FaSave, FaCamera } from 'react-icons/fa'
import { logger } from '@/utils/logger'
import { useTranslation } from 'react-i18next'

interface ProfileModalProps {
  /** Whether the modal is currently visible. */
  isOpen: boolean
  /** Function to close the modal. */
  onClose: () => void
  /** Current display name of the user. */
  userName: string
  /** Optional path to the user's avatar image. */
  avatar?: string
  /** Callback to save the new user name. */
  onSaveName: (newName: string) => void
  /** Callback to trigger the avatar upload process. */
  onAvatarUpload: () => void
}

export default function ProfileModal({
  isOpen,
  onClose,
  userName,
  avatar,
  onSaveName,
  onAvatarUpload
}: ProfileModalProps): React.JSX.Element {
  const { t } = useTranslation()
  const [name, setName] = useState(userName)

  useEffect(() => {
    if (isOpen) {
      setName(userName)
    }
  }, [isOpen, userName])

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
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1a1a1a] p-8 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">{t('profile.title')}</h2>
              <button onClick={onClose} className="text-white/50 hover:text-white">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="mb-8 flex flex-col items-center justify-center gap-4">
              <div
                className="relative group cursor-pointer"
                onClick={onAvatarUpload}
                title={t('profile.change_avatar')}
              >
                <div className="h-32 w-32 overflow-hidden rounded-full bg-white/5 ring-4 ring-white/20">
                  {avatar ? (
                    <img
                      src={`file://${avatar}`}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <FaUserCircle className="text-8xl text-white/80" />
                    </div>
                  )}
                </div>
                <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <FaCamera className="text-3xl text-white" />
                </div>
              </div>
              <p className="text-sm text-white/50">
                {t('profile.upload_hint') || 'Click to upload avatar'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">
                  {t('profile.display_name')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-center text-xl font-bold text-white focus:border-white/30 focus:outline-none"
                  placeholder={t('profile.placeholder_name')}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-white py-3 font-bold text-black transition-transform hover:scale-105"
              >
                <FaSave /> {t('profile.btn_save')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
