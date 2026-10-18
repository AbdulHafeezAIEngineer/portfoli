import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowUpRight,
  ChevronRight,
  CircleDot,
  Command,
  Grid2X2,
  Layers3,
  Search,
  Sparkles,
  Wallet,
} from "lucide-react";
import { studyContent as copy, type Study } from "@/data/studies";

function Graph({ variant = 0 }: { variant?: number }) {
  return (
    <svg
      className="study-chart"
      viewBox="0 0 600 180"
      role="img"
      aria-label={copy.chartLabel}
    >
      <defs>
        <linearGradient
          id={`chart-fill-${variant}`}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="currentColor" stopOpacity=".28" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[35, 80, 125, 170].map((y) => (
        <path
          key={y}
          d={`M0 ${y}H600`}
          stroke="currentColor"
          strokeOpacity=".1"
        />
      ))}
      <path
        d="M0 150 C35 150 35 130 70 133 S120 102 160 114 S220 131 250 95 S310 70 350 83 S395 35 430 50 S490 80 520 44 S565 28 600 15 V180 H0Z"
        fill={`url(#chart-fill-${variant})`}
      />
      <path
        d="M0 150 C35 150 35 130 70 133 S120 102 160 114 S220 131 250 95 S310 70 350 83 S395 35 430 50 S490 80 520 44 S565 28 600 15"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
      />
    </svg>
  );
}
function Dashboard({ study }: { study: Study }) {
  const ai = study.kind === "analytics",
    d = study.details;
  return (
    <div className="study-dashboard">
      <aside className="study-sidebar">
        <div className="study-logo">
          {ai ? <Command size={22} /> : <CircleDot size={25} />} {study.name}
        </div>
        <small>{copy.sidebarLabel}</small>
        <nav aria-label={`${study.name} sections`}>
          {study.labels.map((label, i) => (
            <a
              key={label}
              href={i === 0 ? "#study-main" : "#study-details"}
              className={i === 0 ? "selected" : ""}
            >
              <Grid2X2 size={15} aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>
        <div className="study-user">
          <span>E</span>
          <div>
            {copy.role}
            <small>{copy.metricNote}</small>
          </div>
        </div>
      </aside>
      <div className="study-dashboard-main">
        <header>
          <p>{study.eyebrow}</p>
          <div>
            <Search size={18} aria-hidden="true" />
            <span className="study-avatar">E</span>
          </div>
        </header>
        <div className="study-dashboard-greeting">
          <h1>{study.headline}</h1>
          <p>{study.description}</p>
        </div>
        <div className="study-metrics">
          <div>
            <small>{d[0]}</small>
            <strong>{d[1]}</strong>
            <span>{copy.metricNote}</span>
          </div>
          <div>
            <small>{ai ? d[2] : d[3]}</small>
            <strong>{ai ? d[3] : d[4]}</strong>
            <span>{copy.metricNote}</span>
          </div>
          <div>
            <small>{ai ? d[4] : d[5]}</small>
            <strong>{ai ? d[5] : d[6]}</strong>
            <span>{copy.metricNote}</span>
          </div>
        </div>
        <div className="study-dashboard-panels">
          <section className="study-graph-panel">
            <div>
              <h2>{ai ? d[8] : d[2]}</h2>
              <span>{copy.metricNote}</span>
            </div>
            <Graph variant={ai ? 1 : 0} />
            <div className="study-week">
              {copy.stats.map((day, i) => (
                <span key={`${day}-${i}`}>{day}</span>
              ))}
            </div>
          </section>
          {ai ? (
            <section className="study-network">
              <div className="network-globe">
                <i />
                <i />
                <i />
                <span>
                  <Sparkles size={30} />
                </span>
              </div>
              <h2>{d[6]}</h2>
              <p>{d[7]}</p>
            </section>
          ) : (
            <section className="study-bank-card">
              <Wallet size={24} aria-hidden="true" />
              <p>{study.name}</p>
              <strong>•••• &nbsp; •••• &nbsp; 0284</strong>
              <small>{copy.role}</small>
              <span className="bank-card-orb" />
            </section>
          )}
        </div>
        <div className="study-activity">
          <h2>{ai ? d[8] : d[7]}</h2>
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <span className="activity-symbol">
                {i === 0 ? <Layers3 size={17} /> : <ArrowUpRight size={17} />}
              </span>
              <span>{ai ? study.labels[i + 1] : d[i + 8]}</span>
              <small>{copy.metricNote}</small>
              <span className="activity-bars">
                <i style={{ width: `${35 + i * 20}%` }} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Editorial({ study }: { study: Study }) {
  const d = study.details;
  return (
    <div className={`study-editorial study-editorial-${study.kind}`}>
      <header className="study-editorial-header">
        <span className="study-logo">{study.name}</span>
        <nav aria-label={`${study.name} sections`}>
          {study.labels.map((label) => (
            <a href="#study-details" key={label}>
              {label}
            </a>
          ))}
        </nav>
        <a className="study-header-action" href="#study-details">
          <ArrowUpRight size={20} aria-label={copy.details} />
        </a>
      </header>
      <div className="study-editorial-hero">
        <div className="study-editorial-copy">
          <p>{study.eyebrow}</p>
          <h1>{study.headline}</h1>
          <div>
            <span>{study.description}</span>
            <a href="#study-details">
              {study.action}
              <ArrowUpRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
        <div className="study-editorial-art" aria-hidden="true">
          {study.kind === "travel" ? (
            <>
              <Image
                src="/concepts/solenne-hero.webp"
                alt=""
                fill
                sizes="100vw"
                priority
              />
              <span className="travel-coordinates">
                A SLOWER PERSPECTIVE / 01
              </span>
            </>
          ) : study.kind === "fitness" ? (
            <>
              <div className="fitness-ring ring-a" />
              <div className="fitness-ring ring-b" />
              <div className="fitness-ring ring-c" />
              <span className="fitness-art-type">F/</span>
            </>
          ) : study.kind === "creative" ? (
            <>
              <div className="creative-poster">
                <span>{d[3]}</span>
                <i />
                <strong>{d[4]}</strong>
              </div>
              <div className="creative-poster-small">
                <i />
                <span>{study.name}</span>
              </div>
            </>
          ) : (
            <>
              <div className="beauty-disc" />
              <div className="beauty-bottle">
                <div />
                <span>{d[1]}</span>
                <small>{d[2]}</small>
                <i>01</i>
              </div>
              <div className="beauty-box">
                <span>{d[1]}</span>
                <small>{d[0]}</small>
              </div>
              <span className="beauty-art-caption">{d[3]}</span>
            </>
          )}
        </div>
      </div>
      <div className="study-editorial-bottom">
        <span>{d[0]}</span>
        <span>{d[1]}</span>
        <span>{d[2]}</span>
        <ArrowDownRight size={24} aria-hidden="true" />
      </div>
    </div>
  );
}
export function DesignStudy({ study }: { study: Study }) {
  return (
    <div
      className={`study-surface study-${study.kind}`}
      style={{ "--study-accent": study.accent } as React.CSSProperties}
    >
      <div className="study-notice">
        <Link href="/bunch-of-work">{copy.back}</Link>
        <span>{copy.label}</span>
        <span>{study.industry}</span>
      </div>
      <main id="main-content">
        <div id="study-main">
          {study.kind === "finance" || study.kind === "analytics" ? (
            <Dashboard study={study} />
          ) : (
            <Editorial study={study} />
          )}
        </div>
        <section id="study-details" className="study-details">
          <div>
            <p>{copy.collection}</p>
            <h2>
              {study.name} / {study.industry}
            </h2>
            <p>{copy.note}</p>
          </div>
          <Link href="/bunch-of-work">
            {copy.back}
            <ChevronRight size={17} aria-hidden="true" />
          </Link>
        </section>
      </main>
      <footer className="study-footer">
        {copy.framework}
        <span>© {new Date().getFullYear()} Elvora</span>
      </footer>
    </div>
  );
}
