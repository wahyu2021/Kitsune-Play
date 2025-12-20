import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useGameLauncher } from './useGameLauncher'
import { Game } from '@/features/library/types'

const mockGame: Game = {
  id: '1',
  title: 'Test Game',
  description: '',
  genre: '',
  path_to_exe: 'C:/test.exe',
  cover_image: '',
  bg_image: '',
  launchArgs: '-test'
}

describe('useGameLauncher Hook', () => {
  it('calls window.api.launchGame when triggered', async () => {
    // Mock handlers
    const updateTime = vi.fn()
    const showToast = vi.fn()

    // Mock successful launch return value (duration 60 mins)
    vi.mocked(window.api.launchGame).mockResolvedValue(60)

    const { result } = renderHook(() =>
      useGameLauncher({ updateGamePlaytime: updateTime, showToast })
    )

    // Initially not playing
    expect(result.current.isPlaying).toBe(false)

    // Act: Launch Game
    await act(async () => {
      await result.current.launchGame(mockGame)
    })

    // Assert: API called with correct args
    expect(window.api.launchGame).toHaveBeenCalledWith(
      'C:/test.exe',
      'Test Game',
      '-test',
      undefined
    )

    // Assert: Callback logic
    expect(updateTime).toHaveBeenCalledWith('1', 60)
    expect(showToast).toHaveBeenCalledWith(expect.stringContaining('Played for 60 mins'), 'info')
  })

  it('handles launch failure gracefully', async () => {
    const updateTime = vi.fn()
    const showToast = vi.fn()

    // Mock failure
    vi.mocked(window.api.launchGame).mockRejectedValue(new Error('Process crashed'))

    const { result } = renderHook(() =>
      useGameLauncher({ updateGamePlaytime: updateTime, showToast })
    )

    await act(async () => {
      await result.current.launchGame(mockGame)
    })

    // Assert: Error toast
    expect(showToast).toHaveBeenCalledWith('Failed: Process crashed', 'error')
    // Assert: Playtime NOT updated
    expect(updateTime).not.toHaveBeenCalled()
  })
})
