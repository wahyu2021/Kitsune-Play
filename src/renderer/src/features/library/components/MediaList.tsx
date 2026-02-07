/**
 * @fileoverview Grid-based media app list component.
 * App-drawer style layout with rows and columns like mobile home screen.
 * @module renderer/features/library/components/MediaList
 */

import { Game } from '@/features/library/types'
import MediaCard from './MediaCard'
import { FaCode } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

interface MediaListProps {
  apps: Game[]
  selectedAppId: string
  onSelectApp: (id: string) => void
}

/** Grid-style app drawer displaying media app icons in rows and columns. */
export default function MediaList({
  apps,
  selectedAppId,
  onSelectApp
}: MediaListProps): React.JSX.Element {
  const { t } = useTranslation()

  if (apps.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 text-white/30">
        <FaCode className="text-6xl" />
        <p className="text-xl font-medium">{t('library.empty_title')}</p>
        <p className="text-sm">{t('library.empty_desc')}</p>
      </div>
    )
  }

  return (
    <div className="h-full w-full flex items-center justify-center">
      <div className="custom-scrollbar grid grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-6 p-8 max-h-[80vh] overflow-y-auto">
        {apps.map((app) => (
          <MediaCard
            key={app.id}
            app={app}
            isActive={app.id === selectedAppId}
            onSelect={onSelectApp}
          />
        ))}
      </div>
    </div>
  )
}
