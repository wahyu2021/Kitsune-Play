import { ipcMain, app } from 'electron'
import { exec } from 'child_process'
import { setDiscordActivity } from '../discord'

export function registerMiscHandlers(): void {
  ipcMain.removeHandler('get-app-version')
  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  ipcMain.removeHandler('discord-update-status')
  ipcMain.handle('discord-update-status', (_, status: string) => {
    // We assume the details are fixed or managed elsewhere, or we could pass them too.
    // For now, matching the logic: Browsing Library (details) - [Status] (state)
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
    // Windows Sleep command (Hibernate off recommended for true sleep, but strictly this triggers suspend)
    exec('rundll32.exe powrprof.dll,SetSuspendState 0,1,0')
  })
}
