/**
 * @fileoverview Type declarations for the preload API exposed to renderer.
 * @module preload/types
 */

import { ElectronAPI } from '@electron-toolkit/preload'

/** API methods exposed to renderer via contextBridge. */
export interface PreloadAPI {
  /** Launches a game executable and returns session duration in minutes. */
  launchGame: (
    path: string,
    name: string,
    launchArgs?: string,
    executableName?: string
  ) => Promise<number>
  /** Updates Discord Rich Presence status text. */
  updateDiscordStatus: (status: string) => Promise<void>
  /** Opens native file picker dialog with specified filters. */
  selectFile: (filters: Electron.FileFilter[]) => Promise<string | null>
  /** Opens native folder picker dialog. */
  selectFolder: () => Promise<string | null>
  /** Scans Steam library path for installed games. */
  scanSteamLibrary: (path: string) => Promise<{ appId: string; name: string; installDir: string }[]>
  /** Loads persisted application data from disk. */
  loadData: () => Promise<string | null>
  /** Saves application data to disk. */
  saveData: (data: string) => Promise<boolean>
  /** Returns the current application version string. */
  getAppVersion: () => Promise<string>
  /** Initiates system shutdown. */
  shutdownSystem: () => Promise<void>
  /** Initiates system restart. */
  restartSystem: () => Promise<void>
  /** Puts system into sleep/suspend mode. */
  sleepSystem: () => Promise<void>
  /** Minimizes the application window. */
  minimize: () => void
  /** Quits the application. */
  quit: () => void
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: PreloadAPI
  }
}
