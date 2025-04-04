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
        await sendVerificationRequest({ email: identifier, url });
      },
    },
  ],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
