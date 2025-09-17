import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useProfileDecorStore = create(
  persist(
    (set, get) => ({
      decor: null,
      loading: false,
      error: null,

      setDecor: (decor) => set({ decor }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),

      updateDecorField: (field, value) => {
        const currentDecor = get().decor;
        if (currentDecor) {
          set({
            decor: {
              ...currentDecor,
              [field]: value,
            },
          });
        }
      },

      clearDecor: () => set({ decor: null, error: null }),
    }),
    {
      name: "profile-decor-storage",
    },
  ),
);
