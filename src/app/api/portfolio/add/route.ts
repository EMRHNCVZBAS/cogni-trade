import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { coinId, symbol, amount, buyPrice } = await req.json()

    // Kullanıcının portföyünü bul veya oluştur
    let portfolio = await prisma.portfolio.findUnique({
      where: {
        userId: session.user.id
      },
      include: {
        items: true
      }
    })

    if (!portfolio) {
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
    }

    // Aynı coin'den var mı kontrol et
    const existingItem = portfolio.items.find(item => item.coinId === coinId)

    if (existingItem) {
      // Mevcut coin'in üzerine ekle ve ortalama maliyeti hesapla
      const totalAmount = existingItem.amount + amount
      const totalCost = (existingItem.amount * existingItem.buyPrice) + (amount * buyPrice)
      const averageCost = totalCost / totalAmount

      // Mevcut coin'i güncelle
      const updatedItem = await prisma.portfolioitem.update({
        where: {
          id: existingItem.id
        },
        data: {
          amount: totalAmount,
          buyPrice: averageCost
        }
      })

      return NextResponse.json(updatedItem)
    } else {
      // Yeni coin ekle
      const portfolioItem = await prisma.portfolioitem.create({
        data: {
          portfolioId: portfolio.id,
          coinId,
          symbol,
          amount,
          buyPrice
        }
      })

      return NextResponse.json(portfolioItem)
    }
  } catch (error) {
    console.error('Portfolio add error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 