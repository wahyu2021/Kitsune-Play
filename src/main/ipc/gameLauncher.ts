import { ipcMain, shell } from 'electron'
import { execFile, exec } from 'child_process'
import { setDiscordActivity } from '../discord'

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

        // --- HELPER: POLLING MONITOR ---
        const startPolling = (targetProcessName: string): void => {
          console.log(`[Main] Starting polling monitor for: ${targetProcessName}`)

          // Initial delay to let the process start
          setTimeout(() => {
            const interval = setInterval(() => {
              const cmd =
                process.platform === 'win32'
                  ? `tasklist /FI "IMAGENAME eq ${targetProcessName}" /NH`
                  : `ps -A | grep "${targetProcessName}"`

              exec(cmd, (_err, stdout) => {
                // If error or empty output (or specific "No tasks" msg on Windows), process is gone
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
            }, 5000) // Check every 5 seconds
          }, 5000) // Wait 5s before first check
        }

        // 1. Handle Web URLs (http/https)
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
        }
        // 2. Handle Steam Protocol (steam://)
        else if (exePath.startsWith('steam://')) {
          shell
            .openExternal(exePath)
            .then(() => {
              if (executableName) {
                // If user provided an exe name, track it!
                startPolling(executableName)
              } else {
                // Otherwise, we can't track Steam games accurately
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
        }
        // 3. Handle Local Executables
        else {
          // Parse arguments
          const args =
            launchArgs.match(/(?:[^\s"]+|"[^"]*")+/g)?.map((arg) => arg.replace(/^"|"$/g, '')) || []

          const child = execFile(exePath, args, (error) => {
            if (error && error.signal !== null) {
              console.warn('[Main] Game process exited with error/signal:', error)
            }
          })

          // DECISION: Polling vs Child Process
          if (executableName) {
            // If explicit exe name provided, ignore child process exit (it might be a launcher)
            // and start polling for the real game process.
            startPolling(executableName)
          } else {
            // Standard monitoring
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

  // IPC to manually update status (e.g., Idle)
  ipcMain.handle('discord-update-status', (_, status: string) => {
    // We assume 'Browsing Library' as the detail for these states
    setDiscordActivity('Browsing Library', status)
  })
}
