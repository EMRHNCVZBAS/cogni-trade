'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CircleStackIcon, CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

const Hero = () => {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-50" />
      
      {/* Main Content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          className="w-full max-w-6xl mx-auto px-4 text-center relative pt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{
            transform: `translateY(${scrollY * 0.2}px)`,
          }}
        >
          <motion.div
            className="mb-12 pb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent leading-[1.5] tracking-normal">
              Trade Smarter<br />
              <span className="inline-block py-2">with CogniTrade</span>
            </h1>
          </motion.div>
          
          <motion.p 
            className="text-xl sm:text-2xl md:text-3xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Empower your trades with CogniTrade, blending sentiment analysis and live market data for razor-sharp decisions.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center items-center gap-8 mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Link
              href="/trial"
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white px-16 py-6 rounded-lg text-xl font-semibold transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20"
            >
              Try for Free
            </Link>
            
            <Link
              href="/demo"
              className="w-full sm:w-auto bg-dark-lighter hover:bg-dark-DEFAULT text-white px-16 py-6 rounded-lg text-xl font-semibold transition-all transform hover:scale-105 border border-secondary/30 hover:shadow-lg hover:shadow-secondary/20"
            >
              Watch Demo
            </Link>
          </motion.div>
          
          <motion.div 
            className="flex justify-end mt-8 px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <p className="text-gray-400 inline-flex items-center gap-2 text-lg">
              <span className="w-3 h-3 bg-primary rounded-full animate-pulse" />
              1,000+ traders already joined
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, 10, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-2 bg-white/30 rounded-full mt-2" />
        </div>
      </motion.div>
    </section>
  )
}

export default Hero 