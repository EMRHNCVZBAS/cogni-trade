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

    // Yahoo Finance API'den VIX verilerini çek
    const response = await axios.get('https://query1.finance.yahoo.com/v8/finance/chart/%5EVIX', {
      params: {
        range: '1d',
        interval: '5m',
        includePrePost: false
      }
    })

    const timestamps = response.data.chart.result[0].timestamp
    const values = response.data.chart.result[0].indicators.quote[0].close

    // Veriyi işle ve formatla
    const vixData = timestamps.map((timestamp: number, index: number) => ({
      timestamp: timestamp * 1000, // Unix timestamp'i milisaniyeye çevir
      value: values[index] || null // null değerleri koru
    })).filter((item: any) => item.value !== null) // null değerleri filtrele

    // Cache'i güncelle
    cachedData = vixData
    lastFetchTime = now

    return NextResponse.json(vixData, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150'
      }
    })
  } catch (error) {
    console.error('VIX veri çekme hatası:', error)
    
    // Cache varsa, eski veriyi dön
    if (cachedData) {
      return NextResponse.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=150, stale-while-revalidate=75'
        }
      })
    }

    return NextResponse.json(
      { error: 'VIX verileri alınamadı' },
      { status: 500 }
    )
  }
} 