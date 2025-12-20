import { useState } from 'react'
import { FaSteam } from 'react-icons/fa'
import { Game, SteamGame } from '@/features/library/types'
import { fetchGameMetadata, GameMetadata } from '@/services/rawg'
import { ModalType } from '@/components/ui'

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
  const [isImporting, setIsImporting] = useState(false)
  const [importStatus, setImportStatus] = useState('')

  const handleImportSteam = async (): Promise<void> => {
    if (!window.api) return
    setIsImporting(true)
    setImportStatus('Selecting Steam folder...')

    try {
      const steamPath = await window.api.selectFolder()
      if (!steamPath) {
        setIsImporting(false)
        setImportStatus('')
        return
      }

      setImportStatus('Scanning library...')
      const foundGames = (await window.api.scanSteamLibrary(steamPath)) as SteamGame[]

      if (foundGames.length === 0) {
        onShowAlert(
          'No Games Found',
          'No Steam games found in the selected folder.\nEnsure you selected the root Steam folder (e.g., C:/Program Files/Steam).',
          'warning'
        )
        setIsImporting(false)
        setImportStatus('')
        return
      }

      setImportStatus(`Found ${foundGames.length} games. Filtering duplicates...`)

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
          'Import Complete',
          `Found ${foundGames.length} games, but they are all already in your library.\n\nSkipped ${duplicateCount} duplicates.`,
          'info'
        )
        setIsImporting(false)
        setImportStatus('')
        return
      }

      setImportStatus(
        `Found ${uniqueSteamGames.length} new games (${duplicateCount} skipped). Fetching metadata...`
      )

      const newGames: Game[] = []

      // Process in batches to avoid rate limits
      const BATCH_SIZE = 3
      for (let i = 0; i < uniqueSteamGames.length; i += BATCH_SIZE) {
        const batch = uniqueSteamGames.slice(i, i + BATCH_SIZE)
        setImportStatus(
          `Importing ${i + 1} / ${uniqueSteamGames.length} (Skipped ${duplicateCount} dupe)...`
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
        'Import Successful',
        `Imported ${newGames.length} new games!\n\n${duplicateCount} duplicates were skipped.`,
        'success'
      )
      onCloseParent()
    } catch (error: unknown) {
      console.error(error)
      const msg = error instanceof Error ? error.message : 'Unknown error'
      onShowAlert('Import Failed', `${msg}. Try restarting the app.`, 'error')
    } finally {
      setIsImporting(false)
      setImportStatus('')
    }
  }

  return (
    <div>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-green-400">
        Library Import
      </h3>
      <div className="rounded-lg bg-white/5 p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="flex items-center gap-2 text-sm font-bold text-white">
            <FaSteam className="text-white/60" /> Steam Import
          </label>
        </div>
        <button
          onClick={handleImportSteam}
          disabled={isImporting}
          className="flex w-full items-center justify-center gap-2 rounded bg-white/10 py-2 text-sm font-bold text-white hover:bg-green-600 transition-colors disabled:opacity-50"
        >
          {isImporting ? <span className="animate-spin">⟳</span> : <FaSteam />}
          {isImporting ? 'Scanning...' : 'Scan Steam Library'}
        </button>
        {importStatus && (
          <p className="mt-2 text-xs text-green-400 text-center animate-pulse">{importStatus}</p>
        )}
        <p className="mt-2 text-xs text-white/40">
          Select your main Steam folder (e.g. C:/Program Files/Steam). Metadata will be fetched via
          RAWG.
        </p>
      </div>
    </div>
  )
}
