import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      selectedChatPartner: null,
      activeConversation: null,
      setUser: (user) => set({ user }),
      setSelectedChatPartner: (partner) =>
        set({ selectedChatPartner: partner }),
      setActiveConversation: (conversation) =>
        set({ activeConversation: conversation }),
      logout: () => set({ user: null, selectedChatPartner: null, activeConversation: null }),
    }),
    { name: "user-storage" },
  ),
);
