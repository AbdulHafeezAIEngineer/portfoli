"use client";
import { VisibilityVideo } from "./VisibilityVideo";

export function AiBotVideo() {
  return (
    <VisibilityVideo
      name="ai-bot"
      threshold={0.5}
      once
      caption="A customer asks. The bot answers. Instantly."
    />
  );
}
