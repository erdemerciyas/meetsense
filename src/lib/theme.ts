export type ThemeMode = "light" | "dark";

export const THEME_STORAGE_KEY = "meetsense-theme";

export const meetsenseColors = {
  dark: {
    bg: "#0c0a08",
    surface: "#16120e",
    surfaceRaised: "#221c16",
    border: "#3d3228",
    accent: "#f59e0b",
    accentDim: "#d97706",
    accentWarm: "#fcd34d",
    muted: "#a08b72",
    text: "#f5efe6",
    glow: "rgba(245, 158, 11, 0.3)",
    speakers: ["#f59e0b", "#fcd34d", "#d97706"] as const,
  },
  light: {
    bg: "#efeae2",
    surface: "#f8f4ed",
    surfaceRaised: "#fffcf7",
    border: "#d4c6b0",
    accent: "#b45309",
    accentDim: "#92400e",
    accentWarm: "#d97706",
    muted: "#6f6254",
    text: "#1a1410",
    glow: "rgba(180, 83, 9, 0.22)",
    speakers: ["#b45309", "#d97706", "#92400e"] as const,
  },
} as const;

export function getStoredTheme(): ThemeMode | null {
  if (typeof window === "undefined") return null;
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    /* ignore */
  }
  return null;
}

export function applyThemeClass(theme: ThemeMode) {
  const root = document.documentElement;
  root.classList.toggle("light", theme === "light");
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

export function resolveInitialTheme(): ThemeMode {
  const stored = getStoredTheme();
  if (stored) return stored;
  return "dark";
}

export const themeBootScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var theme=(t==="light"||t==="dark")?t:"dark";var root=document.documentElement;root.classList.toggle("light",theme==="light");root.classList.toggle("dark",theme==="dark");root.style.colorScheme=theme;}catch(e){}})();`;
