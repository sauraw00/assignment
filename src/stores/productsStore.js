import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiFetch, buildCacheKey } from "@/lib/apiClient";

// Cache paginated and filtered product responses keyed by params.
const useProductsStore = create(
  persist(
    (set, get) => ({
      cache: {},
      byId: {},
      categories: [],
      isLoading: false,
      error: null,
      async fetchProducts(params = { limit: 10, skip: 0, q: "", category: "" }) {
        const path = params?.category
          ? `/products/category/${params.category}`
          : params?.q
          ? "/products/search"
          : "/products";
        const key = buildCacheKey(path, params);
        const cached = get().cache[key];
        if (cached) return cached;

        set({ isLoading: true, error: null });
        try {
          const data = await apiFetch(path, {
            params: {
              limit: params.limit,
              skip: params.skip,
              q: params.q,
            },
          });
          const payload = {
            products: data.products || [],
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
      async fetchProductById(id) {
        if (!id) return null;
        const cached = get().byId[id];
        if (cached) return cached;
        set({ isLoading: true, error: null });
        try {
          const data = await apiFetch(`/products/${id}`);
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
      async fetchCategories() {
        if (get().categories.length) return get().categories;
        try {
          const categories = await apiFetch("/products/categories");
          const normalized = Array.isArray(categories)
            ? categories.map((cat) =>
                typeof cat === "string" ? cat : cat.slug || cat.name
              )
            : [];
          set({ categories: normalized });
          return normalized;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "products-store",
      partialize: (state) => ({
        cache: state.cache,
        byId: state.byId,
        categories: state.categories,
      }),
    }
  )
);

export default useProductsStore;

