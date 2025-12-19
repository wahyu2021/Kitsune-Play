import { ipcMain, dialog } from 'electron'

export function registerDialogHandlers(): void {
  ipcMain.handle('open-file-dialog', async (_, filters: Electron.FileFilter[]) => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: filters
    })

    if (result.canceled) {
      return null
    } else {
      return result.filePaths[0]
    }
  })

  ipcMain.handle('open-folder-dialog', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    })

    if (result.canceled) {
      return null
    } else {
      return result.filePaths[0]
    }
  })
}
