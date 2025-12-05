import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { execFile } from 'child_process'
import fs from 'fs/promises'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    backgroundColor: '#000000', // Fix: Black background to match splash screen
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
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Launch Game Handler
  ipcMain.handle('launch-game', async (_, exePath: string) => {
    return new Promise((resolve, reject) => {
      console.log('Launching:', exePath)

      // Logic: Check if it's a Web URL or Local File
      if (exePath.startsWith('http://') || exePath.startsWith('https://')) {
        shell.openExternal(exePath)
          .then(() => resolve(true))
          .catch((err) => reject(err.message))
      } else {
        // Use execFile to prevent shell injection and ensure specific file execution
        execFile(exePath, (error) => {
          if (error) {
            console.error('Failed to launch game:', error)
            reject(error.message)
          } else {
            resolve(true)
          }
        })
      }
    })
  })

  // Open File Dialog Handler
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

  ipcMain.handle('get-app-data', async () => {
    try {
      const data = await fs.readFile(dataPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      // If file doesn't exist, return null (renderer will use defaults)
      return null
    }
  })

  ipcMain.handle('save-app-data', async (_, data: string) => {
    try {
      await fs.writeFile(dataPath, data, 'utf-8')
      return true
    } catch (error) {
      console.error('Failed to save data:', error)
      return false
    }
  })

  ipcMain.handle('get-app-version', () => {
    return app.getVersion()
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
