"use client";
import { useMotionPreference } from "./motion-preference";
import Image from "next/image";
import Link from "next/link";
import { imagePreview } from "@/lib/image-preview";
import { m, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectView } from "@/data/projects";
import { subscribeScroll } from "@/lib/scroll";
import { projectPresentation } from "@/data/project-presentation";
export function ProjectCard({ project }: { project: ProjectView }) {
  const { reduced } = useMotionPreference();
  const card = useRef<HTMLAnchorElement>(null);
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 110, damping: 22 });
  const rotateY = useSpring(y, { stiffness: 110, damping: 22 });
  useEffect(() => {
    const media = matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)",
    );
    const sync = () => setFinePointer(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    const element = card.current;
    if (!element || reduced) {
      x.set(0);
      y.set(0);
      return;
    }
    let visible = false;
    const update = (viewport: number) => {
      if (!visible || finePointer) return;
      const rect = element.getBoundingClientRect();
      const position = Math.max(
        -1,
        Math.min(1, (viewport / 2 - rect.top - rect.height / 2) / viewport),
      );
      x.set(position * -5);
      y.set(position * 7);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        element.dataset.deviceVisible = String(visible);
        update(window.innerHeight);
      },
      { rootMargin: "60px" },
    );
    observer.observe(element);
    const unsubscribe = finePointer
      ? undefined
      : subscribeScroll(({ viewport }) => update(viewport));
    return () => {
      observer.disconnect();
      unsubscribe?.();
      delete element.dataset.deviceVisible;
      x.set(0);
      y.set(0);
    };
  }, [reduced, finePointer, x, y]);
  const tilt = finePointer && !reduced;
  const presentation = projectPresentation(project.id);
  const mobile = project.screenshots[2] || project.screenshots[0];
  return (
    <Link
      ref={card}
      className={`project-card device-project curated-project${presentation.artwork ? " artwork-project" : ""}`}
      href={project.demoUrl || `/work/${project.id}`}
      aria-label={`Explore website: ${project.title}`}
      onPointerMove={(event) => {
        if (!tilt) return;
        const rect = event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty(
          "--pointer-x",
          `${((event.clientX - rect.left) / rect.width) * 100}%`,
        );
        event.currentTarget.style.setProperty(
          "--pointer-y",
          `${((event.clientY - rect.top) / rect.height) * 100}%`,
        );
        x.set(
          (-(event.clientY - rect.top - rect.height / 2) / rect.height) * 10,
        );
        y.set(((event.clientX - rect.left - rect.width / 2) / rect.width) * 12);
      }}
      onPointerLeave={() => {
        if (!tilt) return;
        x.set(0);
        y.set(0);
      }}
    >
      <div
        className="device-stage"
        data-parallax="image"
        style={{ "--project-accent": project.accent } as React.CSSProperties}
      >
        {presentation.artwork ? (
          <m.div className="artwork-composition" style={{ rotateX, rotateY }}>
            <Image
              loading="eager"
              fetchPriority="low"
              src={project.screenshots[0].src}
              {...imagePreview(project.screenshots[0].src)}
              alt={project.screenshots[0].alt}
              fill
              sizes="(max-width:767px) 90vw, (max-width:1439px) 55vw, 740px"
            />
            <span className="artwork-light" aria-hidden="true" />
          </m.div>
        ) : (
          <>
            <div className="device-floor" />
            <div className="device-float">
              <m.div
                className="device-composition"
                style={{ rotateX, rotateY }}
              >
                <div className="device-laptop">
                  <div className="device-laptop-lid">
                    <span className="device-camera" />
                    <div className="device-screen">
                      <Image
                        loading="eager"
                        fetchPriority="low"
                        src={project.screenshots[0].src}
                        {...imagePreview(project.screenshots[0].src)}
                        alt={project.screenshots[0].alt}
                        fill
                        sizes="(max-width:767px) 80vw, (max-width:1439px) 45vw, 610px"
                      />
                      <span className="device-reflection" />
                    </div>
                  </div>
                  <div className="device-laptop-base">
                    <i />
                  </div>
                </div>
                <div className="device-phone">
                  <div className="device-phone-screen">
                    <Image
                      loading="eager"
                      fetchPriority="low"
                      src={mobile.src}
                      {...imagePreview(mobile.src)}
                      alt={mobile.alt}
                      fill
                      sizes="(max-width:767px) 23vw, (max-width:1439px) 13vw, 180px"
                    />
                    <span className="device-reflection" />
                  </div>
                  <span className="device-phone-notch" />
                </div>
              </m.div>
            </div>
          </>
        )}
      </div>
      <div className="project-title-row">
        <h3>{project.title}</h3>
        <span>
          Explore <ArrowUpRight size={17} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}
