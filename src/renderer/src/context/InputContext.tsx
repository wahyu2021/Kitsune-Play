/**
 * @fileoverview Input method detection provider component.
 * Tracks whether user is using mouse, keyboard, or gamepad.
 * @module renderer/context/InputContext
 */

import React, { useEffect, useState, useCallback } from 'react'
import { InputContext, InputMethod } from './inputTypes'

/** Provider for tracking current input method across the application. */
export function InputProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [inputMethod, setInputMethod] = useState<InputMethod>('mouse')

  const handleMouseMove = useCallback(() => {
    if (inputMethod !== 'mouse') {
      setInputMethod('mouse')
    }
  }, [inputMethod])

  const handleKeyDown = useCallback(() => {
    if (inputMethod !== 'keyboard') {
      setInputMethod('keyboard')
    }
  }, [inputMethod])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleMouseMove, handleKeyDown])

  return (
    <InputContext.Provider
      value={{
        inputMethod,
        setInputMethod,
        isFocusVisible: inputMethod !== 'mouse'
      }}
    >
      {children}
    </InputContext.Provider>
  )
}
