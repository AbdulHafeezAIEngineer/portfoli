"use client";

import { createContext, useContext } from "react";

export type MotionPreference = "system" | "full" | "reduced";
export const MotionPreferenceContext = createContext<{
  preference: MotionPreference;
  reduced: boolean;
  setPreference: (value: MotionPreference) => void;
}>({ preference: "system", reduced: true, setPreference: () => {} });

export const useMotionPreference = () => useContext(MotionPreferenceContext);

export function MotionControl() {
  const { preference, setPreference } = useMotionPreference();
  return (
    <label className="motion-control">
      <span>Motion</span>
      <select
        aria-label="Animation preference"
        value={preference}
        onChange={(event) =>
          setPreference(event.target.value as MotionPreference)
        }
      >
        <option value="system">Auto</option>
        <option value="full">On</option>
        <option value="reduced">Off</option>
      </select>
    </label>
  );
}
