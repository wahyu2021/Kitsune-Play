import { useEffect, useRef } from 'react'
import { logger } from '@/utils/logger'

interface GamepadHandlers {
  onNavigateLeft: () => void
  onNavigateRight: () => void
  onSelect: () => void
  onBack: () => void
  onSearch: () => void
  onTabSwitch: () => void
}

/**
 * Custom hook to handle Gamepad/Controller interactions.
 * Uses requestAnimationFrame to poll the Gamepad API state.
 * Implements debounce/throttling to prevent rapid-fire inputs.
 *
 * Mappings (Standard Layout):
 * - D-Pad Left / Left Stick Left: Navigate Left
 * - D-Pad Right / Left Stick Right: Navigate Right
 * - Button A / Cross: Select
 * - Button B / Circle: Back
 * - Button Y / Triangle: Search
 * - L1 / R1: Tab Switch
 *
 * @param handlers - Object containing callback functions for specific actions.
 * @param isEnabled - Boolean to globally enable/disable input (e.g., when window is blurred).
 */
export function useGamepad(handlers: GamepadHandlers, isEnabled: boolean = true): void {
  // Refs to track input timing for throttling (cooldown)
  const lastInputTime = useRef<number>(0)
  const lastButtonState = useRef<Record<number, boolean>>({})

  // Constants
  const THRESHOLD_STICK = 0.5 // Analog deadzone
  const COOLDOWN_NAV = 150 // ms between navigation moves (scrolling)
  const COOLDOWN_ACTION = 300 // ms between button presses (actions)

  useEffect(() => {
    let animationFrameId: number

    const scanGamepad = (): void => {
      if (!isEnabled) return

      // Get active gamepads (usually index 0 is the primary controller)
      const gamepads = navigator.getGamepads()
      const gp = gamepads[0] // Focus on Player 1 for now

      if (gp) {
        const now = Date.now()
        const timeSinceLastInput = now - lastInputTime.current

        // --- Navigation (Left/Right) - Throttled ---
        if (timeSinceLastInput > COOLDOWN_NAV) {
          const axisX = gp.axes[0] // Left Stick X
          const dpadLeft = gp.buttons[14]?.pressed
          const dpadRight = gp.buttons[15]?.pressed

          if (axisX < -THRESHOLD_STICK || dpadLeft) {
            handlers.onNavigateLeft()
            lastInputTime.current = now
          } else if (axisX > THRESHOLD_STICK || dpadRight) {
            handlers.onNavigateRight()
            lastInputTime.current = now
          }
        }

        // --- Actions (Buttons) - State Locked (Press once) ---
        // We handle these differently: Action triggers on "Press Down" edge, not hold.

        const checkButton = (index: number, callback: () => void): void => {
          const isPressed = gp.buttons[index]?.pressed
          const wasPressed = lastButtonState.current[index] || false

          if (isPressed && !wasPressed && now - lastInputTime.current > COOLDOWN_ACTION) {
            callback()
            lastInputTime.current = now
          }

          lastButtonState.current[index] = isPressed
        }

        checkButton(0, handlers.onSelect) // A / Cross
        checkButton(1, handlers.onBack) // B / Circle
        checkButton(3, handlers.onSearch) // Y / Triangle
        checkButton(4, handlers.onTabSwitch) // L1 (Bumper Left)
        checkButton(5, handlers.onTabSwitch) // R1 (Bumper Right)
      }

      animationFrameId = requestAnimationFrame(scanGamepad)
    }

    // Start loop
    animationFrameId = requestAnimationFrame(scanGamepad)

    // Cleanup
    return () => cancelAnimationFrame(animationFrameId)
  }, [handlers, isEnabled])

  // Log connection events
  useEffect(() => {
    const onConnect = (e: GamepadEvent): void =>
      logger.info('System', `Gamepad connected: ${e.gamepad.id}`)
    const onDisconnect = (e: GamepadEvent): void =>
      logger.info('System', `Gamepad disconnected: ${e.gamepad.id}`)

    window.addEventListener('gamepadconnected', onConnect)
    window.addEventListener('gamepaddisconnected', onDisconnect)

    return () => {
      window.removeEventListener('gamepadconnected', onConnect)
      window.removeEventListener('gamepaddisconnected', onDisconnect)
    }
  }, [])
}
