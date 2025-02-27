'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    setIsMenuOpen(false) // Close mobile menu
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <header className="fixed w-full top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="w-full px-0 header-glow py-4">
        <nav className="flex items-center justify-between h-24">
          {/* Logo */}
          <button onClick={() => scrollToSection('hero')} className="relative group">
            <div 
              className="w-64 h-24 bg-contain bg-left bg-no-repeat ml-16"
              style={{ backgroundImage: 'url(/logo.png)' }}
            />
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 pr-16">
            <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors text-xl text-glow">
              Features
            </button>
            <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-white transition-colors text-xl text-glow">
              Pricing
            </button>
            <button onClick={() => scrollToSection('demo')} className="text-gray-300 hover:text-white transition-colors text-xl text-glow">
              Demo
            </button>
            <Link
              href="/auth/login"
              className="text-gray-300 hover:text-white transition-colors text-xl text-glow"
            >
              Login
            </Link>
            <button
              onClick={() => scrollToSection('pricing')}
              className="bg-primary/20 hover:bg-primary/30 text-white px-10 py-4 rounded-lg transition-all text-xl font-medium card-glow"
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <button onClick={() => scrollToSection('features')} className="text-gray-300 hover:text-white transition-colors">
                Features
              </button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-300 hover:text-white transition-colors">
                Pricing
              </button>
              <button onClick={() => scrollToSection('demo')} className="text-gray-300 hover:text-white transition-colors">
                Demo
              </button>
              <Link href="/auth/login" className="text-gray-300 hover:text-white transition-colors">
                Login
              </Link>
              <button
                onClick={() => scrollToSection('pricing')}
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-lg transition-colors text-center"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 