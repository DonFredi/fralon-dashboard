// modules/products/hooks/use-view-preference.ts
"use client";

import { useEffect, useState } from "react";

export type ViewPreference = "table" | "grid";
const STORAGE_KEY = "products-view-preference";

// default to grid on mobile, table on desktop — checked on first mount
function getInitialView(): ViewPreference {
  if (typeof window === "undefined") return "table";
  const stored = localStorage.getItem(STORAGE_KEY) as ViewPreference | null;
  if (stored === "table" || stored === "grid") return stored;
  return window.innerWidth < 768 ? "grid" : "table";
}

export function useViewPreference() {
  const [view, setView] = useState<ViewPreference>("table");

  // runs only on client after hydration
  useEffect(() => {
    setView(getInitialView());
  }, []);

  const setViewPreference = (next: ViewPreference) => {
    setView(next);
    localStorage.setItem(STORAGE_KEY, next);
  };

  return { view, setView: setViewPreference };
}
