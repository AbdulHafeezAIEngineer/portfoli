"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { site } from "@/data/site";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const menuButton = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme || "dark");
    const media = window.matchMedia("(min-width: 1024px)");
    const close = () => setOpen(false);
    media.addEventListener("change", close);
    return () => media.removeEventListener("change", close);
  }, []);

  useEffect(() => {
    if (!open) return;
    const escape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    const outside = (event: PointerEvent) => {
      if (!menu.current?.contains(event.target as Node) && !menuButton.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", escape);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", escape);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    setTheme(next);
    try { localStorage.setItem("portfolio-theme", next); } catch { /* Storage can be unavailable. */ }
  }

  return (
    <header className="site-header">
      <nav className="container nav-row" aria-label="Main navigation">
        <a href="#top" className="wordmark" aria-label={site.ui.home} onClick={() => setOpen(false)}>
          {site.initials}<span aria-hidden="true">.</span>
        </a>
        <div className="desktop-nav">
          {site.nav.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}
        </div>
        <div className="nav-actions">
          <button className="icon-button theme-toggle" onClick={toggleTheme} aria-label={theme === "dark" ? site.ui.light : site.ui.dark}>
            <Sun size={19} className="sun-icon" aria-hidden="true" />
            <Moon size={19} className="moon-icon" aria-hidden="true" />
          </button>
          <button ref={menuButton} className="icon-button menu-toggle" onClick={() => setOpen(!open)} aria-label={open ? site.ui.menuClose : site.ui.menuOpen} aria-expanded={open} aria-controls="mobile-navigation">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div id="mobile-navigation" className="mobile-nav" ref={menu} hidden={!open} onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node) && event.relatedTarget !== menuButton.current) setOpen(false);
        }}>
          {site.nav.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}
        </div>
      </nav>
    </header>
  );
}
