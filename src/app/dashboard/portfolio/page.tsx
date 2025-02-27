'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { PlusIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

interface PortfolioItem {
  id: string
  coinId: string
  symbol: string
  amount: number
  buyPrice: number
  currentPrice?: number
  totalValue?: number
  profitLoss?: number
  profitLossPercentage?: number
}

const generateChartColors = (count: number) => {
  const colors = []
  for (let i = 0; i < count; i++) {
    const hue = (i * 137.5) % 360 // Altın oran kullanarak renk dağılımı
    colors.push(`hsla(${hue}, 70%, 60%, 0.8)`)
  }
  return colors
}

export default function Portfolio() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newItem, setNewItem] = useState({
    coinId: '',
    symbol: '',
    amount: '',
    buyPrice: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [selectedCoin, setSelectedCoin] = useState<any>(null)
  const [formData, setFormData] = useState({
    amount: '',
    buyPrice: ''
  })

  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Kullanıcı oturumu bulundu, portföy getiriliyor...')
      fetchPortfolio()
    }
  }, [status])

  const fetchPortfolio = async () => {
    try {
      console.log('Portföy verisi getiriliyor...')
      const response = await fetch('/api/portfolio')
      if (!response.ok) throw new Error('Portföy yüklenemedi')
      const data = await response.json()
      console.log('Gelen portföy verisi:', data)
      setPortfolio(data)
    } catch (err: any) {
      console.error('Portföy getirme hatası:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/search?query=${query}`
      )
      const data = await response.json()
      setSearchResults(data.coins.slice(0, 5))
    } catch (err) {
      console.error('Coin arama hatası:', err)
    }
  }

  const handleCoinSelect = (coin: any) => {
    setSelectedCoin(coin)
    setSearchQuery(coin.name)
    setSearchResults([])
  }

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCoin || !formData.amount || !formData.buyPrice) {
      setError('Lütfen tüm alanları doldurun')
      return
    }

    try {
      const response = await fetch('/api/portfolio/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coinId: selectedCoin.id,
          symbol: selectedCoin.symbol.toUpperCase(),
          amount: parseFloat(formData.amount),
          buyPrice: parseFloat(formData.buyPrice)
        })
      })

      if (!response.ok) throw new Error('Coin eklenemedi')
      
      await fetchPortfolio()
      setSelectedCoin(null)
      setSearchQuery('')
      setFormData({ amount: '', buyPrice: '' })
      setError('')
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDeleteItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/portfolio/delete/${itemId}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Coin silinemedi')
      fetchPortfolio()
    } catch (err: any) {
      setError(err.message)
    }
  }

  // Pasta grafik verilerini hazırla
  const prepareChartData = () => {
    console.log('Grafik verisi hazırlanıyor, portföy:', portfolio)
    if (!portfolio || portfolio.length === 0) return null

    const labels = portfolio.map(item => item.symbol)
    const values = portfolio.map(item => item.totalValue || 0)
    const colors = generateChartColors(portfolio.length)

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor: colors,
          borderColor: colors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        },
      ],
    }
  }

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

  const chartData = prepareChartData()
  const totalPortfolioValue = portfolio.reduce((sum, item) => sum + (item.totalValue || 0), 0)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Portföyüm</h1>

      {/* Portföy Özeti */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-dark-lighter/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
          <h2 className="text-xl font-semibold mb-4">Portföy Değeri</h2>
          <div className="text-3xl font-bold text-primary">
            ${totalPortfolioValue.toFixed(2)}
          </div>
          {portfolio.length > 0 && (
            <p className="text-gray-400 mt-2">
              {portfolio.length} farklı coin
            </p>
          )}
        </div>

        {chartData && (
          <div className="bg-dark-lighter/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
            <h2 className="text-xl font-semibold mb-4">Portföy Dağılımı</h2>
            <div className="w-full aspect-square max-w-[300px] mx-auto">
              <Pie 
                data={chartData}
                options={{
                  plugins: {
                    legend: {
                      position: 'right' as const,
                      labels: {
                        color: 'white',
                        font: {
                          size: 12
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          const value = context.raw as number
                          const percentage = ((value / totalPortfolioValue) * 100).toFixed(1)
                          return `${context.label}: $${value.toFixed(2)} (${percentage}%)`
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Coin Ekleme Formu */}
      <div className="bg-dark-lighter/40 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Yeni Coin Ekle</h2>
        <form onSubmit={handleAddItem} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Coin ara..."
              className="w-full p-3 bg-dark-darker rounded-lg border border-gray-700 focus:border-primary focus:outline-none"
            />
            {searchResults.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-dark-darker border border-gray-700 rounded-lg shadow-xl">
                {searchResults.map((coin: any) => (
                  <button
                    key={coin.id}
                    type="button"
                    onClick={() => handleCoinSelect(coin)}
                    className="w-full p-3 text-left hover:bg-dark-lighter flex items-center space-x-2"
                  >
                    <img src={coin.thumb} alt={coin.name} className="w-6 h-6" />
                    <span>{coin.name} ({coin.symbol.toUpperCase()})</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
              placeholder="Miktar"
              step="any"
              className="p-3 bg-dark-darker rounded-lg border border-gray-700 focus:border-primary focus:outline-none"
            />
            <input
              type="number"
              value={formData.buyPrice}
              onChange={(e) => setFormData(prev => ({ ...prev, buyPrice: e.target.value }))}
              placeholder="Alış Fiyatı (USD)"
              step="any"
              className="p-3 bg-dark-darker rounded-lg border border-gray-700 focus:border-primary focus:outline-none"
            />
          </div>

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-primary-hover text-white py-3 px-6 rounded-lg transition-colors"
          >
            Ekle
          </button>
        </form>
      </div>

      {/* Portföy Listesi */}
      <div className="bg-dark-lighter/40 backdrop-blur-sm rounded-xl p-6 border border-gray-800">
        <h2 className="text-xl font-semibold mb-4">Portföy Detayları</h2>
        
        {portfolio.length === 0 ? (
          <p className="text-gray-400">Henüz coin eklenmemiş</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3">Coin</th>
                  <th className="text-right p-3">Miktar</th>
                  <th className="text-right p-3">Ort. Maliyet</th>
                  <th className="text-right p-3">Güncel Fiyat</th>
                  <th className="text-right p-3">Toplam Değer</th>
                  <th className="text-right p-3">Kar/Zarar</th>
                  <th className="text-center p-3">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item) => (
                  <tr key={item.id} className="border-b border-gray-700/50">
                    <td className="p-3">
                      <span className="font-medium">{item.symbol}</span>
                    </td>
                    <td className="text-right p-3">{item.amount.toFixed(4)}</td>
                    <td className="text-right p-3">${item.buyPrice.toFixed(2)}</td>
                    <td className="text-right p-3">
                      ${item.currentPrice?.toFixed(2) || '---'}
                    </td>
                    <td className="text-right p-3">
                      ${item.totalValue?.toFixed(2) || '---'}
                    </td>
                    <td className="text-right p-3">
                      <span className={item.profitLoss && item.profitLoss > 0 ? 'text-green-500' : 'text-red-500'}>
                        {item.profitLossPercentage ? `${item.profitLossPercentage.toFixed(2)}%` : '---'}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="mx-auto flex items-center justify-center w-8 h-8 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Başarı Mesajı */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-4">
          {error}
        </div>
      )}
      
      {selectedCoin && formData.amount && formData.buyPrice && (
        <div className="fixed bottom-4 right-4 bg-dark-lighter/90 backdrop-blur-sm rounded-lg p-4 border border-gray-700 shadow-xl">
          <p className="text-sm text-gray-400">Eklenecek:</p>
          <p className="font-medium">{selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})</p>
          <p className="text-sm text-gray-400">
            Miktar: {formData.amount} • Maliyet: ${formData.buyPrice}
          </p>
        </div>
      )}
    </div>
  )
} 