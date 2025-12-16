import { useState, useCallback } from 'react'
import { Game } from '@/features/library/types'
import { logger } from '@/utils/logger'
import { ToastType } from '@/components/ui/Toast'

interface UseGameLauncherProps {
  updateGamePlaytime: (id: string, duration: number) => void
  showToast: (message: string, type: ToastType) => void
}

export function useGameLauncher({ updateGamePlaytime, showToast }: UseGameLauncherProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const launchGame = useCallback(
    async (game: Game) => {
      logger.info('Game', `Launching: ${game.title}`)
      showToast(`Launching ${game.title}...`, 'success')
      setIsPlaying(true)

      try {
        const duration = await window.api.launchGame(
          game.path_to_exe,
          game.title,
          game.launchArgs,
          game.executableName
        )

        logger.info('Game', `Session ended. Duration: ${duration} mins`)
        setIsPlaying(false)
        updateGamePlaytime(game.id, duration)

        if (duration > 0) {
          showToast(`Played for ${duration} mins`, 'info')
        }
      } catch (err) {
        logger.error('Game', 'Failed to launch game', err)
        setIsPlaying(false)
        const msg = err instanceof Error ? err.message : String(err)
        showToast(`Failed: ${msg}`, 'error')
      }
    },
    [updateGamePlaytime, showToast]
  )

  return { isPlaying, launchGame }
}
