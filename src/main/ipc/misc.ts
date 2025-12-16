import { ipcMain, app } from 'electron'
import { exec } from 'child_process'

export function registerMiscHandlers(): void {
  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  ipcMain.handle('system-shutdown', () => {
    exec('shutdown /s /t 0')
  })

  ipcMain.handle('system-restart', () => {
    exec('shutdown /r /t 0')
  })

  ipcMain.handle('system-sleep', () => {
    // Windows Sleep command (Hibernate off recommended for true sleep, but strictly this triggers suspend)
    exec('rundll32.exe powrprof.dll,SetSuspendState 0,1,0')
  })
}
