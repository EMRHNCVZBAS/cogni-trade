'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  ChartBarIcon, 
  UserIcon, 
  CreditCardIcon,
  WalletIcon,
  NewspaperIcon,
  Bars3Icon, 
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline'
import { signOut } from 'next-auth/react'
import Image from 'next/image'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  
  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Analysis', href: '/dashboard/analysis', icon: ChartBarIcon },
    { name: 'Portfolio', href: '/dashboard/portfolio', icon: WalletIcon },
    { name: 'News', href: '/dashboard/news', icon: NewspaperIcon },
    { name: 'Profile', href: '/dashboard/profile', icon: UserIcon },
    { name: 'Subscription', href: '/dashboard/subscribe', icon: CreditCardIcon },
  ]
  
  const isActive = (path: string) => {
    return pathname === path
  }
  
  return (
    <div className="min-h-screen bg-dark">
      {/* Mobile Header */}
      <div className="lg:hidden bg-dark-darker border-b border-dark-lighter/20 p-4 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={36}
              className="h-auto"
            />
          </Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-dark-lighter/20 text-gray-400"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-dark-darker border-b border-dark-lighter/20 py-4 px-6 shadow-xl"
          >
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link 
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    isActive(item.href) 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-dark-lighter/20 text-gray-400'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              ))}
              
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-dark-lighter/20 text-gray-400"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </nav>
          </motion.div>
        )}
      </div>
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-64 min-h-screen bg-dark-darker border-r border-dark-lighter/20 p-6 sticky top-0">
          <div className="mb-8">
            <Link href="/">
              <Image
                src="/logo.png"
                alt="Logo"
                width={150}
                height={45}
                className="h-auto"
              />
            </Link>
          </div>
          
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  isActive(item.href) 
                    ? 'bg-primary/20 text-primary' 
                    : 'hover:bg-dark-lighter/20 text-gray-400'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pt-6 border-t border-dark-lighter/20">
            <button 
              onClick={() => signOut({ callbackUrl: '/' })}
              className="flex items-center space-x-3 p-3 rounded-lg transition-all hover:bg-dark-lighter/20 text-gray-400 w-full"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
} 