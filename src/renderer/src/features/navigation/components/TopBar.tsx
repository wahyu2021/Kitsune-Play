/**
 * @fileoverview Top navigation bar component.
 * Displays system info, time, user profile, and main navigation tabs.
 * @module renderer/features/navigation/components/TopBar
 */

import { useEffect, useState } from 'react'
import {
  FaGamepad,
  FaTv,
  FaCog,
  FaUserCircle,
  FaSearch,
  FaPlus,
  FaPowerOff,
  FaMinus
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Game } from '@/features/library'

interface TopBarProps {
  /** The current user's display name shown in the profile section. */
  userName: string
  /** The current user's avatar path. */
  avatar?: string
  /** The currently active navigation tab ('games' or 'media'). */
  activeTab: 'games' | 'media'
  /** Callback function when a tab is clicked. */
  onTabChange: (tab: 'games' | 'media') => void
  /** Opens the "Add Game" modal. */
  onOpenAddGame: () => void
  /** Opens the user profile modal. */
  onOpenProfile: () => void
  /** Opens the global settings modal. */
  onOpenSettings: () => void
  /** Opens the global search modal. */
  onOpenSearch: () => void
  /** Opens the power menu modal (shutdown/restart options). */
  onOpenPower: () => void
  /** The game object currently running, or null/undefined if idle. Used to display the "Playing" indicator. */
  playingGame?: Game | null
  activeRow?: number
  activeCol?: number
}

/**
 * Top navigation bar component.
 * Displays system info, time, user profile, and main navigation tabs.
 */
export default function TopBar({
  userName,
  avatar,
  activeTab,
  onTabChange,
  onOpenAddGame,
  onOpenProfile,
  onOpenSettings,
  onOpenSearch,
  onOpenPower,
  playingGame,
  activeRow = 2,
  activeCol = 0
}: TopBarProps): React.JSX.Element {
  const { t, i18n } = useTranslation()
  const [time, setTime] = useState<string>('')
  const [dateStr, setDateStr] = useState<string>('')
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date()
      setTime(
        now.toLocaleTimeString(i18n.language, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      )
      setDateStr(
        now.toLocaleDateString(i18n.language, {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit'
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 30000)
    return () => clearInterval(interval)
  }, [i18n.language])

  const getFocusClass = (index: number): string => {
    return activeRow === 0 && activeCol === index
      ? 'ring-2 ring-white scale-110 bg-white text-black'
      : ''
  }

  const getTabFocusClass = (index: number): string => {
    return activeRow === 0 && activeCol === index
      ? 'text-white scale-110 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
      : activeTab === (index === 0 ? 'games' : 'media')
        ? 'text-white'
        : 'text-white/50'
  }

  return (
    <header className="relative flex w-full items-center justify-between drop-shadow-lg px-2">
      {/* Left: Tabs with Sliding Animation */}
      <div className="flex items-center gap-10">
        {/* Games Tab (Index 0) */}
        <div
          onClick={() => onTabChange('games')}
          className={`relative flex cursor-pointer items-center gap-3 pb-2 transition-all duration-300 ${getTabFocusClass(0)}`}
        >
          <FaGamepad className="text-xl" />
          <span className="text-lg font-semibold tracking-wide">{t('navigation.games')}</span>
          {activeTab === 'games' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            />
          )}
        </div>

        {/* Media Tab (Index 1) */}
        <div
          onClick={() => onTabChange('media')}
          className={`relative flex cursor-pointer items-center gap-3 pb-2 transition-all duration-300 ${getTabFocusClass(1)}`}
        >
          <FaTv className="text-xl" />
          <span className="text-lg font-medium tracking-wide">{t('navigation.media')}</span>
          {activeTab === 'media' && (
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
            />
          )}
        </div>
      </div>

      {/* Right: System Info */}
      <div className="flex items-center gap-6 text-white">
        {/* Playing Indicator (Minimalist) */}
        {playingGame && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative flex h-10 w-10 cursor-help items-center justify-center rounded-full bg-green-500/10 border border-green-500/20 shadow-[0_0_10px_rgba(74,222,128,0.2)]"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <FaGamepad className="text-lg text-green-400 animate-pulse" />
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute top-12 right-0 w-max rounded-lg border border-white/10 bg-black/90 px-3 py-1.5 text-xs font-bold text-white shadow-xl backdrop-blur-md z-50 pointer-events-none"
                >
                  {t('launcher.playing_indicator', { title: playingGame.title })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Add Game Button (Index 2) */}
        <div
          onClick={onOpenAddGame}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white hover:text-black ${getFocusClass(2)}`}
          title={t('add_game.title_add')}
        >
          <FaPlus className="text-sm" />
        </div>

        {/* Search (Index 3) */}
        <div
          onClick={onOpenSearch}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-white/10 ${getFocusClass(3)}`}
          title={t('navigation.search')}
        >
          <FaSearch className="text-xl opacity-70 hover:opacity-100" />
        </div>

        {/* Settings (Index 4) */}
        <div
          onClick={onOpenSettings}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-all hover:bg-white/10 ${getFocusClass(4)}`}
          title={t('navigation.settings')}
        >
          <FaCog className="text-xl opacity-70 hover:opacity-100" />
        </div>

        {/* Time & Date */}
        <div className="flex flex-col items-end leading-tight mr-2">
          <span className="text-2xl font-light tabular-nums opacity-90">{time}</span>
          <span className="text-xs font-bold tracking-widest opacity-60 uppercase">{dateStr}</span>
        </div>

        {/* User Profile (Index 5) */}
        <div
          onClick={onOpenProfile}
          className={`flex cursor-pointer items-center gap-3 rounded-full bg-white/5 py-1 pl-4 pr-1 ring-1 ring-white/10 transition-all hover:bg-white/20 hover:ring-white/30 ${
            activeRow === 0 && activeCol === 5 ? 'ring-2 ring-white bg-white/20' : ''
          }`}
        >
          <span className="text-sm font-bold tracking-wide">{userName}</span>
          <div className="h-10 w-10 overflow-hidden rounded-full bg-black/20">
            {avatar ? (
              <img src={`file://${avatar}`} alt="Avatar" className="h-full w-full object-cover" />
            ) : (
              <FaUserCircle className="text-4xl opacity-90" />
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-white/20 mx-2"></div>

        {/* Window Controls (Minimize ignored for nav) */}
        <div
          onClick={() => window.api?.minimize()}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
        >
          <FaMinus />
        </div>

        {/* Power (Index 6) */}
        <div
          onClick={onOpenPower}
          className={`flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-red-400 hover:bg-red-500/20 hover:text-red-500 ${
            activeRow === 0 && activeCol === 6
              ? 'ring-2 ring-red-500 bg-red-500 text-white scale-110'
              : ''
          }`}
          title={t('navigation.power')}
        >
          <FaPowerOff />
        </div>
      </div>
    </header>
  )
}
