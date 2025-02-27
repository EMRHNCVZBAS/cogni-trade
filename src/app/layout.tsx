import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import LayoutClient from '@/components/LayoutClient'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins'
})

export const metadata: Metadata = {
  title: 'CogniTrade - AI-Powered Crypto Analysis Platform',
  description: 'CogniTrade is a modern platform that enhances your crypto trading experience with AI-powered sentiment analysis and real-time market data.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.variable} ${poppins.variable} font-sans bg-dark-DEFAULT text-white flex flex-col min-h-screen`}>
        <LayoutClient>
          {children}
        </LayoutClient>
      </body>
    </html>
  )
}
