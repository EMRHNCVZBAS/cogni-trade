import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { newsAnalyzer } from '@/services/newsAnalyzer'

interface ProcessedNews {
  id: string
  title: string
  description: string
  url: string
  source: string
  publishedAt: number
  sentiment: 'positive' | 'negative' | 'neutral'
  sentimentScore: number
  keywords: string[]
  summary: string
  relevantCoins: string[]
  imageUrl: string | null
}

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    console.log('API: CryptoPanic API çağrısı yapılıyor...')
    
    // CryptoPanic API'den haberleri al
    const apiUrl = 'https://cryptopanic.com/api/v1/posts/?auth_token=' + process.env.CRYPTOPANIC_API_KEY + '&public=true&kind=news'
    console.log('API URL:', apiUrl)

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      next: { revalidate: 0 }
    })

    console.log('API Yanıt Durumu:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API Hata Yanıtı:', errorText)
      throw new Error(`Haberler alınamadı: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    console.log('API Yanıt Data Örneği:', {
      title: data.results?.[0]?.title,
      description: data.results?.[0]?.metadata?.description
    })
    
    // Haberleri işle ve analiz et
    const processedNews: ProcessedNews[] = await Promise.all(data.results.map(async (item: any) => {
      console.log('\n--- Haber İşleniyor ---')
      console.log('Başlık:', item.title)
      console.log('Açıklama:', item.metadata?.description)
      
      // Haber metnini analiz et
      const analysis = await newsAnalyzer.analyze(
        item.title,
        item.metadata?.description || ''
      )
      
      console.log('Analiz Sonucu:', {
        sentiment: analysis.sentiment,
        score: analysis.score,
        keywords: analysis.keywords
      })
      
      return {
        id: item.id,
        title: item.title,
        description: item.metadata?.description || '',
        url: item.url,
        source: item.source?.title || 'Bilinmeyen Kaynak',
        publishedAt: new Date(item.published_at).getTime(),
        sentiment: analysis.sentiment,
        sentimentScore: analysis.score,
        keywords: analysis.keywords,
        summary: analysis.summary,
        relevantCoins: item.currencies?.map((c: any) => c.code) || [],
        imageUrl: item.metadata?.image || null
      }
    }))

    console.log(`\nToplam ${processedNews.length} haber işlendi.`)
    console.log('Duygu Analizi Özeti:', {
      positive: processedNews.filter(n => n.sentiment === 'positive').length,
      negative: processedNews.filter(n => n.sentiment === 'negative').length,
      neutral: processedNews.filter(n => n.sentiment === 'neutral').length
    })

    return NextResponse.json(processedNews)
  } catch (error) {
    console.error('News API error:', error)
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 })
  }
}

// CryptoPanic oylama verilerine göre duygu analizi
function analyzeSentiment(votes: any): 'positive' | 'negative' | 'neutral' {
  if (!votes) return 'neutral'
  
  const positive = votes.positive || 0
  const negative = votes.negative || 0
  
  if (positive > negative) return 'positive'
  if (negative > positive) return 'negative'
  return 'neutral'
} 