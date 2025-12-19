import { useState, useEffect, useRef } from 'react'
import { Game, AppData } from '@/features/library/types'
import { AppSettings } from '@/features/settings/types'
import { getInitialGamesData } from '@/config'
import { logger } from '@/utils/logger'

interface UsePersistenceProps {
  games: Game[]
  mediaApps: Game[]
  userName: string
  settings: AppSettings
  setGames: (games: Game[]) => void
  setMediaApps: (apps: Game[]) => void
  setUserName: (name: string) => void
  setSettings: (settings: AppSettings) => void
}

export function usePersistence({
  games,
  mediaApps,
  userName,
  settings,
  setGames,
  setMediaApps,
  setUserName,
  setSettings
}: UsePersistenceProps): { isLoaded: boolean } {
  const isLoaded = useRef(false)
  const [hasLoadedInitial, setHasLoadedInitial] = useState(false)

  // Load Data
  useEffect(() => {
    const initData = async (): Promise<void> => {
      const initialDefaults = getInitialGamesData()

      if (!window.api) {
        logger.warn('System', 'Electron API not found. Mock data.')
        setGames(initialDefaults)
        setUserName('Player 1')
        isLoaded.current = true
        setHasLoadedInitial(true)
        return
      }

      const savedData = await window.api.loadData()

      if (savedData) {
        try {
          const parsed: AppData = JSON.parse(savedData)
          setGames(parsed.games || [])
          setMediaApps(parsed.mediaApps || [])
          const loadedName = parsed.userName
          logger.info('System', `Loaded Name: "${loadedName}"`)
          setUserName(loadedName || 'Player 1')

          const defaultSettings: AppSettings = {
            rawgApiKey: '',
            bgMusicVolume: 0.3,
            sfxVolume: 0.8,
            isMuted: false,
            weather: {
              city: 'Jakarta',
              latitude: -6.2088,
              longitude: 106.8456,
              unit: 'celsius'
            }
          }
          setSettings({ ...defaultSettings, ...(parsed.settings || {}) })
        } catch (e) {
          logger.error('System', 'Failed to parse saved data', e)
          setGames(initialDefaults)
          setUserName('Player 1')
        }
      } else {
        setGames(initialDefaults)
        setUserName('Player 1')
      }
      isLoaded.current = true
      setHasLoadedInitial(true)
    }
    initData()
  }, [setGames, setMediaApps, setUserName, setSettings]) // Empty dependency array = run once on mount

  // Save Data
  useEffect(() => {
    if (!isLoaded.current) return

    const saveData = async (): Promise<void> => {
      if (!window.api) return
      const dataToSave: AppData = { games, mediaApps, userName, settings }
      await window.api.saveData(JSON.stringify(dataToSave))
    }

    const timeout = setTimeout(saveData, 1000)
    return () => clearTimeout(timeout)
  }, [games, mediaApps, userName, settings])

  return { isLoaded: hasLoadedInitial }
}
