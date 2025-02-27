import { NextResponse } from 'next/server'
import axios from 'axios'

// Cache için basit bir in-memory store
let cachedData: any = null
let lastFetchTime = 0
const CACHE_DURATION = 300000 // 5 dakika cache

export async function GET() {
  try {
    // Cache kontrolü
    const now = Date.now()
    if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150'
        }
      })
    }

    // Alternative.me API'den Fear & Greed Index verilerini çek
    const response = await axios.get('https://api.alternative.me/fng/')
    
    const fearGreedData = {
      value: parseInt(response.data.data[0].value),
      valueText: response.data.data[0].value_classification,
      timestamp: parseInt(response.data.data[0].timestamp) * 1000,
      previousValues: response.data.data.slice(1).map((item: any) => ({
        value: parseInt(item.value),
        valueText: item.value_classification,
        timestamp: parseInt(item.timestamp) * 1000
      }))
    }

    // Cache'i güncelle
    cachedData = fearGreedData
    lastFetchTime = now

    return NextResponse.json(fearGreedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150'
      }
    })
  } catch (error) {
    console.error('Fear & Greed Index veri çekme hatası:', error)
    
    // Cache varsa, eski veriyi dön
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=150, stale-while-revalidate=75'
        }
      })
    }

    return NextResponse.json(
      { error: 'Fear & Greed Index verileri alınamadı' },
      { status: 500 }
    )
  }
} 