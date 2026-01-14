"use client";

import { useEffect, useState } from "react";
import ThemePreview from "./ThemePreview";
import ErrorBoundary from "./ErrorBoundary";

export default function ShopPage({ shop, products }) {
  const [theme, setTheme] = useState(shop?.theme || "food");

  if (!shop) {
    return (
      <div style={{ padding: 20 }}>
        ⚠️ Toko tidak ditemukan. Silakan daftar dulu.
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <ThemePreview
        theme={theme}
        shop={shop}
        products={products ?? []}
      />
    </ErrorBoundary>
  );
}
