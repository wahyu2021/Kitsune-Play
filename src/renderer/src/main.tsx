import './assets/main.css'

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
