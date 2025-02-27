'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface SubscriptionDetails {
  plan: string
  billing: string
  price: string
}

interface PaymentFormData {
  cardNumber: string
  cardName: string
  expiryDate: string
  cvv: string
}

const plans = {
  basic: {
    name: 'Basic',
    monthlyPrice: '4.99',
    yearlyPrice: '49.99',
    features: [
      '5 kripto para takibi',
      '1 teknik gösterge',
      'Günlük AI haber analizi',
      'Temel portföy takibi',
      'E-posta desteği'
    ],
    notIncluded: [
      'Gerçek zamanlı AI analizi',
      'Gelişmiş portföy yönetimi',
      'Özel AI modelleri',
      'API erişimi'
    ]
  },
  pro: {
    name: 'Pro',
    monthlyPrice: '14.99',
    yearlyPrice: '149.99',
    features: [
      'Sınırsız kripto para takibi',
      '5 teknik gösterge',
      'Gerçek zamanlı AI analizi',
      'Gelişmiş portföy yönetimi',
      'Öncelikli destek',
      'Özel bildirimler',
      'Detaylı piyasa analizi'
    ],
    notIncluded: [
      'Özel AI modelleri',
      'Sınırsız API erişimi',
      '7/24 destek'
    ]
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: '49.99',
    yearlyPrice: '499.99',
    features: [
      'Tüm Pro özellikleri',
      'Özel AI modelleri',
      'Sınırsız API erişimi',
      'Tüm teknik göstergeler',
      'Özel strateji geliştirme',
      '7/24 öncelikli destek',
      'Kişisel danışman',
      'Özel rapor ve analizler'
    ],
    notIncluded: []
  }
}

