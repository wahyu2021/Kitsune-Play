/**
 * @fileoverview IPC handlers for Steam library scanning.
 * @module main/ipc/scanner
 */

import { ipcMain } from 'electron'
import { scanSteamLibrary } from '../services/steamScanner'

/** Registers IPC handlers for game library scanning operations. */
export function registerScannerHandlers(): void {
  ipcMain.handle('scan-steam-library', async (_, steamPath: string) => {
    return await scanSteamLibrary(steamPath)
  })
}
