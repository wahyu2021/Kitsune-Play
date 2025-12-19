import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaSave, FaFolderOpen, FaImage, FaMagic, FaSpinner, FaVideo } from 'react-icons/fa'
import { Game } from '@/features/library/types'
import { logger } from '@/utils/logger'
import { useAddGameForm } from '@/features/library/hooks/useAddGameForm'

interface AddGameModalProps {
  isOpen: boolean
  onClose: () => void
  onAddGame: (game: Game) => void
  editGame?: Game | null
  apiKey?: string
}

/**
 * Modal component for adding or editing game details.
 * Logic is encapsulated in useAddGameForm hook.
 */
export default function AddGameModal({
  isOpen,
  onClose,
  onAddGame,
  editGame,
  apiKey = ''
}: AddGameModalProps): React.JSX.Element {
  // Debug API Key
  useEffect(() => {
    if (isOpen) logger.debug('UI', `AddGameModal opened. API Key present: ${!!apiKey}`)
  }, [isOpen, apiKey])

  const { formData, isFetching, handleChange, handleAutoFill, handleBrowse, handleSubmit } =
    useAddGameForm({ editGame, onAddGame, onClose, apiKey })

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-black/40 p-8 shadow-2xl backdrop-blur-xl backdrop-saturate-150 overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">
                {editGame ? 'Edit Game Details' : 'Add New Game'}
              </h2>
              <button onClick={onClose} className="text-white/50 hover:text-white">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Title & Genre Row */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="mb-1 block text-sm font-medium text-white/70">Title</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none"
                      placeholder="Game Title"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleAutoFill}
                      disabled={isFetching || !apiKey || !formData.title}
                      className={`flex items-center justify-center rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 text-orange-400 transition-all hover:bg-orange-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed ${!apiKey ? 'hidden' : ''}`}
                      title="Auto-fill details from RAWG"
                    >
                      {isFetching ? <FaSpinner className="animate-spin" /> : <FaMagic />}
                    </button>
                  </div>
                </div>
                <div className="w-1/3">
                  <label className="mb-1 block text-sm font-medium text-white/70">Genre</label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none"
                    placeholder="Action, RPG, Adventure"
                  />
                </div>
              </div>

              {/* Executable Path (Browse Button) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">
                  Executable Path (.exe)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="path_to_exe"
                    value={formData.path_to_exe}
                    onChange={handleChange}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none"
                    placeholder="C:\Games\MyGame\game.exe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleBrowse('path_to_exe', ['exe'])}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20"
                  >
                    <FaFolderOpen /> Browse
                  </button>
                </div>
              </div>

              {/* Launch Arguments */}
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">
                  Launch Arguments (Optional)
                </label>
                <input
                  type="text"
                  name="launchArgs"
                  value={formData.launchArgs}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none font-mono text-sm"
                  placeholder="e.g., -windowed -skipintro"
                />
              </div>

              {/* Executable Name (For Process Tracking) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">
                  Target Process Name (For Steam/Epic Tracking)
                </label>
                <input
                  type="text"
                  name="executableName"
                  value={formData.executableName || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none font-mono text-sm"
                  placeholder="e.g., dota2.exe (Leave empty for standard games)"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none"
                  placeholder="Brief description..."
                />
              </div>

              {/* Images (Browse Buttons) */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/70">
                    Cover Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="cover_image"
                      value={formData.cover_image}
                      onChange={handleChange}
                      className="w-full min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-white/30 focus:outline-none"
                      placeholder="Path or URL..."
                    />
                    <button
                      type="button"
                      onClick={() => handleBrowse('cover_image', ['jpg', 'png', 'webp', 'jpeg'])}
                      className="flex items-center justify-center rounded-lg bg-white/10 px-3 text-white hover:bg-white/20"
                      title="Browse Cover"
                    >
                      <FaImage />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-white/70">
                    Background Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="bg_image"
                      value={formData.bg_image}
                      onChange={handleChange}
                      className="w-full min-w-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white focus:border-white/30 focus:outline-none"
                      placeholder="Path or URL..."
                    />
                    <button
                      type="button"
                      onClick={() => handleBrowse('bg_image', ['jpg', 'png', 'webp', 'jpeg'])}
                      className="flex items-center justify-center rounded-lg bg-white/10 px-3 text-white hover:bg-white/20"
                      title="Browse Background"
                    >
                      <FaImage />
                    </button>
                  </div>
                </div>
              </div>

              {/* Background Video (Browse Button) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">
                  Background Video (Live Wallpaper)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="bg_video"
                    value={formData.bg_video}
                    onChange={handleChange}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-white/30 focus:outline-none"
                    placeholder="Path to .mp4 or .webm video..."
                  />
                  <button
                    type="button"
                    onClick={() => handleBrowse('bg_video', ['mp4', 'webm'])}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20"
                  >
                    <FaVideo /> Browse
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-white py-3 font-bold text-black transition-transform hover:scale-105"
              >
                <FaSave /> {editGame ? 'Update Game' : 'Save to Library'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
