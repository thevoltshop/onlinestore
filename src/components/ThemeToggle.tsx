"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label="Переключить тему"
      className="flex h-8 w-8 items-center justify-center rounded-full border border-border hover:border-primary transition text-lg"
      title={theme === "light" ? "Тёмная тема" : "Светлая тема"}
    >
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
}
