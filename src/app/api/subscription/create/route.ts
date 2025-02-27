import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    // Oturumu kontrol et
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user?.id) {
      console.log('Unauthorized: No session or user ID', { session })
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Request body'den verileri al
    const { userId, plan, startDate, endDate } = await req.json()

    // Kullanıcı ID'sini doğrula
    if (session.user.id !== userId) {
      console.log('Unauthorized: Session user ID mismatch', {
        sessionUserId: session.user.id,
        requestUserId: userId
      })
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Mevcut aktif aboneliği kontrol et
    const existingSubscription = await prisma.subscription.findFirst({
      where: {
        userId: userId,
        endDate: {
          gt: new Date(),
        },
      },
    })

    if (existingSubscription) {
      // Mevcut aboneliği güncelle
      const updatedSubscription = await prisma.subscription.update({
        where: {
          id: existingSubscription.id,
        },
        data: {
          plan: plan,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          status: 'active',
        },
      })
      return NextResponse.json(updatedSubscription)
    }

    // Yeni abonelik oluştur
    const subscription = await prisma.subscription.create({
      data: {
        userId: userId,
        plan: plan,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status: 'active',
      },
    })

    // Kullanıcının rolünü güncelle
    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: 'premium',
      },
    })

    return NextResponse.json(subscription)
  } catch (error) {
    console.error('Subscription creation error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 