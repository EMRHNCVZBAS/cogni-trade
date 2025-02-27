'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  ChartBarIcon, 
  NewspaperIcon, 
  CurrencyDollarIcon, 
  ChartPieIcon, 
  BellAlertIcon,
  BeakerIcon,
  UserCircleIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    title: 'AI News Analysis',
    description: 'Get sentiment analysis scores from 50+ sources using FinBERT.',
    icon: BeakerIcon,
    gradient: 'from-purple-500 to-pink-500'
  },
  {
    title: 'CoinMarketCap Data',
    description: '5-minute delayed CoinMarketCap price, volume, and market data.',
    icon: ChartBarIcon,
    gradient: 'from-primary to-green-300'
  },
  {
    title: 'Technical Indicators',
    description: 'Interactive charts with RSI, MACD, Bollinger Bands, and more.',
    icon: ArrowTrendingUpIcon,
    gradient: 'from-secondary to-blue-300'
  },
  {
    title: 'Personalized Dashboard',
    description: 'Track your portfolio and create custom alerts.',
    icon: UserCircleIcon,
    gradient: 'from-orange-500 to-yellow-500'
  },
  {
    title: 'Smart Alerts',
    description: 'Get notifications for price changes or AI signals.',
    icon: BellAlertIcon,
    gradient: 'from-red-500 to-pink-500'
  }
]

const Features = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <motion.h2 
              className="text-4xl md:text-5xl font-bold font-heading mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              The Future of Trading is Shaped by CogniTrade
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-400 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Take your trading experience to the next level with AI-powered analysis,
              real-time market data, and advanced technical indicators.
            </motion.p>
            <motion.p
              className="text-lg text-gray-500"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Over 50,000 traders are making more informed and profitable trades with CogniTrade's advantages.
              Be part of this success story.
            </motion.p>
          </motion.div>
        </div>

        {/* Smart Trading Features */}
        <motion.div 
          className="max-w-5xl mx-auto text-center bg-dark-lighter/40 backdrop-blur-sm rounded-2xl p-12 border border-gray-800 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="space-y-8">
            <motion.h3 
              className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Powerful Features with Smart Trading
            </motion.h3>
            
            <motion.div 
              className="grid md:grid-cols-2 gap-8 text-left"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white">AI Power</h4>
                <p className="text-gray-400">
                  Our FinBERT-based sentiment analysis engine analyzes news and social media trends in real-time.
                  With 89% accuracy, it helps you predict market direction in advance.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white">Advanced Technical Analysis</h4>
                <p className="text-gray-400">
                  Optimize your trading strategies with real-time price data through Binance API integration,
                  customizable technical indicators, and professional charting tools.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white">Smart Portfolio Management</h4>
                <p className="text-gray-400">
                  Secure your investments with risk management tools, automatic stop-loss suggestions,
                  and portfolio diversification recommendations.
                </p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-white">24/7 Support and Education</h4>
                <p className="text-gray-400">
                  We're here to support your trading journey with comprehensive educational materials,
                  webinars, and professional support team.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features 