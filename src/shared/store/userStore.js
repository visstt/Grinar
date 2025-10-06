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
      loginOpen: false,
      setLoginOpen: (value) => set({ loginOpen: value }),
      registrationOpen: false,
      setRegistrationOpen: (value) => set({ registrationOpen: value }),
      registrationStep: 1,
      setRegistrationStep: (step) => set({ registrationStep: step }),
      registrationEmail: "",
      setRegistrationEmail: (email) => set({ registrationEmail: email }),
      handleOpenLogin: () =>
        set((state) => ({
          loginOpen: true,
          registrationOpen: false,
          registrationStep: 1,
          registrationEmail: "",
        })),
      handleOpenRegistration: () =>
        set((state) => ({
          loginOpen: false,
          registrationOpen: true,
        })),
      handleRegistrationSuccess: (email) =>
        set((state) => ({
          registrationEmail: email,
          registrationStep: 2,
        })),
      handleCloseRegistration: () =>
        set((state) => ({
          registrationOpen: false,
          registrationStep: 1,
          registrationEmail: "",
        })),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        user: state.user, // Only persist the user state
      }),
    },
  ),
);
