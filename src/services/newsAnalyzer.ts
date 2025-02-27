import { NlpManager } from 'node-nlp'

interface AnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  score: number
  keywords: string[]
  summary: string
  titleSentiment: 'positive' | 'negative' | 'neutral'
  contentSentiment: 'positive' | 'negative' | 'neutral'
}

interface SentenceScore {
  text: string
  score: number
}

interface SentimentAnalysis {
  score: number
  comparative: number
  sentiment: 'positive' | 'negative' | 'neutral'
}

class NewsAnalyzer {
  private manager: NlpManager
  private cryptoTerms = new Set([
    'bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'blockchain',
    'cryptocurrency', 'token', 'altcoin', 'defi', 'mining',
    'wallet', 'exchange', 'trading', 'market', 'bull', 'bear'
  ])

  constructor() {
    this.manager = new NlpManager({ languages: ['en'] })
    this.trainModel()
  }

  private async trainModel() {
    // Pozitif örnekler
    this.manager.addDocument('en', 'price increase', 'positive')
    this.manager.addDocument('en', 'bullish market', 'positive')
    this.manager.addDocument('en', 'new partnership', 'positive')
    this.manager.addDocument('en', 'adoption growing', 'positive')
    this.manager.addDocument('en', 'successful launch', 'positive')
    this.manager.addDocument('en', 'breakthrough technology', 'positive')
    this.manager.addDocument('en', 'record high', 'positive')
    this.manager.addDocument('en', 'strong growth', 'positive')

    // Negatif örnekler
    this.manager.addDocument('en', 'price crash', 'negative')
    this.manager.addDocument('en', 'bearish market', 'negative')
    this.manager.addDocument('en', 'hack', 'negative')
    this.manager.addDocument('en', 'scam', 'negative')
    this.manager.addDocument('en', 'regulation concerns', 'negative')
    this.manager.addDocument('en', 'market decline', 'negative')
    this.manager.addDocument('en', 'security breach', 'negative')
    this.manager.addDocument('en', 'volatility risk', 'negative')

    await this.manager.train()
  }

  private async analyzePart(text: string): Promise<{sentiment: string, score: number}> {
    if (!text) return { sentiment: 'neutral', score: 0 }

    const result = await this.manager.process('en', text)
    const sentiment = result.sentiment.vote
    const score = result.sentiment.score

    return {
      sentiment: sentiment || 'neutral',
      score: score || 0
    }
  }

  private extractKeywords(text: string): string[] {
    const words = text.toLowerCase().split(/\W+/)
    const keywordMap = new Map<string, number>()

    words.forEach(word => {
      if (word.length > 3 && this.cryptoTerms.has(word)) {
        keywordMap.set(word, (keywordMap.get(word) || 0) + 1)
      }
    })

    return Array.from(keywordMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)
  }

  private generateSummary(text: string): string {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || []
    if (sentences.length === 0) return text

    // En uzun cümleyi özet olarak seç
    return sentences.reduce((longest, current) => 
      current.length > longest.length ? current : longest
    ).trim()
  }

  public async analyze(title: string, description: string): Promise<AnalysisResult> {
    console.log('Analyzing:', { title, description })

    const [titleAnalysis, contentAnalysis] = await Promise.all([
      this.analyzePart(title),
      this.analyzePart(description)
    ])

    // Başlık ve içerik analizlerini ağırlıklı olarak birleştir
    const titleWeight = 0.4
    const contentWeight = 0.6
    const combinedScore = (titleAnalysis.score * titleWeight) + (contentAnalysis.score * contentWeight)

    const sentiment = combinedScore > 0.1 ? 'positive' : 
                     combinedScore < -0.1 ? 'negative' : 
                     'neutral'

    return {
      sentiment,
      score: combinedScore,
      keywords: this.extractKeywords(title + ' ' + description),
      summary: this.generateSummary(description || title),
      titleSentiment: titleAnalysis.sentiment as 'positive' | 'negative' | 'neutral',
      contentSentiment: contentAnalysis.sentiment as 'positive' | 'negative' | 'neutral'
    }
  }
}

export const newsAnalyzer = new NewsAnalyzer() 