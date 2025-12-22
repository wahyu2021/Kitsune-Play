/**
 * @fileoverview IPC handlers for persistent data storage.
 * @module main/ipc/storage
 */

import { ipcMain, app } from 'electron'
import fs from 'fs/promises'
import { join } from 'path'

/** Registers IPC handlers for application data persistence. */
export function registerStorageHandlers(): void {
  const dataPath = join(app.getPath('userData'), 'library.json')

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
      await fs.writeFile(dataPath, data, 'utf-8')
      return true
    } catch (error) {
      console.error('[Main] Failed to save data:', error)
      return false
    }
  })

  /**
   * Saves a user avatar image.
   * Copies the selected file to the app's userData directory and returns the new path.
   * Automatically cleans up old avatar files.
   */
  ipcMain.handle('save-avatar', async (_, sourcePath: string) => {
    try {
      if (!sourcePath) {
        console.error('[Main] save-avatar: No source path provided')
        return null
      }

      const avatarsDir = join(app.getPath('userData'), 'avatars')
      await fs.mkdir(avatarsDir, { recursive: true })

      const ext = sourcePath.split('.').pop() || 'png'
      const fileName = `avatar-${Date.now()}.${ext}`
      const targetPath = join(avatarsDir, fileName)

      // Clean up old avatars
      try {
        const files = await fs.readdir(avatarsDir)
        for (const file of files) {
          if (file.startsWith('avatar-')) {
            await fs.unlink(join(avatarsDir, file)).catch(() => {})
          }
        }
      } catch {
        // Ignore cleanup errors
      }

      await fs.copyFile(sourcePath, targetPath)
      console.log('[Main] Avatar saved to:', targetPath)
      return targetPath
    } catch (error) {
      console.error('[Main] Failed to save avatar:', error)
      return null
    }
  })
}
