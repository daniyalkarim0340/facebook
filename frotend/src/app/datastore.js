import { create } from "zustand";
import { persist } from "zustand/middleware";
import { registerUser, loginUser } from "../api/user.api";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      // -------------------
      // REGISTER
      // -------------------
      register: async (formData) => {
        try {
          set({ loading: true, error: null });

          const data = await registerUser(formData);

          set({
            user: data,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.message || "Something went wrong",
            loading: false,
          });
        }
      },

      // -------------------
      // LOGIN
      // -------------------
      login: async (formData) => {
        try {
          set({ loading: true, error: null });

          const data = await loginUser(formData);

          set({
            user: data,
            loading: false,
          });
        } catch (err) {
          set({
            error: err.message || "Invalid credentials",
            loading: false,
          });
        }
      },

      // -------------------
      // LOGOUT (important)
      // -------------------
      logout: () => {
        set({
          user: null,
          error: null,
        });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;