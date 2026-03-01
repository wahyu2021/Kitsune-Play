/**
 * @fileoverview Top games by playtime chart using the shared AnimatedBar component.
 * @module renderer/features/statistics/components/TopGamesChart
 */

import { useTranslation } from 'react-i18next'
import { AnimatedBar } from '@/components/ui'
import { Game } from '@/features/library/types'
import { formatPlaytime } from '@/utils/format'

interface TopGamesChartProps {
  games: Game[]
}

/** Horizontal bar chart of top 5 games by playtime. Uses shared AnimatedBar and formatPlaytime. */
export default function TopGamesChart({ games }: TopGamesChartProps): React.JSX.Element {
  const { t } = useTranslation()
  const maxPlaytime = games.length > 0 ? games[0].playtime || 0 : 0

  if (games.length === 0) {
    return (
      <div className="py-4 text-center text-sm text-white/30">{t('stats.no_playtime_data')}</div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {games.map((game, index) => (
        <AnimatedBar
          key={game.id}
          label={game.title}
          value={game.playtime || 0}
          maxValue={maxPlaytime}
          color="bg-gradient-to-r from-blue-500 to-purple-500"
          suffix={formatPlaytime(game.playtime || 0)}
          icon={
            <img src={game.cover_image} alt={game.title} className="h-8 w-8 rounded object-cover" />
          }
          delay={index * 0.1}
        />
      ))}
    </div>
  )
}
