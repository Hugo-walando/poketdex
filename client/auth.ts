import NextAuth from 'next-auth';
import type { NextAuthConfig } from 'next-auth';
import { sendVerificationRequest } from '@/lib/authSendRequest';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongo/client';

export const authConfig = {
  adapter: MongoDBAdapter(clientPromise),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    {
      id: 'resend',
      type: 'email',
      name: 'Email',
      async sendVerificationRequest({ identifier, url }) {
        console.log('📨 sendVerificationRequest INIT from provider', {
          identifier,
          url,
        });
        await sendVerificationRequest({ email: identifier, url });
      },
    },
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl + '/';
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
