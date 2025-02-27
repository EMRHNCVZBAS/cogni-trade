import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    console.log('API: Oturum kontrolü yapıldı:', session?.user?.id)
    
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Kullanıcının portföyünü bul veya oluştur
    let portfolio = await prisma.portfolio.findUnique({
      where: {
        userId: session.user.id
      },
      include: {
        items: true
      }
    })

    console.log('API: Bulunan portföy:', portfolio)

    if (!portfolio) {
      console.log('API: Portföy bulunamadı, yeni oluşturuluyor...')
      portfolio = await prisma.portfolio.create({
        data: {
          userId: session.user.id,
          items: {
            create: []
          }
        },
        include: {
          items: true
        }
      })
      console.log('API: Yeni portföy oluşturuldu:', portfolio)
    }

    // Güncel fiyatları al
    const items = await Promise.all(
      (portfolio?.items || []).map(async (item) => {
        try {
          console.log(`API: ${item.coinId} için fiyat alınıyor...`)
          const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${item.coinId}&vs_currencies=usd`
          )
          const data = await response.json()
          console.log(`API: ${item.coinId} fiyat verisi:`, data)
          
          const currentPrice = data[item.coinId]?.usd || 0
          const totalValue = item.amount * currentPrice
          const initialValue = item.amount * item.buyPrice
          const profitLoss = totalValue - initialValue
          const profitLossPercentage = (profitLoss / initialValue) * 100

          return {
            ...item,
            currentPrice,
            totalValue,
            profitLoss,
            profitLossPercentage
          }
        } catch (error) {
          console.error(`API: ${item.coinId} fiyat alma hatası:`, error)
          return item
        }
      })
    )

    console.log('API: İşlenmiş portföy verileri:', items)
    return NextResponse.json(items)
  } catch (error) {
    console.error('API: Portföy getirme hatası:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 