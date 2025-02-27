'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline'

interface NewsItem {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: string
  sentiment?: 'positive' | 'negative' | 'neutral'
  relevantCoins?: string[]
  imageUrl?: string
}

export default function News() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [news, setNews] = useState<NewsItem[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSource, setSelectedSource] = useState('all')
  const [selectedSentiment, setSelectedSentiment] = useState('all')

  useEffect(() => {
    if (status === 'authenticated') {
      fetchNews()
    }
  }, [status])

  const fetchNews = async () => {
    try {
      const response = await fetch('/api/news')
      if (!response.ok) throw new Error('Haberler yüklenemedi')
      const data = await response.json()
      setNews(data)
      setLoading(false)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSource = selectedSource === 'all' || item.source === selectedSource
    const matchesSentiment = selectedSentiment === 'all' || item.sentiment === selectedSentiment
    return matchesSearch && matchesSource && matchesSentiment
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-t-2 border-primary rounded-full animate-spin"></div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    redirect('/auth/login')
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Kripto Haberleri</h1>

      {/* Filtreler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Haberlerde ara..."
            className="w-full pl-10 p-3 bg-dark-darker rounded-lg border border-gray-700 focus:border-primary focus:outline-none"
          />
        </div>

        <select
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
          className="p-3 bg-dark-darker rounded-lg border border-gray-700 focus:border-primary focus:outline-none"
        >
          <option value="all">Tüm Kaynaklar</option>
          <option value="CoinDesk">CoinDesk</option>
          <option value="CryptoNews">CryptoNews</option>
        </select>

        <select
          value={selectedSentiment}
          onChange={(e) => setSelectedSentiment(e.target.value)}
          className="p-3 bg-dark-darker rounded-lg border border-gray-700 focus:border-primary focus:outline-none"
        >
          <option value="all">Tüm Duygular</option>
          <option value="positive">Pozitif</option>
          <option value="negative">Negatif</option>
          <option value="neutral">Nötr</option>
        </select>
      </div>

      {/* Haber Listesi */}
      <div className="grid grid-cols-1 gap-6">
        {filteredNews.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-dark-lighter/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-gray-400">{item.source}</span>
                  <span className="text-sm text-gray-400">•</span>
                  <span className="text-sm text-gray-400">
                    {new Date(item.publishedAt).toLocaleDateString('tr-TR')}
                  </span>
                  {item.sentiment && (
                    <>
                      <span className="text-sm text-gray-400">•</span>
                      <span className={`text-sm ${
                        item.sentiment === 'positive' ? 'text-green-500' :
                        item.sentiment === 'negative' ? 'text-red-500' :
                        'text-gray-400'
                      }`}>
                        {item.sentiment === 'positive' ? 'Pozitif' :
                         item.sentiment === 'negative' ? 'Negatif' : 'Nötr'}
                      </span>
                    </>
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-400 mb-4">{item.description}</p>
                {item.relevantCoins && (
                  <div className="flex flex-wrap gap-2">
                    {item.relevantCoins.map(coin => (
                      <span
                        key={coin}
                        className="px-2 py-1 text-sm bg-primary/20 text-primary rounded-lg"
                      >
                        {coin}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-4 p-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowTopRightOnSquareIcon className="w-5 h-5" />
              </a>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center text-gray-400 py-8">
          Haber bulunamadı
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
          {error}
        </div>
      )}
    </div>
  )
} 