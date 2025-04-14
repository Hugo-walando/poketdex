// stores/useUserStore.ts
import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  username?: string;
  friend_code?: string;
  accessToken?: string;
  // Tu peux ajouter d'autres champs ici
}

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,

  setUser: (user) => set({ user }),

  clearUser: () => set({ user: null }),
}));