export default function Subscribe() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedPlan, setSelectedPlan] = useState<string>(searchParams.get('plan') || 'basic')
  const [billingCycle, setBillingCycle] = useState<string>(searchParams.get('billing') || 'annual')
  const [step, setStep] = useState<'plan' | 'payment'>('plan')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentForm, setPaymentForm] = useState<PaymentFormData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  })

  const handlePlanSelect = (plan: string) => {
    setSelectedPlan(plan)
  }

  const handleBillingCycleChange = () => {
    setBillingCycle(billingCycle === 'annual' ? 'monthly' : 'annual')
  }

  const handleContinueToPayment = () => {
    setStep('payment')
  }

  const handleDemoPayment = async () => {
    try {
      if (!session?.user?.id) {
        console.error('No user session found')
        return
      }

      setLoading(true)
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: session.user.id,
          plan: selectedPlan,
          startDate: new Date(),
          endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 yıl
        }),
      })

      if (!response.ok) {
        throw new Error('Payment failed')
      }

      router.push('/dashboard/payment-success')
    } catch (error) {
      console.error('Payment error:', error)
      setError('Ödeme işlemi sırasında bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getPrice = (plan: string) => {
    const selectedPlanDetails = plans[plan as keyof typeof plans]
    return billingCycle === 'annual' ? selectedPlanDetails.yearlyPrice : selectedPlanDetails.monthlyPrice
  }

  const handlePaymentFormChange = (field: keyof PaymentFormData, value: string) => {
    if (field === 'cardNumber') {
      // Sadece rakamları al
      const numbersOnly = value.replace(/\D/g, '')
      // 16 haneden fazla olmasını engelle
      const truncated = numbersOnly.slice(0, 16)
      // Her 4 rakamdan sonra boşluk ekle
      const formatted = truncated.replace(/(\d{4})(?=\d)/g, '$1 ')
      setPaymentForm(prev => ({ ...prev, [field]: formatted }))
    } 
    else if (field === 'expiryDate') {
      // Sadece rakamları al
      const numbersOnly = value.replace(/\D/g, '')
      // 4 haneden fazla olmasını engelle (MMYY)
      const truncated = numbersOnly.slice(0, 4)
      // MM/YY formatına çevir
      if (truncated.length >= 2) {
        const formatted = truncated.replace(/(\d{2})(\d{0,2})/, '$1/$2')
        setPaymentForm(prev => ({ ...prev, [field]: formatted }))
      } else {
        setPaymentForm(prev => ({ ...prev, [field]: truncated }))
      }
    }
    else if (field === 'cvv') {
      // Sadece rakamları al
      const numbersOnly = value.replace(/\D/g, '')
      // 3 haneden fazla olmasını engelle
      const truncated = numbersOnly.slice(0, 3)
      setPaymentForm(prev => ({ ...prev, [field]: truncated }))
    }
    else {
      setPaymentForm(prev => ({ ...prev, [field]: value }))
    }
  }

  return (
    <div className="min-h-screen bg-dark py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png"
              alt="CogniTrade Logo"
              width={200}
              height={60}
              className="h-auto"
            />
          </div>
          <h1 className="text-3xl font-bold mb-4">Upgrade to Premium</h1>
          <p className="text-gray-400">
            Unlock all features with a premium subscription
          </p>
        </div>

        {step === 'plan' ? (
          <>
            {/* Billing Cycle Selector */}
            <div className="flex items-center justify-center gap-4 mb-12">
              <span className={billingCycle === 'monthly' ? 'text-white' : 'text-gray-400'}>
                Monthly
              </span>
              <button
                onClick={handleBillingCycleChange}
                className="relative w-16 h-8 rounded-full bg-dark-lighter cursor-pointer"
              >
                <motion.div
                  className="absolute w-6 h-6 bg-primary rounded-full top-1"
                  animate={{ x: billingCycle === 'annual' ? 36 : 4 }}
                />
              </button>
              <div className="flex items-center gap-2">
                <span className={billingCycle === 'annual' ? 'text-white' : 'text-gray-400'}>
                  Annual
                </span>
                <span className="text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                  17% Off
                </span>
              </div>
            </div>

            {/* Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {Object.entries(plans).map(([planId, plan]) => (
                <motion.div
                  key={planId}
                  className={`relative p-6 rounded-xl backdrop-blur-sm ${
                    selectedPlan === planId
                      ? 'bg-primary/20 border-2 border-primary'
                      : 'bg-dark-lighter/40 border border-gray-800'
                  }`}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-4">{plan.name}</h3>
                    <div className="flex items-center justify-center mb-2">
                      <span className="text-sm">$</span>
                      <span className="text-4xl font-bold mx-1">
                        {billingCycle === 'annual' ? plan.yearlyPrice : plan.monthlyPrice}
                      </span>
                      <span className="text-gray-400">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                    </div>
                    {billingCycle === 'annual' && (
                      <div className="text-sm text-primary">17% discount</div>
                    )}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="space-y-2">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start">
                          <CheckIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                          <span className="text-sm text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                    {plan.notIncluded.length > 0 && (
                      <div className="space-y-2 pt-4 border-t border-gray-800">
                        {plan.notIncluded.map((feature, index) => (
                          <div key={index} className="flex items-start">
                            <XMarkIcon className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-400">{feature}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handlePlanSelect(planId)}
                    className={`w-full py-3 rounded-lg transition-colors ${
                      selectedPlan === planId
                        ? 'bg-primary text-white'
                        : 'bg-dark-lighter text-gray-300 hover:bg-dark-DEFAULT'
                    }`}
                  >
                    {selectedPlan === planId ? 'Selected Plan' : 'Select Plan'}
                  </button>
                </motion.div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={handleContinueToPayment}
                className="bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded-lg transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          </>
        ) : (
          <div className="max-w-md mx-auto">
            <div className="bg-dark-lighter/40 backdrop-blur-sm rounded-xl p-8 border border-gray-800">
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Payment Details</h2>
                <p className="text-gray-400">
                  {plans[selectedPlan as keyof typeof plans].name} Plan -{' '}
                  ${getPrice(selectedPlan)}/{billingCycle === 'annual' ? 'year' : 'month'}
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4 mb-6">
                  {error}
                </div>
              )}

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={19} // 16 rakam + 3 boşluk
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 bg-dark-lighter rounded-lg border border-gray-700 focus:outline-none focus:border-primary text-white placeholder-gray-500"
                    value={paymentForm.cardNumber}
                    onChange={(e) => handlePaymentFormChange('cardNumber', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-dark-lighter rounded-lg border border-gray-700 focus:outline-none focus:border-primary text-white placeholder-gray-500"
                    value={paymentForm.cardName}
                    onChange={(e) => handlePaymentFormChange('cardName', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={5} // MM/YY formatı için
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 bg-dark-lighter rounded-lg border border-gray-700 focus:outline-none focus:border-primary text-white placeholder-gray-500"
                      value={paymentForm.expiryDate}
                      onChange={(e) => handlePaymentFormChange('expiryDate', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={3}
                      placeholder="123"
                      className="w-full px-4 py-3 bg-dark-lighter rounded-lg border border-gray-700 focus:outline-none focus:border-primary text-white placeholder-gray-500"
                      value={paymentForm.cvv}
                      onChange={(e) => handlePaymentFormChange('cvv', e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleDemoPayment}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Complete Payment'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-gray-400">
                Want to go back?{' '}
                <button
                  onClick={() => setStep('plan')}
                  className="text-primary hover:text-primary-hover"
                >
                  Return to plan selection
                </button>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 