import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      selectedChatPartner: null,
      setUser: (user) => set({ user }),
      setSelectedChatPartner: (partner) =>
        set({ selectedChatPartner: partner }),
      logout: () => set({ user: null, selectedChatPartner: null }),
    }),
    { name: "user-storage" },
  ),
);
