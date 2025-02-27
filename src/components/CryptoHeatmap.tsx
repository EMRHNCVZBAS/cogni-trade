import React, { useEffect, useRef, memo } from 'react'

function CryptoHeatmap() {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const loadTradingViewScript = () => {
      const script = document.createElement('script')
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js"
      script.type = "text/javascript"
      script.async = true
      
      const widgetConfig = {
        "dataSource": "Crypto",
        "blockSize": "market_cap_calc",
        "blockColor": "change",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "dark",
        "hasTopBar": false,
        "isDataSetEnabled": false,
        "isZoomEnabled": true,
        "hasSymbolTooltip": true,
        "isMonoSize": false,
        "width": "100%",
        "height": "100%"
      }

      script.innerHTML = JSON.stringify(widgetConfig)
      
      if (container.current) {
        // Clear old widget
        while (container.current.firstChild) {
          container.current.removeChild(container.current.firstChild)
        }

        // Create widget container
        const widgetContainer = document.createElement('div')
        widgetContainer.className = 'tradingview-widget-container__widget h-full'
        container.current.appendChild(widgetContainer)

        // Create copyright container
        const copyrightContainer = document.createElement('div')
        copyrightContainer.className = 'tradingview-widget-copyright'
        const link = document.createElement('a')
        link.href = 'https://www.tradingview.com/'
        link.rel = 'noopener nofollow'
        link.target = '_blank'
        link.className = 'text-xs text-gray-400 hover:text-primary'
        link.textContent = 'Powered by TradingView'
        copyrightContainer.appendChild(link)
        container.current.appendChild(copyrightContainer)

        // Add script
        container.current.appendChild(script)
      }
    }

    loadTradingViewScript()

    return () => {
      if (container.current) {
        while (container.current.firstChild) {
          container.current.removeChild(container.current.firstChild)
        }
      }
    }
  }, [])

  return (
    <div className="tradingview-widget-container h-full" ref={container} />
  )
}

export default memo(CryptoHeatmap) 