/**
 * @fileoverview IPC handlers for game launching and process tracking.
 * Supports local executables, Steam protocol, and web URLs.
 * @module main/ipc/gameLauncher
 */

import { ipcMain, shell } from 'electron'
import { execFile, exec, ChildProcess } from 'child_process'
import { dirname } from 'path'
import { setDiscordActivity } from '../discord'

let activeChild: ChildProcess | null = null
let activeProcessName: string | null = null

/** Registers IPC handlers for game launching operations. */
export function registerGameLauncherHandlers(): void {
  ipcMain.handle('terminate-game', async () => {
    console.log('[Main] Terminate game requested')

    if (activeChild && activeChild.pid) {
      console.log(`[Main] Killing active child process (PID: ${activeChild.pid})...`)

      if (process.platform === 'win32') {
        exec(`taskkill /pid ${activeChild.pid} /T /F`, (err) => {
          if (err) {
            console.error('[Main] Failed to kill process tree:', err)
            // Fallback to standard kill if taskkill fails
            activeChild?.kill()
          }
        })
      } else {
        activeChild.kill()
      }
      activeChild = null
    }

    if (activeProcessName) {
      console.log(`[Main] Killing process by name: ${activeProcessName}`)
      const cmd =
        process.platform === 'win32'
          ? `taskkill /IM "${activeProcessName}" /F`
          : `pkill -f "${activeProcessName}"`

      exec(cmd, (err) => {
        if (err) console.error('[Main] Failed to kill process:', err)
      })
      activeProcessName = null
    }

    setDiscordActivity('Browsing Library', 'In Menu')
  })

  ipcMain.handle(
    'launch-game',
    async (
      _,
      exePath: string,
      gameName: string = 'Unknown Game',
      launchArgs: string = '',
      executableName?: string
    ) => {
      return new Promise((resolve, reject) => {
        console.log(`[Main] Launching: ${gameName} | Exe: ${executableName || 'Standard'}`)

        // Reset tracking variables
        activeChild = null
        activeProcessName = executableName || null

        setDiscordActivity('Playing Game', gameName, new Date())
        const startTime = Date.now()

        /**
         * Polls for a running process by name to track game session.
         * @param targetProcessName - The process name to monitor (e.g., 'game.exe')
         */
        const startPolling = (targetProcessName: string): void => {
          console.log(`[Main] Starting polling monitor for: ${targetProcessName}`)

          setTimeout(() => {
            const interval = setInterval(() => {
              const cmd =
                process.platform === 'win32'
                  ? `tasklist /FI "IMAGENAME eq ${targetProcessName}" /NH`
                  : `ps -A | grep "${targetProcessName}"`

              exec(cmd, (_err, stdout) => {
                const isRunning =
                  stdout && stdout.toLowerCase().includes(targetProcessName.toLowerCase())

                if (!isRunning) {
                  clearInterval(interval)
                  activeProcessName = null // Clear tracker
                  const endTime = Date.now()
                  const durationMinutes = Math.floor((endTime - startTime) / 60000)
                  console.log(`[Main] Polling ended. Duration: ${durationMinutes} mins`)
                  setDiscordActivity('Browsing Library', 'In Menu')
                  resolve(durationMinutes)
                }
              })
            }, 5000)
          }, 5000)
        }

        if (exePath.startsWith('http://') || exePath.startsWith('https://')) {
          shell
            .openExternal(exePath)
            .then(() => {
              setTimeout(() => {
                setDiscordActivity('Browsing Library', 'In Menu')
              }, 5000)
              resolve(0)
            })
            .catch((err) => {
              setDiscordActivity('Browsing Library', 'In Menu')
              reject(err.message)
            })
        } else if (exePath.startsWith('steam://')) {
          shell
            .openExternal(exePath)
            .then(() => {
              if (executableName) {
                startPolling(executableName)
              } else {
                setTimeout(() => {
                  setDiscordActivity('Browsing Library', 'In Menu')
                  resolve(0)
                }, 5000)
              }
            })
            .catch((err) => {
              setDiscordActivity('Browsing Library', 'In Menu')
              reject(err.message)
            })
        } else {
          const args =
            launchArgs.match(/(?:[^\s"]+|"[^"]*")+/g)?.map((arg) => arg.replace(/^"|"$/g, '')) || []

          const child = execFile(exePath, args, { cwd: dirname(exePath) }, (error) => {
            if (error && error.signal !== null) {
              console.warn('[Main] Game process exited with error/signal:', error)
            }
          })

          // Track the child process
          activeChild = child

          if (executableName) {
            startPolling(executableName)
          } else {
            child.on('close', () => {
              activeChild = null // Clear tracker
              const endTime = Date.now()
              const durationMinutes = Math.floor((endTime - startTime) / 60000)

              console.log(`[Main] Session ended. Duration: ${durationMinutes} mins`)
              setDiscordActivity('Browsing Library', 'In Menu')
              resolve(durationMinutes)
            })

            child.on('error', (err) => {
              console.error('[Main] Failed to spawn game process:', err)
              activeChild = null
              setDiscordActivity('Browsing Library', 'In Menu')
              reject(err.message)
            })
          }
        }
      })
    }
  )

  ipcMain.handle('discord-update-status', (_, status: string) => {
    setDiscordActivity('Browsing Library', status)
  })
}
