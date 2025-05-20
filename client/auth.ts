import NextAuth, { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongo/client';
import axiosClient from './lib/axios';
import { JWT } from 'next-auth/jwt';

async function refreshAccessToken(token: JWT) {
  try {
    const url = 'https://oauth2.googleapis.com/token';

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: process.env.AUTH_GOOGLE_ID!,
        client_secret: process.env.AUTH_GOOGLE_SECRET!,
        grant_type: 'refresh_token',
        refresh_token: token.refreshToken!,
      }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      console.error('❌ Erreur lors du refresh token');
      throw refreshedTokens;
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
    };
  } catch (err) {
    console.error('❌ Erreur lors du refresh token :', err);
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

export const authConfig = {
  adapter: MongoDBAdapter(clientPromise),
  useSecureCookies: process.env.NODE_ENV === 'production',
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Google({
      authorization: {
        params: {
          access_type: 'offline',
          prompt: 'consent',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id as string;
        token.email = user.email as string;
      }

      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
      }

      if (token.expiresAt && Date.now() >= Number(token.expiresAt) * 1000) {
        token = await refreshAccessToken(token);
        return token;
      }

      try {
        const res = await axiosClient.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          },
        );

        const data = res.data;
        token.username = data.username;
        token.friend_code = data.friend_code;
        token.profile_picture = data.profile_picture;
      } catch (err) {
        console.error('❌ Erreur lors du fetch utilisateur backend:', err);
      }

      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.username = token.username as string;
      session.user.friend_code = token.friend_code as string;
      session.accessToken = token.accessToken as string;
      session.expiresAt = token.expiresAt as number;
      session.user.profile_picture = token.profile_picture as string;
      return session;
    },

    async redirect({ baseUrl }) {
      return baseUrl + '/';
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
export const getServerAuthSession = auth;
