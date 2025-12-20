/**
 * @fileoverview Input method context types and context object.
 * @module renderer/context/inputTypes
 */

import { createContext } from 'react'

export type InputMethod = 'mouse' | 'keyboard' | 'gamepad'

export interface InputContextType {
  inputMethod: InputMethod
  setInputMethod: (method: InputMethod) => void
  isFocusVisible: boolean
}

export const InputContext = createContext<InputContextType | undefined>(undefined)
