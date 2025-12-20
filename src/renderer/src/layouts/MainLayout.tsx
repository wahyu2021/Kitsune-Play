/**
 * @fileoverview Main layout wrapper component.
 * @module renderer/layouts/MainLayout
 */

import { ReactNode, ReactElement } from 'react'

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

/** Full-screen layout wrapper with base styling. */
export default function MainLayout({ children, className = '' }: MainLayoutProps): ReactElement {
  return (
    <div
      className={`h-screen w-screen overflow-hidden bg-[#0f0f0f] font-sans text-white selection:bg-transparent ${className}`}
    >
      {children}
    </div>
  )
}
