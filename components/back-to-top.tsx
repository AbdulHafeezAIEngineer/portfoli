"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { site } from "@/data/site";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const update = () => setVisible(window.scrollY > 600);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  if (!visible) return null;
  return <a href="#top" className="back-to-top icon-button" aria-label={site.ui.back}><ArrowUp size={19} /></a>;
}
