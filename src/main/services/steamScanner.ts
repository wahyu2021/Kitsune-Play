import fs from 'fs'
import path from 'path'

export interface SteamGame {
  appId: string
  name: string
  installDir: string
  libraryPath: string // Track where we found it
  executablePath?: string // Path to the main .exe
}

/**
 * Simple VDF/ACF parser for Steam manifests.
 * Extracts "appid", "name", and "installdir".
 */
function parseAcf(content: string): Partial<SteamGame> | null {
  try {
    // Regex: case insensitive, handles tabs/spaces/quotes
    const appIdMatch = content.match(/"appid"\s+"?(\d+)"?/i)
    // eslint-disable-next-line no-useless-escape
    const nameMatch = content.match(/"name"\s+"?([^\"]+)"?/i)
    // eslint-disable-next-line no-useless-escape
    const installDirMatch = content.match(/"installdir"\s+"?([^\"]+)"?/i)

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
    // 1. Recursive search for .exe files (limit depth to avoid taking too long)
    const candidates: { path: string; size: number; name: string }[] = []

    async function scanDir(dir: string, depth: number): Promise<void> {
      // Increased depth to 4 to handle Unreal Engine games (Root -> GameName -> Binaries -> Win64 -> Exe)
      if (depth > 4) return

      const entries = await fs.promises.readdir(dir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name)
        if (entry.isDirectory()) {
          // Skip common junk folders
          const lower = entry.name.toLowerCase()
          if (
            ![
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
            ].includes(lower)
          ) {
            await scanDir(fullPath, depth + 1)
          }
        } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.exe')) {
          // Filter out junk exes
          const lowerName = entry.name.toLowerCase()
          if (
            lowerName.includes('unins') ||
            lowerName.includes('setup') ||
            lowerName.includes('crash') ||
            lowerName.includes('update') ||
            lowerName.includes('helper') ||
            lowerName.includes('redist') ||
            lowerName.includes('dxwebsetup') ||
            lowerName.includes('vcredist') ||
            lowerName.includes('unitycrashhandler') ||
            lowerName.includes('ue4prereq')
          ) {
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

      // Rule 1: Exact match with Folder Name (Strongest signal usually)
      // e.g. Folder: "P5R", Exe: "P5R.exe"
      if (sanitizedExeName === sanitizedFolderName) {
        score += 1000
      } else if (
        sanitizedExeName.includes(sanitizedFolderName) ||
        sanitizedFolderName.includes(sanitizedExeName)
      ) {
        score += 100
      }

      // Rule 2: Similarity to Game Name
      if (
        sanitizedGameName.includes(sanitizedExeName) ||
        sanitizedExeName.includes(sanitizedGameName)
      ) {
        score += 50
      }

      // Rule 3: File Size (Larger is better)
      score += c.size / 1024 / 1024 // +1 point per MB

      // Rule 4: "Launcher" penalty (unless it's the only one)
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

export async function scanSteamLibrary(inputPath: string): Promise<SteamGame[]> {
  console.log(`[SteamScanner] Scanning input: ${inputPath}`)
  const allGames: SteamGame[] = []
  const pathsToScan: Set<string> = new Set()

  // 1. Intelligent Path Detection
  // Check the input path itself
  pathsToScan.add(inputPath)

  // Check 'steamapps' subdirectory (Standard structure)
  pathsToScan.add(path.join(inputPath, 'steamapps'))

  // Check parent (if user selected 'steamapps')
  if (path.basename(inputPath).toLowerCase() === 'steamapps') {
    pathsToScan.add(path.dirname(inputPath))
  }
  // Check parent's parent (if user selected 'common')
  if (path.basename(inputPath).toLowerCase() === 'common') {
    pathsToScan.add(path.join(inputPath, '../../'))
    pathsToScan.add(path.join(inputPath, '../'))
  }

  // 2. Try to find other library folders from libraryfolders.vdf
  // This usually only lives in the MAIN Steam folder (e.g. C:\Program Files\Steam\steamapps)
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
        // Regex to find "path" "C:\\Path\\To\\Lib"
        // eslint-disable-next-line no-useless-escape
        const matches = vdfContent.matchAll(/"path"\s+"([^\"]+)"/g)
        for (const match of matches) {
          // Unescape double backslashes
          // Fix: Replace double backslashes with single backslash
          const libPath = match[1].replace(/\\\\/g, '\\')
          if (fs.existsSync(libPath)) {
            // Add the library path AND its steamapps subdir
            pathsToScan.add(libPath)
            pathsToScan.add(path.join(libPath, 'steamapps'))
          }
        }
      } catch (error) {
        console.warn('Steam Scanner: Failed to parse libraryfolders.vdf', error)
      }
    }
  }

  // 3. Scan ALL identified paths for .ACF files
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
          // Skip Steamworks tools
          if (
            gameData.name === 'Steamworks Common Redistributables' ||
            gameData.name.includes('Steamworks')
          )
            continue

          // Deduplicate
          if (!allGames.some((g) => g.appId === gameData.appId)) {
            // Try to resolve full path to executable
            let fullInstallDir = ''
            let executablePath = ''

            if (gameData.installDir) {
              // The game folder is inside 'common' which is inside 'steamapps' (scanDir)
              fullInstallDir = path.join(scanDir, 'common', gameData.installDir)

              // Double check if 'common' exists, sometimes scanDir is not steamapps but just a folder with ACFs?
              // Standard: .../SteamLibrary/steamapps/*.acf
              // Games: .../SteamLibrary/steamapps/common/GameName

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
