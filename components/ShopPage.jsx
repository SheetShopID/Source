"use client";

import { useEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";

// ✅ WHITELIST THEME (single source of truth) tes
const THEME_MAP = {
  food: () => import("./themes/food"),
  jasa: () => import("./themes/jasa"),
  katalog: () => import("./themes/katalog"),
};

export default function ShopPage({ shop, products }) {
  const [ThemeComponent, setThemeComponent] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadTheme() {
      try {
        const themeKey = shop.theme || "food";

        const loader = THEME_MAP[themeKey];

        if (!loader) {
          console.warn(`[THEME] Invalid theme "${themeKey}", fallback used`);
          const fallback = await import("./themes/_fallback");
          if (mounted) setThemeComponent(() => fallback.default);
          return;
        }

        const mod = await loader();
        if (mounted) setThemeComponent(() => mod.default);
      } catch (err) {
        console.error("[THEME LOAD ERROR]", err);
        const fallback = await import("./themes/_fallback");
        if (mounted) setThemeComponent(() => fallback.default);
      }
    }

    loadTheme();

    return () => {
      mounted = false;
    };
  }, [shop.theme]);

  if (!ThemeComponent) {
    return <div style={{ padding: 20 }}>Loading theme...</div>;
  }

  return (
    <ErrorBoundary>
      <ThemeComponent shop={shop} products={products} />
    </ErrorBoundary>
  );
}

