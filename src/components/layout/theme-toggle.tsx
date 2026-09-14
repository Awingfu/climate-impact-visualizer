"use client";

import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { applyTheme } from "@/lib/theme";

function toggleTheme() {
  const isDark = document.documentElement.classList.contains("dark");
  applyTheme(isDark ? "light" : "dark");
}

export function ThemeToggle() {
  return (
    <Button type="button" variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle dark mode">
      <Sun className="size-[18px] dark:hidden" aria-hidden="true" />
      <Moon className="hidden size-[18px] dark:block" aria-hidden="true" />
    </Button>
  );
}
