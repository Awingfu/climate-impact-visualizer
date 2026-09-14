export const THEME_STORAGE_KEY = "climate-impact-visualizer:theme";

/** Sets `document.documentElement`'s dark class + persists the choice. Run only on the client. */
export function applyTheme(theme: "light" | "dark"): void {
  document.documentElement.classList.toggle("dark", theme === "dark");
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage unavailable; theme just won't persist across reloads.
  }
}

/**
 * Inline script text (inlined into a beforeInteractive <Script>, see app/layout.tsx) that
 * applies the stored/system theme before first paint, avoiding a flash of the wrong theme.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var s=localStorage.getItem(k);var d=s?s==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
