"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMotionPreference } from "./motion-preference";

/** A background showcase, controlled by the site's single Motion switch. */
export function VisibilityVideo({
  name,
  caption,
  presentation = "banner",
}: {
  name:
    | "work-showcase"
    | "ai-bot"
    | "home-ai-bot"
    | "home-websites"
    | "home-collection";
  caption: string;
  presentation?: "banner" | "card";
}) {
  const { reduced, ready } = useMotionPreference();
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [opaqueFallback, setOpaqueFallback] = useState(false);
  const mp4Only = name === "home-collection" && opaqueFallback;
  const mediaName =
    name === "home-collection" ? "home-collection-transparent" : name;
  const poster = `/videos/${mediaName}-poster.webp`;

  useEffect(() => {
    const media = video.current;
    const container = frame.current;
    if (!ready || reduced || !media || !container) return;
    let visible = false;
    // Set both properties before play(): some mobile browsers check defaultMuted.
    media.muted = true;
    media.defaultMuted = true;
    // Sources are inert until the saved preference is known. Dynamically added
    // <source> elements need load() before normal visibility-controlled playback.
    media.load();
    let alphaChecked = name !== "home-collection" || mp4Only;
    const checkTransparency = () => {
      if (alphaChecked || media.readyState < 2) return true;
      alphaChecked = true;
      try {
        // Some browsers decode VP9 but discard its alpha plane. Probe one clear
        // corner once; the local MP4 fallback already matches the purple panel.
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        if (context) {
          context.drawImage(media, 0, 0, 1, 1, 0, 0, 1, 1);
          if (context.getImageData(0, 0, 1, 1).data[3] < 250) return true;
        }
      } catch {
        // Restricted canvas access can still use the precomposited video.
      }
      media.pause();
      setOpaqueFallback(true);
      return false;
    };
    const resume = () => {
      if (
        !visible ||
        document.hidden ||
        document.documentElement.dataset.motion === "reduced"
      ) {
        media.autoplay = false;
        media.pause();
        return;
      }
      if (!checkTransparency()) return;
      media.autoplay = true;
      if (media.paused)
        void media.play().catch(() => {
          // A browser-level autoplay restriction is retried on the next real interaction.
        });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        resume();
      },
      { threshold: 0, rootMargin: "100px 0px" },
    );
    observer.observe(container);
    media.addEventListener("loadeddata", resume);
    media.addEventListener("canplay", resume);
    document.addEventListener("visibilitychange", resume);
    document.addEventListener("pointerdown", resume, { passive: true });
    document.addEventListener("keydown", resume);
    return () => {
      observer.disconnect();
      media.pause();
      media.removeEventListener("loadeddata", resume);
      media.removeEventListener("canplay", resume);
      document.removeEventListener("visibilitychange", resume);
      document.removeEventListener("pointerdown", resume);
      document.removeEventListener("keydown", resume);
    };
  }, [reduced, name, mp4Only, ready]);

  return (
    <figure
      className={`showcase-video${presentation === "card" ? " showcase-video-card" : ""}`}
      data-showcase-video={name}
      data-video-background={
        name === "home-collection"
          ? mp4Only
            ? "composited"
            : "alpha"
          : undefined
      }
    >
      <div ref={frame} className="showcase-video-frame">
        {reduced ? (
          <Image
            src={poster}
            alt={caption}
            fill
            loading="eager"
            sizes="100vw"
          />
        ) : (
          <video
            key={`${name}-${mp4Only ? "mp4" : "webm"}`}
            ref={video}
            muted
            loop
            playsInline
            preload={ready ? "auto" : "none"}
            poster={poster}
            aria-label={caption}
            disablePictureInPicture
          >
            {ready && (
              <>
                {!mp4Only && (
                  <source
                    src={`/videos/${mediaName}-mobile.webm`}
                    type="video/webm"
                    media="(max-width: 767px)"
                  />
                )}
                <source
                  src={`/videos/${mediaName}-mobile.mp4`}
                  type="video/mp4"
                  media="(max-width: 767px)"
                />
                {!mp4Only && (
                  <source src={`/videos/${mediaName}.webm`} type="video/webm" />
                )}
                <source src={`/videos/${mediaName}.mp4`} type="video/mp4" />
              </>
            )}
          </video>
        )}
      </div>
      <figcaption className={presentation === "card" ? "sr-only" : undefined}>
        {caption}
      </figcaption>
    </figure>
  );
}
