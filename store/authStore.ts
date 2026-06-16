'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  name: string;
  email: string;
  role: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
};

const DEMO_EMAIL = 'admin@spybee.com.co';
const DEMO_PASSWORD = 'spybee2026';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      login: (email, password) => {
        const isValid =
          email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;

        if (isValid) {
          set({
            user: { name: 'Julian S.', email: DEMO_EMAIL, role: 'Superadmin' },
            isAuthenticated: true,
          });
        }

        return isValid;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'spybee-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);