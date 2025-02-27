import axios from 'axios'

const CMC_API_KEY = process.env.NEXT_PUBLIC_CMC_API_KEY
const CMC_API_URL = '/api/crypto'

export interface CryptoQuote {
  price: number
  volume_24h: number
  market_cap: number
  percent_change_24h: number
  last_updated: string
}

export interface CryptoData {
  id: number
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

class CoinMarketCapService {
  private static instance: CoinMarketCapService
  private updateCallbacks: ((data: CryptoData, candles: CandleData[]) => void)[] = []
  private currentData: CryptoData | null = null
  private currentCandles: CandleData[] = []
  private updateInterval: NodeJS.Timeout | null = null

  private constructor() {}

  public static getInstance(): CoinMarketCapService {
    if (!CoinMarketCapService.instance) {
      CoinMarketCapService.instance = new CoinMarketCapService()
    }
    return CoinMarketCapService.instance
  }

  private async fetchLatestData(symbol: string): Promise<{ data: CryptoData | null, candles: CandleData[] }> {
    try {
      const timestamp = Date.now()
      const response = await axios.get(CMC_API_URL, {
        params: {
          symbol,
          _t: timestamp // Cache'i önlemek için timestamp ekle
        }
      })

      if (!response.data?.data) {
        throw new Error('Veri bulunamadı')
      }

      return {
        data: response.data.data,
        candles: response.data.candles || []
      }
    } catch (error) {
      console.error('API Hatası:', error)
      return { data: null, candles: [] }
    }
  }

  public subscribeToUpdates(callback: (data: CryptoData, candles: CandleData[]) => void, symbol: string = 'BTC') {
    this.updateCallbacks.push(callback)

    const updateAndNotify = async () => {
      try {
        const { data, candles } = await this.fetchLatestData(symbol)
        if (data && candles.length > 0) {
          const lastCandle = candles[candles.length - 1]
          const priceChanged = lastCandle.c !== this.currentData?.quote.USD.price

          this.currentData = data
          this.currentCandles = candles
          this.updateCallbacks.forEach(cb => cb(data, candles))

          if (priceChanged) {
            console.log('Fiyat güncellendi:', new Date().toLocaleTimeString(), `($${lastCandle.c})`)
          } else {
            console.log('Veri kontrolü yapıldı (değişiklik yok):', new Date().toLocaleTimeString())
          }
        }
      } catch (error) {
        console.error('Güncelleme hatası:', error)
      }
    }

    // İlk veriyi hemen al
    updateAndNotify()

    // Her dakika güncelle
    if (!this.updateInterval) {
      this.updateInterval = setInterval(updateAndNotify, 60000) // 1 dakika
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

export default CoinMarketCapService 