"use client";

import { m, useReducedMotion } from "framer-motion";

export function Reveal({ children, delay = 0, className = "" }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={className}
      initial={{ opacity: 1, y: 0 }}
      whileInView={reduced ? undefined : { y: [18, 0], opacity: [0.45, 1] }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
