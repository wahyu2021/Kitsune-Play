import { ReactNode } from 'react'

interface MainLayoutProps {
  children: ReactNode
  className?: string
}

export default function MainLayout({ children, className = '' }: MainLayoutProps) {
  return (
    <div className={`h-screen w-screen overflow-hidden bg-[#0f0f0f] font-sans text-white selection:bg-transparent ${className}`}>
      {children}
    </div>
  )
}
