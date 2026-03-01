/**
 * @fileoverview Genre distribution chart using the shared AnimatedBar component.
 * @module renderer/features/statistics/components/GenreChart
 */

import { useTranslation } from 'react-i18next'
import { AnimatedBar } from '@/components/ui'
import { GenreDistribution } from '@/features/statistics/hooks/useStatistics'

/** Color palette for genre bars, cycles through for variety. */
const BAR_COLORS = [
  'bg-blue-500',
  'bg-purple-500',
  'bg-emerald-500',
  'bg-orange-500',
  'bg-red-500',
  'bg-cyan-500',
  'bg-pink-500',
  'bg-yellow-500'
]

interface GenreChartProps {
  data: GenreDistribution[]
}

/** Horizontal bar chart showing genre distribution. Uses AnimatedBar for each row. */
export default function GenreChart({ data }: GenreChartProps): React.JSX.Element {
  const { t } = useTranslation()
  const maxCount = data.length > 0 ? data[0].count : 0

  if (data.length === 0) {
    return <div className="py-4 text-center text-sm text-white/30">{t('stats.no_genre_data')}</div>
  }

  return (
    <div className="flex flex-col gap-3">
      {data.map((item, index) => (
        <AnimatedBar
          key={item.genre}
          label={item.genre}
          value={item.count}
          maxValue={maxCount}
          color={BAR_COLORS[index % BAR_COLORS.length]}
          suffix={`${item.count} ${item.count === 1 ? 'game' : 'games'}`}
          delay={index * 0.08}
        />
      ))}
    </div>
  )
}
