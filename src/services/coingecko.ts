import axios from 'axios'

const CG_API_KEY = 'CG-MJdWez6KiMs97fTxemcNmdW7'
const CG_API_URL = 'https://api.coingecko.com/api/v3'

export interface CryptoQuote {
  price: number
  volume_24h: number
  market_cap: number
  percent_change_24h: number
  last_updated: string
  ath: number
  ath_change_percentage: number
  ath_date: string
  total_supply: number
  circulating_supply: number
}

export interface CryptoData {
  id: string
  name: string
  symbol: string
  quote: {
    USD: CryptoQuote
  }
  cmc_rank: number
  max_supply: number
  circulating_supply: number
  total_supply: number
}

export interface CandleData {
  x: number
  o: number
  h: number
  l: number
  c: number
}

class CoinGeckoService {
  private static instance: CoinGeckoService
  private updateCallbacks: ((data: CryptoData, candles: CandleData[]) => void)[] = []
  private currentData: CryptoData | null = null
  private currentCandles: CandleData[] = []
  private updateInterval: NodeJS.Timeout | null = null

  private constructor() {}

  public static getInstance(): CoinGeckoService {
    if (!CoinGeckoService.instance) {
      CoinGeckoService.instance = new CoinGeckoService()
    }
    return CoinGeckoService.instance
  }

  private async fetchLatestData(coinId: string = 'bitcoin'): Promise<{ data: CryptoData | null, candles: CandleData[] }> {
    try {
      const [marketData, candleData] = await Promise.all([
        // Market data
        axios.get(`${CG_API_URL}/coins/${coinId}`, {
          headers: {
            'x-cg-demo-api-key': CG_API_KEY
          },
          params: {
            localization: false,
            tickers: false,
            community_data: false,
            developer_data: false,
            sparkline: false
          }
        }),
        // Candle data (15 minute intervals)
        axios.get(`${CG_API_URL}/coins/${coinId}/ohlc`, {
          headers: {
            'x-cg-demo-api-key': CG_API_KEY
          },
          params: {
            vs_currency: 'usd',
            days: '1'
          }
        })
      ])

      // Transform market data to match our interface
      const data: CryptoData = {
        id: marketData.data.id,
        name: marketData.data.name,
        symbol: marketData.data.symbol.toUpperCase(),
        quote: {
          USD: {
            price: marketData.data.market_data.current_price.usd,
            volume_24h: marketData.data.market_data.total_volume.usd,
            market_cap: marketData.data.market_data.market_cap.usd,
            percent_change_24h: marketData.data.market_data.price_change_percentage_24h,
            last_updated: marketData.data.last_updated,
            ath: marketData.data.market_data.ath,
            ath_change_percentage: marketData.data.market_data.ath_change_percentage,
            ath_date: marketData.data.market_data.ath_date,
            total_supply: marketData.data.market_data.total_supply,
            circulating_supply: marketData.data.market_data.circulating_supply
          }
        },
        cmc_rank: marketData.data.market_cap_rank,
        max_supply: marketData.data.market_data.max_supply,
        circulating_supply: marketData.data.market_data.circulating_supply,
        total_supply: marketData.data.market_data.total_supply
      }

      // Transform candle data and filter for last 24 hours (96 15-minute candles)
      const now = Date.now()
      const oneDayAgo = now - 24 * 60 * 60 * 1000 // 24 hours in milliseconds
      
      // Group candles into 15-minute intervals
      const groupedCandles: { [key: string]: CandleData } = {}
      
      candleData.data
        .filter((candle: number[]) => candle[0] >= oneDayAgo)
        .forEach((candle: number[]) => {
          // Round timestamp to nearest 15 minutes
          const timestamp = candle[0]
          const interval = 15 * 60 * 1000 // 15 minutes in milliseconds
          const roundedTimestamp = Math.floor(timestamp / interval) * interval

          if (!groupedCandles[roundedTimestamp]) {
            groupedCandles[roundedTimestamp] = {
              x: roundedTimestamp,
              o: candle[1], // First open
              h: candle[2], // Initialize high
              l: candle[3], // Initialize low
              c: candle[4]  // Will be updated with last close
            }
          } else {
            // Update high and low if needed
            groupedCandles[roundedTimestamp].h = Math.max(groupedCandles[roundedTimestamp].h, candle[2])
            groupedCandles[roundedTimestamp].l = Math.min(groupedCandles[roundedTimestamp].l, candle[3])
            groupedCandles[roundedTimestamp].c = candle[4] // Update close with latest
          }
        })

      // Convert grouped candles to array and sort
      const candles = Object.values(groupedCandles)
        .sort((a, b) => a.x - b.x)

      // Pad missing 15-minute intervals
      const paddedCandles: CandleData[] = []
      let currentTime = Math.floor(oneDayAgo / (15 * 60 * 1000)) * (15 * 60 * 1000)

      while (currentTime <= now) {
        const existingCandle = candles.find(c => c.x === currentTime)
        if (existingCandle) {
          paddedCandles.push(existingCandle)
        } else {
          // Use the last known price for empty candles
          const lastPrice = paddedCandles.length > 0 
            ? paddedCandles[paddedCandles.length - 1].c 
            : data.quote.USD.price

          paddedCandles.push({
            x: currentTime,
            o: lastPrice,
            h: lastPrice,
            l: lastPrice,
            c: lastPrice
          })
        }
        currentTime += 15 * 60 * 1000 // Add 15 minutes
      }

      return { data, candles: paddedCandles }
    } catch (error) {
      console.error('CoinGecko API Error:', error)
      return { data: null, candles: [] }
    }
  }

  public subscribeToUpdates(callback: (data: CryptoData, candles: CandleData[]) => void, coinId: string = 'bitcoin') {
    this.updateCallbacks.push(callback)

    const updateAndNotify = async () => {
      try {
        const { data, candles } = await this.fetchLatestData(coinId)
        if (data && candles.length > 0) {
          const lastCandle = candles[candles.length - 1]
          const priceChanged = lastCandle.c !== this.currentData?.quote.USD.price

          this.currentData = data
          this.currentCandles = candles
          this.updateCallbacks.forEach(cb => cb(data, candles))

          if (priceChanged) {
            console.log('Price updated:', new Date().toLocaleTimeString(), `($${lastCandle.c})`)
          } else {
            console.log('Data check completed (no change):', new Date().toLocaleTimeString())
          }
        }
      } catch (error) {
        console.error('Update error:', error)
      }
    }

    // Get initial data
    updateAndNotify()

    // Update every 15 minutes
    if (!this.updateInterval) {
      this.updateInterval = setInterval(updateAndNotify, 15 * 60 * 1000) // 15 minutes
    }
  }

  public unsubscribeFromUpdates(callback: (data: CryptoData, candles: CandleData[]) => void) {
    this.updateCallbacks = this.updateCallbacks.filter(cb => cb !== callback)

    if (this.updateCallbacks.length === 0 && this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  public getCurrentData(): { data: CryptoData | null, candles: CandleData[] } {
    return { data: this.currentData, candles: this.currentCandles }
  }
}

export default CoinGeckoService 