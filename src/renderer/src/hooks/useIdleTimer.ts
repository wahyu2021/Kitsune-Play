/**
 * @fileoverview User inactivity detection hook.
 * @module renderer/hooks/useIdleTimer
 */

import { useState, useEffect, useRef } from 'react'

/**
 * Tracks user inactivity based on mouse, keyboard, click, and gamepad events.
 * @param timeoutMs - Idle timeout in milliseconds (default: 8000)
 * @returns Whether the user is currently idle
 */
export function useIdleTimer(timeoutMs: number = 8000): boolean {
  const [isIdle, setIsIdle] = useState(false)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const resetIdleTimer = (): void => {
      setIsIdle(false)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
      idleTimerRef.current = setTimeout(() => setIsIdle(true), timeoutMs)
    }

    window.addEventListener('mousemove', resetIdleTimer)
    window.addEventListener('keydown', resetIdleTimer)
    window.addEventListener('click', resetIdleTimer)
    window.addEventListener('gamepadactivity', resetIdleTimer)

    resetIdleTimer()

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer)
      window.removeEventListener('keydown', resetIdleTimer)
      window.removeEventListener('click', resetIdleTimer)
      window.removeEventListener('gamepadactivity', resetIdleTimer)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [timeoutMs])

  return isIdle
}
