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

interface CollegeState {
  name: string;
  shortName: string;
  tagline: string;
  logo: string;
  banner: string;
  primaryColor: string;
  location: string;
  updateDetails: (details: Partial<Omit<CollegeState, "updateDetails">>) => void;
}

export const useCollegeStore = create<CollegeState>()(
  persist(
    (set) => ({
      name: "Indian Institute of Science & Tech",
      shortName: "IIST",
      tagline: "Empowering Future Innovators",
      logo: "https://images.unsplash.com/photo-1592280733791-6981186e000e?q=80&w=2670&auto=format&fit=crop",
      banner: "https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2670&auto=format&fit=crop",
      primaryColor: "#8b5cf6",
      location: "Bangalore, India",
      updateDetails: (details) => set((state) => ({ ...state, ...details })),
    }),
    {
      name: "collegehub-settings",
    }
  )
);
