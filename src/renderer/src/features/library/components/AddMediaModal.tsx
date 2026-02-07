/**
 * @fileoverview Modal for adding or editing media/coding app entries.
 * Features autocomplete suggestions from coding apps preset database.
 * @module renderer/features/library/components/AddMediaModal
 */

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaSave, FaFolderOpen, FaImage, FaMagic, FaCode } from 'react-icons/fa'
import { Game } from '@/features/library/types'
import { logger } from '@/utils/logger'
import { useAddMediaForm } from '@/features/library/hooks/useAddMediaForm'
import { useTranslation } from 'react-i18next'

interface AddMediaModalProps {
  isOpen: boolean
  onClose: () => void
  onAddMedia: (media: Game) => void
  editMedia?: Game | null
}

/** Modal dialog for adding new media apps or editing existing entries. */
export default function AddMediaModal({
  isOpen,
  onClose,
  onAddMedia,
  editMedia
}: AddMediaModalProps): React.JSX.Element {
  const { t } = useTranslation()
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) logger.debug('UI', 'AddMediaModal opened')
  }, [isOpen])

  const {
    formData,
    suggestions,
    showSuggestions,
    handleChange,
    handleSelectSuggestion,
    handleAutoFillFromTitle,
    handleBrowse,
    handleSubmit,
    resetForm,
    closeSuggestions
  } = useAddMediaForm({ editGame: editMedia, onAddGame: onAddMedia, onClose })

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent): void => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target as Node)) {
        closeSuggestions()
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showSuggestions, closeSuggestions])

  return (
    <AnimatePresence onExitComplete={resetForm}>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-lg rounded-2xl border border-cyan-500/20 bg-black/40 p-8 shadow-2xl backdrop-blur-xl backdrop-saturate-150 overflow-y-auto max-h-[90vh] custom-scrollbar"
          >
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-cyan-500/20">
                  <FaCode className="text-cyan-400 text-lg" />
                </div>
                <h2 className="text-2xl font-bold text-white">
                  {editMedia ? t('add_media.title_edit') : t('add_media.title_add')}
                </h2>
              </div>
              <button onClick={onClose} className="text-white/50 hover:text-white">
                <FaTimes className="text-xl" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Title with Autocomplete & Genre Row */}
              <div className="flex gap-4">
                <div className="flex-1 relative" ref={suggestionsRef}>
                  <label className="mb-1 block text-sm font-medium text-white/70">
                    {t('add_media.field_title')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      autoComplete="off"
                      className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                      placeholder={t('add_media.placeholder_title')}
                      required
                    />
                    <button
                      type="button"
                      onClick={handleAutoFillFromTitle}
                      disabled={!formData.title}
                      className="flex items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 text-cyan-400 transition-all hover:bg-cyan-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title={t('add_media.tooltip_autofill')}
                    >
                      <FaMagic />
                    </button>
                  </div>

                  {/* Autocomplete Suggestions Dropdown */}
                  <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-10 mt-1 w-full rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl overflow-hidden"
                      >
                        {suggestions.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => handleSelectSuggestion(preset)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-cyan-500/20 transition-colors border-b border-white/5 last:border-b-0"
                          >
                            <img
                              src={preset.icon}
                              alt=""
                              className="w-8 h-8 rounded object-contain bg-white/10"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-white font-medium truncate">{preset.name}</div>
                              <div className="text-xs text-white/50">{preset.genre}</div>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="w-1/3">
                  <label className="mb-1 block text-sm font-medium text-white/70">
                    {t('add_media.field_genre')}
                  </label>
                  <input
                    type="text"
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                    placeholder={t('add_media.placeholder_genre')}
                  />
                </div>
              </div>

              {/* Executable Path (Browse Button) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">
                  {t('add_media.field_path')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="path_to_exe"
                    value={formData.path_to_exe}
                    onChange={handleChange}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                    placeholder={t('add_media.placeholder_path')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleBrowse('path_to_exe', ['exe', 'lnk', 'bat', 'cmd'])}
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                  >
                    <FaFolderOpen /> {t('actions.browse')}
                  </button>
                </div>
              </div>

              {/* Launch Arguments */}
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">
                  {t('add_media.field_args')}
                </label>
                <input
                  type="text"
                  name="launchArgs"
                  value={formData.launchArgs}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none font-mono text-sm transition-colors"
                  placeholder={t('add_media.placeholder_args')}
                />
              </div>

              {/* Executable Name (For Process Tracking) */}
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">
                  {t('add_media.field_process')}
                </label>
                <input
                  type="text"
                  name="executableName"
                  value={formData.executableName || ''}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none font-mono text-sm transition-colors"
                  placeholder={t('add_media.placeholder_process')}
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">
                  {t('add_media.field_desc')}
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none custom-scrollbar resize-none transition-colors"
                  placeholder={t('add_media.placeholder_desc')}
                />
              </div>

              {/* Icon/Cover Image */}
              <div>
                <label className="mb-1 block text-sm font-medium text-white/70">
                  {t('add_media.field_cover')}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="cover_image"
                    value={formData.cover_image}
                    onChange={handleChange}
                    className="flex-1 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-cyan-500/50 focus:outline-none transition-colors"
                    placeholder={t('add_media.placeholder_url')}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleBrowse('cover_image', ['jpg', 'png', 'webp', 'jpeg', 'svg', 'ico'])
                    }
                    className="flex items-center gap-2 rounded-lg bg-white/10 px-4 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                  >
                    <FaImage /> {t('actions.browse')}
                  </button>
                </div>
              </div>

              {/* Icon Preview */}
              {formData.cover_image && (
                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                  <label className="mb-2 block text-sm font-medium text-white/70">
                    {t('add_media.preview')}
                  </label>
                  <div className="flex items-center gap-4">
                    <img
                      src={formData.cover_image}
                      alt="App Icon"
                      className="w-16 h-16 rounded-xl object-contain bg-white/10 p-2"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    <div className="flex-1">
                      <div className="text-white font-medium">{formData.title || 'App Name'}</div>
                      <div className="text-sm text-white/50">{formData.genre || 'Category'}</div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 py-3 font-bold text-white transition-all hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
              >
                <FaSave /> {editMedia ? t('add_media.btn_update') : t('add_media.btn_save')}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
