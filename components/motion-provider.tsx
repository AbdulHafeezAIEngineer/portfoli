"use client";

import { RevealObserver } from "./reveal-observer";
import { LazyMotion, domAnimation, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import {
  MotionPreferenceContext,
  type MotionPreference,
} from "./motion-preference";

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = useState<MotionPreference>("full");
  useEffect(() => {
    const saved = document.documentElement.dataset.motion;
    if (saved === "full" || saved === "reduced") setPreference(saved);
  }, []);
  const reduced = preference === "reduced";
  function updatePreference(value: MotionPreference) {
    setPreference(value);
    document.documentElement.dataset.motion = value;
    try {
      localStorage.setItem("elvora-motion", value);
    } catch {
      /* Optional persistence. */
    }
  }
  return (
    <MotionPreferenceContext.Provider
      value={{ preference, reduced, setPreference: updatePreference }}
    >
      <LazyMotion features={domAnimation} strict>
        <MotionConfig reducedMotion={reduced ? "always" : "never"}>
          <RevealObserver />
          {children}
        </MotionConfig>
      </LazyMotion>
    </MotionPreferenceContext.Provider>
  );
}
