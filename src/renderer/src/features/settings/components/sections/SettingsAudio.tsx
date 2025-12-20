import { FaVolumeUp, FaVolumeMute, FaMusic, FaFolderOpen, FaUndo } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

interface SettingsAudioProps {
  bgMusicVolume: number
  sfxVolume: number
  isMuted: boolean
  onBgMusicVolumeChange: (vol: number) => void
  onSfxVolumeChange: (vol: number) => void
  onMuteToggle: (muted: boolean) => void
  customBgMusicPath?: string
  onSaveCustomBgMusic: (path: string | undefined) => void
}

export default function SettingsAudio({
  bgMusicVolume,
  sfxVolume,
  isMuted,
  onBgMusicVolumeChange,
  onSfxVolumeChange,
  onMuteToggle,
  customBgMusicPath,
  onSaveCustomBgMusic
}: SettingsAudioProps): React.JSX.Element {
  const { t } = useTranslation()

  const handleSelectMusic = async (): Promise<void> => {
    if (!window.api) return
    const file = await window.api.selectFile([{ name: 'Audio Files', extensions: ['mp3'] }])
    if (file) {
      onSaveCustomBgMusic(file)
    }
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-blue-400">
        {t('settings.audio.title')}
      </h3>
      <div className="rounded-lg bg-white/5 p-4">
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center gap-2 text-sm font-bold text-white">
            {isMuted ? <FaVolumeMute className="text-red-400" /> : <FaVolumeUp />}
            {t('settings.audio.controls')}
          </label>
          <button
            onClick={() => onMuteToggle(!isMuted)}
            className={`text-xs font-bold px-2 py-1 rounded ${isMuted ? 'bg-red-500 text-white' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
          >
            {isMuted ? t('settings.audio.muted') : t('settings.audio.mute_all')}
          </button>
        </div>

        {/* Music Slider */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>{t('settings.audio.music')}</span>
            <span>{Math.round(bgMusicVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={bgMusicVolume}
            onChange={(e) => onBgMusicVolumeChange(parseFloat(e.target.value))}
            disabled={isMuted}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
          />
        </div>

        {/* SFX Slider */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span>{t('settings.audio.sfx')}</span>
            <span>{Math.round(sfxVolume * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={sfxVolume}
            onChange={(e) => onSfxVolumeChange(parseFloat(e.target.value))}
            disabled={isMuted}
            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-orange-500 disabled:opacity-50"
          />
        </div>

        {/* Custom Music Selection */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center justify-between text-xs text-white/60 mb-2">
            <span className="flex items-center gap-2">
              <FaMusic className="text-blue-400" /> {t('settings.audio.bg_music')}
            </span>
            {customBgMusicPath && (
              <button
                onClick={() => onSaveCustomBgMusic(undefined)}
                className="flex items-center gap-1 text-white/50 hover:text-white"
              >
                <FaUndo className="text-[10px]" /> {t('settings.audio.reset')}
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div
              className="flex-1 truncate rounded bg-black/20 px-3 py-2 text-sm text-white border border-white/10 opacity-70"
              title={customBgMusicPath || t('settings.audio.default_theme')}
            >
              {customBgMusicPath
                ? customBgMusicPath.split(/[\/]/).pop()
                : t('settings.audio.default_theme')}
            </div>
            <button
              onClick={handleSelectMusic}
              className="flex items-center gap-2 rounded bg-white/10 px-3 text-white hover:bg-blue-600 transition-colors"
              title="Select .mp3 file"
            >
              <FaFolderOpen />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}