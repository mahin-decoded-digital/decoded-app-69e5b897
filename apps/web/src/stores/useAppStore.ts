import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  greeting: string;
  theme: 'light' | 'dark';
  setGreeting: (g: string) => void;
  setTheme: (t: 'light' | 'dark') => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      greeting: 'Hello World',
      theme: 'light',
      setGreeting: (greeting) => set({ greeting }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'hellospark-storage',
    }
  )
);
