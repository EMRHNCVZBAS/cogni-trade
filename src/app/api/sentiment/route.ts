import { NextResponse } from 'next/server'
import axios from 'axios'

const CRYPTOPANIC_API_KEY = 'YOUR_CRYPTOPANIC_API_KEY' // CryptoPanic API anahtarınızı buraya ekleyin
const CRYPTOPANIC_URL = 'https://cryptopanic.com/api/v1/posts'

interface CryptoPanicPost {
  id: number
  title: string
  published_at: string
  url: string
  source: {
    title: string
    region: string
    domain: string
  }
  currencies: Array<{
    code: string
    title: string
    slug: string
    url: string
  }>
  kind: string
  domain: string
  votes: {
    negative: number
    positive: number
    important: number
    liked: number
    disliked: number
    lol: number
    toxic: number
    saved: number
    comments: number
  }
}

// Basit bir duygu analizi fonksiyonu
function analyzeSentiment(text: string, votes: CryptoPanicPost['votes']): number {
  // Metin bazlı analiz
  const positiveWords = [
    'yükseliş', 'artış', 'kazanç', 'büyüme', 'olumlu', 'güçlü', 'başarı',
    'rally', 'surge', 'gain', 'growth', 'positive', 'strong', 'success',
    'bullish', 'optimistic', 'breakthrough', 'support', 'confident'
  ]

  const negativeWords = [
    'düşüş', 'kayıp', 'zarar', 'çöküş', 'olumsuz', 'zayıf', 'başarısız',
    'crash', 'drop', 'loss', 'decline', 'negative', 'weak', 'fail',
    'bearish', 'pessimistic', 'breakdown', 'resistance', 'worried'
  ]

  const lowerText = text.toLowerCase()
  let textScore = 0
  let totalWords = 0

  // Pozitif kelime sayısı
  positiveWords.forEach(word => {
    const regex = new RegExp(word, 'gi')
    const matches = lowerText.match(regex)
    if (matches) {
      textScore += matches.length
      totalWords += matches.length
    }
  })

  // Negatif kelime sayısı
  negativeWords.forEach(word => {
    const regex = new RegExp(word, 'gi')
    const matches = lowerText.match(regex)
    if (matches) {
      textScore -= matches.length
      totalWords += matches.length
    }
  })

  // Oy bazlı analiz
  const voteScore = (
    votes.positive * 1 +
    votes.important * 0.5 +
    votes.liked * 0.3 -
    votes.negative * 1 -
    votes.disliked * 0.3 -
    votes.toxic * 1.5
  )

  // Metin ve oy skorlarını birleştir
  const textWeight = 0.6
  const voteWeight = 0.4
  const normalizedTextScore = totalWords > 0 ? textScore / totalWords : 0
  const normalizedVoteScore = voteScore / (Math.abs(voteScore) || 1)

  // -1 ile 1 arasında normalize edilmiş final skor
  return (normalizedTextScore * textWeight + normalizedVoteScore * voteWeight)
}

// Anahtar kelimeleri çıkaran fonksiyon
function extractKeywords(text: string): string[] {
  const commonWords = ['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at']
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => !commonWords.includes(word))
  
  // Kelime frekanslarını hesapla
  const frequencies: { [key: string]: number } = {}
  words.forEach(word => {
    frequencies[word] = (frequencies[word] || 0) + 1
  })

  // En sık geçen 5 kelimeyi döndür
  return Object.entries(frequencies)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([word]) => word)
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const coinId = searchParams.get('coinId') || 'bitcoin'

    // CryptoPanic'ten haberleri al
    const response = await axios.get(CRYPTOPANIC_URL, {
      params: {
        auth_token: CRYPTOPANIC_API_KEY,
        currencies: coinId,
        kind: 'news',
        filter: 'hot',
        public: true,
        regions: 'en',
        limit: 20
      }
    })

    const posts = response.data.results as CryptoPanicPost[]

    // Her haber için duygu analizi yap
    const analysisResults = posts.map(post => {
      const sentiment = analyzeSentiment(post.title, post.votes)
      const keywords = extractKeywords(post.title)

      return {
        sentiment,
        keywords,
        summary: post.title,
        timestamp: new Date(post.published_at).getTime(),
        source: post.source.title,
        url: post.url,
        votes: post.votes
      }
    })

    // Cache kontrolü için header'lar
    const headers = {
      'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150'
    }

    return NextResponse.json(analysisResults, { headers })
  } catch (error) {
    console.error('Duygu analizi hatası:', error)
    return NextResponse.json(
      { error: 'Duygu analizi yapılırken bir hata oluştu' },
      { status: 500 }
    )
  }
} 