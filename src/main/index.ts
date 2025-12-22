/**
 * @fileoverview Main process entry point for the Electron application.
 * Initializes the browser window, IPC handlers, and Discord RPC integration.
 * @module main
 */

import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { initDiscordRPC } from './discord'

import { registerGameLauncherHandlers } from './ipc/gameLauncher'
import { registerStorageHandlers } from './ipc/storage'
import { registerDialogHandlers } from './ipc/dialogs'
import { registerMiscHandlers } from './ipc/misc'
import { registerScannerHandlers } from './ipc/scanner'

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required')

/**
 * Creates and configures the main application window.
 * Sets up window properties, IPC listeners, and permission handlers.
 */
function createWindow(): void {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    backgroundColor: '#000000',
    autoHideMenuBar: true,
    icon: icon,
    frame: false,
    fullscreen: true,
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

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  ipcMain.on('app-minimize', () => mainWindow.minimize())
  ipcMain.on('app-quit', () => app.quit())

  mainWindow.webContents.session.setPermissionCheckHandler((_webContents, permission) => {
    if (permission === 'media') {
      return true
    }
    return false
  })

  mainWindow.webContents.session.setPermissionRequestHandler(
    (_webContents, permission, callback) => {
      if (permission === 'media') {
        return callback(true)
      }
      return callback(false)
    }
  )
}

app.whenReady().then(() => {
  initDiscordRPC()

  electronApp.setAppUserModelId('com.electron')

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  registerGameLauncherHandlers()
  registerStorageHandlers()
  registerDialogHandlers()
  registerMiscHandlers()
  registerScannerHandlers()

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
