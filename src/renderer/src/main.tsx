/**
 * @fileoverview Application entry point.
 * Initializes React root and wraps App with providers.
 * @module renderer/main
 */

import './assets/main.css'
import './i18n'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { InputProvider } from '@/context/InputContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <InputProvider>
      <App />
    </InputProvider>
  </StrictMode>
)
