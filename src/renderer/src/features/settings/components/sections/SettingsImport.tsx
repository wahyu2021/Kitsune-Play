/**
 * @fileoverview Steam library import settings section.
 * @module renderer/features/settings/components/sections/SettingsImport
 */

import { useState } from 'react'
import { FaSteam } from 'react-icons/fa'
import { Game, SteamGame } from '@/features/library/types'
import { fetchGameMetadata, GameMetadata } from '@/services/rawg'
import { ModalType } from '@/components/ui'
import { useTranslation } from 'react-i18next'

interface SettingsImportProps {
  onImportGames: (games: Game[]) => void
  games: Game[]
  onShowAlert: (title: string, message: string, type: ModalType) => void
  onCloseParent: () => void
  apiKey: string
}

export default function SettingsImport({
  onImportGames,
  games,
  onShowAlert,
  onCloseParent,
  apiKey
}: SettingsImportProps): React.JSX.Element {
  const { t } = useTranslation()
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState('')

  const handleImportSteam = async (): Promise<void> => {
    if (!window.api) return
    setIsImporting(true)
    setImportStatus(t('import_status.selecting'))

    try {
      const steamPath = await window.api.selectFolder()
      if (!steamPath) {
        setIsImporting(false)
        setImportStatus('')
        return
      }

      setImportStatus(t('import_status.scanning'))
      const foundGames = (await window.api.scanSteamLibrary(steamPath)) as SteamGame[]

      if (foundGames.length === 0) {
        onShowAlert(t('alerts.no_games_title'), t('alerts.no_games_msg'), 'warning')
        setIsImporting(false)
        setImportStatus('')
        return
      }

      setImportStatus(t('import_status.found_filtering', { count: foundGames.length }))

      // Helper for duplicate detection
      const createSignature = (title: string, path: string): string =>
        `${title.trim().toLowerCase()}|${path.trim().toLowerCase()}`

      const existingSignatures = new Set(games.map((g) => createSignature(g.title, g.path_to_exe)))

      // Filter out duplicates BEFORE processing
      const uniqueSteamGames = foundGames.filter((sg) => {
        const exePath = sg.executablePath || `steam://rungameid/${sg.appId}`
        const sig = createSignature(sg.name, exePath)
        return !existingSignatures.has(sig)
      })

      const duplicateCount = foundGames.length - uniqueSteamGames.length

      if (uniqueSteamGames.length === 0) {
        onShowAlert(
          t('alerts.import_complete_title'),
          t('alerts.import_complete_msg', { count: foundGames.length, skipped: duplicateCount }),
          'info'
        )
        setIsImporting(false)
        setImportStatus('')
        return
      }

      setImportStatus(
        t('import_status.found_fetching', {
          count: uniqueSteamGames.length,
          skipped: duplicateCount
        })
      )

      const newGames: Game[] = []

      // Process in batches to avoid rate limits
      const BATCH_SIZE = 3
      for (let i = 0; i < uniqueSteamGames.length; i += BATCH_SIZE) {
        const batch = uniqueSteamGames.slice(i, i + BATCH_SIZE)
        setImportStatus(
          t('import_status.importing_batch', {
            current: i + 1,
            total: uniqueSteamGames.length,
            skipped: duplicateCount
          })
        )

        await Promise.all(
          batch.map(async (steamGame) => {
            if (!steamGame.appId) return

            let metadata: GameMetadata | null = null
            if (apiKey) {
              metadata = await fetchGameMetadata(steamGame.name, apiKey)
            }

            newGames.push({
              id: crypto.randomUUID(),
              title: steamGame.name,
              path_to_exe: steamGame.executablePath || `steam://rungameid/${steamGame.appId}`,
              executableName: steamGame.executablePath
                ? steamGame.executablePath.split(/[\\/]/).pop() || ''
                : '',
              cover_image: metadata?.cover_image || '',
              bg_image: metadata?.bg_image || '',
              description: metadata?.description || 'Imported from Steam',
              genre: metadata?.genre || 'Game',
              playtime: 0,
              lastPlayed: '',
              launchArgs: ''
            })
          })
        )

        // Small delay
        await new Promise((r) => setTimeout(r, 500))
      }

      onImportGames(newGames)
      onShowAlert(
        t('alerts.import_success_title'),
        t('alerts.import_success_msg', { count: newGames.length, skipped: duplicateCount }),
        'success'
      )
      onCloseParent()
    } catch (error: unknown) {
      console.error(error)
      const msg = error instanceof Error ? error.message : 'Unknown error'
      onShowAlert(t('alerts.import_failed_title'), t('alerts.import_failed_msg', { msg }), 'error')
    } finally {
      setIsImporting(false)
      setImportStatus('')
    }
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-green-400">
        {t('settings.import.title')}
      </h3>
      <div className="rounded-lg bg-white/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm font-bold text-white">
            <FaSteam className="text-white/60" /> {t('settings.import.steam')}
          </label>
        </div>
        <button
          onClick={handleImportSteam}
          disabled={isImporting}
          className="flex w-full items-center justify-center gap-2 rounded bg-white/10 py-2 text-sm font-bold text-white hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {isImporting ? <span className="animate-spin">⟳</span> : <FaSteam />}
          {isImporting ? t('settings.import.scanning') : t('settings.import.scan_btn')}
        </button>
        {importStatus && (
          <p className="mt-2 text-xs text-green-400 text-center animate-pulse">{importStatus}</p>
        )}
        <p className="mt-2 text-xs text-white/40">{t('settings.import.desc')}</p>
      </div>
    </div>
  )
}
