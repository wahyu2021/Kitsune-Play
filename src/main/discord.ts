import DiscordRPC from 'discord-rpc'
import { DISCORD_CONFIG } from './config'

let rpcClient: DiscordRPC.Client | null = null
let retryCount = 0
let isReady = false

/**
 * Initializes the Discord RPC client and attempts to log in.
 */
export async function initDiscordRPC(): Promise<void> {
  await attemptConnection()
}

async function attemptConnection(): Promise<void> {
  isReady = false // Reset state

  // cleanup previous instance if any
  if (rpcClient) {
    try {
      await rpcClient.destroy()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      // ignore
    }
    rpcClient = null
  }

  // Small delay to ensure socket closes
  await new Promise((resolve) => setTimeout(resolve, 1000))

  rpcClient = new DiscordRPC.Client({ transport: 'ipc' })

  rpcClient.on('ready', () => {
    console.log('[Discord RPC] Connected and Ready')
    isReady = true
    setDiscordActivity('Browsing Library', 'In Menu')
    retryCount = 0 // Reset retry count on success
  })

  // Register the app (sometimes required for detection)
  try {
    DiscordRPC.register(DISCORD_CONFIG.clientId)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e) {
    // console.warn('[Discord RPC] Register failed (non-fatal):', e)
  }

  rpcClient.login({ clientId: DISCORD_CONFIG.clientId }).catch((err) => {
    isReady = false
    console.warn(`[Discord RPC] Connection failed: ${err.message}`)

    if (retryCount < DISCORD_CONFIG.maxRetries) {
      retryCount++
      console.log(
        `[Discord RPC] Retrying in ${DISCORD_CONFIG.retryDelay / 1000}s... (${retryCount}/${DISCORD_CONFIG.maxRetries})`
      )
      setTimeout(attemptConnection, DISCORD_CONFIG.retryDelay)
    } else {
      console.error(
        '[Discord RPC] Connection gave up. Please ensure Discord is open and running on your PC.'
      )
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
  if (!rpcClient || !isReady) return

  rpcClient
    .setActivity({
      details,
      state,
      startTimestamp,
      largeImageKey: DISCORD_CONFIG.largeImageKey,
      largeImageText: DISCORD_CONFIG.largeImageText,
      instance: false
    })
    .catch((err) => {
      // If setting activity fails, it might mean the connection died.
      console.warn('[Discord RPC] Failed to set activity:', err.message)
      isReady = false // Mark as failed
    })
}

/**
 * Clears the current Rich Presence activity.
 * Useful when the app is closing or the user disables the feature.
 */
export function clearDiscordActivity(): void {
  if (!rpcClient || !isReady) return
  rpcClient.clearActivity().catch(console.error)
}
