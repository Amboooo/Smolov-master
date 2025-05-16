"use client";

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState, useCallback } from 'react';

type Theme = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

interface ThemeProviderState {
  theme: Theme; // The user's preference: light, dark, or system
  setTheme: (theme: Theme) => void;
  resolvedTheme: ResolvedTheme; // The actual theme being applied: light or dark
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  resolvedTheme: "light", // Assume light for SSR and before hydration
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "smolov-strength-theme",
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(initialState.theme);
  const [resolvedTheme, setResolvedThemeState] = useState<ResolvedTheme>(initialState.resolvedTheme);
  const [mounted, setMounted] = useState(false);

  const applyThemePreference = useCallback((pref: Theme) => {
    let currentResolvedTheme: ResolvedTheme;
    if (typeof window !== 'undefined') {
      if (pref === "system") {
        currentResolvedTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } else {
        currentResolvedTheme = pref;
      }
      
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(currentResolvedTheme);
      setResolvedThemeState(currentResolvedTheme);
    }
  }, []);

  // Effect to run on mount to set initial theme from localStorage and system preference
  useEffect(() => {
    setMounted(true);
    let initialTheme: Theme;
    try {
      initialTheme = (window.localStorage.getItem(storageKey) as Theme) || defaultTheme;
    } catch (e) {
      initialTheme = defaultTheme;
      console.warn(`Failed to read theme from localStorage (key: ${storageKey}):`, e);
    }
    setThemeState(initialTheme);
    applyThemePreference(initialTheme);
  }, [storageKey, defaultTheme, applyThemePreference]);


  // Effect to listen for system theme changes if 'system' theme is selected
  useEffect(() => {
    if (theme !== "system" || !mounted || typeof window === 'undefined') {
      return;
    }
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      applyThemePreference("system");
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyThemePreference, mounted]);

  const setTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(storageKey, newTheme);
      } catch (e) {
        console.warn(`Failed to save theme to localStorage (key: ${storageKey}):`, e);
      }
    }
    setThemeState(newTheme);
    if (mounted) { 
        applyThemePreference(newTheme);
    }
  };
  
  const contextValue: ThemeProviderState = {
    theme,
    setTheme,
    resolvedTheme: mounted ? resolvedTheme : 'light', 
  };

  return (
    <ThemeProviderContext.Provider value={contextValue}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
