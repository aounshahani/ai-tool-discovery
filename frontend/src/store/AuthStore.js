// src/store/useAuthStore.js

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const AuthStore = create(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      
      setToken: (token) => set({ token }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setUser: (user) => set({ user }),

      login: (token, refreshToken, user) => {
        set({ token, refreshToken, user });
      },

      logout: () => {
        set({ token: null, refreshToken: null, user: null });
      },
    }),
    {
      name: 'auth-storage', // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage
      partialize: (state) => ({ token: state.token, refreshToken: state.refreshToken }),
    }
  )
);

export default AuthStore;