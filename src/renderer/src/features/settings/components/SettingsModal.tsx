import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaInfoCircle } from 'react-icons/fa'
import { useEffect, useState } from 'react'
import { Game } from '@/features/library/types'
import { Modal, ModalType } from '@/components/ui'
import { useTranslation } from 'react-i18next'

// Sections
import SettingsGeneral from './sections/SettingsGeneral'
import SettingsAudio from './sections/SettingsAudio'
import SettingsImport from './sections/SettingsImport'
import SettingsWeather from './sections/SettingsWeather'
import SettingsMetadata from './sections/SettingsMetadata'
import SettingsDangerZone from './sections/SettingsDangerZone'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onResetLibrary: () => void
  apiKey: string
  onSaveApiKey: (key: string) => void
  bgMusicVolume: number
  sfxVolume: number
  isMuted: boolean
  onBgMusicVolumeChange: (vol: number) => void
  onSfxVolumeChange: (vol: number) => void
  onMuteToggle: (muted: boolean) => void
  customBgMusicPath?: string
  onSaveCustomBgMusic: (path: string | undefined) => void
  weatherCity: string
  onSaveWeatherCity: (city: string, lat: number, lng: number) => void
  onImportGames: (games: Game[]) => void
  games: Game[]
}

export default function SettingsModal({
  isOpen,
  onClose,
  onResetLibrary,
  apiKey,
  onSaveApiKey,
  bgMusicVolume,
  sfxVolume,
  isMuted,
  onBgMusicVolumeChange,
  onSfxVolumeChange,
  onMuteToggle,
  customBgMusicPath,
  onSaveCustomBgMusic,
  weatherCity,
  onSaveWeatherCity,
  onImportGames,
  games
}: SettingsModalProps): React.JSX.Element {
  const { t } = useTranslation()
  const [version, setVersion] = useState<string>('')

  // Custom Modal State (for alerts/confirmations triggered by children)
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    title: string
    message: string
    type: ModalType
    onConfirm?: () => void
  }>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info',
    onConfirm: undefined
  })

  const showAlert = (title: string, message: string, type: ModalType = 'info'): void => {
    setModalConfig({ isOpen: true, title, message, type, onConfirm: undefined })
  }

  const showConfirm = (title: string, message: string, onConfirm: () => void): void => {
    setModalConfig({ isOpen: true, title, message, type: 'confirm', onConfirm })
  }

  useEffect(() => {
    if (isOpen) {
      if (window.api) {
        window.api.getAppVersion().then(setVersion)
      } else {
        setVersion('1.0.0 (Dev)')
      }
    }
  }, [isOpen])

  return (
    <>
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
                <h2 className="text-2xl font-bold text-white">{t('settings.title')}</h2>
                <button onClick={onClose} className="text-white/50 hover:text-white">
                  <FaTimes className="text-xl" />
                </button>
              </div>

              <div className="flex flex-col gap-6">
                <SettingsGeneral />

                <SettingsAudio
                  bgMusicVolume={bgMusicVolume}
                  sfxVolume={sfxVolume}
                  isMuted={isMuted}
                  onBgMusicVolumeChange={onBgMusicVolumeChange}
                  onSfxVolumeChange={onSfxVolumeChange}
                  onMuteToggle={onMuteToggle}
                  customBgMusicPath={customBgMusicPath}
                  onSaveCustomBgMusic={onSaveCustomBgMusic}
                />

                <SettingsImport
                  onImportGames={onImportGames}
                  games={games}
                  onShowAlert={showAlert}
                  onCloseParent={onClose}
                  apiKey={apiKey}
                />

                <SettingsWeather
                  weatherCity={weatherCity}
                  onSaveWeatherCity={onSaveWeatherCity}
                />

                <SettingsMetadata apiKey={apiKey} onSaveApiKey={onSaveApiKey} />

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

                <SettingsDangerZone
                  onResetLibrary={onResetLibrary}
                  onShowConfirm={showConfirm}
                  onCloseParent={onClose}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
        onConfirm={modalConfig.onConfirm}
        confirmLabel={modalConfig.type === 'confirm' ? 'Yes, I am sure' : 'OK'}
      />
    </>
  )
}