import { NextResponse } from 'next/server'
import axios from 'axios'

const CG_API_KEY = 'CG-MJdWez6KiMs97fTxemcNmdW7'
const CG_API_URL = 'https://api.coingecko.com/api/v3'

// Cache için basit bir in-memory store
let cachedData: any = null
let lastFetchTime = 0
const CACHE_DURATION = 60000 // 1 dakika cache

export async function GET() {
  try {
    // Cache kontrolü
    const now = Date.now()
    if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
        }
      })
    }

    const response = await axios.get(`${CG_API_URL}/coins/markets`, {
      headers: {
        'x-cg-demo-api-key': CG_API_KEY
      },
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h'
      },
      timeout: 5000 // 5 saniye timeout
    })

    const coins = response.data.map((coin: any) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol.toUpperCase(),
      rank: coin.market_cap_rank,
      price: coin.current_price,
      change24h: coin.price_change_percentage_24h,
      volume24h: coin.total_volume,
      marketCap: coin.market_cap,
      lastUpdate: new Date(coin.last_updated).toLocaleString('tr-TR', {
        timeZone: 'Europe/Istanbul'
      })
    }))

    // Cache'i güncelle
    cachedData = coins
    lastFetchTime = now

    return NextResponse.json(coins, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30'
      }
    })
  } catch (error) {
    console.error('Coin listesi çekme hatası:', error)
    
    // Cache varsa, eski veriyi dön
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=15'
        }
      })
    }

    return NextResponse.json(
      { error: 'Coin listesi alınamadı' },
      { status: 500 }
    )
  }
} 