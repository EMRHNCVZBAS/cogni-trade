'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import DashboardPreview from '@/components/DashboardPreview'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Dashboard() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    // Simulated loading
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Redirect to login page if no session
  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }
  
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Welcome, {session?.user?.name || 'User'}
            </h1>
            <p className="text-gray-400 mt-1">
              Last update: {new Date().toLocaleString('en-US')}
            </p>
          </div>
          
          <Link href="/dashboard/subscribe">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-lg shadow-lg"
            >
              <span>Upgrade to Premium</span>
              <ArrowRightIcon className="w-4 h-4" />
            </motion.button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-dark-lighter/30 via-dark-darker/40 to-dark-lighter/20 backdrop-blur-lg p-6 rounded-xl border border-dark-lighter/30 shadow-xl">
            <h3 className="text-lg font-medium mb-3">Portfolio Value</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              $0.00
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Upgrade to premium to create your portfolio
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-dark-lighter/30 via-dark-darker/40 to-dark-lighter/20 backdrop-blur-lg p-6 rounded-xl border border-dark-lighter/30 shadow-xl">
            <h3 className="text-lg font-medium mb-3">Active Alerts</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              0
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Upgrade to premium to create price alerts
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-dark-lighter/30 via-dark-darker/40 to-dark-lighter/20 backdrop-blur-lg p-6 rounded-xl border border-dark-lighter/30 shadow-xl">
            <h3 className="text-lg font-medium mb-3">AI Recommendations</h3>
            <p className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Locked
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Upgrade to premium to see AI recommendations
            </p>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Market Summary</h2>
          <DashboardPreview />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-dark-lighter/30 via-dark-darker/40 to-dark-lighter/20 backdrop-blur-lg p-6 rounded-xl border border-dark-lighter/30 shadow-xl">
            <h3 className="text-lg font-medium mb-4">Latest News</h3>
            <div className="space-y-4">
              <div className="p-4 bg-dark-darker/40 rounded-lg">
                <p className="text-gray-400 text-sm">Premium subscription required</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-dark-lighter/30 via-dark-darker/40 to-dark-lighter/20 backdrop-blur-lg p-6 rounded-xl border border-dark-lighter/30 shadow-xl">
            <h3 className="text-lg font-medium mb-4">Community Sentiment</h3>
            <div className="p-4 bg-dark-darker/40 rounded-lg">
              <p className="text-gray-400 text-sm">Premium subscription required</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 