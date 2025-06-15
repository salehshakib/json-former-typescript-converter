
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type {HTMLAttributes} from 'react';
import { cn } from "@/lib/utils";

interface ThemeToggleSwitchProps extends HTMLAttributes<HTMLDivElement> {}

export function ThemeToggleButton({ className, ...props }: ThemeToggleSwitchProps) {
  const { setTheme, resolvedTheme } = useTheme();

  const isDarkMode = resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkMode ? "light" : "dark");
  };

  return (
    <div className={cn("flex items-center space-x-2", className)} {...props}>
      <Sun className={cn("h-[1.2rem] w-[1.2rem]", {"text-primary": !isDarkMode, "text-muted-foreground": isDarkMode})} />
      <Switch
        id="theme-switch"
        checked={isDarkMode}
        onCheckedChange={toggleTheme}
        aria-label="Toggle theme"
      />
      <Moon className={cn("h-[1.2rem] w-[1.2rem]", {"text-primary": isDarkMode, "text-muted-foreground": !isDarkMode})} />
      <Label htmlFor="theme-switch" className="sr-only">
        Toggle theme
      </Label>
    </div>
  );
}
