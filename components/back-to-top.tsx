"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { site } from "@/data/site";
import { subscribeScroll } from "@/lib/scroll";

export function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    return subscribeScroll(({ y }) => setVisible(y > 600));
  }, []);
  if (!visible) return null;
  return (
    <a
      href="#top"
      className="back-to-top icon-button"
      aria-label={site.ui.back}
    >
      <ArrowUp size={19} />
    </a>
  );
}
