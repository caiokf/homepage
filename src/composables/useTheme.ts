import { ref, onMounted } from "vue";

export type Theme = "light" | "dark";

const STORAGE_KEY = "tech-radar-theme";

// Global reactive state shared across all composable instances
const currentTheme = ref<Theme>("light");

/**
 * Composable for managing application theme (light/dark mode)
 *
 * Features:
 * - Persists theme preference to localStorage
 * - Respects system preference on first visit
 * - Applies theme class to document root for CSS variable switching
 */
export function useTheme() {
  /**
   * Detect system color scheme preference
   */
  function getSystemPreference(): Theme {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  /**
   * Load saved theme from localStorage or use system preference
   */
  function loadTheme(): Theme {
    if (typeof window === "undefined") return "light";

    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
    return getSystemPreference();
  }

  /**
   * Apply theme to document root element
   */
  function applyTheme(theme: Theme) {
    if (typeof document === "undefined") return;

    document.documentElement.setAttribute("data-theme", theme);
    // Also update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        theme === "dark" ? "#1a1a2e" : "#f5f5f5"
      );
    }
  }

  /**
   * Save theme preference to localStorage
   */
  function saveTheme(theme: Theme) {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, theme);
  }

  /**
   * Set the current theme
   */
  function setTheme(theme: Theme) {
    currentTheme.value = theme;
    applyTheme(theme);
    saveTheme(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  function toggleTheme() {
    setTheme(currentTheme.value === "light" ? "dark" : "light");
  }

  /**
   * Check if current theme is dark
   */
  function isDark() {
    return currentTheme.value === "dark";
  }

  // Initialize theme on mount
  onMounted(() => {
    const initialTheme = loadTheme();
    currentTheme.value = initialTheme;
    applyTheme(initialTheme);

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set a preference
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    mediaQuery.addEventListener("change", handleChange);
  });

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    isDark,
  };
}
