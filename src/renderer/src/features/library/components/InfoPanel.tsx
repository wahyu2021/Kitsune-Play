import { useState } from 'react'
import { motion } from 'framer-motion'
import { Game } from '@/features/library/types'
import { FaPlay, FaPen, FaTrash, FaClock, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa'
import GameDetailModal from './GameDetailModal'

interface InfoPanelProps {
  game: Game
  onPlay: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function InfoPanel({
  game,
  onPlay,
  onEdit,
  onDelete
}: InfoPanelProps): React.JSX.Element {
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Format playtime
  const hours = Math.floor((game.playtime || 0) / 60)
  const mins = (game.playtime || 0) % 60
  const timeString = hours > 0 ? `${hours}h ${mins}m` : `${mins}m`

  // Format last played
  const lastPlayedStr = game.lastPlayed
    ? new Date(game.lastPlayed).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    : 'Never'
  const genreList = (game.genre || 'Game').split(',')
  return (
    <>
      <div className="flex max-w-xl flex-col items-start gap-4">
        {/* Logo Game or Title */}
        <motion.h1
          key={game.title + 'title'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl"
        >
          {game.title}
        </motion.h1>

        {/* Metadata Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-start gap-3 text-xs font-bold uppercase tracking-wider text-white flex-col"
        >
          <div className="flex gap-2">
            {genreList.map((g, index) => (
              <span
                key={index}
                className="rounded border border-white/10 bg-black/40 px-2 py-1 backdrop-blur-md"
              >
                {g.trim()}
              </span>
            ))}
          </div>

          {/* Stats with Glass Background */}
          <div className="flex items-center gap-4 rounded-lg border border-white/5 bg-black/40 px-3 py-1 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <FaClock className="text-orange-400" /> <span>{timeString} Played</span>
            </div>
            <div className="h-3 w-[1px] bg-white/20"></div>
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-blue-400" /> <span>Last: {lastPlayedStr}</span>
            </div>
          </div>
        </motion.div>

        {/* Description */}
        <motion.div
          key={game.description + 'desc'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl backdrop-saturate-150"
        >
          <p className="line-clamp-3 text-lg text-white/90 drop-shadow-md">{game.description}</p>
        </motion.div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onPlay}
            className="flex items-center gap-3 rounded-full bg-white px-8 py-3 text-xl font-bold text-black transition-transform hover:scale-105"
          >
            <FaPlay /> Play Game
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,174,255,0.2)' }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDetailOpen(true)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors"
            title="Game Details"
          >
            <FaInfoCircle />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onEdit}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors"
            title="Edit Game"
          >
            <FaPen />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(220, 38, 38, 0.8)' }}
            whileTap={{ scale: 0.9 }}
            onClick={onDelete}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:text-white"
            title="Delete Game"
          >
            <FaTrash />
          </motion.button>
        </div>
      </div>

      <GameDetailModal isOpen={isDetailOpen} onClose={() => setIsDetailOpen(false)} game={game} />
    </>
  )
}
