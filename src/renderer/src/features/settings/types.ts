/**
 * Global application settings.
 */
export interface AppSettings {
  rawgApiKey: string
  bgMusicVolume: number // 0.0 to 1.0
  sfxVolume: number // 0.0 to 1.0
  isMuted: boolean
  weather?: {
    city: string
    latitude: number
    longitude: number
    unit: 'celsius' | 'fahrenheit' // Reserved for future use
  }
}
