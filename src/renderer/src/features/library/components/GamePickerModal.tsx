/**
 * @fileoverview Random game picker modal with spin animation.
 * Uses FullScreenModal base and Dropdown reusable component.
 * @module renderer/features/library/components/GamePickerModal
 */

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaDice, FaPlay, FaRedo } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

import { Game } from '@/features/library/types'
import { useGamePicker } from '@/features/library/hooks/useGamePicker'
import { FullScreenModal, Dropdown } from '@/components/ui'
import { formatPlaytime } from '@/utils/format'

interface GamePickerModalProps {
  isOpen: boolean
  onClose: () => void
  games: Game[]
  onPlay: (game: Game) => void
}

/** Modal that randomly picks a game from the user's library with a spin animation. */
export default function GamePickerModal({
  isOpen,
  onClose,
  games,
  onPlay
}: GamePickerModalProps): React.JSX.Element {
  const { t } = useTranslation()
  const { genres, selectedGenre, setSelectedGenre, pickedGame, isSpinning, spin, reset } =
    useGamePicker()

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) reset()
  }, [isOpen, reset])

  const genreOptions = [
    { label: t('picker.all_genres'), value: '' },
    ...genres.map((g) => ({ label: g, value: g }))
  ]

  const handleSpin = (): void => {
    spin(games)
  }

  const handlePlayPicked = (): void => {
    if (pickedGame) {
      onPlay(pickedGame)
      onClose()
    }
  }

  return (
    <FullScreenModal
      isOpen={isOpen}
      onClose={onClose}
      title={t('picker.title')}
      maxWidth="max-w-lg"
    >
      <div className="flex flex-col items-center gap-6">
        {/* Genre Filter */}
        <div className="w-full">
          <label className="mb-2 block text-sm font-medium text-white/60">
            {t('picker.filter_genre')}
          </label>
          <Dropdown
            options={genreOptions}
            value={selectedGenre}
            onChange={setSelectedGenre}
            placeholder={t('picker.all_genres')}
          />
        </div>

        {/* Spin Area */}
        <div className="flex w-full min-h-[280px] items-center justify-center rounded-xl border border-white/5 bg-white/5 p-6">
          <AnimatePresence mode="wait">
            {isSpinning ? (
              <motion.div
                key="spinning"
                initial={{ opacity: 0, rotate: -10 }}
                animate={{ opacity: 1, rotate: [0, 10, -10, 5, -5, 0] }}
                transition={{ duration: 1, repeat: Infinity, repeatDelay: 0 }}
                className="flex flex-col items-center gap-3"
              >
                <FaDice className="text-6xl text-white/60" />
                <span className="text-sm font-bold uppercase tracking-widest text-white/40">
                  {t('picker.spinning')}
                </span>
              </motion.div>
            ) : pickedGame ? (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="flex w-full flex-col items-center gap-4"
              >
                {/* Cover Image */}
                <div className="relative">
                  <motion.div
                    className="absolute -inset-2 rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-xl"
                    animate={{ opacity: [0.4, 0.8, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <img
                    src={pickedGame.cover_image}
                    alt={pickedGame.title}
                    className="relative h-40 w-28 rounded-xl object-cover shadow-2xl ring-2 ring-white/20"
                  />
                </div>

                {/* Game Info */}
                <div className="text-center">
                  <h3 className="text-xl font-bold text-white">{pickedGame.title}</h3>
                  <p className="text-sm text-white/50">{pickedGame.genre}</p>
                  <p className="mt-1 text-xs text-white/30">
                    {formatPlaytime(pickedGame.playtime || 0)} {t('library.played')}
                  </p>
                </div>

                {/* Play Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePlayPicked}
                  className="flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black"
                >
                  <FaPlay />
                  {t('picker.play_now')}
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center gap-3 text-white/30"
              >
                <FaDice className="text-5xl" />
                <span className="text-sm">
                  {games.length > 0 ? t('picker.press_spin') : t('picker.no_games')}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Spin / Re-spin Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSpin}
          disabled={isSpinning || games.length === 0}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 text-sm font-bold text-white shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {pickedGame ? <FaRedo /> : <FaDice />}
          {pickedGame ? t('picker.spin_again') : t('picker.spin')}
        </motion.button>
      </div>
    </FullScreenModal>
  )
}
