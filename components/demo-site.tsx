"use client";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Check,
  Menu,
  Plus,
  ShoppingBag,
  X,
} from "lucide-react";
import { demos, demoUI as ui, type DemoSlug } from "@/data/demos";

export function DemoSite({ slug }: { slug: DemoSlug }) {
  const d = demos[slug];
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState("All homes");
  const [bag, setBag] = useState(0);
  const [yearly, setYearly] = useState(false);
  const [notice, setNotice] = useState("");
  const [added, setAdded] = useState(false);
  return (
    <main id="main-content" className={`demo-site demo-${slug}`}>
      <div className="demo-concept-bar">
        <Link href="/#work">
          <ArrowLeft size={12} />
          {ui.back}
        </Link>
        <span>
          {ui.concept} / {d.category}
        </span>
        <span className="demo-fictional">{ui.footnote}</span>
      </div>
      <header className="demo-header">
        <a href="#demo-top" className="demo-wordmark">
          {d.name}
        </a>
        <nav
          aria-label={`${d.name} navigation`}
          className={menu ? "demo-nav is-open" : "demo-nav"}
        >
          {d.nav.map((label, i) => (
            <a
              key={label}
              href={i === 0 ? "#collection" : "#detail"}
              onClick={() => setMenu(false)}
            >
              {label}
            </a>
          ))}
        </nav>
        <a href="#collection" className="demo-header-cta">
          {slug === "store" ? (
            <>
              <ShoppingBag size={16} />
              {ui.bag} ({bag})
            </>
          ) : (
            <>
              {d.action}
              <ArrowRight size={15} />
            </>
          )}
        </a>
        <button
          className="demo-menu"
          aria-expanded={menu}
          aria-label={menu ? ui.close : ui.menu}
          onClick={() => setMenu(!menu)}
        >
          {menu ? <X /> : <Menu />}
        </button>
      </header>
      <section id="demo-top" className="demo-hero" data-capture="home">
        <div className="demo-hero-copy">
          <p className="demo-kicker">{d.kicker}</p>
          <h1>{d.headline}</h1>
          <p>{d.intro}</p>
          <div className="demo-actions">
            <a className="demo-primary" href="#collection">
              {d.action}
              <ArrowRight size={17} />
            </a>
            <a className="demo-secondary" href="#detail">
              {d.secondary}
              <ArrowDown size={14} />
            </a>
          </div>
          <span className="demo-edition">{ui.smallTitle}</span>
        </div>
        <div className="demo-hero-art">
          {slug === "restaurant" ? (
            <Dish />
          ) : slug === "real-estate" ? (
            <Architecture />
          ) : slug === "saas" ? (
            <Dashboard />
          ) : (
            <Garment variant={0} />
          )}
          <span className="demo-art-caption">
            {slug === "restaurant"
              ? ui.restaurantCaption
              : slug === "real-estate"
                ? ui.realEstateCaption
                : slug === "store"
                  ? ui.storeCaption
                  : ui.sample}
          </span>
        </div>
      </section>
      <section id="collection" className="demo-collection" data-capture="inner">
        <div className="demo-section-heading">
          <div>
            <p className="demo-kicker">
              {slug === "restaurant" ? ui.restaurantLabel : ui.collection}
            </p>
            <h2>{d.inner}</h2>
          </div>
          <p>{d.description}</p>
        </div>
        {slug === "real-estate" && (
          <div
            className="demo-filters"
            role="group"
            aria-label={ui.filterLabel}
          >
            {ui.locations.map((location) => (
              <button
                key={location}
                aria-pressed={filter === location}
                onClick={() => setFilter(location)}
              >
                {location}
              </button>
            ))}
          </div>
        )}
        <div className="demo-item-grid">
          {d.items
            .filter(
              (item) =>
                slug !== "real-estate" ||
                filter === "All homes" ||
                item.detail.startsWith(filter),
            )
            .map((item, i) => (
              <article className="demo-item" key={item.name}>
                {slug === "restaurant" ? (
                  <div className={`demo-item-art dish-art dish-${i}`}>
                    <Dish small />
                  </div>
                ) : slug === "real-estate" ? (
                  <div className={`demo-item-art building-${i}`}>
                    <Architecture />
                  </div>
                ) : slug === "store" ? (
                  <div className="demo-item-art">
                    <Garment variant={i} />
                  </div>
                ) : (
                  <div className="saas-feature-icon">
                    {i === 0 ? (
                      <span className="mini-board">
                        <i />
                        <i />
                        <i />
                      </span>
                    ) : i === 1 ? (
                      <span className="mini-notes">
                        <i />
                        <i />
                        <i />
                      </span>
                    ) : (
                      <span className="mini-bars">
                        <i />
                        <i />
                        <i />
                        <i />
                      </span>
                    )}
                  </div>
                )}
                <div className="demo-item-label">
                  <h3>{item.name}</h3>
                  <span>{item.price}</span>
                </div>
                <p>{item.detail}</p>
                <a href="#detail" aria-label={`${ui.details}: ${item.name}`}>
                  {ui.details}
                  <ArrowRight size={15} />
                </a>
              </article>
            ))}
        </div>
      </section>
      <section id="detail" className="demo-detail" data-capture="feature">
        <div className="demo-detail-art">
          {slug === "restaurant" ? (
            <Dish />
          ) : slug === "real-estate" ? (
            <Architecture />
          ) : slug === "store" ? (
            <Garment variant={0} />
          ) : (
            <Dashboard />
          )}
        </div>
        <div className="demo-detail-copy">
          <p className="demo-kicker">{ui.feature}</p>
          <h2>{d.feature}</h2>
          <p>{d.featureText}</p>
          {slug === "real-estate" && (
            <p className="demo-dimensions">{ui.dimensions}</p>
          )}
          {slug === "store" && (
            <>
              <p className="demo-product-price">{d.items[0].price}</p>
              <button
                className="demo-primary"
                onClick={() => {
                  setBag((value) => value + 1);
                  setAdded(true);
                }}
              >
                {added ? <Check size={17} /> : <Plus size={17} />}
                {added ? ui.added : ui.add}
              </button>
              <details>
                <summary>{ui.itemDetails}</summary>
                <p>{ui.itemCare}</p>
              </details>
            </>
          )}
          {slug === "restaurant" && (
            <a className="demo-primary" href="#collection">
              {d.action}
              <ArrowRight size={16} />
            </a>
          )}
          {slug === "saas" && (
            <>
              <div
                className="demo-billing"
                role="group"
                aria-label={ui.billingLabel}
              >
                <button aria-pressed={!yearly} onClick={() => setYearly(false)}>
                  {ui.monthly}
                </button>
                <button aria-pressed={yearly} onClick={() => setYearly(true)}>
                  {ui.yearly}
                </button>
              </div>
              <div className="demo-plans">
                {ui.plans.map((plan) => (
                  <article key={plan.name}>
                    <h3>{plan.name}</h3>
                    <p>{plan.description}</p>
                    <strong>
                      $
                      {yearly
                        ? Math.round(Number(plan.price) * 0.8)
                        : plan.price}
                    </strong>
                    <span>{ui.currency}</span>
                    <button onClick={() => setNotice(ui.planNote)}>
                      {ui.planAction}
                      <ArrowRight size={14} />
                    </button>
                  </article>
                ))}
              </div>
              <p className="demo-notice" role="status">
                {notice}
              </p>
            </>
          )}
        </div>
      </section>
      <footer className="demo-footer">
        <a href="#demo-top" className="demo-wordmark">
          {d.name}
        </a>
        <p>{d.note}</p>
        <Link href="/#work">
          {ui.back}
          <ArrowRight size={15} />
        </Link>
      </footer>
    </main>
  );
}
function Dish({ small = false }: { small?: boolean }) {
  return (
    <div
      className={`dish-illustration${small ? " small" : ""}`}
      aria-hidden="true"
    >
      <div className="dish-linen" />
      <div className="dish-plate">
        <div className="dish-sauce" />
        {Array.from({ length: 9 }, (_, i) => (
          <i key={i} className={`dish-leaf leaf-${i}`} />
        ))}
        <b className="dish-cheese" />
        <span className="dish-seasoning" />
      </div>
      <div className="dish-cutlery" />
      <div className="dish-herb" />
    </div>
  );
}
function Architecture() {
  return (
    <svg
      className="architecture-art"
      viewBox="0 0 900 700"
      role="img"
      aria-label={ui.architectureAlt}
    >
      <defs>
        <linearGradient id="arch-sky" x2="0" y2="1">
          <stop stopColor="#acbdc0" />
          <stop offset="1" stopColor="#e6dfc8" />
        </linearGradient>
        <linearGradient id="arch-glass" x2="1" y2="1">
          <stop stopColor="#52645c" />
          <stop offset=".5" stopColor="#82968b" />
          <stop offset="1" stopColor="#2c403c" />
        </linearGradient>
        <linearGradient id="arch-floor">
          <stop stopColor="#d4c5a9" />
          <stop offset="1" stopColor="#ece2cb" />
        </linearGradient>
      </defs>
      <path fill="url(#arch-sky)" d="M0 0h900v700H0z" />
      <circle cx="720" cy="150" r="82" fill="#fff0d2" opacity=".7" />
      <path d="M0 440 250 365 900 420v280H0" fill="#b6b29c" />
      <path fill="url(#arch-floor)" d="m0 510 700-80 200 85v185H0" />
      <path d="M130 270h630v260H130z" fill="#d9d0b7" />
      <path d="m130 270 120-75h630l-120 75" fill="#e9dfc6" />
      <path d="m760 270 120-75v250l-120 85" fill="#bdb69f" />
      <path d="M175 310h540v175H175z" fill="url(#arch-glass)" />
      <path
        d="M260 310v175m110-175v175m110-175v175m110-175v175"
        stroke="#d8cdb2"
        strokeWidth="9"
      />
      <path d="M115 492h660v30H115z" fill="#f0e3c8" />
      <path d="m60 610 500-40 225 62-520 55" fill="#749c9a" />
      <path d="m80 613 480-32 190 49-490 42" fill="#a5c6bf" />
      <path
        d="M48 260q80-90 120-225M65 235q-5-95-50-145M80 210q95-45 185-17M105 160q-60-110-110-120"
        stroke="#68775d"
        strokeWidth="22"
        fill="none"
      />
      <path d="M50 490 76 190" stroke="#7e7255" strokeWidth="13" />
      <path d="m790 560 35-135 40 135" fill="#667a56" />
      <ellipse cx="815" cy="565" rx="75" ry="16" fill="#6f785a" opacity=".4" />
      <path d="m0 700 900-80v80" fill="#948d74" opacity=".2" />
    </svg>
  );
}
function Dashboard() {
  return (
    <div className="orbit-dashboard" aria-label={ui.workspaceAlt}>
      <aside>
        <strong>◉ {demos.saas.name}</strong>
        <span>⌘ &nbsp; Workspace</span>
        <span>▦ &nbsp; Projects</span>
        <span>◷ &nbsp; Activity</span>
        <span>◎ &nbsp; Team</span>
        <div className="orbit-avatar">{ui.sampleInitials}</div>
      </aside>
      <div className="orbit-main">
        <div className="orbit-toolbar">
          <span>{ui.sample}</span>
          <i>•••</i>
        </div>
        <p className="orbit-project-title">{ui.project}</p>
        <p>{ui.activity}</p>
        <div className="orbit-stats">
          <div>
            <small>{ui.progress}</small>
            <strong>
              72<span>%</span>
            </strong>
            <i />
          </div>
          <div>
            <div className="orbit-chart">
              {[30, 48, 40, 65, 55, 81, 92].map((height, i) => (
                <i key={i} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
        </div>
        <div className="orbit-board">
          {ui.tasks.map((task, i) => (
            <div key={task}>
              <small>{ui.board[i]}</small>
              <article>
                <i />
                <strong>{task}</strong>
                <span>{ui.taskContext}</span>
                <b>{i === 2 ? "✓" : ui.sampleInitials}</b>
              </article>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Garment({ variant }: { variant: number }) {
  return (
    <svg
      className={`garment-art garment-${variant}`}
      viewBox="0 0 500 650"
      role="img"
      aria-label={ui.garmentAlts[variant] || ui.garmentAlts[0]}
    >
      <defs>
        <linearGradient id={`fabric-${variant}`}>
          <stop
            stopColor={
              variant === 0 ? "#a47c5d" : variant === 1 ? "#cec8ba" : "#303432"
            }
          />
          <stop
            offset=".45"
            stopColor={
              variant === 0 ? "#d0aa86" : variant === 1 ? "#f3ede0" : "#666961"
            }
          />
          <stop
            offset="1"
            stopColor={
              variant === 0 ? "#916b50" : variant === 1 ? "#b7b1a4" : "#282c2b"
            }
          />
        </linearGradient>
      </defs>
      <ellipse
        cx="250"
        cy="603"
        rx="160"
        ry="19"
        fill="#473b2d"
        opacity=".12"
      />
      {variant < 2 ? (
        <>
          <path
            d="m185 110 65-20 65 20 86 52 50 218-60 18-41-143 12 325H140l10-325-41 143-60-18 50-218z"
            fill={`url(#fabric-${variant})`}
          />
          <path
            d="m185 110 65 142 65-142-30 110 35 34-68 95-68-95 35-34z"
            fill={variant === 0 ? "#b48b68" : "#e0d8ca"}
          />
          <path
            d="M250 250v330"
            stroke={variant === 0 ? "#8a654c" : "#b0a999"}
            strokeWidth="2"
          />
          <path d="m160 393 60 5m65 0 55-5" stroke="#715d4b" strokeWidth="3" />
          {[320, 370, 420].map((y) => (
            <circle key={y} cx="265" cy={y} r="4" fill="#5b4739" />
          ))}
          <path
            d="m150 255 20 130m180-130-20 130"
            stroke="#fff"
            strokeOpacity=".1"
            strokeWidth="2"
          />
        </>
      ) : (
        <>
          <path
            d="M150 100h200l13 120-43 370h-81l11-330-11 330h-80l-22-370z"
            fill={`url(#fabric-${variant})`}
          />
          <path
            d="M155 125h190m-95 0v135m-58-80-18 360m138-360-15 360"
            stroke="#e6e0cf"
            strokeOpacity=".22"
            strokeWidth="2"
          />
          <path
            d="m155 150 47 0-38 65m181-65h-47l44 65"
            fill="none"
            stroke="#242927"
            strokeWidth="2"
          />
        </>
      )}
      <path
        d="M190 106q60-35 120 0"
        fill="none"
        stroke="#644e3b"
        strokeWidth="3"
        opacity=".3"
      />
    </svg>
  );
}
