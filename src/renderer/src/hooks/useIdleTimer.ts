import { useState, useEffect, useRef } from 'react'

/**
 * Custom hook to track user inactivity.
 *
 * @param timeoutMs - Time in milliseconds before considering the user idle (default: 8000ms).
 * @returns boolean - True if the user is idle, false otherwise.
 */
export function useIdleTimer(timeoutMs: number = 8000): boolean {
  const [isIdle, setIsIdle] = useState(false)
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null)

  const resetIdleTimer = (): void => {
    setIsIdle(false)
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = setTimeout(() => setIsIdle(true), timeoutMs)
  }

  useEffect(() => {
    // Attach listeners to detect activity
    window.addEventListener('mousemove', resetIdleTimer)
    window.addEventListener('keydown', resetIdleTimer)
    window.addEventListener('click', resetIdleTimer)

    // Start the timer initially
    resetIdleTimer()

    // Cleanup listeners on unmount
    return () => {
      window.removeEventListener('mousemove', resetIdleTimer)
      window.removeEventListener('keydown', resetIdleTimer)
      window.removeEventListener('click', resetIdleTimer)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    }
  }, [timeoutMs])

  return isIdle
}
