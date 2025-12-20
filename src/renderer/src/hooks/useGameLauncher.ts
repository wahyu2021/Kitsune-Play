import { useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Game } from '@/features/library/types'
import { logger } from '@/utils/logger'
import { ToastType } from '@/components/ui/Toast'

interface UseGameLauncherProps {
  updateGamePlaytime: (id: string, duration: number) => void
  showToast: (message: string, type: ToastType) => void
}

export function useGameLauncher({ updateGamePlaytime, showToast }: UseGameLauncherProps): {
  isPlaying: boolean
  launchGame: (game: Game) => Promise<void>
} {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)

  const launchGame = useCallback(
    async (game: Game) => {
      logger.info('Game', `Launching: ${game.title}`)
      showToast(t('launcher.launching', { title: game.title }), 'success')
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
          showToast(t('launcher.played', { duration }), 'info')
        }
      } catch (err) {
        logger.error('Game', 'Failed to launch game', err)
        setIsPlaying(false)
        const msg = err instanceof Error ? err.message : String(err)
        showToast(t('launcher.failed', { msg }), 'error')
      }
    },
    [updateGamePlaytime, showToast, t]
  )

  return { isPlaying, launchGame }
}