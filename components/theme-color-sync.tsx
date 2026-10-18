"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import palette from "@/data/theme-tokens.json";

/** Browser chrome follows the selected site theme, including client navigation. */
export function ThemeColorSync() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => {
      const theme = root.dataset.theme === "light" ? "light" : "dark";
      for (const meta of document.querySelectorAll<HTMLMetaElement>(
        'meta[name="theme-color"]',
      ))
        meta.content = palette[theme].background;
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
