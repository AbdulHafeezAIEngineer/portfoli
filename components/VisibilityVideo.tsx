"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { useMotionPreference } from "./motion-preference";

/** A background showcase, controlled by the site's single Motion switch. */
export function VisibilityVideo({
  name,
  caption,
}: {
  name: "work-showcase" | "ai-bot";
  caption: string;
}) {
  const { reduced } = useMotionPreference();
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const poster = `/videos/${name}-poster.webp`;

  useEffect(() => {
    const media = video.current;
    const container = frame.current;
    if (reduced || !media || !container) return;
    let visible = false;
    // Set both properties before play(): some mobile browsers check defaultMuted.
    media.muted = true;
    media.defaultMuted = true;
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
    media.addEventListener("canplay", resume);
    document.addEventListener("visibilitychange", resume);
    document.addEventListener("pointerdown", resume, { passive: true });
    document.addEventListener("keydown", resume);
    return () => {
      observer.disconnect();
      media.pause();
      media.removeEventListener("canplay", resume);
      document.removeEventListener("visibilitychange", resume);
      document.removeEventListener("pointerdown", resume);
      document.removeEventListener("keydown", resume);
    };
  }, [reduced]);

  return (
    <figure className="showcase-video" data-showcase-video={name}>
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
            ref={video}
            muted
            loop
            playsInline
            preload="auto"
            poster={poster}
            aria-label={caption}
            disablePictureInPicture
          >
            <source
              src={`/videos/${name}-mobile.webm`}
              type="video/webm"
              media="(max-width: 767px)"
            />
            <source
              src={`/videos/${name}-mobile.mp4`}
              type="video/mp4"
              media="(max-width: 767px)"
            />
            <source src={`/videos/${name}.webm`} type="video/webm" />
            <source src={`/videos/${name}.mp4`} type="video/mp4" />
          </video>
        )}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
