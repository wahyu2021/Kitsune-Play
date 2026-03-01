/**
 * @fileoverview Reusable stat card with icon, label, and animated value.
 * @module renderer/features/statistics/components/StatCard
 */

import { motion } from 'framer-motion'
import { IconType } from 'react-icons'

interface StatCardProps {
  /** Icon component from react-icons. */
  icon: IconType
  /** Short label describing the stat. */
  label: string
  /** Display value (pre-formatted). */
  value: string | number
  /** Tailwind color class for the icon (e.g., "text-blue-400"). */
  iconColor?: string
  /** Animation delay in seconds. */
  delay?: number
}

/** Glassmorphism stat card with animated entry. */
export default function StatCard({
  icon: Icon,
  label,
  value,
  iconColor = 'text-blue-400',
  delay = 0
}: StatCardProps): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
    >
      <div className="flex items-center gap-2">
        <Icon className={`text-lg ${iconColor}`} />
        <span className="text-xs font-medium uppercase tracking-wider text-white/50">{label}</span>
      </div>
      <span className="text-2xl font-bold text-white">{value}</span>
    </motion.div>
  )
}
