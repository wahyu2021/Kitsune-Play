import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Electron API
window.api = {
  launchGame: vi.fn(),
  updateDiscordStatus: vi.fn(),
  selectFile: vi.fn(),
  selectFolder: vi.fn(),
  scanSteamLibrary: vi.fn(),
  loadData: vi.fn().mockResolvedValue(null),
  saveData: vi.fn(),
  getAppVersion: vi.fn().mockResolvedValue('1.0.0-test'),
  shutdownSystem: vi.fn(),
  restartSystem: vi.fn(),
  sleepSystem: vi.fn(),
  minimize: vi.fn(),
  quit: vi.fn()
}

// Mock IntersectionObserver (needed for Framer Motion / Lazy Loading)
const IntersectionObserverMock = vi.fn(() => ({
  disconnect: vi.fn(),
  observe: vi.fn(),
  takeRecords: vi.fn(),
  unobserve: vi.fn()
}))

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

// Mock window.scroll (used in GameCard)
window.HTMLElement.prototype.scrollIntoView = vi.fn()
