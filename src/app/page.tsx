'use client'

import Hero from '@/components/Hero'
import Features from '@/components/Features'
import DashboardPreview from '@/components/DashboardPreview'
import Pricing from '@/components/Pricing'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

export default function Home() {
  const containerRef = useRef(null)
  const [currentSection, setCurrentSection] = useState('hero')
  const [isLoading, setIsLoading] = useState(true)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'features', 'demo', 'pricing']
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      sections.forEach(section => {
        const element = document.getElementById(section)
        if (element) {
          const { top, bottom } = element.getBoundingClientRect()
          if (top <= windowHeight / 2 && bottom >= windowHeight / 2) {
            setCurrentSection(section)
          }
        }
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Page loading effect
  useEffect(() => {
    setIsLoading(false)
  }, [])

  // Star creation function
  const createStars = (count: number, className: string, style: any = {}) => {
    return [...Array(count)].map((_, i) => (
      <div
        key={i}
        className={className}
        style={{
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          ...style
        }}
      />
    ))
  }

  // Scroll progress bar
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])

  // Section transition animations
  const sectionVariants = {
    hidden: { 
      opacity: 0, 
      y: 100,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 1.2,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    },
    exit: {
      opacity: 0,
      y: -100,
      scale: 0.95,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.05, 0.01, 0.9]
      }
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main 
        className="min-h-screen bg-black text-white overflow-hidden relative" 
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Page Loading Animation */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              className="fixed inset-0 bg-black z-50 flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            >
              <motion.div
                className="w-24 h-24 border-4 border-primary rounded-full border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Progress Bar */}
        <motion.div
          style={{
            scaleX,
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: 'linear-gradient(to right, #38A169, #3182CE)',
            transformOrigin: 'left',
            zIndex: 100
          }}
        />

        {/* Background Lights */}
        <div className="fixed inset-0 overflow-hidden">
          {/* Top left corner light - Green */}
          <motion.div 
            className="absolute -top-[40%] -left-[20%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[128px]"
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Bottom right corner light - Blue */}
          <motion.div 
            className="absolute -bottom-[40%] -right-[20%] w-[80%] h-[80%] bg-secondary/10 rounded-full blur-[128px]"
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 8,
              delay: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          
          {/* Middle section light - Mixed */}
          <motion.div 
            className="absolute top-[30%] left-[40%] w-[40%] h-[40%] bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-[96px]"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10,
              delay: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Main Starry Background */}
        <div className="fixed inset-0 bg-space-gradient overflow-hidden opacity-50">
          {/* Fixed Stars */}
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(1px 1px at 50% 50%, white 100%, transparent)',
            backgroundSize: '4px 4px',
            opacity: 0.2
          }} />
          
          {/* Twinkling Stars */}
          <div className="absolute inset-0">
            {createStars(30, "absolute w-0.5 h-0.5 bg-white rounded-full animate-twinkle")}
          </div>

          {/* Bright Stars */}
          <div className="absolute inset-0">
            {createStars(15, "absolute w-1 h-1 bg-white rounded-full animate-float-star", {
              boxShadow: '0 0 3px 1px rgba(255, 255, 255, 0.3)'
            })}
          </div>

          {/* Shooting Stars */}
          <div className="absolute inset-0">
            {createStars(8, "absolute w-px h-px bg-white animate-shooting-star", {
              boxShadow: '0 0 4px 2px rgba(255, 255, 255, 0.5)'
            })}
          </div>
        </div>

        {/* Page Content */}
        <div className="relative z-10">
          <motion.section 
            id="hero" 
            className="relative min-h-screen"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/50 to-transparent opacity-50 transition-all duration-1000" />
            <Hero />
          </motion.section>

          <motion.section 
            id="features" 
            className="relative min-h-screen"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent opacity-50 transition-all duration-1000" />
            <Features />
          </motion.section>

          <motion.section 
            id="demo" 
            className="relative min-h-screen"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-transparent opacity-50 transition-all duration-1000" />
            <DashboardPreview />
          </motion.section>

          <motion.section 
            id="pricing" 
            className="relative min-h-screen"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            exit="exit"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black opacity-50 transition-all duration-1000" />
            <Pricing />
          </motion.section>
        </div>
      </motion.main>
    </AnimatePresence>
  )
} 