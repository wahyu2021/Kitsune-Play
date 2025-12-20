import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaClock, FaCalendarAlt, FaGamepad, FaTerminal, FaFolder } from 'react-icons/fa'
import { Game } from '@/features/library/types'
import { logger } from '@/utils/logger'
import LazyImage from '@/components/ui/LazyImage'
import { useTranslation } from 'react-i18next'

interface GameDetailModalProps {
  isOpen: boolean
  onClose: () => void
  game: Game
}

export default function GameDetailModal({
  isOpen,
  onClose,
  game
}: GameDetailModalProps): React.JSX.Element {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    if (isOpen) logger.debug('UI', `GameDetailModal opened for: ${game.title}`)
  }, [isOpen, game])

  // Format playtime
  const hours = Math.floor((game.playtime || 0) / 60)
  const mins = (game.playtime || 0) % 60
  const timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

  // Format last played
  const lastPlayedStr = game.lastPlayed
    ? new Date(game.lastPlayed).toLocaleDateString(i18n.language, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : t('library.never')

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative flex h-[80vh] w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black/80 shadow-2xl"
          >
            {/* Background Image (Blurred) */}
            <div className="absolute inset-0 z-0 opacity-20">
              <LazyImage
                src={game.bg_image}
                alt="Background"
                className="h-full w-full object-cover blur-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex h-full w-full flex-col p-8 md:flex-row gap-8">
              {/* Left Column: Cover Image */}
              <div className="flex-shrink-0 w-64 md:w-80">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="overflow-hidden rounded-xl border border-white/20 shadow-lg"
                >
                  <LazyImage
                    src={game.cover_image}
                    alt={game.title}
                    className="aspect-[2/3] w-full object-cover"
                  />
                </motion.div>
              </div>

              {/* Right Column: Details */}
              <div className="flex flex-1 flex-col overflow-y-auto pr-2 pt-1 custom-scrollbar">
                <div className="mb-6 flex items-start justify-between">
                  <motion.h2
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-black uppercase tracking-tighter text-white"
                  >
                    {game.title}
                  </motion.h2>
                  <motion.button
                    whileHover={{ scale: 1.1, backgroundColor: 'rgba(220, 38, 38, 0.8)' }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <FaTimes size={24} />
                  </motion.button>
                </div>

                {/* Genre Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="mb-6 flex flex-wrap gap-2"
                >
                  {game.genre.split(',').map((g, idx) => (
                    <span
                      key={idx}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white/80"
                    >
                      {g.trim()}
                    </span>
                  ))}
                </motion.div>

                {/* Stats Grid */}
                <div className="mb-8 grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-white/50">
                      <FaClock className="text-orange-400" /> {t('game_detail.playtime')}
                    </div>
                    <div className="text-xl font-bold text-white">{timeString}</div>
                  </div>
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4 backdrop-blur-sm">
                    <div className="mb-1 flex items-center gap-2 text-sm font-medium text-white/50">
                      <FaCalendarAlt className="text-blue-400" /> {t('game_detail.last_played')}
                    </div>
                    <div className="text-lg font-bold text-white">{lastPlayedStr}</div>
                  </div>
                </div>

                {/* Technical Details */}
                <div className="space-y-4 rounded-xl border border-white/5 bg-black/20 p-4">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FaFolder className="flex-shrink-0 text-white/40" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-bold uppercase text-white/40">
                        {t('game_detail.path')}
                      </span>
                      <span
                        className="truncate font-mono text-sm text-white/70"
                        title={game.path_to_exe}
                      >
                        {game.path_to_exe}
                      </span>
                    </div>
                  </div>

                  {game.launchArgs && (
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FaTerminal className="flex-shrink-0 text-white/40" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold uppercase text-white/40">
                          {t('game_detail.args')}
                        </span>
                        <span className="truncate font-mono text-sm text-white/70">
                          {game.launchArgs}
                        </span>
                      </div>
                    </div>
                  )}

                  {game.executableName && (
                    <div className="flex items-center gap-3 overflow-hidden">
                      <FaGamepad className="flex-shrink-0 text-white/40" />
                      <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold uppercase text-white/40">
                          {t('game_detail.process')}
                        </span>
                        <span className="truncate font-mono text-sm text-white/70">
                          {game.executableName}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mt-8 space-y-2">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white/50">
                    {t('game_detail.about')}
                  </h3>
                  <p className="whitespace-pre-wrap text-lg leading-relaxed text-white/90">
                    {game.description || t('game_detail.no_desc')}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}