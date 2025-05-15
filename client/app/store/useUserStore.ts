// stores/useUserStore.ts
import { User } from 'next-auth';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  updateUserStore: (updated: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: 'user-store', // 🔐 clé du localStorage
      partialize: (state) => ({ user: state.user }), // on ne persiste pas `isLoading`
    },
  ),
);
