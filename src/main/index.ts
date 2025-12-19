import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initDiscordRPC } from './discord'

// Handlers
import { registerGameLauncherHandlers } from './ipc/gameLauncher'
import { registerStorageHandlers } from './ipc/storage'
import { registerDialogHandlers } from './ipc/dialogs'
import { registerMiscHandlers } from './ipc/misc'
import { registerScannerHandlers } from './ipc/scanner'

// Fix: Ensure audio can autoplay without user interaction (common for launchers)
// Must be called before app 'ready' event
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

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
  mainWindow.webContents.session.setPermissionCheckHandler((_webContents, permission) => {
    if (permission === 'media') {
      return true
    }
    return false
  })

  /**
   * Set a permission request handler to automatically grant 'media' permission.
   * This handles direct permission requests made by web content.
   */
  mainWindow.webContents.session.setPermissionRequestHandler(
    (_webContents, permission, callback) => {
      if (permission === 'media') {
        return callback(true)
      }
      return callback(false)
    }
  )
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Initialize Discord RPC
  initDiscordRPC()

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

  // Register all IPC Handlers
  registerGameLauncherHandlers()
  registerStorageHandlers()
  registerDialogHandlers()
  registerMiscHandlers()
  registerScannerHandlers()

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
