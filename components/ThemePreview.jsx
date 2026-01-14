"use client";

import { useEffect, useState } from "react";

// 🔒 HARUS SAMA PERSIS DENGAN ShopPage
const THEME_MAP = {
  food: () => import("./themes/food"),
  jasa: () => import("./themes/jasa"),
  katalog: () => import("./themes/katalog"),
};

export default function ThemePreview({ theme, shop, products = [] }) {
  const [ThemeComponent, setThemeComponent] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function loadTheme() {
      try {
        const themeKey = theme || "food";
        const loader = THEME_MAP[themeKey];

        if (!loader) {
          const fallback = await import("./themes/_fallback");
          if (mounted) setThemeComponent(() => fallback.default);
          return;
        }

        const mod = await loader();
        if (mounted) setThemeComponent(() => mod.default);
      } catch {
        const fallback = await import("./themes/_fallback");
        if (mounted) setThemeComponent(() => fallback.default);
      }
    }

    loadTheme();
    return () => {
      mounted = false;
    };
  }, [theme]);

  if (!ThemeComponent) {
    return <div style={{ padding: 20 }}>Loading preview...</div>;
  }

  return (
    <div style={{ transform: "scale(0.9)", pointerEvents: "none" }}>
      <ThemeComponent shop={shop} products={products} />
    </div>
  );
}
