import NextAuth from 'next-auth';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from '@/lib/mongo/client';
import { generateAccessToken } from './app/utils/generateAccessToken';

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
      // Si l'utilisateur est défini, on génère un access_token et on l'ajoute au token JWT
      if (user) {
        console.log('Première connexion, génération du token JWT:', user);
        token.accessToken = generateAccessToken(user); // Générer le `access_token`
        token.id = user.id; // Ajouter `user.id` au token JWT
        token.email = user.email;
      }

      // Affichage du token dans les logs
      if (token.accessToken) {
        console.log('Token JWT avec access_token:', token);
      }

      return token; // Retourne le token mis à jour
    },

    async session({ session, token }) {
      // Assurer que l'id de l'utilisateur est dans la session
      if (token.id) {
        session.user.id = token.id; // Assure que l'id de l'utilisateur est bien ajouté à la session
      }
      if (token.email) {
        session.user.email = token.email; // Ajoute aussi l'email de l'utilisateur si disponible
      }
      session.accessToken = token.accessToken as string; // Ajoute l'accessToken à la session

      // Affichage du contenu de la session dans les logs
      console.log('Session user', session.user);
      console.log('Session User ID', session.user.id);
      console.log('Session callback - AccessToken:', session.accessToken);

      return session; // Retourner la session mise à jour
    },

    async redirect({ baseUrl }) {
      return baseUrl + '/'; // Redirige vers la page d'accueil après connexion
    },
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
