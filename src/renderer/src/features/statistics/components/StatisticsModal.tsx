/**
 * @fileoverview Main statistics dashboard modal.
 * Composes all stat sub-components into a single scrollable view.
 * Uses FullScreenModal as the base wrapper — no duplicated modal boilerplate.
 * @module renderer/features/statistics/components/StatisticsModal
 */

import { useTranslation } from 'react-i18next'
import { FaGamepad, FaClock, FaTrophy, FaChartBar, FaStar, FaEyeSlash } from 'react-icons/fa'

import { Game } from '@/features/library/types'
import { FullScreenModal } from '@/components/ui'
import { useStatistics } from '@/features/statistics/hooks/useStatistics'
import StatCard from './StatCard'
import GenreChart from './GenreChart'
import TopGamesChart from './TopGamesChart'
import ActivityCalendar from './ActivityCalendar'

interface StatisticsModalProps {
  isOpen: boolean
  onClose: () => void
  games: Game[]
}

/** Full statistics dashboard modal showing library metrics, charts, and activity calendar. */
export default function StatisticsModal({
  isOpen,
  onClose,
  games
}: StatisticsModalProps): React.JSX.Element {
  const { t } = useTranslation()
  const stats = useStatistics(games)

  return (
    <FullScreenModal isOpen={isOpen} onClose={onClose} title={t('stats.title')}>
      <div className="flex flex-col gap-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <StatCard
            icon={FaGamepad}
            label={t('stats.total_games')}
            value={stats.totalGames}
            iconColor="text-blue-400"
            delay={0}
          />
          <StatCard
            icon={FaClock}
            label={t('stats.total_hours')}
            value={stats.totalPlaytimeFormatted}
            iconColor="text-orange-400"
            delay={0.1}
          />
          <StatCard
            icon={FaTrophy}
            label={t('stats.most_played')}
            value={stats.mostPlayedGame?.title || '-'}
            iconColor="text-yellow-400"
            delay={0.2}
          />
          <StatCard
            icon={FaChartBar}
            label={t('stats.avg_session')}
            value={stats.averageSessionFormatted}
            iconColor="text-emerald-400"
            delay={0.3}
          />
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            icon={FaStar}
            label={t('stats.favorites')}
            value={stats.favoriteCount}
            iconColor="text-yellow-400"
            delay={0.4}
          />
          <StatCard
            icon={FaEyeSlash}
            label={t('stats.unplayed')}
            value={stats.unplayedCount}
            iconColor="text-white/40"
            delay={0.5}
          />
        </div>

        {/* Genre Distribution */}
        <section>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/50">
            {t('stats.genre_distribution')}
          </h3>
          <GenreChart data={stats.genreDistribution} />
        </section>

        {/* Top Games by Playtime */}
        <section>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/50">
            {t('stats.top_games')}
          </h3>
          <TopGamesChart games={stats.topGames} />
        </section>

        {/* Activity Calendar */}
        <section>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-white/50">
            {t('stats.activity')}
          </h3>
          <ActivityCalendar dailyActivity={stats.dailyActivity} />
        </section>
      </div>
    </FullScreenModal>
  )
}
