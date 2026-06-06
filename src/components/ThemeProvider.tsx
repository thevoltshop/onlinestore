"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

const Ctx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

export function useTheme() {
  return useContext(Ctx);
}

function autoTheme(): Theme {
  const h = new Date().getHours();
  return h >= 20 || h < 8 ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    const t = saved ?? autoTheme();
    apply(t);
    setTheme(t);
  }, []);

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", next);
    apply(next);
    setTheme(next);
  }

  return <Ctx.Provider value={{ theme, toggle }}>{children}</Ctx.Provider>;
}

function apply(t: Theme) {
  document.documentElement.classList.toggle("dark", t === "dark");
}
