/**
 * @fileoverview Application settings type definitions.
 * @module renderer/features/settings/types
 */

/** Weather location and display configuration. */
export interface WeatherSettings {
  /** Display name of the city. */
  city: string
  /** Geographic latitude coordinate. */
  latitude: number
  /** Geographic longitude coordinate. */
  longitude: number
  /** Temperature unit preference. */
  unit: 'celsius' | 'fahrenheit'
}

/** Global application settings stored in persistent storage. */
export interface AppSettings {
  /** RAWG.io API key for game metadata fetching. */
  rawgApiKey: string
  /** Background music volume level (0.0 - 1.0). */
  bgMusicVolume: number
  /** Sound effects volume level (0.0 - 1.0). */
  sfxVolume: number
  /** Global mute toggle state. */
  isMuted: boolean
  /** Optional custom background music file path. */
  customBgMusicPath?: string
  /** Optional weather widget configuration. */
  weather?: WeatherSettings
}
