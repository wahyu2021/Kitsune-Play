import DiscordRPC from 'discord-rpc'

/**
 * Discord Client ID.
 * Replace this with your specific Application ID from the Discord Developer Portal
 * if you want to customize the rich presence name and assets.
 */
const clientId = '1449702184559181886'

let rpcClient: DiscordRPC.Client | null = null
let retryCount = 0
const MAX_RETRIES = 3

/**
 * Initializes the Discord RPC client and attempts to log in.
 * Sets the initial activity to "In Menu" upon success.
 */
export function initDiscordRPC(): void {
  rpcClient = new DiscordRPC.Client({ transport: 'ipc' })

  rpcClient.on('ready', () => {
    console.log('[Discord RPC] Connected and Ready')
    setDiscordActivity('Browsing Library', 'In Menu')
    retryCount = 0 // Reset retry count on success
  })

  login()
}

function login(): void {
  if (!rpcClient) return

  rpcClient.login({ clientId }).catch((err) => {
    console.warn(`[Discord RPC] Login failed: ${err.message}`)

    if (retryCount < MAX_RETRIES) {
      retryCount++
      console.log(
        `[Discord RPC] Retrying connection in 5 seconds... (${retryCount}/${MAX_RETRIES})`
      )
      setTimeout(login, 5000)
    } else {
      console.error('[Discord RPC] Gave up connecting to Discord. Is it running?')
    }
  })
}

/**
 * Updates the user's Discord Rich Presence status.
 *
 * @param details - The first line of text (e.g., "Playing God of War").
 * @param state - The second line of text (e.g., "In Menu" or "Elapsed Time").
 * @param startTimestamp - Optional Date object to show the "Elapsed" timer.
 */
export function setDiscordActivity(details: string, state: string, startTimestamp?: Date): void {
  if (!rpcClient) return

  rpcClient
    .setActivity({
      details,
      state,
      startTimestamp,
      largeImageKey: 'icon', // Matches the asset key uploaded to Discord Dev Portal
      largeImageText: 'Kitsune Play',
      instance: false
    })
    .catch((err) => console.warn('[Discord RPC] Failed to set activity:', err.message))
}

/**
 * Clears the current Rich Presence activity.
 * Useful when the app is closing or the user disables the feature.
 */
export function clearDiscordActivity(): void {
  if (!rpcClient) return
  rpcClient.clearActivity().catch(console.error)
}
