import { NextResponse } from 'next/server'
import axios from 'axios'

const CG_API_KEY = 'CG-MJdWez6KiMs97fTxemcNmdW7'
const CG_API_URL = 'https://api.coingecko.com/api/v3'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get('coinId') || 'bitcoin'

    if (!coinId) {
      return NextResponse.json({ error: 'Coin ID parameter is required' }, { status: 400 })
    }

    // Get data from CoinGecko in parallel
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
      // Candle data (1 minute intervals for the last hour)
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

    // Transform market data
    const data = {
      id: marketData.data.id,
      name: marketData.data.name,
      symbol: marketData.data.symbol.toUpperCase(),
      quote: {
        USD: {
          price: marketData.data.market_data.current_price.usd,
          volume_24h: marketData.data.market_data.total_volume.usd,
          market_cap: marketData.data.market_data.market_cap.usd,
          percent_change_24h: marketData.data.market_data.price_change_percentage_24h,
          last_updated: marketData.data.last_updated
        }
      },
      cmc_rank: marketData.data.market_cap_rank,
      max_supply: marketData.data.market_data.max_supply,
      circulating_supply: marketData.data.market_data.circulating_supply,
      total_supply: marketData.data.market_data.total_supply
    }

    // Transform candle data
    const candles = candleData.data.map((candle: number[]) => ({
      x: candle[0], // timestamp
      o: candle[1], // open
      h: candle[2], // high
      l: candle[3], // low
      c: candle[4]  // close
    }))

    // Add Cache-Control header
    const headers = {
      'Cache-Control': 'no-store, max-age=0',
      'Content-Type': 'application/json',
    }

    return NextResponse.json({
      data,
      candles
    }, { headers })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'API error occurred' }, { status: 500 })
  }
} 