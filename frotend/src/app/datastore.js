import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "../api/user.api";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      // -------------------
      // REGISTER
      // -------------------
      register: async (formData) => {
        try {
          set({ loading: true, error: null });

          const data = await registerUser(formData);

          set({
            user: data.user,
            loading: false,
          });

          return { success: true, data };
        } catch (err) {
          set({
            error: err.message,
            loading: false,
          });

          return { success: false };
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
            user: data.user,
            accessToken: data.accessToken,
            isAuthenticated: true,
            loading: false,
          });

          return true;
        } catch (err) {
          set({
            error: err.message || "Invalid credentials",
            loading: false,
          });

          return false;
        }
      },

      // -------------------
      // LOGOUT
      // -------------------
      logout: async () => {
        try {
          await logoutUser();

          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });

          return true;
        } catch (err) {
          set({ error: err.message });
          return false;
        }
      },

      // -------------------
      // REFRESH TOKEN (IMPORTANT FIX)
      // -------------------
      refreshAccessToken: async () => {
        try {
          const data = await refreshToken();

          set({
            accessToken: data.accessToken,
            user: data.user || get().user,
            isAuthenticated: true,
          });

          return data.accessToken;
        } catch (err) {
          // If refresh fails → logout user
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
          });

          return null;
        }
      },
    }),

    // -------------------
    // PERSIST
    // -------------------
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;