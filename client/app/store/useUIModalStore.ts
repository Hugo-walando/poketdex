import { create } from 'zustand';

interface UIModalStore {
  isCompleteProfileModalOpen: boolean;
  openCompleteProfileModal: () => void;
  closeCompleteProfileModal: () => void;
}

export const useUIModalStore = create<UIModalStore>((set) => ({
  isCompleteProfileModalOpen: false,
  openCompleteProfileModal: () => set({ isCompleteProfileModalOpen: true }),
  closeCompleteProfileModal: () => set({ isCompleteProfileModalOpen: false }),
}));
