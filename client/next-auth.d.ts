import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    username?: string;
    friend_code?: string;
    profile_picture?: string;
    role?: 'user' | 'admin';
    token?: string; // facultatif si tu enregistres le JWT dans session.user
  }

  interface Session {
    user: User;
  }

  interface JWT {
    id?: string;
    email?: string;
    username?: string;
    friend_code?: string;
    profile_picture?: string;
    role?: 'user' | 'admin';
  }
}
