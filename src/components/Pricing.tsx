'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/solid'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface Plan {
  id: string
  name: string
  price: string
  yearlyPrice?: string
  features: string[]
  popular?: boolean
}

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true)
  const router = useRouter()
  const { data: session, status } = useSession()

  const plans: Plan[] = [
    {
      id: 'basic',
      name: 'Basic',
      price: isAnnual ? '49.99' : '4.99',
      yearlyPrice: '59.88',
      features: [
        '5 cryptocurrencies tracking',
        '1 technical indicator',
        'Daily AI news analysis',
        'Basic portfolio tracking',
        'Email support'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: isAnnual ? '149.99' : '14.99',
      yearlyPrice: '179.88',
      features: [
        'Unlimited cryptocurrency tracking',
        '5 technical indicators',
        'Real-time AI analysis',
        'Advanced portfolio management',
        'Priority support'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: isAnnual ? '499.99' : '49.99',
      yearlyPrice: '599.88',
      features: [
        'Custom AI models',
        'Unlimited API access',
        'All technical indicators',
        'Custom strategy development',
        '24/7 priority support'
      ]
    }
  ]

  const handlePlanSelect = (planId: string) => {
    // Kullanıcı giriş yapmamışsa, giriş sayfasına yönlendir
    if (status === 'unauthenticated') {
      router.push(`/auth/login?redirect=subscribe`)
      return
    }
    
    // Giriş yapmışsa, abonelik sayfasına yönlendir
    router.push(`/dashboard/subscribe?plan=${planId}&billing=${isAnnual ? 'annual' : 'monthly'}`)
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
            Choose Your Plan
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Pricing options for every need
          </p>

          {/* Price Selector */}
          <motion.div 
            className="flex items-center justify-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative w-16 h-8 rounded-full bg-dark-lighter/50 cursor-pointer transition-colors"
            >
              <motion.div 
                className="absolute w-6 h-6 rounded-full bg-primary top-1"
                animate={{ x: isAnnual ? 36 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
            <div className="flex items-center gap-2">
              <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-400'}`}>Annual</span>
              <motion.span 
                className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full"
                animate={{ scale: isAnnual ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                17% Off
              </motion.span>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative group backdrop-blur-sm bg-dark-lighter/40 rounded-2xl p-8 transition-all duration-300 hover:transform hover:scale-105 ${
                plan.popular ? 'border-2 border-primary shadow-lg shadow-primary/20' : 'border border-gray-800'
              }`}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-b from-primary/5 to-secondary/5 rounded-2xl transition-opacity duration-300" />

              {/* Popular Badge */}
              {plan.popular && (
                <motion.div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <span className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg">
                    Most Popular
                  </span>
                </motion.div>
              )}

              {/* Content */}
              <div className="relative z-10">
                <div className="text-center mb-8">
                  <h3 className="text-xl font-bold mb-4 text-white">{plan.name}</h3>
                  <motion.div 
                    className="flex flex-col items-center gap-2"
                    key={`${plan.price}-${isAnnual}`}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <div className="flex items-center justify-center">
                      <span className="text-sm text-gray-300">$</span>
                      <span className="text-4xl font-bold mx-1 text-white">{plan.price}</span>
                      <span className="text-gray-300">/{isAnnual ? 'year' : 'month'}</span>
                    </div>
                    {isAnnual && (
                      <motion.div 
                        className="flex items-center gap-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <span className="text-sm text-gray-400 line-through">${plan.yearlyPrice}</span>
                        <span className="text-xs text-primary">17% Off</span>
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <motion.li 
                      key={featureIndex} 
                      className="flex items-center text-gray-300 group-hover:text-white/90"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: featureIndex * 0.1 }}
                    >
                      <CheckIcon className="w-5 h-5 text-primary mr-3" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handlePlanSelect(plan.id)}
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg shadow-primary/20'
                      : 'bg-dark-lighter hover:bg-dark-DEFAULT text-white border border-gray-700 hover:border-primary'
                  }`}
                >
                  {status === 'unauthenticated' ? 'Giriş Yap ve Abone Ol' : (isAnnual ? 'Select Annual Plan' : 'Select Monthly Plan')}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="relative overflow-hidden bg-dark-lighter/40 backdrop-blur-sm rounded-xl p-6">
          {/* Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl -m-0.5" />
          
          <div className="relative z-10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left py-4 px-4 text-white">Feature</th>
                  {plans.map((plan, index) => (
                    <th key={index} className="text-center py-4 px-4 text-white">
                      {plan.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-800/50">
                  <td className="py-4 px-4 text-gray-300">Cryptocurrency Tracking</td>
                  <td className="text-center py-4 px-4 text-gray-300">5</td>
                  <td className="text-center py-4 px-4 text-gray-300">Unlimited</td>
                  <td className="text-center py-4 px-4 text-gray-300">Unlimited</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-4 px-4 text-gray-300">Technical Indicators</td>
                  <td className="text-center py-4 px-4 text-gray-300">1</td>
                  <td className="text-center py-4 px-4 text-gray-300">5</td>
                  <td className="text-center py-4 px-4 text-gray-300">All</td>
                </tr>
                <tr className="border-b border-gray-800/50">
                  <td className="py-4 px-4 text-gray-300">AI Analysis</td>
                  <td className="text-center py-4 px-4 text-gray-300">Daily</td>
                  <td className="text-center py-4 px-4 text-gray-300">Real-time</td>
                  <td className="text-center py-4 px-4 text-gray-300">Custom Model</td>
                </tr>
                <tr>
                  <td className="py-4 px-4 text-gray-300">Support</td>
                  <td className="text-center py-4 px-4 text-gray-300">Email</td>
                  <td className="text-center py-4 px-4 text-gray-300">Priority</td>
                  <td className="text-center py-4 px-4 text-gray-300">24/7</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Pricing 