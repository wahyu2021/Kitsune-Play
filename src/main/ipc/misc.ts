import { ipcMain, app } from 'electron'

export function registerMiscHandlers(): void {
  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })
}
