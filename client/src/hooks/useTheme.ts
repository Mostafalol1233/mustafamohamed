import { useState, useEffect } from "react";

export type ThemeMode = "light" | "dark" | "system";

function systemIsDark() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function useTheme() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("portfolio-theme") as ThemeMode) ?? "system";
  });

  const isDark = mode === "dark" || (mode === "system" && systemIsDark());

  useEffect(() => {
    const apply = (dark: boolean) => document.documentElement.classList.toggle("dark", dark);

    if (mode === "system") {
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      apply(mq.matches);
      const handler = (e: MediaQueryListEvent) => apply(e.matches);
      mq.addEventListener("change", handler);
      localStorage.setItem("portfolio-theme", "system");
      return () => mq.removeEventListener("change", handler);
    } else {
      apply(mode === "dark");
      localStorage.setItem("portfolio-theme", mode);
    }
  }, [mode]);

  const toggle = () => setMode(m => m === "light" ? "dark" : m === "dark" ? "system" : "light");
  const setTheme = (m: ThemeMode) => setMode(m);

  return { isDark, mode, toggle, setTheme };
}
