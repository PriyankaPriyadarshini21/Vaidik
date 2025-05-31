'use client'

import { useAuthMiddleware } from '@/middleware'
import Navigation from './navigation'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  useAuthMiddleware()

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-6">
        {children}
      </main>
    </div>
  )
} 