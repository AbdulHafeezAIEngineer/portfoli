"use client";
import { m, useReducedMotion } from "framer-motion";

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  return (
    <m.div
      className={`motion-reveal ${className}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12, margin: "0px 0px -20px 0px" }}
      variants={{
        hidden: { opacity: 0, y: 32, scale: 0.985, filter: "blur(5px)" },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: {
            duration: reduced ? 0 : 0.75,
            delay: reduced ? 0 : delay,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
    >
      {children}
    </m.div>
  );
}
