'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useSession } from 'next-auth/react'
import CoinGeckoService, { CryptoData, CandleData } from '@/services/coingecko'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChartBarIcon,
  NewspaperIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ChartPieIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const TradingViewWidget = dynamic(
  () => import('@/components/TradingViewWidget'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
)

const CryptoHeatmap = dynamic(
  () => import('@/components/CryptoHeatmap'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
)

const VixChart = dynamic(
  () => import('@/components/VixChart'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }
)

interface VixData {
  timestamp: number
  value: number
}

interface NewsAnalysis {
  sentiment: number
  keywords: string[]
  summary: string
  timestamp: number
  source: string
  url: string
  votes: {
    negative: number
    positive: number
    important: number
    liked: number
    disliked: number
    toxic: number
    saved: number
    comments: number
  }
}

interface MarketData {
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  lastUpdate: string
  ath: number
  athChangePercentage: number
  athDate: string
  totalSupply: number
  circulatingSupply: number
}

interface CoinData {
  id: number
  name: string
  symbol: string
  rank: number
  price: number
  change24h: number
  volume24h: number
  marketCap: number
  lastUpdate: string
}

export default function Analysis() {
  const { data: session } = useSession()
  const [selectedCoin, setSelectedCoin] = useState('BTCUSDT')
  const [timeRange, setTimeRange] = useState('24h')
  const [newsAnalysis, setNewsAnalysis] = useState<NewsAnalysis[]>([])
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [loading, setLoading] = useState(true)
  const [coins, setCoins] = useState<CoinData[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showCoinList, setShowCoinList] = useState(false)
  const [selectedCoinData, setSelectedCoinData] = useState<CoinData | null>(null)
  const [candleData, setCandleData] = useState<CandleData[]>([])
  const [vixData, setVixData] = useState<VixData[]>([])
  const [fearGreedData, setFearGreedData] = useState<any>(null)

  // CoinGecko servisi ile canlı veri akışı
  useEffect(() => {
    const coinGeckoService = CoinGeckoService.getInstance()
    
    const handleDataUpdate = (data: CryptoData, candles: CandleData[]) => {
      if (data.quote?.USD) {
        setMarketData({
          price: data.quote.USD.price,
          change24h: data.quote.USD.percent_change_24h,
          volume24h: data.quote.USD.volume_24h,
          marketCap: data.quote.USD.market_cap,
          lastUpdate: new Date(data.quote.USD.last_updated).toLocaleString('tr-TR', {
            timeZone: 'Europe/Istanbul'
          }),
          ath: data.quote.USD.ath,
          athChangePercentage: data.quote.USD.ath_change_percentage,
          athDate: new Date(data.quote.USD.ath_date).toLocaleString('tr-TR', {
            timeZone: 'Europe/Istanbul'
          }),
          totalSupply: data.quote.USD.total_supply,
          circulatingSupply: data.quote.USD.circulating_supply
        })
      }
      setCandleData(candles)
      setLoading(false)
    }

    // Seçilen coin'in ID'sini al
    const coinId = selectedCoin.toLowerCase().replace('usdt', '')
    
    // Servise abone ol
    coinGeckoService.subscribeToUpdates(handleDataUpdate, coinId)

    // Cleanup
    return () => {
      coinGeckoService.unsubscribeFromUpdates(handleDataUpdate)
    }
  }, [selectedCoin])

  // Market verilerini güncelle
  useEffect(() => {
    if (!selectedCoin || !selectedCoinData) return

    const fetchMarketData = async () => {
      try {
        const coinId = selectedCoinData.id.toString().toLowerCase()
        const [marketResponse, detailResponse] = await Promise.all([
          // Basit fiyat ve market verileri
          fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`, {
            headers: {
              'x-cg-demo-api-key': 'CG-MJdWez6KiMs97fTxemcNmdW7'
            }
          }),
          // Detaylı coin bilgileri
          fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`, {
            headers: {
              'x-cg-demo-api-key': 'CG-MJdWez6KiMs97fTxemcNmdW7'
            }
          })
        ])

        if (!marketResponse.ok || !detailResponse.ok) {
          throw new Error('Market verileri alınamadı')
        }

        const [marketData, detailData] = await Promise.all([
          marketResponse.json(),
          detailResponse.json()
        ])

        if (marketData[coinId] && detailData.market_data) {
          setMarketData({
            price: marketData[coinId].usd,
            change24h: marketData[coinId].usd_24h_change,
            volume24h: marketData[coinId].usd_24h_vol,
            marketCap: marketData[coinId].usd_market_cap,
            lastUpdate: new Date(marketData[coinId].last_updated_at * 1000).toLocaleString('tr-TR', {
              timeZone: 'Europe/Istanbul'
            }),
            ath: detailData.market_data.ath.usd,
            athChangePercentage: detailData.market_data.ath_change_percentage.usd,
            athDate: new Date(detailData.market_data.ath_date.usd).toLocaleString('tr-TR', {
              timeZone: 'Europe/Istanbul'
            }),
            totalSupply: detailData.market_data.total_supply,
            circulatingSupply: detailData.market_data.circulating_supply
          })
        }
      } catch (error) {
        console.error('Market veri çekme hatası:', error)
      }
    }

    fetchMarketData()
    // 2 dakikada bir güncelle
    const interval = setInterval(fetchMarketData, 120000)

    return () => clearInterval(interval)
  }, [selectedCoin, selectedCoinData])

  // İlk yükleme için market verilerini çek
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true)
      try {
        const coinsResponse = await fetch('/api/coins')
        if (!coinsResponse.ok) {
          throw new Error('Coin listesi alınamadı')
        }

        const coinsData = await coinsResponse.json()
        setCoins(coinsData)
        
        if (coinsData.length > 0) {
          const defaultCoin = coinsData.find((c: CoinData) => c.symbol === 'BTC') || coinsData[0]
          setSelectedCoinData(defaultCoin)
          setSelectedCoin(`${defaultCoin.symbol}USDT`)
        }
      } catch (error) {
        console.error('Veri yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  // Filtrelenmiş coin listesini memoize et
  const filteredCoins = useMemo(() => {
    if (!searchQuery) return coins
    
    const query = searchQuery.toLowerCase()
    return coins.filter(coin => 
      coin.name.toLowerCase().includes(query) ||
      coin.symbol.toLowerCase().includes(query)
    )
  }, [coins, searchQuery])

  // Coin seçimi
  const handleCoinSelect = async (coin: CoinData) => {
    setSelectedCoin(`${coin.symbol}USDT`)
    setSelectedCoinData(coin)
    setShowCoinList(false)
    setSearchQuery('')

    try {
      // Seçilen coin için market verilerini çek
      const coinId = coin.id.toString().toLowerCase()
      const [marketResponse, detailResponse] = await Promise.all([
        // Basit fiyat ve market verileri
        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true&include_last_updated_at=true`, {
          headers: {
            'x-cg-demo-api-key': 'CG-MJdWez6KiMs97fTxemcNmdW7'
          }
        }),
        // Detaylı coin bilgileri
        fetch(`https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`, {
          headers: {
            'x-cg-demo-api-key': 'CG-MJdWez6KiMs97fTxemcNmdW7'
          }
        })
      ])

      if (!marketResponse.ok || !detailResponse.ok) {
        throw new Error('Market verileri alınamadı')
      }

      const [marketData, detailData] = await Promise.all([
        marketResponse.json(),
        detailResponse.json()
      ])

      if (marketData[coinId] && detailData.market_data) {
        setMarketData({
          price: marketData[coinId].usd,
          change24h: marketData[coinId].usd_24h_change,
          volume24h: marketData[coinId].usd_24h_vol,
          marketCap: marketData[coinId].usd_market_cap,
          lastUpdate: new Date(marketData[coinId].last_updated_at * 1000).toLocaleString('tr-TR', {
            timeZone: 'Europe/Istanbul'
          }),
          ath: detailData.market_data.ath.usd,
          athChangePercentage: detailData.market_data.ath_change_percentage.usd,
          athDate: new Date(detailData.market_data.ath_date.usd).toLocaleString('tr-TR', {
            timeZone: 'Europe/Istanbul'
          }),
          totalSupply: detailData.market_data.total_supply,
          circulatingSupply: detailData.market_data.circulating_supply
        })
      }
    } catch (error) {
      console.error('Market veri çekme hatası:', error)
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T'
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B'
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(2) + 'K'
    return num.toFixed(2)
  }

  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.5) return 'text-green-500'
    if (sentiment > 0) return 'text-green-400'
    if (sentiment === 0) return 'text-gray-400'
    if (sentiment > -0.5) return 'text-red-400'
    return 'text-red-500'
  }

  const getSentimentIcon = (sentiment: number) => {
    return sentiment >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
  }

  // Duygu analizi verilerini çek
  useEffect(() => {
    if (!selectedCoinData) return

    const fetchSentimentData = async () => {
      try {
        const response = await fetch(`/api/sentiment?coinId=${selectedCoinData.id}`)
        if (!response.ok) {
          throw new Error('Duygu analizi verileri alınamadı')
        }

        const data = await response.json()
        setNewsAnalysis(data)
      } catch (error) {
        console.error('Duygu analizi veri çekme hatası:', error)
      }
    }

    fetchSentimentData()
    // 5 dakikada bir güncelle
    const interval = setInterval(fetchSentimentData, 300000)

    return () => clearInterval(interval)
  }, [selectedCoinData])

  // VIX ve Fear & Greed verilerini çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vixResponse, fearGreedResponse] = await Promise.all([
          fetch('/api/vix'),
          fetch('/api/fear-greed')
        ])

        if (!vixResponse.ok || !fearGreedResponse.ok) {
          throw new Error('Veriler alınamadı')
        }

        const [vixData, fearGreedData] = await Promise.all([
          vixResponse.json(),
          fearGreedResponse.json()
        ])

        setVixData(vixData)
        setFearGreedData(fearGreedData)
      } catch (error) {
        console.error('Veri çekme hatası:', error)
      }
    }

    fetchData()
    // 5 dakikada bir güncelle
    const interval = setInterval(fetchData, 300000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Hoşgeldin Mesajı */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome, {session?.user?.name || 'Trader'}
        </h1>
        <p className="text-gray-400 mt-2">
          Track cryptocurrency analytics and market data here.
        </p>
      </div>

      {/* Üst Kontroller */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
          {/* Coin Seçici */}
          <div className="relative w-full md:w-72">
            <div 
              className="bg-dark-lighter text-white px-4 py-2 rounded-lg border border-gray-700 cursor-pointer flex items-center justify-between"
              onClick={() => setShowCoinList(!showCoinList)}
            >
              <div className="flex items-center">
                <span className="text-white">{selectedCoinData?.name}</span>
                <span className="text-gray-400 text-sm ml-2">({selectedCoinData?.symbol})</span>
              </div>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {showCoinList && (
              <div className="absolute z-50 w-full mt-2 bg-dark-lighter border border-gray-700 rounded-lg shadow-xl">
                <div className="p-2">
                  <div className="flex items-center bg-dark-darker rounded-lg px-3 py-2">
                    <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Coin ara..."
                      className="bg-transparent border-none focus:outline-none text-white ml-2 w-full"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredCoins.length > 0 ? (
                    filteredCoins.map((coin) => (
                      <div
                        key={coin.id}
                        className="px-4 py-2 hover:bg-dark-darker cursor-pointer flex items-center justify-between"
                        onClick={() => handleCoinSelect(coin)}
                      >
                        <div className="flex items-center">
                          <span className="text-white">{coin.name}</span>
                          <span className="text-gray-400 text-sm ml-2">({coin.symbol})</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`text-sm ${coin.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {coin.change24h.toFixed(2)}%
                          </span>
                          <span className="text-gray-500 text-sm">#{coin.rank}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-400">
                      Sonuç bulunamadı
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Zaman Aralığı */}
          <div className="flex bg-dark-lighter rounded-lg border border-gray-700">
            {['1h', '24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 ${
                  timeRange === range
                    ? 'bg-primary text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Kripto Para Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-lighter rounded-xl p-6 border border-gray-800 mb-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ChartPieIcon className="w-6 h-6 mr-2 text-primary" />
          Kripto Para Heatmap
        </h2>
        <div className="h-[400px] w-full">
          <CryptoHeatmap />
        </div>
      </motion.div>

      {/* Fiyat Grafiği */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-lighter rounded-xl p-6 border border-gray-800 mb-6"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <ChartPieIcon className="w-6 h-6 mr-2 text-primary" />
          Fiyat Grafiği
        </h2>
        <div className="h-[600px] w-full">
          <TradingViewWidget symbol={selectedCoin} candleData={candleData} />
        </div>
      </motion.div>

      {/* Ana Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Market Verileri */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-dark-lighter rounded-xl p-6 border border-gray-800"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CurrencyDollarIcon className="w-6 h-6 mr-2 text-primary" />
            Market Verileri
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-dark-darker/50 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Fiyat</p>
              <p className="text-2xl font-bold">${marketData?.price?.toLocaleString() ?? 0}</p>
            </div>
            
            <div className="p-4 bg-dark-darker/50 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">24s Değişim</p>
              <p className={`text-2xl font-bold ${
                (marketData?.change24h ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {marketData?.change24h?.toFixed(2) ?? '0.00'}%
              </p>
            </div>
            
            <div className="p-4 bg-dark-darker/50 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">24s Hacim</p>
              <p className="text-2xl font-bold">${formatNumber(marketData?.volume24h ?? 0)}</p>
            </div>
            
            <div className="p-4 bg-dark-darker/50 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Piyasa Değeri</p>
              <p className="text-2xl font-bold">${formatNumber(marketData?.marketCap ?? 0)}</p>
            </div>

            <div className="p-4 bg-dark-darker/50 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Tüm Zamanların En Yükseği</p>
              <p className="text-2xl font-bold">${marketData?.ath?.toLocaleString() ?? 0}</p>
              <p className={`text-sm ${
                (marketData?.athChangePercentage ?? 0) >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                ATH'den %{typeof marketData?.athChangePercentage === 'number' ? marketData.athChangePercentage.toFixed(2) : '0.00'} uzakta
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {marketData?.athDate ? `ATH Tarihi: ${marketData.athDate}` : '-'}
              </p>
            </div>

            <div className="p-4 bg-dark-darker/50 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Dolaşımdaki Arz</p>
              <p className="text-2xl font-bold">{formatNumber(marketData?.circulatingSupply ?? 0)} {selectedCoinData?.symbol}</p>
              {marketData?.totalSupply && (
                <p className="text-xs text-gray-400 mt-1">
                  Toplam Arz: {formatNumber(marketData.totalSupply)} {selectedCoinData?.symbol}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Son Güncelleme</h3>
            <p className="text-gray-400">
              {marketData?.lastUpdate || 'Yükleniyor...'}
            </p>
          </div>
        </motion.div>

        {/* VIX ve Fear & Greed Grafiği */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-lighter rounded-xl p-6 border border-gray-800"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ChartBarIcon className="w-6 h-6 mr-2 text-primary" />
                Korku Endeksi (VIX)
              </h2>

              <div className="h-[400px] w-full bg-dark-darker/50 rounded-lg p-4">
                {vixData.length > 0 ? (
                  <VixChart data={vixData} />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-gray-400">
                    Veri yükleniyor...
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-400">
                <p>VIX, piyasadaki korku ve belirsizlik seviyesini gösteren bir endekstir.</p>
                <p>Yüksek VIX değerleri ({'>'}30) yüksek volatilite ve korku durumunu,</p>
                <p>Düşük VIX değerleri ({'<'}20) düşük volatilite ve sakin piyasa koşullarını gösterir.</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ChartBarIcon className="w-6 h-6 mr-2 text-primary" />
                Kripto Korku & Açgözlülük Endeksi
              </h2>

              <div className="h-[400px] w-full bg-dark-darker/50 rounded-lg p-4 flex flex-col items-center justify-center">
                {fearGreedData ? (
                  <>
                    <div className="text-6xl font-bold mb-4" style={{
                      color: `hsl(${fearGreedData.value}, 70%, 50%)`
                    }}>
                      {fearGreedData.value}
                    </div>
                    <div className="text-2xl font-semibold mb-8 text-center">
                      {fearGreedData.valueText}
                    </div>
                    <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-1000 ease-in-out"
                        style={{
                          width: `${fearGreedData.value}%`,
                          background: `linear-gradient(90deg, 
                            hsl(0, 70%, 50%) 0%,
                            hsl(30, 70%, 50%) 25%,
                            hsl(60, 70%, 50%) 50%,
                            hsl(90, 70%, 50%) 75%,
                            hsl(120, 70%, 50%) 100%
                          )`
                        }}
                      />
                    </div>
                    <div className="w-full flex justify-between mt-2 text-sm text-gray-400">
                      <span>Aşırı Korku</span>
                      <span>Aşırı Açgözlülük</span>
                    </div>
                    <div className="mt-8 text-sm text-gray-400">
                      Son güncelleme: {new Date(fearGreedData.timestamp).toLocaleString('tr-TR')}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-400">
                    Veri yükleniyor...
                  </div>
                )}
              </div>

              <div className="mt-4 text-sm text-gray-400">
                <p>Kripto Korku & Açgözlülük Endeksi, kripto para piyasasındaki genel duygu durumunu gösterir.</p>
                <p>0-25: Aşırı Korku - Yatırımcılar çok endişeli</p>
                <p>26-45: Korku - Piyasada tedirginlik hakim</p>
                <p>46-55: Nötr - Piyasa dengede</p>
                <p>56-75: Açgözlülük - Yatırımcılar iyimser</p>
                <p>76-100: Aşırı Açgözlülük - Piyasada aşırı iyimserlik</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Alt Grid */}
      <div className="grid grid-cols-1 gap-6">
        {/* Haberler ve Sosyal Medya */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-dark-lighter rounded-xl p-6 border border-gray-800"
        >
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <NewspaperIcon className="w-6 h-6 mr-2 text-primary" />
            Haberler ve Sosyal Medya Analizi
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-gray-700">
                  <th className="pb-3 text-gray-400">Kaynak</th>
                  <th className="pb-3 text-gray-400">Başlık</th>
                  <th className="pb-3 text-gray-400">Duygu</th>
                  <th className="pb-3 text-gray-400">Zaman</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {newsAnalysis.map((analysis, i) => (
                  <tr key={i} className="text-gray-300">
                    <td className="py-3">{analysis.source}</td>
                    <td className="py-3">
                      <a 
                        href={analysis.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-primary transition-colors"
                      >
                        {analysis.summary}
                      </a>
                    </td>
                    <td className="py-3">
                      <span className={`${getSentimentColor(analysis.sentiment)}`}>
                        {(analysis.sentiment * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td className="py-3 text-gray-400">
                      {new Date(analysis.timestamp).toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 