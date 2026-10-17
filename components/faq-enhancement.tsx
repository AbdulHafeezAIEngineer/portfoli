"use client";
import { useEffect } from "react";
import { enhanceFaq } from "@/lib/faq-animation";
import { useMotionPreference } from "./motion-preference";

/** Native FAQ content and its small enhancement are both ready on page load. */
export function FaqEnhancement() {
  const { reduced } = useMotionPreference();
  useEffect(() => {
    const root = document.getElementById("faq");
    if (root && !reduced) return enhanceFaq(root);
  }, [reduced]);
  return null;
}
