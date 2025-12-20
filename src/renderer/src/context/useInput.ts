/**
 * @fileoverview Hook for accessing input method context.
 * @module renderer/context/useInput
 */

import { useContext } from 'react'
import { InputContext, InputContextType } from './inputTypes'

/** Hook to access current input method (mouse/keyboard/gamepad). */
export function useInput(): InputContextType {
  const context = useContext(InputContext)
  if (context === undefined) {
    throw new Error('useInput must be used within an InputProvider')
  }
  return context
}
