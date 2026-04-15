import { create } from "zustand";
import { persist } from "zustand/middleware";

type Role = "student" | "teacher" | "admin";

interface AuthState {
  isAuthenticated: boolean;
  role: Role;
  login: (role: Role) => void;
  logout: () => void;
  setRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      role: "student",
      login: (role) => set({ isAuthenticated: true, role }),
      logout: () => set({ isAuthenticated: false, role: "student" }),
      setRole: (role) => set({ role }),
    }),
    {
      name: "collegehub-auth",
    }
  )
);
