import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    username?: string;
    friend_code?: string;
    profile_picture?: string;
    role?: 'user' | 'admin';
    sub?: string;
    accessToken?: string;
  }

  interface Session {
    user: User;
    accessToken?: string; // Ajout de l'accessToken à la session
    error?: string; // Ajout d'une erreur potentielle
  }

  interface JWT {
    id: string;
    email: string;
    accessToken?: string; // Ajout de l'accessToken au token JWT
  }
}
