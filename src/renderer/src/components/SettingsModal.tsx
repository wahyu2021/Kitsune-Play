import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaTrashRestore, FaInfoCircle, FaKey, FaExternalLinkAlt, FaSave, FaVolumeUp, FaVolumeMute, FaVolumeDown } from 'react-icons/fa'
import { useEffect, useState } from 'react'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onResetLibrary: () => void
  apiKey: string
  onSaveApiKey: (key: string) => void
  volume: number
  isMuted: boolean
  onVolumeChange: (vol: number) => void
  onMuteToggle: (muted: boolean) => void
}

export default function SettingsModal({ 
    isOpen, 
    onClose, 
    onResetLibrary, 
    apiKey, 
    onSaveApiKey,
    volume,
    isMuted,
    onVolumeChange,
    onMuteToggle
}: SettingsModalProps): React.JSX.Element {
  const [version, setVersion] = useState<string>('')
  const [localKey, setLocalKey] = useState(apiKey)

  // Sync local state with prop only when modal opens
  useEffect(() => {
    if (isOpen) {
        if (window.api) {
            window.api.getAppVersion().then(setVersion)
        } else {
            setVersion('1.0.0 (Dev)')
        }
        setLocalKey(apiKey)
    }
  }, [isOpen]) // Removed apiKey from dependency to prevent loops

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
                {/* Audio Settings */}
                <div>
                    <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-400">Audio</h3>
                    <div className="rounded-lg bg-white/5 p-4">
                        <div className="flex items-center justify-between mb-4">
                            <label className="flex items-center gap-2 text-sm font-bold text-white">
                                {isMuted ? <FaVolumeMute className="text-red-400" /> : <FaVolumeUp />}
                                Master Volume
                            </label>
                            <button
                                onClick={() => onMuteToggle(!isMuted)}
                                className={`text-xs font-bold px-2 py-1 rounded ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
                            >
                                {isMuted ? 'MUTED' : 'MUTE'}
                            </button>
                        </div>
                        <div className="flex items-center gap-3">
                            <FaVolumeDown className="text-white/40 text-xs" />
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={volume}
                                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                                disabled={isMuted}
                                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
                            />
                            <FaVolumeUp className="text-white/40 text-xs" />
                        </div>
                        <p className="text-right text-xs text-white/40 mt-1">{Math.round(volume * 100)}%</p>
                    </div>
                </div>

                {/* API Integration */}
              <div>
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-orange-400">
                  Metadata Provider
                </h3>
                <div className="rounded-lg bg-white/5 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="flex items-center gap-2 text-sm font-bold text-white">
                      <FaKey className="text-white/60" /> RAWG API Key
                    </label>
                    <a
                      href="https://rawg.io/apidocs"
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-blue-400 hover:underline"
                    >
                      Get Key <FaExternalLinkAlt />
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={localKey}
                      onChange={(e) => setLocalKey(e.target.value)}
                      placeholder="Paste your API key here..."
                      className="flex-1 rounded bg-black/20 px-3 py-2 text-sm text-white border border-white/10 focus:border-orange-500 focus:outline-none"
                    />
                    <button
                      onClick={() => onSaveApiKey(localKey)}
                      className="flex items-center gap-2 rounded bg-white/10 px-4 text-sm font-bold text-white hover:bg-orange-500 hover:text-white transition-colors"
                    >
                      <FaSave /> Save
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-white/40">
                    Used to auto-fetch game covers and descriptions.
                  </p>
                </div>
              </div>

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
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-red-400">
                  Danger Zone
                </h3>
                <button
                  onClick={() => {
                    if (
                      confirm(
                        'Are you sure? This will delete all your games and reset to defaults.'
                      )
                    ) {
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
