import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setFromSession: (session) => {
        if (!session) {
          set({ token: null, user: null });
          return;
        }
        set({
          token: session.user?.token || null,
          user: session.user || null,
        });
      },
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);

export default useAuthStore;

