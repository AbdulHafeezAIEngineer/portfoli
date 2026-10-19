export function ReadingText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return <p className={`reading-text ${className}`}>{text}</p>;
}
