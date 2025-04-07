import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongo/client';
import type { NextAuthConfig } from 'next-auth';
import { generateAccessToken } from './app/utils/generateAccessToken';
import { sendVerificationRequest } from './lib/authSendRequest';

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
      console.log('JWT Callback - user:', user); // Log user to check for null/undefined

      if (user) {
        token.accessToken = generateAccessToken(user); // Generate the `access_token`
        token.id = user.id;
        token.email = user.email;
      }

      if (token.accessToken) {
        console.log('Token JWT with access_token:', token);
      }
      if (!user) {
        console.log('User is undefined in jwt callback');
      }

      return token; // Return the updated token
    },

    // Session callback : make the accessToken available in the session
    async session({ session, token }) {
      console.log('Session before update:', session); // Log the session before update
      console.log('Token in session callback:', token); // Log the token in session callback

      // Ensure that user.id and email are defined
      session.user.id = token.id as string;
      session.user.email = token.email as string;

      session.accessToken = token.accessToken as string; // Ensure the accessToken is always set

      console.log('Session after update:', session); // Log the updated session
      return session; // Return the updated session
    },
    async redirect({ baseUrl }) {
      return baseUrl + '/'; // Redirect to the base URL after sign-in
    },
  },
} satisfies NextAuthConfig;

console.log('Auth config:', authConfig); // Log the authConfig to check its structure
console.log('NextAuth config:', NextAuth); // Log the NextAuth config to check its structure

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
