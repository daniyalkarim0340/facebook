import { create } from "zustand";
import { persist } from "zustand/middleware";
import { registerUser } from "../api/user.api";


const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,

      // -------------------
      // REGISTER ACTION
      // -------------------
      register: async (formData) => {
        try {
          set({ loading: true, error: null });

          const data = await registerUser(formData); //  API call

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
    }),
    {
      name: "auth-storage",
    }
  )
);

export default useAuthStore;