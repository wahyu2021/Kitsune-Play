import { FaGlobe } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

export default function SettingsGeneral(): React.JSX.Element {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string): void => {
    i18n.changeLanguage(lng)
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-white/50">
        {t('settings.title')}
      </h3>
      <div className="rounded-lg bg-white/5 p-4">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-bold text-white">
            <FaGlobe className="text-white/60" /> {t('settings.language')}
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => changeLanguage('en')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                i18n.language === 'en'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage('id')}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                i18n.language === 'id'
                  ? 'bg-red-500 text-white' // Merah Putih logic for ID
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              Indonesia
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
