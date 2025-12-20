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
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface TopBarProps {
  userName: string
  activeTab: 'games' | 'media'
  onTabChange: (tab: 'games' | 'media') => void
  onOpenAddGame: () => void
  onOpenProfile: () => void
  onOpenSettings: () => void
  onOpenSearch: () => void
  onOpenPower: () => void
}

export default function TopBar({
  userName,
  activeTab,
  onTabChange,
  onOpenAddGame,
  onOpenProfile,
  onOpenSettings,
  onOpenSearch,
  onOpenPower
}: TopBarProps): React.JSX.Element {
  const { t, i18n } = useTranslation()
  const [time, setTime] = useState<string>('')
  const [dateStr, setDateStr] = useState<string>('')

  useEffect(() => {
    const updateTime = (): void => {
      const now = new Date()
      // Time: 20:45
      setTime(
        now.toLocaleTimeString(i18n.language, {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        })
      )
      // Date: Sun 07/12
      setDateStr(
        now.toLocaleDateString(i18n.language, {
          weekday: 'short',
          day: '2-digit',
          month: '2-digit'
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 30000) // Update every 30s
    return () => clearInterval(interval)
  }, [i18n.language]) // Update when language changes

  return (
    <header className="flex w-full items-center justify-between drop-shadow-lg px-2">
      {/* Left: Tabs with Sliding Animation */}
      <div className="flex items-center gap-10">
        {/* Games Tab */}
        <div
          onClick={() => onTabChange('games')}
          className={`relative flex cursor-pointer items-center gap-3 pb-2 transition-colors ${activeTab === 'games' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
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

        {/* Media Tab */}
        <div
          onClick={() => onTabChange('media')}
          className={`relative flex cursor-pointer items-center gap-3 pb-2 transition-colors ${activeTab === 'media' ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
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
        {/* Add Game Button (Dedicated) */}
        <div
          onClick={onOpenAddGame}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white hover:text-black"
          title={t('add_game.title_add')}
        >
          <FaPlus className="text-sm" />
        </div>

        <div
          onClick={onOpenSearch}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-bg hover:bg-white/10"
          title={t('navigation.search')}
        >
          <FaSearch className="text-xl opacity-70 hover:opacity-100" />
        </div>

        <div
          onClick={onOpenSettings}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full transition-bg hover:bg-white/10"
          title={t('navigation.settings')}
        >
          <FaCog className="text-xl opacity-70 hover:opacity-100" />
        </div>

        {/* Time & Date */}
        <div className="flex flex-col items-end leading-tight mr-2">
          <span className="text-2xl font-light tabular-nums opacity-90">{time}</span>
          <span className="text-xs font-bold tracking-widest opacity-60 uppercase">{dateStr}</span>
        </div>

        {/* User Profile */}
        <div
          onClick={onOpenProfile}
          className="flex cursor-pointer items-center gap-3 rounded-full bg-white/5 py-1 pl-4 pr-1 ring-1 ring-white/10 transition-all hover:bg-white/20 hover:ring-white/30"
        >
          <span className="text-sm font-bold tracking-wide">{userName}</span>
          <FaUserCircle className="text-4xl opacity-90" />
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-white/20 mx-2"></div>

        {/* Window Controls */}
        <div
          onClick={() => window.api?.minimize()}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-white/50 hover:bg-white/10 hover:text-white"
        >
          <FaMinus />
        </div>
        <div
          onClick={onOpenPower}
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-red-400 hover:bg-red-500/20 hover:text-red-500"
          title={t('navigation.power')}
        >
          <FaPowerOff />
        </div>
      </div>
    </header>
  )
}
