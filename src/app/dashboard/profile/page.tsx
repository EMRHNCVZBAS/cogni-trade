'use client'

import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserIcon, EnvelopeIcon, KeyIcon, BellIcon, CreditCardIcon } from '@heroicons/react/24/outline'

export default function Profile() {
  const { data: session, status } = useSession()
  const [activeTab, setActiveTab] = useState('profile')
  
  // Oturum yoksa giriş sayfasına yönlendir
  if (status === 'unauthenticated') {
    redirect('/auth/signin')
  }
  
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-t-4 border-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-8">
          Profil Ayarları
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gradient-to-br from-dark-lighter/30 via-dark-darker/40 to-dark-lighter/20 backdrop-blur-lg p-4 rounded-xl border border-dark-lighter/30 shadow-xl">
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    activeTab === 'profile' 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-dark-lighter/20 text-gray-400'
                  }`}
                >
                  <UserIcon className="w-5 h-5" />
                  <span>Profil Bilgileri</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    activeTab === 'security' 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-dark-lighter/20 text-gray-400'
                  }`}
                >
                  <KeyIcon className="w-5 h-5" />
                  <span>Güvenlik</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('notifications')}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    activeTab === 'notifications' 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-dark-lighter/20 text-gray-400'
                  }`}
                >
                  <BellIcon className="w-5 h-5" />
                  <span>Bildirimler</span>
                </button>
                
                <button 
                  onClick={() => setActiveTab('billing')}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                    activeTab === 'billing' 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-dark-lighter/20 text-gray-400'
                  }`}
                >
                  <CreditCardIcon className="w-5 h-5" />
                  <span>Ödeme Bilgileri</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="md:col-span-3">
            <div className="bg-gradient-to-br from-dark-lighter/30 via-dark-darker/40 to-dark-lighter/20 backdrop-blur-lg p-6 rounded-xl border border-dark-lighter/30 shadow-xl">
              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Profil Bilgileri</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-400 mb-2">Ad Soyad</label>
                      <input 
                        type="text" 
                        className="w-full bg-dark-darker/60 border border-dark-lighter/30 rounded-lg p-3 text-white"
                        defaultValue={session?.user?.name || ''}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">E-posta</label>
                      <input 
                        type="email" 
                        className="w-full bg-dark-darker/60 border border-dark-lighter/30 rounded-lg p-3 text-white"
                        defaultValue={session?.user?.email || ''}
                        disabled
                      />
                      <p className="text-gray-500 text-sm mt-1">E-posta adresiniz değiştirilemez</p>
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">Profil Resmi</label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-dark-lighter/30 flex items-center justify-center">
                          {session?.user?.image ? (
                            <img src={session.user.image} alt="Profil" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <button className="bg-dark-lighter/30 hover:bg-dark-lighter/50 text-white px-4 py-2 rounded-lg transition-all">
                          Resim Yükle
                        </button>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg shadow-lg"
                    >
                      Değişiklikleri Kaydet
                    </motion.button>
                  </div>
                </div>
              )}
              
              {activeTab === 'security' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Güvenlik</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-gray-400 mb-2">Mevcut Şifre</label>
                      <input 
                        type="password" 
                        className="w-full bg-dark-darker/60 border border-dark-lighter/30 rounded-lg p-3 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">Yeni Şifre</label>
                      <input 
                        type="password" 
                        className="w-full bg-dark-darker/60 border border-dark-lighter/30 rounded-lg p-3 text-white"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 mb-2">Yeni Şifre (Tekrar)</label>
                      <input 
                        type="password" 
                        className="w-full bg-dark-darker/60 border border-dark-lighter/30 rounded-lg p-3 text-white"
                      />
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg shadow-lg"
                    >
                      Şifreyi Güncelle
                    </motion.button>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Bildirim Ayarları</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-dark-darker/40 rounded-lg">
                      <div>
                        <h3 className="font-medium">E-posta Bildirimleri</h3>
                        <p className="text-gray-400 text-sm">Önemli güncellemeler ve fiyat alarmları</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-dark-lighter/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-dark-darker/40 rounded-lg">
                      <div>
                        <h3 className="font-medium">Fiyat Alarmları</h3>
                        <p className="text-gray-400 text-sm">Belirlediğiniz fiyat seviyelerine ulaşıldığında</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-dark-lighter/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 bg-dark-darker/40 rounded-lg">
                      <div>
                        <h3 className="font-medium">Haftalık Özet</h3>
                        <p className="text-gray-400 text-sm">Haftalık piyasa analizi ve öneriler</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-dark-lighter/30 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg shadow-lg mt-4"
                    >
                      Ayarları Kaydet
                    </motion.button>
                  </div>
                </div>
              )}
              
              {activeTab === 'billing' && (
                <div>
                  <h2 className="text-xl font-semibold mb-6">Ödeme Bilgileri</h2>
                  
                  <div className="mb-8">
                    <div className="p-4 bg-dark-darker/40 rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium">Mevcut Plan</h3>
                          <p className="text-gray-400">Ücretsiz Plan</p>
                        </div>
                        <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-sm">Aktif</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-lg shadow-lg"
                      onClick={() => window.location.href = '/dashboard/subscribe'}
                    >
                      Premium'a Yükselt
                    </motion.button>
                  </div>
                  
                  <h3 className="font-medium mb-4">Ödeme Geçmişi</h3>
                  <div className="bg-dark-darker/40 rounded-lg p-4">
                    <p className="text-gray-400 text-center py-4">Henüz bir ödeme işlemi bulunmuyor</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 