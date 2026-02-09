/**
 * @fileoverview Gamepad/Controller input handling hook.
 * @module renderer/hooks/useGamepad
 */

import { useEffect, useRef } from 'react'
import { logger } from '@/utils/logger'
import { useInput } from '@/context/useInput'

interface GamepadHandlers {
  onNavigateLeft: () => void
  onNavigateRight: () => void
  onNavigateUp?: () => void
  onNavigateDown?: () => void
  onSelect: () => void
  onBack: () => void
  onSearch: () => void
  onTabSwitch: () => void
  onToggleHidden?: () => void
  onCycleSort?: () => void
}

/**
 * Handles gamepad input via requestAnimationFrame polling.
 *
 * Button mappings (Standard Layout):
 * - D-Pad/Left Stick: Navigation
 * - A/Cross: Select
 * - B/Circle: Back
 * - X/Square: Cycle Sort
 * - Y/Triangle: Search
 * - L1/R1: Tab Switch
 * - Start/Options: Toggle Hidden
 *
 * @param handlers - Callback functions for each action
 * @param isEnabled - Enable/disable input processing
 */
export function useGamepad(handlers: GamepadHandlers, isEnabled: boolean = true): void {
  const { setInputMethod } = useInput()

  // Use ref for handlers to avoid stale closures in animation frame
  const handlersRef = useRef<GamepadHandlers>(handlers)
  const lastInputTime = useRef<number>(0)
  const lastButtonState = useRef<Record<number, boolean>>({})

  const THRESHOLD_STICK = 0.5
  const COOLDOWN_NAV = 150
  const COOLDOWN_ACTION = 300

  // Keep handlers ref up-to-date
  useEffect(() => {
    handlersRef.current = handlers
  }, [handlers])

  useEffect(() => {
    let animationFrameId: number

    const scanGamepad = (): void => {
      if (!isEnabled) {
        animationFrameId = requestAnimationFrame(scanGamepad)
        return
      }

      const gamepads = navigator.getGamepads()
      // Prefer XInput gamepad (Xbox 360 Controller from XOutput) over raw DirectInput
      const gp =
        gamepads.find((g) => g && g.id.toLowerCase().includes('xbox')) ||
        gamepads.find((g) => g && g.id.toLowerCase().includes('xinput')) ||
        gamepads[0]

      if (gp) {
        const now = Date.now()
        const timeSinceLastInput = now - lastInputTime.current
        let hasInput = false
        const currentHandlers = handlersRef.current

        if (timeSinceLastInput > COOLDOWN_NAV) {
          // Left analog stick
          const axisX = gp.axes[0] ?? 0
          const axisY = gp.axes[1] ?? 0

          // Some controllers use axes 6/7 or 9 for D-pad
          // axes[9] is often used for hat switch (D-pad as single axis)
          const dpadAxisX = gp.axes[6] ?? 0
          const dpadAxisY = gp.axes[7] ?? 0

          // Standard button D-pad (check both pressed and value for analog buttons)
          const dpadUp = gp.buttons[12]?.pressed || (gp.buttons[12]?.value ?? 0) > 0.5
          const dpadDown = gp.buttons[13]?.pressed || (gp.buttons[13]?.value ?? 0) > 0.5
          const dpadLeft = gp.buttons[14]?.pressed || (gp.buttons[14]?.value ?? 0) > 0.5
          const dpadRight = gp.buttons[15]?.pressed || (gp.buttons[15]?.value ?? 0) > 0.5

          // Combine all navigation inputs
          const moveLeft = axisX < -THRESHOLD_STICK || dpadAxisX < -THRESHOLD_STICK || dpadLeft
          const moveRight = axisX > THRESHOLD_STICK || dpadAxisX > THRESHOLD_STICK || dpadRight
          const moveUp = axisY < -THRESHOLD_STICK || dpadAxisY < -THRESHOLD_STICK || dpadUp
          const moveDown = axisY > THRESHOLD_STICK || dpadAxisY > THRESHOLD_STICK || dpadDown

          if (moveLeft) {
            currentHandlers.onNavigateLeft()
            lastInputTime.current = now
            hasInput = true
          } else if (moveRight) {
            currentHandlers.onNavigateRight()
            lastInputTime.current = now
            hasInput = true
          } else if (moveUp) {
            if (currentHandlers.onNavigateUp) currentHandlers.onNavigateUp()
            lastInputTime.current = now
            hasInput = true
          } else if (moveDown) {
            if (currentHandlers.onNavigateDown) currentHandlers.onNavigateDown()
            lastInputTime.current = now
            hasInput = true
          }
        }

        const checkButton = (index: number, callback?: () => void): void => {
          if (!callback) return
          const isPressed = gp.buttons[index]?.pressed
          const wasPressed = lastButtonState.current[index] || false

          if (isPressed && !wasPressed && now - lastInputTime.current > COOLDOWN_ACTION) {
            callback()
            lastInputTime.current = now
            hasInput = true
          }

          lastButtonState.current[index] = isPressed
        }

        checkButton(0, currentHandlers.onSelect)
        checkButton(1, currentHandlers.onBack)
        checkButton(2, currentHandlers.onCycleSort) // X / Square
        checkButton(3, currentHandlers.onSearch)
        checkButton(4, currentHandlers.onTabSwitch)
        checkButton(5, currentHandlers.onTabSwitch)
        checkButton(9, currentHandlers.onToggleHidden) // Start / Options

        if (hasInput) {
          setInputMethod('gamepad')
          // Dispatch event to reset idle timer
          window.dispatchEvent(new CustomEvent('gamepadactivity'))
        }
      }

      animationFrameId = requestAnimationFrame(scanGamepad)
    }

    animationFrameId = requestAnimationFrame(scanGamepad)

    return () => cancelAnimationFrame(animationFrameId)
  }, [isEnabled, setInputMethod])

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
