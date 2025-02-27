'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircleIcon, CalendarIcon, CreditCardIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [countdown, setCountdown] = useState(5)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Şu anki tarihi al
  const currentDate = new Date()
  
  // Bitiş tarihini hesapla (1 yıl sonrası)
  const endDate = new Date(currentDate)
  endDate.setFullYear(endDate.getFullYear() + 1)

  useEffect(() => {
    const createSubscription = async () => {
      if (!session?.user?.id) return

      try {
        const response = await fetch('/api/subscription/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: session.user.id,
            plan: searchParams.get('plan') || 'pro',
            startDate: currentDate,
            endDate: endDate,
          }),
        })

        if (!response.ok) {
          throw new Error('Abonelik kaydı oluşturulamadı')
        }

        setIsLoading(false)
      } catch (err: any) {
        setError(err.message)
        setIsLoading(false)
      }
    }

    createSubscription()
  }, [session?.user?.id])

  useEffect(() => {
    if (!isLoading && !error) {
      // 5 saniye sonra dashboard'a yönlendir
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push('/dashboard')
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isLoading, error, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-dark-lighter/40 backdrop-blur-sm rounded-2xl p-8 border border-red-500/50">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Hata Oluştu</h1>
            <p className="text-gray-300 mb-4">{error}</p>
            <button
              onClick={() => router.push('/dashboard/subscribe')}
              className="px-6 py-2 bg-primary text-white rounded-lg"
            >
              Tekrar Dene
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-lighter/40 backdrop-blur-sm rounded-2xl p-8 border border-gray-800"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              className="w-20 h-20 mx-auto mb-6 text-green-500"
            >
              <CheckCircleIcon />
            </motion.div>

            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Ödeme Başarılı!
            </h1>
            
            <p className="text-gray-300 mb-2">
              Aboneliğiniz başarıyla aktifleştirildi. CogniTrade'in tüm özelliklerinden yararlanmaya başlayabilirsiniz.
            </p>
            
            <p className="text-sm text-primary">
              Sipariş numaranız: #{Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}
            </p>
          </div>
          
          <div className="bg-dark-DEFAULT rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Abonelik Detayları</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <CalendarIcon className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <p className="text-gray-300 font-medium">Abonelik Süresi</p>
                  <p className="text-sm text-gray-400">
                    Başlangıç: {currentDate.toLocaleDateString('tr-TR')}
                    <br />
                    Bitiş: {endDate.toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CreditCardIcon className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <p className="text-gray-300 font-medium">Ödeme Bilgileri</p>
                  <p className="text-sm text-gray-400">
                    Yıllık ödeme planı
                    <br />
                    Bir sonraki ödeme: {endDate.toLocaleDateString('tr-TR')}
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <ShieldCheckIcon className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <p className="text-gray-300 font-medium">Hesap Durumu</p>
                  <p className="text-sm text-gray-400">
                    Premium hesap aktif
                    <br />
                    Tüm özellikler kullanılabilir
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg mb-8">
            <p className="text-sm text-primary">
              Aboneliğinizle ilgili bir e-posta {session?.user?.email} adresine gönderildi. Aboneliğinizi istediğiniz zaman hesap ayarlarınızdan yönetebilirsiniz.
            </p>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-400 mb-4">
              {countdown} saniye içinde dashboard'a yönlendirileceksiniz...
            </div>

            <button
              onClick={() => router.push('/dashboard')}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white rounded-lg transition-colors"
            >
              Şimdi Dashboard'a Git
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 