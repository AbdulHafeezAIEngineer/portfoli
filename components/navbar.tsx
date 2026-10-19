"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { site } from "@/data/site";
import { aboutPages, portfolioPages } from "@/data/navigation";
import { BrandMark } from "./brand-mark";
import { MotionControl } from "./motion-preference";

export function Navbar({
  identity,
}: {
  identity: { brand: string };
  rootLinks?: boolean;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const menuButton = useRef<HTMLButtonElement>(null);
  const aboutButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const aboutMenu = useRef<HTMLDivElement>(null);
  const inAbout = aboutPages.some((id) => portfolioPages[id].href === pathname);
  const current = (href: string) =>
    href === "/about"
      ? inAbout
      : href === "/ai-bots"
        ? pathname.startsWith("/ai-bots")
        : pathname === href;
  const close = () => {
    setOpen(false);
    setAboutOpen(false);
  };

  useEffect(() => {
    setOpen(false);
    setAboutOpen(false);
    setTheme(document.documentElement.dataset.theme || "dark");
  }, [pathname]);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 1200px)");
    const changed = () => {
      setOpen(false);
      setAboutOpen(false);
    };
    media.addEventListener("change", changed);
    return () => media.removeEventListener("change", changed);
  }, []);
  useEffect(() => {
    if (!open && !aboutOpen) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      setAboutOpen(false);
      (open ? menuButton : aboutButton).current?.focus();
    };
    const outside = (event: PointerEvent) => {
      const target = event.target as Node;
      if (
        !menu.current?.contains(target) &&
        !menuButton.current?.contains(target)
      )
        setOpen(false);
      if (!aboutMenu.current?.contains(target)) setAboutOpen(false);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open, aboutOpen]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch {
      /* Optional persistence. */
    }
  }
  return (
    <header className="site-header portfolio-header">
      <nav className="container nav-row" aria-label="Main navigation">
        <Link
          href="/"
          className="wordmark"
          aria-label={`${identity.brand} — Home`}
          onClick={close}
        >
          <BrandMark brand={identity.brand} />
        </Link>
        <div className="desktop-nav">
          {site.nav.map((item) =>
            item.href === "/about" ? (
              <div
                key={item.href}
                className="nav-about-group"
                ref={aboutMenu}
                onBlur={(event) => {
                  if (
                    !event.currentTarget.contains(event.relatedTarget as Node)
                  )
                    setAboutOpen(false);
                }}
              >
                <Link
                  href={item.href}
                  data-active={inAbout || undefined}
                  aria-current={pathname === item.href ? "page" : undefined}
                  onClick={close}
                >
                  {item.label}
                </Link>
                <button
                  ref={aboutButton}
                  className="nav-about-toggle"
                  aria-label="Explore About Me"
                  aria-expanded={aboutOpen}
                  aria-controls="about-navigation"
                  onClick={() => setAboutOpen(!aboutOpen)}
                >
                  <ChevronDown size={13} aria-hidden="true" />
                </button>
                <div
                  id="about-navigation"
                  className="about-navigation"
                  hidden={!aboutOpen}
                >
                  <p>ABOUT THE DEVELOPER</p>
                  {aboutPages.map((id) => (
                    <Link
                      key={id}
                      href={portfolioPages[id].href}
                      aria-current={
                        pathname === portfolioPages[id].href
                          ? "page"
                          : undefined
                      }
                      onClick={close}
                    >
                      {portfolioPages[id].label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                data-active={current(item.href) || undefined}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={close}
              >
                {item.label}
              </Link>
            ),
          )}
        </div>
        <div className="nav-actions">
          <MotionControl />
          <button
            className="icon-button theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? site.ui.light : site.ui.dark}
          >
            <Sun size={19} className="sun-icon" aria-hidden="true" />
            <Moon size={19} className="moon-icon" aria-hidden="true" />
          </button>
          <button
            ref={menuButton}
            className="icon-button menu-toggle"
            onClick={() => setOpen(!open)}
            aria-label={open ? site.ui.menuClose : site.ui.menuOpen}
            aria-expanded={open}
            aria-controls="mobile-navigation"
          >
            {open ? (
              <X size={22} aria-hidden="true" />
            ) : (
              <Menu size={22} aria-hidden="true" />
            )}
          </button>
        </div>
        <div
          id="mobile-navigation"
          className="mobile-nav"
          ref={menu}
          hidden={!open}
          data-native-scroll
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node) &&
              event.relatedTarget !== menuButton.current
            )
              setOpen(false);
          }}
        >
          <p className="mobile-nav-label">EXPLORE</p>
          {site.nav.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
          <p className="mobile-nav-label">ABOUT & PROCESS</p>
          {aboutPages.map((id) => (
            <Link
              key={id}
              href={portfolioPages[id].href}
              aria-current={
                pathname === portfolioPages[id].href ? "page" : undefined
              }
              onClick={close}
            >
              {portfolioPages[id].label}
            </Link>
          ))}
          <p className="mobile-nav-label">LET’S CONNECT</p>
          {["services", "contact"].map((id) => {
            const item =
              portfolioPages[id as "testimonials" | "services" | "contact"];
            return (
              <Link
                key={id}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={close}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}
