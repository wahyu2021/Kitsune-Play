import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      launchGame: (path: string) => Promise<number>
      selectFile: (filters: Electron.FileFilter[]) => Promise<string | null>
      loadData: () => Promise<string | null>
      saveData: (data: string) => Promise<boolean>
      getAppVersion: () => Promise<string>
      minimize: () => void
      quit: () => void
    }
  }
}
