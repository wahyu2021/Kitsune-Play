import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      launchGame: (
        path: string,
        name: string,
        launchArgs?: string,
        executableName?: string
      ) => Promise<number>
      updateDiscordStatus: (status: string) => Promise<void>
      selectFile: (filters: Electron.FileFilter[]) => Promise<string | null>
      loadData: () => Promise<string | null>
      saveData: (data: string) => Promise<boolean>
      getAppVersion: () => Promise<string>
      minimize: () => void
      quit: () => void
    }
  }
}
