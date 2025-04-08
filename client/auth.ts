import NextAuth, { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongo/client'; // Ton client MongoDB

export const authConfig = {
  adapter: MongoDBAdapter(clientPromise), // On utilise MongoDBAdapter
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login', // Page de connexion personnalisée
  },
  providers: [Google],
  callbacks: {
    async jwt({ token, user, account }) {
      // Lors de la première connexion, on génère un access token et on l'ajoute au token JWT
      if (user) {
        token.id = user.id; // Enregistrer l'id de l'utilisateur
        token.email = user.email; // Enregistrer l'email
      }

      if (account) {
        token.accessToken = account.access_token; // Enregistrer le token d'accès si authentification via Google
        token.refreshToken = account.refresh_token; // Enregistrer le refresh_token si nécessaire
      }

      return token;
    },

    async session({ session, token }) {
      // Ajouter les informations à la session utilisateur
      session.user.id = token.id as string;
      session.user.email = token.email as string;
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
