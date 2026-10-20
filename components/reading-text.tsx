/** The base words stay readable; an ink layer adds emphasis without changing text widths. */
export function ReadingText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <p className={`reading-text ${className}`} data-reading-text>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(/\s+/).map((word, index) => (
          <span
            key={index}
            className="reading-word reading-base"
            data-word={word}
          >
            {word}{" "}
          </span>
        ))}
      </span>
    </p>
  );
}
