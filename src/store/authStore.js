import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

// Configure axios defaults
axios.defaults.baseURL = API_URL;

// Add token to requests
axios.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      toast.error("Session expired. Please login again.");
    }
    return Promise.reject(error);
  }
);

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (idToken) => {
        set({ isLoading: true });
        try {
          const response = await axios.post("/auth/google", { idToken });
          const { token, user } = response.data;

          if (user.email !== "abhishek@zuvees.com" && user.role !== "rider") {
            set({ isLoading: false });
            toast.error("Only rider accounts can access this app");
            return { success: false, error: "Not a rider account" };
          }

          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          });

          toast.success(`Welcome, ${user.name}!`);
          return { success: true };
        } catch (error) {
          set({ isLoading: false });
          const message = error.response?.data?.message || "Login failed";
          toast.error(message);
          return { success: false, error: message };
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
        toast.success("Logged out successfully");
      },

      checkAuth: async () => {
        const token = useAuthStore.getState().token;
        if (!token) return;

        try {
          const response = await axios.get("/auth/me");
          if (response.data.role !== "rider") {
            set({
              user: null,
              token: null,
              isAuthenticated: false,
            });
            return;
          }
          set({ user: response.data });
        } catch (error) {
          set({
            user: null,
            token: null,
            isAuthenticated: false,
          });
        }
      },
    }),
    {
      name: "rider-auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
