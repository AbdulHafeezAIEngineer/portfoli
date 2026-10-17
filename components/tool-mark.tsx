import type { CSSProperties } from "react";
import { Sparkles } from "lucide-react";
import { toolMarks } from "@/data/tool-marks";

export function ToolMark({ name }: { name: string }) {
  const mark = toolMarks[name];
  return (
    <span
      className={`tool-brand-mark${mark?.icon ? " has-brand-icon" : ""}`}
      aria-hidden="true"
      style={
        {
          ...(mark?.icon
            ? { "--mark-image": `url('/tool-marks/${mark.icon}.svg')` }
            : {}),
        } as CSSProperties
      }
    >
      {mark?.icon ? (
        <i />
      ) : mark?.text ? (
        <b>{mark.text}</b>
      ) : (
        <Sparkles size={23} strokeWidth={1.4} />
      )}
    </span>
  );
}
