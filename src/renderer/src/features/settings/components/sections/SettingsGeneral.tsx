/**
 * @fileoverview General settings section with language selection.
 * @module renderer/features/settings/components/sections/SettingsGeneral
 */

import { FaGlobe } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { Dropdown } from '@/components/ui'

/** General settings section with language preference selection. */
export default function SettingsGeneral(): React.JSX.Element {
  const { t, i18n } = useTranslation()

  const changeLanguage = (lng: string): void => {
    i18n.changeLanguage(lng)
  }

  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Bahasa Indonesia', value: 'id' },
    { label: '日本語', value: 'ja' }
  ]

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
          <div className="w-48">
            <Dropdown options={languageOptions} value={i18n.language} onChange={changeLanguage} />
          </div>
        </div>
      </div>
    </div>
  )
}
