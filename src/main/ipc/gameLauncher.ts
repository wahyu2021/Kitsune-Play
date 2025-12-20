/**
 * @fileoverview IPC handlers for game launching and process tracking.
 * Supports local executables, Steam protocol, and web URLs.
 * @module main/ipc/gameLauncher
 */

import { ipcMain, shell } from 'electron'
import { execFile, exec } from 'child_process'
import { setDiscordActivity } from '../discord'

/** Registers IPC handlers for game launching operations. */
export function registerGameLauncherHandlers(): void {
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

          const child = execFile(exePath, args, (error) => {
            if (error && error.signal !== null) {
              console.warn('[Main] Game process exited with error/signal:', error)
            }
          })

          if (executableName) {
            startPolling(executableName)
          } else {
            child.on('close', () => {
              const endTime = Date.now()
              const durationMinutes = Math.floor((endTime - startTime) / 60000)

              console.log(`[Main] Session ended. Duration: ${durationMinutes} mins`)
              setDiscordActivity('Browsing Library', 'In Menu')
              resolve(durationMinutes)
            })

            child.on('error', (err) => {
              console.error('[Main] Failed to spawn game process:', err)
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
