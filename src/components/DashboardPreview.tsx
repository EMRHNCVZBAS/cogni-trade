'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  TimeScale
} from 'chart.js'
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale'
import { Chart } from 'react-chartjs-2'
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'
import CoinGeckoService, { CryptoData } from '@/services/coingecko'

// Register CandleStick components to Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  TimeScale,
  Title,
  Tooltip,
  Legend,
  CandlestickController,
  CandlestickElement
)

interface CandleData {
  x: number
  o: number
  h: number
  l: number
  c: number
}

const DashboardPreview = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null)
  const [candleHistory, setCandleHistory] = useState<CandleData[]>([])

  const getPercentChange = () => cryptoData?.quote?.USD?.percent_change_24h ?? 0
  
  useEffect(() => {
    const cgService = CoinGeckoService.getInstance()
    
    const updateData = (data: CryptoData, candles: CandleData[]) => {
      setCryptoData(data)
      setCandleHistory(candles)
    }

    // Subscribe to service
    cgService.subscribeToUpdates(updateData, 'bitcoin')

    // Cleanup
    return () => {
      cgService.unsubscribeFromUpdates(updateData)
    }
  }, [])

  const candleData = {
    datasets: [
      {
        type: 'candlestick' as const,
        label: 'BTC/USD',
        data: candleHistory,
        color: {
          up: '#38A169',
          down: '#E53E3E',
          unchanged: '#718096'
        }
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index' as const
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (ctx: any) => {
            const date = new Date(ctx[0].raw.x)
            return date.toLocaleString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          },
          label: (ctx: any) => {
            const candle = ctx.raw as CandleData
            const formatPrice = (price: number) => price.toLocaleString(undefined, { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })
            return [
              `Open: $${formatPrice(candle.o)}`,
              `High: $${formatPrice(candle.h)}`,
              `Low: $${formatPrice(candle.l)}`,
              `Close: $${formatPrice(candle.c)}`
            ]
          }
        }
      }
    },
    scales: {
      x: {
        type: 'time' as const,
        adapters: {
          date: {
            locale: enUS
          }
        },
        time: {
          unit: 'hour' as const,
          stepSize: 3,
          displayFormats: {
            hour: 'HH:mm'
          },
          tooltipFormat: 'MMM d, HH:mm'
        },
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#9CA3AF',
          maxRotation: 0,
          font: {
            size: 11
          },
          maxTicksLimit: 8,
          callback: (value: any) => {
            const date = new Date(value)
            return date.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          }
        },
        border: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      y: {
        position: 'right' as const,
        grid: {
          display: true,
          color: 'rgba(255, 255, 255, 0.05)'
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11
          },
          callback: (value: any) => `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
          maxTicksLimit: 8
        },
        border: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        top: 20,
        bottom: 10
      }
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(1)}T`
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`
    return num.toFixed(1)
  }

  return (
    <section className="py-20 w-full overflow-hidden">
      <div className="content-container">
        <div className="relative rounded-2xl bg-gradient-to-br from-dark-lighter/30 via-dark-darker/40 to-dark-lighter/20 backdrop-blur-lg p-4 md:p-8 border border-dark-lighter/30 shadow-2xl">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl blur-xl -z-10"></div>

          {/* Header */}
          <div className="flex items-center justify-between mb-6 bg-dark-darker/30 rounded-xl p-4 backdrop-blur-sm border border-dark-lighter/10">
            <div className="flex items-center space-x-4">
              <h3 className="text-xl font-semibold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">BTC/USD</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-sm text-gray-400">Live • 15min Update</span>
              </div>
            </div>
            <motion.div 
              className="flex items-center space-x-2"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              key={cryptoData?.quote?.USD?.price}
            >
              <span className={`text-lg font-medium ${getPercentChange() >= 0 ? "text-green-400" : "text-red-400"}`}>
                ${cryptoData?.quote?.USD?.price?.toLocaleString() || '0.00'}
              </span>
              <span className={`text-sm font-medium ${getPercentChange() >= 0 ? "text-green-400" : "text-red-400"}`}>
                {getPercentChange() >= 0 ? '+' : ''}{getPercentChange().toFixed(2)}%
              </span>
            </motion.div>
          </div>

          {/* Chart and Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Chart */}
            <div className="lg:col-span-2 bg-gradient-to-br from-dark-lighter/50 to-dark-darker/50 backdrop-blur-sm rounded-xl p-4 border border-dark-lighter/20 shadow-xl">
              <div className="bg-dark-darker/40 rounded-lg p-2 h-[450px]">
                <Chart
                  type="candlestick"
                  data={candleData}
                  options={{
                    ...chartOptions,
                    layout: {
                      padding: {
                        left: 0,
                        right: 8,
                        top: 8,
                        bottom: 0
                      }
                    },
                    scales: {
                      ...chartOptions.scales,
                      x: {
                        ...chartOptions.scales.x,
                        grid: {
                          ...chartOptions.scales.x.grid,
                          drawTicks: false
                        },
                        ticks: {
                          ...chartOptions.scales.x.ticks,
                          padding: 8
                        }
                      },
                      y: {
                        ...chartOptions.scales.y,
                        grid: {
                          ...chartOptions.scales.y.grid,
                          drawTicks: false
                        },
                        ticks: {
                          ...chartOptions.scales.y.ticks,
                          padding: 8
                        }
                      }
                    },
                    plugins: {
                      ...chartOptions.plugins,
                      tooltip: {
                        ...chartOptions.plugins.tooltip,
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleFont: {
                          size: 14,
                          weight: 'bold',
                          family: 'Inter'
                        },
                        bodyFont: {
                          size: 13,
                          family: 'Inter'
                        },
                        padding: 16,
                        cornerRadius: 12,
                        boxPadding: 8
                      }
                    }
                  }}
                  height="100%"
                />
              </div>
            </div>

            {/* Market Data */}
            <div className="bg-gradient-to-br from-dark-lighter/50 to-dark-darker/50 backdrop-blur-sm rounded-xl p-6 border border-dark-lighter/20">
              <h4 className="text-lg font-medium mb-4">Market Data</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-dark-lighter/10">
                  <span className="text-gray-400">24h Volume</span>
                  <span className="font-medium">${formatNumber(cryptoData?.quote.USD.volume_24h || 0)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dark-lighter/10">
                  <span className="text-gray-400">Market Cap</span>
                  <span className="font-medium">${formatNumber(cryptoData?.quote.USD.market_cap || 0)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-dark-lighter/10">
                  <span className="text-gray-400">Dominance</span>
                  <span className="font-medium">{((cryptoData?.quote.USD.market_cap || 0) / 2.5e12 * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Rank</span>
                  <span className="font-medium">#{cryptoData?.cmc_rank || 0}</span>
                </div>
              </div>
            </div>

            {/* Sentiment Analysis */}
            <div className="bg-gradient-to-br from-dark-lighter/50 to-dark-darker/50 backdrop-blur-sm rounded-xl p-6 border border-dark-lighter/20">
              <h4 className="text-lg font-medium mb-4">Sentiment Analysis</h4>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">24h Score</span>
                    <span className="text-green-500 font-medium">0.72</span>
                  </div>
                  <div className="h-2 bg-dark-darker/40 rounded-full overflow-hidden">
                    <div className="h-full w-[72%] bg-gradient-to-r from-primary to-green-500 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400">7d Score</span>
                    <span className="text-yellow-500 font-medium">0.51</span>
                  </div>
                  <div className="h-2 bg-dark-darker/40 rounded-full overflow-hidden">
                    <div className="h-full w-[51%] bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Last News */}
            <div className="bg-gradient-to-br from-dark-lighter/50 to-dark-darker/50 backdrop-blur-sm rounded-xl p-6 border border-dark-lighter/20">
              <h4 className="text-lg font-medium mb-4">Latest News</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dark-darker/20 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <p className="text-sm text-gray-300">CMC: Bitcoin ETF approval is approaching</p>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dark-darker/20 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <p className="text-sm text-gray-300">Corporate investors increased BTC purchases</p>
                </div>
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-dark-darker/20 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <p className="text-sm text-gray-300">Explanation of crypto regulation from SEC</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default DashboardPreview 