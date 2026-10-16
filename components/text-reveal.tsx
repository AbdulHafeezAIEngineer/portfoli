"use client";
import { m, useReducedMotion } from "framer-motion";

export function TextReveal({
  text,
  as = "h2",
  id,
  className = "",
}: {
  text: string;
  as?: "h1" | "h2" | "h3";
  id?: string;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const Heading = as === "h1" ? m.h1 : as === "h3" ? m.h3 : m.h2;
  return (
    <Heading
      id={id}
      className={`text-reveal ${className}`}
      aria-label={text.replaceAll("\n", " ")}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.45 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: reduced ? 0 : 0.035,
            delayChildren: reduced ? 0 : 0.02,
          },
        },
      }}
    >
      {text.split("\n").map((line, lineIndex) => (
        <span
          className="text-reveal-line"
          aria-hidden="true"
          key={`${lineIndex}-${line}`}
        >
          {line.split(" ").map((word, index) => (
            <span className="word-mask" key={`${word}-${index}`}>
              <m.span
                className="motion-word"
                variants={{
                  hidden: { y: "112%", rotate: 3 },
                  visible: {
                    y: "0%",
                    rotate: 0,
                    transition: reduced
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          stiffness: 160,
                          damping: 24,
                          mass: 0.8,
                        },
                  },
                }}
              >
                {word}
              </m.span>
              {index < line.split(" ").length - 1 && " "}
            </span>
          ))}
        </span>
      ))}
    </Heading>
  );
}
