/**
 * @fileoverview Preload script exposing secure API to renderer process.
 * Uses contextBridge for secure IPC communication.
 * @module preload
 */

import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

/** Custom APIs exposed to the renderer process. */
const api = {
  launchGame: (
    path: string,
    name: string,
    launchArgs?: string,
    executableName?: string
  ): Promise<number> => ipcRenderer.invoke('launch-game', path, name, launchArgs, executableName),
  terminateGame: (): Promise<void> => ipcRenderer.invoke('terminate-game'),
  updateDiscordStatus: (status: string): Promise<void> =>
    ipcRenderer.invoke('discord-update-status', status),
  selectFile: (filters: Electron.FileFilter[]): Promise<string | null> =>
    ipcRenderer.invoke('open-file-dialog', filters),
  selectFolder: (): Promise<string | null> => ipcRenderer.invoke('open-folder-dialog'),
  scanSteamLibrary: (path: string): Promise<unknown[]> =>
    ipcRenderer.invoke('scan-steam-library', path),
  loadData: (): Promise<string | null> => ipcRenderer.invoke('get-app-data'),
  saveData: (data: string): Promise<boolean> => ipcRenderer.invoke('save-app-data', data),
  saveAvatar: (path: string): Promise<string | null> => ipcRenderer.invoke('save-avatar', path),
  getAppVersion: (): Promise<string> => ipcRenderer.invoke('get-app-version'),
  shutdownSystem: (): Promise<void> => ipcRenderer.invoke('system-shutdown'),
  restartSystem: (): Promise<void> => ipcRenderer.invoke('system-restart'),
  sleepSystem: (): Promise<void> => ipcRenderer.invoke('system-sleep'),
  minimize: (): void => ipcRenderer.send('app-minimize'),
  quit: (): void => ipcRenderer.send('app-quit')
}

if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
