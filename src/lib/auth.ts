import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import prisma from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id
        
        // Kullanıcının abonelik durumunu kontrol et
        const subscription = await prisma.subscription.findFirst({
          where: {
            userId: user.id,
            endDate: {
              gt: new Date(), // Bitiş tarihi bugünden sonra olan
            },
            status: 'active',
          },
        })

        // Kullanıcı bilgilerini güncelle
        session.user.role = subscription ? 'premium' : 'free'
        session.user.plan = subscription?.plan || null
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
} 