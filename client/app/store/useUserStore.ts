// stores/useUserStore.ts
import { User } from 'next-auth';
import { create } from 'zustand';

// interface User {
//   id: string;
//   email: string;
//   username?: string;
//   friend_code?: string;
//   accessToken?: string;
//   // Tu peux ajouter d'autres champs ici
// }

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  updateUserStore: (updated: Partial<User>) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  clearUser: () => set({ user: null, isLoading: false }),
  setLoading: (loading) => set({ isLoading: loading }),
  updateUserStore: (updated) =>
    set((state) => ({
      user: {
        ...state.user,
        ...updated,
      },
    })),
}));
