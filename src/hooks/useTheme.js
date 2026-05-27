import { useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("borsa_theme") || "dark"; } catch { return "dark"; }
  });

  const toggleTheme = () => {
    setTheme(t => {
      const next = t === "dark" ? "light" : "dark";
      try { localStorage.setItem("borsa_theme", next); } catch {}
      return next;
    });
  };

  return { theme, toggleTheme };
}
