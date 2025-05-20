import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    username?: string;
    friend_code?: string;
    profile_picture?: string;
    role?: 'user' | 'admin';
    accessToken?: string;
    trade_count?: number;
  }

  interface Session {
    user: User;
    accessToken?: string; // Ajout de l'accessToken à la session
    expiresAt?: number; // Ajout de la date d'expiration
    error?: string; // Ajout d'une erreur potentielle
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    email?: string;
    username?: string;
    friend_code?: string;
    profile_picture?: string;
    role?: 'user' | 'admin';
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    trade_count?: number;
    error?: string;
  }
}
