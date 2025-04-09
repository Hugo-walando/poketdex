import NextAuth, { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongo/client'; // Ton client MongoDB
import axios from 'axios';
import axiosClient from './lib/axios';

export const authConfig = {
  adapter: MongoDBAdapter(clientPromise), // On utilise MongoDBAdapter
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login', // Page de connexion personnalisée
  },
  providers: [Google],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }

      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
      }

      // 🧠 Récupérer les infos supplémentaires de l'utilisateur via ton backend Express
      try {
        console.log(process.env.NEXT_PUBLIC_API_URL);
        const res = await axiosClient.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token.accessToken}`,
            },
          },
        );

        const data = res.data;

        // Injecter les infos personnalisées dans le token
        token.username = data.username;
        token.friend_code = data.friend_code;
        // ajoute d'autres champs si besoin
      } catch (err) {
        console.error('❌ Erreur lors du fetch des infos utilisateur:', err);
      }

      return token;
    },

    async session({ session, token }) {
      // Ajouter les informations à la session utilisateur
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.username = token.username as string;
      session.user.friend_code = token.friend_code as string;
      session.accessToken = token.accessToken as string;

      // MongoDBAdapter gère automatiquement la création ou la mise à jour de l'utilisateur,
      // donc il n'est pas nécessaire d'ajouter une logique manuelle pour créer ou mettre à jour l'utilisateur

      return session;
    },
    async redirect({ baseUrl }) {
      return baseUrl + '/';
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
