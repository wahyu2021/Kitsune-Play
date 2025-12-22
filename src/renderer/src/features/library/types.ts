/**
 * @fileoverview Library feature type definitions.
 * @module renderer/features/library/types
 */

import { AppSettings } from '@/features/settings/types'

/** Represents a game or media application within the launcher. */
export interface Game {
  /** Unique identifier for the game (UUID). */
  id: string
  /** Display title of the game. */
  title: string
  /** Short description or synopsis. */
  description: string
  /** Genre of the game (e.g., "Action", "RPG"). Used for theming. */
  genre: string
  /** Absolute file path, URL, or Steam protocol URI to launch. */
  path_to_exe: string
  /** Path or URL to the cover art image (portrait). */
  cover_image: string
  /** Path or URL to the background wallpaper (landscape). */
  bg_image: string
  /** Optional background video loop path (mp4/webm). */
  bg_video?: string
  /** Optional command line arguments for the executable. */
  launchArgs?: string
  /** Process name for tracking (e.g., 'game.exe'). */
  executableName?: string
  /** Total playtime in minutes. */
  playtime?: number
  /** ISO timestamp of last play session. */
  lastPlayed?: string
  /** Whether the game is favorited. */
  isFavorite?: boolean
  /** Whether the game is hidden from view. */
  isHidden?: boolean
}

/** Persistent application data structure. */
export interface AppData {
  /** User's game library. */
  games: Game[]
  /** User's media applications. */
  mediaApps: Game[]
  /** Display name of the user. */
  userName: string
  /** Application settings. */
  settings: AppSettings
}

/** Steam game data returned by the scanner service. */
export interface SteamGame {
  /** Steam application ID. */
  appId: string
  /** Display name of the game. */
  name: string
  /** Installation directory name. */
  installDir: string
  /** Full path to the detected executable. */
  executablePath?: string
}
