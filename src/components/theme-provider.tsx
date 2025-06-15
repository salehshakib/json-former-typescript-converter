"use client"

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  attribute?: string; // typically "class"
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme?: "dark" | "light";
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "jsonformer-theme",
  attribute = "class",
  enableSystem = true,
  disableTransitionOnChange = false, // Not fully implemented here, but part of next-themes API
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });
  const [resolvedTheme, setResolvedTheme] = useState<'dark' | 'light' | undefined>();


  useEffect(() => {
    const root = window.document.documentElement;
    const currentTheme = theme;
    let newResolvedTheme: "dark" | "light";

    if (currentTheme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      newResolvedTheme = systemTheme;
    } else {
      newResolvedTheme = currentTheme as "dark" | "light"; // Assuming theme is 'dark' or 'light' if not 'system'
    }
    
    setResolvedTheme(newResolvedTheme);

    // Apply class to HTML element
    root.classList.remove("light", "dark");
    if (newResolvedTheme) {
      root.classList.add(newResolvedTheme);
    }
  }, [theme, enableSystem]);


  const setTheme = (newTheme: Theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(storageKey, newTheme);
    }
    setThemeState(newTheme);
  };

  const value = {
    theme,
    setTheme,
    resolvedTheme,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
