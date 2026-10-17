"use client";

import { RevealObserver } from "./reveal-observer";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user"><RevealObserver />{children}</MotionConfig>
    </LazyMotion>
  );
}
