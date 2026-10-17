"use client";
import { useMotionPreference } from "./motion-preference";
import Image from "next/image";
import { imagePreview } from "@/lib/image-preview";
import { m, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { ProjectView } from "@/data/projects";
import { site } from "@/data/site";
import { projectPresentation } from "@/data/project-presentation";
export function ProjectCard({
  project,
  index,
  total,
  onOpen,
}: {
  project: ProjectView;
  index: number;
  total: number;
  onOpen: () => void;
}) {
  const { reduced } = useMotionPreference();
  const [finePointer, setFinePointer] = useState(false);
  const x = useMotionValue(0),
    y = useMotionValue(0);
  const rotateX = useSpring(x, { stiffness: 110, damping: 22 });
  const rotateY = useSpring(y, { stiffness: 110, damping: 22 });
  useEffect(() => {
    const media = matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => setFinePointer(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  const tilt = finePointer && !reduced;
  const presentation = projectPresentation(project.id);
  const mobile = project.screenshots[2] || project.screenshots[0];
  return (
    <button
      className={`project-card device-project curated-project${presentation.artwork ? " artwork-project" : ""}`}
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${site.work.view}: ${project.title}`}
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
        x.set(0);
        y.set(0);
      }}
    >
      <div className="project-info">
        <div>
          <span className="project-industry">{project.industry}</span>
          <h3>{project.title}</h3>
          <p>{project.subtitle}</p>
        </div>
        <span className="curated-project-index" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div
        className="device-stage"
        data-parallax="image"
        style={{ "--project-accent": project.accent } as React.CSSProperties}
      >
        <span className="curated-format" aria-hidden="true">
          {presentation.artwork ? "FEATURED WEBSITE" : "DESKTOP / MOBILE"}
        </span>
        {presentation.artwork ? (
          <m.div
            className="artwork-composition"
            style={tilt ? { rotateX, rotateY } : undefined}
          >
            <Image
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
                style={tilt ? { rotateX, rotateY } : undefined}
              >
                <div className="device-laptop">
                  <div className="device-laptop-lid">
                    <span className="device-camera" />
                    <div className="device-screen">
                      <Image
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
        <span className="device-view">
          {site.work.view}
          <ArrowUpRight size={18} aria-hidden="true" />
        </span>
      </div>
      <div className="project-footer">
        <span>
          <i style={{ background: project.accent }} />
          {presentation.label}
        </span>
        <span>
          {String(index + 1).padStart(2, "0")} /{" "}
          {String(total).padStart(2, "0")}
        </span>
      </div>
    </button>
  );
}
