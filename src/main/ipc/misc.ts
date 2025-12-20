/**
 * @fileoverview IPC handlers for miscellaneous system operations.
 * @module main/ipc/misc
 */

import { ipcMain, app } from 'electron'
import { exec } from 'child_process'
import { setDiscordActivity } from '../discord'

/** Registers IPC handlers for app version and system power controls. */
export function registerMiscHandlers(): void {
  ipcMain.removeHandler('get-app-version')
  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  ipcMain.removeHandler('discord-update-status')
  ipcMain.handle('discord-update-status', (_, status: string) => {
    setDiscordActivity('Browsing Library', status)
  })

  ipcMain.removeHandler('system-shutdown')
  ipcMain.handle('system-shutdown', () => {
    exec('shutdown /s /t 0')
  })

  ipcMain.removeHandler('system-restart')
  ipcMain.handle('system-restart', () => {
    exec('shutdown /r /t 0')
  })

  ipcMain.removeHandler('system-sleep')
  ipcMain.handle('system-sleep', () => {
    exec('rundll32.exe powrprof.dll,SetSuspendState 0,1,0')
  })
}
