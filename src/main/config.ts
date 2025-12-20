/**
 * @fileoverview Discord Rich Presence configuration.
 * @module main/config
 */

/** Discord RPC configuration constants. */
export const DISCORD_CONFIG = {
  clientId: import.meta.env.VITE_DISCORD_CLIENT_ID || '1449702184559181886',
  maxRetries: 3,
  retryDelay: 5000,
  largeImageKey: 'icon',
  largeImageText: 'Kitsune Play'
}
