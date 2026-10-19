import Image from "next/image";

const marks: Record<string, { name: string; file: string }> = {
  veldt: { name: "Veldt", file: "veldt" },
  northline: { name: "Northline", file: "northline" },
  solenne: { name: "Solenne", file: "solenne" },
  voice: { name: "Aura", file: "aura" },
};

export function BotAvatar({ id }: { id: string }) {
  const mark = marks[id];
  if (!mark) return null;
  return <span className={`business-bot-avatar business-bot-avatar-${id}`}>
    <Image src={`/bots/logos/${mark.file}.svg`} alt={`${mark.name} logo`} width={64} height={64} />
  </span>;
}
