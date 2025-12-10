import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiFetch, buildCacheKey } from "@/lib/apiClient";

// Cache list/search responses by query key to avoid repeated API calls.
const useUsersStore = create(
  persist(
    (set, get) => ({
      cache: {},
      byId: {},
      isLoading: false,
      error: null,
      async fetchUsers(params = { limit: 10, skip: 0, q: "" }) {
        const path = params?.q ? "/users/search" : "/users";
        const key = buildCacheKey(path, params);
        const cached = get().cache[key];
        if (cached) return cached;

        set({ isLoading: true, error: null });
        try {
          const data = await apiFetch(path, { params });
          const payload = {
            users: data.users || [],
            total: data.total || 0,
            limit: data.limit || params.limit,
            skip: data.skip || params.skip,
          };
          set((state) => ({
            cache: { ...state.cache, [key]: payload },
            isLoading: false,
          }));
          return payload;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      async fetchUserById(id) {
        if (!id) return null;
        const cached = get().byId[id];
        if (cached) return cached;
        set({ isLoading: true, error: null });
        try {
          const data = await apiFetch(`/users/${id}`);
          set((state) => ({
            byId: { ...state.byId, [id]: data },
            isLoading: false,
          }));
          return data;
        } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "users-store",
      partialize: (state) => ({
        cache: state.cache,
        byId: state.byId,
      }),
    }
  )
);

export default useUsersStore;

