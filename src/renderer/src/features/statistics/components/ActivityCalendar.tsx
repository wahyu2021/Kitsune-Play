/**
 * @fileoverview GitHub-style activity calendar heatmap.
 * Renders the last 52 weeks of play activity as a color-coded grid.
 * @module renderer/features/statistics/components/ActivityCalendar
 */

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { formatPlaytime } from '@/utils/format'

interface ActivityCalendarProps {
  /** Aggregated daily activity: { "YYYY-MM-DD": totalMinutes }. */
  dailyActivity: Record<string, number>
}

/** Number of weeks to display. */
const WEEKS = 52
/** Days per week. */
const DAYS_PER_WEEK = 7

/** Intensity levels and their corresponding Tailwind classes. */
const INTENSITY_CLASSES = [
  'bg-white/5',
  'bg-emerald-900/60',
  'bg-emerald-700/70',
  'bg-emerald-500/80',
  'bg-emerald-400'
]

/**
 * Determines the color intensity level (0-4) based on minutes played.
 * @param minutes - Minutes played on a given day
 * @param maxMinutes - Maximum daily minutes across the dataset
 */
const getIntensityLevel = (minutes: number, maxMinutes: number): number => {
  if (minutes === 0 || maxMinutes === 0) return 0

  const ratio = minutes / maxMinutes
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

/**
 * Builds the grid data: an array of 52 weeks, each containing 7 day objects.
 * Days are ordered from oldest (top-left) to newest (bottom-right).
 */
const buildGridData = (
  dailyActivity: Record<string, number>
): { date: string; minutes: number }[][] => {
  const today = new Date()
  const grid: { date: string; minutes: number }[][] = []

  // Calculate the starting date (52 weeks ago, aligned to Sunday)
  const start = new Date(today)
  start.setDate(start.getDate() - (WEEKS * DAYS_PER_WEEK - 1) - start.getDay())

  for (let week = 0; week < WEEKS; week++) {
    const days: { date: string; minutes: number }[] = []
    for (let day = 0; day < DAYS_PER_WEEK; day++) {
      const current = new Date(start)
      current.setDate(start.getDate() + week * DAYS_PER_WEEK + day)
      const dateStr = current.toISOString().split('T')[0]
      const isFuture = current > today
      days.push({
        date: dateStr,
        minutes: isFuture ? -1 : dailyActivity[dateStr] || 0
      })
    }
    grid.push(days)
  }

  return grid
}

/** Month labels positioned above the calendar grid. */
const MONTH_LABELS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
]

const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', '']

/** GitHub-style activity heatmap showing daily play sessions over the past year. */
export default function ActivityCalendar({
  dailyActivity
}: ActivityCalendarProps): React.JSX.Element {
  const { t } = useTranslation()
  const [tooltip, setTooltip] = useState<{
    date: string
    minutes: number
    x: number
    y: number
  } | null>(null)

  const grid = useMemo(() => buildGridData(dailyActivity), [dailyActivity])

  const maxMinutes = useMemo(() => {
    let max = 0
    for (const week of grid) {
      for (const day of week) {
        if (day.minutes > max) max = day.minutes
      }
    }
    return max
  }, [grid])

  // Compute month label positions
  const monthPositions = useMemo(() => {
    const positions: { label: string; col: number }[] = []
    let lastMonth = -1

    for (let week = 0; week < grid.length; week++) {
      // Check the first day of each week
      const dateStr = grid[week][0].date
      const month = new Date(dateStr).getMonth()
      if (month !== lastMonth) {
        positions.push({ label: MONTH_LABELS[month], col: week })
        lastMonth = month
      }
    }
    return positions
  }, [grid])

  const totalDays = useMemo(() => {
    let count = 0
    for (const week of grid) {
      for (const day of week) {
        if (day.minutes > 0) count++
      }
    }
    return count
  }, [grid])

  return (
    <div className="flex flex-col gap-2">
      {/* Month Labels */}
      <div className="flex pl-8">
        {monthPositions.map((mp, i) => (
          <span
            key={i}
            className="text-[10px] text-white/40"
            style={{
              position: 'relative',
              left: `${mp.col * 14}px`,
              marginRight:
                i < monthPositions.length - 1
                  ? `${(monthPositions[i + 1].col - mp.col) * 14 - 24}px`
                  : '0'
            }}
          >
            {mp.label}
          </span>
        ))}
      </div>

      {/* Grid */}
      <div className="flex gap-0.5">
        {/* Day Labels */}
        <div className="flex flex-col gap-0.5 pr-1">
          {DAY_LABELS.map((label, i) => (
            <span key={i} className="h-[12px] text-[9px] leading-[12px] text-white/30">
              {label}
            </span>
          ))}
        </div>

        {/* Cells */}
        <div className="relative flex gap-[3px]">
          {grid.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day, dayIndex) => {
                if (day.minutes < 0) {
                  // Future date — render empty placeholder
                  return <div key={dayIndex} className="h-[12px] w-[12px]" />
                }

                const level = getIntensityLevel(day.minutes, maxMinutes)
                return (
                  <motion.div
                    key={dayIndex}
                    className={`h-[12px] w-[12px] rounded-[2px] ${INTENSITY_CLASSES[level]} cursor-pointer transition-all hover:ring-1 hover:ring-white/30`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: weekIndex * 0.005 }}
                    onMouseEnter={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect()
                      setTooltip({
                        date: day.date,
                        minutes: day.minutes,
                        x: rect.left,
                        y: rect.top
                      })
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                )
              })}
            </div>
          ))}

          {/* Tooltip */}
          {tooltip && (
            <div
              className="pointer-events-none fixed z-[100] rounded-lg border border-white/10 bg-[#222] px-3 py-2 text-xs text-white shadow-xl"
              style={{ left: tooltip.x - 40, top: tooltip.y - 50 }}
            >
              <div className="font-bold">
                {tooltip.minutes > 0 ? formatPlaytime(tooltip.minutes) : t('stats.no_activity')}
              </div>
              <div className="text-white/50">{tooltip.date}</div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-xs text-white/40">
          {totalDays} {t('stats.active_days')}
        </span>
        <div className="flex items-center gap-1 text-[10px] text-white/40">
          <span>{t('stats.less')}</span>
          {INTENSITY_CLASSES.map((cls, i) => (
            <div key={i} className={`h-[10px] w-[10px] rounded-[2px] ${cls}`} />
          ))}
          <span>{t('stats.more')}</span>
        </div>
      </div>
    </div>
  )
}
