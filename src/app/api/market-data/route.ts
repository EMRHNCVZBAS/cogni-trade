import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')?.replace('USDT', '') || 'BTC'

    const response = await fetch(
      `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?symbol=${symbol}`,
      {
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY || '',
          'Accept': 'application/json'
        },
        next: { revalidate: 60 } // 1 dakika cache
      }
    )

    if (!response.ok) {
      throw new Error('CoinMarketCap API hatası')
    }

    const data = await response.json()
    const coinData = data.data[symbol][0]

    return NextResponse.json({
      price: coinData.quote.USD.price,
      change24h: coinData.quote.USD.percent_change_24h,
      volume24h: coinData.quote.USD.volume_24h,
      marketCap: coinData.quote.USD.market_cap,
      lastUpdate: coinData.quote.USD.last_updated
    })
  } catch (error) {
    console.error('Market verisi alınamadı:', error)
    return NextResponse.json(
      { error: 'Market verisi alınamadı' },
      { status: 500 }
    )
  }
} 