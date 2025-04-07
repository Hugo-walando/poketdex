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
  }
  interface Session {
    user: User;
    accessToken?: string;
  }
}
