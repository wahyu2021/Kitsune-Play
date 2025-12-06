import { motion } from 'framer-motion'
import { Game } from '../types'
import { FaPlay, FaPen, FaTrash } from 'react-icons/fa'

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
  return (
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
        className="flex gap-3 text-xs font-bold uppercase tracking-wider text-white"
      >
        <span className="rounded bg-white/20 px-2 py-1 backdrop-blur-md">PS5</span>
        <span className="rounded bg-white/20 px-2 py-1 backdrop-blur-md">
          {game.genre || 'Game'}
        </span>
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
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.2)' }}
          whileTap={{ scale: 0.9 }}
          onClick={onEdit}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors"
          title="Edit Game"
        >
          <FaPen />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: 'rgba(220, 38, 38, 0.8)' }} // Red on hover
          whileTap={{ scale: 0.9 }}
          onClick={onDelete}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:text-white"
          title="Delete Game"
        >
          <FaTrash />
        </motion.button>
      </div>
    </div>
  )
}
