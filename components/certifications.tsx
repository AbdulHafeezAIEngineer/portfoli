"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { imagePreview } from "@/lib/image-preview";
import { useState } from "react";
import { Expand } from "lucide-react";
import {
  certificateContent as copy,
  type Certificate,
} from "@/data/certificates";
import { Reveal } from "./reveal";

const CertificateViewer = dynamic(() => import("./certificate-viewer"), {
  ssr: false,
});

export function Certifications({
  certificates,
}: {
  certificates: Certificate[];
}) {
  const [selected, setSelected] = useState<Certificate | null>(null);
  return (
    <section
      id="certification"
      className="container certification-section"
      aria-labelledby="certification-title"
    >
      <Reveal>
        <p className="eyebrow">{copy.eyebrow}</p>
        <h2 id="certification-title">{copy.title}</h2>
        <p className="section-intro">{copy.description}</p>
      </Reveal>
      {certificates.map((certificate) => (
        <Reveal key={certificate.id}>
          <article className="certificate-card glass">
            <button
              className="certificate-preview"
              onClick={() => setSelected(certificate)}
              aria-haspopup="dialog"
              aria-label={`${copy.enlarge}: ${certificate.title}`}
            >
              <Image
                src={certificate.image}
                {...imagePreview(certificate.image)}
                alt={certificate.alt}
                width={1600}
                height={1120}
                sizes="(max-width: 700px) 90vw, 600px"
              />
              <span>
                <Expand size={17} aria-hidden="true" />
                {copy.enlarge}
              </span>
            </button>
            <div className="certificate-info">
              {certificate.isPlaceholder && (
                <p className="placeholder-tag">{copy.placeholder}</p>
              )}
              <h3>{certificate.title}</h3>
              <dl>
                <div>
                  <dt>{copy.issuer}</dt>
                  <dd>{certificate.issuer}</dd>
                </div>
                <div>
                  <dt>{copy.date}</dt>
                  <dd>
                    {certificate.issuedAt ? (
                      <time dateTime={certificate.issuedAt}>
                        {certificate.dateLabel}
                      </time>
                    ) : (
                      certificate.dateLabel
                    )}
                  </dd>
                </div>
              </dl>
              <p>{certificate.description}</p>
            </div>
          </article>
        </Reveal>
      ))}
      {selected && (
        <CertificateViewer
          certificate={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </section>
  );
}
