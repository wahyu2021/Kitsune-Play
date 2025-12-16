import { motion, AnimatePresence } from 'framer-motion'
import { FaSearch, FaGamepad } from 'react-icons/fa'
import { useState, useEffect, useRef } from 'react'
import { Game } from '@/features/library/types'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  games: Game[]
  onSelectGame: (gameId: string) => void
}

export default function SearchModal({
  isOpen,
  onClose,
  games,
  onSelectGame
}: SearchModalProps): React.JSX.Element {
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setQuery('')
    }
  }, [isOpen])

  const filteredGames = games.filter(
    (g) =>
      g.title.toLowerCase().includes(query.toLowerCase()) ||
      g.genre.toLowerCase().includes(query.toLowerCase())
  )

  const handleSelect = (id: string): void => {
    onSelectGame(id)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-white/20 bg-[#1a1a1a] shadow-2xl"
          >
            {/* Search Input Header */}
            <div className="flex items-center gap-4 border-b border-white/10 px-6 py-4">
              <FaSearch className="text-xl text-white/50" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search games..."
                className="flex-1 bg-transparent text-xl font-medium text-white placeholder-white/30 focus:outline-none"
              />
              <button onClick={onClose} className="text-white/50 hover:text-white">
                <span className="text-xs font-bold uppercase tracking-wider border border-white/20 px-2 py-1 rounded">
                  ESC
                </span>
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2">
              {filteredGames.length > 0 ? (
                <div className="flex flex-col gap-1">
                  {filteredGames.map((game) => (
                    <div
                      key={game.id}
                      onClick={() => handleSelect(game.id)}
                      className="flex cursor-pointer items-center gap-4 rounded-xl p-3 transition-colors hover:bg-white/10"
                    >
                      <img
                        src={game.cover_image}
                        alt={game.title}
                        className="h-12 w-12 rounded object-cover"
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-white">{game.title}</span>
                        <span className="text-xs text-white/50">{game.genre}</span>
                      </div>
                      <FaGamepad className="ml-auto text-white/20" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center text-white/40">
                  No games found matching &quot;{query}&quot;
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
