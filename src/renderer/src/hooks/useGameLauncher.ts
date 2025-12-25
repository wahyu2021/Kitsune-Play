/**
 * @fileoverview Game launcher hook with playtime tracking.
 * @module renderer/hooks/useGameLauncher
 */

import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Game } from '@/features/library/types'
import { logger } from '@/utils/logger'
import { ToastType } from '@/components/ui/Toast'

interface UseGameLauncherProps {
  /** Function to update the playtime record in the library. */
  updateGamePlaytime: (id: string, duration: number) => void
  /** Function to display toast notifications. */
  showToast: (message: string, type: ToastType) => void
}

/**
 * Hook to manage game execution and session tracking.
 *
 * Handles the communication with the main process to launch executables,
 * tracks the duration of the play session, and prevents multiple games
 * from running simultaneously.
 *
 * @returns An object containing the currently playing game (if any) and the launch function.
 */
export function useGameLauncher({ updateGamePlaytime, showToast }: UseGameLauncherProps): {
  playingGame: Game | null
  launchGame: (game: Game) => Promise<void>
  stopGame: () => Promise<void>
} {
  const { t } = useTranslation()
  const [playingGame, setPlayingGame] = useState<Game | null>(null)

  const stopGame = useCallback(async () => {
    if (!playingGame) return
    logger.info('Game', `Stopping: ${playingGame.title}`)
    try {
      await window.api.terminateGame()
    } catch (err) {
      logger.error('Game', 'Failed to stop game', err)
      showToast('Failed to stop game', 'error')
    }
  }, [playingGame, showToast])

  const launchGame = useCallback(
    async (game: Game) => {
      if (playingGame) {
        showToast(t('launcher.playing_warning', { title: playingGame.title }), 'error')
        return
      }

      logger.info('Game', `Launching: ${game.title}`)
      showToast(t('launcher.launching', { title: game.title }), 'success')
      setPlayingGame(game)

      try {
        const duration = await window.api.launchGame(
          game.path_to_exe,
          game.title,
          game.launchArgs,
          game.executableName
        )

        logger.info('Game', `Session ended. Duration: ${duration} mins`)
        setPlayingGame(null)
        updateGamePlaytime(game.id, duration)

        if (duration > 0) {
          showToast(t('launcher.played', { duration }), 'info')
        }
      } catch (err) {
        logger.error('Game', 'Failed to launch game', err)
        setPlayingGame(null)
        const msg = err instanceof Error ? err.message : String(err)
        showToast(t('launcher.failed', { msg }), 'error')
      }
    },
    [playingGame, updateGamePlaytime, showToast, t]
  )

  return { playingGame, launchGame, stopGame }
}
