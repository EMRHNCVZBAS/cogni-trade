import { useEffect, useRef } from 'react'
import { CandleData } from '@/services/coingecko'

interface TradingViewWidgetProps {
  symbol: string
  candleData?: CandleData[]
}

declare global {
  interface Window {
    TradingView: any
  }
}

let tvScriptLoadingPromise: Promise<void>

export default function TradingViewWidget({ symbol }: TradingViewWidgetProps) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/tv.js'
    script.type = 'text/javascript'
    script.async = true

    container.current.appendChild(script)

    script.onload = () => {
      if (window.TradingView && container.current) {
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}`,
          interval: '15',
          timezone: 'Europe/Istanbul',
          theme: 'dark',
          style: '1',
          locale: 'tr',
          toolbar_bg: '#1E222D',
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: container.current.id,
          hide_side_toolbar: false,
          save_image: true,
          studies: [
            'MASimple@tv-basicstudies',
            'RSI@tv-basicstudies',
            'MACD@tv-basicstudies'
          ],
          overrides: {
            'mainSeriesProperties.candleStyle.upColor': '#26a69a',
            'mainSeriesProperties.candleStyle.downColor': '#ef5350',
            'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
            'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350',
            'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
            'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350'
          },
          loading_screen: { backgroundColor: '#1E222D' }
        })
      }
    }

    return () => {
      if (container.current) {
        const scripts = container.current.getElementsByTagName('script')
        for (let i = scripts.length - 1; i >= 0; i--) {
          scripts[i].remove()
        }
      }
    }
  }, [symbol])

  return (
    <div 
      id={`tradingview_${symbol.toLowerCase()}`} 
      ref={container} 
      className="h-full w-full"
    />
  )
} 