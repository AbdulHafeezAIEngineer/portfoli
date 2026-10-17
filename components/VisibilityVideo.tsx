"use client";

import Image from "next/image";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMotionPreference } from "./motion-preference";

export function VisibilityVideo({
  name,
  caption,
  threshold,
  once = false,
}: {
  name: "work-showcase" | "ai-bot";
  caption: string;
  threshold: number;
  once?: boolean;
}) {
  const { reduced } = useMotionPreference();
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const finished = useRef(false);
  const visible = useRef(false);
  const manuallyPaused = useRef(false);
  const [eligible, setEligible] = useState(false);
  const [ended, setEnded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const poster = `/videos/${name}-poster.webp`;

  useEffect(() => {
    const desktop = matchMedia("(min-width: 768px)");
    const lessMotion = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () =>
      setEligible(desktop.matches && !lessMotion.matches && !reduced);
    update();
    desktop.addEventListener("change", update);
    lessMotion.addEventListener("change", update);
    return () => {
      desktop.removeEventListener("change", update);
      lessMotion.removeEventListener("change", update);
    };
  }, [reduced]);

  useEffect(() => {
    if (!eligible || !frame.current || !video.current) return;
    const media = video.current;
    const play = () => {
      if (
        !visible.current ||
        document.hidden ||
        manuallyPaused.current ||
        (once && finished.current)
      )
        return;
      void media.play().catch((error) => {
        if (error?.name !== "AbortError") setBlocked(true);
      });
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current =
          entry.isIntersecting && entry.intersectionRatio >= threshold;
        if (visible.current) play();
        else media.pause();
      },
      { threshold: [0, threshold] },
    );
    const visibilityChange = () => {
      if (document.hidden) media.pause();
      else play();
    };
    observer.observe(frame.current);
    document.addEventListener("visibilitychange", visibilityChange);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibilityChange);
      visible.current = false;
      media.pause();
    };
  }, [eligible, once, threshold]);

  function toggle() {
    const media = video.current;
    if (!media) return;
    if (!media.paused) {
      manuallyPaused.current = true;
      media.pause();
      return;
    }
    if (!visible.current) return;
    manuallyPaused.current = false;
    if (ended) {
      media.currentTime = 0;
      finished.current = false;
      setEnded(false);
    }
    setBlocked(false);
    void media.play().catch(() => setBlocked(true));
  }

  return (
    <figure
      className="showcase-video mx-auto w-full max-w-6xl"
      data-showcase-video={name}
    >
      <div
        ref={frame}
        className="showcase-video-frame relative aspect-video overflow-hidden rounded-3xl bg-black"
      >
        {eligible ? (
          <video
            ref={video}
            muted
            loop={!once}
            playsInline
            preload="none"
            poster={poster}
            aria-label={caption}
            onPlaying={() => {
              setPlaying(true);
              setBlocked(false);
            }}
            onPause={() => setPlaying(false)}
            onEnded={() => {
              finished.current = true;
              setEnded(true);
              setPlaying(false);
            }}
            onError={() => setBlocked(true)}
          >
            <source src={`/videos/${name}.webm`} type="video/webm" />
            <source src={`/videos/${name}.mp4`} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={poster}
            alt={caption}
            fill
            sizes="(max-width: 767px) 90vw, (max-width: 1280px) 90vw, 1152px"
          />
        )}
        {eligible &&
          (!once || ended || blocked || playing || manuallyPaused.current) && (
            <button
              type="button"
              className="showcase-video-control"
              onClick={toggle}
              aria-label={
                ended
                  ? "Replay AI bot video"
                  : playing
                    ? `Pause ${once ? "AI bot" : "website showcase"} video`
                    : `Play ${once ? "AI bot" : "website showcase"} video`
              }
            >
              {ended ? (
                <RotateCcw size={15} aria-hidden="true" />
              ) : playing ? (
                <Pause size={15} aria-hidden="true" />
              ) : (
                <Play size={15} aria-hidden="true" />
              )}
              {ended ? "Replay" : playing ? "Pause" : "Play"}
            </button>
          )}
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}
