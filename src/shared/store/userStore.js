import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      clearIfTokenExpired: () => {
        const user = get().user;
        if (user?.accessToken) {
          try {
            const [, payload] = user.accessToken.split(".");
            const decoded = JSON.parse(atob(payload));
            if (decoded.exp && Date.now() / 1000 > decoded.exp) {
              set({ user: null });
              window.localStorage.removeItem("user-storage");
            }
          } catch (e) {
            set({ user: null });
            window.localStorage.removeItem("user-storage");
          }
        }
      },
    }),
    {
      name: "user-storage",
    },
  ),
);
