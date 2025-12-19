import { ipcMain } from 'electron'
import { scanSteamLibrary } from '../services/steamScanner'

export function registerScannerHandlers(): void {
  ipcMain.handle('scan-steam-library', async (_, steamPath: string) => {
    return await scanSteamLibrary(steamPath)
  })
}
