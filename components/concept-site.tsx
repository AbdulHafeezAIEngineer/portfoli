"use client";

import artColors from "@/data/project-art-colors.json";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, Heart, Leaf, Menu, Plus, Sun, Waves, X } from "lucide-react";
import { concepts, conceptUI as ui, type ConceptSlug } from "@/data/concepts";

export function ConceptSite({ slug }: { slug: ConceptSlug }) {
  const d = concepts[slug];
  const [menu, setMenu] = useState(false);
  const [filter, setFilter] = useState<string>(d.filters[0]);
  const [choice, setChoice] = useState<string>(d.items[0].name);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [guests, setGuests] = useState<string>(ui.guestsOptions[1]);
  const [date, setDate] = useState("");
  const [finish, setFinish] = useState<string>(ui.finishes[0]);
  const [projectType, setProjectType] = useState("Residential");
  const [today, setToday] = useState("");
  const [error, setError] = useState("");
  const [summary, setSummary] = useState<{ text: string; details: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    setToday(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`);
  }, []);
  const model = d.items.find((item) => item.category === filter) || d.items[0];
  const filtered = d.items.filter((item) => filter === d.filters[0] || item.category === filter);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (slug === "solenne") {
      if (arrival < today) { setError(ui.futureDate); return; }
      if (departure <= arrival) { setError(ui.invalidStay); return; }
      setSummary({ text: ui.staySummary, details: `${choice} · ${arrival} → ${departure} · ${guests}` });
    } else if (slug === "aster") {
      if (date < today) { setError(ui.futureDate); return; }
      setSummary({ text: ui.visitSummary, details: `${choice} · ${date}` });
    } else if (slug === "vanta") {
      setSummary({ text: ui.carSummary, details: `${model.name} · ${finish}` });
    } else setSummary({ text: ui.briefSummary, details: `${d.name} / ${projectType}` });
  }
  function explore(name: string, category: string) {
    setChoice(name);
    if (slug === "kovo") setProjectType(category);
    setSummary(null);
    document.getElementById("plan")?.scrollIntoView({ behavior: "smooth" });
    document.getElementById(`${slug}-choice`)?.focus({ preventScroll: true });
  }
  const heroCopy = <div className="concept-hero-copy">
    <p className="concept-kicker">{d.kicker}</p>
    <h1>{d.headline.map((line) => <span key={line}>{line}</span>)}</h1>
    <p className="concept-intro">{d.intro}</p>
    <div className="concept-actions">
      <a className="concept-primary" href={slug === "vanta" ? "#plan" : "#collection"}>{d.action}<ArrowUpRight size={17} /></a>
      <a className="concept-secondary" href="#detail">{d.secondary}<ArrowDown size={15} /></a>
    </div>
  </div>;
  return <main id="main-content" className={`concept-site concept-${slug}`}>
    <div className="concept-ribbon"><Link href="/ai-websites"><ArrowLeft size={13} />{ui.back}</Link><span>{ui.concept} / {d.category}</span><span>{ui.independent}</span></div>
    <header className="concept-header">
      <a className="concept-logo" href="#concept-top">{slug === "aster" && <span className="aster-mark" aria-hidden="true">✳</span>}{d.wordmark}{slug === "vanta" && <small>MOTORS</small>}{slug === "kovo" && <small>STUDIO / ARCHITECTURE</small>}</a>
      <nav id="concept-navigation" className={menu ? "concept-nav is-open" : "concept-nav"} aria-label={`${d.name} navigation`}>
        {d.nav.map((label, index) => <a key={label} href={["#collection", "#detail", "#plan"][index]} onClick={() => setMenu(false)}>{label}</a>)}
      </nav>
      <a className="concept-header-action" href="#plan">{ui.headerActions[slug]}<ArrowUpRight size={15} /></a>
      <button className="concept-menu" aria-label={menu ? ui.closeMenu : ui.menu} aria-expanded={menu} aria-controls="concept-navigation" onClick={() => setMenu(!menu)}>{menu ? <X size={22} /> : <Menu size={22} />}</button>
    </header>

    <section id="concept-top" className="concept-hero" data-capture="home" aria-label={d.name}>
      {(slug === "solenne" || slug === "vanta") && <div className="concept-hero-background"><Image src={d.image} alt={d.imageAlt} fill sizes="100vw" priority /><div className="concept-hero-shade" /></div>}
      {heroCopy}
      {(slug === "aster" || slug === "kovo") && <div className="concept-hero-picture"><Image src={d.image} alt={d.imageAlt} fill sizes="(max-width:700px) 100vw, 70vw" priority /><span>{d.caption}<ArrowUpRight size={16} /></span></div>}
      {(slug === "solenne" || slug === "vanta") && <div className="concept-hero-caption"><span>{d.caption}</span><span>{slug === "vanta" ? "01 / GT" : "36° / THE SLOWER SIDE"}</span></div>}
    </section>

    <section id="collection" className="concept-collection concept-section" data-capture="inner" aria-labelledby="collection-title">
      <div className="concept-section-heading"><p className="concept-kicker">{ui.collectionLabel}</p><h2 id="collection-title">{d.collectionTitle}</h2><p>{d.collectionIntro}</p></div>
      <div className="concept-filters" role="group" aria-label={slug === "vanta" ? ui.modelLabel : ui.filterLabel}>
        {d.filters.map((label) => <button key={label} aria-pressed={filter === label} onClick={() => { setFilter(label); setSummary(null); }}>{label}{filter === label && <span aria-hidden="true">↗</span>}</button>)}
      </div>
      {slug === "vanta" ? <div className="vanta-config-preview">
        <div className="vanta-drawing"><CarDrawing color={ui.finishColors[ui.finishes.indexOf(finish as typeof ui.finishes[number])]} /><span>{model.name} / {finish}</span></div>
        <div className="vanta-model-copy"><p className="concept-kicker">{model.category}</p><h3>{model.name}</h3><p>{model.detail}</p><dl><div><dt>{ui.range}</dt><dd>{model.price}</dd></div><div><dt>{ui.acceleration}</dt><dd>{model.number}</dd></div><div><dt>{ui.power}</dt><dd>{model.icon}</dd></div></dl><a href="#plan" className="concept-primary">{d.action}<ArrowUpRight size={17} /></a></div>
      </div> : <div className="concept-item-grid">
        {filtered.map((item) => {
          const index = d.items.findIndex((entry) => entry.name === item.name);
          const Icon = item.icon === "heart" ? Heart : item.icon === "leaf" ? Leaf : item.icon === "waves" ? Waves : item.icon === "plus" ? Plus : Sun;
          return <article className="concept-item" key={item.name}>
            {slug === "solenne" ? <div className="room-plan"><RoomPlan variant={index} /><span>{item.number} / {item.category}</span></div> : slug === "kovo" ? <div className={`space-study space-study-${index}`}><SpaceStudy variant={index} /><span>{item.price}</span></div> : <div className="care-symbol"><Icon size={33} strokeWidth={1.3} /><span>{item.number}</span></div>}
            <div className="concept-item-copy"><p className="concept-kicker">{item.category}</p><h3>{item.name}</h3><p>{item.detail}</p><div><span>{item.price}</span><button onClick={() => explore(item.name, item.category)} aria-label={`${ui.select} ${item.name}`}><ArrowUpRight size={20} /></button></div></div>
          </article>;
        })}
      </div>}
    </section>

    <section id="detail" className="concept-feature concept-section" data-capture="feature" aria-labelledby="feature-title">
      <div className="concept-feature-art">{slug === "kovo" ? <FloorStudy /> : <Image src={d.image} alt={d.imageAlt} fill sizes="(max-width:700px) 100vw, 650px" />}<span>{d.caption}</span></div>
      <div className="concept-feature-copy"><p className="concept-kicker">{ui.featureLabel}</p><h2 id="feature-title">{d.featureTitle}</h2><p>{d.featureText}</p><ol>{d.featureList.map((feature, i) => <li key={feature}><span>0{i + 1}</span>{feature}<ArrowUpRight size={16} /></li>)}</ol><a className="concept-secondary" href="#plan">{ui.headerActions[slug]}<ArrowRight size={16} /></a></div>
    </section>

    <section id="plan" className="concept-planner concept-section" aria-labelledby="plan-title">
      <div><p className="concept-kicker">{ui.plannerLabel}</p><h2 id="plan-title">{d.formTitle}</h2><p>{d.formDescription}</p></div>
      <form onSubmit={submit} className="concept-plan-form">
        <div className="concept-form-fields">
          {slug === "solenne" && <>
            <label htmlFor="solenne-choice">{ui.stay}<select id="solenne-choice" value={choice} onChange={(e) => setChoice(e.target.value)}>{d.items.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
            <label htmlFor="solenne-arrival">{ui.arrival}<input id="solenne-arrival" type="date" required min={today} value={arrival} onChange={(e) => { setArrival(e.target.value); setError(""); }} /></label>
            <label htmlFor="solenne-departure">{ui.departure}<input id="solenne-departure" type="date" required min={arrival || today} value={departure} onChange={(e) => { setDeparture(e.target.value); setError(""); }} /></label>
            <label htmlFor="solenne-guests">{ui.guests}<select id="solenne-guests" value={guests} onChange={(e) => setGuests(e.target.value)}>{ui.guestsOptions.map((guest) => <option key={guest}>{guest}</option>)}</select></label>
          </>}
          {slug === "aster" && <>
            <label htmlFor="aster-choice">{ui.service}<select id="aster-choice" value={choice} onChange={(e) => setChoice(e.target.value)}>{d.items.map((item) => <option key={item.name}>{item.name}</option>)}</select></label>
            <label htmlFor="aster-date">{ui.date}<input id="aster-date" type="date" min={today} required value={date} onChange={(e) => { setDate(e.target.value); setError(""); }} /></label>
          </>}
          {slug === "vanta" && <>
            <label htmlFor="vanta-choice">{ui.modelLabel}<select id="vanta-choice" value={filter} onChange={(e) => { setFilter(e.target.value); setSummary(null); }}>{d.filters.map((name) => <option key={name}>{name}</option>)}</select></label>
            <fieldset className="vanta-finishes"><legend>{ui.finish}</legend>{ui.finishes.map((name, i) => <label key={name}><input type="radio" name="finish" value={name} checked={finish === name} onChange={() => { setFinish(name); setSummary(null); }} /><span className="finish-swatch" style={{ backgroundColor: ui.finishColors[i] }}>{finish === name && <Check size={14} />}</span><span>{name}</span></label>)}</fieldset>
          </>}
          {slug === "kovo" && <label htmlFor="kovo-choice">{ui.projectType}<select id="kovo-choice" value={projectType} onChange={(e) => { setProjectType(e.target.value); setSummary(null); }}>{d.filters.slice(1).map((name) => <option key={name}>{name}</option>)}</select></label>}
        </div>
        {error && <p className="concept-form-error" role="alert">{error}</p>}
        <button className="concept-primary" type="submit">{slug === "solenne" ? ui.planStay : slug === "aster" ? ui.planVisit : slug === "vanta" ? ui.configure : ui.planBrief}<ArrowUpRight size={17} /></button>
        {summary && <div className="concept-summary" role="status"><span className="concept-kicker">{ui.demo}</span><p>{summary.text}</p><strong>{summary.details}</strong><button type="button" onClick={() => setSummary(null)}>{ui.reset}<ArrowRight size={14} /></button></div>}
      </form>
    </section>
    <footer className="concept-footer"><div><a className="concept-logo" href="#concept-top">{d.wordmark}</a><p>{d.footer}</p></div><div><span>{ui.footer}</span><Link href="/ai-websites">{ui.back}<ArrowUpRight size={16} /></Link></div></footer>
  </main>;
}

function RoomPlan({ variant }: { variant: number }) {
  return <svg viewBox="0 0 420 260" aria-hidden="true"><defs><pattern id={`room-grid-${variant}`} width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="currentColor" strokeOpacity=".07" /></pattern></defs><rect width="420" height="260" fill={`url(#room-grid-${variant})`} /><g fill="none" stroke="currentColor" strokeWidth="1.4"><path d={variant === 2 ? "M70 40h280v170H70zM240 40v170M70 130h170M155 40v90" : "M90 42h240v176H90zM250 42v176M90 155h160"} /><rect x="117" y="67" width="80" height="65" rx="3" /><path d="M117 82h80M157 67v65M105 200h115M112 184v16m100-16v16M277 76h30v80h-30z" /><circle cx="285" cy="185" r="15" /><path d="M330 55h25v150h-25" strokeDasharray="4 4" /></g><g fill="currentColor" opacity=".18"><circle cx="357" cy="68" r="12" /><circle cx="357" cy="188" r="12" /></g></svg>;
}

function CarDrawing({ color }: { color: string }) {
  return <svg viewBox="0 0 700 330" aria-hidden="true"><defs><linearGradient id="car-paint" x2=".4" y2="1"><stop stopColor={color} /><stop offset="1" stopColor={artColors.tone42} /></linearGradient></defs><path d="M60 245h580M95 257h510" stroke={artColors.tone43} strokeOpacity=".2" /><path d="m78 220 20-45 109-20 92-66h163l105 66 59 20 28 45-35 18H99z" fill="url(#car-paint)" stroke={artColors.tone44} strokeWidth="1.5" /><path d="m229 153 75-51h145l84 51z" fill={artColors.tone45} stroke={artColors.tone46} /><path d="M370 104v49M102 186h71m378-13h58M204 169h325M408 168v60" fill="none" stroke={artColors.tone47} strokeWidth="1.5" /><path d="m83 208 32-3m480-4 43 8" stroke={artColors.tone48} strokeWidth="4" /><g fill={artColors.tone49} stroke={artColors.tone50} strokeWidth="2"><circle cx="187" cy="232" r="39" /><circle cx="535" cy="232" r="39" /></g><g fill="none" stroke={artColors.tone51} strokeWidth="2"><circle cx="187" cy="232" r="24" /><circle cx="535" cy="232" r="24" /><path d="m164 232 46 0m-23-23v46m325-23h46m-23-23v46" /></g></svg>;
}

function SpaceStudy({ variant }: { variant: number }) {
  return <svg viewBox="0 0 420 280" aria-hidden="true"><path d="m40 225 153-80 190 75-149 49z" fill={artColors.tone52} /><path d="m70 121 130-57 143 48-130 62z" fill={variant === 1 ? artColors.tone53 : artColors.tone54} /><path d="m70 121 143 53v68L70 188z" fill={artColors.tone55} /><path d="m213 174 130-62v69l-130 61z" fill={artColors.tone56} /><path d="m98 114 104-42 109 37-103 48z" fill={artColors.tone57} /><path d="m96 142 96 36v45l-96-36zM232 183l88-42v34l-88 43z" fill={artColors.tone58} /><path d="m246 188 58-28M245 198l58-28" stroke={artColors.tone59} /><circle cx="143" cy="163" r={variant === 2 ? "19" : "13"} fill={artColors.tone60} /><path d="M355 190v-52m-12 23 12-30 14 30z" fill={artColors.tone61} stroke={artColors.tone61} /></svg>;
}

function FloorStudy() {
  return <svg viewBox="0 0 550 500" aria-hidden="true"><g fill="none" stroke="currentColor"><path d="M70 70h410v350H70zM70 270h245V70M315 270h165M200 270v150M315 330v90" strokeWidth="3" /><path d="M103 103h165v110H103zM348 103h92v90h-92zM348 304h92v80h-92zM101 315h63v65h-63zM228 314h60v65h-60z" strokeWidth="1.3" /><circle cx="202" cy="200" r="55" strokeWidth="1" /><path d="M45 70v350m0-350h-12m12 350h-12M70 446h410m-410 0v13m410-13v13M189 270a55 55 0 0 1 55 55M315 216a54 54 0 0 1 54 54" strokeOpacity=".6" /><path d="M70 250h65m152-180v90m28 235h55" strokeWidth="6" /></g></svg>;
}
