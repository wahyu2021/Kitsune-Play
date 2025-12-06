import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { execFile } from 'child_process'
import fs from 'fs/promises'

/**
 * Creates the main Electron browser window for the application.
 */
function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    backgroundColor: '#000000', 
    autoHideMenuBar: true,
    icon: icon, // Explicitly set icon for all platforms
    frame: false, // Frameless for custom UI
    fullscreen: true, // Fullscreen experience
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Window Controls Handlers
  ipcMain.on('app-minimize', () => mainWindow.minimize())
  ipcMain.on('app-quit', () => app.quit())

  /**
   * Set a permission check handler to automatically grant 'media' permission.
   * This ensures autoplay works without user prompts, which is ideal for a dedicated launcher.
   */
  mainWindow.webContents.session.setPermissionCheckHandler((_webContents, permission, _requestingOrigin) => {
    if (permission === 'media') {
      return true
    }
    return false
  })
  
  /**
   * Set a permission request handler to automatically grant 'media' permission.
   * This handles direct permission requests made by web content.
   */
  mainWindow.webContents.session.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === 'media') {
      return callback(true)
    }
    return callback(false)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  /**
   * Set app user model id for windows.
   * This ensures the application is correctly identified by the OS.
   */
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // Launch Game Handler
  /**
   * IPC handler to launch a game and monitor its session.
   * @param _ - Event object.
   * @param exePath - Path to the executable.
   * @returns Promise resolving to the session duration in minutes (or 0 if failed/web).
   */
  ipcMain.handle('launch-game', async (_, exePath: string) => {
    return new Promise((resolve, reject) => {
      console.log('Launching:', exePath)

      if (exePath.startsWith('http://') || exePath.startsWith('https://')) {
        shell.openExternal(exePath)
          .then(() => resolve(0)) // Web apps don't track playtime yet
          .catch((err) => reject(err.message))
      } else {
        const startTime = Date.now()
        
        const child = execFile(exePath, (error) => {
          if (error && error.signal !== null) {
             // Non-null signal usually means manually killed or crash, still valid close
             console.warn('Game process exited with error/signal:', error)
          }
        })

        // Monitor process exit to calculate playtime
        child.on('close', () => {
            const endTime = Date.now()
            const durationMs = endTime - startTime
            const durationMinutes = Math.floor(durationMs / 60000)
            console.log(`Game closed. Duration: ${durationMinutes} mins`)
            resolve(durationMinutes)
        })

        child.on('error', (err) => {
            console.error('Failed to spawn game process:', err)
            reject(err.message)
        })
      }
    })
  })

  // Open File Dialog Handler
  /**
   * IPC handler to open a file dialog.
   * @param _ - Event object (unused).
   * @param filters - An array of file filters.
   * @returns The selected file path or null if canceled.
   */
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

  // --- DATA PERSISTENCE ---
  const dataPath = join(app.getPath('userData'), 'library.json')
  console.log('Data Path:', dataPath)

  /**
   * IPC handler to retrieve application data from a JSON file.
   * If the file does not exist, returns null.
   * @returns Parsed JSON data or null.
   */
  ipcMain.handle('get-app-data', async () => {
    try {
      const data = await fs.readFile(dataPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      return null
    }
  })

  /**
   * IPC handler to save application data to a JSON file.
   * @param _ - Event object (unused).
   * @param data - The JSON string data to save.
   * @returns True if save was successful, false otherwise.
   */
  ipcMain.handle('save-app-data', async (_, data: string) => {
    try {
      await fs.writeFile(dataPath, data, 'utf-8')
      return true
    } catch (error) {
      console.error('Failed to save data:', error)
      return false
    }
  })

  /**
   * IPC handler to get the application version.
   * @returns The application version string.
   */
  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  createWindow()

  /**
   * On macOS, it's common to re-create a window in the app when the
   * dock icon is clicked and there are no other windows open.
   */
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

/**
 * Quit when all windows are closed, except on macOS. There, it's common
 * for applications and their menu bar to stay active until the user quits
 * explicitly with Cmd + Q.
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
