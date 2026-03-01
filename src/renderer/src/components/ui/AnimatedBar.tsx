/**
 * @fileoverview Reusable animated horizontal bar component for charts.
 * Used by GenreChart and TopGamesChart to avoid duplicating bar rendering logic.
 * @module renderer/components/ui/AnimatedBar
 */

import { motion } from 'framer-motion'

interface AnimatedBarProps {
  /** Display label for the bar. */
  label: string
  /** Numeric value to calculate bar width. */
  value: number
  /** Maximum value in the dataset (used to scale the bar width). */
  maxValue: number
  /** Tailwind background color class (default: "bg-blue-500"). */
  color?: string
  /** Text displayed at the end of the bar (e.g., "12h 30m" or "5 games"). */
  suffix?: string
  /** Optional icon or thumbnail rendered before the label. */
  icon?: React.ReactNode
  /** Animation delay in seconds for staggered entry. */
  delay?: number
}

/** Animated horizontal bar with label, fill animation, and optional icon. */
export default function AnimatedBar({
  label,
  value,
  maxValue,
  color = 'bg-blue-500',
  suffix,
  icon,
  delay = 0
}: AnimatedBarProps): React.JSX.Element {
  const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0

  return (
    <div className="flex items-center gap-3">
      {icon && <div className="shrink-0">{icon}</div>}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-white/80 truncate">{label}</span>
          {suffix && <span className="text-xs text-white/50 shrink-0 ml-2">{suffix}</span>}
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            className={`h-full rounded-full ${color}`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay, ease: 'easeOut' }}
          />
        </div>
      </div>
    </div>
  )
}
