/**
 * Represents a game or media application within the launcher.
 */
export interface Game {
  /** Unique identifier for the game (UUID or Timestamp based). */
  id: string
  /** Display title of the game. */
  title: string
  /** Short description or synopsis. */
  description: string
  /** Genre of the game (e.g., "Action", "RPG"). Used for theming. */
  genre: string
  /** Absolute file path or URL to the executable/web app. */
  path_to_exe: string
  /** Path or URL to the cover art image (portrait). */
  cover_image: string
  /** Path or URL to the background wallpaper (landscape). */
  bg_image: string
  /** Optional: Path or URL to a background video loop (mp4/webm). Overrides bg_image if present. */
  bg_video?: string
}

/**
 * Global application settings.
 */
export interface AppSettings {
  rawgApiKey: string
}
