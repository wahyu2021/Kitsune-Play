import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type InputMethod = 'mouse' | 'keyboard' | 'gamepad'

interface InputContextType {
  inputMethod: InputMethod
  setInputMethod: (method: InputMethod) => void
  isFocusVisible: boolean
}

const InputContext = createContext<InputContextType | undefined>(undefined)

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

  // Gamepad activation is handled manually by the consumer (useGamepad hook)
  // to avoid polling logic duplication here.

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

export function useInput(): InputContextType {
  const context = useContext(InputContext)
  if (context === undefined) {
    throw new Error('useInput must be used within an InputProvider')
  }
  return context
}
