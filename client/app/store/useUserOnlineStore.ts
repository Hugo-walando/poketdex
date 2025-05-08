import { create } from 'zustand';

interface OnlineUserState {
  onlineUsers: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
}

export const useOnlineUserStore = create<OnlineUserState>((set) => ({
  onlineUsers: [],
  add: (id) =>
    set((state) =>
      state.onlineUsers.includes(id)
        ? state
        : { onlineUsers: [...state.onlineUsers, id] },
    ),
  remove: (id) =>
    set((state) => ({
      onlineUsers: state.onlineUsers.filter((uid) => uid !== id),
    })),
}));
