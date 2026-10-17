import type { CSSProperties } from "react";
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
  const Heading = as;
  let wordIndex = 0;
  return (
    <Heading
      id={id}
      className={`text-reveal ${className}`}
      aria-label={text.replaceAll("\n", " ")}
      data-reveal={as === "h1" ? undefined : "words"}
    >
      {text.split("\n").map((line, lineIndex) => (
        <span className="text-reveal-line" aria-hidden="true" key={lineIndex}>
          {line.split(" ").map((word, index) => (
            <span className="word-mask" key={index}>
              <span
                className="motion-word"
                style={
                  { "--word-delay": `${wordIndex++ * 0.035}s` } as CSSProperties
                }
              >
                {word}
              </span>
              {index < line.split(" ").length - 1 && " "}
            </span>
          ))}
        </span>
      ))}
    </Heading>
  );
}
