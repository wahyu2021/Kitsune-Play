/**
 * @fileoverview Steam library scanner service.
 * Parses Steam app manifests (ACF files) and detects game executables.
 * @module main/services/steamScanner
 */

import fs from 'fs'
import path from 'path'

/** Represents a detected Steam game with metadata. */
export interface SteamGame {
  appId: string
  name: string
  installDir: string
  libraryPath: string
  executablePath?: string
}

/** Folders to skip during executable search. */
const IGNORED_FOLDERS = [
  'support',
  'commonredist',
  'directx',
  'dotnep',
  'installers',
  'prerequisites',
  'redist',
  'artbook',
  'soundtrack',
  'bonus'
]

/** Executable names to exclude from detection. */
const IGNORED_EXECUTABLES = [
  'unins',
  'setup',
  'crash',
  'update',
  'helper',
  'redist',
  'dxwebsetup',
  'vcredist',
  'unitycrashhandler',
  'ue4prereq'
]

function isIgnoredFolder(name: string): boolean {
  return IGNORED_FOLDERS.includes(name.toLowerCase())
}

function isIgnoredExecutable(name: string): boolean {
  const lowerName = name.toLowerCase()
  return IGNORED_EXECUTABLES.some((ignored) => lowerName.includes(ignored))
}

/**
 * Parses Steam ACF/VDF manifest files.
 * @param content - Raw file content
 * @returns Parsed game data or null if invalid
 */
function parseAcf(content: string): Partial<SteamGame> | null {
  try {
    const appIdMatch = content.match(/"appid"\s+"?(\d+)"?/i)
    const nameMatch = content.match(/"name"\s+"?([^"]+)"?/i)
    const installDirMatch = content.match(/"installdir"\s+"?([^"]+)"?/i)

    if (appIdMatch && nameMatch) {
      return {
        appId: appIdMatch[1],
        name: nameMatch[1],
        installDir: installDirMatch ? installDirMatch[1] : ''
      }
    }
    return null
  } catch {
    return null
  }
}

/**
 * Heuristically finds the main executable of a game.
 * Uses scoring based on file size and name matching.
 * @param installDir - Game installation directory
 * @param gameName - Display name of the game
 * @param folderName - Installation folder name
 * @returns Path to the best candidate executable
 */
async function findGameExecutable(
  installDir: string,
  gameName: string,
  folderName: string
): Promise<string | null> {
  if (!installDir || !fs.existsSync(installDir)) {
    console.log(`[SteamScanner] Install dir not found: ${installDir}`)
    return null
  }

  try {
    const candidates: { path: string; size: number; name: string }[] = []

    async function scanDir(dir: string, depth: number): Promise<void> {
      if (depth > 4) return

      const entries = await fs.promises.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          if (!isIgnoredFolder(entry.name)) {
            await scanDir(fullPath, depth + 1)
          }
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.exe')) {
          if (isIgnoredExecutable(entry.name)) {
            continue
          }

          const stats = await fs.promises.stat(fullPath)
          candidates.push({ path: fullPath, size: stats.size, name: entry.name })
        }
      }
    }

    await scanDir(installDir, 0)

    if (candidates.length === 0) {
      console.log(`[SteamScanner] No exe candidates found in ${installDir}`)
      return null
    }

    // Heuristics
    const sanitizedGameName = gameName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()
    const sanitizedFolderName = folderName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()

    const scored = candidates.map((c) => {
      const sanitizedExeName = c.name
        .replace('.exe', '')
        .replace(/[^a-zA-Z0-9]/g, '')
        .toLowerCase()
      let score = 0

      if (sanitizedExeName === sanitizedFolderName) {
        score += 1000
      } else if (
        sanitizedExeName.includes(sanitizedFolderName) ||
        sanitizedFolderName.includes(sanitizedExeName)
      ) {
        score += 100
      }

      if (
        sanitizedGameName.includes(sanitizedExeName) ||
        sanitizedExeName.includes(sanitizedGameName)
      ) {
        score += 50
      }

      score += c.size / 1024 / 1024

      if (sanitizedExeName.includes('launcher')) {
        score -= 20
      }

      return { ...c, score }
    })

    scored.sort((a, b) => b.score - a.score)

    console.log(
      `[SteamScanner] Candidates for ${gameName} (${folderName}):`,
      scored.slice(0, 3).map((c) => `${c.name} (${c.score.toFixed(1)})`)
    )

    return scored[0].path
  } catch (e) {
    console.warn(`Failed to search exe for ${gameName} in ${installDir}`, e)
    return null
  }
}

