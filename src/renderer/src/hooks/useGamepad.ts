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
  onSelect: () => void
  onBack: () => void
  onSearch: () => void
  onTabSwitch: () => void
}

/**
 * Handles gamepad input via requestAnimationFrame polling.
 *
 * Button mappings (Standard Layout):
 * - D-Pad/Left Stick: Navigation
 * - A/Cross: Select
 * - B/Circle: Back
 * - Y/Triangle: Search
 * - L1/R1: Tab Switch
 *
 * @param handlers - Callback functions for each action
 * @param isEnabled - Enable/disable input processing
 */
export function useGamepad(handlers: GamepadHandlers, isEnabled: boolean = true): void {
  const { setInputMethod } = useInput()

  const lastInputTime = useRef<number>(0)
  const lastButtonState = useRef<Record<number, boolean>>({})

  const THRESHOLD_STICK = 0.5
  const COOLDOWN_NAV = 150
  const COOLDOWN_ACTION = 300

  useEffect(() => {
    let animationFrameId: number

    const scanGamepad = (): void => {
      if (!isEnabled) return

      const gamepads = navigator.getGamepads()
      const gp = gamepads[0]

      if (gp) {
        const now = Date.now()
        const timeSinceLastInput = now - lastInputTime.current
        let hasInput = false

        if (timeSinceLastInput > COOLDOWN_NAV) {
          const axisX = gp.axes[0]
          const dpadLeft = gp.buttons[14]?.pressed
          const dpadRight = gp.buttons[15]?.pressed

          if (axisX < -THRESHOLD_STICK || dpadLeft) {
            handlers.onNavigateLeft()
            lastInputTime.current = now
            hasInput = true
          } else if (axisX > THRESHOLD_STICK || dpadRight) {
            handlers.onNavigateRight()
            lastInputTime.current = now
            hasInput = true
          }
        }

        const checkButton = (index: number, callback: () => void): void => {
          const isPressed = gp.buttons[index]?.pressed
          const wasPressed = lastButtonState.current[index] || false

          if (isPressed && !wasPressed && now - lastInputTime.current > COOLDOWN_ACTION) {
            callback()
            lastInputTime.current = now
            hasInput = true
          }

          lastButtonState.current[index] = isPressed
        }

        checkButton(0, handlers.onSelect)
        checkButton(1, handlers.onBack)
        checkButton(3, handlers.onSearch)
        checkButton(4, handlers.onTabSwitch)
        checkButton(5, handlers.onTabSwitch)

        if (hasInput) {
          setInputMethod('gamepad')
        }
      }

      animationFrameId = requestAnimationFrame(scanGamepad)
    }

    animationFrameId = requestAnimationFrame(scanGamepad)

    return () => cancelAnimationFrame(animationFrameId)
  }, [handlers, isEnabled, setInputMethod])

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
