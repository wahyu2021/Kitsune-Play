import DiscordRPC from 'discord-rpc'
import { DISCORD_CONFIG } from './config'

let rpcClient: DiscordRPC.Client | null = null
let retryCount = 0

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

  rpcClient.login({ clientId: DISCORD_CONFIG.clientId }).catch((err) => {
    console.warn(`[Discord RPC] Login failed: ${err.message}`)

    if (retryCount < DISCORD_CONFIG.maxRetries) {
      retryCount++
      console.log(
        `[Discord RPC] Retrying connection in ${DISCORD_CONFIG.retryDelay / 1000} seconds... (${retryCount}/${DISCORD_CONFIG.maxRetries})`
      )
      setTimeout(login, DISCORD_CONFIG.retryDelay)
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
      largeImageKey: DISCORD_CONFIG.largeImageKey,
      largeImageText: DISCORD_CONFIG.largeImageText,
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