/**
 * Scans a Steam library path for installed games.
 * @param inputPath - Path to Steam installation or library folder
 * @returns Array of detected Steam games with metadata
 */
export async function scanSteamLibrary(inputPath: string): Promise<SteamGame[]> {
  console.log(`[SteamScanner] Scanning input: ${inputPath}`)
  const allGames: SteamGame[] = []
  const pathsToScan: Set<string> = new Set()

  pathsToScan.add(inputPath)
  pathsToScan.add(path.join(inputPath, 'steamapps'))

  if (path.basename(inputPath).toLowerCase() === 'steamapps') {
    pathsToScan.add(path.dirname(inputPath))
  }
  if (path.basename(inputPath).toLowerCase() === 'common') {
    pathsToScan.add(path.join(inputPath, '../../'))
    pathsToScan.add(path.join(inputPath, '../'))
  }

  // Parse libraryfolders.vdf for additional library paths
  const vdfLocations = [
    path.join(inputPath, 'steamapps', 'libraryfolders.vdf'),
    path.join(inputPath, 'libraryfolders.vdf'),
    path.join(inputPath, '../libraryfolders.vdf') // If user selected steamapps
  ]

  for (const vdfPath of vdfLocations) {
    if (fs.existsSync(vdfPath)) {
      try {
        console.log(`[SteamScanner] Found VDF at: ${vdfPath}`)
        const vdfContent = await fs.promises.readFile(vdfPath, 'utf-8')
        const matches = vdfContent.matchAll(/"path"\s+"([^"]+)"/g)
        for (const match of matches) {
          const libPath = match[1].replace(/\\\\/g, '\\')
          if (fs.existsSync(libPath)) {
            pathsToScan.add(libPath)
            pathsToScan.add(path.join(libPath, 'steamapps'))
          }
        }
      } catch (error) {
        console.warn('Steam Scanner: Failed to parse libraryfolders.vdf', error)
      }
    }
  }

  console.log(`[SteamScanner] Final scan list:`, Array.from(pathsToScan))

  for (const scanDir of pathsToScan) {
    try {
      if (!fs.existsSync(scanDir)) continue

      const files = await fs.promises.readdir(scanDir)
      const acfFiles = files.filter((f) => f.startsWith('appmanifest_') && f.endsWith('.acf'))

      if (acfFiles.length > 0) {
        console.log(`[SteamScanner] Found ${acfFiles.length} manifests in ${scanDir}`)
      }

      for (const file of acfFiles) {
        const filePath = path.join(scanDir, file)
        const content = await fs.promises.readFile(filePath, 'utf-8')
        const gameData = parseAcf(content)

        if (gameData && gameData.appId && gameData.name) {
          if (
            gameData.name === 'Steamworks Common Redistributables' ||
            gameData.name.includes('Steamworks')
          )
            continue

          if (!allGames.some((g) => g.appId === gameData.appId)) {
            let fullInstallDir = ''
            let executablePath = ''

            if (gameData.installDir) {
              fullInstallDir = path.join(scanDir, 'common', gameData.installDir)

              if (fs.existsSync(fullInstallDir)) {
                executablePath =
                  (await findGameExecutable(fullInstallDir, gameData.name, gameData.installDir)) ||
                  ''
              } else {
                console.log(`[SteamScanner] Folder not found: ${fullInstallDir}`)
              }
            }

            allGames.push({
              appId: gameData.appId,
              name: gameData.name,
              installDir: gameData.installDir || '',
              libraryPath: scanDir,
              executablePath
            })
          }
        }
      }
    } catch {
      // ignore read errors on bad paths
    }
  }

  console.log(`[SteamScanner] Total unique games found: ${allGames.length}`)
  return allGames
}
