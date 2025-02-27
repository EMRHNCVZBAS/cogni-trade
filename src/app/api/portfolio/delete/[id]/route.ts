import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Kullanıcının portföyünü kontrol et
    const portfolio = await prisma.portfolio.findUnique({
      where: {
        userId: session.user.id
      },
      include: {
        items: {
          where: {
            id: params.id
          }
        }
      }
    })

    if (!portfolio || portfolio.items.length === 0) {
      return new NextResponse('Not Found', { status: 404 })
    }

    // Coin'i sil
    await prisma.portfolioitem.delete({
      where: {
        id: params.id
      }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Portfolio delete error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 