'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SessionProvider } from 'next-auth/react'

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isDashboard = pathname?.startsWith('/dashboard')

  return (
    <SessionProvider>
      {!isDashboard && <Header />}
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      {!isDashboard && <Footer />}
    </SessionProvider>
  )
} 