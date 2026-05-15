import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../api/user.api";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
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
   console.log(data,"jsakjkdajkdjkasdjksjdak");
     set({
      user: true, // or store minimal user like { loggedIn: true }
      accessToken: data.accessToken,
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
    });

    return true;
  } catch (err) {
    set({ error: err.message });
    return false;
  }
},
    }),

    // -------------------
    // PERSIST FIX
    // -------------------
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    })
);

export default useAuthStore;