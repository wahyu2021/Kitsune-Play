import { ipcMain, app } from 'electron'
import fs from 'fs/promises'
import { join } from 'path'

export function registerStorageHandlers(): void {
  const dataPath = join(app.getPath('userData'), 'library.json')
  console.log('Data Path:', dataPath)

  ipcMain.handle('get-app-data', async () => {
    try {
      const data = await fs.readFile(dataPath, 'utf-8')
      return data
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return null
    }
  })

  ipcMain.handle('save-app-data', async (_, data: string) => {
    try {
      console.log(`[Main] Saving data to: ${dataPath}`)
      await fs.writeFile(dataPath, data, 'utf-8')
      return true
    } catch (error) {
      console.error('[Main] Failed to save data:', error)
      return false
    }
  })
}
