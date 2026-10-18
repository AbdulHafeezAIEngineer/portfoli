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
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const saved = document.documentElement.dataset.motion;
    if (saved === "full" || saved === "reduced") setPreference(saved);
    setReady(true);
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
      value={{ preference, reduced, ready, setPreference: updatePreference }}
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
