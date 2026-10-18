## app/about/page.tsx

``````tsx
import { Experience } from "@/components/experience";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("about");

export default function Page() {
  return (
    <SiteShell page="about">
      <Experience />
    </SiteShell>
  );
}
``````

## app/admin/[[...path]]/loading.tsx

``````tsx
import { site } from "@/data/site";

export default function Loading() {
  return (
    <main className="loading-page" role="status">
      <span className="wordmark">
        {site.brand}
        <span>.</span>
      </span>
      <span className="loading-line" />
      <p>{site.ui.loading}</p>
    </main>
  );
}
``````

## app/admin/[[...path]]/page.tsx

``````tsx
import type { Metadata } from "next";
import { adminConfigurationReady } from "@/lib/admin/configuration";
import { requireAdmin } from "@/lib/admin/session";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { AdminApp } from "@/components/admin-app";
import { adminContent } from "@/data/admin";
import "../admin.css";
export const metadata: Metadata = {
  title: "Elvora Studio — Private administration",
  robots: { index: false, follow: false },
};
export default async function AdminPage({
  params,
}: {
  params: Promise<{ path?: string[] }>;
}) {
  const section = (await params).path?.[0] || "dashboard";
  if (
    ((await params).path?.length || 0) > 1 ||
    ![
      "dashboard",
      "login",
      "security",
      ...adminContent.resources.map((resource) => resource.id),
    ].includes(section)
  )
    notFound();
  if (section !== "login") {
    try {
      await requireAdmin();
    } catch {
      redirect("/admin/login");
    }
  }
  return (
    <AdminApp
      section={section}
      loginReady={section === "login" ? adminConfigurationReady() : true}
    />
  );
}
``````

## app/admin/admin.css

``````css
.admin-shell {
  display: grid;
  grid-template-columns: 235px minmax(0, 1fr);
  min-height: 100vh;
}
.admin-sidebar {
  border-right: 1px solid var(--line);
  padding: 35px 24px;
  position: sticky;
  top: 0;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background: var(--surface);
}
.admin-sidebar > p {
  font-size: 10px;
  color: var(--muted);
  margin-top: 8px;
}
.admin-sidebar nav {
  display: grid;
  gap: 5px;
  margin-top: 35px;
}
.admin-sidebar nav a {
  padding: 12px 13px;
  font-size: 12px;
  border-radius: 6px;
  color: var(--muted);
}
.admin-sidebar nav a[aria-current="page"] {
  background: color-mix(in srgb, var(--accent-text) 6.67%, transparent);
  color: var(--gold);
}
.admin-back {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  font-size: 11px;
  padding: 20px 0;
  color: var(--muted);
}
.admin-sidebar > button {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  font-size: 11px;
  color: var(--muted);
  padding: 10px 0;
}
.admin-main {
  padding: 45px;
  min-width: 0;
  max-width: 1500px;
}
.admin-main > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
  margin-bottom: 30px;
}
.admin-main h1 {
  font-size: 36px;
  margin-top: 10px;
  letter-spacing: -1.5px;
}
.admin-main h2 {
  font-size: 21px;
  letter-spacing: -0.6px;
}
.admin-note {
  font-size: 11px;
  line-height: 1.9;
  color: var(--muted);
  margin: 15px 0;
}
.admin-loading {
  display: flex;
  gap: 10px;
  align-items: center;
  color: var(--muted);
  font-size: 12px;
  padding: 15px 0;
}
.admin-stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 30px;
}
.admin-stats article {
  border-radius: 10px;
  padding: 25px;
}
.admin-stats span {
  text-transform: capitalize;
  font-size: 11px;
  color: var(--muted);
}
.admin-stats strong {
  display: block;
  font-family: var(--font-space);
  font-size: 40px;
  font-weight: 500;
  margin-top: 14px;
}
.admin-records {
  display: grid;
  gap: 14px;
}
.admin-record {
  padding: 24px;
  border-radius: 11px;
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 25px;
  min-width: 0;
}
.admin-record > div:first-child {
  min-width: 0;
  overflow-wrap: anywhere;
}
.admin-record h2 {
  font-size: 19px;
}
.admin-record p,
.admin-record time,
.admin-record a {
  display: block;
  font-size: 11px;
  line-height: 1.9;
  color: var(--muted);
  margin-top: 8px;
}
.admin-record .admin-message {
  font-size: 13px;
  color: var(--text);
  white-space: pre-wrap;
  max-width: 750px;
}
.admin-record .admin-reply {
  color: var(--muted);
  border-left: 2px solid var(--gold);
  padding-left: 15px;
}
.admin-record-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: end;
  gap: 5px;
  flex-shrink: 0;
}
.admin-record-actions .button {
  min-height: 38px;
  padding: 8px 12px;
  font-size: 10px;
}
.admin-record-actions .icon-button {
  width: 35px;
  height: 35px;
}
.admin-record button:disabled {
  opacity: 0.3;
}
.admin-editor {
  padding: 30px;
  border-radius: 12px;
  max-width: 850px;
}
.admin-editor-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 20px;
}
.admin-editor .form-field textarea {
  font-size: 13px;
}
.admin-editor input[type="checkbox"] {
  width: 20px;
  height: 20px;
  min-height: 0;
  accent-color: var(--accent-text);
}
.admin-editor input[readonly] {
  color: var(--muted);
}
.admin-editor > button {
  margin-top: 15px;
}
.admin-editor hr {
  border: 0;
  border-top: 1px solid var(--line);
  margin: 35px 0;
}
.admin-upload {
  border: 1px dashed var(--line);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}
.admin-upload label {
  font-size: 12px;
}
.admin-upload p {
  font-size: 10px;
  color: var(--muted);
  line-height: 1.8;
  margin: 10px 0;
}
.admin-upload input {
  max-width: 100%;
  font-size: 11px;
}
.admin-login {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 30px;
  background: radial-gradient(ellipse at 50% 20%, color-mix(in srgb, var(--muted) 4.31%, transparent), transparent 60%);
}
.admin-login form {
  width: min(420px, 100%);
  padding: 36px;
  border-radius: 15px;
}
.admin-login h1 {
  font-size: 32px;
  margin-top: 35px;
  letter-spacing: -1px;
}
.admin-login form > p {
  color: var(--muted);
  line-height: 1.8;
  font-size: 12px;
  margin: 14px 0 25px;
}
.admin-login label {
  display: block;
  font-size: 11px;
  margin: 20px 0 9px;
}
.admin-login input {
  display: block;
  width: 100%;
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 13px;
  color: var(--text);
  font: inherit;
}
.admin-login .button {
  width: 100%;
  margin-top: 28px;
}
.totp-setup {
  padding: 20px;
  margin-top: 20px;
  border: 1px solid var(--line);
  border-radius: 8px;
  max-width: 100%;
}
.totp-setup p {
  font-size: 12px;
  line-height: 1.9;
  color: var(--muted);
}
.totp-setup label {
  display: block;
  font-size: 10px;
  color: var(--gold);
  margin-top: 15px;
}
.totp-setup code {
  display: block;
  overflow-wrap: anywhere;
  margin-top: 8px;
  letter-spacing: 1px;
  font-size: 13px;
}
@media (max-width: 1000px) {
  .admin-shell {
    grid-template-columns: 190px minmax(0, 1fr);
  }
  .admin-sidebar {
    padding: 25px 16px;
  }
  .admin-main {
    padding: 30px 22px;
  }
  .admin-stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .admin-record {
    flex-direction: column;
  }
  .admin-record-actions {
    justify-content: start;
  }
}
@media (max-width: 700px) {
  .admin-shell {
    grid-template-columns: minmax(0, 1fr);
  }
  .admin-sidebar {
    height: auto;
    position: relative;
    padding: 20px;
    border-right: 0;
    border-bottom: 1px solid var(--line);
  }
  .admin-sidebar nav {
    display: flex;
    overflow-x: auto;
    gap: 3px;
    margin-top: 18px;
    padding-bottom: 5px;
  }
  .admin-sidebar nav a {
    white-space: nowrap;
    padding: 10px 12px;
    font-size: 10px;
  }
  .admin-sidebar .wordmark {
    font-size: 26px;
  }
  .admin-sidebar > p {
    display: none;
  }
  .admin-back {
    position: absolute;
    top: 15px;
    right: 105px;
    gap: 10px;
    font-size: 9px;
  }
  .admin-sidebar > button {
    position: absolute;
    top: 28px;
    right: 20px;
    font-size: 9px;
  }
  .admin-main {
    padding: 30px 20px;
  }
  .admin-main h1 {
    font-size: 29px;
  }
  .admin-main > header .button {
    font-size: 10px;
    padding: 10px 13px;
    gap: 8px;
  }
  .admin-editor {
    padding: 22px;
  }
  .admin-editor input,
  .admin-editor textarea,
  .admin-login input {
    font-size: 16px;
  }
  .admin-login form {
    padding: 28px;
  }
  .admin-record {
    padding: 20px;
  }
  .admin-stats article {
    padding: 20px;
  }
  .admin-stats strong {
    font-size: 32px;
  }
}
.admin-password-field {
  display: flex;
  align-items: stretch;
  gap: 8px;
}
.admin-password-field input {
  min-width: 0;
  flex: 1;
}
.admin-password-toggle {
  min-height: 48px;
  padding: 8px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--raised);
  color: var(--text);
  font-size: 11px;
}
.admin-login .admin-login-help {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
}
.admin-authenticator {
  margin-top: 24px;
}
.admin-authenticator summary {
  display: flex;
  align-items: center;
  min-height: 44px;
  cursor: pointer;
  font-size: 12px;
  color: var(--text);
}
.admin-authenticator summary::before {
  content: "+";
  margin-right: 10px;
}
.admin-authenticator[open] summary::before {
  content: "−";
}
``````

## app/agency.css

``````css
/* Finishing layer: shared proportions and restrained surfaces. */
.ambient-background {
  opacity: 0.24;
}
.studio-service,
.workflow-step,
.domain-card,
.journey-editorial-entry {
  border-radius: 16px;
}
.contact-form select {
  width: 100%;
  min-height: 48px;
  padding: 12px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
}
.agency-faq {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  gap: clamp(24px, 6vw, 90px);
}
.faq-list details {
  border-top: 1px solid var(--line);
}
.faq-list details:last-child {
  border-bottom: 1px solid var(--line);
}
.faq-list summary {
  display: flex;
  gap: 20px;
  padding: 25px 0;
  cursor: pointer;
  font-weight: 500;
}
.faq-list summary span {
  color: var(--gold);
  font-size: 0.8rem;
  padding-top: 3px;
}
.faq-list details p {
  padding: 0 0 25px 40px;
  color: var(--muted);
  line-height: 1.8;
}
.faq-list summary::after {
  content: "+";
  margin-left: auto;
}
.faq-list details[open] summary::after {
  content: "−";
}
.about-brand-poster {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  padding: clamp(26px, 4vw, 52px);
  background: var(--surface);
  isolation: isolate;
}
.about-brand-poster strong {
  font-family: var(--font-space);
  font-size: clamp(3rem, 6vw, 6rem);
  line-height: 1.05;
  letter-spacing: -0.06em;
  color: var(--text);
  position: relative;
}
.about-brand-poster > span:last-child {
  font-size: 0.6rem;
  letter-spacing: 0.14em;
  color: var(--muted);
}
.poster-emblem {
  position: absolute;
  right: 5%;
  top: 12%;
  font: bold 23rem/1 var(--font-space);
  opacity: 0.07;
  transform: rotate(-12deg);
}
.poster-emblem span {
  color: var(--gold);
}
.agency-detail {
  padding-top: 150px;
  padding-bottom: 100px;
}
.agency-detail-hero {
  padding: 60px 0 80px;
  max-width: 1000px;
}
.agency-detail h1 {
  font-size: clamp(3rem, 7vw, 6.5rem);
  line-height: 1.04;
  letter-spacing: -0.055em;
  margin: 20px 0 30px;
}
.agency-detail-hero > p:not(.eyebrow) {
  max-width: 740px;
  font-size: clamp(1.05rem, 2vw, 1.35rem);
  color: var(--muted);
  line-height: 1.8;
  margin-bottom: 32px;
}
.agency-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(30px, 6vw, 90px);
  padding: 60px 0;
  border-top: 1px solid var(--line);
}
.agency-detail h2 {
  font-size: clamp(1.6rem, 3vw, 2.6rem);
  line-height: 1.2;
  letter-spacing: -0.035em;
  margin: 18px 0 25px;
}
.agency-detail li {
  list-style: none;
  padding: 17px 0;
  border-bottom: 1px solid var(--line);
  color: var(--muted);
  line-height: 1.7;
}
.agency-detail-grid p:not(.eyebrow),
.agency-detail-note {
  color: var(--muted);
  line-height: 1.8;
}
.agency-detail-note {
  padding: 24px;
  background: var(--surface);
  border-left: 2px solid var(--gold);
  margin-bottom: 70px;
}
.agency-case-hero {
  position: relative;
  aspect-ratio: 16/10;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid var(--line);
}
.agency-case-hero img {
  object-fit: cover;
  object-position: top;
}
.agency-case-images {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}
.agency-case-images img {
  width: 100%;
  height: auto;
  border-radius: 10px;
}
.agency-case-images figcaption {
  padding: 12px 0;
  color: var(--muted);
}
.agency-related {
  margin-top: 90px;
}
.agency-related a {
  display: flex;
  justify-content: space-between;
  padding: 24px 0;
  border-bottom: 1px solid var(--line);
  font-size: 1.1rem;
  gap: 20px;
}
.admin-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 24px 0;
}
.admin-filters input {
  flex: 1;
  min-width: 180px;
}
.admin-filters input,
.admin-filters select,
.lead-editor select,
.lead-editor textarea {
  padding: 12px;
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
}
.admin-pagination {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  margin: 25px 0;
}
.admin-record {
  min-width: 0;
}
.admin-record > div {
  min-width: 0;
  overflow-wrap: anywhere;
}
.lead-editor {
  display: grid;
  gap: 10px;
  width: 100%;
}
.admin-confirm {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--line);
  border-radius: 16px;
  padding: 30px;
  max-width: calc(100vw - 32px);
}
.admin-confirm::backdrop {
  background: color-mix(in srgb, var(--neutral-black) 60%, transparent);
}
.admin-confirm h2 {
  margin-bottom: 20px;
}
.admin-confirm > div {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}
@media (max-width: 760px) {
  .agency-faq,
  .agency-detail-grid,
  .agency-case-images {
    grid-template-columns: 1fr;
  }
  .agency-detail {
    padding-top: 110px;
  }
  .agency-detail-hero {
    padding: 40px 0 50px;
  }
  .agency-detail-grid {
    padding: 35px 0;
  }
  .agency-detail-note {
    padding: 20px;
  }
  .agency-faq {
    gap: 30px;
  }
}
[data-motion-reveals="enabled"] [data-reveal="block"] {
  transition:
    opacity 0.65s ease,
    transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
  transition-delay: var(--reveal-delay, 0s);
}
[data-motion-reveals="enabled"] [data-reveal="block"]:not(.is-revealed) {
  opacity: 1;
  transform: none;
  filter: none;
}
[data-motion-reveals="enabled"] [data-reveal="words"] .motion-word {
  transition: transform 0.65s cubic-bezier(0.18, 0.85, 0.25, 1.08);
  transition-delay: var(--word-delay, 0s);
}
[data-motion-reveals="enabled"]
  [data-reveal="words"]:not(.is-revealed)
  .motion-word {
  transform: none;
}
[data-consent-choice="saved"] .consent-banner {
  display: none;
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) [data-reveal],
  html:not([data-motion="full"]) [data-reveal] .motion-word {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
}
html[data-motion="reduced"] [data-reveal],
html[data-motion="reduced"] [data-reveal] .motion-word {
  opacity: 1 !important;
  transform: none !important;
  filter: none !important;
  transition: none !important;
}

.agency-case-shot {
  position: relative;
  aspect-ratio: 16/10;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 10px;
  overflow: hidden;
}
.agency-case-shot.is-mobile {
  aspect-ratio: 390/844;
  max-width: 390px;
  margin-inline: auto;
}
.agency-case-shot img {
  object-fit: contain;
  border-radius: 0;
}

.admin-sidebar {
  overflow-y: auto;
}
.admin-sidebar nav a {
  min-height: 44px;
  display: flex;
  align-items: center;
}
@media (max-width: 700px) {
  .admin-shell {
    display: block;
  }
  .admin-sidebar {
    overflow: visible;
  }
}
.admin-setup-notice {
  padding: 20px;
  margin: 24px 0;
  background: var(--raised);
  border: 1px solid var(--line);
  border-radius: 10px;
}
.admin-setup-notice h2 {
  font-size: 1.05rem;
  margin-bottom: 12px;
}
.admin-setup-notice p {
  margin-bottom: 18px;
  line-height: 1.7;
}
``````

## app/ai-bots/how-i-embed-bots/page.tsx

``````tsx
import { redirect } from "next/navigation";
export default function Page() {
  redirect("/ai-bots#embed-methods");
}
``````

## app/ai-bots/page.tsx

``````tsx
import { BotBuildProcess } from "@/components/bot-build-process";
import { BotServices, BotEmbedding } from "@/components/bot-services";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getBots } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("bots");

export default async function Page() {
  const bots = await getBots();
  return (
    <SiteShell page="bots">
      <BotServices bots={bots} />
      <BotBuildProcess />
      <BotEmbedding bots={bots} />
    </SiteShell>
  );
}
``````

## app/ai-websites/page.tsx

``````tsx
import { permanentRedirect } from "next/navigation";
export default function Page() {
  permanentRedirect("/websites");
}
``````

## app/api/admin/[resource]/route.ts

``````ts
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/session";
import { leadStatus, schemas } from "@/lib/admin/schemas";
import {
  ChatError,
  checkOrigin,
  readJson,
  publicHttpsUrl,
} from "@/lib/chat/http";
import { limitLogin } from "@/lib/admin/rate-limit";
import { updateSecurity } from "@/lib/admin/security";
import { scriptDocument } from "@/lib/chat/embed";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};
const ordered = [{ order: "asc" as const }, { id: "asc" as const }];
function reply(value: unknown, status = 200) {
  return NextResponse.json(value, { status, headers });
}
function failure(error: unknown) {
  if (error instanceof ChatError)
    return reply({ error: error.message }, error.status);
  if (error instanceof z.ZodError)
    return reply(
      {
        error: error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; "),
      },
      422,
    );
  return reply({ error: "The request could not be completed." }, 503);
}
export async function GET(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    const user = await requireAdmin();
    const resource = (await params).resource;
    if (["inbox", "chatlogs", "audit"].includes(resource)) {
      const query = new URL(request.url).searchParams;
      const pagination = z
        .object({
          page: z.coerce.number().int().min(1).max(100000).default(1),
          size: z.coerce.number().int().min(1).max(50).default(20),
          q: z.string().trim().max(200).default(""),
          sort: z.enum(["newest", "oldest"]).default("newest"),
          status: z.union([z.literal(""), leadStatus]).default(""),
        })
        .parse(Object.fromEntries(query));
      const { page, size, q, sort, status } = pagination;
      const options = {
        skip: (page - 1) * size,
        take: size,
        orderBy: [
          {
            createdAt: sort === "newest" ? ("desc" as const) : ("asc" as const),
          },
          { id: "asc" as const },
        ],
      };
      const contains = { contains: q, mode: "insensitive" as const };
      let items: unknown[], total: number;
      if (resource === "inbox") {
        const where = {
          ...(status ? { status } : {}),
          ...(q
            ? {
                OR: [
                  { name: contains },
                  { email: contains },
                  { company: contains },
                  { message: contains },
                ],
              }
            : {}),
        };
        [items, total] = await db.$transaction([
          db.contactMessage.findMany({ ...options, where }),
          db.contactMessage.count({ where }),
        ]);
      } else if (resource === "chatlogs") {
        const where = q
          ? {
              OR: [
                { botId: contains },
                { userMessage: contains },
                { reply: contains },
              ],
            }
          : {};
        [items, total] = await db.$transaction([
          db.chatLog.findMany({ ...options, where }),
          db.chatLog.count({ where }),
        ]);
      } else {
        const where = q
          ? {
              OR: [
                { action: contains },
                { resource: contains },
                { recordId: contains },
              ],
            }
          : {};
        [items, total] = await db.$transaction([
          db.auditLog.findMany({ ...options, where }),
          db.auditLog.count({ where }),
        ]);
      }
      return reply({
        items,
        total,
        page,
        pages: Math.max(1, Math.ceil(total / size)),
      });
    }
    switch (resource) {
      case "dashboard":
        const [projects, bots, messages, unread, newInquiries, recent] =
          await Promise.all([
            db.project.count(),
            db.bot.count(),
            db.contactMessage.count(),
            db.contactMessage.count({ where: { read: false } }),
            db.contactMessage.count({ where: { status: "new" } }),
            db.contactMessage.findMany({
              orderBy: { createdAt: "desc" },
              take: 5,
              select: { id: true, name: true, status: true, createdAt: true },
            }),
          ]);
        return reply({
          projects,
          bots,
          messages,
          unread,
          newInquiries,
          recent,
          twoFactor: !!user.totpSecret,
          contentSource: process.env.CONTENT_SOURCE || "files",
        });
      case "services":
        return reply(await db.service.findMany({ orderBy: ordered }));
      case "faqs":
        return reply(await db.faq.findMany({ orderBy: ordered }));
      case "testimonials":
        return reply(await db.testimonial.findMany({ orderBy: ordered }));
      case "projects":
        return reply(
          (
            await db.project.findMany({
              orderBy: ordered,
              include: { images: { orderBy: ordered } },
            })
          ).map(({ images, ...project }) => ({
            ...project,
            screenshots: images.map(({ src, title, alt }) => ({
              src,
              title,
              alt,
            })),
          })),
        );
      case "bots":
        return reply(await db.bot.findMany({ orderBy: ordered }));
      case "skills":
        return reply(await db.skill.findMany({ orderBy: ordered }));
      case "certificates":
        return reply(await db.certificate.findMany({ orderBy: ordered }));
      case "settings": {
        const row = await db.siteSettings.findUnique({ where: { id: "main" } });
        return reply(
          row
            ? {
                brand: row.brand,
                email: row.email,
                title: row.title,
                description: row.description,
                chatLogging: row.chatLogging,
              }
            : null,
        );
      }
      default:
        return reply({ error: "Not found." }, 404);
    }
  } catch (error) {
    return failure(error);
  }
}
export async function POST(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    const user = await requireAdmin();
    checkOrigin(request);
    const body = await readJson(request);
    const resource = (await params).resource;
    if (resource === "security") {
      await limitLogin(Object.fromEntries(request.headers.entries()));
      return reply(await updateSecurity(user, body));
    }
    if (!(resource in schemas)) return reply({ error: "Not found." }, 404);
    const schema = schemas[resource as keyof typeof schemas];
    const data = schema.parse(body);
    if (resource === "bots") {
      const bot = schemas.bots.parse(body);
      const config = bot.config;
      if (config) {
        const destination =
          config.method === "iframe"
            ? config.url
            : config.method === "script"
              ? config.src
              : config.endpoint;
        const destinations = [destination];
        if (config.method === "script" && config.botpress) {
          scriptDocument(config);
          destinations.push(config.botpress.configurationSrc);
        }
        for (const destination of destinations.filter(Boolean)) {
          const url = publicHttpsUrl(destination);
          const allowed = (process.env.BOT_PROVIDER_ALLOWLIST || "")
            .split(",")
            .map((host) => host.trim().toLowerCase());
          if (!allowed.includes(url.hostname))
            throw new ChatError(
              422,
              "Add the provider hostname to BOT_PROVIDER_ALLOWLIST in private hosting settings first.",
            );
        }
      }
    }
    await db.$transaction(async (tx) => {
      switch (resource) {
        case "services": {
          const data = schemas.services.parse(body);
          await tx.service.upsert({
            where: { id: data.id },
            create: data,
            update: data,
          });
          break;
        }
        case "faqs": {
          const data = schemas.faqs.parse(body);
          await tx.faq.upsert({
            where: { id: data.id },
            create: data,
            update: data,
          });
          break;
        }
        case "testimonials": {
          const data = schemas.testimonials.parse(body);
          await tx.testimonial.upsert({
            where: { id: data.id },
            create: data,
            update: data,
          });
          break;
        }
        case "projects": {
          const { screenshots, ...project } = schemas.projects.parse(body);
          await tx.project.upsert({
            where: { id: project.id },
            create: {
              ...project,
              images: {
                create: screenshots.map((image, order) => ({
                  ...image,
                  order,
                })),
              },
            },
            update: {
              ...project,
              images: {
                deleteMany: {},
                create: screenshots.map((image, order) => ({
                  ...image,
                  order,
                })),
              },
            },
          });
          break;
        }
        case "bots": {
          const bot = schemas.bots.parse(body);
          const value = {
            ...bot,
            config: bot.config
              ? (bot.config as Prisma.InputJsonValue)
              : Prisma.DbNull,
          };
          await tx.bot.upsert({
            where: { id: bot.id },
            create: value,
            update: value,
          });
          break;
        }
        case "skills": {
          const skill = schemas.skills.parse(body);
          await tx.skill.upsert({
            where: { id: skill.id },
            create: skill,
            update: skill,
          });
          break;
        }
        case "certificates": {
          const certificate = schemas.certificates.parse(body);
          await tx.certificate.upsert({
            where: { id: certificate.id },
            create: certificate,
            update: certificate,
          });
          break;
        }
        case "settings": {
          const settings = schemas.settings.parse(body);
          await tx.siteSettings.upsert({
            where: { id: "main" },
            create: { id: "main", ...settings },
            update: settings,
          });
          break;
        }
      }
      await tx.auditLog.create({
        data: {
          adminId: user.id,
          action: "save",
          resource,
          recordId: "id" in data ? data.id : "main",
        },
      });
    });
    return reply({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    const user = await requireAdmin();
    checkOrigin(request);
    const { id } = z
      .object({ id: z.string().min(1).max(100) })
      .strict()
      .parse(await readJson(request));
    await db.$transaction(async (tx) => {
      switch ((await params).resource) {
        case "services":
          await tx.service.delete({ where: { id } });
          break;
        case "faqs":
          await tx.faq.delete({ where: { id } });
          break;
        case "testimonials":
          await tx.testimonial.delete({ where: { id } });
          break;
        case "projects":
          await tx.project.delete({ where: { id } });
          break;
        case "bots":
          await tx.bot.delete({ where: { id } });
          break;
        case "skills":
          await tx.skill.delete({ where: { id } });
          break;
        case "certificates":
          await tx.certificate.delete({ where: { id } });
          break;
        case "inbox":
          await tx.contactMessage.delete({ where: { id } });
          break;
        case "chatlogs":
          await tx.chatLog.delete({ where: { id } });
          break;
        default:
          throw new ChatError(404, "Not found.");
      }
      await tx.auditLog.create({
        data: {
          adminId: user.id,
          action: "delete",
          resource: (await params).resource,
          recordId: id,
        },
      });
    });
    return reply({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ resource: string }> },
) {
  try {
    const user = await requireAdmin();
    checkOrigin(request);
    const body = await readJson(request);
    const resource = (await params).resource;
    if (resource === "inbox") {
      const data = z
        .object({
          id: z.string().min(1).max(100),
          read: z.boolean().optional(),
          status: leadStatus.optional(),
          notes: z.string().trim().max(5000).optional(),
        })
        .strict()
        .refine(
          (value) =>
            value.read !== undefined ||
            value.status !== undefined ||
            value.notes !== undefined,
          "Provide an update.",
        )
        .parse(body);
      await db.$transaction([
        db.contactMessage.update({
          where: { id: data.id },
          data: { read: data.read, status: data.status, notes: data.notes },
        }),
        db.auditLog.create({
          data: {
            adminId: user.id,
            action: "update-inquiry",
            resource,
            recordId: data.id,
          },
        }),
      ]);
      return reply({ ok: true });
    }
    const { ids } = z
      .object({
        ids: z
          .array(z.string().max(60))
          .min(1)
          .max(200)
          .refine((ids) => new Set(ids).size === ids.length),
      })
      .strict()
      .parse(body);
    await db.$transaction(async (tx) => {
      for (const [order, id] of ids.entries()) {
        switch (resource) {
          case "services":
            await tx.service.update({ where: { id }, data: { order } });
            break;
          case "faqs":
            await tx.faq.update({ where: { id }, data: { order } });
            break;
          case "testimonials":
            await tx.testimonial.update({ where: { id }, data: { order } });
            break;
          case "projects":
            await tx.project.update({ where: { id }, data: { order } });
            break;
          case "bots":
            await tx.bot.update({ where: { id }, data: { order } });
            break;
          case "skills":
            await tx.skill.update({ where: { id }, data: { order } });
            break;
          case "certificates":
            await tx.certificate.update({ where: { id }, data: { order } });
            break;
          default:
            throw new ChatError(404, "Not found.");
        }
      }
      await tx.auditLog.create({
        data: { adminId: user.id, action: "reorder", resource },
      });
    });
    return reply({ ok: true });
  } catch (error) {
    return failure(error);
  }
}
``````

## app/api/admin/upload/route.ts

``````ts
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { encodePortfolioImage } from "@/lib/admin/images";
import { put, del } from "@vercel/blob";
import { requireAdmin } from "@/lib/admin/session";
import { db } from "@/lib/db";
import { ChatError, checkOrigin } from "@/lib/chat/http";
export const runtime = "nodejs";
export const maxDuration = 30;
export async function POST(request: Request) {
  const uploaded: string[] = [];
  try {
    const admin = await requireAdmin();
    checkOrigin(request);
    if (!process.env.BLOB_READ_WRITE_TOKEN || !process.env.BLOB_PUBLIC_HOST)
      throw new ChatError(503, "Image storage is not configured.");
    if (
      !request.headers.get("content-type")?.startsWith("multipart/form-data;")
    )
      throw new ChatError(415, "Send image files.");
    const limit = 13 * 1024 * 1024;
    if (Number(request.headers.get("content-length")) > limit)
      throw new ChatError(413, "Upload is too large.");
    const reader = request.body?.getReader();
    if (!reader) throw new ChatError(400, "Choose images.");
    const chunks: Uint8Array[] = [];
    let size = 0;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > limit) {
          await reader.cancel();
          throw new ChatError(413, "Upload is too large.");
        }
        chunks.push(value);
      }
    } finally {
      reader.releaseLock();
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }
    const form = await new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": request.headers.get("content-type")! },
      body: bytes,
    }).formData();
    const files = form.getAll("images");
    if (
      !files.length ||
      files.length > 4 ||
      [...form.keys()].some((key) => key !== "images")
    )
      throw new ChatError(422, "Choose 1–4 JPEG, PNG or WebP files.");
    const converted: Buffer[] = [];
    for (const file of files) {
      if (
        !(file instanceof File) ||
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > 3 * 1024 * 1024 ||
        file.size < 20
      )
        throw new ChatError(
          422,
          "Each image must be JPEG, PNG or WebP, up to 3 MB.",
        );
      converted.push(await encodePortfolioImage(file));
    }
    for (const buffer of converted) {
      const result = await put(`portfolio/${randomUUID()}.webp`, buffer, {
        access: "public",
        contentType: "image/webp",
        addRandomSuffix: false,
      });
      uploaded.push(result.url);
      if (new URL(result.url).hostname !== process.env.BLOB_PUBLIC_HOST)
        throw new ChatError(
          503,
          "Image storage hostname does not match its configuration.",
        );
    }
    await db.auditLog.create({
      data: { adminId: admin.id, action: "upload", resource: "images" },
    });
    return NextResponse.json(
      {
        images: uploaded.map((src, index) => ({
          src,
          title: `Screenshot ${index + 1}`,
          alt: `Project screenshot ${index + 1}`,
        })),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    if (uploaded.length) {
      try {
        await del(uploaded);
      } catch {}
    }
    return NextResponse.json(
      {
        error:
          error instanceof ChatError
            ? error.message
            : "The upload could not be completed.",
      },
      {
        status: error instanceof ChatError ? error.status : 503,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
``````

## app/api/auth/[...nextauth]/route.ts

``````ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/admin/auth";
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
``````

## app/api/bot-embed/route.ts

``````ts
import { NextResponse } from "next/server";
import { botRuntime } from "@/lib/bot-runtime";
import { ChatError, publicHttpsUrl } from "@/lib/chat/http";
import { scriptDocument } from "@/lib/chat/embed";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const id = new URL(request.url).searchParams.get("botId") || "real";
    if (!/^[a-z0-9-]{1,60}$/.test(id)) throw new Error();
    const realBotConfig = (await botRuntime(id))?.config;
    if (!realBotConfig) throw new Error();
    if (realBotConfig.method === "iframe")
      return NextResponse.redirect(publicHttpsUrl(realBotConfig.url), {
        status: 307,
        headers: { "Cache-Control": "no-store" },
      });
    if (realBotConfig.method !== "script")
      return new Response("This bot uses API chat.", { status: 404 });
    const { document, policy } = scriptDocument(realBotConfig);
    return new Response(document, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "Content-Security-Policy": policy,
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "no-referrer",
      },
    });
  } catch (error) {
    return new Response(
      error instanceof ChatError
        ? error.message
        : "This bot connection is unavailable.",
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/plain; charset=utf-8",
        },
      },
    );
  }
}
``````

## app/api/chat/route.ts

``````ts
import { NextResponse } from "next/server";
import { validateMessages } from "@/lib/chat/protocol";
import { hasPromptInjection } from "@/lib/chat/guard";
import { ChatError, checkOrigin, readJson } from "@/lib/chat/http";
import { ensureConfigured, callBot } from "@/lib/chat/provider";
import { reserveRequest, acquireSlot } from "@/lib/chat/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function POST(request: Request) {
  const headers: Record<string, string> = {
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  };
  let release: (() => void) | undefined;
  try {
    checkOrigin(request);
    const body = await readJson(request);
    if (
      !body ||
      typeof body !== "object" ||
      !("botId" in body) ||
      !("messages" in body)
    )
      throw new ChatError(400, "Choose a bot and enter a message.");
    const { botId } = body;
    if (typeof botId !== "string" || !/^[a-z0-9-]{1,60}$/.test(botId))
      throw new ChatError(400, "This bot is unavailable.");
    const messages = validateMessages(body.messages);
    if (!messages)
      throw new ChatError(
        400,
        "Keep messages under 1,000 characters and use a shorter conversation.",
      );
    if (messages.some((message) => hasPromptInjection(message.content)))
      throw new ChatError(
        400,
        "Please ask a question about this bot's service without instruction overrides or hidden-prompt requests.",
      );
    await ensureConfigured(botId);
    release = acquireSlot();
    await reserveRequest(request);
    const result = await callBot(botId, messages, request.signal);
    if (process.env.CONTENT_SOURCE === "database") {
      const { recordChat } = await import("@/lib/records");
      await recordChat(
        botId,
        messages[messages.length - 1].content,
        result.reply,
      );
    }
    return NextResponse.json(result, { headers });
  } catch (error) {
    if (error instanceof ChatError) {
      if (error.retryAfter) headers["Retry-After"] = String(error.retryAfter);
      return NextResponse.json(
        { error: error.message },
        { status: error.status, headers },
      );
    }
    return NextResponse.json(
      { error: "The bot could not reply in time. Please try again later." },
      { status: 502, headers },
    );
  } finally {
    release?.();
  }
}
``````

## app/api/contact/route.ts

``````ts
import { NextResponse } from "next/server";
import { contactContent as copy } from "@/data/contact";
import { ChatError, checkOrigin, readJson } from "@/lib/chat/http";
import { contactSchema, fieldErrors } from "@/lib/contact/schema";
import { acquireContactSlot, reserveContact } from "@/lib/contact/rate-limit";
import { verifyTurnstile } from "@/lib/contact/turnstile";
import { deliverContact, gmailPassword } from "@/lib/contact/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;
const headers = {
  "Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
};

export async function POST(request: Request) {
  let release: (() => void) | undefined;
  try {
    try {
      checkOrigin(request);
    } catch (error) {
      throw new ChatError(
        error instanceof ChatError ? error.status : 403,
        copy.errors.origin,
      );
    }
    let body: unknown;
    try {
      body = await readJson(request);
    } catch (error) {
      throw new ChatError(
        error instanceof ChatError ? error.status : 400,
        copy.errors.format,
      );
    }
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success)
      return NextResponse.json(
        { ok: false, error: copy.invalid, fields: fieldErrors(parsed.error) },
        { status: 422, headers },
      );
    // Quietly discard honeypot submissions without sending mail or revealing the trap.
    if (parsed.data.website)
      return NextResponse.json({ ok: true }, { status: 202, headers });
    const store =
      process.env.CONTENT_SOURCE === "database" ||
      process.env.CONTACT_STORAGE === "database";
    if (!store) gmailPassword();
    await reserveContact(request);
    release = acquireContactSlot();
    await verifyTurnstile(parsed.data.turnstileToken);
    const records = store ? await import("@/lib/records") : null;
    let id: string | null = null;
    try {
      id = records ? await records.recordContact(parsed.data) : null;
    } catch {
      throw new ChatError(503, copy.errors.unavailable);
    }
    let notification: "accepted" | "failed" | "not-configured" =
      "not-configured";
    if (!process.env.GMAIL_APP_PASSWORD?.trim() && records) {
      try {
        await records.markDelivery(id, notification);
      } catch {
        console.error("contact.delivery-status-write-failed");
      }
      return NextResponse.json(
        { ok: true, acceptance: "stored", notification },
        { status: 202, headers },
      );
    }
    const password = gmailPassword();
    try {
      await deliverContact(parsed.data, password);
      notification = "accepted";
    } catch (error) {
      if (!records) throw error;
      notification = "failed";
    }
    if (records) {
      try {
        await records.markDelivery(id, notification);
      } catch {
        console.error("contact.delivery-status-write-failed");
      }
    }
    return NextResponse.json(
      { ok: true, acceptance: records ? "stored" : "email", notification },
      { status: 202, headers },
    );
  } catch (error) {
    const known = error instanceof ChatError;
    const retryAfter: Record<string, string> =
      known && error.retryAfter
        ? { "Retry-After": String(error.retryAfter) }
        : {};
    return NextResponse.json(
      { ok: false, error: known ? error.message : copy.failure },
      {
        status: known ? error.status : 502,
        headers: { ...headers, ...retryAfter },
      },
    );
  } finally {
    release?.();
  }
}
``````

## app/atelier.css

``````css
/* Shared chrome only. Project artwork, demo palettes and custom layouts stay intact. */
.ambient-background span {
  background: none;
}
.scene-wash {
  background: radial-gradient(
    ellipse at 78% 30%,
    var(--muted),
    transparent 65%
  );
}
.scroll-progress {
  background: var(--accent);
  box-shadow: none;
}
.hero-title-reveal .text-reveal-line:nth-child(2) {
  color: var(--text);
}
.gold-text,
[data-theme="light"] .gold-text {
  color: var(--text);
  background-image: linear-gradient(
    105deg,
    var(--text),
    var(--muted) 45%,
    var(--text) 70%
  );
}
.hero-emblem {
  background: none;
}
.emblem-ring {
  border-color: var(--line-bright);
}
.emblem-orbit-a {
  border-left-color: var(--line-bright);
}
.emblem-orbit-b {
  border-right-color: var(--line-bright);
}
.button-gold,
.contact-paper .button-gold,
.skip-link {
  color: var(--on-accent);
  background: var(--accent);
  border-color: var(--accent);
  box-shadow: none;
}
.button-gold:hover,
.contact-paper .button-gold:hover {
  background: var(--accent-hover);
  border-color: var(--accent-hover);
  box-shadow: none;
}
.contact-paper {
  background: var(--surface);
}
.chat-send,
.service-bottom a:hover {
  color: var(--on-accent);
}
.footer-signoff,
.testimonial-card {
  --bg: var(--inverse-bg);
  --surface: var(--inverse-surface);
  --raised: var(--neutral-charcoal);
  --text: var(--inverse-text);
  --muted: var(--inverse-muted);
  --line: var(--inverse-border);
  --accent-text: var(--inverse-accent);
  --gold: var(--accent-text);
  color: var(--text);
  background: var(--bg);
}
.footer-waves path {
  fill: var(--inverse-bg);
}
.footer-waves path:first-child {
  fill: var(--neutral-charcoal);
}
.footer-waves path:nth-child(2) {
  fill: var(--inverse-surface);
}

/* Cinematic full-width loops. The shared Motion switch is the only playback UI. */
.showcase-video {
  --video-gutter: clamp(16px, 2vw, 40px);
  width: calc(100vw - var(--video-gutter) - var(--video-gutter));
  max-width: none;
  margin-block: 36px 44px;
  margin-inline: calc(50% - 50vw + var(--video-gutter));
}
.showcase-video-frame {
  position: relative;
  width: 100%;
  aspect-ratio: 3.2 / 1;
  min-height: 260px;
  max-height: 680px;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: clamp(12px, 1.3vw, 24px);
  background: var(--surface);
  isolation: isolate;
}
.showcase-video-frame video,
.showcase-video-frame > img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 55%;
}
.showcase-video > figcaption {
  width: min(1180px, calc(100% - 32px));
  margin: 14px auto 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.7;
}
.project-screenshots-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-height: 44px;
  padding: 8px 2px;
  margin-top: 8px;
  color: var(--muted);
  background: transparent;
  font-size: 11px;
}
.project-screenshots-link:hover {
  color: var(--accent-text);
}
[data-velocity-marquee][data-scroll-visible="false"] {
  animation-play-state: paused !important;
}
@media (max-width: 767px) {
  .showcase-video-frame {
    aspect-ratio: 16 / 10;
    min-height: 0;
  }
}

/* The reference's simple four-card composition; no carousel or empty invitation. */
.testimonials-section {
  padding-block: clamp(72px, 9vw, 128px);
  scroll-margin-top: 104px;
}
.testimonials-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 40px;
}
.testimonials-heading h2 {
  font-size: clamp(42px, 5.4vw, 76px);
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: -0.065em;
}
.testimonial-sample-note {
  max-width: 30ch;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.7;
}
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  align-items: stretch;
}
.testimonials-grid > .motion-reveal {
  min-width: 0;
}
.testimonial-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 320px;
  padding: 24px 20px 22px;
  border-radius: 18px;
  border: 1px solid var(--line);
  transition: transform 0.35s var(--ease-editorial);
}
[data-motion="full"] .testimonial-card:hover {
  transform: translateY(-6px);
}
.testimonial-sample-label {
  margin-bottom: 16px;
  color: var(--neutral-silver);
  font-size: 8px;
  letter-spacing: 1.3px;
}
.testimonial-card blockquote {
  margin: 0;
  padding: 0;
  font-size: 15px;
  font-weight: 450;
  line-height: 1.55;
  letter-spacing: -0.045em;
  overflow-wrap: anywhere;
}
.testimonial-card figcaption {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: auto;
  padding-top: 36px;
}
.testimonial-avatar {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--neutral-charcoal);
  color: var(--neutral-silver);
  overflow: hidden;
}
.testimonial-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.testimonial-card strong {
  display: block;
  font-size: 11px;
  line-height: 1.5;
  font-weight: 550;
}
.testimonial-card small {
  display: block;
  margin-top: 3px;
  color: var(--neutral-silver);
  font-size: 10px;
  line-height: 1.5;
}
@media (max-width: 1023px) {
  .testimonials-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .testimonial-card {
    min-height: 280px;
  }
}
@media (max-width: 600px) {
  .testimonials-heading {
    display: block;
    margin-bottom: 28px;
  }
  .testimonial-sample-note {
    margin-top: 18px;
    max-width: 40ch;
  }
  .testimonials-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }
  .testimonial-card {
    min-height: 250px;
    padding: 24px;
  }
}
``````

## app/bots.css

``````css
.bots-heading {
  margin: 18px 0 30px;
}
.bots-heading h2 {
  max-width: 500px;
}
.bots-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 26px;
}
.bots-grid > div {
  min-width: 0;
  height: 100%;
}
.bot-card {
  --bot-accent: var(--accent-text);
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  border-radius: 13px;
  overflow: hidden;
  background: var(--surface);
  transition: transform 0.25s;
}
.bot-card:hover {
  border-color: color-mix(in srgb, var(--accent-text) 40%, transparent);
  transform: translateY(-3px);
}
.bot-card-support {
  --bot-accent: var(--accent-text);
}
.bot-card-booking {
  --bot-accent: var(--accent-text);
}
.bot-card-voice {
  --bot-accent: var(--accent-text);
}
.bot-card-top {
  position: relative;
  min-height: 172px;
  border-bottom: 1px solid var(--line);
  overflow: hidden;
  background: radial-gradient(ellipse at 50% 100%, color-mix(in srgb, var(--muted) 4.71%, transparent), transparent 70%);
}
.bot-art {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--bot-accent);
}
.bot-art > span {
  position: absolute;
  width: 90px;
  height: 90px;
  border-radius: 24px;
  background: var(--raised);
  border: 1px solid var(--line);
  transform: rotate(-9deg);
}
.bot-art > svg {
  position: relative;
}
.bot-art::before,
.bot-art::after {
  content: "";
  position: absolute;
  width: 190px;
  height: 190px;
  border: 1px solid var(--line);
  border-radius: 50%;
}
.bot-art::after {
  width: 280px;
  height: 280px;
  border-style: dashed;
  opacity: 0.55;
}
.bot-art i {
  position: absolute;
  left: 24%;
  top: 40%;
  width: 5px;
  height: 5px;
  background: var(--bot-accent);
  border-radius: 50%;
  opacity: 0.7;
}
.bot-art i:nth-last-child(2) {
  left: 75%;
  top: 70%;
  width: 4px;
  height: 4px;
}
.bot-art i:last-child {
  left: 65%;
  top: 20%;
  width: 3px;
  height: 3px;
}
.method-badge {
  position: absolute;
  top: 14px;
  right: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 6px 10px;
  color: var(--muted);
  font-size: 9px;
}
.bot-card-body {
  padding: 25px;
  display: flex;
  flex-direction: column;
  flex: 1;
}
.bot-card-body .eyebrow {
  font-size: 8px;
}
.bot-card-body h3 {
  font-size: 26px;
  letter-spacing: -0.8px;
  margin-top: 9px;
}
.bot-card-body > p:not(.eyebrow) {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
  margin-top: 12px;
}
.bot-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 20px 0 25px;
  padding: 0;
  list-style: none;
}
.bot-tags li {
  padding: 5px 8px;
  border: 1px solid var(--line);
  border-radius: 4px;
  color: var(--muted);
  font-size: 9px;
}
.bot-card-action {
  margin-top: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
  align-items: center;
}
.bot-card-action .button {
  min-height: 45px;
  font-size: 11px;
  gap: 20px;
}
.connection-pending {
  font-size: 9px;
  color: var(--muted);
}
.connection-pending::before {
  content: "";
  display: inline-block;
  width: 4px;
  height: 4px;
  background: var(--gold);
  border-radius: 50%;
  margin-right: 6px;
}
.bot-usage-note {
  display: flex;
  gap: 13px;
  margin: 25px 0 60px;
  padding: 18px;
  border: 1px solid var(--line);
  background: var(--soft);
  border-radius: 7px;
}
.bot-usage-note svg {
  flex-shrink: 0;
  color: var(--gold);
  margin-top: 3px;
}
.bot-usage-note p {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.9;
}
.bot-usage-note p span {
  font-size: 9px;
}
.embed-section {
  border-top: 1px solid var(--line);
  padding-top: 50px;
}
.embed-section h3 {
  font-size: 32px;
  letter-spacing: -1px;
  margin-top: 12px;
}
.embed-intro {
  max-width: 600px;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
  margin-top: 15px;
}
.embed-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 30px;
}
.embed-card {
  min-width: 0;
  padding: 22px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
}
.embed-number {
  color: var(--gold);
  font-size: 10px;
}
.embed-card h4 {
  font-family: var(--font-space), sans-serif;
  font-weight: 500;
  font-size: 19px;
  letter-spacing: -0.5px;
  margin: 18px 0 10px;
}
.embed-card > p {
  min-height: 63px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.9;
}
.embed-card pre {
  padding: 15px;
  margin: 20px 0;
  background: var(--bg);
  border: 1px solid color-mix(in srgb, var(--text) 7.06%, transparent);
  border-radius: 6px;
  color: var(--text);
  overflow-x: auto;
  font-size: 9px;
  line-height: 1.9;
  min-height: 240px;
}
.embed-card h5 {
  margin: 10px 0 8px;
  font-size: 10px;
  font-weight: 500;
  color: var(--text);
}
.embed-card > ul {
  padding-left: 15px;
  margin: 0 0 10px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.9;
}
.embed-used {
  padding-top: 17px;
  margin-top: auto;
  border-top: 1px solid var(--line);
}
.embed-used .eyebrow {
  font-size: 7px;
  letter-spacing: 1.5px;
}
.embed-used p {
  font-size: 10px;
  color: var(--muted);
  line-height: 1.9;
  margin-top: 7px;
}
.chat-dialog {
  inset: 0;
  width: 100%;
  max-width: none;
  height: 100dvh;
  max-height: none;
  margin: 0;
  padding: 22px;
  border: 0;
  background: transparent;
  color: var(--text);
  overflow: hidden;
}
.chat-dialog[open] {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.chat-dialog::backdrop {
  background: color-mix(in srgb, var(--neutral-black) 66.67%, transparent);
  backdrop-filter: blur(12px);
}
.chat-panel {
  display: flex;
  flex-direction: column;
  width: min(570px, 100%);
  height: 100%;
  max-height: 950px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 17px;
  box-shadow: 0 30px 100px color-mix(in srgb, var(--neutral-black) 37.65%, transparent);
  overflow: hidden;
}
.chat-header {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 19px 20px;
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}
.chat-avatar {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--accent-text) 6.27%, transparent);
  color: var(--gold);
  border: 1px solid color-mix(in srgb, var(--accent-text) 15.69%, transparent);
  flex-shrink: 0;
}
.chat-header .eyebrow {
  font-size: 8px;
  letter-spacing: 1px;
}
.chat-header h2 {
  font-size: 20px;
  letter-spacing: -0.6px;
  margin-top: 3px;
}
.chat-header-actions {
  display: flex;
  margin-left: auto;
}
.chat-header-actions .icon-button:disabled {
  opacity: 0.35;
}
.chat-note {
  padding: 12px 20px;
  font-size: 10px;
  line-height: 1.8;
  background: var(--soft);
  color: var(--muted);
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}
.chat-messages {
  flex: 1;
  min-height: 80px;
  overflow-y: auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  overscroll-behavior: contain;
}
.message {
  max-width: 88%;
  padding: 13px 16px;
  border-radius: 13px;
  border: 1px solid var(--line);
  flex-shrink: 0;
  overflow-wrap: anywhere;
}
.message-assistant {
  background: var(--raised);
  align-self: flex-start;
  border-top-left-radius: 3px;
}
.message-user {
  background: color-mix(in srgb, var(--accent-text) 6.67%, transparent);
  border-color: color-mix(in srgb, var(--accent-text) 14.9%, transparent);
  align-self: flex-end;
  border-top-right-radius: 3px;
}
.message-author {
  display: block;
  font-size: 9px;
  font-weight: 500;
  color: var(--gold);
  margin-bottom: 7px;
}
.message p {
  font-size: 12px;
  line-height: 1.9;
  white-space: pre-wrap;
}
.message-user .message-author {
  color: var(--muted);
}
.typing-indicator {
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 4px 6px;
  color: var(--muted);
  font-size: 10px;
}
.typing-indicator span {
  margin-right: 5px;
}
.typing-indicator i {
  width: 4px;
  height: 4px;
  background: var(--gold);
  border-radius: 50%;
  animation: chat-pulse 1s ease-in-out infinite;
}
.typing-indicator i:nth-last-child(2) {
  animation-delay: 0.15s;
}
.typing-indicator i:last-child {
  animation-delay: 0.3s;
}
@keyframes chat-pulse {
  50% {
    transform: translateY(-3px);
    opacity: 0.3;
  }
}
.chat-compose {
  flex-shrink: 0;
  padding: 16px 20px 20px;
  border-top: 1px solid var(--line);
}
.chat-starters {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 13px;
}
.chat-starters button {
  text-align: left;
  font-size: 10px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  background: var(--soft);
  border-radius: 6px;
  color: var(--muted);
}
.chat-starters button:hover {
  color: var(--text);
  border-color: var(--gold);
}
.chat-input-row {
  display: flex;
  align-items: flex-end;
  gap: 7px;
  padding: 9px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--bg);
}
.chat-input-row:focus-within {
  border-color: var(--gold);
}
.chat-input-row textarea {
  flex: 1;
  width: 100%;
  min-width: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: var(--text);
  resize: none;
  font: inherit;
  font-size: 14px;
  line-height: 1.6;
  padding: 5px;
  max-height: 120px;
}
.chat-input-row textarea:focus-visible {
  outline: none;
}
.chat-input-row textarea::placeholder {
  color: var(--muted);
}
.chat-send {
  width: 39px;
  height: 39px;
  border-radius: 7px;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  background: var(--accent);
  color: var(--text);
}
.chat-send:disabled {
  opacity: 0.4;
}
.chat-input-meta {
  font-size: 8px;
  color: var(--muted);
  text-align: right;
  padding-top: 7px;
}
.chat-privacy {
  font-size: 8px;
  line-height: 1.8;
  color: var(--muted);
  margin-top: 10px;
}
.chat-error {
  padding: 9px 11px;
  border-radius: 6px;
  border: 1px solid color-mix(in srgb, var(--accent-text) 31.37%, transparent);
  background: color-mix(in srgb, var(--accent-text) 4.71%, transparent);
  color: var(--text);
  font-size: 11px;
  line-height: 1.8;
  margin-bottom: 12px;
}
.chat-small-note {
  font-size: 10px;
  line-height: 1.8;
  color: var(--muted);
}
.voice-controls {
  margin-bottom: 10px;
}
.voice-playback {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.voice-playback label {
  display: flex;
  gap: 9px;
  align-items: center;
  font-size: 10px;
  color: var(--muted);
}
.voice-playback input {
  accent-color: var(--accent-text);
  width: 15px;
  height: 15px;
}
.voice-playback .icon-button {
  width: 32px;
  height: 32px;
}
.voice-playback button:disabled {
  opacity: 0.35;
}
.voice-fallback {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.8;
  margin-bottom: 10px;
}
.voice-status {
  color: var(--gold);
  font-size: 10px;
  line-height: 1.8;
  margin-block: 8px;
}
.mic-button {
  width: 39px;
  height: 39px;
  border-radius: 7px;
}
.mic-button:disabled {
  opacity: 0.35;
}
.mic-button.listening {
  background: color-mix(in srgb, var(--accent-text) 12.55%, transparent);
  color: var(--text);
}
.chat-unconfigured {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 35px;
  flex: 1;
  gap: 20px;
}
.chat-unconfigured > svg {
  color: var(--gold);
}
.chat-unconfigured h3 {
  font-size: 28px;
  letter-spacing: -1px;
}
.chat-unconfigured p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
  max-width: 360px;
}
.external-chat {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}
.external-chat iframe {
  width: 100%;
  flex: 1;
  min-height: 0;
  border: 0;
  background: var(--bg);
}
.external-chat > p:last-child {
  font-size: 10px;
  line-height: 1.8;
  color: var(--muted);
  padding: 12px 20px;
}
.embed-loading {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 12px 20px;
  font-size: 11px;
  color: var(--muted);
}
@media (max-width: 1023px) {
  .embed-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .embed-card pre {
    min-height: 0;
    font-size: 11px;
  }
  .embed-card > p {
    min-height: 0;
  }
}
@media (max-width: 700px) {
  .bots-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .bot-card-body {
    padding: 22px;
  }
  .bots-heading {
    margin-top: 28px;
  }
  .bot-usage-note {
    margin-bottom: 40px;
  }
  .bot-usage-note p {
    font-size: 9px;
  }
  .embed-section {
    padding-top: 35px;
  }
  .embed-section h3 {
    font-size: 28px;
  }
  .chat-dialog {
    padding: 0;
  }
  .chat-panel {
    width: 100%;
    max-height: none;
    border: none;
    border-radius: 0;
  }
  .chat-header {
    padding: 14px;
    gap: 10px;
  }
  .chat-header h2 {
    font-size: 18px;
  }
  .chat-header-actions .icon-button {
    width: 37px;
    height: 40px;
  }
  .chat-header .eyebrow {
    font-size: 7px;
  }
  .chat-note {
    padding: 10px 14px;
    font-size: 9px;
  }
  .chat-messages {
    padding: 18px 14px;
    gap: 13px;
  }
  .message {
    max-width: 92%;
    padding: 11px 13px;
  }
  .message p {
    font-size: 12px;
  }
  .chat-compose {
    padding: 12px 14px max(12px, env(safe-area-inset-bottom));
  }
  .chat-input-row textarea {
    font-size: 16px;
  }
  .chat-starters button {
    font-size: 9px;
  }
  .chat-privacy {
    font-size: 8px;
    margin-top: 8px;
  }
  .voice-controls {
    margin-bottom: 5px;
  }
}
@media (max-height: 600px) {
  .chat-note,
  .chat-starters,
  .chat-privacy {
    display: none;
  }
  .chat-header {
    padding-block: 8px;
  }
  .chat-compose {
    padding-block: 8px;
  }
  .chat-panel {
    min-height: 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .bot-card,
  html:not([data-motion="full"]) .typing-indicator i {
    animation: none;
    transition: none;
  }
}
html[data-motion="reduced"] .bot-card,
html[data-motion="reduced"] .typing-indicator i {
  animation: none;
  transition: none;
}

.bot-loading {
  padding: 60px 20px;
  min-height: 220px;
  color: var(--muted);
  font-size: 12px;
  text-align: center;
}
.bot-card-real {
  position: relative;
}
.bots-grid > div:has(.bot-card-real) {
  grid-column: 1 / -1;
}
@media (min-width: 701px) {
  .bot-card-real {
    display: grid;
    grid-template-columns: 1.05fr 1fr;
  }
  .bot-card-real .bot-card-body {
    justify-content: center;
    padding: 38px;
  }
  .bot-card-real .bot-card-action {
    margin-top: 10px;
  }
}
@media (min-width: 1024px) {
  .bots-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .bot-card-real .bot-card-body h3 {
    font-size: 34px;
  }
}
.forte-card-hitarea {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  border: 0;
  border-radius: inherit;
  z-index: 3;
  cursor: pointer;
}
.forte-card-hitarea:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: -4px;
}
.bot-card-top.forte-card-top {
  height: auto;
  padding: 16px 16px 12px;
  display: block;
  background: radial-gradient(ellipse at 50% 30%, color-mix(in srgb, var(--muted) 6.27%, transparent), transparent 70%);
}
.forte-card-top .method-badge {
  position: static;
  display: inline-flex;
  margin: 12px 0 0;
}
.forte-preview {
  color: var(--text);
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 15px;
  overflow: hidden;
  text-align: left;
  box-shadow: 0 12px 35px color-mix(in srgb, var(--neutral-black) 12.55%, transparent);
  transition: transform 0.5s;
}
.bot-card-real:hover .forte-preview {
  transform: translateY(-3px);
}
.forte-preview-header {
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 14px 12px;
  border-bottom: 1px solid var(--line);
}
.forte-preview-header > svg {
  flex-shrink: 0;
  color: var(--text);
}
.forte-preview-header > div {
  min-width: 0;
  margin-right: auto;
}
.forte-preview-header strong {
  display: block;
  font-size: 10px;
  font-weight: 500;
  line-height: 1.5;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.forte-preview-header > div > span {
  display: block;
  font-size: 8px;
  color: var(--muted);
  line-height: 1.6;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 280px;
}
.forte-preview-mark {
  font-family: Georgia, serif;
  font-size: 10px;
  font-weight: 700;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 5px;
  padding: 7px 4px;
  letter-spacing: -0.5px;
}
.forte-preview-body {
  min-height: 175px;
  padding: 20px 18px 24px;
}
.forte-preview-label {
  display: block;
  font-size: 6px;
  letter-spacing: 1.6px;
  color: var(--muted);
  margin-bottom: 12px;
}
.forte-preview-body > strong {
  font-size: 23px;
  font-weight: 600;
  line-height: 1.25;
  letter-spacing: -0.7px;
  display: block;
  max-width: 350px;
}
.forte-preview-body > p {
  color: var(--accent-text);
  font-size: 12px;
  line-height: 1.6;
  margin-top: 9px;
  max-width: 340px;
}
.forte-preview-invitation {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  margin-top: 20px;
  color: var(--accent-text);
  font-size: 9px;
}
.forte-preview-composer {
  margin: 0 12px;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 11px 12px;
  background: var(--surface);
  box-shadow: 0 2px 4px color-mix(in srgb, var(--neutral-black) 2.35%, transparent);
  color: var(--accent-text);
  font-size: 10px;
}
.forte-preview-composer > div {
  display: flex;
  gap: 13px;
  margin-top: 16px;
  color: var(--muted);
}
.forte-preview-powered {
  padding: 8px 12px;
  color: var(--accent-text);
  font-size: 7px;
  text-align: center;
}
@media (max-width: 700px) {
  .forte-preview-header > div > span {
    max-width: 160px;
  }
  .forte-preview-body > strong {
    font-size: 22px;
  }
  .bot-card-top.forte-card-top {
    padding: 12px;
  }
  .forte-preview-header {
    gap: 7px;
    padding: 12px 9px;
  }
  .forte-preview-header > svg:last-child {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .forte-preview {
    transition: none;
  }
  html:not([data-motion="full"]) .bot-card-real:hover .forte-preview {
    transform: none;
  }
}
html[data-motion="reduced"] .bot-card-real:hover .forte-preview {
  transform: none;
}
html[data-motion="reduced"] .forte-preview {
  transition: none;
}
``````

## app/bunch-of-work/page.tsx

``````tsx
import { WorkBunch } from "@/components/work-bunch";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getProjects } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("collection");

export default async function Page() {
  const projects = await getProjects();
  return (
    <SiteShell page="collection">
      <WorkBunch standalone projects={projects} />
    </SiteShell>
  );
}
``````

## app/certificates/page.tsx

``````tsx
import { Certifications } from "@/components/certifications";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getCertificates } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("certificates");

export default async function Page() {
  const certificates = await getCertificates();
  return (
    <SiteShell page="certificates">
      <Certifications certificates={certificates} />
    </SiteShell>
  );
}
``````

## app/contact/page.tsx

``````tsx
import { Contact } from "@/components/contact";
import { FaqSection } from "@/components/faq-section";
import { SiteShell } from "@/components/site-shell";
import { getIdentity, getFaqs } from "@/lib/content-loader";
import { pageMetadata } from "@/lib/page-metadata";
export const dynamic = "force-dynamic";
export const metadata = pageMetadata("contact");
export default async function Page() {
  const [identity, faqs] = await Promise.all([getIdentity(), getFaqs()]);
  return (
    <SiteShell page="contact">
      <Contact email={identity.email} />
      <FaqSection faqs={faqs} />
    </SiteShell>
  );
}
``````

## app/cookies/page.tsx

``````tsx
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = {
  title: "Cookie Policy — Elvora",
  alternates: { canonical: "/cookies" },
};
export default function Page() {
  return <LegalPage page="cookies" />;
}
``````

## app/demo/[slug]/page.tsx

``````tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { demos, type DemoSlug } from "@/data/demos";
import { DemoSite } from "@/components/demo-site";
import { concepts, type ConceptSlug } from "@/data/concepts";
import { ConceptSite } from "@/components/concept-site";
import { DemoWindow } from "@/components/demo-window";
import "../../demo-window.css";
import "../demo.css";
import "../concepts.css";
export const dynamic = "force-dynamic";
export function generateStaticParams() {
  return [...Object.keys(concepts), ...Object.keys(demos)].map((slug) => ({
    slug,
  }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const demo =
    concepts[(await params).slug as ConceptSlug] ||
    demos[(await params).slug as DemoSlug];
  return {
    title: demo ? `${demo.name} — Elvora concept` : "Concept not found",
    description: demo?.intro,
    alternates: { canonical: `/demo/${(await params).slug}` },
  };
}
export default async function DemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (Object.hasOwn(concepts, (await params).slug))
    return (
      <DemoWindow title={concepts[(await params).slug as ConceptSlug].name}>
        <ConceptSite slug={(await params).slug as ConceptSlug} />
      </DemoWindow>
    );
  if (!Object.hasOwn(demos, (await params).slug)) notFound();
  return (
    <DemoWindow title={demos[(await params).slug as DemoSlug].name}>
      <DemoSite slug={(await params).slug as DemoSlug} />
    </DemoWindow>
  );
}
``````

## app/demo/concepts.css

``````css
.concept-site{--c-bg:#f7f4ed;--c-ink:#313b32;--c-muted:#62685f;--c-accent:#9e7650;--c-line:#313b3226;--c-card:#f0ece2;background:var(--c-bg);color:var(--c-ink);min-height:100vh;overflow:clip;color-scheme:light;font-size:14px}
.concept-site :focus-visible{outline:2px solid var(--c-ink);outline-offset:5px}
.concept-site h1,.concept-site h2,.concept-site h3{color:var(--c-ink);font-weight:400}
.concept-site h1,.concept-site h2{font-family:Georgia,'Times New Roman',serif;letter-spacing:-.055em}
.concept-site h1{font-size:clamp(58px,6.9vw,106px);line-height:.99;margin:24px 0}
.concept-site h1 span{display:block}
.concept-site h2{font-size:clamp(38px,4.2vw,64px);line-height:1.07;letter-spacing:-.045em}
.concept-site h3{font-size:25px;font-family:Georgia,serif;letter-spacing:-.5px}
.concept-site a,.concept-site button{transition:background .25s,color .25s,border-color .25s,transform .25s}
.concept-ribbon{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:10px 4.5%;background:var(--c-ink);color:var(--c-bg);font-size:8px;letter-spacing:1.1px;min-height:34px}
.concept-ribbon a{display:inline-flex;align-items:center;gap:8px;letter-spacing:0;font-size:10px}
.concept-ribbon>span:last-child{font-size:7px;opacity:.75}
.concept-header{position:relative;display:flex;align-items:center;gap:35px;padding:25px 5%;border-bottom:1px solid var(--c-line);min-height:96px;background:var(--c-bg);z-index:5}
.concept-logo{font-family:Georgia,serif;font-size:37px;letter-spacing:-2px;display:inline-flex;align-items:center;gap:7px;line-height:1}
.concept-logo small{font:8px var(--font-inter),sans-serif;letter-spacing:2px;margin-left:10px;max-width:110px;line-height:1.5}
.concept-nav{display:flex;align-items:center;gap:32px;margin-left:auto;font-size:11px}
.concept-nav a:hover{color:var(--c-accent)}
.concept-header-action{display:inline-flex;align-items:center;gap:20px;font-size:10px;padding:13px 18px;border:1px solid var(--c-line)}
.concept-header-action:hover{background:var(--c-ink);color:var(--c-bg)}
.concept-menu{display:none;background:none;padding:8px;color:var(--c-ink)}
.concept-hero{position:relative;isolation:isolate}
.concept-hero-background{position:absolute;inset:0;z-index:-1;background:#343b3a}
.concept-hero-background>img{object-fit:cover}
.concept-hero-shade{position:absolute;inset:0;background:linear-gradient(90deg,#11241c88,transparent 80%),linear-gradient(0deg,#10221788,transparent 45%)}
.concept-hero-copy{padding:90px 6%;position:relative}
.concept-kicker{font-size:8px;line-height:1.8;letter-spacing:2.2px;text-transform:uppercase}
.concept-intro{font-size:13px;line-height:1.9;max-width:350px;margin-top:22px}
.concept-actions{display:flex;align-items:center;gap:25px;flex-wrap:wrap;margin-top:33px}
.concept-primary,.concept-secondary{display:inline-flex;align-items:center;justify-content:space-between;gap:25px;font-size:11px;line-height:1.5;padding:15px 20px;min-height:46px}
.concept-primary{background:var(--c-ink);color:var(--c-bg);border:1px solid var(--c-ink)}
.concept-primary:hover{transform:translateY(-2px);background:var(--c-accent);border-color:var(--c-accent);color:#fff}
.concept-secondary{padding-inline:0;border-bottom:1px solid currentColor;min-height:38px}
.concept-secondary:hover{gap:32px}
.concept-hero-caption{display:flex;justify-content:space-between;gap:20px;padding:22px 6%;font-size:8px;letter-spacing:1.8px;border-top:1px solid #ffffff30}
.concept-section{padding:85px 6%}
.concept-section-heading{display:grid;grid-template-columns:1fr 1fr;gap:20px 70px;align-items:end}
.concept-section-heading>.concept-kicker{grid-column:1/-1}
.concept-section-heading>p:last-child{color:var(--c-muted);max-width:400px;font-size:12px;line-height:1.9;padding-bottom:5px}
.concept-filters{display:flex;gap:8px;flex-wrap:wrap;margin:35px 0 30px}
.concept-filters button{padding:11px 18px;background:none;border:1px solid var(--c-line);color:var(--c-ink);font-size:10px;display:flex;align-items:center;gap:25px;min-height:42px}
.concept-filters [aria-pressed=true]{background:var(--c-ink);color:var(--c-bg);border-color:var(--c-ink)}
.concept-item-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.concept-item{border:1px solid var(--c-line);background:var(--c-bg);min-width:0}
.concept-item-copy{padding:25px}
.concept-item-copy>.concept-kicker{font-size:7px;color:var(--c-muted);margin-bottom:14px}
.concept-item-copy>p:not(.concept-kicker){font-size:10px;color:var(--c-muted);line-height:1.9;margin-top:13px}
.concept-item-copy>div{display:flex;justify-content:space-between;align-items:center;gap:10px;border-top:1px solid var(--c-line);margin-top:25px;padding-top:16px;font-size:10px}
.concept-item-copy button{display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--c-line);border-radius:50%;background:none;color:var(--c-ink)}
.concept-item-copy button:hover{background:var(--c-ink);color:var(--c-bg);transform:rotate(7deg)}
.room-plan{position:relative;background:#eae4d8;color:#655746;aspect-ratio:1.6;border-bottom:1px solid var(--c-line)}
.room-plan svg{width:100%;height:100%;display:block}
.room-plan>span{position:absolute;bottom:14px;left:20px;font-size:7px;letter-spacing:1.8px;text-transform:uppercase}
.concept-feature{display:grid;grid-template-columns:1fr 1fr;padding-top:0;padding-bottom:90px;gap:0}
.concept-feature-art{position:relative;min-height:490px;background:var(--c-card);overflow:hidden}
.concept-feature-art>img{object-fit:cover;object-position:25% center;transition:scale .8s}
.concept-feature-art:hover>img{scale:1.03}
.concept-feature-art>span{position:absolute;bottom:23px;left:25px;right:25px;color:#fff;font-size:7px;letter-spacing:1.5px;text-shadow:0 1px 8px #000;background:#00000040;padding:8px 10px;width:fit-content}
.concept-feature-copy{padding:55px 12%;background:var(--c-card);display:flex;flex-direction:column;justify-content:center;align-items:flex-start}
.concept-feature-copy h2{font-size:clamp(36px,3.2vw,49px);margin-top:22px}
.concept-feature-copy>p:not(.concept-kicker){font-size:11px;color:var(--c-muted);line-height:1.95;margin-top:24px}
.concept-feature-copy ol{list-style:none;padding:0;margin:25px 0 15px;width:100%}
.concept-feature-copy li{display:flex;align-items:center;gap:18px;padding:15px 0;border-top:1px solid var(--c-line);font-size:10px;line-height:1.5}
.concept-feature-copy li>span{font-size:8px;color:var(--c-muted)}
.concept-feature-copy li>svg{margin-left:auto;flex-shrink:0}
.concept-feature-copy>.concept-secondary{margin-top:10px}
.concept-planner{display:grid;grid-template-columns:1fr 1fr;gap:70px;border-top:1px solid var(--c-line);padding-top:70px;padding-bottom:80px}
.concept-planner h2{font-size:clamp(36px,3.5vw,55px);margin-top:20px}
.concept-planner>div>p:not(.concept-kicker){font-size:11px;color:var(--c-muted);line-height:1.9;max-width:400px;margin-top:22px}
.concept-plan-form{padding:30px;background:var(--c-card);align-self:start;border:1px solid var(--c-line)}
.concept-form-fields{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
.concept-form-fields>label{display:flex;flex-direction:column;gap:10px;font-size:10px;min-width:0}
.concept-form-fields input,.concept-form-fields select{width:100%;min-width:0;min-height:46px;background:var(--c-bg);border:1px solid var(--c-line);padding:12px;color:var(--c-ink);border-radius:0;font:11px var(--font-inter),sans-serif}
.concept-plan-form>.concept-primary{margin-top:25px;width:100%}
.concept-form-error{color:#992a20;font-size:11px;margin-top:16px;line-height:1.8}
.concept-summary{margin-top:24px;padding:20px;border:1px solid var(--c-line);background:var(--c-bg);font-size:11px;line-height:1.8}
.concept-summary>.concept-kicker{display:block;font-size:7px;letter-spacing:1px;margin-bottom:10px}
.concept-summary strong{display:block;font-weight:500;margin-top:8px}
.concept-summary button{background:none;color:var(--c-ink);padding:8px 0;border-bottom:1px solid var(--c-line);display:flex;align-items:center;gap:15px;font-size:10px;margin-top:15px}
.concept-footer{padding:45px 6% 25px;background:var(--c-ink);color:var(--c-bg)}
.concept-footer>div{display:flex;justify-content:space-between;align-items:center;gap:35px}
.concept-footer p{max-width:440px;font-size:10px;line-height:1.8;opacity:.8}
.concept-footer>div+div{border-top:1px solid #ffffff26;margin-top:35px;padding-top:22px;align-items:start;font-size:8px;line-height:1.8;gap:30px}
.concept-footer>div+div>span{max-width:500px;opacity:.75}
.concept-footer>div+div>a{display:flex;align-items:center;gap:12px;white-space:nowrap}
/* Solenne: warm hospitality, editorial serif, a cinematic coastal hero. */
.concept-solenne{--c-bg:#f7f4ec;--c-ink:#3a4237;--c-muted:#595f53;--c-accent:#776042;--c-card:#ebe8dd}
.concept-solenne .concept-logo{font-size:42px;font-style:italic}
.concept-solenne .concept-hero{color:#fff9ef;min-height:660px;display:flex;flex-direction:column;justify-content:space-between}
.concept-solenne .concept-hero h1{color:#fff9ef;font-size:clamp(65px,7.2vw,108px);max-width:770px}
.concept-solenne .concept-hero h1 span:last-child{font-style:italic;font-weight:400}
.concept-solenne .concept-hero-copy{padding-top:80px;padding-bottom:55px}
.concept-solenne .concept-hero .concept-primary{background:#fff8eb;color:#363b30;border-color:#fff8eb}
.concept-solenne .concept-hero .concept-secondary{color:#fff9ef}
.concept-solenne .concept-intro{max-width:330px;text-shadow:0 1px 10px #132419}
.concept-solenne .concept-collection{background:var(--c-bg)}
.concept-solenne .concept-filters button{border-radius:50px}
.concept-solenne .concept-planner{background:#e9e6db}
.concept-solenne .concept-plan-form{background:#f4f1e8}
/* Vanta: technical, dark, angular and deliberately high contrast. */
.concept-vanta{--c-bg:#0f1413;--c-ink:#eff2e9;--c-muted:#a4afa6;--c-accent:#c5ed54;--c-card:#17201d;--c-line:#e3edd42b;color-scheme:dark}
.concept-vanta .concept-ribbon{background:#c5ed54;color:#172013}
.concept-vanta .concept-logo{font-family:var(--font-space),sans-serif;font-size:30px;letter-spacing:5px;font-weight:600}
.concept-vanta .concept-header-action{border-color:#c5ed5466;color:#d0ed86}
.concept-vanta .concept-header-action:hover{background:#c5ed54;color:#182010}
.concept-vanta h1,.concept-vanta h2,.concept-vanta h3{font-family:var(--font-space),sans-serif;font-weight:500;letter-spacing:-.055em}
.concept-vanta .concept-hero{min-height:650px;display:flex;flex-direction:column;justify-content:space-between}
.concept-vanta .concept-hero-background>img{object-position:65% 50%}
.concept-vanta .concept-hero-shade{background:linear-gradient(90deg,#060b0bd9,transparent 80%),linear-gradient(0deg,#080f0fcc,transparent 40%)}
.concept-vanta .concept-hero-copy{padding-top:65px;padding-bottom:35px}
.concept-vanta h1{font-size:clamp(58px,6.5vw,97px);line-height:1.01;max-width:700px}
.concept-vanta h1 span:last-child{color:#d1ed86}
.concept-vanta .concept-intro{max-width:310px;color:#d4dbd2}
.concept-vanta .concept-kicker{color:#c5ed84}
.concept-vanta .concept-primary{background:#c5ed54;color:#172013;border-color:#c5ed54}
.concept-vanta .concept-primary:hover{background:#e4ff9a;color:#172013}
.concept-vanta .concept-filters button{min-width:120px;justify-content:space-between}
.concept-vanta .concept-filters [aria-pressed=true]{background:#c5ed54;color:#172013;border-color:#c5ed54}
.vanta-config-preview{display:grid;grid-template-columns:1.3fr 1fr;min-height:350px;border:1px solid var(--c-line);background:radial-gradient(ellipse at 20% 50%,#c5ed5409,transparent 65%)}
.vanta-drawing{display:flex;flex-direction:column;justify-content:center;position:relative;padding:25px;min-width:0}
.vanta-drawing svg{display:block;width:100%;height:auto}
.vanta-drawing>span{position:absolute;bottom:25px;left:30px;font-size:8px;letter-spacing:2px;text-transform:uppercase;color:var(--c-muted)}
.vanta-model-copy{padding:45px 40px;border-left:1px solid var(--c-line)}
.vanta-model-copy h3{font-size:36px;margin-top:12px}
.vanta-model-copy>p:not(.concept-kicker){font-size:11px;color:var(--c-muted);margin-top:12px;line-height:1.8}
.vanta-model-copy dl{display:flex;flex-wrap:wrap;gap:25px;margin:25px 0}
.vanta-model-copy dt{font-size:8px;color:var(--c-muted);margin-bottom:8px}
.vanta-model-copy dd{font-size:23px;font-family:var(--font-space),sans-serif;margin:0;letter-spacing:-1px}
.concept-vanta .concept-feature-art>img{object-position:75% center}
.concept-vanta .concept-planner{background:#151d19}
.concept-vanta .concept-form-fields{grid-template-columns:1fr}
.vanta-finishes{border:0;padding:0;margin:0;display:flex;gap:15px;flex-wrap:wrap}
.vanta-finishes legend{font-size:10px;margin-bottom:13px}
.vanta-finishes label{position:relative;display:flex;align-items:center;gap:9px;font-size:10px;cursor:pointer;padding:7px 0}
.vanta-finishes input{position:absolute;width:1px;height:1px;opacity:0;min-height:0;padding:0}
.finish-swatch{display:grid;place-items:center;width:26px;height:26px;border:1px solid #d2dbc666;border-radius:50%;color:#fff;text-shadow:0 0 3px #000}
.vanta-finishes input:checked+.finish-swatch{outline:1px solid #c5ed54;outline-offset:3px}
.vanta-finishes input:focus-visible+.finish-swatch{outline:2px solid #fff;outline-offset:4px}
.concept-vanta .concept-form-error{color:#ffbfb2}
.concept-vanta .concept-footer{background:#080d0b;color:#eff2e9}
/* Aster: a softer, accessible care journey with a rounded visual language. */
.concept-aster{--c-bg:#f8fbf7;--c-ink:#244c40;--c-muted:#576e61;--c-accent:#365e4d;--c-card:#e9f0e8;--c-line:#244c4026}
.concept-aster .concept-logo{font-family:var(--font-space),sans-serif;font-size:35px;font-weight:500;letter-spacing:-2px}
.aster-mark{font-size:40px;line-height:.7;font-weight:400;display:inline-block;margin-right:3px}
.concept-aster .concept-header-action,.concept-aster .concept-primary{border-radius:50px}
.concept-aster .concept-hero{display:grid;grid-template-columns:1fr 1fr;gap:50px;padding:45px 6% 65px;align-items:center;background:linear-gradient(120deg,#f8fbf7,#edf4ec)}
.concept-aster .concept-hero-copy{padding:35px 0}
.concept-aster h1{font-size:clamp(58px,5.9vw,84px);line-height:1.04}
.concept-aster h1 span:last-child{font-style:italic}
.concept-aster .concept-intro{max-width:345px;color:var(--c-muted)}
.concept-aster .concept-hero-picture{position:relative;min-height:550px;border-radius:150px 30px 30px 30px;overflow:hidden}
.concept-aster .concept-hero-picture img{object-fit:cover;object-position:60% center}
.concept-hero-picture>span{position:absolute;inset:auto 20px 20px;display:flex;justify-content:space-between;align-items:center;gap:18px;background:#f8fbf7e8;color:#244c40;padding:17px 20px;font-size:8px;letter-spacing:1.2px;backdrop-filter:blur(12px)}
.concept-aster .concept-section-heading h2{max-width:500px}
.concept-aster .concept-filters button{border-radius:50px}
.concept-aster .concept-item{border-radius:20px;overflow:hidden}
.care-symbol{padding:30px 30px 15px;display:flex;justify-content:space-between;align-items:start}
.care-symbol>svg{padding:17px;width:70px;height:70px;border-radius:50%;background:var(--c-card)}
.care-symbol>span{font-size:10px;color:var(--c-muted);padding-top:10px}
.concept-aster .concept-item-copy{padding:15px 30px 30px}
.concept-aster .concept-item-copy h3{font-size:29px}
.concept-aster .concept-feature-art{border-radius:30px 0 0 30px}
.concept-aster .concept-feature-copy{border-radius:0 30px 30px 0}
.concept-aster .concept-plan-form{border-radius:20px}
.concept-aster .concept-form-fields input,.concept-aster .concept-form-fields select{border-radius:10px}
.concept-aster .concept-summary{border-radius:12px}
/* Kovo: a mineral editorial grid, architectural studies and terracotta details. */
.concept-kovo{--c-bg:#eae5db;--c-ink:#35342f;--c-muted:#56534c;--c-accent:#984f36;--c-card:#ddd6c8;--c-line:#35342f33}
.concept-kovo .concept-header{padding-block:28px}
.concept-kovo .concept-logo{font-family:var(--font-space),sans-serif;font-size:40px;letter-spacing:-3px;font-weight:600;gap:25px}
.concept-kovo .concept-logo small{margin-left:0;font-size:7px;letter-spacing:1.4px}
.concept-kovo .concept-header-action{border:none;border-bottom:1px solid var(--c-ink);padding-inline:0}
.concept-kovo h1,.concept-kovo h2,.concept-kovo h3{font-family:var(--font-space),sans-serif;letter-spacing:-.065em;font-weight:400}
.concept-kovo .concept-hero{padding:0 6% 35px}
.concept-kovo .concept-hero-copy{display:grid;grid-template-columns:.7fr 1.5fr;gap:15px 65px;padding:55px 0 40px;align-items:start}
.concept-kovo .concept-hero-copy h1{grid-column:2;grid-row:1/4;font-size:clamp(58px,7vw,100px);margin:0;line-height:1.02}
.concept-kovo .concept-hero-copy>.concept-kicker{grid-column:1;font-size:7px;letter-spacing:1.5px}
.concept-kovo .concept-intro{grid-column:1;margin:0;font-size:11px;max-width:265px}
.concept-kovo .concept-actions{grid-column:1;gap:12px;margin:0}
.concept-kovo .concept-actions .concept-primary{padding:0;background:none;color:var(--c-ink);border:none;border-bottom:1px solid var(--c-ink);min-height:35px}
.concept-kovo .concept-actions .concept-secondary{display:none}
.concept-kovo .concept-hero-picture{position:relative;height:415px;overflow:hidden}
.concept-kovo .concept-hero-picture img{object-fit:cover;object-position:center 60%}
.concept-kovo .concept-hero-picture>span{inset:auto 0 0;background:#35342fc9;color:#f4eee3;backdrop-filter:none}
.concept-kovo .concept-collection{border-top:1px solid var(--c-line);padding-top:70px}
.concept-kovo .concept-section-heading{grid-template-columns:1.3fr 1fr}
.concept-kovo .concept-item{border:none;border-top:1px solid var(--c-line);padding-top:12px}
.space-study{position:relative;aspect-ratio:1.5;background:#dad4c8;color:#665d4a;overflow:hidden}
.space-study-1{background:#c7c7b9}.space-study-2{background:#dfc5b4}
.space-study svg{display:block;width:100%;height:100%;transition:transform .6s}
.concept-item:hover .space-study svg{transform:translateY(-4px)}
.space-study>span{color:#504a3d;position:absolute;bottom:14px;left:18px;font-size:8px;letter-spacing:1px}
.concept-kovo .concept-item-copy{padding:22px 0}
.concept-kovo .concept-item-copy h3{font-size:30px}
.concept-kovo .concept-feature-art{background:#a6533b;color:#f3ddc7;display:grid;place-items:center}
.concept-kovo .concept-feature-art>svg{width:85%;height:90%;max-height:480px}
.concept-kovo .concept-feature-art>span{background:none;color:#fff;text-shadow:none}
.concept-kovo .concept-feature-copy{background:#dcd5c7}
.concept-kovo .concept-planner{padding-top:65px}
.concept-kovo .concept-form-fields{grid-template-columns:1fr}
@media(min-width:1500px){.concept-section{padding-inline:max(6%,calc((100vw - 1400px)/2))}}
@media(max-width:1000px){.concept-header{gap:20px;padding-inline:5%}.concept-nav{gap:20px}.concept-header-action{padding:12px;font-size:9px;gap:10px}.concept-logo{font-size:31px}.concept-logo small{display:none}.concept-section{padding:65px 5%}.concept-section-heading{gap:20px 35px}.concept-feature{padding-top:0}.concept-feature-copy{padding:35px 9%}.concept-feature-art{min-height:450px}.concept-item-grid{gap:15px}.concept-item-copy{padding:20px}.concept-item-copy h3{font-size:23px}.concept-planner{gap:35px}.concept-plan-form{padding:23px}.concept-aster .concept-hero{gap:25px;padding-inline:5%}.concept-aster .concept-hero-picture{min-height:480px}.concept-kovo .concept-hero-copy{gap:15px 35px}.concept-kovo .concept-logo{font-size:33px}.vanta-model-copy{padding:30px 25px}}
@media(max-width:700px){
.concept-ribbon{padding:10px 5%;gap:12px}.concept-ribbon>span{font-size:6px;letter-spacing:.5px}.concept-ribbon>span:last-child{display:none}.concept-ribbon a{font-size:9px;white-space:nowrap}
.concept-header{min-height:80px;padding:20px 5%;gap:15px}.concept-logo{font-size:32px}.concept-nav{display:none;position:absolute;inset:100% 0 auto;background:var(--c-bg);border-bottom:1px solid var(--c-line);padding:20px 5%;flex-direction:column;align-items:stretch;gap:0;font-size:14px}.concept-nav.is-open{display:flex}.concept-nav a{padding:14px 0}.concept-header-action{margin-left:auto;font-size:8px;padding:10px 11px;gap:10px}.concept-menu{display:grid;place-items:center;padding:7px}
.concept-site h1{font-size:clamp(52px,12vw,78px);letter-spacing:-3px;line-height:1.02}.concept-site h2{font-size:39px;letter-spacing:-1.6px}
.concept-hero-copy{padding:60px 6% 45px}.concept-kicker{font-size:7px;letter-spacing:1.6px}.concept-intro{font-size:12px;line-height:1.9}.concept-actions{gap:18px;margin-top:26px}.concept-primary,.concept-secondary{font-size:10px;gap:16px}.concept-primary{padding:14px 17px}
.concept-hero-caption{font-size:6px;letter-spacing:1px;padding:19px 6%;line-height:1.8}.concept-hero-caption>span:last-child{max-width:90px;text-align:right}
.concept-section{padding:55px 6%}.concept-section-heading{display:block}.concept-section-heading h2{margin-top:18px}.concept-section-heading>p:last-child{margin-top:20px;font-size:11px}.concept-filters{margin:25px 0}.concept-filters button{font-size:9px;padding:10px 14px;gap:12px;min-height:40px}.concept-item-grid{grid-template-columns:1fr;gap:22px}.concept-item-copy{padding:24px}.concept-item-copy h3{font-size:29px}.concept-item-copy>p:not(.concept-kicker){font-size:11px}.concept-item-copy>div{font-size:11px}.room-plan{aspect-ratio:1.7}.room-plan>span{font-size:8px}
.concept-feature{display:flex;flex-direction:column;padding-top:0;gap:0}.concept-feature-art{min-height:330px}.concept-feature-copy{padding:35px 8% 40px}.concept-feature-copy h2{font-size:38px}.concept-feature-copy>p:not(.concept-kicker){font-size:12px}.concept-feature-copy li{font-size:11px}.concept-feature-copy li>span{font-size:9px}
.concept-planner{display:block}.concept-planner h2{font-size:39px}.concept-planner>div>p:not(.concept-kicker){font-size:12px}.concept-plan-form{margin-top:30px;padding:23px}.concept-form-fields{gap:18px;grid-template-columns:1fr}.concept-form-fields>label{font-size:11px}.concept-form-fields input,.concept-form-fields select{font-size:14px;min-height:48px}.concept-summary{padding:17px;font-size:11px}.concept-summary strong{overflow-wrap:anywhere}
.concept-footer{padding:35px 6% 25px}.concept-footer>div{display:block}.concept-footer p{margin-top:20px;font-size:10px}.concept-footer>div+div{display:block;font-size:9px}.concept-footer>div+div>a{margin-top:20px}
.concept-solenne .concept-hero{min-height:660px}.concept-solenne .concept-hero h1{font-size:clamp(58px,13vw,82px)}.concept-solenne .concept-hero-copy{padding-top:65px}.concept-solenne .concept-hero-background>img{object-position:63% center}.concept-solenne .concept-hero-shade{background:linear-gradient(90deg,#0c271ca6,#1632251a),linear-gradient(0deg,#122c2099,transparent 50%)}
.concept-vanta .concept-logo{font-size:26px;letter-spacing:3px}.concept-vanta .concept-hero{min-height:690px}.concept-vanta h1{font-size:clamp(54px,12.6vw,80px)}.concept-vanta .concept-hero-copy{padding-top:50px}.concept-vanta .concept-intro{max-width:260px}.concept-vanta .concept-hero-background>img{object-position:57% center}.concept-vanta .concept-hero-shade{background:linear-gradient(180deg,#080e0ed9,transparent 90%),linear-gradient(0deg,#080f0fcc,transparent 40%)}.concept-vanta .concept-filters button{min-width:0;flex:1;justify-content:center}.vanta-config-preview{grid-template-columns:1fr}.vanta-drawing{min-height:245px;padding:15px}.vanta-drawing>span{left:22px;bottom:15px;font-size:7px}.vanta-model-copy{border-left:0;border-top:1px solid var(--c-line);padding:28px 25px}.vanta-model-copy h3{font-size:35px}.vanta-model-copy dl{gap:25px}.vanta-model-copy dd{font-size:24px}.vanta-finishes{gap:15px}.vanta-finishes label{font-size:10px}
.concept-aster .concept-logo{font-size:30px}.aster-mark{font-size:34px}.concept-aster .concept-hero{display:flex;flex-direction:column;gap:20px;padding:25px 6% 40px;align-items:stretch}.concept-aster .concept-hero-copy{padding:20px 0 10px}.concept-aster h1{font-size:clamp(55px,12vw,80px)}.concept-aster .concept-hero-picture{min-height:350px;border-radius:110px 20px 20px 20px}.concept-hero-picture>span{padding:13px;font-size:6px;letter-spacing:1px;inset:auto 15px 15px}.concept-aster .concept-feature-art{border-radius:22px 22px 0 0}.concept-aster .concept-feature-copy{border-radius:0 0 22px 22px}
.concept-kovo .concept-logo{font-size:32px}.concept-kovo .concept-header{padding-block:22px}.concept-kovo .concept-hero{padding:0 6% 25px}.concept-kovo .concept-hero-copy{display:block;padding:35px 0 30px}.concept-kovo .concept-hero-copy h1{font-size:clamp(55px,12.8vw,80px);margin:23px 0}.concept-kovo .concept-intro{font-size:11px;max-width:290px}.concept-kovo .concept-actions{margin-top:22px}.concept-kovo .concept-hero-picture{height:340px}.concept-kovo .concept-hero-picture img{object-position:55% center}.concept-kovo .concept-hero-picture>span{inset:auto 0 0}.concept-kovo .concept-collection{padding-top:50px}.concept-kovo .concept-item-copy{padding:22px 0}.concept-kovo .concept-item-copy h3{font-size:30px}.concept-kovo .concept-feature-art{min-height:360px}.concept-kovo .concept-feature-copy{padding:35px 8%}
}
@media(prefers-reduced-motion:reduce){.concept-site *{scroll-behavior:auto!important}.concept-site a:hover,.concept-site button:hover,.concept-item:hover .space-study svg,.concept-feature-art:hover>img{transform:none;scale:1}}
``````

## app/demo/demo.css

``````css
.demo-site {
  --demo-bg: #f3efe5;
  --demo-ink: #26362c;
  --demo-muted: #596052;
  --demo-accent: #344d37;
  background: var(--demo-bg);
  color: var(--demo-ink);
  min-height: 100vh;
  font-size: 14px;
  overflow: clip;
}
.demo-site a,
.demo-site button {
  transition:
    opacity 0.2s,
    background 0.2s;
}
.demo-site a:hover {
  opacity: 0.75;
}
.demo-site :focus-visible {
  outline-color: var(--demo-ink);
}
.demo-site h1,
.demo-site h2,
.demo-site h3 {
  letter-spacing: -0.05em;
}
.demo-site h1,
.demo-site h2 {
  font-family: Georgia, "Times New Roman", serif;
  font-weight: 400;
}
.demo-site h1 {
  font-size: clamp(55px, 6.3vw, 92px);
  line-height: 1.03;
  margin: 25px 0;
}
.demo-site h2 {
  font-size: clamp(36px, 4vw, 56px);
  line-height: 1.08;
}
.demo-concept-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 11px 4.5%;
  background: var(--demo-ink);
  color: var(--demo-bg);
  font-size: 9px;
  letter-spacing: 1px;
}
.demo-concept-bar a {
  display: flex;
  align-items: center;
  gap: 8px;
}
.demo-fictional {
  max-width: 410px;
  font-size: 8px;
  letter-spacing: 0;
  line-height: 1.4;
  opacity: 0.75;
}
.demo-header {
  padding: 30px 5%;
  display: flex;
  align-items: center;
  gap: 35px;
  border-bottom: 1px solid color-mix(in srgb, var(--demo-ink) 12%, transparent);
}
.demo-wordmark {
  font-family: Georgia, serif;
  font-size: 27px;
  letter-spacing: -1px;
  white-space: nowrap;
}
.demo-nav {
  display: flex;
  gap: 30px;
  margin-left: auto;
  font-size: 11px;
}
.demo-header-cta {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 13px 17px;
  border: 1px solid color-mix(in srgb, var(--demo-ink) 25%, transparent);
  font-size: 10px;
  margin-left: 22px;
}
.demo-menu {
  display: none;
  background: none;
}
.demo-hero {
  min-height: 720px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
  align-items: center;
  gap: 50px;
  padding: 55px 5% 65px;
}
.demo-kicker {
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 2px;
  line-height: 1.7;
}
.demo-hero-copy > p:not(.demo-kicker) {
  font-size: 13px;
  line-height: 1.9;
  max-width: 360px;
  color: var(--demo-muted);
}
.demo-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 25px;
  margin-top: 32px;
}
.demo-primary,
.demo-secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 25px;
  font-size: 11px;
  min-height: 48px;
}
.demo-primary {
  background: var(--demo-ink);
  color: var(--demo-bg);
  padding: 14px 20px;
}
.demo-secondary {
  border-bottom: 1px solid color-mix(in srgb, var(--demo-ink) 25%, transparent);
}
.demo-edition {
  display: block;
  font-size: 7px;
  letter-spacing: 1.7px;
  margin-top: 60px;
  color: var(--demo-muted);
}
.demo-hero-art {
  position: relative;
  min-width: 0;
}
.demo-art-caption {
  display: flex;
  justify-content: center;
  font-size: 8px;
  letter-spacing: 1px;
  margin-top: 15px;
  color: var(--demo-muted);
}
.demo-collection {
  padding: 85px 5%;
  min-height: 900px;
  border-top: 1px solid color-mix(in srgb, var(--demo-ink) 12%, transparent);
}
.demo-section-heading {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 60px;
  margin-bottom: 48px;
}
.demo-section-heading h2 {
  margin-top: 18px;
  max-width: 570px;
}
.demo-section-heading > p {
  max-width: 290px;
  font-size: 12px;
  line-height: 1.9;
  color: var(--demo-muted);
}
.demo-item-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 26px;
}
.demo-item {
  min-width: 0;
}
.demo-item-art {
  aspect-ratio: 1/0.9;
  overflow: hidden;
  background: #e8e2d5;
  position: relative;
}
.demo-item-label {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 20px;
  margin-top: 23px;
}
.demo-item-label h3 {
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -0.7px;
}
.demo-item-label > span {
  font-size: 12px;
  white-space: nowrap;
}
.demo-item > p {
  font-size: 11px;
  color: var(--demo-muted);
  margin-top: 10px;
  line-height: 1.8;
}
.demo-item > a {
  display: flex;
  width: fit-content;
  gap: 30px;
  font-size: 10px;
  margin-top: 20px;
  border-bottom: 1px solid color-mix(in srgb, var(--demo-ink) 20%, transparent);
  padding-bottom: 9px;
}
.demo-detail {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  min-height: 900px;
  gap: 80px;
  padding: 80px 5%;
  align-items: center;
  background: color-mix(in srgb, var(--demo-ink) 4%, var(--demo-bg));
}
.demo-detail-copy h2 {
  margin-top: 20px;
}
.demo-detail-copy > p:not(.demo-kicker) {
  font-size: 12px;
  line-height: 1.9;
  color: var(--demo-muted);
  margin-top: 24px;
  max-width: 380px;
}
.demo-detail-copy > .demo-primary {
  margin-top: 30px;
}
.demo-detail-art {
  min-width: 0;
}
.demo-footer {
  padding: 45px 5%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 35px;
}
.demo-footer p {
  font-size: 8px;
  line-height: 1.8;
  max-width: 350px;
  letter-spacing: 1px;
  color: var(--demo-muted);
}
.demo-footer > a:last-child {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 10px;
  white-space: nowrap;
}
/* Seasonal food illustrated entirely with CSS. */
.dish-illustration {
  aspect-ratio: 1/1.04;
  background: radial-gradient(ellipse at 60% 30%, #ddd6c0, #bdb59c);
  position: relative;
  overflow: hidden;
  border-radius: 48% 48% 2px 2px;
}
.dish-linen {
  position: absolute;
  inset: -20% 58% -20% -20%;
  background: repeating-linear-gradient(90deg, #c9bda4 0 2px, #d2c7b0 3px 7px);
  transform: rotate(18deg);
  box-shadow: 10px 10px 35px #544e3430;
}
.dish-plate {
  position: absolute;
  width: 78%;
  aspect-ratio: 1;
  left: 13%;
  top: 13%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    #d9d2bd 0 51%,
    #eae5d6 52% 54%,
    #cec7b5 55%,
    #eae4d4 65%,
    #f8f2e2 69%,
    #bcb5a0 70%,
    #eee6d3 72%
  );
  box-shadow:
    17px 25px 28px #3c3b2c40,
    inset -5px -8px 14px #b6ae99;
}
.dish-sauce {
  position: absolute;
  inset: 23%;
  background: radial-gradient(circle at 25% 60%, #8c9a50, #556f36 60%, #3e5b2b);
  border-radius: 48% 41% 49% 44%;
  box-shadow: inset 3px 3px 10px #fff4;
}
.dish-leaf {
  position: absolute;
  left: 47%;
  top: 47%;
  width: 25%;
  height: 10%;
  background: linear-gradient(170deg, #a6ad53, #688739 55%, #3f612e);
  border-radius: 2% 90% 2% 90%;
  transform-origin: 10% 50%;
  box-shadow: 0 5px 5px #243c2440;
}
.leaf-0 {
  transform: rotate(10deg);
}
.leaf-1 {
  transform: rotate(50deg);
}
.leaf-2 {
  transform: rotate(90deg);
}
.leaf-3 {
  transform: rotate(130deg);
}
.leaf-4 {
  transform: rotate(170deg);
}
.leaf-5 {
  transform: rotate(210deg);
}
.leaf-6 {
  transform: rotate(250deg);
}
.leaf-7 {
  transform: rotate(290deg);
}
.leaf-8 {
  transform: rotate(330deg);
}
.dish-cheese {
  position: absolute;
  left: 39%;
  top: 36%;
  width: 25%;
  height: 24%;
  border-radius: 50% 40% 55% 50%;
  background: radial-gradient(circle at 30% 30%, #fffbee, #d2cbae);
  box-shadow: 7px 10px 15px #26351c40;
  transform: rotate(-18deg);
}
.dish-seasoning {
  position: absolute;
  left: 40%;
  top: 38%;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #374a26;
  box-shadow:
    10px 3px #374a26,
    20px 0 #7b7f3a,
    5px 20px #42512e,
    35px 15px #6b7134,
    10px 35px #354926,
    40px 30px #6b7134,
    25px 44px #42512e;
}
.dish-cutlery {
  position: absolute;
  right: 4%;
  top: 12%;
  height: 71%;
  width: 8px;
  background: linear-gradient(90deg, #a98c56, #ddca91, #a68b54);
  border-radius: 8px;
  transform: rotate(-9deg);
  box-shadow: 4px 5px 8px #463a2826;
}
.dish-herb {
  position: absolute;
  width: 65px;
  height: 15px;
  border-radius: 90% 0 90% 0;
  background: #64734c;
  bottom: 4%;
  left: 8%;
  transform: rotate(-28deg);
  box-shadow:
    20px -15px #667b50,
    40px -30px #52683e;
}
.dish-art .dish-illustration {
  border-radius: 0;
  height: 100%;
  aspect-ratio: auto;
}
.dish-1 {
  filter: hue-rotate(-24deg);
}
.dish-2 {
  filter: hue-rotate(320deg) saturate(0.7);
}
/* Architectural vector studies. */
.demo-real-estate {
  --demo-bg: #efeee8;
  --demo-ink: #202e30;
  --demo-muted: #4f5e60;
  --demo-accent: #455c5b;
}
.demo-real-estate .demo-wordmark {
  font-family: var(--font-space), sans-serif;
  letter-spacing: -1.5px;
}
.demo-real-estate .demo-hero {
  grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.2fr);
  gap: 40px;
  padding-right: 0;
}
.demo-real-estate .demo-hero h1 {
  font-size: clamp(56px, 5.8vw, 84px);
}
.demo-real-estate .demo-hero-art {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.architecture-art {
  display: block;
  width: 100%;
  height: auto;
}
.demo-real-estate .demo-hero-art .architecture-art {
  height: 560px;
  object-fit: cover;
}
.demo-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 26px;
}
.demo-filters button {
  background: transparent;
  border: 1px solid #b9c2be;
  padding: 9px 17px;
  border-radius: 30px;
  font-size: 10px;
}
.demo-filters button[aria-pressed="true"] {
  background: var(--demo-ink);
  color: var(--demo-bg);
}
.building-1 .architecture-art {
  filter: hue-rotate(10deg) saturate(0.7);
  transform: scale(1.2) translateX(-4%);
}
.building-2 .architecture-art {
  filter: hue-rotate(335deg) saturate(0.65);
  transform: scale(1.12);
}
.demo-dimensions {
  border-block: 1px solid #bcc7c4;
  padding: 20px 0;
  letter-spacing: 0.7px;
  font-size: 10px !important;
}
/* A complete fictional product interface and SaaS visual language. */
.demo-saas {
  --demo-bg: #0d141b;
  --demo-ink: #eef7f2;
  --demo-muted: #9daeb0;
  --demo-accent: #a4e5c3;
}
.demo-saas .demo-concept-bar {
  background: #a4e5c3;
  color: #0d141b;
}
.demo-saas .demo-wordmark {
  font-family: var(--font-space), sans-serif;
  font-weight: 600;
}
.demo-saas .demo-wordmark::before {
  content: "◉";
  color: #a4e5c3;
  margin-right: 9px;
}
.demo-saas h1,
.demo-saas h2 {
  font-family: var(--font-space), sans-serif;
  letter-spacing: -3px;
}
.demo-saas h1 {
  font-size: clamp(49px, 5vw, 73px);
  line-height: 1.09;
}
.demo-saas .demo-hero {
  gap: 35px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
  background: radial-gradient(ellipse at 80% 55%, #a4e5c30b, transparent 60%);
}
.demo-saas .demo-primary {
  background: #a4e5c3;
  color: #0d141b;
  border-radius: 7px;
}
.demo-saas .demo-header-cta {
  border-radius: 6px;
}
.orbit-dashboard {
  display: grid;
  grid-template-columns: 100px minmax(0, 1fr);
  background: #15202a;
  border: 1px solid #a4e5c330;
  border-radius: 12px;
  box-shadow: 0 35px 75px #0006;
  color: #dfebe4;
  overflow: hidden;
  transform: perspective(1400px) rotateY(-5deg) rotateX(3deg);
  min-height: 390px;
}
.orbit-dashboard aside {
  padding: 23px 12px;
  background: #101922;
  border-right: 1px solid #ffffff0b;
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-size: 8px;
  color: #8b9ea3;
}
.orbit-dashboard aside strong {
  font-size: 16px;
  color: #b9ecd2;
  white-space: nowrap;
}
.orbit-avatar {
  background: #a4e5c326;
  color: #a4e5c3;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  margin-top: auto;
}
.orbit-main {
  padding: 22px 20px;
  min-width: 0;
}
.orbit-toolbar {
  display: flex;
  justify-content: space-between;
  font-size: 6px;
  letter-spacing: 1px;
  color: #849b9d;
}
.orbit-main .orbit-project-title {
  font-size: 22px;
  margin-top: 30px;
  letter-spacing: -0.7px;
}
.orbit-main > p {
  font-size: 8px;
  color: #8da3a8;
  margin-top: 8px;
}
.orbit-stats {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 12px;
  margin-top: 23px;
}
.orbit-stats > div {
  background: #1c2a35;
  border: 1px solid #ffffff08;
  border-radius: 7px;
  padding: 17px;
  min-width: 0;
}
.orbit-stats small {
  font-size: 7px;
  color: #9ab0b5;
}
.orbit-stats strong {
  display: block;
  font-size: 32px;
  margin-top: 10px;
  font-weight: 500;
}
.orbit-stats strong span {
  font-size: 14px;
  color: #a4e5c3;
}
.orbit-stats > div > i {
  display: block;
  height: 4px;
  border-radius: 5px;
  background: linear-gradient(90deg, #a4e5c3 72%, #35434b 72%);
  margin-top: 12px;
}
.orbit-chart {
  height: 95px;
  display: flex;
  align-items: end;
  gap: 7px;
  padding-top: 8px;
  background: repeating-linear-gradient(
    0deg,
    transparent 0 25px,
    #ffffff08 25px 26px
  );
}
.orbit-chart i {
  flex: 1;
  background: linear-gradient(#a4e5c3, #4b766a);
  border-radius: 3px 3px 0 0;
}
.orbit-board {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 9px;
  margin-top: 24px;
}
.orbit-board small {
  font-size: 5px;
  letter-spacing: 1px;
  color: #97aeb1;
}
.orbit-board article {
  border: 1px solid #ffffff0c;
  background: #1c2a35;
  border-radius: 6px;
  padding: 13px 9px;
  margin-top: 10px;
}
.orbit-board article > i {
  display: block;
  width: 20px;
  height: 3px;
  border-radius: 3px;
  background: #ad9fd5;
  margin-bottom: 12px;
}
.orbit-board strong {
  display: block;
  font-size: 7px;
  line-height: 1.5;
  font-weight: 400;
  letter-spacing: 0;
}
.orbit-board span {
  display: block;
  font-size: 5px;
  line-height: 1.5;
  color: #8da3a8;
  margin-top: 7px;
}
.orbit-board b {
  display: grid;
  place-items: center;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  background: #a4e5c32a;
  color: #a4e5c3;
  font-size: 5px;
  margin-top: 13px;
}
.saas-feature-icon {
  height: 185px;
  border: 1px solid #a4e5c320;
  border-radius: 10px;
  background: radial-gradient(ellipse at center, #a4e5c312, transparent);
  display: grid;
  place-items: center;
}
.mini-board {
  display: flex;
  gap: 8px;
}
.mini-board i {
  height: 70px;
  width: 45px;
  border: 1px solid #a4e5c340;
  border-radius: 5px;
  background: linear-gradient(
    #a4e5c345 20%,
    transparent 20% 27%,
    #a4e5c320 27% 60%,
    transparent 60%
  );
}
.mini-notes {
  display: grid;
  gap: 10px;
  padding: 20px;
  border: 1px solid #a4e5c340;
  border-radius: 6px;
  transform: rotate(-7deg);
}
.mini-notes i {
  width: 90px;
  height: 7px;
  background: #a4e5c340;
  border-radius: 2px;
}
.mini-notes i:last-child {
  width: 55px;
}
.mini-bars {
  display: flex;
  align-items: end;
  gap: 9px;
  height: 80px;
}
.mini-bars i {
  width: 25px;
  background: #a4e5c36b;
  border-radius: 3px;
  height: 40%;
}
.mini-bars i:nth-child(2) {
  height: 63%;
}
.mini-bars i:nth-child(3) {
  height: 75%;
}
.mini-bars i:nth-child(4) {
  height: 100%;
  background: #a4e5c3;
}
.demo-saas .demo-detail {
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.2fr);
  gap: 45px;
}
.demo-billing {
  display: flex;
  width: fit-content;
  background: #ffffff09;
  padding: 4px;
  border: 1px solid #ffffff15;
  border-radius: 7px;
  margin-top: 25px;
}
.demo-billing button {
  font-size: 10px;
  padding: 9px 15px;
  border-radius: 4px;
  background: none;
  color: var(--demo-muted);
}
.demo-billing button[aria-pressed="true"] {
  background: #a4e5c3;
  color: #0d141b;
}
.demo-plans {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}
.demo-plans article {
  padding: 22px;
  border: 1px solid #a4e5c32c;
  background: #15202a;
  border-radius: 9px;
}
.demo-plans h3 {
  font-size: 17px;
}
.demo-plans p {
  font-size: 9px;
  color: var(--demo-muted);
  line-height: 1.7;
  margin-top: 10px;
  min-height: 33px;
}
.demo-plans strong {
  display: block;
  font-size: 38px;
  font-weight: 500;
  margin-top: 20px;
  letter-spacing: -2px;
}
.demo-plans article > span {
  font-size: 8px;
  color: var(--demo-muted);
}
.demo-plans button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 10px;
  margin-top: 18px;
  background: #a4e5c31a;
  border: 1px solid #a4e5c330;
  border-radius: 5px;
  color: #c4ecd9;
  font-size: 8px;
}
.demo-notice {
  min-height: 30px;
}
/* Original editorial fashion illustrations. */
.demo-store {
  --demo-bg: #eeeae3;
  --demo-ink: #282522;
  --demo-muted: #64594f;
  --demo-accent: #a77754;
}
.demo-store .demo-wordmark {
  font-family: var(--font-inter), sans-serif;
  font-weight: 500;
  letter-spacing: 3px;
  font-size: 19px;
}
.demo-store .demo-hero {
  padding-top: 40px;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 65px;
}
.demo-store .demo-hero h1 {
  font-size: clamp(56px, 6.8vw, 94px);
}
.demo-store .demo-hero-art {
  background: #d5c5b2;
}
.garment-art {
  display: block;
  width: 100%;
  height: 100%;
  max-height: 620px;
  background: radial-gradient(ellipse at 55% 35%, #e1d6c6, #c3b39d);
}
.garment-1 {
  background: radial-gradient(ellipse at 50% 40%, #ddd8ce, #bdb7ab);
}
.garment-2 {
  background: radial-gradient(ellipse at 50% 40%, #d3d2c8, #b5b4aa);
}
.demo-store .demo-art-caption {
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #4d3c2e;
  letter-spacing: 2px;
  font-size: 8px;
}
.demo-store .demo-item-art {
  aspect-ratio: 1/1.12;
}
.demo-store .demo-item-art .garment-art {
  object-fit: contain;
}
.demo-store .demo-detail {
  gap: 100px;
}
.demo-store .demo-product-price {
  font-size: 25px !important;
  color: var(--demo-ink) !important;
}
.demo-store details {
  font-size: 11px;
  margin-top: 35px;
  padding: 20px 0;
  border-block: 1px solid #c1b7a8;
}
.demo-store details p {
  font-size: 11px;
  color: var(--demo-muted);
  line-height: 1.8;
  margin-top: 15px;
}
@media (max-width: 1000px) {
  .demo-hero {
    gap: 25px;
    min-height: 660px;
  }
  .demo-nav {
    gap: 18px;
  }
  .demo-header-cta {
    display: none;
  }
  .demo-detail {
    gap: 35px;
  }
  .demo-item-grid {
    gap: 18px;
  }
  .demo-section-heading {
    gap: 30px;
  }
  .demo-item-label h3 {
    font-size: 16px;
  }
  .orbit-dashboard {
    grid-template-columns: 70px minmax(0, 1fr);
  }
  .orbit-dashboard aside {
    padding: 18px 8px;
    font-size: 6px;
  }
  .orbit-dashboard aside strong {
    font-size: 12px;
  }
  .orbit-main {
    padding: 18px 12px;
  }
  .orbit-board {
    gap: 5px;
  }
  .orbit-board article {
    padding: 10px 6px;
  }
  .demo-saas .demo-detail {
    grid-template-columns: minmax(0, 1fr);
  }
  .demo-saas .demo-detail-art {
    max-width: 650px;
  }
  .demo-saas .demo-detail-copy > p {
    max-width: 600px;
  }
  .demo-plans {
    max-width: 600px;
  }
  .demo-store .demo-hero,
  .demo-store .demo-detail {
    gap: 35px;
  }
  .demo-fictional {
    display: none;
  }
}
@media (max-width: 700px) {
  .demo-concept-bar {
    padding: 10px 6%;
    font-size: 7px;
    gap: 10px;
  }
  .demo-header {
    padding: 23px 6%;
    gap: 15px;
    position: relative;
    z-index: 2;
  }
  .demo-wordmark {
    font-size: 25px;
  }
  .demo-menu {
    display: block;
    margin-left: auto;
  }
  .demo-nav {
    display: none;
    position: absolute;
    inset: 100% 0 auto;
    padding: 25px 6%;
    background: var(--demo-bg);
    box-shadow: 0 20px 25px #0002;
    border-bottom: 1px solid
      color-mix(in srgb, var(--demo-ink) 15%, transparent);
  }
  .demo-nav.is-open {
    display: grid;
    gap: 25px;
  }
  .demo-hero,
  .demo-real-estate .demo-hero,
  .demo-saas .demo-hero,
  .demo-store .demo-hero {
    grid-template-columns: minmax(0, 1fr);
    padding: 45px 6%;
    gap: 36px;
    min-height: auto;
  }
  .demo-site h1,
  .demo-real-estate .demo-hero h1,
  .demo-saas h1,
  .demo-store .demo-hero h1 {
    font-size: clamp(47px, 12vw, 68px);
    letter-spacing: -2.5px;
    margin: 20px 0;
    max-width: 500px;
  }
  .demo-hero-copy > p:not(.demo-kicker) {
    font-size: 12px;
    max-width: 450px;
  }
  .demo-kicker {
    font-size: 8px;
    letter-spacing: 1.5px;
  }
  .demo-actions {
    gap: 20px;
    margin-top: 25px;
  }
  .demo-primary,
  .demo-secondary {
    font-size: 10px;
    gap: 18px;
  }
  .demo-edition {
    display: none;
  }
  .demo-hero-art {
    max-width: 500px;
    width: 100%;
    margin: auto;
  }
  .dish-illustration {
    aspect-ratio: 1/1;
  }
  .demo-art-caption {
    font-size: 7px;
  }
  .demo-real-estate .demo-hero-art .architecture-art {
    height: auto;
  }
  .demo-collection {
    padding: 60px 6%;
    min-height: 0;
  }
  .demo-section-heading {
    display: block;
    margin-bottom: 30px;
  }
  .demo-section-heading h2 {
    font-size: 37px;
    letter-spacing: -1.7px;
  }
  .demo-section-heading > p {
    margin-top: 20px;
    font-size: 11px;
    max-width: 350px;
  }
  .demo-item-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 35px;
  }
  .demo-item-label {
    margin-top: 17px;
  }
  .demo-item-label h3 {
    font-size: 21px;
  }
  .demo-item-art {
    aspect-ratio: 1/1;
  }
  .demo-detail,
  .demo-saas .demo-detail,
  .demo-store .demo-detail {
    padding: 55px 6%;
    grid-template-columns: minmax(0, 1fr);
    gap: 35px;
    min-height: 0;
  }
  .demo-detail h2 {
    font-size: 38px;
    letter-spacing: -1.8px;
  }
  .demo-detail-copy > p:not(.demo-kicker) {
    font-size: 11px;
  }
  .demo-footer {
    padding: 35px 6%;
    flex-wrap: wrap;
    gap: 25px;
  }
  .demo-footer p {
    order: 3;
    width: 100%;
    max-width: none;
    font-size: 7px;
  }
  .demo-footer > a:last-child {
    margin-left: auto;
    font-size: 9px;
  }
  .orbit-dashboard {
    min-height: 300px;
    grid-template-columns: 66px minmax(0, 1fr);
    transform: none;
  }
  .orbit-main .orbit-project-title {
    font-size: 19px;
    margin-top: 22px;
  }
  .orbit-stats {
    gap: 8px;
  }
  .orbit-stats > div {
    padding: 12px;
  }
  .orbit-chart {
    height: 70px;
    gap: 4px;
  }
  .orbit-stats strong {
    font-size: 27px;
  }
  .orbit-board {
    margin-top: 20px;
  }
  .orbit-board small {
    font-size: 4px;
  }
  .orbit-board strong {
    font-size: 6px;
  }
  .orbit-board span {
    font-size: 4px;
  }
  .orbit-dashboard aside {
    gap: 20px;
  }
  .orbit-main > p {
    font-size: 7px;
  }
  .orbit-board b {
    margin-top: 10px;
  }
  .demo-saas .demo-item-grid {
    gap: 25px;
  }
  .saas-feature-icon {
    height: 160px;
  }
  .demo-plans article {
    padding: 17px;
  }
  .demo-plans button {
    font-size: 7px;
  }
  .demo-store .demo-hero-art {
    max-height: 450px;
    overflow: hidden;
  }
  .demo-store .demo-hero-art .garment-art {
    height: 450px;
  }
  .demo-store .demo-wordmark {
    font-size: 16px;
    letter-spacing: 2px;
  }
  .demo-store .demo-item-art {
    aspect-ratio: 1/1.1;
  }
}

.orbit-main .orbit-project-title {
  color: #dfebe4;
  font-weight: 500;
}
``````

## app/demo-window.css

``````css
/* The reference's desktop/window composition, using the shared Elvora palette. */
.demo-desktop {
  height: 100svh;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0 clamp(12px, 5vw, 100px) 14px;
  background: var(--raised);
  color: var(--text);
  overflow: hidden;
}
.demo-desktop-menu {
  min-height: 38px;
  display: flex;
  align-items: center;
  gap: 24px;
  font-size: 11px;
  color: var(--muted);
}
.demo-desktop-menu a {
  color: var(--text);
  font-weight: 600;
}
.demo-desktop-menu > span:last-child {
  margin-left: auto;
}
.demo-window {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  width: min(1450px, 100%);
  margin-inline: auto;
  overflow: hidden;
  border: 1px solid var(--line-bright);
  border-radius: 20px;
  background: var(--surface);
  box-shadow: 0 26px 70px
    color-mix(in srgb, var(--neutral-black) 22%, transparent);
}
.demo-window.is-maximized {
  position: fixed;
  inset: 0;
  z-index: 90;
  width: 100%;
  height: 100svh;
  border-radius: 0;
}
.demo-window-toolbar {
  min-height: 52px;
  display: flex;
  align-items: center;
  gap: 20px;
  padding-inline: 18px 8px;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}
.demo-window-dots {
  display: flex;
  gap: 8px;
}
.demo-window-dots i {
  width: 10px;
  height: 10px;
  border: 1px solid var(--line-bright);
  border-radius: 50%;
  background: var(--raised);
}
.demo-window-dots i:first-child {
  background: var(--accent);
  border-color: var(--accent);
}
.demo-window-breadcrumb {
  min-width: 0;
  display: flex;
  align-items: center;
  gap: 14px;
  color: var(--muted);
  font-size: 11px;
}
.demo-window-breadcrumb strong {
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}
.demo-window-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}
.demo-window-actions button,
.demo-window-actions a {
  min-height: 40px;
  min-width: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid var(--line);
  border-radius: 9px;
  color: var(--text);
  background: var(--surface);
  font-size: 11px;
}
.demo-window-actions a {
  padding-inline: 12px;
}
.demo-window-actions button:hover,
.demo-window-actions a:hover {
  color: var(--accent-text);
  border-color: var(--accent);
}
.demo-window-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;
  scroll-behavior: smooth;
  scroll-padding-top: 20px;
  background: var(--surface);
}
.demo-window-content:focus-visible {
  outline-offset: -3px;
}
.demo-desktop-dock {
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  gap: 6px;
  align-self: center;
  border: 1px solid var(--line-bright);
  border-radius: 20px;
  background: var(--glass);
  padding: 8px 12px 6px;
  box-shadow: 0 8px 28px
    color-mix(in srgb, var(--neutral-black) 10%, transparent);
}
.demo-desktop-dock a {
  display: grid;
  justify-items: center;
  gap: 5px;
  width: 70px;
  padding: 2px;
  color: var(--muted);
  font-size: 10px;
}
.demo-desktop-dock a > span {
  display: grid;
  place-items: center;
  height: 38px;
  width: 38px;
  border: 1px solid var(--line-bright);
  border-radius: 11px;
  color: var(--text);
  background: var(--surface);
  font:
    600 23px/1 var(--font-space),
    sans-serif;
}
.demo-desktop-dock [aria-current="page"] > span {
  background: var(--accent);
  border-color: var(--accent);
  color: var(--on-accent);
}
@media (hover: hover) and (pointer: fine) {
  .demo-desktop-dock a:hover > span {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--on-accent);
  }
}
.demo-desktop-dock small {
  font-size: 8px;
}
@media (max-width: 700px) {
  .demo-desktop {
    gap: 8px;
    padding: 0 8px 8px;
  }
  .demo-desktop-menu {
    gap: 10px;
    font-size: 9px;
    padding-inline: 6px;
  }
  .demo-desktop-menu > span:last-child {
    display: none;
  }
  .demo-window {
    border-radius: 12px;
  }
  .demo-window-toolbar {
    gap: 8px;
    padding-inline: 10px 6px;
  }
  .demo-window-dots {
    gap: 4px;
  }
  .demo-window-dots i {
    width: 6px;
    height: 6px;
  }
  .demo-window-breadcrumb {
    font-size: 10px;
    gap: 6px;
  }
  .demo-window-breadcrumb > span {
    display: none;
  }
  .demo-window-actions {
    gap: 4px;
  }
  .demo-window-actions a {
    padding-inline: 8px;
    font-size: 9px;
  }
  .demo-desktop-dock {
    gap: 3px;
    padding: 6px;
    border-radius: 15px;
  }
  .demo-desktop-dock a {
    width: 60px;
  }
}
html[data-motion="reduced"] .demo-window-content {
  scroll-behavior: auto;
}
``````

## app/devices.css

``````css
.device-project {
  display: block;
  width: 100%;
  text-align: left;
  background: transparent;
}
.device-stage {
  position: relative;
  aspect-ratio: 1.25;
  perspective: 1100px;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 15px;
  background:
    radial-gradient(
      ellipse at 50% 60%,
      color-mix(in srgb, var(--project-accent) 9%, transparent),
      transparent 65%
    ),
    linear-gradient(135deg, var(--surface), var(--bg));
}
.device-project-number {
  position: absolute;
  top: 25px;
  left: 28px;
  font-family: var(--font-space), sans-serif;
  font-size: 75px;
  line-height: 1;
  font-weight: 500;
  letter-spacing: -5px;
  color: var(--text);
  opacity: 0.05;
}
.device-floor {
  position: absolute;
  left: 10%;
  right: 10%;
  height: 25%;
  bottom: 2%;
  background: radial-gradient(ellipse, var(--art-tone62), transparent 70%);
  filter: blur(12px);
  transform: rotate(-4deg);
}
.device-float {
  position: absolute;
  inset: 15% 4% 12% 4%;
  animation: device-float 7s ease-in-out infinite;
  transform-style: preserve-3d;
}
.device-composition {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}
.device-laptop {
  position: absolute;
  left: 5%;
  top: 7%;
  width: 83%;
  transform: perspective(1000px) rotateY(-8deg) rotateX(8deg) rotateZ(-3deg);
  transform-style: preserve-3d;
  filter: drop-shadow(0 12px 8px var(--art-tone63));
}
.device-laptop-lid {
  position: relative;
  padding: 9px 8px 8px;
  background: linear-gradient(140deg, var(--art-tone64), var(--art-tone65) 55%, var(--art-tone66));
  border: 1px solid color-mix(in srgb, var(--project-accent) 45%, var(--art-tone67));
  border-radius: 10px 10px 3px 3px;
  box-shadow:
    0 0 30px color-mix(in srgb, var(--project-accent) 8%, transparent),
    inset 0 0 0 1px var(--art-tone68);
  aspect-ratio: 1.5;
}
.device-screen {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background: var(--art-tone69);
}
.device-screen img {
  object-fit: cover;
  object-position: top;
}
.device-camera {
  position: absolute;
  width: 2px;
  height: 2px;
  background: var(--art-tone70);
  left: 50%;
  top: 3px;
  border-radius: 50%;
}
.device-reflection {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(
    128deg,
    transparent 5%,
    var(--art-tone71) 42%,
    var(--art-tone72) 43%,
    var(--art-tone73) 70%,
    transparent 71%
  );
}
.device-laptop-base {
  position: absolute;
  top: 100%;
  left: -7%;
  width: 114%;
  height: 12px;
  background: linear-gradient(var(--art-tone74), var(--art-tone75) 35%, var(--art-tone76) 50%, var(--art-tone77));
  clip-path: polygon(6% 0, 94% 0, 100% 65%, 96% 100%, 4% 100%, 0 65%);
  border-radius: 0 0 50% 50%;
  box-shadow: 0 6px 8px var(--art-tone63);
}
.device-laptop-base i {
  display: block;
  width: 16%;
  height: 3px;
  background: var(--art-tone78);
  margin: 0 auto;
  border-radius: 0 0 4px 4px;
}
.device-phone {
  position: absolute;
  right: 2%;
  bottom: 0;
  width: 22%;
  height: 84%;
  padding: 5px;
  border: 1px solid color-mix(in srgb, var(--project-accent) 60%, var(--art-tone79));
  border-radius: 18px;
  background: linear-gradient(140deg, var(--art-tone80), var(--art-tone81));
  transform: perspective(1000px) rotateY(-12deg) rotateZ(6deg) translateZ(65px);
  box-shadow:
    -12px 14px 20px var(--art-tone82),
    inset 0 0 0 2px var(--art-tone83);
}
.device-phone-screen {
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 13px;
  overflow: hidden;
  background: var(--art-tone81);
}
.device-phone-screen img {
  object-fit: cover;
  object-position: top;
}
.device-phone-notch {
  position: absolute;
  width: 31%;
  height: 5px;
  top: 9px;
  left: 34.5%;
  background: var(--art-tone84);
  border-radius: 8px;
  box-shadow: 0 0 0 1px var(--art-tone85);
}
.device-view {
  position: absolute;
  bottom: 22px;
  left: 26px;
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 10px;
  letter-spacing: 0.2px;
  color: var(--text);
  border-bottom: 1px solid var(--line);
  padding-bottom: 8px;
}
.device-view svg {
  color: var(--gold);
}
.device-project:hover .device-stage {
  border-color: color-mix(in srgb, var(--project-accent) 38%, transparent);
}
.device-project:hover .device-view {
  color: var(--gold);
}
.projects-grid {
  row-gap: 50px;
}
.gallery-media {
  border: 1px solid var(--art-tone86);
  box-shadow:
    0 20px 65px var(--art-tone63),
    inset 0 0 0 5px var(--art-tone73);
  transform: perspective(1700px) rotateX(1deg);
  border-radius: 12px;
}
.gallery-media img.loaded {
  animation: gallery-enter 0.4s ease-out;
}
.gallery-demo-link {
  display: inline-block;
  margin-top: 15px;
  color: var(--gold);
  font-size: 11px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 6px;
}
.gallery-highlights {
  margin-top: 20px;
}
.gallery-highlights ul {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px 20px;
}
.gallery-highlights li {
  font-size: 10px;
  line-height: 1.8;
  color: var(--muted);
}
.gallery-highlights li::before {
  content: "+";
  color: var(--gold);
  margin-right: 7px;
}
@keyframes device-float {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -8px;
  }
}
@keyframes gallery-enter {
  from {
    opacity: 0;
    scale: 0.98;
  }
  to {
    opacity: 1;
    scale: 1;
  }
}
@media (max-width: 700px) {
  .device-stage {
    aspect-ratio: 1.18;
  }
  .device-float {
    inset: 16% 3% 15%;
  }
  .device-laptop-lid {
    padding: 7px 6px 6px;
    border-radius: 8px 8px 3px 3px;
  }
  .device-phone {
    border-radius: 14px;
    padding: 4px;
  }
  .device-phone-screen {
    border-radius: 10px;
  }
  .device-phone-notch {
    top: 8px;
    height: 4px;
  }
  .device-view {
    left: 20px;
    bottom: 18px;
    font-size: 9px;
  }
  .device-project-number {
    font-size: 60px;
    top: 20px;
    left: 20px;
  }
  .projects-grid {
    row-gap: 30px;
  }
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .device-float,
  html:not([data-motion="full"]) .device-composition,
  html:not([data-motion="full"]) .device-laptop,
  html:not([data-motion="full"]) .device-phone,
  html:not([data-motion="full"]) .gallery-media {
    transform: none !important;
    animation: none !important;
    translate: none !important;
  }
  html:not([data-motion="full"]) .device-phone {
    box-shadow: -5px 5px 12px var(--art-tone87);
  }
  html:not([data-motion="full"]) .gallery-media img.loaded {
    animation: none;
  }
}
html[data-motion="reduced"] .gallery-media img.loaded {
  animation: none;
}
html[data-motion="reduced"] .device-phone {
  box-shadow: -5px 5px 12px var(--art-tone87);
}
html[data-motion="reduced"] .device-float,
html[data-motion="reduced"] .device-composition,
html[data-motion="reduced"] .device-laptop,
html[data-motion="reduced"] .device-phone,
html[data-motion="reduced"] .gallery-media {
  transform: none !important;
  animation: none !important;
  translate: none !important;
}
``````

## app/editorial.css

``````css
/* Editorial details adapted to Elvora from the supplied visual references. */
.split-display {
  font-size: clamp(64px, 8.5vw, 126px);
  line-height: 0.98;
  letter-spacing: -0.075em;
  font-weight: 600;
}
.split-display .text-reveal-line + .text-reveal-line {
  color: var(--muted);
}

/* Local, monochrome brand assets: no third-party requests. */
.tool-brand-mark {
  width: 30px;
  height: 30px;
  display: inline-grid;
  place-items: center;
  flex-shrink: 0;
  color: var(--text);
}
.tool-brand-mark i {
  width: 100%;
  height: 100%;
  background: currentColor;
  mask: var(--mark-image) center / contain no-repeat;
  -webkit-mask: var(--mark-image) center / contain no-repeat;
}
.tool-brand-mark b {
  font:
    600 12px/1 var(--font-space),
    sans-serif;
  letter-spacing: -0.08em;
}

/* A practical toolkit, laid out as an index rather than a proficiency chart. */
.toolkit-section {
  position: relative;
}
.toolkit-section::before {
  content: "";
  position: absolute;
  inset: 0 -15px;
  pointer-events: none;
  z-index: -1;
  opacity: 0.33;
  background-image:
    radial-gradient(var(--muted) 0.7px, transparent 0.8px),
    radial-gradient(var(--muted) 0.6px, transparent 0.8px);
  background-size:
    163px 139px,
    227px 211px;
  background-position:
    17px 29px,
    100px 61px;
  mask-image: linear-gradient(transparent, var(--neutral-black) 15%, var(--neutral-black) 85%, transparent);
}
.toolkit-heading {
  display: grid;
  grid-template-columns: 1fr 330px;
  gap: 40px;
  align-items: end;
  padding-bottom: 38px;
}
.toolkit-heading h2 {
  font-size: clamp(38px, 4.6vw, 68px);
  letter-spacing: -0.065em;
  margin-top: 18px;
}
.toolkit-heading > .motion-reveal > p {
  color: var(--muted);
  line-height: 1.8;
  font-size: 12px;
}
.toolkit-row {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 40px;
  border-top: 1px solid var(--line);
  padding: 30px 0;
}
.toolkit-rows > div:last-child .toolkit-row {
  border-bottom: 1px solid var(--line);
}
.toolkit-row h3 {
  font:
    500 15px/1.8 var(--font-space),
    sans-serif;
  display: flex;
  align-items: baseline;
  gap: 13px;
}
.toolkit-index {
  font-size: 9px;
  color: var(--gold);
  font-family: var(--font-inter), sans-serif;
}
.toolkit-row ul {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 24px 29px;
  list-style: none;
  padding: 0;
  margin: 0;
}
.toolkit-row li {
  display: inline-flex;
  align-items: center;
  gap: 11px;
  font-size: 14px;
  line-height: 1.5;
}
.toolkit-row .tool-brand-mark {
  width: 26px;
  height: 26px;
}
.toolkit-topic-icon {
  color: var(--muted);
  display: flex;
}
.toolkit-section .skills-note {
  text-align: left;
  margin-top: 22px;
  font-size: 10px;
}

/* Oversized type, then a quiet two-column tool directory. */
.premium-tool-heading {
  display: grid;
  grid-template-columns: 1.1fr 0.7fr;
  align-items: end;
  gap: 90px;
  margin-bottom: 52px;
}
.premium-tool-heading .eyebrow {
  margin-bottom: 23px;
}
.premium-tool-intro {
  font-size: 13px;
  color: var(--muted);
  line-height: 1.9;
  padding-bottom: 7px;
}
.premium-tool-intro span {
  display: block;
  color: var(--text);
  font-family: var(--font-space), sans-serif;
  font-size: 18px;
  line-height: 1.6;
  margin-top: 24px;
}
.premium-tool-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  column-gap: 72px;
}
.premium-tool-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 27px 0;
  border-top: 1px solid var(--line);
  height: 100%;
}
.premium-tool-logo {
  width: 62px;
  height: 62px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: var(--raised);
  border: 1px solid var(--line);
  box-shadow: inset 0 1px 0 var(--soft);
  flex-shrink: 0;
  transition: transform 0.35s;
}
.premium-tool-logo .tool-brand-mark {
  width: 31px;
  height: 31px;
}
.premium-tool-logo .tool-brand-mark b {
  font-size: 16px;
}
.premium-tool-item:hover .premium-tool-logo {
  transform: rotate(-7deg);
  border-color: var(--gold);
}
.premium-tool-item h3 {
  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.6px;
}
.premium-tool-item p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.6;
  margin-top: 6px;
}
.premium-tool-index {
  margin-left: auto;
  font-size: 9px;
  color: var(--muted);
  align-self: flex-start;
  padding-top: 8px;
}
.premium-tool-section .studio-note {
  margin-top: 26px;
  text-align: left;
  max-width: 660px;
}

/* Technical domains: asymmetric cards, grounded in the actual portfolio stack. */
.domains-section {
  padding-top: 120px;
}
.reference-about .domains-section > .text-reveal {
  max-width: none;
  font-size: clamp(36px, 4.5vw, 64px);
  margin-top: 20px;
}
.domains-section > .motion-reveal > .section-intro {
  max-width: 650px;
  font-size: 13px;
  margin-top: 18px;
}
.domains-bento {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 18px;
  margin-top: 38px;
}
.domains-bento > div {
  grid-column: span 2;
  min-width: 0;
}
.domains-bento > div:first-child,
.domains-bento > div:nth-child(4) {
  grid-column: span 3;
}
.domains-bento > div:last-child {
  grid-column: 1 / -1;
}
.domain-card {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--line);
  background: var(--surface);
  border-radius: 20px;
  padding: 30px;
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: none;
}
.domain-card:hover {
  border-color: var(--line-bright);
  background: var(--raised);
}
.domain-heading {
  display: flex;
  gap: 16px;
  align-items: center;
}
.domain-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  border-radius: 13px;
  background: color-mix(in srgb, var(--gold) 10%, transparent);
  color: var(--gold);
}
.domain-card h3 {
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.5px;
}
.domain-index {
  margin-left: auto;
  align-self: flex-start;
  font-size: 9px;
  color: var(--muted);
}
.domain-card > p {
  font-size: 12px;
  line-height: 1.85;
  color: var(--muted);
  margin: 22px 0 27px;
  max-width: 680px;
}
.domain-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  padding: 0;
  margin: auto 0 0;
  list-style: none;
}
.domain-tags li {
  padding: 6px 10px;
  font-size: 10px;
  border-radius: 6px;
  border: 1px solid var(--line);
  background: var(--soft);
}
.domain-ai {
  background: linear-gradient(
    115deg,
    color-mix(in srgb, var(--muted) 6%, var(--surface)),
    var(--surface) 70%
  );
}
.domain-demo-link {
  width: fit-content;
  display: inline-flex;
  gap: 10px;
  align-items: center;
  color: var(--gold);
  margin-top: 23px;
  font-size: 11px;
}
.domains-section .fundamentals-closing {
  max-width: 740px;
  font-size: 15px;
}

/* Experience becomes a story, without borrowed employers or invented dates. */
.journey-editorial-heading {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px 80px;
  align-items: end;
  margin-bottom: 55px;
}
.journey-editorial-heading > .motion-reveal:first-child {
  grid-column: 1 / -1;
}
.journey-story-intro h3 {
  font-size: 23px;
  line-height: 1.45;
  letter-spacing: -0.8px;
  margin-bottom: 16px;
}
.journey-story-intro p {
  font-size: 12px;
  line-height: 1.85;
  color: var(--muted);
}
.journey-editorial-entry {
  position: relative;
  display: grid;
  grid-template-columns: 70px minmax(0, 1fr);
  gap: 0 25px;
  padding: 35px 0 38px;
  border-top: 1px solid var(--line);
}
.journey-entry-index {
  grid-row: span 3;
  padding-top: 4px;
  font-size: 12px;
  color: var(--gold);
  font-family: var(--font-space), sans-serif;
}
.journey-editorial-entry header {
  display: flex;
  justify-content: space-between;
  gap: 25px;
  align-items: start;
}
.journey-entry-label {
  font-size: 8px;
  letter-spacing: 1.3px;
  color: var(--muted);
}
.journey-editorial-entry h3 {
  font-size: clamp(22px, 2.6vw, 33px);
  letter-spacing: -0.04em;
  margin: 9px 0 18px;
  line-height: 1.3;
}
.journey-entry-phase {
  display: inline-flex;
  align-items: center;
  gap: 14px;
  font-size: 10px;
  white-space: nowrap;
  padding-top: 23px;
  color: var(--muted);
}
.journey-entry-phase svg {
  color: var(--gold);
}
.journey-editorial-entry > p {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.9;
  max-width: 720px;
  padding-right: 20px;
}
.journey-editorial-entry ul {
  list-style: none;
  padding: 0;
  margin: 22px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 12px 25px;
}
.journey-editorial-entry li {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.7;
}
.journey-editorial-entry li svg {
  color: var(--gold);
  flex-shrink: 0;
}
.editorial-journey .journey-signature {
  font-size: 15px;
  padding-top: 22px;
}



/* Theme-aware invitation, with the existing functional contact form. */
.editorial-contact {
  padding-top: 60px;
  padding-bottom: 100px;
}
.contact-paper {
  color-scheme: dark;
  color: var(--text);
  background:
    radial-gradient(ellipse at 0% 0%, color-mix(in srgb, var(--muted) 7.45%, transparent), transparent 55%), var(--bg);
  border: 1px solid var(--line);
  border-radius: 26px;
  padding: clamp(28px, 4.7vw, 68px);
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
  gap: 60px;
  box-shadow: 0 30px 90px color-mix(in srgb, var(--neutral-black) 7.06%, transparent);
  position: relative;
  isolation: isolate;
}
[data-theme="light"] .contact-paper {
  color-scheme: light;
}
.contact-paper::before,
.editorial-footer::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  opacity: 0.1;
  z-index: -1;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.88' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Cpath fill='%23888' filter='url(%23grain)' opacity='.5' d='M0 0h180v180H0z'/%3E%3C/svg%3E");
}
.contact-editorial-copy {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 100px;
  min-width: 0;
}
.contact-editorial-copy h2 {
  font-size: clamp(52px, 6.5vw, 88px);
  letter-spacing: -0.075em;
  line-height: 1.1;
  margin: 22px 0;
}
.contact-invitation {
  max-width: 330px;
  font-size: 14px;
  line-height: 1.8;
}
.contact-direct > p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
  max-width: 240px;
}
.contact-address {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: clamp(13px, 1.45vw, 18px);
  letter-spacing: -0.5px;
  margin: 15px 0 30px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--line-bright);
  max-width: 100%;
  overflow-wrap: anywhere;
}
.contact-address > svg {
  flex-shrink: 0;
}
.social-icons {
  gap: 10px;
}
.social-icons a {
  width: 43px;
  height: 43px;
  padding: 0;
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--raised);
  transition: transform 0.25s;
}
.social-icons a:hover {
  transform: translateY(-3px);
  color: var(--text);
  background: var(--surface);
}
.contact-paper .social-icons a {
  background: var(--raised);
}
.contact-form-wrap {
  min-width: 0;
}
.contact-paper .contact-form {
  border: 0;
  padding: 0;
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
  border-radius: 0;
}
.contact-paper .contact-form h3 {
  font-size: 17px;
  letter-spacing: -0.5px;
  padding-top: 3px;
}
.contact-paper .form-pair {
  grid-template-columns: 1fr;
  gap: 0;
}
.contact-paper .form-field {
  margin-bottom: 19px;
}
.contact-paper .form-field label {
  font-size: 11px;
}
.contact-paper .form-field input,
.contact-paper .form-field textarea {
  border: 0;
  border-bottom: 1px solid var(--line-bright);
  border-radius: 0;
  background: transparent;
  padding: 10px 0;
  min-height: 42px;
}
.contact-paper .form-field textarea {
  min-height: 110px;
}
.contact-paper .form-field [aria-invalid="true"] {
  border-color: var(--contact-error);
}
.contact-paper .field-error {
  color: var(--contact-error);
}
.contact-paper .button-gold {
  background: var(--gold);
  border-color: var(--gold);
  color: var(--bg);
  width: 100%;
  min-height: 49px;
}
.contact-paper .button-gold:hover {
  background: var(--gold);
  box-shadow: none;
}
.contact-paper .form-failure {
  color: var(--contact-error);
  border-color: color-mix(in srgb, var(--contact-error) 40%, transparent);
  background: color-mix(in srgb, var(--contact-error) 5%, transparent);
}
.contact-paper .form-success {
  color: var(--contact-success);
}
.contact-paper a:focus-visible,
.contact-paper button:focus-visible,
.contact-paper input:focus-visible,
.contact-paper textarea:focus-visible {
  outline-color: var(--gold);
}

/* A bold directory, huge cropped wordmark and a neutral wave sign-off. */
.editorial-footer {
  position: relative;
  isolation: isolate;
  border-top: 1px solid var(--line);
  padding-top: 90px;
  overflow: hidden;
}
.footer-top-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr 0.8fr;
  gap: 60px;
  align-items: start;
}
.footer-editorial-invitation > .motion-reveal:first-child .eyebrow {
  max-width: 240px;
  font-size: 8px;
  line-height: 1.8;
}
.footer-editorial-invitation h2 {
  font-size: clamp(37px, 4.4vw, 64px);
  line-height: 1.04;
  letter-spacing: -0.065em;
  margin: 20px 0;
}
.footer-editorial-invitation > .motion-reveal > p:not(.eyebrow) {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
  max-width: 275px;
}
.footer-quick-links h3,
.footer-contact-column h3 {
  font-size: 19px;
  font-weight: 500;
  letter-spacing: -0.6px;
  margin: 43px 0 23px;
}
.footer-quick-links > div {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  max-width: 265px;
}
.footer-quick-links a {
  font-size: 11px;
  line-height: 1.5;
  padding: 9px 14px;
  border-radius: 7px;
  background: var(--text);
  color: var(--bg);
  transition: none;
}
.footer-quick-links a:hover {
  background: var(--gold);
  color: var(--bg);
}
.footer-contact-address {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  line-height: 1.8;
  overflow-wrap: anywhere;
  max-width: 100%;
}
.footer-contact-address svg {
  flex-shrink: 0;
}
.footer-brief-link {
  display: flex;
  width: fit-content;
  align-items: center;
  gap: 7px;
  margin-top: 22px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.8;
}
.footer-brief-link svg {
  flex-shrink: 0;
}
.footer-wordmark-window {
  position: relative;
  height: clamp(110px, 20vw, 350px);
  overflow: hidden;
  margin-top: 75px;
  user-select: none;
}
.footer-wordmark-window > span {
  display: block;
  text-align: center;
  text-transform: uppercase;
  font:
    600 clamp(100px, 27vw, 480px) / 0.88 var(--font-space),
    sans-serif;
  letter-spacing: -0.08em;
  padding-right: 0.07em;
  transform: translateY(6%);
  color: transparent;
  background: linear-gradient(
    105deg,
    color-mix(in srgb, var(--text) 9%, transparent) 20%,
    color-mix(in srgb, var(--text) 24%, transparent) 48%,
    color-mix(in srgb, var(--text) 9%, transparent) 76%
  );
  background-size: 220% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  animation: editorial-wordmark-shine 14s ease-in-out infinite alternate;
}
.footer-signoff {
  position: relative;
  margin-top: -1px;
  padding: 65px 0 22px;
  color: var(--text);
  background: var(--bg);
}
.footer-waves {
  position: absolute;
  left: 0;
  right: 0;
  top: -64px;
  height: 65px;
  pointer-events: none;
  overflow: hidden;
}
.footer-waves svg {
  display: block;
  width: 110%;
  height: 100%;
  margin-left: -5%;
}
.footer-waves path {
  fill: var(--text);
}
.footer-waves path:first-child {
  fill: var(--text);
  opacity: 0.7;
  animation: editorial-wave 16s ease-in-out infinite alternate;
}
.footer-waves path:nth-child(2) {
  fill: var(--text);
  animation: editorial-wave 22s ease-in-out infinite alternate-reverse;
}
.footer-emblem {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: fit-content;
  margin: 0 auto;
}
.footer-emblem > span {
  display: grid;
  place-items: center;
  width: 94px;
  height: 94px;
  border-radius: 50%;
  position: relative;
  background: radial-gradient(ellipse, color-mix(in srgb, var(--muted) 12.55%, transparent), transparent 70%);
}
.footer-emblem > span::before {
  content: "";
  position: absolute;
  inset: 0;
  border: 1px solid color-mix(in srgb, var(--accent-text) 21.18%, transparent);
  border-radius: 50%;
}
.footer-emblem > span::after {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid transparent;
  border-top-color: color-mix(in srgb, var(--accent-text) 53.33%, transparent);
  animation: editorial-emblem 16s linear infinite;
}
.footer-emblem strong {
  font:
    500 18px/1.4 var(--font-space),
    sans-serif;
  letter-spacing: -0.8px;
  margin-top: 13px;
}
.footer-signature {
  text-align: center;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
  max-width: 390px;
  margin: 14px auto 23px;
}
.footer-social-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
}
.footer-social-row .social-icons a {
  border-color: color-mix(in srgb, var(--text) 12.94%, transparent);
  background: color-mix(in srgb, var(--text) 2.35%, transparent);
}
.footer-email-icon {
  display: flex;
  align-items: center;
  gap: 15px;
  height: 43px;
  font-size: 11px;
  border-left: 1px solid var(--line);
  padding-left: 24px;
  margin-left: 10px;
}
.footer-editorial-colophon {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 25px;
  align-items: center;
  border-top: 1px solid var(--line);
  padding-top: 24px;
  margin-top: 55px;
  font-size: 9px;
  color: var(--muted);
}
.footer-editorial-colophon nav {
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 20px;
  flex-wrap: wrap;
}
.footer-editorial-colophon .cookie-settings-link {
  color: inherit;
  font-size: inherit;
}
.footer-editorial-colophon a:hover,
.footer-editorial-colophon button:hover {
  color: var(--text);
}
.footer-top-link {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: 1px solid var(--line);
  border-radius: 50%;
  font-size: 16px;
  color: var(--text);
}
.footer-editorial-credit {
  color: var(--muted);
  font-size: 8px;
  text-align: center;
  margin-top: 23px;
}
@keyframes editorial-wordmark-shine {
  from {
    background-position: 0% 50%;
  }
  to {
    background-position: 100% 50%;
  }
}
@keyframes editorial-wave {
  from {
    transform: translateX(-2%);
  }
  to {
    transform: translateX(2%);
  }
}
@keyframes editorial-emblem {
  to {
    transform: rotate(360deg);
  }
}

@media (min-width: 1700px) {
  .footer-wordmark-window > span {
    font-size: 25vw;
  }
  .footer-wordmark-window {
    height: 19vw;
  }
}
@media (max-width: 1100px) {
  .toolkit-row {
    grid-template-columns: 170px minmax(0, 1fr);
    gap: 25px;
  }
  .premium-tool-heading {
    gap: 45px;
  }
  .premium-tool-grid {
    column-gap: 40px;
  }
  .contact-paper {
    gap: 35px;
  }
  .footer-top-grid {
    gap: 35px;
    grid-template-columns: 1fr 1fr;
  }
  .footer-editorial-invitation {
    grid-row: span 2;
  }
  .footer-quick-links h3,
  .footer-contact-column h3 {
    margin-top: 8px;
  }
}
@media (max-width: 760px) {
  .toolkit-heading {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .toolkit-heading > .motion-reveal > p {
    max-width: 400px;
  }
  .toolkit-row {
    grid-template-columns: 1fr;
    gap: 22px;
    padding: 25px 0;
  }
  .toolkit-row li {
    font-size: 12px;
  }
  .toolkit-row ul {
    gap: 20px 24px;
  }
  .toolkit-row .tool-brand-mark {
    width: 24px;
    height: 24px;
  }
  .premium-tool-heading {
    grid-template-columns: 1fr;
    gap: 30px;
    margin-bottom: 30px;
  }
  .premium-tool-heading .split-display {
    font-size: clamp(62px, 11vw, 95px);
  }
  .premium-tool-intro {
    max-width: 440px;
  }
  .premium-tool-intro span {
    font-size: 16px;
    margin-top: 17px;
  }
  .premium-tool-grid {
    column-gap: 24px;
  }
  .premium-tool-item {
    gap: 13px;
    padding: 22px 0;
  }
  .premium-tool-item h3 {
    font-size: 17px;
  }
  .premium-tool-item p {
    font-size: 10px;
  }
  .premium-tool-logo {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
  .premium-tool-logo .tool-brand-mark {
    width: 26px;
    height: 26px;
  }
  .premium-tool-index {
    display: none;
  }
  .domains-section {
    padding-top: 80px;
  }
  .domains-bento {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 13px;
  }
  .domains-bento > div:nth-child(n) {
    grid-column: auto;
  }
  .domains-bento > div:last-child {
    grid-column: 1 / -1;
  }
  .domain-card {
    padding: 23px;
  }
  .domain-heading {
    gap: 11px;
    align-items: flex-start;
  }
  .domain-card h3 {
    font-size: 16px;
    line-height: 1.5;
  }
  .domain-index {
    display: none;
  }
  .domain-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
  }
  .domain-card > p {
    font-size: 11px;
  }
  .domain-tags li {
    font-size: 9px;
    padding: 5px 8px;
  }
  .journey-editorial-heading {
    grid-template-columns: 1fr;
    gap: 26px;
    margin-bottom: 35px;
  }
  .journey-editorial-heading > .motion-reveal:first-child {
    margin-bottom: -7px;
  }
  .journey-editorial-heading .split-display {
    font-size: clamp(68px, 15vw, 110px);
  }
  .journey-story-intro {
    max-width: 510px;
  }
  .journey-editorial-entry {
    grid-template-columns: 34px minmax(0, 1fr);
    gap: 0 12px;
    padding: 29px 0;
  }
  .journey-editorial-entry header {
    flex-direction: column;
    gap: 0;
  }
  .journey-entry-phase {
    padding: 0;
    margin-bottom: 18px;
  }
  .journey-editorial-entry h3 {
    margin-bottom: 13px;
  }
  .journey-editorial-entry > p {
    padding: 0;
  }
  .journey-editorial-entry ul {
    display: grid;
    gap: 8px;
    margin-top: 17px;
  }
  .editorial-contact {
    padding-bottom: 70px;
  }
  .contact-paper {
    grid-template-columns: 1fr;
    gap: 50px;
  }
  .contact-editorial-copy {
    gap: 45px;
  }
  .contact-editorial-copy h2 {
    font-size: clamp(57px, 11vw, 84px);
  }
  .contact-direct {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0 20px;
  }
  .contact-direct > p {
    flex-basis: 100%;
  }
  .contact-address {
    font-size: 15px;
    margin: 14px 0;
  }
  .contact-paper .form-pair {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 18px;
  }
  .footer-top-grid {
    gap: 32px;
  }
  .footer-editorial-invitation {
    grid-row: auto;
    grid-column: 1 / -1;
  }
  .footer-editorial-invitation h2 {
    font-size: 52px;
  }
  .footer-editorial-invitation > .motion-reveal > p:not(.eyebrow) {
    max-width: 340px;
  }
  .footer-quick-links h3,
  .footer-contact-column h3 {
    font-size: 17px;
  }
  .footer-contact-address {
    font-size: 11px;
  }
  .footer-quick-links a {
    font-size: 10px;
    padding: 8px 11px;
  }
  .footer-wordmark-window {
    margin-top: 55px;
  }
  .footer-signoff {
    padding-top: 45px;
  }
  .footer-waves {
    height: 40px;
    top: -39px;
  }
  .footer-editorial-colophon {
    grid-template-columns: 1fr auto;
    gap: 20px;
    margin-top: 40px;
  }
  .footer-editorial-colophon > p {
    grid-column: 1;
  }
  .footer-editorial-colophon nav {
    grid-row: 2;
    grid-column: 1 / -1;
    justify-content: start;
    gap: 13px 22px;
  }
  .footer-top-link {
    grid-column: 2;
    grid-row: 1;
  }
}
@media (max-width: 480px) {
  .premium-tool-grid {
    grid-template-columns: 1fr;
  }
  .premium-tool-item {
    padding: 18px 0;
    gap: 18px;
  }
  .premium-tool-item h3 {
    font-size: 18px;
  }
  .premium-tool-item p {
    font-size: 11px;
  }
  .premium-tool-index {
    display: block;
  }
  .domains-bento {
    grid-template-columns: 1fr;
  }
  .domains-bento > div:nth-child(n) {
    grid-column: 1;
  }
  .domain-card {
    padding: 24px;
  }
  .domain-heading {
    align-items: center;
  }
  .domain-card h3 {
    font-size: 17px;
  }
  .domain-card > p {
    font-size: 12px;
  }
  .contact-paper {
    border-radius: 20px;
    padding: 29px 23px;
  }
  .contact-editorial-copy h2 {
    font-size: clamp(48px, 14vw, 68px);
  }
  .contact-invitation {
    font-size: 12px;
  }
  .contact-paper .form-pair {
    grid-template-columns: 1fr;
    gap: 0;
  }
  .contact-paper .social-icons a {
    width: 39px;
    height: 39px;
  }
  .contact-address {
    font-size: 13px;
    gap: 5px;
  }
  .footer-top-grid {
    grid-template-columns: 1fr;
  }
  .footer-editorial-invitation {
    grid-column: 1;
  }
  .footer-editorial-invitation h2 {
    font-size: 45px;
  }
  .footer-quick-links h3,
  .footer-contact-column h3 {
    margin: 8px 0 19px;
  }
  .footer-quick-links > div {
    max-width: 300px;
  }
  .footer-quick-links a {
    font-size: 11px;
  }
  .footer-contact-address {
    font-size: 13px;
  }
  .footer-wordmark-window {
    height: 23vw;
  }
  .footer-wordmark-window > span {
    font-size: 27vw;
  }
  .footer-signature {
    max-width: 270px;
    font-size: 10px;
  }
  .footer-social-row {
    gap: 8px;
  }
  .footer-email-icon {
    margin-left: 2px;
    padding-left: 16px;
    gap: 8px;
  }
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .footer-wordmark-window > span,
  html:not([data-motion="full"]) .footer-waves path,
  html:not([data-motion="full"]) .footer-emblem > span::after {
    animation: none;
  }
  html:not([data-motion="full"]) .premium-tool-item:hover .premium-tool-logo,
  html:not([data-motion="full"]) .social-icons a:hover {
    transform: none;
  }
}
html[data-motion="reduced"] .premium-tool-item:hover .premium-tool-logo,
html[data-motion="reduced"] .social-icons a:hover {
  transform: none;
}
html[data-motion="reduced"] .footer-wordmark-window > span,
html[data-motion="reduced"] .footer-waves path,
html[data-motion="reduced"] .footer-emblem > span::after {
  animation: none;
}
``````

## app/error.tsx

``````tsx
"use client";
import { site } from "@/data/site";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main-content" className="error-page">
      <p className="eyebrow">{site.brand}</p>
      <h1>{site.errors.title}</h1>
      <p>{site.errors.description}</p>
      <button className="button button-gold" onClick={reset}>
        {site.errors.retry}
      </button>
    </main>
  );
}
``````

## app/finishing.css

``````css
/* Small, shared additions complete the motion brief without another animation library. */
:root {
  --space-1: 8px;
  --space-2: 16px;
  --space-3: 24px;
  --space-4: 32px;
  --space-6: 48px;
  --space-8: 64px;
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 24px;
  --shadow-soft: 0 12px 36px color-mix(in srgb, var(--neutral-black) 4.71%, transparent);
  --shadow-deep: 0 20px 60px color-mix(in srgb, var(--neutral-black) 10.2%, transparent);
}
.expertise-marquee {
  width: min(600px, 65%);
  overflow: hidden;
  mask-image: linear-gradient(
    90deg,
    transparent,
    var(--neutral-black) 4%,
    var(--neutral-black) 94%,
    transparent
  );
}
.expertise-marquee-track {
  display: flex;
  width: max-content;
  animation: expertise-travel 30s linear infinite;
}
.expertise-marquee-track .expertise-list {
  flex-shrink: 0;
  display: flex;
  width: auto;
  gap: 28px;
  padding-right: 28px;
}
.expertise-marquee-track .expertise-list span {
  white-space: nowrap;
}
.expertise-marquee:hover .expertise-marquee-track {
  animation-play-state: paused;
}
@keyframes expertise-travel {
  to {
    transform: translateX(-50%);
  }
}
.hero-visual {
  position: relative;
  overflow: clip;
}
.hero-visual::after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 2;
  background: var(--bg);
  pointer-events: none;
  transform: translateY(-110%);
  animation: hero-curtain 0.85s cubic-bezier(0.22, 1, 0.36, 1) both;
}
@keyframes hero-curtain {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-110%);
  }
}
.scene-wash {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background: radial-gradient(ellipse at 78% 30%, var(--muted), transparent 65%);
  opacity: 0;
  transition: opacity 0.75s var(--ease-editorial);
}
.faq-answer {
  overflow: hidden;
}
.faq-list summary {
  min-height: 64px;
  align-items: baseline;
}
.faq-list summary::after {
  flex-shrink: 0;
}
@media (hover: hover) and (pointer: fine) {
  [data-parallax="hero"] {
    translate: 0 var(--image-drift, 0px);
  }
  [data-parallax="image"] img {
    translate: 0 var(--image-drift, 0px);
    scale: 1.08;
  }
}
[data-motion-reveals="enabled"] .motion-reveal .interface-study-image img {
  transition: transform 0.8s var(--ease-editorial);
}
[data-motion-reveals="enabled"]
  .motion-reveal:not(.is-revealed)
  .interface-study-image
  img {
  transform: scale(1.15);
}
[data-motion-reveals="enabled"]
  .motion-reveal.is-revealed
  .interface-study-image
  img {
  transform: scale(1);
}
[data-motion-reveals="enabled"]
  .motion-reveal.is-revealed
  .interface-study-card:hover
  img {
  transform: scale(1.035);
}
.button-ghost {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text);
}
@media (min-width: 1024px) {
  .hero {
    grid-template-columns: repeat(12, minmax(0, 1fr));
  }
  .hero-copy {
    grid-column: span 7;
  }
  .hero-visual {
    grid-column: span 5;
  }
  .hero-bottom {
    grid-column: 1 / -1;
  }
}
@media (max-width: 700px) {
  .expertise-marquee {
    width: min(100%, 460px);
  }
  .hero-bottom {
    row-gap: 24px;
  }
  .motion-control select {
    max-width: 66px;
  }
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .expertise-marquee-track {
    animation: none;
  }
  html:not([data-motion="full"]) [data-parallax] img,
  html:not([data-motion="full"]) [data-parallax="hero"] {
    translate: none;
    scale: none;
  }
}
html[data-motion="reduced"] .expertise-marquee-track {
  animation: none;
}
html[data-motion="reduced"] [data-parallax] img,
html[data-motion="reduced"] [data-parallax="hero"] {
  translate: none;
  scale: none;
}
/* Marquee tracks must not contribute their intrinsic width to the mobile grid. */
.hero > * {
  min-width: 0;
}
.expertise-marquee {
  min-width: 0;
  max-width: 100%;
}
.hero-visual {
  max-width: 100%;
}
@media (max-width: 1023px) {
  .hero {
    grid-template-columns: minmax(0, 1fr);
  }
}
.hero-visual {
  animation-duration: 0.9s;
  animation-delay: 0s;
}

/* The website edit: an asymmetric gallery with generous, unframed previews. */
.work-section {
  width: min(1380px, calc(100% - 80px));
  max-width: 1380px;
}
.work-collection-label {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 22px 0;
  margin-bottom: 18px;
  border-top: 1px solid var(--line-bright);
  color: var(--muted);
  font-size: 10px;
  letter-spacing: 1.6px;
  line-height: 1.6;
}
.work-collection-label > span:first-child {
  color: var(--gold);
}
.curated-projects-grid {
  gap: 72px 44px;
  align-items: start;
}
.curated-project {
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  overflow: visible;
}
.curated-project:hover {
  transform: none;
  box-shadow: none;
}
.curated-project .project-info {
  align-items: start;
  padding: 0 0 24px;
  gap: 20px;
}
.curated-project .project-industry {
  font-size: 10px;
  line-height: 1.6;
  letter-spacing: 1.3px;
}
.curated-project .project-info h3 {
  font-size: clamp(28px, 3.1vw, 44px);
  font-weight: 500;
  line-height: 1.1;
  letter-spacing: -1.8px;
  margin-top: 10px;
}
.curated-project .project-info p {
  font-size: 12px;
  line-height: 1.7;
  margin-top: 12px;
  max-width: 36ch;
}
.curated-project-index {
  flex-shrink: 0;
  font-family: var(--font-space), sans-serif;
  font-size: 13px;
  color: var(--gold);
  padding-top: 4px;
}
.curated-project .device-stage {
  aspect-ratio: 1.2;
  border: 1px solid var(--line);
  border-radius: 18px;
  background:
    radial-gradient(
      ellipse at 65% 30%,
      color-mix(in srgb, var(--project-accent) 15%, transparent),
      transparent 70%
    ),
    linear-gradient(145deg, var(--raised), var(--surface) 70%);
}
.curated-format {
  position: absolute;
  left: 24px;
  top: 24px;
  font-size: 8px;
  letter-spacing: 1.8px;
  color: var(--muted);
}
.curated-project .device-float {
  inset: 15% 4% 14%;
}
.curated-project .device-view {
  left: auto;
  right: 20px;
  bottom: 20px;
  gap: 14px;
  padding: 12px 16px;
  min-height: 44px;
  border: 1px solid var(--line-bright);
  border-radius: 999px;
  background: var(--bg);
  color: var(--text);
  font-size: 10px;
}
.curated-project .device-view svg {
  transition: transform 0.3s var(--ease-editorial);
}
.curated-project:hover .device-view svg {
  transform: translate(2px, -2px);
}
.curated-project .project-footer {
  border: 0;
  padding: 18px 0 0;
  font-size: 10px;
}
.contact-paper::before {
  opacity: 0.035;
}
.contact-paper .contact-form h3 {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 24px;
}
.contact-paper .form-field input,
.contact-paper .form-field textarea,
.contact-paper .form-field select {
  color: var(--text);
  border-color: var(--line-bright);
}
.contact-paper .form-field input:focus,
.contact-paper .form-field textarea:focus,
.contact-paper .form-field select:focus {
  border-color: var(--gold);
}
.contact-paper .social-icons a {
  width: 44px;
  height: 44px;
}
@media (min-width: 1100px) {
  .curated-projects-grid {
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 100px 48px;
  }
  .curated-projects-grid > :nth-child(4n + 1),
  .curated-projects-grid > :nth-child(4n + 4) {
    grid-column: span 7;
  }
  .curated-projects-grid > :nth-child(4n + 2),
  .curated-projects-grid > :nth-child(4n + 3) {
    grid-column: span 5;
  }
  .curated-projects-grid > :nth-child(4n + 2) {
    margin-top: 150px;
  }
  .curated-projects-grid > :nth-child(4n + 4) {
    margin-top: 100px;
  }
  .curated-projects-grid > :nth-child(4n + 1) .device-stage,
  .curated-projects-grid > :nth-child(4n + 4) .device-stage {
    aspect-ratio: 1.35;
  }
}
@media (max-width: 767px) {
  .work-section {
    width: calc(100% - 40px);
  }
  .curated-projects-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 48px;
  }
  .work-collection-label {
    font-size: 8px;
    letter-spacing: 1px;
  }
  .curated-project .project-info {
    padding-bottom: 20px;
  }
  .curated-format {
    left: 18px;
    top: 18px;
  }
  .curated-project .device-view {
    right: 14px;
    bottom: 14px;
  }
}
``````

## app/global-error.tsx

``````tsx
"use client";
import { site } from "@/data/site";
import palette from "@/data/theme-tokens.json";
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          background: palette.dark.background,
          color: palette.dark.text,
          fontFamily: "system-ui",
          padding: 40,
        }}
      >
        <main>
          <h1>{site.errors.title}</h1>
          <p>{site.errors.description}</p>
          <button onClick={reset}>{site.errors.retry}</button>
        </main>
      </body>
    </html>
  );
}
``````

## app/globals.css

``````css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: dark;
}
[data-theme="light"] {
  color-scheme: light;
}
* {
  box-sizing: border-box;
}
html {
  scroll-behavior: smooth;
  scroll-padding-top: 100px;
}
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: var(--font-inter), sans-serif;
  font-size: 14px;
  -webkit-font-smoothing: antialiased;
}
body:has(dialog[open]) {
  overscroll-behavior: none;
}
button,
a {
  -webkit-tap-highlight-color: transparent;
}
button {
  font: inherit;
  color: inherit;
  cursor: pointer;
}
a {
  color: inherit;
  text-decoration: none;
}
button,
h1,
h2,
h3,
p,
figure {
  margin: 0;
}
button {
  border: 0;
}
button:disabled {
  cursor: default;
}
img {
  max-width: 100%;
}
[hidden] {
  display: none !important;
}
::selection {
  background: color-mix(in srgb, var(--accent-text) 25.1%, transparent);
  color: var(--text);
}
:focus-visible {
  outline: 2px solid var(--gold);
  outline-offset: 5px;
  border-radius: 5px;
}
h1,
h2,
h3,
.wordmark {
  font-family: var(--font-space), sans-serif;
  font-weight: 500;
}
.container {
  width: min(1180px, calc(100% - 80px));
  margin-inline: auto;
}
.eyebrow {
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 2px;
  line-height: 1.8;
  color: var(--gold);
}
.glass {
  background: var(--glass);
  border: 1px solid var(--line);
  backdrop-filter: blur(20px);
}
.gold-text {
  color: var(--gold);
}
.icon-button {
  width: 44px;
  height: 44px;
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: transparent;
  color: var(--muted);
  transition: none;
}
.icon-button:hover {
  background: var(--raised);
  color: var(--text);
}
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  min-height: 50px;
  padding: 14px 24px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  transition: transform 0.25s;
}
.button:hover {
  transform: translateY(-3px);
}
.button-gold {
  background: var(--accent);
  color: var(--text);
  border: 1px solid var(--accent-text);
  box-shadow: 0 4px 24px color-mix(in srgb, var(--neutral-black) 6.27%, transparent);
}
.button-gold:hover {
  background: var(--accent);
  box-shadow: 0 8px 28px color-mix(in srgb, var(--neutral-black) 13.73%, transparent);
}
.button-outline {
  border: 1px solid var(--line);
  background: var(--soft);
  color: var(--text);
}
.button-outline:hover {
  background: var(--raised);
}
.skip-link {
  position: fixed;
  top: -100px;
  left: 20px;
  padding: 14px 20px;
  border-radius: 5px;
  background: var(--accent);
  color: var(--text);
  z-index: 100;
}
.skip-link:focus {
  top: 12px;
}
.ambient-background {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}
.ambient-background span {
  position: absolute;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, color-mix(in srgb, var(--muted) 4.31%, transparent), transparent 68%);
  top: -100px;
  right: -250px;
  animation: drift 20s ease-in-out infinite alternate;
}
.ambient-background span:last-child {
  top: 650px;
  left: -450px;
  background: radial-gradient(circle, color-mix(in srgb, var(--muted) 3.14%, transparent), transparent 68%);
  animation-delay: -10s;
}
@keyframes drift {
  to {
    transform: translate(-60px, 90px);
  }
}
.site-header {
  position: sticky;
  top: 0;
  z-index: 30;
  border-bottom: 1px solid var(--line);
  background: var(--glass);
  backdrop-filter: blur(22px);
}
.nav-row {
  position: relative;
  height: 82px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}
.wordmark {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  font-size: 30px;
  font-weight: 600;
  letter-spacing: -2px;
}
.brand-symbol {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border-radius: 12px;
}
.wordmark span {
  color: var(--gold);
}
.desktop-nav {
  display: flex;
  gap: 30px;
  margin-left: auto;
  align-items: center;
}
.desktop-nav a {
  padding-block: 14px;
  color: var(--muted);
  font-size: 11px;
  transition: none;
}
.desktop-nav a:hover {
  color: var(--gold);
}
.nav-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}
.theme-toggle {
  border: 1px solid var(--line);
  width: 37px;
  height: 37px;
}
.moon-icon,
[data-theme="light"] .sun-icon {
  display: none;
}
[data-theme="light"] .moon-icon {
  display: block;
}
.menu-toggle {
  display: none;
}
.mobile-nav {
  position: absolute;
  top: calc(100% + 1px);
  left: -20px;
  right: -20px;
  padding: 14px 20px 22px;
  background: var(--surface);
  border-bottom: 1px solid var(--line);
  box-shadow: 0 22px 30px color-mix(in srgb, var(--neutral-black) 18.82%, transparent);
}
.mobile-nav a {
  display: block;
  padding: 15px 10px;
  font-size: 15px;
  color: var(--muted);
}
.mobile-nav a:hover {
  color: var(--gold);
}
.hero {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  align-items: center;
  gap: 44px;
  padding-top: 91px;
}
.hero-copy .eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 9px;
  letter-spacing: 1.7px;
}
.tiny-line {
  display: inline-block;
  width: 24px;
  height: 1px;
  background: var(--gold);
  flex-shrink: 0;
}
h1 {
  margin-top: 26px;
  font-size: clamp(44px, 4.7vw, 65px);
  line-height: 1.12;
  letter-spacing: -3px;
}
.hero-intro {
  max-width: 470px;
  margin-top: 26px;
  font-size: 14px;
  color: var(--text);
  line-height: 1.9;
}
.hero-tagline {
  max-width: 470px;
  margin-top: 16px;
  font-size: 12px;
  color: var(--muted);
  line-height: 1.9;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 29px;
}
.hero-note {
  margin-top: 22px;
  font-size: 10px;
  color: var(--muted);
  letter-spacing: 0.3px;
}
.hero-visual {
  position: relative;
  padding: 20px 25px 22px;
}
.portrait-card {
  position: relative;
  z-index: 1;
  padding: 14px;
  background: linear-gradient(145deg, var(--raised), var(--surface));
  border: 1px solid var(--line);
  border-radius: 16px;
  box-shadow: 0 30px 70px color-mix(in srgb, var(--neutral-black) 14.51%, transparent);
  transform: rotate(3deg);
}
.portrait-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px 5px 14px;
  color: var(--muted);
  font-size: 9px;
  letter-spacing: 2px;
}
.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 12px color-mix(in srgb, var(--neutral-black) 40%, transparent);
}
.portrait-image {
  position: relative;
  aspect-ratio: 1 / 1.02;
  overflow: hidden;
  border-radius: 8px;
}
.portrait-image img {
  object-fit: cover;
}
.portrait-image::after {
  content: "";
  position: absolute;
  inset: 50% 0 0;
  background: linear-gradient(transparent, color-mix(in srgb, var(--neutral-black) 37.65%, transparent));
  pointer-events: none;
}
.portrait-placeholder {
  position: absolute;
  bottom: 15px;
  left: 16px;
  color: var(--text);
  font-size: 9px;
  letter-spacing: 1px;
  z-index: 1;
}
.portrait-card figcaption {
  padding: 19px 8px 9px;
}
.portrait-card figcaption .eyebrow {
  display: block;
  font-size: 8px;
  letter-spacing: 1.5px;
}
.portrait-card figcaption strong {
  display: block;
  font-family: var(--font-space), sans-serif;
  font-size: 23px;
  font-weight: 500;
  margin-top: 5px;
}
.portrait-card figcaption p {
  color: var(--muted);
  margin-top: 5px;
  font-size: 10px;
}
.portrait-orbit {
  position: absolute;
  width: 105%;
  aspect-ratio: 1;
  left: -1%;
  top: 0;
  border: 1px solid color-mix(in srgb, var(--accent-text) 10.2%, transparent);
  border-radius: 50%;
}
.portrait-orbit::after {
  content: "";
  position: absolute;
  inset: 25px -8px;
  border: 1px solid color-mix(in srgb, var(--accent-text) 12.16%, transparent);
  border-radius: 50%;
}
.floating-note {
  position: absolute;
  bottom: 105px;
  left: -28px;
  z-index: 2;
  padding: 15px 17px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 10px 35px color-mix(in srgb, var(--neutral-black) 14.51%, transparent);
}
.floating-note svg {
  color: var(--gold);
}
.floating-note span {
  font-size: 8px;
  letter-spacing: 1px;
  max-width: 125px;
  line-height: 1.7;
}
.visual-coordinates {
  position: absolute;
  right: -20px;
  top: 42%;
  writing-mode: vertical-rl;
  font-size: 8px;
  letter-spacing: 3px;
  color: var(--muted);
}
.hero-bottom {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 38px 0 32px;
  border-bottom: 1px solid var(--line);
}
.expertise-list {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
}
.expertise-list span {
  font-size: 10px;
  color: var(--muted);
}
.expertise-list span::before {
  content: "+";
  margin-right: 10px;
  color: var(--gold);
}
.scroll-link {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 8px;
  letter-spacing: 1.5px;
  color: var(--muted);
}
.scroll-link svg {
  color: var(--gold);
}
.work-section {
  padding-top: 100px;
}
.section-heading {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 50px;
}
h2 {
  font-size: clamp(28px, 3vw, 38px);
  letter-spacing: -1.4px;
  line-height: 1.2;
}
.section-heading h2 {
  max-width: 430px;
  margin-top: 15px;
}
.section-heading > p {
  color: var(--muted);
  max-width: 335px;
  font-size: 11px;
  line-height: 1.9;
}
.service-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-top: 40px;
  margin-bottom: 35px;
}
.service-tabs button {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 88px;
  text-align: left;
  padding: 20px 24px;
  border: 1px solid var(--line);
  border-radius: 9px;
  background: var(--soft);
  transition: none;
}
.service-tabs button[aria-selected="true"] {
  border-color: color-mix(in srgb, var(--accent-text) 43.92%, transparent);
  background: color-mix(in srgb, var(--accent-text) 2.75%, transparent);
}
.service-tabs button:hover {
  background: var(--raised);
}
.tab-icon {
  width: 36px;
  height: 36px;
  background: var(--raised);
  display: grid;
  place-items: center;
  border-radius: 7px;
  color: var(--muted);
}
[aria-selected="true"] .tab-icon {
  color: var(--gold);
  background: color-mix(in srgb, var(--accent-text) 7.06%, transparent);
}
.service-tabs strong {
  display: block;
  font-family: var(--font-space), sans-serif;
  font-weight: 500;
  font-size: 16px;
}
.service-tabs small {
  display: block;
  font-size: 9px;
  color: var(--muted);
  margin-top: 5px;
}
.tab-count,
.tab-lock {
  margin-left: auto;
  color: var(--muted);
}
.tab-count {
  font-size: 10px;
}
.projects-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 26px;
}
.projects-grid > div {
  min-width: 0;
}
.project-card {
  display: block;
  width: 100%;
  text-align: left;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px 10px 0;
  overflow: hidden;
  transition: transform 0.3s;
}
.project-card:hover {
  border-color: color-mix(in srgb, var(--accent-text) 37.65%, transparent);
  transform: translateY(-4px);
  box-shadow: 0 15px 45px color-mix(in srgb, var(--neutral-black) 9.41%, transparent);
}
.browser-frame {
  border: 1px solid var(--line);
  border-radius: 7px;
  overflow: hidden;
}
.browser-bar {
  height: 29px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 10px;
  background: var(--raised);
  color: var(--muted);
}
.browser-bar > span {
  font-size: 7px;
  letter-spacing: 0.5px;
}
.browser-dots {
  display: flex;
  gap: 4px;
}
.browser-dots i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--muted);
  opacity: 0.5;
}
.project-image {
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--raised);
  overflow: hidden;
}
.project-image img {
  object-fit: cover;
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}
.project-card:hover .project-image img,
.project-card:focus-visible .project-image img {
  transform: scale(1.045);
}
.image-placeholder-label {
  position: absolute;
  left: 10px;
  bottom: 9px;
  padding: 4px 6px;
  background: color-mix(in srgb, var(--neutral-black) 85.1%, transparent);
  color: var(--text);
  border-radius: 3px;
  font-size: 6px;
  letter-spacing: 1px;
}
.project-overlay {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--neutral-black) 31.37%, transparent);
  opacity: 0;
  transition: opacity 0.3s;
}
.project-card:hover .project-overlay,
.project-card:focus-visible .project-overlay {
  opacity: 1;
}
.project-overlay > span {
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 13px 18px;
  background: color-mix(in srgb, var(--text) 85.1%, transparent);
  color: var(--text);
  backdrop-filter: blur(12px);
  border-radius: 6px;
  font-size: 11px;
}
.project-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  padding: 23px 13px 22px;
}
.project-industry {
  font-size: 8px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1.5px;
}
.project-info h3 {
  font-size: 24px;
  letter-spacing: -0.7px;
  margin-top: 7px;
}
.project-info p {
  font-size: 10px;
  color: var(--muted);
  margin-top: 7px;
  line-height: 1.6;
}
.project-arrow {
  color: var(--muted);
  margin-right: 4px;
}
.project-footer {
  border-top: 1px solid var(--line);
  padding: 13px;
  display: flex;
  justify-content: space-between;
  color: var(--muted);
  font-size: 8px;
  letter-spacing: 0.5px;
}
.project-footer > span:first-child {
  display: flex;
  align-items: center;
  gap: 7px;
}
.project-footer i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
}
.work-disclaimer {
  font-size: 10px;
  color: var(--muted);
  text-align: center;
  line-height: 1.9;
  margin-top: 28px;
}
.work-disclaimer span {
  font-size: 9px;
}
.bot-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  min-height: 440px;
  padding: 50px 24px;
  border-radius: 12px;
  gap: 20px;
}
.bot-placeholder > svg {
  color: var(--gold);
}
.bot-placeholder h3 {
  font-size: 30px;
  letter-spacing: -1px;
}
.bot-placeholder > p:last-child {
  max-width: 480px;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.9;
}
.anchor-note {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px 15px;
  margin-top: 55px;
  padding: 22px;
  border: 1px dashed var(--line);
  border-radius: 8px;
  color: var(--muted);
  font-size: 11px;
}
.anchor-note svg {
  color: var(--gold);
}
.anchor-note > span:last-child {
  font-size: 9px;
  color: var(--muted);
  border-left: 1px solid var(--line);
  padding-left: 15px;
}
.future-sections {
  padding-top: 65px;
}
.future-row {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 25px 0;
  border-bottom: 1px solid var(--line);
}
.future-row > span {
  color: var(--gold);
  font-size: 10px;
}
.future-row h2 {
  font-size: 21px;
  letter-spacing: -0.5px;
}
.future-row p {
  margin-left: auto;
  color: var(--muted);
  font-size: 10px;
}
.contact-section {
  padding-block: 95px;
  text-align: center;
}
.contact-section h2 {
  max-width: 600px;
  margin: 18px auto;
  font-size: clamp(32px, 4vw, 48px);
}
.contact-section > div > p:not(.eyebrow) {
  color: var(--muted);
  font-size: 12px;
  margin-bottom: 25px;
}
.contact-pending {
  display: inline-block;
  color: var(--muted);
  border: 1px solid var(--line);
  padding: 14px 20px;
  border-radius: 6px;
  font-size: 11px;
}
.footer {
  display: flex;
  align-items: center;
  gap: 25px;
  padding: 25px 0;
  border-top: 1px solid var(--line);
}
.footer .wordmark {
  font-size: 24px;
}
.footer p {
  color: var(--muted);
  font-size: 9px;
}
.footer p:last-child {
  margin-left: auto;
}
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 25;
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: 0 6px 24px color-mix(in srgb, var(--neutral-black) 12.55%, transparent);
  color: var(--gold);
}
.gallery {
  padding: 22px;
  width: 100%;
  max-width: none;
  height: 100dvh;
  max-height: none;
  border: none;
  background: var(--bg);
  color: var(--text);
  overflow: auto;
  overscroll-behavior: contain;
}
.gallery::backdrop {
  background: color-mix(in srgb, var(--neutral-black) 90.98%, transparent);
  backdrop-filter: blur(15px);
}
.gallery-shell {
  width: min(1200px, 100%);
  margin: auto;
}
.gallery-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 20px;
  gap: 16px;
}
.gallery-header .eyebrow {
  font-size: 9px;
  letter-spacing: 1px;
}
.gallery-header h2 {
  font-size: 28px;
  margin-top: 5px;
}
.gallery-media {
  position: relative;
  height: min(58dvh, 650px);
  min-height: 230px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: var(--surface);
  overflow: hidden;
  touch-action: pan-y;
}
.gallery-media > img {
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.2s;
}
.gallery-media > img.loaded {
  opacity: 1;
}
.image-loader {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--gold);
}
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.gallery-error {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 50px;
  text-align: center;
  color: var(--muted);
}
.gallery-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid color-mix(in srgb, var(--text) 18.82%, transparent);
  border-radius: 50%;
  background: color-mix(in srgb, var(--neutral-black) 80.78%, transparent);
  color: var(--text);
  backdrop-filter: blur(10px);
}
.gallery-arrow:hover {
  background: var(--surface);
}
.gallery-prev {
  left: 16px;
}
.gallery-next {
  right: 16px;
}
.gallery-counter {
  position: absolute;
  right: 16px;
  bottom: 12px;
  background: color-mix(in srgb, var(--neutral-black) 80%, transparent);
  color: var(--text);
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 10px;
}
.gallery-announcement {
  text-align: center;
  font-size: 11px;
  color: var(--muted);
  margin: 13px 0;
}
.gallery-thumbnails {
  display: flex;
  gap: 10px;
  width: fit-content;
  max-width: 100%;
  margin: auto;
  padding: 5px;
  overflow-x: auto;
}
.gallery-thumbnails button {
  position: relative;
  flex-shrink: 0;
  width: 92px;
  aspect-ratio: 16 / 10;
  background: var(--surface);
  border: 2px solid transparent;
  border-radius: 5px;
  overflow: hidden;
  opacity: 0.5;
}
.gallery-thumbnails button.active {
  opacity: 1;
  border-color: var(--gold);
}
.gallery-thumbnails button:hover {
  opacity: 1;
}
.gallery-thumbnails img {
  object-fit: cover;
}
.gallery-thumbnails span {
  position: absolute;
  right: 3px;
  bottom: 2px;
  padding: 1px 4px;
  background: color-mix(in srgb, var(--neutral-black) 80%, transparent);
  color: var(--text);
  font-size: 8px;
  border-radius: 2px;
}
.gallery-details {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 35px;
  margin-top: 23px;
  border-top: 1px solid var(--line);
  padding-top: 20px;
}
.gallery-details > p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.9;
  max-width: 620px;
}
.gallery-details .eyebrow {
  font-size: 8px;
}
.gallery-details ul {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  list-style: none;
  padding: 0;
  margin: 9px 0 0;
}
.gallery-details li {
  border: 1px solid var(--line);
  padding: 5px 9px;
  border-radius: 4px;
  font-size: 9px;
  color: var(--muted);
}
.gallery-help {
  color: var(--muted);
  font-size: 9px;
  text-align: center;
  margin-top: 22px;
  padding-bottom: 8px;
}
.loading-page {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
}
.loading-page p {
  font-size: 12px;
  color: var(--muted);
}
.loading-line {
  width: 90px;
  height: 2px;
  background: var(--gold);
  animation: loading 1.4s ease-in-out infinite;
}
@keyframes loading {
  50% {
    opacity: 0.2;
    transform: scaleX(0.4);
  }
}
@media (min-width: 1440px) {
  .hero {
    padding-top: 110px;
  }
}
@media (max-width: 1023px) {
  .container {
    width: calc(100% - 48px);
  }
  .desktop-nav {
    display: none;
  }
  .menu-toggle {
    display: inline-flex;
  }
  .nav-row {
    height: 72px;
  }
  .hero {
    gap: 26px;
    grid-template-columns: 1.2fr 1fr;
    padding-top: 65px;
  }
  h1 {
    font-size: 47px;
    letter-spacing: -2.5px;
  }
  .hero-copy .eyebrow {
    font-size: 8px;
    letter-spacing: 1px;
  }
  .hero-visual {
    padding: 12px;
  }
  .hero-intro {
    font-size: 12px;
  }
  .hero-tagline {
    font-size: 11px;
  }
  .floating-note {
    left: -12px;
    bottom: 90px;
    padding: 12px;
  }
  .floating-note span {
    font-size: 7px;
    max-width: 95px;
  }
  .visual-coordinates {
    right: -10px;
  }
  .section-heading {
    gap: 30px;
  }
  .section-heading > p {
    max-width: 290px;
  }
  .service-tabs button {
    padding: 17px;
  }
  .service-tabs strong {
    font-size: 14px;
  }
}
@media (max-width: 700px) {
  .container {
    width: calc(100% - 40px);
  }
  .hero {
    grid-template-columns: 1fr;
    padding-top: 48px;
    gap: 38px;
  }
  h1 {
    font-size: clamp(40px, 9vw, 60px);
    letter-spacing: -2px;
    margin-top: 23px;
  }
  .hero-copy .eyebrow {
    font-size: 7px;
    letter-spacing: 1px;
  }
  .hero-intro {
    font-size: 13px;
    max-width: 520px;
  }
  .hero-tagline {
    font-size: 12px;
    max-width: 520px;
  }
  .hero-visual {
    width: min(360px, 90%);
    margin: 5px auto 0;
    padding: 15px;
  }
  .floating-note {
    left: -10px;
  }
  .hero-bottom {
    padding: 20px 0 24px;
  }
  .expertise-list {
    gap: 18px;
  }
  .expertise-list span {
    font-size: 8px;
  }
  .expertise-list span::before {
    margin-right: 6px;
  }
  .scroll-link {
    display: none;
  }
  .work-section {
    padding-top: 65px;
  }
  .section-heading {
    display: block;
  }
  .section-heading h2 {
    max-width: 350px;
  }
  .section-heading > p {
    max-width: 450px;
    margin-top: 20px;
  }
  .service-tabs {
    gap: 10px;
    margin-top: 28px;
    margin-bottom: 24px;
  }
  .service-tabs button {
    padding: 15px 12px;
    min-height: 106px;
    gap: 10px;
    align-items: flex-start;
    flex-direction: column;
  }
  .service-tabs strong {
    font-size: 12px;
  }
  .service-tabs small {
    font-size: 8px;
  }
  .tab-icon {
    width: 29px;
    height: 29px;
  }
  .tab-count,
  .tab-lock {
    display: none;
  }
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  .project-info {
    padding-block: 21px;
  }
  .project-info h3 {
    font-size: 25px;
  }
  .project-overlay {
    opacity: 1;
    background: none;
    place-items: end;
    padding: 12px;
  }
  .project-overlay > span {
    padding: 8px 10px;
    font-size: 9px;
    gap: 8px;
  }
  .project-overlay svg {
    width: 14px;
  }
  .image-placeholder-label {
    font-size: 5px;
  }
  .work-disclaimer {
    font-size: 8px;
  }
  .work-disclaimer span {
    font-size: 8px;
  }
  .anchor-note {
    margin-top: 35px;
    padding: 18px 10px;
    gap: 10px;
  }
  .anchor-note > span:last-child {
    font-size: 8px;
    padding-left: 10px;
  }
  .future-sections {
    padding-top: 35px;
  }
  .future-row {
    gap: 16px;
    flex-wrap: wrap;
  }
  .future-row h2 {
    font-size: 18px;
  }
  .future-row p {
    font-size: 8px;
  }
  .contact-section {
    padding-block: 65px;
  }
  .contact-section h2 {
    font-size: 34px;
  }
  .footer {
    flex-wrap: wrap;
    gap: 15px;
  }
  .footer p:last-child {
    width: 100%;
    margin-left: 0;
  }
  .back-to-top {
    right: 16px;
    bottom: 16px;
  }
  .gallery {
    padding: 14px;
  }
  .gallery-header h2 {
    font-size: 23px;
  }
  .gallery-header .eyebrow {
    font-size: 7px;
  }
  .gallery-media {
    height: 43dvh;
    min-height: 220px;
  }
  .gallery-prev {
    left: 8px;
  }
  .gallery-next {
    right: 8px;
  }
  .gallery-thumbnails {
    gap: 8px;
  }
  .gallery-thumbnails button {
    width: 72px;
  }
  .gallery-details {
    grid-template-columns: 1fr;
    gap: 18px;
  }
  .gallery-help {
    font-size: 8px;
    line-height: 1.8;
  }
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) {
    scroll-behavior: auto;
  }
  html:not([data-motion="full"]) *,
  html:not([data-motion="full"]) *::before,
  html:not([data-motion="full"]) *::after {
    animation: none !important;
    transition: none !important;
  }
}
html[data-motion="reduced"] *,
html[data-motion="reduced"] *::before,
html[data-motion="reduced"] *::after {
  animation: none !important;
  transition: none !important;
}
html[data-motion="reduced"] {
  scroll-behavior: auto;
}
``````

## app/how-i-build/page.tsx

``````tsx
import { redirect } from "next/navigation";
export default function Page() {
  redirect("/websites#workflow");
}
``````

## app/icon.svg

``````xml
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <rect x="1.5" y="1.5" width="97" height="97" rx="25" fill="#0A0A0F" stroke="#444444" stroke-width="3"/>
  <rect x="19" y="19" width="62" height="62" rx="10" fill="#14141C"/>
  <path d="M69 30H31V70H69M31 50H49" fill="none" stroke="#F5F3FF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="65.5" cy="50" r="6.5" fill="#8B5CF6"/>
</svg>
``````

## app/journey/page.tsx

``````tsx
import { Journey } from "@/components/studio-sections";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("journey");

export default function Page() {
  return (
    <SiteShell page="journey">
      <Journey />
    </SiteShell>
  );
}
``````

## app/layout.tsx

``````tsx
import { consentVisibilityScript } from "@/lib/consent";
import { headers } from "next/headers";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { site } from "@/data/site";
import palette from "@/data/theme-tokens.json";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";
import "./bots.css";
import "./profile.css";
import "./devices.css";
import "./premium.css";
import "./studio.css";
import "./reference.css";
import "./editorial.css";
import "./agency.css";
import "./refinement.css";
import "./showcase.css";
import "./finishing.css";
import "./reference-motion.css";
import "./theme-tokens.css";
import "./project-art-tokens.css";
import "./atelier.css";
import "./pages.css";
import { ConsentProvider } from "@/components/consent-provider";

const inter = localFont({
  src: "../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  weight: "100 900",
  variable: "--font-inter",
  display: "swap",
});
const space = localFont({
  src: "../node_modules/@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2",
  weight: "300 700",
  variable: "--font-space",
  display: "swap",
});

export function generateMetadata(): Metadata {
  const identity = site;
  return {
    metadataBase: new URL(site.url),
    title: identity.title,
    description: identity.description,
    robots:
      process.env.VERCEL_ENV === "preview" ||
      process.env.CONTEXT === "deploy-preview"
        ? { index: false, follow: false }
        : undefined,
    authors: [{ name: site.name }],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: identity.brand,
      title: identity.title,
      description: identity.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: identity.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: identity.title,
      description: identity.description,
      images: ["/opengraph-image"],
    },
  };
}
export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: palette.dark.background },
    { media: "(prefers-color-scheme: light)", color: palette.light.background },
  ],
};

const themeScript = `(function(){var t='dark',m='full';try{var s=localStorage.getItem('portfolio-theme');if(s==='light'||s==='dark')t=s;var p=localStorage.getItem('elvora-motion');if(p==='full'||p==='reduced')m=p;}catch(e){}document.documentElement.dataset.theme=t;document.documentElement.dataset.motion=m;if(window.IntersectionObserver&&m==='full')document.documentElement.dataset.motionReveals='enabled';})();`;

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const nonce = (await headers()).get("x-nonce") || undefined;
  return (
    <html
      lang="en"
      data-theme="dark"
      suppressHydrationWarning
      className={`${inter.variable} ${space.variable}`}
    >
      <head>
        <script
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: themeScript + consentVisibilityScript(),
          }}
        />
        <script
          type="application/ld+json"
          nonce={nonce}
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: site.name,
              url: site.url,
              jobTitle: site.role,
              email: site.email,
              sameAs: [
                "https://github.com/AbdulHafeezAIEngineer",
                "https://www.instagram.com/elvoraaistudio",
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          {site.ui.skip}
        </a>
        <noscript>
          <style>{`.consent-banner{display:none!important}.motion-reveal,.motion-word{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
        <MotionProvider>
          <ConsentProvider>{children}</ConsentProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
``````

## app/not-found.tsx

``````tsx
import Link from "next/link";
import { site } from "@/data/site";
export default function NotFound() {
  return (
    <main id="main-content" className="error-page">
      <p className="eyebrow">404 / {site.brand}</p>
      <h1>{site.errors.notFound}</h1>
      <p>{site.errors.missing}</p>
      <Link className="button button-gold" href="/">
        {site.errors.home}
      </Link>
    </main>
  );
}
``````

## app/opengraph-image.tsx

``````tsx
import { ImageResponse } from "next/og";
import { site } from "@/data/site";
import palette from "@/data/theme-tokens.json";

export const runtime = "edge";
export const alt = site.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: palette.dark.background,
          padding: "70px 80px",
          color: palette.dark.text,
          borderBottom: `8px solid ${palette.dark.accent}`,
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: palette.dark.accentHover,
            letterSpacing: 4,
          }}
        >
          {site.brand.toUpperCase()}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 74,
            letterSpacing: -3,
            lineHeight: 1.1,
          }}
        >
          <span>{site.hero.heading[0]}</span>
          <span>
            {site.hero.heading.slice(1).join(" ")}
          </span>
        </div>
        <div style={{ display: "flex", fontSize: 24, color: palette.dark.muted }}>
          {site.role}
        </div>
      </div>
    ),
    size,
  );
}
``````

## app/page.tsx

``````tsx
import type { Metadata } from "next";
import { getIdentity, getProjects } from "@/lib/content-loader";
import { Hero } from "@/components/hero";
import { HomeDirectory } from "@/components/home-directory";
import { LegacySectionRedirect } from "@/components/legacy-section-redirect";
import { SiteShell } from "@/components/site-shell";

// Public CMS metadata belongs to the public page, so private sign-in can render during a CMS outage.
export async function generateMetadata(): Promise<Metadata> {
  const identity = await getIdentity();
  return {
    title: identity.title,
    description: identity.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url: "/",
      siteName: identity.brand,
      title: identity.title,
      description: identity.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: identity.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: identity.title,
      description: identity.description,
      images: ["/opengraph-image"],
    },
  };
}
export const dynamic = "force-dynamic";
export default async function Home() {
  const projects = await getProjects();
  return (
    <SiteShell>
      <LegacySectionRedirect />
      <Hero />
      <HomeDirectory projects={projects} />
    </SiteShell>
  );
}
``````

## app/pages.css

``````css
/* Page structure and shared navigation. Original project artwork remains untouched. */
.portfolio-shell {
  min-height: 100svh;
}
.portfolio-header {
  background: var(--glass);
}
.portfolio-header .nav-row {
  height: 76px;
  gap: 22px;
}
.portfolio-header .desktop-nav {
  gap: clamp(8px, 1.25vw, 20px);
}
.portfolio-header .desktop-nav a {
  white-space: nowrap;
  padding: 11px 8px;
  font-size: 12px;
  border-radius: 8px;
}
.portfolio-header .desktop-nav a[aria-current="page"],
.portfolio-header .desktop-nav a[data-active] {
  color: var(--accent-text);
  background: var(--accent-soft);
}
.nav-about-group {
  position: relative;
  display: flex;
  align-items: center;
}
.nav-about-toggle {
  display: grid;
  place-items: center;
  width: 28px;
  min-height: 44px;
  color: var(--muted);
  border-radius: 6px;
}
.nav-about-toggle:hover {
  color: var(--accent-text);
}
.about-navigation {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  width: 260px;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  box-shadow: 0 16px 40px
    color-mix(in srgb, var(--neutral-black) 16%, transparent);
}
.about-navigation p {
  padding: 8px 8px 14px;
  font-size: 9px;
  letter-spacing: 0.13em;
  color: var(--muted);
}
.portfolio-header .about-navigation a {
  display: block;
  padding: 12px;
}
.portfolio-header .about-navigation a:hover {
  background: var(--accent-soft);
}
.page-tabs {
  border-bottom: 1px solid var(--line);
  background: var(--bg);
}
.page-tabs-inner {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3vw, 42px);
  overflow-x: auto;
  scrollbar-width: thin;
}
.page-tabs a {
  position: relative;
  white-space: nowrap;
  padding: 20px 0;
  font-size: 12px;
  color: var(--muted);
}
.page-tabs a[aria-current="page"],
.page-tabs a[aria-current="location"] {
  color: var(--text);
}
.page-tabs a[aria-current="page"]::after,
.page-tabs a[aria-current="location"]::after {
  content: "";
  position: absolute;
  height: 2px;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--accent);
}
.page-tabs a:hover {
  color: var(--accent-text);
}
.route-page main {
  min-height: 60svh;
}
.route-page main > section {
  padding-block: clamp(56px, 7vw, 100px);
  scroll-margin-top: 95px;
}
.route-page main > section:first-child {
  margin-top: 0;
}
.route-page h1 {
  margin-top: 18px;
  font-size: clamp(40px, 4.6vw, 68px);
  line-height: 1.12;
  letter-spacing: -0.055em;
}
.route-page .section-heading h1 {
  max-width: 700px;
}
.route-page .reference-heading h1 {
  font-size: clamp(36px, 4.3vw, 60px);
  margin-bottom: 22px;
}
.route-page .journey-editorial-heading .split-display {
  font-size: clamp(68px, 9vw, 140px);
}
.route-page .experience-intro {
  margin-bottom: 0;
}
.route-page .toolkit-heading h1 {
  margin-top: 18px;
}
.route-page .contact-paper h1 {
  font-size: clamp(54px, 6.7vw, 94px);
  letter-spacing: -0.07em;
}
.route-page .embed-section {
  border-top: 0;
}
.route-page .embed-grid {
  margin-top: 40px;
}
.route-page .embed-card h2 {
  font-size: 22px;
  margin: 18px 0 12px;
}
.route-page .embed-card h3 {
  font-size: 12px;
  margin: 22px 0 10px;
}
.route-page .bot-services {
  margin-top: 0;
}
.route-page .bot-usage-note {
  margin-bottom: 0;
}
.route-page .work-collection-label {
  margin-top: 58px;
}
/* An entire page for the original curved collection, with a larger visible canvas. */
.collection-page .dome-heading {
  justify-content: center;
  text-align: center;
}
.collection-page .dome-heading h1 {
  font-size: clamp(44px, 5.5vw, 84px);
}
.collection-page .dome-intro {
  margin-inline: auto;
}
.collection-page .dome-view-all {
  display: none;
}
.collection-page .dome-gallery {
  height: clamp(580px, 65vw, 1040px);
}
/* Testimonial editorial grid: restrained, spacious, and independent of other pages. */
.testimonials-page {
  max-width: 1180px;
}
.testimonials-page .testimonials-heading {
  display: block;
  text-align: center;
  margin-bottom: clamp(48px, 7vw, 90px);
}
.testimonials-page h1 {
  font-size: clamp(44px, 5.5vw, 76px);
  font-weight: 600;
}
.testimonials-subtitle {
  margin-top: 20px;
  font-size: clamp(14px, 1.5vw, 18px);
  color: var(--muted);
}
.testimonials-page .testimonial-sample-note {
  max-width: none;
  margin-top: 16px;
  font-size: 10px;
}
.testimonials-page .testimonials-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  align-items: stretch;
}
.testimonials-page .testimonials-grid > .motion-reveal:first-child {
  grid-column: span 2;
}
.testimonials-page .testimonial-card {
  background: var(--surface);
  color: var(--text);
  padding: clamp(24px, 3vw, 40px);
  min-height: 300px;
  border-radius: 24px;
  border-color: var(--line);
  box-shadow: none;
}
.testimonial-quote-mark {
  font-family: Georgia, serif;
  font-size: 64px;
  height: 48px;
  line-height: 1;
  color: var(--accent-text);
}
.testimonials-page .testimonial-card blockquote {
  font-size: 15px;
  line-height: 1.85;
  letter-spacing: -0.015em;
}
.testimonials-page .testimonial-card strong {
  font-size: 13px;
}
.testimonials-page .testimonial-card small,
.testimonials-page .testimonial-sample-label {
  color: var(--muted);
}
.testimonials-page .testimonial-avatar {
  background: var(--raised);
  color: var(--muted);
  border: 1px solid var(--line);
}
@media (max-width: 1199px) {
  .portfolio-header .desktop-nav {
    display: none;
  }
  .portfolio-header .menu-toggle {
    display: inline-flex;
  }
  .portfolio-header .mobile-nav {
    max-height: calc(100svh - 92px);
    overflow-y: auto;
    overscroll-behavior: contain;
    border: 1px solid var(--line);
    border-radius: 0 0 18px 18px;
    left: 0;
    right: 0;
    padding: 20px;
  }
  .portfolio-header .mobile-nav a {
    padding: 12px;
    border-radius: 8px;
    min-height: 44px;
    font-size: 14px;
  }
  .portfolio-header .mobile-nav a[aria-current="page"] {
    background: var(--accent-soft);
    color: var(--accent-text);
  }
  .mobile-nav-label {
    font-size: 9px;
    color: var(--muted);
    letter-spacing: 0.14em;
    padding: 20px 12px 8px;
  }
  .mobile-nav-label:first-child {
    padding-top: 0;
  }
}
@media (max-width: 767px) {
  .portfolio-header .nav-row {
    height: 70px;
    gap: 12px;
  }
  .page-tabs-inner {
    width: 100%;
    padding-inline: 24px;
  }
  .page-tabs a {
    font-size: 11px;
    padding-block: 17px;
  }
  .testimonials-page .testimonials-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .testimonials-page .testimonials-grid > .motion-reveal:first-child {
    grid-column: span 2;
  }
  .collection-page .dome-gallery {
    height: 650px;
  }
}
@media (max-width: 520px) {
  .testimonials-page .testimonials-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .testimonials-page .testimonials-grid > .motion-reveal:first-child {
    grid-column: auto;
  }
  .testimonials-page .testimonial-card {
    min-height: 0;
    padding: 28px;
  }
}

/* Unboxed project presentation: no counters, category strips or floating pill controls. */
.route-websites .curated-projects-grid {
  margin-top: 48px;
  gap: 64px 44px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.route-websites .curated-projects-grid > .motion-reveal:nth-child(n) {
  grid-column: auto;
  margin-top: 0;
}
.route-websites .curated-project {
  background: none;
  border: 0;
  box-shadow: none;
}
.route-websites .curated-project .device-stage {
  background: none;
  border: 0;
  border-radius: 0;
  aspect-ratio: 1.45;
  box-shadow: none;
}
.route-websites .curated-project .device-float {
  inset: 3% 0 5%;
}
.route-websites .device-floor {
  display: none;
}
.route-websites .project-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding-top: 22px;
}
.route-websites .project-title-row h3 {
  margin: 0;
  font-size: clamp(23px, 2.4vw, 34px);
  line-height: 1.2;
  letter-spacing: -0.045em;
  font-weight: 550;
}
.route-websites .project-title-row > span {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: var(--accent-text);
}
.route-websites .project-screenshots-link {
  border: 0;
  background: none;
  box-shadow: none;
  margin-top: 8px;
  padding: 8px 0;
  font-size: 11px;
  color: var(--muted);
}
.route-websites .project-screenshots-link:hover {
  color: var(--accent-text);
}
/* Animate only visible cards on both touch and desktop; Motion Off still stops all motion. */
html[data-motion="full"] .device-project .device-float {
  animation: device-float 7s ease-in-out infinite;
  animation-play-state: paused;
}
html[data-motion="full"]
  .device-project[data-device-visible="true"]
  .device-float {
  animation-play-state: running;
}
@media (max-width: 767px) {
  .route-websites .curated-projects-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 46px;
  }
  .route-websites .project-title-row {
    padding-top: 16px;
  }
}

/* Subject-specific processes stay directly below their work and demos. */
.route-websites #workflow,
.route-bots #bot-build,
.route-bots #embed-methods {
  border-top: 1px solid var(--line);
}
.route-bots #embed-title {
  font-size: clamp(34px, 4.3vw, 60px);
  letter-spacing: -0.055em;
  line-height: 1.12;
  margin-top: 16px;
}
.route-bots .embed-card h3 {
  font-size: 22px;
  margin: 18px 0 12px;
}
.route-bots .embed-card h4 {
  font-size: 12px;
  margin: 22px 0 10px;
}
/* A purpose-led introduction and large visual pathways, using original project art. */
.home-overview {
  padding: 0;
  background: var(--neutral-white);
}
.home-purpose {
  padding: clamp(64px, 8vw, 110px) max(24px, calc((100% - 1180px) / 2));
  text-align: center;
}
.home-purpose h2 {
  font-size: clamp(36px, 5vw, 68px);
  line-height: 1.12;
  font-weight: 550;
  letter-spacing: -0.055em;
  max-width: 820px;
  margin: 20px auto 26px;
}
.home-purpose > p:last-child {
  max-width: 66ch;
  margin-inline: auto;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.9;
}
.home-feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  padding-block: 12px;
}
.home-feature {
  display: flex;
  flex-direction: column;
  min-width: 0;
  text-align: center;
  padding: clamp(46px, 5.5vw, 82px) clamp(24px, 3vw, 48px) 0;
}
.home-feature-websites {
  grid-column: 1 / -1;
}
.home-feature.home-feature-websites {
  padding-inline: clamp(16px, 2vw, 36px);
}
.home-feature-copy {
  max-width: 650px;
  margin: 0 auto 30px;
  padding-inline: 18px;
}
.home-feature h3 {
  font-size: clamp(27px, 3.4vw, 46px);
  line-height: 1.14;
  letter-spacing: -0.05em;
  margin: 15px 0;
}
.home-feature-copy > p:not(.eyebrow) {
  color: var(--muted);
  font-size: 13px;
  line-height: 1.8;
  max-width: 50ch;
  margin-inline: auto;
}
.home-feature-copy > span {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: var(--accent-text);
  font-size: 12px;
  margin-top: 22px;
}
.home-feature-media {
  position: relative;
  overflow: hidden;
  margin-top: auto;
  margin-inline: auto;
  width: 100%;
  max-width: 1100px;
  background: var(--surface);
  border-radius: 20px 20px 0 0;
}
.home-feature-media.home-website-preview {
  --website-ratio: 2 / 1;
  max-width: none;
  aspect-ratio: var(--website-ratio);
  border-radius: clamp(16px, 2vw, 28px);
  margin-bottom: clamp(24px, 3vw, 44px);
  background: var(--neutral-black);
}
.home-feature-media.home-bot-preview {
  border-radius: clamp(16px, 2vw, 26px);
  margin-bottom: clamp(24px, 3vw, 40px);
}
.home-bot-preview {
  aspect-ratio: 1.5;
}
.home-bot-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.home-bot-preview .showcase-video-card,
.home-website-preview .showcase-video-card {
  width: 100%;
  margin: 0;
}
.home-bot-preview .showcase-video-frame,
.home-website-preview .showcase-video-frame {
  min-height: 0;
  max-height: none;
  aspect-ratio: 1.5;
  border: 0;
  border-radius: 0;
}
.home-website-preview .showcase-video-frame {
  aspect-ratio: var(--website-ratio);
  background: var(--neutral-black);
}
.home-website-preview .showcase-video-frame video,
.home-website-preview .showcase-video-frame > img {
  object-fit: contain;
  object-position: center;
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    var(--neutral-black) 12%,
    var(--neutral-black) 88%,
    transparent
  );
  mask-image: linear-gradient(
    to right,
    transparent,
    var(--neutral-black) 12%,
    var(--neutral-black) 88%,
    transparent
  );
}
.home-collection-preview {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-content: center;
  gap: 12px;
  padding: 22px;
  aspect-ratio: 1.5;
}
.home-collection-preview > div {
  position: relative;
  aspect-ratio: 1.2;
  overflow: hidden;
  border-radius: 7px;
  transform: rotate(-5deg);
}
.home-collection-preview img {
  object-fit: cover;
  object-position: top;
}
.home-feature:hover h3 {
  color: var(--text);
}
.home-feature:hover .home-feature-copy > span {
  color: var(--accent-hover);
}
.home-more {
  padding-block: clamp(54px, 7vw, 92px);
}
.home-more h2 {
  max-width: 1000px;
  font-size: clamp(32px, 4vw, 56px);
  font-weight: 650;
  letter-spacing: -0.045em;
  line-height: 1.2;
  margin-top: 18px;
}
.home-more-highlight {
  position: relative;
  display: inline-block;
  color: var(--accent-text);
  padding-bottom: 8px;
}
.home-more-highlight::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 3px;
  border-radius: 999px;
  background: var(--accent-text);
  transform-origin: left;
  animation: explore-underline 4.8s ease-in-out infinite;
  animation-play-state: paused;
}
.home-more nav {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 40px;
  margin-top: 40px;
}
.home-more nav a {
  position: relative;
  overflow: hidden;
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--surface);
  transition:
    border-color 0.25s,
    background-color 0.25s;
}
.home-more nav a::before {
  content: "";
  position: absolute;
  inset: 0 28px auto;
  height: 2px;
  background: var(--accent-text);
  transform-origin: left;
  animation: explore-underline 4.8s ease-in-out infinite;
  animation-delay: var(--explore-delay, 0s);
  animation-play-state: paused;
}
.home-more nav a:nth-child(2) {
  --explore-delay: -1.6s;
}
.home-more nav a:nth-child(3) {
  --explore-delay: -3.2s;
}
.home-more nav a:hover,
.home-more nav a:focus-visible {
  border-color: var(--accent-text);
  background: color-mix(in srgb, var(--accent) 6%, var(--surface));
}
.home-more nav h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  font-size: 24px;
  font-weight: 650;
  letter-spacing: -0.03em;
}
.home-more nav svg {
  color: var(--accent-text);
  flex-shrink: 0;
  transition: transform 0.25s;
}
html[data-motion="full"] .home-more nav a:hover svg,
html[data-motion="full"] .home-more nav a:focus-visible svg {
  transform: translate(3px, -3px);
}
html[data-motion="full"]
  .home-more[data-explore-active="true"]
  .home-more-highlight::after,
html[data-motion="full"] .home-more[data-explore-active="true"] nav a::before {
  animation-play-state: running;
}
@keyframes explore-underline {
  0%,
  100% {
    transform: scaleX(0.72);
    opacity: 0.55;
  }
  50% {
    transform: scaleX(1);
    opacity: 1;
  }
}
html[data-motion="reduced"] .home-more-highlight::after,
html[data-motion="reduced"] .home-more nav a::before {
  animation: none;
  opacity: 1;
}
html[data-motion="reduced"] .home-more nav a,
html[data-motion="reduced"] .home-more nav svg {
  transition: none;
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .home-more-highlight::after,
  html:not([data-motion="full"]) .home-more nav a::before {
    animation: none;
    opacity: 1;
  }
}
.home-more nav p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.8;
  margin-top: 14px;
  max-width: 34ch;
}
@media (max-width: 767px) {
  .home-feature-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
    padding-block: 10px;
  }
  .home-feature {
    padding: 46px 24px 0;
  }
  .home-feature-websites {
    grid-column: auto;
  }
  .home-feature-media.home-website-preview {
    --website-ratio: 16 / 9;
  }
  .home-purpose > p:last-child {
    font-size: 13px;
  }
  .home-feature-media {
    border-radius: 12px 12px 0 0;
  }
  .home-more nav {
    grid-template-columns: minmax(0, 1fr);
    gap: 28px;
  }
  .home-more nav p {
    max-width: 46ch;
  }
}
/* Homepage chrome follows the theme; campaign bands keep their own contrast. */
.route-home {
  --bg: var(--neutral-black);
  --surface: var(--neutral-ink);
  --raised: var(--neutral-charcoal);
  --text: var(--neutral-paper);
  --muted: var(--neutral-silver);
  --gold: var(--accent-text);
  --line: color-mix(in srgb, var(--text) 14%, transparent);
  --line-bright: color-mix(in srgb, var(--text) 28%, transparent);
  --glass: color-mix(in srgb, var(--bg) 92%, transparent);
  --ref-card: var(--surface);
  --ref-soft: var(--raised);
  background: var(--bg);
  color: var(--text);
}
[data-theme="light"] .route-home {
  --bg: var(--neutral-white);
  --surface: var(--neutral-paper);
  --raised: color-mix(in srgb, var(--neutral-black) 4%, var(--neutral-white));
  --text: var(--neutral-ink);
  --muted: var(--neutral-slate);
}
.route-home .home-band-light {
  --bg: var(--light-background);
  --surface: var(--light-surface);
  --raised: var(--neutral-paper);
  --text: var(--light-text);
  --muted: var(--light-muted);
  --line: var(--light-border);
  --accent: var(--light-accent);
  --accent-text: var(--light-accent);
  --accent-hover: var(--light-accent-hover);
  --on-accent: var(--neutral-white);
  --gold: var(--accent-text);
  color-scheme: light;
  background: var(--bg);
  color: var(--text);
}
.route-home .home-band-dark,
.route-home .home-band-purple {
  --bg: var(--neutral-black);
  --surface: var(--neutral-ink);
  --raised: var(--neutral-charcoal);
  --text: var(--inverse-text);
  --muted: var(--neutral-silver);
  --line: var(--neutral-charcoal);
  --accent-text: var(--inverse-accent);
  --accent-hover: var(--inverse-text);
  --gold: var(--accent-text);
  color-scheme: dark;
  background: var(--bg);
  color: var(--text);
}
.route-home .home-band-purple {
  --bg: color-mix(in srgb, var(--light-accent) 22%, var(--neutral-black));
  --surface: color-mix(in srgb, var(--light-accent) 15%, var(--neutral-black));
}
.home-feature:focus-visible {
  outline: 3px solid var(--accent-text);
  outline-offset: -5px;
}
.route-home .hero {
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  padding-top: clamp(54px, 6vw, 86px);
  text-align: center;
}
.route-home .hero-copy {
  max-width: 1000px;
  margin-inline: auto;
}
.route-home .hero-copy .eyebrow {
  justify-content: center;
  color: var(--muted);
}
.route-home .hero-copy .tiny-line {
  display: none;
}
.route-home .hero h1 {
  font-size: clamp(46px, 6.4vw, 88px);
  font-weight: 600;
  line-height: 1.04;
  letter-spacing: -0.065em;
  margin-top: 24px;
}
.route-home .hero-intro {
  max-width: 66ch;
  margin: 28px auto 0;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.85;
}
.route-home .hero-tagline {
  max-width: 65ch;
  margin: 16px auto 0;
  font-size: 12px;
  line-height: 1.8;
}
.route-home .hero-actions {
  justify-content: center;
  margin-top: 27px;
}
.route-home .hero-actions .button {
  border-radius: 999px;
  padding-inline: 26px;
}
.route-home .hero-note {
  margin-top: 20px;
  color: var(--muted);
}
.route-home .hero-visual {
  width: min(100%, 510px);
  padding: 0;
  margin: 20px auto 0;
}
.route-home .hero-bottom {
  margin-top: 22px;
  padding-block: 24px;
}
.route-home .hero-title-reveal .text-reveal-line:nth-child(2) {
  color: var(--muted);
}
@media (max-width: 767px) {
  .route-home .hero h1 {
    font-size: clamp(43px, 10vw, 62px);
  }
  .route-home .hero-intro {
    font-size: 13px;
  }
  .route-home .hero-tagline {
    max-width: 38ch;
  }
  .route-home .hero-visual {
    width: min(100%, 390px);
    margin-top: 12px;
  }
  .route-home .hero-actions .button {
    padding-inline: 22px;
  }
}

/* Engineering context belongs beneath the website work. */
.route-websites #fundamentals {
  border-top: 1px solid var(--line);
}
.route-websites #fundamentals-title {
  font-size: clamp(34px, 4.3vw, 60px);
  line-height: 1.12;
  letter-spacing: -0.055em;
}
/* Visible-only testimonial motion, enabled for touch screens as well as desktop. */
.testimonial-scene {
  position: relative;
  isolation: isolate;
  --testimonial-drift: 8px;
}
.testimonial-scene > .motion-reveal,
.testimonial-scene > .testimonials-grid,
.testimonial-motion-toolbar {
  position: relative;
  z-index: 1;
}
.testimonial-scene .testimonials-heading {
  margin-bottom: 24px;
}
.testimonial-scene .testimonial-sample-note {
  max-width: 64ch;
  margin-inline: auto;
  font-size: 11px;
}
.testimonial-atmosphere {
  position: absolute;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}
.testimonial-star {
  position: absolute;
  width: var(--star-size);
  height: var(--star-size);
  background: var(--muted);
  border-radius: 50%;
  opacity: 0.3;
  animation: testimonial-star-drift var(--star-duration) ease-in-out infinite
    alternate;
  animation-delay: var(--star-delay);
  animation-play-state: paused;
}
.testimonial-motion-toolbar {
  display: flex;
  justify-content: center;
  margin-bottom: 60px;
}
.testimonial-motion-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
  padding: 8px 13px;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--muted);
  background: var(--surface);
  font-size: 10px;
}
.testimonial-motion-toggle:hover:not(:disabled) {
  color: var(--text);
  border-color: var(--line-bright);
}
.testimonial-motion-toggle:disabled {
  cursor: default;
}
.testimonial-float {
  height: 100%;
  animation: testimonial-card-float var(--review-duration) ease-in-out infinite;
  animation-delay: var(--review-delay);
  animation-play-state: paused;
}
.testimonial-scene .testimonial-card:hover {
  transform: none;
}
html[data-motion="full"]
  .testimonial-scene[data-testimonials-active="true"]
  .testimonial-float,
html[data-motion="full"]
  .testimonial-scene[data-testimonials-active="true"]
  .testimonial-star {
  animation-play-state: running;
}
.testimonial-scene .testimonial-avatar {
  width: 44px;
  height: 44px;
}
.testimonial-scene .testimonial-sample-label {
  font-size: 9px;
}
@keyframes testimonial-card-float {
  0%,
  100% {
    transform: translate3d(0, 0, 0) rotate(var(--review-angle));
  }
  50% {
    transform: translate3d(0, calc(-1 * var(--testimonial-drift)), 0)
      rotate(calc(-1 * var(--review-angle)));
  }
}
@keyframes testimonial-star-drift {
  from {
    transform: translate3d(0, 0, 0);
    opacity: 0.16;
  }
  to {
    transform: translate3d(5px, -25px, 0);
    opacity: 0.5;
  }
}
@media (hover: hover) and (pointer: fine) {
  html[data-motion="full"]
    .testimonial-scene[data-testimonials-active="true"]
    .testimonials-grid:hover
    .testimonial-float {
    animation-play-state: paused;
  }
}
html[data-motion="reduced"] .testimonial-float,
html[data-motion="reduced"] .testimonial-star {
  animation: none;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .testimonial-float,
  html:not([data-motion="full"]) .testimonial-star {
    animation: none;
    transform: none;
  }
}
@media (max-width: 767px) {
  .testimonial-scene {
    --testimonial-drift: 4px;
  }
  .testimonial-motion-toolbar {
    margin-bottom: 38px;
  }
  .testimonial-star:nth-child(n + 19) {
    display: none;
  }
}
``````

## app/premium.css

``````css
#top {
  position: relative;
  isolation: isolate;
}
.scroll-progress {
  position: fixed;
  inset: 0 0 auto;
  height: 2px;
  z-index: 60;
  transform-origin: left;
  transform: scaleX(0);
  background: linear-gradient(90deg, var(--muted), var(--muted) 55%, var(--muted));
  box-shadow: 0 0 18px color-mix(in srgb, var(--neutral-black) 21.96%, transparent);
  pointer-events: none;
}
.ambient-background {
  background-image: radial-gradient(
    ellipse at 70% 2%,
    color-mix(in srgb, var(--muted) 5.49%, transparent),
    transparent 45%
  );
}
.ambient-background span {
  width: min(90vw, 1000px);
  height: min(90vw, 1000px);
  background: radial-gradient(circle, color-mix(in srgb, var(--muted) 8.24%, transparent), transparent 65%);
}
.ambient-background span:last-child {
  background: radial-gradient(circle, color-mix(in srgb, var(--muted) 7.45%, transparent), transparent 67%);
}
.site-header {
  background: color-mix(in srgb, var(--bg) 80%, transparent);
  box-shadow: 0 8px 40px color-mix(in srgb, var(--neutral-black) 3.14%, transparent);
}
.brand-symbol {
  box-shadow: 0 5px 18px color-mix(in srgb, var(--neutral-black) 14.51%, transparent);
  transition: transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.wordmark:hover .brand-symbol {
  transform: rotate(-7deg) translateY(-2px);
  box-shadow: 0 6px 25px color-mix(in srgb, var(--neutral-black) 10.98%, transparent);
}
.desktop-nav a {
  position: relative;
}
.desktop-nav a::after {
  content: "";
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--muted), transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s;
}
.desktop-nav a:hover::after,
.desktop-nav a:focus-visible::after {
  transform: scaleX(1);
}
.hero {
  position: relative;
  padding-top: 110px;
}
.hero-copy {
  animation: introduction-in 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.hero-visual {
  animation: introduction-in 1.1s 0.15s cubic-bezier(0.22, 1, 0.36, 1) both;
}
h1 {
  font-size: clamp(46px, 5vw, 70px);
  letter-spacing: -3.5px;
  line-height: 1.08;
}
.gold-text {
  color: var(--gold);
  background-image: linear-gradient(
    105deg,
    var(--muted),
    var(--muted) 40%,
    var(--muted) 62%,
    var(--muted)
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-copy:hover .gold-text {
  animation: gold-light 10s ease-in-out infinite;
}
[data-theme="light"] .gold-text {
  background-image: linear-gradient(105deg, var(--muted), var(--muted) 45%, var(--muted));
}
.hero-visual::before {
  content: "";
  position: absolute;
  inset: 12% 0 -5%;
  background: radial-gradient(
    ellipse,
    color-mix(in srgb, var(--muted) 9.41%, transparent),
    color-mix(in srgb, var(--muted) 3.14%, transparent) 45%,
    transparent 70%
  );
  pointer-events: none;
}
.portrait-card {
  border-color: var(--line-bright);
  box-shadow:
    0 35px 80px color-mix(in srgb, var(--neutral-black) 18.82%, transparent),
    0 0 50px color-mix(in srgb, var(--neutral-black) 3.14%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--neutral-white) 7.06%, transparent);
  animation: portrait-drift 9s ease-in-out infinite;
}
.portrait-orbit {
  width: 100%;
  left: 0;
  overflow: hidden;
}
.portrait-orbit::after {
  inset: 25px 15px;
  animation: orbit-turn 70s linear infinite;
}
.floating-note {
  border-color: var(--line-bright);
}
.button {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 10px;
}
.button::before {
  content: "";
  position: absolute;
  inset: -80% auto -80% -90%;
  width: 45%;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--text) 21.96%, transparent), transparent);
  transform: rotate(25deg);
  transition: none;
  pointer-events: none;
}
.button:hover::before,
.button:focus-visible::before {
  left: 145%;
}
.button-gold {
  background: linear-gradient(115deg, var(--muted), var(--muted) 55%, var(--muted));
  border-color: var(--accent-text);
  box-shadow:
    0 6px 25px color-mix(in srgb, var(--neutral-black) 7.84%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--neutral-white) 27.06%, transparent);
}
.button-gold:hover {
  background: linear-gradient(115deg, var(--muted), var(--muted) 55%, var(--muted));
}
.section-heading h2,
.experience-section h2,
.certification-section h2,
.elvora-contact h2 {
  letter-spacing: -1.4px;
}
.section-heading .eyebrow,
.experience-section > div > .eyebrow,
.certification-section > div > .eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
}
.section-heading .eyebrow::before,
.experience-section > div > .eyebrow::before,
.certification-section > div > .eyebrow::before {
  content: "";
  width: 22px;
  height: 1px;
  background: currentColor;
  opacity: 0.7;
}
.service-tabs button {
  border-radius: 14px;
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--neutral-white) 1.96%, transparent);
  transition: none;
}
.service-tabs [aria-selected="true"] {
  background: linear-gradient(115deg, color-mix(in srgb, var(--muted) 4.31%, transparent), color-mix(in srgb, var(--muted) 1.96%, transparent)), var(--surface);
  box-shadow:
    inset 0 1px 0 color-mix(in srgb, var(--neutral-black) 12.55%, transparent),
    0 8px 30px color-mix(in srgb, var(--neutral-black) 7.06%, transparent);
}
.project-card {
  border-radius: 20px;
  padding: 12px 12px 0;
  background: linear-gradient(150deg, var(--surface), var(--bg));
  box-shadow: var(--shadow-luxe);
}
.project-card:hover {
  transform: translateY(-7px);
  box-shadow:
    0 30px 70px color-mix(in srgb, var(--neutral-black) 18.82%, transparent),
    0 0 45px color-mix(in srgb, var(--neutral-black) 2.35%, transparent);
}
.device-stage {
  border-radius: 14px;
}
.device-stage::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    450px circle at var(--pointer-x, 50%) var(--pointer-y, 40%),
    color-mix(in srgb, var(--muted) 4.71%, transparent),
    transparent 65%
  );
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
.project-card:hover .device-stage::after {
  opacity: 1;
}
.device-project-number {
  opacity: 0.08;
}
.project-info {
  padding-top: 30px;
}
.project-footer {
  border-top-color: var(--line);
}
.artwork-composition {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
}
.artwork-composition > img {
  object-fit: cover;
  transition: scale 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.artwork-project .artwork-composition > img {
  object-fit: contain;
}
.artwork-project:hover .artwork-composition > img {
  scale: 1.045;
}
.artwork-project .device-stage {
  background: var(--bg);
}
.artwork-project .device-view {
  z-index: 2;
  padding: 12px 16px;
  border: 1px solid color-mix(in srgb, var(--text) 12.55%, transparent);
  border-radius: 9px;
  background: color-mix(in srgb, var(--neutral-black) 80%, transparent);
  color: var(--text);
  backdrop-filter: blur(12px);
}
.artwork-light {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(165deg, color-mix(in srgb, var(--muted) 3.14%, transparent), transparent 40%, color-mix(in srgb, var(--neutral-black) 18.82%, transparent));
}
.about-portrait {
  max-width: 365px;
  margin-top: 35px;
  padding: 10px;
  border: 1px solid var(--line-bright);
  border-radius: 20px;
  background: linear-gradient(135deg, var(--raised), var(--surface));
  box-shadow: var(--shadow-luxe);
  transform: perspective(1000px) rotateY(5deg) rotateZ(-2deg);
  transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1);
}
.about-portrait:hover {
  transform: perspective(1000px) rotateY(0) rotateZ(0) translateY(-5px);
  box-shadow:
    0 25px 60px color-mix(in srgb, var(--neutral-black) 15.69%, transparent),
    0 0 35px color-mix(in srgb, var(--neutral-black) 3.53%, transparent);
}
.about-portrait-image {
  position: relative;
  aspect-ratio: 4/4.5;
  overflow: hidden;
  border-radius: 12px;
  background: var(--bg);
}
.about-portrait-image img {
  object-fit: cover;
  transition: scale 0.7s;
}
.about-portrait:hover img {
  scale: 1.035;
}
.about-portrait-image::after {
  content: "";
  position: absolute;
  inset: 60% 0 0;
  background: linear-gradient(transparent, color-mix(in srgb, var(--neutral-black) 60%, transparent));
  pointer-events: none;
}
.about-portrait-status {
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 1;
  color: var(--text);
  font-size: 9px;
  letter-spacing: 1px;
}
.about-portrait figcaption {
  padding: 16px 9px 8px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.about-portrait figcaption strong {
  display: block;
  font-family: var(--font-space), sans-serif;
  font-size: 20px;
  margin-top: 4px;
  font-weight: 500;
}
.about-portrait figcaption .eyebrow {
  font-size: 8px;
  letter-spacing: 2px;
}
.about-signature {
  font:
    italic 38px Georgia,
    serif;
  color: var(--gold);
}
.about-story {
  padding-top: 5px;
}
.about-story p:first-child {
  color: var(--text);
}
.gallery-details:has(> div:only-child) {
  grid-template-columns: 1fr;
}
.process-card,
.skill-group,
.bot-card,
.certificate-card,
.contact-form {
  box-shadow: var(--shadow-luxe);
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
}
.process-card:hover,
.skill-group:hover,
.bot-card:hover,
.certificate-card:hover,
.contact-form:focus-within {
  border-color: var(--line-bright);
  box-shadow:
    0 20px 50px color-mix(in srgb, var(--neutral-black) 10.98%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--neutral-black) 8.24%, transparent);
}
.process-card:hover,
.skill-group:hover {
  transform: translateY(-5px);
}
.process-card {
  background: linear-gradient(145deg, var(--surface), var(--glass));
  border-radius: 15px;
}
.process-card > span {
  display: inline-grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--soft);
}
.fundamental-card {
  position: relative;
}
.fundamental-card::before {
  content: "";
  position: absolute;
  top: -1px;
  left: 0;
  width: 40%;
  height: 1px;
  background: linear-gradient(90deg, var(--muted), transparent);
  transition: none;
}
.fundamental-card:hover::before {
  width: 100%;
}
.fundamental-card > svg {
  transition: transform 0.4s;
}
.fundamental-card:hover > svg {
  transform: translateY(-4px);
}
.experience-facts {
  border-style: solid;
  background: linear-gradient(120deg, color-mix(in srgb, var(--muted) 1.57%, transparent), color-mix(in srgb, var(--muted) 1.57%, transparent));
}
.skill-group li {
  transition: transform 0.3s;
}
.skill-group li:hover {
  border-color: var(--line-bright);
  background: color-mix(in srgb, var(--accent-text) 3.14%, transparent);
  transform: translateY(-2px);
}
.certificate-preview {
  background: radial-gradient(ellipse, color-mix(in srgb, var(--muted) 4.31%, transparent), transparent 70%);
}
.certificate-preview img {
  box-shadow: 0 14px 40px color-mix(in srgb, var(--neutral-black) 14.51%, transparent);
}
.footer {
  margin-top: 35px;
  padding-block: 35px;
}
@keyframes introduction-in {
  from {
    transform: translateY(18px);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes reading-progress {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
@keyframes gold-light {
  0%,
  100% {
    background-position: 0 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}
@keyframes portrait-drift {
  0%,
  100% {
    transform: perspective(1200px) rotateY(-4deg) rotateZ(3deg) translateY(0);
  }
  50% {
    transform: perspective(1200px) rotateY(1deg) rotateZ(1deg) translateY(-9px);
  }
}
@keyframes orbit-turn {
  to {
    transform: rotate(360deg);
  }
}
@media (max-width: 1023px) {
  .hero {
    padding-top: 75px;
  }
  h1 {
    font-size: clamp(44px, 5vw, 64px);
  }
  .experience-intro {
    gap: 35px;
  }
}
@media (max-width: 700px) {
  .hero {
    padding-top: 58px;
  }
  h1 {
    font-size: clamp(42px, 9.8vw, 66px);
    letter-spacing: -2.5px;
  }
  .about-portrait {
    max-width: 350px;
    margin: 28px auto 14px;
    width: calc(100% - 12px);
  }
  .experience-intro {
    gap: 28px;
  }
  .project-card {
    border-radius: 16px;
    padding: 9px 9px 0;
  }
  .artwork-project .device-view {
    padding: 9px 12px;
  }
}
@media (hover: none), (pointer: coarse) {
  .project-card:hover,
  .process-card:hover,
  .skill-group:hover {
    transform: none;
  }
  .about-portrait,
  .about-portrait:hover {
    transform: none;
  }
  .portrait-card {
    animation: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .artwork-composition {
    transform: none !important;
  }
  html:not([data-motion="full"]) .hero-copy,
  html:not([data-motion="full"]) .hero-visual,
  html:not([data-motion="full"]) .portrait-card,
  html:not([data-motion="full"]) .portrait-orbit::after,
  html:not([data-motion="full"]) .gold-text {
    animation: none;
  }
  html:not([data-motion="full"]) .about-portrait,
  html:not([data-motion="full"]) .about-portrait:hover {
    transform: none;
  }
  html:not([data-motion="full"]) .brand-symbol,
  html:not([data-motion="full"]) .button,
  html:not([data-motion="full"]) .button::before,
  html:not([data-motion="full"]) .desktop-nav a::after,
  html:not([data-motion="full"]) .project-card,
  html:not([data-motion="full"]) .artwork-composition > img,
  html:not([data-motion="full"]) .device-stage::after,
  html:not([data-motion="full"]) .about-portrait,
  html:not([data-motion="full"]) .about-portrait-image img,
  html:not([data-motion="full"]) .process-card,
  html:not([data-motion="full"]) .skill-group,
  html:not([data-motion="full"]) .skill-group li,
  html:not([data-motion="full"]) .bot-card,
  html:not([data-motion="full"]) .certificate-card,
  html:not([data-motion="full"]) .contact-form,
  html:not([data-motion="full"]) .fundamental-card::before,
  html:not([data-motion="full"]) .fundamental-card > svg {
    transition: none;
  }
  html:not([data-motion="full"]) .project-card:hover,
  html:not([data-motion="full"]) .process-card:hover,
  html:not([data-motion="full"]) .skill-group:hover,
  html:not([data-motion="full"]) .skill-group li:hover,
  html:not([data-motion="full"]) .wordmark:hover .brand-symbol,
  html:not([data-motion="full"]) .fundamental-card:hover > svg,
  html:not([data-motion="full"]) .button:hover {
    transform: none;
  }
  html:not([data-motion="full"])
    .artwork-project:hover
    .artwork-composition
    > img,
  html:not([data-motion="full"]) .about-portrait:hover img {
    scale: 1;
  }
}
html[data-motion="reduced"] .artwork-project:hover .artwork-composition > img,
html[data-motion="reduced"] .about-portrait:hover img {
  scale: 1;
}
html[data-motion="reduced"] .project-card:hover,
html[data-motion="reduced"] .process-card:hover,
html[data-motion="reduced"] .skill-group:hover,
html[data-motion="reduced"] .skill-group li:hover,
html[data-motion="reduced"] .wordmark:hover .brand-symbol,
html[data-motion="reduced"] .fundamental-card:hover > svg,
html[data-motion="reduced"] .button:hover {
  transform: none;
}
html[data-motion="reduced"] .brand-symbol,
html[data-motion="reduced"] .button,
html[data-motion="reduced"] .button::before,
html[data-motion="reduced"] .desktop-nav a::after,
html[data-motion="reduced"] .project-card,
html[data-motion="reduced"] .artwork-composition > img,
html[data-motion="reduced"] .device-stage::after,
html[data-motion="reduced"] .about-portrait,
html[data-motion="reduced"] .about-portrait-image img,
html[data-motion="reduced"] .process-card,
html[data-motion="reduced"] .skill-group,
html[data-motion="reduced"] .skill-group li,
html[data-motion="reduced"] .bot-card,
html[data-motion="reduced"] .certificate-card,
html[data-motion="reduced"] .contact-form,
html[data-motion="reduced"] .fundamental-card::before,
html[data-motion="reduced"] .fundamental-card > svg {
  transition: none;
}
html[data-motion="reduced"] .about-portrait,
html[data-motion="reduced"] .about-portrait:hover {
  transform: none;
}
html[data-motion="reduced"] .hero-copy,
html[data-motion="reduced"] .hero-visual,
html[data-motion="reduced"] .portrait-card,
html[data-motion="reduced"] .portrait-orbit::after,
html[data-motion="reduced"] .gold-text {
  animation: none;
}
html[data-motion="reduced"] .artwork-composition {
  transform: none !important;
}
``````

## app/privacy/page.tsx

``````tsx
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = {
  title: "Privacy Policy — Elvora",
  alternates: { canonical: "/privacy" },
};
export default function Page() {
  return <LegalPage page="privacy" />;
}
``````

## app/profile.css

``````css
.experience-section,
.skills-section,
.certification-section,
.elvora-contact {
  padding-top: 110px;
}
.section-intro {
  max-width: 620px;
  margin-top: 20px;
  color: var(--muted);
  line-height: 1.9;
  font-size: 13px;
}
.experience-intro {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 70px;
  margin-top: 17px;
  align-items: start;
}
.about-story {
  display: grid;
  gap: 18px;
}
.about-story p {
  color: var(--muted);
  line-height: 1.95;
  font-size: 14px;
}
.experience-lead {
  margin-top: 18px;
  color: var(--gold);
  line-height: 1.7;
  font-size: 14px;
}
.process-grid,
.fundamentals-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  margin-top: 36px;
}
.process-grid > div,
.skills-grid > div {
  min-width: 0;
}
.process-card {
  border-radius: 12px;
  padding: 24px;
  height: 100%;
  position: relative;
}
.process-card > span,
.skill-number {
  color: var(--gold);
  font-size: 11px;
  letter-spacing: 1px;
}
.process-card > svg {
  position: absolute;
  top: 24px;
  right: 24px;
  color: var(--muted);
}
.process-card h3 {
  font-size: 17px;
  margin: 28px 0 12px;
}
.process-card p {
  font-size: 11px;
  line-height: 1.9;
  color: var(--muted);
}
.experience-facts {
  margin-top: 24px;
  padding: 30px;
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 55px;
  border: 1px dashed var(--line);
  border-radius: 12px;
}
.experience-facts > div > p:last-child {
  margin-top: 12px;
  font-size: 11px;
  line-height: 1.9;
  color: var(--muted);
}
.experience-facts dl {
  margin: 0;
  display: grid;
  gap: 18px;
}
.experience-facts dt {
  font-size: 12px;
  color: var(--text);
}
.experience-facts dd {
  margin: 6px 0 0;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.7;
}
.fundamentals-section {
  padding-top: 85px;
}
.fundamentals-section h2,
.certification-section h2,
.elvora-contact h2 {
  margin-top: 16px;
}
.fundamental-card {
  height: 100%;
  border-top: 1px solid var(--line);
  padding-top: 26px;
}
.fundamental-card svg {
  color: var(--gold);
  margin-bottom: 20px;
}
.fundamental-card h3 {
  font-size: 17px;
  margin-bottom: 17px;
}
.fundamental-card p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
  margin-top: 8px;
}
.fundamentals-closing {
  padding: 26px 32px;
  margin-top: 35px;
  border-left: 2px solid var(--gold);
  background: linear-gradient(90deg, color-mix(in srgb, var(--muted) 3.53%, transparent), transparent);
  font-family: var(--font-space), sans-serif;
  font-size: 18px;
  line-height: 1.7;
  max-width: 850px;
}
.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 36px;
}
.skill-group {
  height: 100%;
  padding: 26px;
  border-radius: 12px;
}
.skill-group h3 {
  margin-top: 15px;
  font-size: 19px;
}
.skill-group ul {
  list-style: none;
  padding: 0;
  margin: 20px 0 0;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.skill-group li {
  border: 1px solid var(--line);
  border-radius: 6px;
  padding: 9px 11px;
  font-size: 10px;
  line-height: 1.5;
  background: var(--soft);
}
.skill-group .skill-placeholder {
  color: var(--muted);
  border-style: dashed;
}
.skills-note {
  max-width: 840px;
  margin-top: 20px;
  color: var(--muted);
  font-size: 10px;
  line-height: 1.9;
}
.certificate-card {
  margin-top: 35px;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  border-radius: 15px;
  overflow: hidden;
}
.certificate-preview {
  position: relative;
  min-width: 0;
  display: grid;
  place-items: center;
  background: var(--soft);
  overflow: hidden;
  padding: 26px;
}
.certificate-preview img {
  width: 100%;
  height: auto;
  border-radius: 6px;
  transition: transform 0.4s;
}
.certificate-preview:hover img {
  transform: scale(1.025);
}
.certificate-preview > span {
  position: absolute;
  bottom: 39px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  padding: 10px 15px;
  white-space: nowrap;
  background: color-mix(in srgb, var(--neutral-black) 90.98%, transparent);
  color: var(--text);
  font-size: 11px;
  border: 1px solid color-mix(in srgb, var(--text) 18.82%, transparent);
  border-radius: 6px;
}
.certificate-info {
  padding: 38px;
  align-self: center;
  min-width: 0;
}
.placeholder-tag {
  font-size: 10px;
  color: var(--gold);
  line-height: 1.7;
}
.certificate-info h3 {
  font-size: 26px;
  margin-top: 16px;
  letter-spacing: -0.7px;
}
.certificate-info dl {
  display: grid;
  gap: 18px;
  margin: 24px 0;
}
.certificate-info dt {
  color: var(--gold);
  font-size: 9px;
  letter-spacing: 1.4px;
}
.certificate-info dd {
  margin: 7px 0 0;
  color: var(--text);
  font-size: 12px;
  line-height: 1.7;
}
.certificate-info > p:last-child {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
}
.certificate-dialog {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100dvh;
  max-width: none;
  max-height: none;
  border: 0;
  padding: 20px;
  margin: 0;
  background: color-mix(in srgb, var(--neutral-black) 90.98%, transparent);
  color: var(--text);
}
.certificate-dialog::backdrop {
  background: color-mix(in srgb, var(--neutral-black) 93.33%, transparent);
  backdrop-filter: blur(15px);
}
.certificate-view-shell {
  height: 100%;
  max-width: 1500px;
  margin: auto;
  padding: 24px;
  background: var(--bg);
  border: 1px solid var(--line);
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.certificate-view-shell > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.certificate-view-shell h2 {
  font-size: 24px;
  margin-top: 6px;
}
.certificate-view-shell .eyebrow {
  letter-spacing: 1px;
  font-size: 9px;
}
.certificate-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 0;
}
.certificate-toolbar > span {
  width: 45px;
  font-size: 12px;
  text-align: center;
  font-variant-numeric: tabular-nums;
}
.certificate-toolbar button:disabled {
  opacity: 0.35;
}
.certificate-stage {
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: auto;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 8px;
  overscroll-behavior: contain;
}
.certificate-zoom-canvas {
  position: relative;
  min-width: 100%;
  min-height: 100%;
}
.certificate-zoom-canvas img {
  object-fit: contain;
}
.certificate-loader,
.certificate-image-error {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--muted);
  padding: 30px;
}
.certificate-help {
  color: var(--muted);
  font-size: 10px;
  text-align: center;
  line-height: 1.8;
  margin-top: 14px;
}
.contact-grid {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: 65px;
  margin-top: 40px;
}
.email-card {
  padding: 25px 0;
}
.email-card > svg {
  color: var(--gold);
  margin-bottom: 28px;
}
.email-card > p:not(.eyebrow) {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
  max-width: 290px;
  margin-top: 14px;
}
.email-card a {
  display: flex;
  align-items: center;
  gap: 14px;
  width: fit-content;
  max-width: 100%;
  overflow-wrap: anywhere;
  margin-top: 24px;
  font-family: var(--font-space), sans-serif;
  font-size: clamp(17px, 1.75vw, 23px);
  line-height: 1.6;
  border-bottom: 1px solid var(--line);
  padding-bottom: 10px;
}
.email-card a svg {
  flex-shrink: 0;
  color: var(--gold);
}
.email-card a:hover {
  color: var(--gold);
}
.email-card small {
  display: block;
  color: var(--muted);
  font-size: 10px;
  margin-top: 12px;
  line-height: 1.7;
}
.contact-form {
  border-radius: 14px;
  padding: 32px;
  position: relative;
}
.contact-form h3 {
  font-size: 22px;
  margin-bottom: 27px;
}
.form-pair {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}
.form-field {
  min-width: 0;
  margin-bottom: 23px;
}
.form-field label {
  display: block;
  font-size: 11px;
  margin-bottom: 9px;
}
.form-field input,
.form-field textarea {
  display: block;
  width: 100%;
  min-height: 48px;
  background: var(--soft);
  border: 1px solid var(--line);
  border-radius: 7px;
  color: var(--text);
  padding: 13px 14px;
  font: inherit;
  font-size: 14px;
  line-height: 1.7;
}
.form-field textarea {
  resize: vertical;
  min-height: 160px;
}
.form-field input::placeholder,
.form-field textarea::placeholder {
  color: var(--muted);
  opacity: 1;
  font-size: 12px;
}
.form-field [aria-invalid="true"] {
  border-color: var(--accent-text);
}
.form-field input:focus-visible,
.form-field textarea:focus-visible {
  outline-offset: 2px;
}
.form-field :disabled {
  opacity: 0.65;
}
.message-meta {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 14px;
  color: var(--muted);
  font-size: 9px;
  line-height: 1.7;
  margin-top: 9px;
}
.message-meta > span {
  flex-shrink: 0;
}
.field-error {
  color: var(--accent-text);
  font-size: 11px;
  line-height: 1.7;
  margin-top: 8px;
}
.contact-privacy {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.8;
  margin-bottom: 20px;
}
.contact-honeypot {
  position: absolute;
  left: -10000px;
  top: auto;
  width: 1px;
  height: 1px;
  overflow: hidden;
}
.contact-form button:disabled {
  opacity: 0.6;
  transform: none;
}
.form-success {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: var(--accent-text);
  background: color-mix(in srgb, var(--accent-text) 4.31%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent-text) 18.82%, transparent);
  border-radius: 7px;
  padding: 15px;
  font-size: 12px;
  line-height: 1.8;
  margin-top: 20px;
}
.form-success svg {
  flex-shrink: 0;
  margin-top: 2px;
}
.form-failure {
  color: var(--accent-text);
  border: 1px solid color-mix(in srgb, var(--accent-text) 25.1%, transparent);
  border-radius: 7px;
  padding: 15px;
  font-size: 12px;
  line-height: 1.8;
  margin-top: 20px;
}
.form-failure strong {
  font-weight: 500;
}
.form-failure p {
  margin-top: 5px;
}
[data-theme="light"] .field-error,
[data-theme="light"] .form-failure {
  color: var(--accent-text);
}
[data-theme="light"] .form-success {
  color: var(--accent-text);
}
.elvora-contact {
  padding-bottom: 90px;
}
@media (max-width: 1023px) {
  .experience-intro {
    gap: 35px;
  }
  .process-grid,
  .fundamentals-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .skills-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .contact-grid {
    gap: 30px;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  }
  .contact-form {
    padding: 24px;
  }
  .form-pair {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
  .certificate-info {
    padding: 26px;
  }
}
@media (max-width: 700px) {
  .experience-section,
  .skills-section,
  .certification-section,
  .elvora-contact {
    padding-top: 75px;
  }
  .experience-intro,
  .experience-facts,
  .certificate-card,
  .contact-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 25px;
  }
  .experience-facts {
    padding: 24px;
  }
  .process-card {
    padding: 20px;
  }
  .fundamentals-section {
    padding-top: 65px;
  }
  .fundamentals-closing {
    padding: 20px;
    font-size: 16px;
  }
  .certificate-info {
    padding: 0 24px 28px;
  }
  .certificate-preview {
    padding: 20px;
  }
  .certificate-preview > span {
    bottom: 30px;
  }
  .certificate-dialog {
    padding: 8px;
  }
  .certificate-view-shell {
    padding: 14px;
  }
  .certificate-view-shell h2 {
    font-size: 21px;
  }
  .certificate-help {
    font-size: 9px;
  }
  .contact-grid {
    margin-top: 22px;
  }
  .email-card {
    padding: 20px 0;
  }
  .email-card a {
    font-size: 21px;
  }
  .form-field input,
  .form-field textarea {
    font-size: 16px;
  }
  .elvora-contact {
    padding-bottom: 65px;
  }
}
@media (max-width: 420px) {
  .process-grid,
  .fundamentals-grid,
  .skills-grid {
    grid-template-columns: minmax(0, 1fr);
  }
  .contact-form {
    padding: 21px;
  }
  .email-card a {
    font-size: 18px;
  }
  .message-meta {
    flex-wrap: wrap;
    gap: 4px;
  }
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .certificate-preview img {
    transition: none;
  }
}
html[data-motion="reduced"] .certificate-preview img {
  transition: none;
}

.contact-security {
  margin: 0 0 20px;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
}
.error-page {
  min-height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  gap: 25px;
}
.error-page h1 {
  font-size: clamp(30px, 5vw, 60px);
  max-width: 750px;
  margin: 0;
}
.error-page > p:not(.eyebrow) {
  color: var(--muted);
}
``````

## app/project-art-tokens.css

``````css
/* Generated: original custom artwork colors. Do not re-theme. */
:root {
  --art-tone01: #acbdc0;
  --art-tone02: #e6dfc8;
  --art-tone03: #52645c;
  --art-tone04: #82968b;
  --art-tone05: #2c403c;
  --art-tone06: #d4c5a9;
  --art-tone07: #ece2cb;
  --art-tone08: #fff0d2;
  --art-tone09: #b6b29c;
  --art-tone10: #d9d0b7;
  --art-tone11: #e9dfc6;
  --art-tone12: #bdb69f;
  --art-tone13: #d8cdb2;
  --art-tone14: #f0e3c8;
  --art-tone15: #749c9a;
  --art-tone16: #a5c6bf;
  --art-tone17: #68775d;
  --art-tone18: #7e7255;
  --art-tone19: #667a56;
  --art-tone20: #6f785a;
  --art-tone21: #948d74;
  --art-tone22: #a47c5d;
  --art-tone23: #cec8ba;
  --art-tone24: #303432;
  --art-tone25: #d0aa86;
  --art-tone26: #f3ede0;
  --art-tone27: #666961;
  --art-tone28: #916b50;
  --art-tone29: #b7b1a4;
  --art-tone30: #282c2b;
  --art-tone31: #473b2d;
  --art-tone32: #b48b68;
  --art-tone33: #e0d8ca;
  --art-tone34: #8a654c;
  --art-tone35: #b0a999;
  --art-tone36: #715d4b;
  --art-tone37: #5b4739;
  --art-tone38: #fff;
  --art-tone39: #e6e0cf;
  --art-tone40: #242927;
  --art-tone41: #644e3b;
  --art-tone42: #171b1b;
  --art-tone43: #b1c471;
  --art-tone44: #c7ccbd;
  --art-tone45: #101615;
  --art-tone46: #bec9b9;
  --art-tone47: #a7b09f;
  --art-tone48: #d9fa82;
  --art-tone49: #0b1010;
  --art-tone50: #a8b09c;
  --art-tone51: #75816d;
  --art-tone52: #00000009;
  --art-tone53: #b6a18a;
  --art-tone54: #d4cbbd;
  --art-tone55: #a49b8e;
  --art-tone56: #6a655d;
  --art-tone57: #e8e0d2;
  --art-tone58: #363d38;
  --art-tone59: #b6b5a0;
  --art-tone60: #c9c3b1;
  --art-tone61: #838d71;
  --art-tone62: #0009;
  --art-tone63: #0005;
  --art-tone64: #424248;
  --art-tone65: #1a1a20;
  --art-tone66: #777269;
  --art-tone67: #565656;
  --art-tone68: #000;
  --art-tone69: #13141b;
  --art-tone70: #a1a1a1;
  --art-tone71: #ffffff06;
  --art-tone72: #ffffff1c;
  --art-tone73: #ffffff04;
  --art-tone74: #93928e;
  --art-tone75: #4b4b4b;
  --art-tone76: #898881;
  --art-tone77: #23232a;
  --art-tone78: #25252a;
  --art-tone79: #777;
  --art-tone80: #5b5650;
  --art-tone81: #17171b;
  --art-tone82: #0006;
  --art-tone83: #262627;
  --art-tone84: #151519;
  --art-tone85: #ffffff08;
  --art-tone86: #d4af3733;
  --art-tone87: #0004;
}
``````

## app/reference-motion.css

``````css
/* Scroll-linked brand motion and readable ink emphasis, inspired by the supplied recording. */
.emblem-object[data-logo-flip] {
  overflow: visible;
  transform-style: preserve-3d;
  background: transparent;
  border: 0;
  box-shadow: none;
  animation: none;
  transform: translateY(var(--logo-lift, 0px)) rotateX(8deg)
    rotateY(calc(-22deg + var(--logo-turn, 0deg))) rotateZ(-7deg);
}
.emblem-face {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
  background: var(--bg);
  border: 1px solid color-mix(in srgb, var(--accent-text) 50.2%, transparent);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  box-shadow:
    0 20px 55px color-mix(in srgb, var(--neutral-black) 33.33%, transparent),
    inset 0 0 0 2px color-mix(in srgb, var(--neutral-white) 3.53%, transparent);
}
.emblem-face-front {
  transform: translateZ(4px);
}
.emblem-face-back {
  transform: rotateY(180deg) translateZ(4px);
}
.emblem-face .emblem-shine {
  animation: logo-sheen 6s cubic-bezier(0.22, 1, 0.36, 1) infinite;
  opacity: 0.65;
  pointer-events: none;
}
[data-logo-flip]:not([data-logo-visible="true"]) .emblem-shine {
  animation-play-state: paused;
}
@keyframes logo-sheen {
  0%,
  12% {
    transform: translateX(-45%);
    opacity: 0;
  }
  24% {
    opacity: 0.65;
  }
  48%,
  100% {
    transform: translateX(45%);
    opacity: 0;
  }
}
.reading-word {
  position: relative;
  display: inline-block;
  white-space: pre;
}
.reading-base {
  color: inherit;
}
.reading-word::after {
  content: attr(data-word);
  position: absolute;
  inset: 0 auto auto 0;
  color: var(--text);
  opacity: 0;
  pointer-events: none;
  user-select: none;
}
[data-reading-active] .reading-base {
  color: var(--muted);
}
[data-reading-active] .reading-word::after {
  transition:
    opacity 0.24s var(--ease-editorial),
    transform 0.24s var(--ease-editorial);
  transform: translateY(2px);
}
[data-reading-active] .is-read::after {
  opacity: 1;
  transform: translateY(0);
}
.experience-lead.reading-text {
  font-weight: 550;
}
.reference-service-icon,
.service-learn svg,
.domain-demo-link svg,
.contact-address svg {
  transition: transform 0.35s var(--ease-editorial);
}
[data-motion-reveals="enabled"] .studio-service:hover .reference-service-icon {
  transform: translateY(-3px) rotate(-6deg);
}
[data-motion-reveals="enabled"] .service-learn:hover svg,
[data-motion-reveals="enabled"] .domain-demo-link:hover svg,
[data-motion-reveals="enabled"] .contact-address:hover svg {
  transform: translate(3px, -3px);
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .emblem-object[data-logo-flip] {
    transform: rotateY(-12deg);
  }
  html:not([data-motion="full"]) .emblem-shine {
    animation: none;
    opacity: 0;
  }
}
html[data-motion="reduced"] .emblem-object[data-logo-flip] {
  transform: rotateY(-12deg);
}
html[data-motion="reduced"] .emblem-shine {
  animation: none;
  opacity: 0;
}
``````

## app/reference.css

``````css
/* Layout adaptation from the owner's supplied screenshots, using Elvora's identity. */
.text-reveal {
  white-space: normal;
}
.text-reveal-line {
  display: block;
}
.word-mask {
  display: inline-block;
  overflow: hidden;
  vertical-align: bottom;
  padding-bottom: 0.08em;
  margin-bottom: -0.08em;
  margin-right: 0.22em;
}
.word-mask:last-child {
  margin-right: 0;
}
.motion-word {
  display: inline-block;
  transform-origin: 0 100%;
}
.hero-title-reveal .text-reveal-line:nth-child(2) {
  color: var(--gold);
}
.reference-heading {
  text-align: center;
  max-width: 820px;
  margin: 0 auto 50px;
}
.reference-heading > .text-reveal {
  font-size: clamp(31px, 3.5vw, 48px);
  line-height: 1.12;
  letter-spacing: -1.7px;
  margin: 14px 0 18px;
}
.reference-heading > .motion-reveal > p:not(.eyebrow) {
  max-width: 630px;
  margin: auto;
  font-size: 13px;
  line-height: 1.9;
  color: var(--muted);
}
.reference-heading .eyebrow {
  font-size: 9px;
  letter-spacing: 1.7px;
}
/* Rounded service cards, icon first and clear text hierarchy. */
.reference-services .studio-services {
  max-width: 1040px;
  margin: auto;
  gap: 22px;
}
.reference-services .studio-service {
  border-radius: 28px;
  border: 1px solid var(--line);
  background: var(--ref-card);
  min-height: 365px;
  padding: 33px;
  box-shadow: var(--ref-shadow);
}
.reference-services .studio-service:hover {
  transform: translateY(-6px);
  border-color: var(--line-bright);
  background:
    radial-gradient(ellipse at 0 0, color-mix(in srgb, var(--muted) 2.75%, transparent), transparent 70%), var(--ref-card);
}
.reference-service-icon {
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  margin-bottom: 23px;
  color: var(--gold);
  background: color-mix(in srgb, var(--accent-text) 9.41%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent-text) 8.24%, transparent);
  border-radius: 50%;
}
.reference-services .studio-service h3 {
  font-size: 25px;
  max-width: 440px;
  margin-bottom: 15px;
  letter-spacing: -0.7px;
}
.reference-services .studio-service > p {
  font-size: 13px;
  line-height: 1.9;
}
.reference-services .studio-service ul {
  margin: 23px 0 18px;
  gap: 7px;
}
.reference-services .studio-service li {
  background: var(--ref-soft);
  border: 0;
  font-size: 9px;
  color: var(--muted);
  padding: 6px 10px;
}
.reference-services .studio-service .service-detail {
  font-size: 10px;
  line-height: 1.8;
  margin-bottom: 23px;
}
.service-learn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  align-self: flex-start;
  color: var(--gold);
  font-size: 11px;
  margin-top: auto;
  padding: 10px 0 1px;
}
.service-learn:hover svg {
  transform: translate(3px, -3px);
}
.service-learn svg {
  transition: transform 0.3s;
}
/* A connected five-card sequence, matching the horizontal reference. */
.workflow-cards {
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 17px;
}
.workflow-cards::before {
  content: "";
  position: absolute;
  left: 20px;
  right: 20px;
  top: 39px;
  height: 1px;
  background: var(--line-bright);
}
.workflow-cards > .motion-reveal {
  min-width: 0;
  display: flex;
}
.reference-workflow .workflow-step {
  width: 100%;
  margin: 0;
  padding: 26px 21px;
  border: 1px solid var(--line);
  border-radius: 29px;
  background: var(--ref-card);
  box-shadow: var(--ref-shadow);
  display: flex;
  flex-direction: column;
  position: relative;
  transition: transform 0.4s;
}
.reference-workflow .workflow-step:hover {
  transform: translateY(-6px);
  border-color: var(--line-bright);
}
.workflow-number {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, var(--muted), var(--muted));
  color: var(--text);
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 24px;
}
.workflow-card-icon {
  position: absolute;
  right: 22px;
  top: 34px;
  color: var(--gold);
  opacity: 0.8;
}
.reference-workflow .workflow-step h3 {
  font-size: 18px;
  line-height: 1.35;
  margin-bottom: 15px;
  letter-spacing: -0.4px;
  min-height: 49px;
}
.reference-workflow .workflow-step p {
  font-size: 11px;
  line-height: 1.95;
  color: var(--muted);
}
.reference-workflow .workflow-step small {
  margin-top: auto;
  padding-top: 25px;
  font-size: 8px;
  line-height: 1.7;
  letter-spacing: 0.1px;
  gap: 7px;
}
.reference-workflow .workflow-step small svg {
  flex-shrink: 0;
}
.workflow-caption {
  text-align: center;
  color: var(--muted);
  font-size: 11px;
  margin-top: 30px;
}
/* Timeline uses phases rather than invented dates or performance claims. */
.reference-journey .reference-heading {
  max-width: 870px;
}
.reference-journey .reference-heading > .text-reveal {
  font-size: clamp(30px, 3.4vw, 46px);
}
.reference-journey .journey-chapters {
  max-width: 780px;
  padding-left: 40px;
  margin: auto;
  border-left: 1px solid var(--line-bright);
  border-top: 0;
  position: relative;
}
.reference-journey .journey-chapters > .motion-reveal {
  margin-bottom: 30px;
}
.reference-journey .journey-chapters > .motion-reveal:last-child {
  margin-bottom: 0;
}
.reference-journey .journey-chapter {
  position: relative;
  display: block;
  padding: 32px;
  border: 1px solid var(--line);
  border-radius: 28px;
  background: var(--ref-card);
  box-shadow: var(--ref-shadow);
}
.timeline-dot {
  width: 10px;
  height: 10px;
  position: absolute;
  top: 34px;
  left: -46px;
  border-radius: 50%;
  background: var(--gold);
  border: 2px solid var(--bg);
  box-shadow: 0 0 0 5px var(--bg);
}
.journey-chapter header {
  display: flex;
  gap: 22px;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 18px;
}
.journey-mini-index {
  display: block;
  color: var(--gold);
  font-size: 8px;
  letter-spacing: 1.2px;
  line-height: 1.8;
}
.reference-journey .journey-chapter h3 {
  font-size: 24px;
  margin: 9px 0 0;
  letter-spacing: -0.6px;
}
.journey-phase {
  border: 1px solid var(--line);
  border-radius: 30px;
  background: var(--ref-soft);
  color: var(--muted);
  padding: 7px 11px;
  font-size: 9px;
  white-space: nowrap;
}
.reference-journey .journey-chapter > p {
  font-size: 13px;
  line-height: 1.9;
}
.journey-chapter ul {
  list-style: none;
  padding: 0;
  margin: 22px 0 0;
}
.journey-chapter li {
  display: flex;
  align-items: start;
  gap: 10px;
  font-size: 11px;
  line-height: 1.8;
  margin-top: 9px;
}
.journey-chapter li svg {
  color: var(--gold);
  flex-shrink: 0;
  margin-top: 3px;
}
.reference-journey .journey-signature {
  max-width: 780px;
  margin: 30px auto 0;
  font-size: 21px;
}
/* Portrait-left About, with the owner's actual story on the right. */
.reference-about .experience-intro {
  display: grid;
  grid-template-columns: 0.85fr 1.15fr;
  gap: 65px;
  align-items: center;
}
.reference-about .about-portrait {
  max-width: none;
  width: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  box-shadow: none;
  transform: none;
  position: relative;
}
.reference-about .about-portrait::before {
  content: "";
  position: absolute;
  width: 45%;
  height: 42%;
  bottom: -12px;
  right: -13px;
  border-radius: 24px;
  background: color-mix(in srgb, var(--accent-text) 15.69%, transparent);
  z-index: -1;
}
.reference-about .about-portrait-image {
  aspect-ratio: 4/4.8;
  border-radius: 30px;
  border: 1px solid var(--line-bright);
  box-shadow: var(--ref-shadow);
  background:
    radial-gradient(ellipse at center, color-mix(in srgb, var(--muted) 7.84%, transparent), transparent 70%),
    var(--ref-card);
}
.reference-about .about-portrait:hover {
  transform: none;
  box-shadow: none;
}
.reference-about .about-portrait figcaption {
  padding: 20px 4px 0;
}
.reference-about .about-story {
  padding: 0;
}
.reference-about .about-story > .text-reveal {
  font-size: clamp(30px, 3vw, 42px);
  line-height: 1.16;
  letter-spacing: -1.5px;
  margin: 17px 0 20px;
}
.reference-about .about-story .experience-lead {
  font-size: 12px;
  line-height: 1.8;
  margin-bottom: 22px;
  color: var(--gold);
}
.reference-about .about-story p:not(.eyebrow):not(.experience-lead) {
  font-size: 13px;
  line-height: 1.95;
  margin-bottom: 19px;
  color: var(--muted);
}
.reference-about .social-links {
  margin-top: 22px;
}
.reference-about .fundamentals-section > .text-reveal {
  font-size: clamp(28px, 3vw, 40px);
  margin-top: 15px;
  letter-spacing: -1.3px;
}
.reference-about .fundamental-card {
  padding: 25px;
  border: 1px solid var(--line);
  background: var(--ref-card);
  border-radius: 22px;
  box-shadow: var(--ref-shadow);
}
.reference-about .fundamental-card::before {
  display: none;
}
.reference-about .fundamental-card h3 {
  font-size: 19px;
}
.reference-about .fundamental-card p {
  font-size: 11px;
  line-height: 1.85;
}
/* One live carousel slide with the soft side-card structure from the references. */
/* A broad contact sheet: real screenshots, six new visual UI studies, no client-count claim. */
.reference-bunch .reference-heading {
  margin-bottom: 35px;
}
.reference-bunch .bunch-window {
  padding-block: 45px 65px;
}
.reference-bunch .bunch-grid {
  width: min(1800px, calc(100% + 130px));
  margin-left: max(calc((100% - 1800px) / 2), -65px);
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 22px;
}
.reference-bunch .bunch-piece {
  border-radius: 12px;
  background: var(--ref-card);
  transform: rotate(-4deg) translateY(0);
}
.reference-bunch .bunch-piece:nth-child(2n) {
  transform: rotate(4deg) translateY(20px);
}
.reference-bunch .bunch-piece:nth-child(3n) {
  transform: rotate(-3deg) translateY(-14px);
}
.reference-bunch .bunch-piece:hover,
.reference-bunch .bunch-piece:focus-visible {
  transform: rotate(0) translateY(-6px);
}
.reference-bunch .bunch-image {
  aspect-ratio: 1.6;
}
.reference-bunch .bunch-caption {
  gap: 6px;
  padding: 12px 10px;
}
.reference-bunch .bunch-caption > span {
  font-size: 10px;
}
.reference-bunch .bunch-caption small {
  font-size: 6px;
  letter-spacing: 0.5px;
}
.reference-bunch .bunch-browser span {
  font-size: 6px;
}
/* Three-column footer and quiet legal line from the supplied footer reference. */
.reference-footer {
  background:
    radial-gradient(ellipse at bottom, color-mix(in srgb, var(--muted) 3.53%, transparent), transparent 65%), var(--bg);
}
.reference-footer .footer-invitation > .motion-reveal:first-child {
  grid-column: 1/-1;
}
.reference-footer .footer-invitation > .motion-reveal:last-child > div > p {
  color: var(--muted);
  line-height: 1.9;
  margin-bottom: 25px;
  max-width: 370px;
}
.reference-footer .footer-directory {
  grid-template-columns: 1.6fr 0.8fr 1fr;
  gap: 60px;
  padding-block: 50px;
}
.reference-footer .footer-directory > .motion-reveal {
  min-width: 0;
}
.reference-footer .footer-identity p {
  max-width: 310px;
  line-height: 1.9;
  font-size: 11px;
}
.reference-footer .footer-identity .footer-role {
  color: var(--gold);
  font-size: 10px;
  margin-top: 12px;
}
.reference-footer .footer-email {
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
  overflow-wrap: anywhere;
}
.reference-footer .footer-email svg {
  flex-shrink: 0;
}
.reference-footer .footer-directory h3 {
  margin-bottom: 22px;
  font-size: 11px;
}
.reference-footer .footer-directory nav {
  gap: 14px;
}
.reference-footer .footer-directory nav a {
  font-size: 11px;
}
.reference-footer .footer-colophon {
  align-items: center;
  padding-block: 22px;
}
.reference-footer .footer-colophon nav {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  margin-left: auto;
  font-size: 9px;
}
.reference-footer .footer-colophon .cookie-settings-link {
  font-size: 9px;
}
.reference-footer .footer-colophon > a {
  display: grid;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 50%;
  width: 33px;
  height: 33px;
  font-size: 16px;
  margin-left: 15px;
}
.footer-credit {
  color: var(--muted);
  font-size: 9px;
  line-height: 1.8;
  text-align: center;
}
.reference-footer .footer-art {
  margin-top: 28px;
  height: clamp(100px, 16vw, 210px);
}
.reference-footer .footer-art > span {
  font-size: clamp(75px, 17vw, 230px);
}
@media (max-width: 1100px) {
  .workflow-cards {
    gap: 12px;
  }
  .reference-workflow .workflow-step {
    padding: 22px 16px;
  }
  .workflow-card-icon {
    display: none;
  }
  .reference-workflow .workflow-step h3 {
    font-size: 16px;
  }
  .reference-workflow .workflow-step p {
    font-size: 10px;
  }
  .reference-about .experience-intro {
    gap: 40px;
  }
  .reference-footer .footer-directory {
    gap: 35px;
  }
  .reference-bunch .bunch-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
  .reference-bunch .bunch-piece:last-child {
    grid-column: 3;
  }
  .reference-bunch .bunch-piece:nth-last-child(2) {
    grid-column: 2;
  }
}
@media (max-width: 850px) {
  .workflow-cards {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  .workflow-cards::before {
    display: none;
  }
  .reference-workflow .workflow-step {
    padding: 26px 22px;
  }
  .reference-workflow .workflow-step h3 {
    font-size: 18px;
  }
  .reference-workflow .workflow-step p {
    font-size: 11px;
  }
  .reference-about .experience-intro {
    grid-template-columns: 0.85fr 1.15fr;
    gap: 30px;
  }
  .reference-about .about-story > .text-reveal {
    font-size: 30px;
  }
  .reference-about .about-portrait-image {
    aspect-ratio: 4/5.8;
  }
  .reference-footer .footer-colophon nav {
    margin-left: 0;
  }
  .reference-footer .footer-colophon {
    gap: 20px;
  }
}
@media (max-width: 700px) {
  .reference-heading {
    margin-bottom: 32px;
  }
  .reference-heading > .text-reveal {
    font-size: 33px;
    letter-spacing: -1.3px;
  }
  .reference-heading > .motion-reveal > p:not(.eyebrow) {
    font-size: 12px;
  }
  .reference-services .studio-services {
    gap: 18px;
  }
  .reference-services .studio-service {
    border-radius: 25px;
    padding: 27px;
    min-height: 360px;
  }
  .reference-services .studio-service h3 {
    font-size: 24px;
  }
  .reference-services .studio-service > p {
    font-size: 12px;
  }
  .workflow-cards {
    grid-template-columns: 1fr;
    gap: 18px;
    max-width: 500px;
    margin: auto;
  }
  .reference-workflow .workflow-step {
    border-radius: 24px;
    padding: 26px 24px 26px 80px;
  }
  .workflow-number {
    position: absolute;
    left: 23px;
    top: 26px;
    width: 32px;
    height: 32px;
  }
  .reference-workflow .workflow-step h3 {
    min-height: 0;
    font-size: 21px;
  }
  .reference-workflow .workflow-step p {
    font-size: 12px;
    line-height: 1.9;
  }
  .reference-workflow .workflow-step small {
    padding-top: 18px;
    font-size: 9px;
  }
  .reference-journey .journey-chapters {
    margin-left: 5px;
    padding-left: 23px;
  }
  .reference-journey .journey-chapter {
    padding: 24px 22px;
    border-radius: 24px;
  }
  .timeline-dot {
    left: -29px;
    top: 32px;
  }
  .journey-chapter header {
    flex-direction: column;
    gap: 14px;
  }
  .reference-journey .journey-chapter h3 {
    font-size: 23px;
  }
  .journey-phase {
    font-size: 8px;
    padding: 6px 10px;
  }
  .journey-mini-index {
    font-size: 7px;
  }
  .reference-journey .journey-chapter > p {
    font-size: 12px;
  }
  .journey-chapter li {
    font-size: 10px;
    gap: 8px;
  }
  .reference-journey .journey-signature {
    font-size: 19px;
  }
  .reference-about .experience-intro {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .reference-about .about-portrait {
    max-width: 430px;
    margin: auto;
    width: calc(100% - 15px);
  }
  .reference-about .about-portrait-image {
    aspect-ratio: 4/4.6;
    border-radius: 27px;
  }
  .reference-about .about-story > .text-reveal {
    font-size: 32px;
  }
  .reference-about .about-story p:not(.eyebrow):not(.experience-lead) {
    font-size: 12px;
  }
  .reference-about .fundamentals-section > .text-reveal {
    font-size: 28px;
  }
  .reference-about .fundamental-card {
    padding: 23px;
    border-radius: 21px;
  }
  .reference-bunch .bunch-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    width: calc(100% + 42px);
    margin-left: -21px;
    gap: 18px 14px;
  }
  .reference-bunch .bunch-piece:last-child,
  .reference-bunch .bunch-piece:nth-last-child(2) {
    grid-column: auto;
  }
  .reference-bunch .bunch-piece:nth-child(n) {
    transform: rotate(-3deg);
  }
  .reference-bunch .bunch-piece:nth-child(2n) {
    transform: rotate(3deg) translateY(17px);
  }
  .reference-bunch .bunch-caption small {
    display: none;
  }
  .reference-footer .footer-directory {
    grid-template-columns: 1fr 1fr;
    gap: 35px 20px;
  }
  .reference-footer .footer-directory > .motion-reveal:first-child {
    grid-column: 1/-1;
  }
  .reference-footer .footer-directory nav {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .reference-footer .footer-directory nav h3 {
    margin-bottom: 6px;
  }
  .reference-footer .footer-directory h3 {
    margin-bottom: 22px;
  }
  .reference-footer .footer-email {
    font-size: 9px;
    word-break: break-word;
  }
  .reference-footer .footer-email svg {
    width: 13px;
  }
  .reference-footer .footer-colophon {
    flex-direction: row;
    gap: 18px;
  }
  .reference-footer .footer-colophon > p {
    flex-basis: 100%;
  }
  .reference-footer .footer-colophon nav {
    gap: 14px;
    max-width: calc(100% - 50px);
    font-size: 8px;
  }
  .reference-footer .footer-colophon .cookie-settings-link {
    font-size: 8px;
  }
  .reference-footer .footer-colophon > a {
    margin-left: auto;
    flex-shrink: 0;
  }
  .reference-footer .footer-art {
    height: 24vw;
  }
  .reference-footer .footer-art > span {
    font-size: 20vw;
  }
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .motion-reveal,
  html:not([data-motion="full"]) .motion-word {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }
  html:not([data-motion="full"]) .reference-workflow .workflow-step,
  html:not([data-motion="full"]) .service-learn svg {
    transition: none;
  }
  html:not([data-motion="full"]) .reference-services .studio-service:hover,
  html:not([data-motion="full"]) .reference-workflow .workflow-step:hover,
  html:not([data-motion="full"]) .service-learn:hover svg {
    transform: none;
  }
  html:not([data-motion="full"]) .reference-bunch .bunch-piece:nth-child(n) {
    transform: none;
  }
}
html[data-motion="reduced"] .reference-bunch .bunch-piece:nth-child(n) {
  transform: none;
}
html[data-motion="reduced"] .reference-services .studio-service:hover,
html[data-motion="reduced"] .reference-workflow .workflow-step:hover,
html[data-motion="reduced"] .service-learn:hover svg {
  transform: none;
}
html[data-motion="reduced"] .reference-workflow .workflow-step,
html[data-motion="reduced"] .service-learn svg {
  transition: none;
}
html[data-motion="reduced"] .motion-reveal,
html[data-motion="reduced"] .motion-word {
  opacity: 1 !important;
  transform: none !important;
  filter: none !important;
}
``````

## app/refinement.css

``````css
/* Refined motion remains native: no second scrolling engine or page-load gate. */
:root {
  --ease-editorial: cubic-bezier(0.22, 1, 0.36, 1);
  --section-space: clamp(72px, 9vw, 144px);
  --radius-editorial: 18px;
}
.studio-section,
.work-section,
.experience-section,
.skills-section {
  scroll-margin-top: 104px;
}
.site-header {
  transition: transform 0.35s var(--ease-editorial);
}
.site-header.is-scroll-hidden:not(:focus-within) {
  transform: translateY(-110%);
}
.desktop-nav a[aria-current="location"] {
  color: var(--gold);
}
.desktop-nav a[aria-current="location"]::after {
  transform: scaleX(1);
}
.motion-control {
  display: flex;
  align-items: center;
  gap: 5px;
  color: var(--muted);
  font-size: 10px;
}
.motion-control select {
  min-height: 44px;
  max-width: 66px;
  padding: 0 6px;
  border: 1px solid var(--line);
  border-radius: 8px;
  color: var(--text);
  background: var(--surface);
  font: inherit;
  font-size: 11px;
  cursor: pointer;
}
.motion-control:focus-within {
  color: var(--gold);
}
.nav-row {
  gap: 18px;
}
.desktop-nav {
  gap: clamp(12px, 1.6vw, 26px);
}
.hero-title-reveal .motion-word {
  display: inline-block;
  animation: editorial-line-in 0.8s var(--ease-editorial) both;
  animation-delay: calc(100ms + var(--word-delay, 0s));
}
@keyframes editorial-line-in {
  from {
    transform: translateY(105%);
    opacity: 0.1;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
[data-motion-reveals="enabled"] [data-reveal="block"] {
  transition-property: opacity, transform;
  transition-timing-function: var(--ease-editorial);
}
[data-motion-reveals="enabled"] [data-reveal="block"]:not(.is-revealed) {
  filter: none;
  transform: none;
}
[data-motion-reveals="enabled"] [data-reveal="words"] .motion-word {
  transition-timing-function: var(--ease-editorial);
}
.work-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 24px 0 36px;
}
.work-filters button {
  min-height: 46px;
  display: inline-flex;
  align-items: center;
  gap: 18px;
  padding: 11px 19px;
  border: 1px solid var(--line);
  border-radius: 100px;
  background: transparent;
  color: var(--muted);
  font-size: 12px;
  transition: transform 0.25s var(--ease-editorial);
}
.work-filters button span {
  font-family: var(--font-space);
  opacity: 0.65;
  font-size: 10px;
}
.work-filters button[aria-selected="true"] {
  background: var(--text);
  border-color: var(--text);
  color: var(--bg);
}
.work-filters button:hover {
  transform: translateY(-2px);
}
.work-panel {
  min-height: min(70vh, 680px);
}
.work-filter-enter {
  animation: work-filter-enter 0.45s var(--ease-editorial) both;
}
@keyframes work-filter-enter {
  from {
    opacity: 0.2;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.interface-study-section {
  margin-top: 55px;
}
.interface-study-section > .eyebrow {
  margin-bottom: 25px;
}
.interface-studies-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 36px 26px;
}
.interface-study-card {
  display: block;
  overflow: hidden;
  border-radius: var(--radius-editorial);
  border: 1px solid var(--line);
  background: var(--surface);
}
.interface-study-image {
  position: relative;
  aspect-ratio: 16/10;
  overflow: hidden;
  background: var(--bg);
}
.interface-study-image img {
  object-fit: cover;
  object-position: top;
  transition: transform 0.8s var(--ease-editorial);
}
.interface-study-card > div:last-child {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
}
.interface-study-card small {
  display: block;
  font-size: 9px;
  letter-spacing: 0.1em;
  color: var(--muted);
}
.interface-study-card strong {
  display: block;
  font-family: var(--font-space);
  font-size: clamp(24px, 3vw, 36px);
}
.interface-study-card:hover img,
.interface-study-card:focus-visible img {
  transform: scale(1.035);
}
.work-ai-invitation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
  border-block: 1px solid var(--line);
  padding: 38px 0;
  margin-top: 50px;
}
.work-ai-invitation h3 {
  font-size: clamp(22px, 3vw, 36px);
  margin: 10px 0;
  letter-spacing: -0.04em;
}
.work-ai-invitation p:not(.eyebrow) {
  font-size: 13px;
  color: var(--muted);
  max-width: 48ch;
}
.work-ai-invitation .button {
  flex-shrink: 0;
}
.tool-purpose {
  display: block;
  font-size: 10px;
  color: var(--muted);
  margin-top: 3px;
  font-weight: 400;
}
.toolkit-row li {
  align-items: center;
}
.section-anchor {
  scroll-margin-top: 110px;
}
.tool-marquee {
  overflow: hidden;
  margin: 42px 0 24px;
  padding: 22px 0;
  border-block: 1px solid var(--line);
  mask-image: linear-gradient(
    90deg,
    transparent,
    var(--neutral-black) 8%,
    var(--neutral-black) 92%,
    transparent
  );
}
.tool-marquee > div {
  display: flex;
  width: max-content;
  animation: toolkit-travel 38s linear infinite;
}
.tool-marquee > div > span {
  display: flex;
  flex-shrink: 0;
}
.tool-marquee span span {
  display: inline-flex;
  align-items: center;
  gap: 36px;
  padding-right: 36px;
  font-family: var(--font-space);
  font-size: clamp(20px, 3vw, 34px);
  color: var(--muted);
}
.tool-marquee i {
  font-style: normal;
  color: var(--gold);
  font-size: 18px;
}
.tool-marquee:hover > div {
  animation-play-state: paused;
}
@keyframes toolkit-travel {
  to {
    transform: translateX(-50%);
  }
}
.journey-editorial-list {
  position: relative;
}
.journey-editorial-list::before {
  content: "";
  position: absolute;
  inset: 0 auto 0 -20px;
  width: 2px;
  background: var(--line);
}
@media (max-width: 1023px) {
  .mobile-nav:not([hidden]) {
    min-height: calc(100dvh - 82px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 24px max(25px, 6vw) 80px;
  }
  .mobile-nav a {
    font-family: var(--font-space);
    font-size: clamp(22px, 5vw, 38px);
    color: var(--text);
    animation: work-filter-enter 0.5s var(--ease-editorial) both;
  }
  .mobile-nav a:nth-child(2) {
    animation-delay: 40ms;
  }
  .mobile-nav a:nth-child(3) {
    animation-delay: 80ms;
  }
  .mobile-nav a:nth-child(4) {
    animation-delay: 120ms;
  }
  .mobile-nav a:nth-child(5) {
    animation-delay: 160ms;
  }
  .mobile-nav a:nth-child(6) {
    animation-delay: 200ms;
  }
  .mobile-nav a:nth-child(7) {
    animation-delay: 240ms;
  }
}
@media (max-width: 700px) {
  .interface-studies-grid {
    grid-template-columns: minmax(0, 1fr);
    gap: 22px;
  }
  .work-filters {
    gap: 8px;
  }
  .work-filters button {
    padding: 10px 13px;
    font-size: 11px;
    gap: 10px;
  }
  .work-ai-invitation {
    align-items: flex-start;
    flex-direction: column;
  }
  .motion-control > span {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
  }
  .motion-control select {
    max-width: 56px;
  }
  .nav-row {
    gap: 10px;
  }
  .journey-editorial-list::before,
  .journey-editorial-list::after {
    left: -9px;
  }
  .workflow-cards {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }
  .workflow-cards > .motion-reveal {
    position: sticky;
    top: 105px;
  }
  .workflow-cards > .motion-reveal:nth-child(2) {
    top: 119px;
  }
  .workflow-cards > .motion-reveal:nth-child(3) {
    top: 133px;
  }
  .workflow-cards > .motion-reveal:nth-child(4) {
    top: 147px;
  }
  .workflow-cards > .motion-reveal:nth-child(5) {
    top: 161px;
  }
  .reference-workflow .workflow-step {
    min-height: 250px;
  }
}
/* Auto honors the OS. On is an explicit user override, Off always stops motion. */
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .hero-title-reveal .motion-word,
  html:not([data-motion="full"]) .tool-marquee > div,
  html:not([data-motion="full"]) .journey-editorial-list::after {
    animation: none;
    transform: none;
  }
}
html[data-motion="reduced"] .hero-title-reveal .motion-word,
html[data-motion="reduced"] .tool-marquee > div,
html[data-motion="reduced"] .journey-editorial-list::after {
  animation: none;
  transform: none;
}
.scroll-progress {
  animation: none !important;
}
.journey-editorial-list::after {
  content: "";
  position: absolute;
  inset: 0 auto 0 -20px;
  width: 2px;
  background: var(--gold);
  transform-origin: top;
  transform: scaleY(var(--journey-progress, 0));
}
@media (max-width: 700px) {
  .journey-editorial-list::after {
    left: -9px;
  }
}
.project-view-cursor {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 80;
  pointer-events: none;
  display: grid;
  place-items: center;
  width: 76px;
  height: 76px;
  border-radius: 50%;
  background: var(--text);
  color: var(--bg);
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
}
html.lenis,
html.lenis body {
  height: auto;
}
.lenis.lenis-smooth {
  scroll-behavior: auto !important;
}
.lenis.lenis-stopped {
  overflow: hidden;
}
.lenis.lenis-smooth [data-lenis-prevent] {
  overscroll-behavior: contain;
}
@media (hover: none), (pointer: coarse) {
  .project-view-cursor {
    display: none;
  }
}
/* Keep the wordmark light alive without repainting its gradient each frame. */
.footer-wordmark-window > span {
  animation: wordmark-breathe 10s ease-in-out infinite alternate;
}
@keyframes wordmark-breathe {
  from {
    opacity: 0.65;
  }
  to {
    opacity: 1;
  }
}
.form-field {
  position: relative;
}
.form-field:has(> input) > label,
.form-field:has(> textarea) > label {
  position: absolute;
  left: 15px;
  top: 19px;
  z-index: 1;
  margin: 0;
  pointer-events: none;
  transform-origin: left top;
  transition: transform 0.25s var(--ease-editorial);
}
.form-field > input,
.form-field > textarea {
  padding-top: 27px;
  padding-bottom: 10px;
}
.form-field:has(> input:focus) > label,
.form-field:has(> input:not(:placeholder-shown)) > label,
.form-field:has(> textarea:focus) > label,
.form-field:has(> textarea:not(:placeholder-shown)) > label {
  transform: translateY(-12px) scale(0.8);
  color: var(--muted);
}
.form-field > input::placeholder,
.form-field > textarea::placeholder {
  color: transparent;
}
.form-field > input:focus::placeholder,
.form-field > textarea:focus::placeholder {
  color: var(--muted);
}
.contact-form .form-success {
  animation: work-filter-enter 0.4s var(--ease-editorial) both;
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .footer-wordmark-window > span {
    animation: none;
  }
}
html[data-motion="reduced"] .footer-wordmark-window > span {
  animation: none;
}
/* Privacy controls are usable immediately, independently of branded font downloads. */
.consent-banner,
.privacy-dialog {
  font-family: system-ui, sans-serif;
}
``````

## app/robots.ts

``````ts
import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules:
      process.env.VERCEL_ENV === "preview" ||
      process.env.CONTEXT === "deploy-preview"
        ? { userAgent: "*", disallow: "/" }
        : { userAgent: "*", allow: "/", disallow: ["/admin", "/api/admin"] },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
``````

## app/services/[slug]/page.tsx

``````tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { getServices, getIdentity } from "@/lib/content-loader";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = (await getServices()).find((item) => item.id === slug);
  if (!service)
    return {
      title: "Service not found",
      robots: { index: false, follow: false },
    };
  return {
    title: `${service.title} — Elvora`,
    description: service.description,
    alternates: { canonical: `/services/${slug}` },
  };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [services, identity] = await Promise.all([
    getServices(),
    getIdentity(),
  ]);
  const service = services.find((item) => item.id === slug);
  if (!service) notFound();
  return (
    <>
      <Navbar identity={identity} rootLinks />
      <main id="main-content" className="container agency-detail">
        <Link className="eyebrow" href="/services">
          ELVORA / SERVICES
        </Link>
        <header className="agency-detail-hero">
          <p className="eyebrow">A PRACTICAL SCOPE. BUILT AROUND YOU.</p>
          <h1>{service.title}</h1>
          <p>{service.description}</p>
          <Link href="/contact" className="button button-gold">
            Discuss your project <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </header>
        <div className="agency-detail-grid">
          <section>
            <p className="eyebrow">01 / DELIVERABLES</p>
            <h2>What we can build.</h2>
            <ul>
              {service.scope.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <p className="eyebrow">02 / GETTING STARTED</p>
            <h2>What I need from you.</h2>
            <ul>
              {service.requirements.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
        <p className="agency-detail-note">
          {service.detail} Features, timing and provider costs are agreed before
          work begins.
        </p>
        <section className="agency-related">
          <h2>Other ways I can help.</h2>
          {services
            .filter((item) => item.id !== slug)
            .map((item) => (
              <Link key={item.id} href={`/services/${item.id}`}>
                {item.title}
                <ArrowUpRight size={20} aria-hidden="true" />
              </Link>
            ))}
        </section>
      </main>
      <Footer brand={identity.brand} email={identity.email} />
    </>
  );
}
``````

## app/services/page.tsx

``````tsx
import { Services } from "@/components/studio-sections";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getServices } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("services");

export default async function Page() {
  const services = await getServices();
  return (
    <SiteShell page="services">
      <Services services={services} />
    </SiteShell>
  );
}
``````

## app/showcase.css

``````css
/* A curved wall of actual project views, with one accessible index underneath. */
.dome-showcase {
  padding-block: clamp(70px, 8vw, 125px);
  overflow: clip;
}
.dome-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
}
.dome-heading h2 {
  margin: 18px 0 20px;
  font-size: clamp(36px, 4.6vw, 68px);
  letter-spacing: -0.06em;
}
.dome-intro {
  max-width: 63ch;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.9;
}
.dome-view-all {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  gap: 16px;
  padding-block: 14px;
  min-height: 44px;
  font-size: 12px;
  color: var(--gold);
  border-bottom: 1px solid var(--line);
}
.dome-view-all svg {
  transition: transform 0.3s var(--ease-editorial);
}
.dome-view-all:hover svg {
  transform: translate(3px, -3px);
}
.dome-gallery {
  --dome-radius: clamp(480px, 80vw, 1150px);
  --dome-tile: clamp(100px, 16vw, 250px);
  --wall-drift: 0px;
  position: relative;
  height: clamp(440px, 51vw, 800px);
  margin-top: 30px;
  overflow: hidden;
  perspective: 1400px;
  perspective-origin: 50% 45%;
  isolation: isolate;
  background: radial-gradient(
    ellipse at 50% 50%,
    color-mix(in srgb, var(--muted) 7%, transparent),
    transparent 68%
  );
}
.dome-cylinder {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  transform: translateZ(calc(-1 * var(--dome-radius))) rotateZ(-4deg);
}
.dome-column {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--dome-tile);
  margin-left: calc(var(--dome-tile) / -2);
  transform-style: preserve-3d;
  transform: translateY(-50%) rotateY(var(--column-angle))
    translateZ(var(--dome-radius));
}
.dome-stack {
  transform: translateY(calc(var(--column-offset) + var(--wall-drift)));
}
.dome-strip {
  display: grid;
  gap: 12px;
  animation: dome-drift var(--column-duration) ease-in-out infinite;
  animation-direction: var(--column-direction);
  animation-play-state: paused;
}
.dome-gallery[data-visible="true"] .dome-strip {
  animation-play-state: running;
}
.dome-gallery:hover .dome-strip {
  animation-play-state: paused;
}
.dome-tile {
  display: block;
  position: relative;
  aspect-ratio: 1.38;
  overflow: hidden;
  border-radius: clamp(7px, 1vw, 15px);
  border: 1px solid color-mix(in srgb, var(--text) 13%, transparent);
  background: var(--surface);
  backface-visibility: hidden;
  transition: transform 0.45s var(--ease-editorial);
}
.dome-tile img {
  object-fit: cover;
  object-position: top;
}
.dome-tile > span {
  position: absolute;
  inset: auto 0 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 19px 12px 9px;
  color: var(--text);
  font-size: 10px;
  background: linear-gradient(transparent, color-mix(in srgb, var(--neutral-black) 66.67%, transparent));
  opacity: 0;
  transform: translateY(4px);
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.dome-tile:hover {
  transform: translateZ(10px) scale(1.025);
}
.dome-tile:hover > span {
  opacity: 1;
  transform: translateY(0);
}
.dome-vignette {
  position: absolute;
  inset: -1px;
  z-index: 2;
  pointer-events: none;
  background:
    linear-gradient(var(--bg), transparent 16%, transparent 78%, var(--bg)),
    linear-gradient(
      90deg,
      var(--bg),
      transparent 9%,
      transparent 91%,
      var(--bg)
    );
}
.dome-signature {
  position: absolute;
  inset: auto 0 25px;
  z-index: 3;
  text-align: center;
  font-size: 8px;
  letter-spacing: 0.2em;
  color: var(--muted);
  pointer-events: none;
}
.dome-bottom {
  padding-top: 20px;
}
.dome-bottom-heading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  border-top: 1px solid var(--line);
  padding-top: 24px;
}
.dome-bottom-heading > span {
  color: var(--muted);
  font-size: 11px;
}
.dome-index {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 22px 0;
}
.dome-index a {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: 100px;
  padding: 10px 14px;
  min-height: 44px;
  color: var(--text);
  font-size: 11px;
  transition: transform 0.25s;
}
.dome-index a > span {
  color: var(--muted);
  font-size: 9px;
}
.dome-index a > svg {
  color: var(--gold);
}
.dome-index a:hover {
  background: var(--surface);
  transform: translateY(-2px);
}
.dome-bottom > .studio-note {
  max-width: 78ch;
}
@keyframes dome-drift {
  from {
    transform: translate3d(0, 24px, 0);
  }
  to {
    transform: translate3d(0, -28px, 0);
  }
}
.dome-gallery[data-still="true"] .dome-strip {
  animation: none;
}
.dome-gallery[data-still="true"] .dome-stack {
  transform: translateY(var(--column-offset));
}

/* A human-led process, presented as an editorial index in the same theme. */
.website-workflow {
  display: grid;
  grid-template-columns: 0.9fr 1.2fr;
  align-items: start;
  gap: 0 clamp(40px, 7vw, 110px);
  padding-block: clamp(75px, 9vw, 140px);
}
.website-workflow .reference-heading {
  position: sticky;
  top: 130px;
  text-align: left;
  margin: 0;
  max-width: none;
}
.website-workflow .reference-heading h2 {
  font-size: clamp(44px, 4.7vw, 70px);
  letter-spacing: -0.065em;
  margin: 20px 0;
}
.website-workflow .reference-heading > .motion-reveal > p:not(.eyebrow) {
  max-width: 37ch;
  margin: 0;
  color: var(--muted);
  font-size: 13px;
  line-height: 1.9;
}
.website-workflow .workflow-cards {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 0;
  border-top: 1px solid var(--line);
  margin: 0;
}
.website-workflow .workflow-cards > .motion-reveal {
  position: relative;
  top: auto;
}
.website-workflow .workflow-cards::before {
  display: none;
}
.website-workflow .workflow-step {
  display: grid;
  grid-template-columns: 44px minmax(0, 1fr);
  align-content: start;
  gap: 8px 18px;
  position: relative;
  min-height: 0;
  height: auto;
  padding: 30px 0;
  background: transparent;
  border: none;
  border-radius: 0;
  border-bottom: 1px solid var(--line);
  box-shadow: none;
  transform: none;
  transition: none;
}
.website-workflow .workflow-step:hover {
  transform: none;
  box-shadow: none;
}
.website-workflow .workflow-number {
  grid-column: 1;
  grid-row: 1 / 4;
  width: auto;
  height: auto;
  background: transparent;
  border: none;
  border-radius: 0;
  color: var(--gold);
  font-family: var(--font-space);
  font-size: 14px;
  justify-content: flex-start;
  align-items: flex-start;
  padding-top: 5px;
}
.website-workflow .workflow-card-icon {
  position: absolute;
  right: 0;
  top: 34px;
  color: var(--gold);
  opacity: 0.8;
}
.website-workflow .workflow-step h3 {
  grid-column: 2;
  margin: 0;
  padding-right: 28px;
  font-size: clamp(20px, 2vw, 27px);
  line-height: 1.25;
  letter-spacing: -0.04em;
}
.website-workflow .workflow-step p {
  grid-column: 2;
  margin: 0;
  padding: 0;
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
}
.website-workflow .workflow-step small {
  grid-column: 2;
  display: flex;
  gap: 8px;
  align-items: center;
  position: static;
  border: none;
  padding: 6px 0 0;
  margin: 0;
  color: var(--gold);
  font-size: 10px;
}
.website-workflow > .motion-reveal {
  grid-column: 2;
}
.website-workflow .workflow-caption {
  text-align: left;
  margin: 25px 0 0;
  font-size: 10px;
}
@media (max-width: 850px) {
  .dome-heading {
    align-items: flex-start;
    gap: 25px;
  }
  .dome-intro {
    max-width: 50ch;
  }
  .dome-view-all {
    font-size: 10px;
  }
  .website-workflow {
    grid-template-columns: minmax(0, 1fr);
    gap: 35px;
  }
  .website-workflow .reference-heading {
    position: static;
  }
  .website-workflow .reference-heading > .motion-reveal > p:not(.eyebrow) {
    max-width: 55ch;
  }
  .website-workflow > .motion-reveal {
    grid-column: 1;
  }
}
@media (max-width: 600px) {
  .dome-heading {
    display: block;
  }
  .dome-heading h2 {
    font-size: 39px;
  }
  .dome-view-all {
    margin-top: 12px;
    font-size: 11px;
  }
  .dome-gallery {
    margin-top: 0;
    perspective: 850px;
  }
  .dome-strip {
    gap: 8px;
  }
  .dome-cylinder {
    transform: translateZ(calc(-1 * var(--dome-radius))) rotateZ(-5deg);
  }
  .dome-signature {
    bottom: 15px;
    font-size: 6px;
  }
  .dome-bottom-heading {
    display: block;
  }
  .dome-bottom-heading > span {
    display: block;
    margin-top: 9px;
  }
  .dome-index {
    gap: 7px;
  }
  .dome-index a {
    padding: 9px 11px;
    font-size: 10px;
  }
  .website-workflow .workflow-step {
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 9px 13px;
    padding-block: 26px;
  }
  .website-workflow .workflow-number {
    font-size: 12px;
  }
  .website-workflow .workflow-card-icon {
    top: 30px;
  }
}
``````

## app/sitemap.ts

``````ts
import type { MetadataRoute } from "next";
import { getServices, getProjects } from "@/lib/content-loader";
import { site } from "@/data/site";
import { studies } from "@/data/studies";
import { portfolioPages } from "@/data/navigation";
import { concepts } from "@/data/concepts";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, projects] = await Promise.all([
    getServices(),
    getProjects(),
  ]);
  return [
    ...Object.values(portfolioPages)
      .filter((page) => !page.href.includes("#"))
      .map((page) => ({
        url: `${site.url}${page.href}`,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
    ...services.map((service) => ({
      url: `${site.url}/services/${service.id}`,
      priority: 0.7,
    })),
    ...projects.map((project) => ({
      url: `${site.url}/work/${project.id}`,
      priority: 0.6,
    })),
    { url: site.url, changeFrequency: "monthly", priority: 1 },
    ...["privacy", "cookies", "terms"].map((path) => ({
      url: `${site.url}/${path}`,
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
    ...studies.map((study) => ({
      url: `${site.url}/studies/${study.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
    ...Object.keys(concepts).map((slug) => ({
      url: `${site.url}/demo/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
``````

## app/skills/page.tsx

``````tsx
import { Skills } from "@/components/skills";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getSkills } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("skills");

export default async function Page() {
  const skills = await getSkills();
  return (
    <SiteShell page="skills">
      <Skills skills={skills} />
    </SiteShell>
  );
}
``````

## app/studies/[slug]/page.tsx

``````tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { studies } from "@/data/studies";
import { DesignStudy } from "@/components/design-study";
import { DemoWindow } from "@/components/demo-window";
import "../../demo-window.css";
import "../studies.css";
export const dynamicParams = false;

export function generateStaticParams() {
  return studies.map(({ id }) => ({ slug: id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = studies.find(({ id }) => id === slug);
  return {
    title: study ? `${study.name} — UI study by Elvora` : "Study not found",
    description: study?.description,
    alternates: { canonical: `/studies/${(await params).slug}` },
  };
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = studies.find(({ id }) => id === slug);
  if (!study) notFound();
  return (
    <DemoWindow title={study.name}>
      <DesignStudy study={study} />
    </DemoWindow>
  );
}
``````

## app/studies/studies.css

``````css
.study-surface {
  --study-accent: #c4ef6a;
  background: #eff0ec;
  color: #222723;
  min-height: 100vh;
  font-family: var(--font-inter), sans-serif;
}
.study-surface * {
  box-sizing: border-box;
}
.study-surface h1,
.study-surface h2,
.study-surface h3,
.study-surface p {
  margin: 0;
}
.study-surface a:focus-visible {
  outline-color: currentColor;
}
.study-surface h1 {
  font-size: clamp(40px, 4.8vw, 68px);
  line-height: 1.02;
  letter-spacing: -3px;
  white-space: pre-line;
}
.study-surface h2 {
  font-size: 15px;
  letter-spacing: -0.3px;
  font-weight: 500;
}
.study-notice {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  min-height: 34px;
  padding: 8px 28px;
  background: #141715;
  color: #dde0d9;
  font-size: 8px;
  letter-spacing: 1px;
}
.study-notice a {
  text-decoration: underline;
  text-underline-offset: 3px;
  letter-spacing: 0;
}
.study-notice > span:last-child {
  opacity: 0.8;
}
.study-dashboard {
  display: grid;
  grid-template-columns: 210px 1fr;
  max-width: 1440px;
  margin: auto;
  min-height: 820px;
}
.study-sidebar {
  padding: 35px 24px;
  background: #e4e7df;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #22272314;
}
.study-logo {
  display: flex;
  align-items: center;
  gap: 9px;
  font:
    600 32px var(--font-space),
    sans-serif;
  letter-spacing: -1.8px;
}
.study-sidebar > small {
  margin-top: 38px;
  font-size: 9px;
  color: #555d54;
}
.study-sidebar nav {
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.study-sidebar nav a {
  padding: 13px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #4e574e;
  font-size: 11px;
  border-radius: 8px;
}
.study-sidebar nav .selected {
  background: #222c23;
  color: #e3f2d6;
}
.study-user {
  margin-top: auto;
  padding-top: 40px;
  display: flex;
  gap: 10px;
  align-items: center;
  font-size: 8px;
  color: #465245;
}
.study-user > span,
.study-avatar {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #c4d8b0;
  color: #293529;
  font-size: 11px;
  flex-shrink: 0;
}
.study-user small {
  display: block;
  font-size: 7px;
  margin-top: 5px;
  letter-spacing: 0.6px;
}
.study-dashboard-main {
  padding: 27px 40px;
}
.study-dashboard-main > header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.study-dashboard-main > header > p {
  font-size: 8px;
  letter-spacing: 1.6px;
  color: #586155;
}
.study-dashboard-main > header > div {
  display: flex;
  align-items: center;
  gap: 20px;
}
.study-dashboard-greeting {
  margin: 35px 0 28px;
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 35px;
}
.study-dashboard-greeting h1 {
  font-size: 45px;
  letter-spacing: -2px;
}
.study-dashboard-greeting p {
  color: #586155;
  font-size: 11px;
  line-height: 1.7;
  max-width: 220px;
}
.study-metrics {
  display: grid;
  grid-template-columns: 1.5fr 1fr 1fr;
  gap: 15px;
  margin-bottom: 25px;
}
.study-metrics > div {
  border: 1px solid #26372215;
  background: #f8f9f5;
  border-radius: 12px;
  padding: 22px;
}
.study-metrics > div:first-child {
  background: #d6ebbb;
}
.study-metrics small {
  display: block;
  font-size: 10px;
  color: #46543e;
}
.study-metrics strong {
  display: block;
  margin: 15px 0 12px;
  font:
    500 31px var(--font-space),
    sans-serif;
  letter-spacing: -1px;
}
.study-metrics span {
  font-size: 7px;
  letter-spacing: 0.8px;
  color: #53614a;
}
.study-dashboard-panels {
  display: grid;
  grid-template-columns: 1.7fr 1fr;
  gap: 20px;
}
.study-graph-panel {
  min-width: 0;
  border: 1px solid #26372215;
  background: #f8f9f5;
  border-radius: 13px;
  padding: 23px;
}
.study-graph-panel > div:first-child {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
.study-graph-panel > div:first-child > span {
  font-size: 7px;
  color: #52604a;
  letter-spacing: 0.7px;
}
.study-chart {
  width: 100%;
  color: #709a4b;
  display: block;
  margin-top: 23px;
}
.study-week {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  color: #52604a;
  font-size: 8px;
}
.study-bank-card {
  overflow: hidden;
  isolation: isolate;
  position: relative;
  border-radius: 14px;
  padding: 25px;
  background: #243829;
  color: #e4f2d9;
  min-height: 225px;
}
.study-bank-card > svg {
  color: #c4ef6a;
}
.study-bank-card > p {
  margin-top: 20px;
  font:
    500 30px var(--font-space),
    sans-serif;
  letter-spacing: -1px;
}
.study-bank-card strong {
  font-size: 11px;
  display: block;
  margin-top: 25px;
  font-weight: 400;
  letter-spacing: 2px;
}
.study-bank-card small {
  display: block;
  font-size: 8px;
  margin-top: 20px;
}
.bank-card-orb {
  position: absolute;
  width: 210px;
  height: 210px;
  top: -60px;
  right: -85px;
  border: 1px solid #c4ef6a55;
  border-radius: 50%;
  box-shadow:
    0 0 0 20px #c4ef6a09,
    0 0 0 40px #c4ef6a08;
  z-index: -1;
}
.study-activity {
  margin-top: 25px;
}
.study-activity h2 {
  margin-bottom: 16px;
}
.study-activity > div {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 0;
  border-top: 1px solid #26372215;
  font-size: 9px;
}
.activity-symbol {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  background: #e1e8d7;
  border-radius: 9px;
}
.study-activity small {
  font-size: 7px;
  letter-spacing: 1px;
  margin-left: auto;
  color: #52604a;
}
.activity-bars {
  display: block;
  width: 120px;
  height: 4px;
  background: #dce2d5;
  margin-left: 15px;
}
.activity-bars i {
  display: block;
  height: 100%;
  background: #799d57;
}
.study-analytics {
  background: #100f19;
  color: #eeedf8;
}
.study-analytics .study-sidebar {
  background: #171522;
  border-color: #ffffff0e;
}
.study-analytics .study-sidebar > small,
.study-analytics .study-sidebar nav a,
.study-analytics .study-user,
.study-analytics .study-dashboard-main > header > p,
.study-analytics .study-dashboard-greeting p,
.study-analytics .study-metrics small,
.study-analytics .study-metrics span,
.study-analytics .study-week,
.study-analytics .study-graph-panel > div:first-child > span,
.study-analytics .study-activity small {
  color: #a5a1b7;
}
.study-analytics .study-sidebar nav .selected {
  color: #e0d4ff;
  background: #b49dff19;
}
.study-analytics .study-avatar,
.study-analytics .study-user > span {
  color: #e0d4ff;
  background: #b49dff30;
}
.study-analytics .study-metrics > div,
.study-analytics .study-graph-panel {
  background: #1b1829;
  border-color: #ffffff13;
}
.study-analytics .study-metrics > div:first-child {
  background: linear-gradient(115deg, #30234e, #27203c);
}
.study-analytics .study-chart {
  color: #b49dff;
}
.study-analytics .study-activity > div {
  border-color: #ffffff15;
}
.study-analytics .activity-symbol {
  background: #b49dff19;
  color: #d0baff;
}
.study-analytics .activity-bars {
  background: #b49dff15;
}
.study-analytics .activity-bars i {
  background: #a68be5;
}
.study-network {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: radial-gradient(ellipse, #a68be519, transparent 80%), #171522;
  border: 1px solid #ffffff13;
  border-radius: 13px;
  padding: 15px;
}
.study-network p {
  font-size: 8px;
  color: #a5a1b7;
  margin-top: 8px;
}
.network-globe {
  position: relative;
  height: 130px;
  width: 140px;
  display: grid;
  place-items: center;
}
.network-globe i {
  position: absolute;
  inset: 12px 17px;
  border: 1px solid #b49dff55;
  border-radius: 50%;
}
.network-globe i:nth-child(2) {
  transform: rotateY(65deg) rotateZ(25deg);
}
.network-globe i:nth-child(3) {
  transform: rotateX(65deg) rotateZ(-25deg);
}
.network-globe > span {
  display: grid;
  place-items: center;
  height: 50px;
  width: 50px;
  border-radius: 16px;
  background: #34274f;
  color: #d0baff;
  box-shadow: 0 0 55px #a68be526;
}
/* Each editorial study has a distinct composition, rather than a repeated dashboard. */
.study-editorial {
  min-height: 820px;
  position: relative;
  overflow: hidden;
}
.study-editorial-header {
  height: 95px;
  padding: 0 55px;
  display: flex;
  gap: 30px;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}
.study-editorial-header nav {
  display: flex;
  gap: 35px;
  font-size: 10px;
}
.study-header-action {
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border: 1px solid currentColor;
  border-radius: 50%;
}
.study-editorial-hero {
  position: relative;
  min-height: 610px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  padding: 25px 55px 55px;
}
.study-editorial-copy {
  position: relative;
  z-index: 1;
}
.study-editorial-copy > p {
  font-size: 8px;
  letter-spacing: 1.8px;
  margin-bottom: 25px;
}
.study-editorial-copy h1 {
  font-size: clamp(45px, 5.7vw, 82px);
}
.study-editorial-copy > div {
  margin-top: 28px;
  max-width: 340px;
}
.study-editorial-copy > div > span {
  display: block;
  font-size: 12px;
  line-height: 1.85;
}
.study-editorial-copy a {
  display: inline-flex;
  align-items: center;
  gap: 22px;
  padding: 15px 20px;
  border: 1px solid currentColor;
  border-radius: 40px;
  margin-top: 28px;
  font-size: 10px;
}
.study-editorial-art {
  position: relative;
  min-width: 0;
  height: 550px;
}
.study-editorial-bottom {
  display: flex;
  align-items: center;
  gap: 25px;
  justify-content: space-between;
  padding: 24px 55px;
  font-size: 9px;
  letter-spacing: 1px;
  position: relative;
  z-index: 1;
  border-top: 1px solid #2927241c;
}
.study-travel {
  background: #edece2;
  color: #f9f6e9;
}
.study-editorial-travel .study-editorial-hero {
  min-height: 660px;
}
.study-editorial-travel .study-editorial-art {
  position: absolute;
  inset: -95px 0 0;
  height: auto;
  z-index: 0;
}
.study-editorial-travel .study-editorial-art img {
  object-fit: cover;
}
.study-editorial-travel .study-editorial-art::after {
  content: "";
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, #10261aaa, transparent 45%),
    linear-gradient(90deg, #111f1ab3, transparent 80%),
    linear-gradient(0deg, #14292055, transparent);
}
.study-editorial-travel .study-editorial-copy {
  padding: 80px 0 30px;
  grid-column: 1/-1;
}
.study-editorial-travel h1 {
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 86px;
  letter-spacing: -4px;
}
.study-editorial-travel .study-editorial-copy a {
  color: #263b2f;
  background: #f2f1e4;
  border-color: #f2f1e4;
}
.study-editorial-travel .study-editorial-bottom {
  color: #374638;
  background: #edece2;
}
.travel-coordinates {
  position: absolute;
  z-index: 1;
  right: 55px;
  bottom: 50px;
  color: #f2f1e4;
  font-size: 8px;
  letter-spacing: 1.8px;
}
.study-fitness {
  color: #f1ece5;
  background: #171715;
}
.study-editorial-fitness .study-editorial-header {
  border-bottom: 1px solid #ffffff20;
}
.study-editorial-fitness h1 {
  font-size: 90px;
  letter-spacing: -5px;
  line-height: 0.95;
  font-weight: 600;
}
.study-editorial-fitness .study-editorial-copy > p {
  color: #f87643;
}
.study-editorial-fitness .study-editorial-copy a {
  color: #171715;
  background: #f87643;
  border-color: #f87643;
  border-radius: 0;
}
.study-editorial-fitness .study-editorial-art {
  isolation: isolate;
  background: radial-gradient(ellipse, #f876431b, transparent 65%);
  perspective: 900px;
}
.fitness-ring {
  position: absolute;
  left: calc(50% - 125px);
  top: 100px;
  width: 250px;
  height: 350px;
  border: 40px solid #f87643;
  border-radius: 50%;
  transform: rotateY(45deg) rotateZ(30deg);
  box-shadow:
    inset 5px 0 10px #ffca9880,
    10px 15px 0 #74341e,
    25px 30px 40px #0008;
}
.ring-b {
  transform: rotateY(55deg) rotateZ(-20deg);
  border-color: #c3c3b7;
  left: calc(50% - 180px);
  top: 60px;
  z-index: -1;
  box-shadow:
    inset 5px 0 10px #fff8,
    10px 15px 0 #52534c,
    25px 30px 40px #0008;
}
.ring-c {
  width: 160px;
  height: 230px;
  left: calc(50% + 45px);
  top: 200px;
  border-width: 30px;
  transform: rotateY(-20deg) rotateZ(-30deg);
  border-color: #282925;
  box-shadow:
    inset 5px 0 10px #fff2,
    10px 15px 0 #10110d,
    25px 30px 40px #0008;
}
.fitness-art-type {
  position: absolute;
  bottom: 40px;
  right: 0;
  font:
    600 120px var(--font-space),
    sans-serif;
  color: #f8764320;
  letter-spacing: -10px;
}
.study-editorial-fitness .study-editorial-bottom {
  border-color: #ffffff20;
  color: #c1bcb3;
}
.study-editorial-fitness .study-logo {
  letter-spacing: -2px;
}
.study-creative {
  color: #292521;
  background: #f3eddf;
}
.study-editorial-creative .study-editorial-header {
  border-bottom: 1px solid #29252130;
}
.study-editorial-creative h1 {
  font-size: 83px;
  font-weight: 600;
  line-height: 0.95;
  letter-spacing: -5px;
}
.study-editorial-creative .study-editorial-copy a {
  border-radius: 0;
  color: #f3eddf;
  background: #292521;
}
.study-editorial-creative .study-editorial-art {
  display: grid;
  place-items: center;
}
.creative-poster {
  position: relative;
  background: #e1523a;
  color: #292521;
  width: 320px;
  height: 415px;
  padding: 25px;
  transform: rotate(8deg);
  box-shadow: 20px 25px 0 #e0d4bd;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.creative-poster > span,
.creative-poster > strong {
  font:
    600 35px/0.95 var(--font-space),
    sans-serif;
  letter-spacing: -2px;
  z-index: 1;
}
.creative-poster strong {
  margin-top: auto;
  font-size: 42px;
}
.creative-poster i {
  width: 280px;
  height: 280px;
  position: absolute;
  left: 20px;
  top: 60px;
  border: 50px solid #292521;
  border-radius: 50%;
  transform: rotateX(40deg) rotateZ(20deg);
}
.creative-poster-small {
  position: absolute;
  width: 190px;
  height: 230px;
  border: 1px solid #292521;
  background: #c3c5e3;
  left: -20px;
  bottom: 10px;
  transform: rotate(-9deg);
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.creative-poster-small i {
  width: 130px;
  height: 130px;
  background: repeating-conic-gradient(
    #292521 0deg 10deg,
    transparent 10deg 20deg
  );
  border-radius: 50%;
  margin: 10px auto;
}
.creative-poster-small span {
  font-size: 18px;
  font-weight: 600;
  letter-spacing: -1px;
}
.study-beauty {
  color: #514457;
  background: #f4eef2;
}
.study-editorial-beauty h1 {
  font-family: Georgia, serif;
  font-weight: 400;
  font-size: 78px;
  letter-spacing: -4px;
}
.study-editorial-beauty .study-logo {
  font:
    italic 43px Georgia,
    serif;
  letter-spacing: -3px;
}
.study-editorial-beauty .study-editorial-copy a {
  color: #f4eef2;
  background: #514457;
  border-color: #514457;
}
.study-editorial-beauty .study-editorial-art {
  isolation: isolate;
  display: grid;
  place-items: center;
}
.beauty-disc {
  position: absolute;
  height: 430px;
  width: 430px;
  border-radius: 50%;
  background: radial-gradient(ellipse at 25% 20%, #e5d8e5, #c7b4d2);
  z-index: -1;
  box-shadow: inset -20px -15px 35px #9a82a633;
}
.beauty-bottle {
  position: relative;
  width: 140px;
  height: 265px;
  background: linear-gradient(
    100deg,
    #c2a6bc88,
    #f5ecf1dc 28%,
    #b9a0b3a6 80%,
    #92778f99
  );
  border-radius: 20px 20px 24px 24px;
  border: 1px solid #c1a9ba;
  box-shadow:
    20px 25px 20px #6a526e25,
    inset 5px 0 14px #fff9;
  transform: rotate(-10deg) translate(-30px, 25px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.beauty-bottle > div {
  position: absolute;
  top: -65px;
  left: 36px;
  width: 68px;
  height: 75px;
  border-radius: 10px 10px 3px 3px;
  background: linear-gradient(90deg, #423745, #746476 40%, #514457);
  box-shadow: inset 3px 0 3px #fff3;
}
.beauty-bottle span {
  font:
    italic 38px Georgia,
    serif;
  letter-spacing: -2px;
}
.beauty-bottle small {
  font-size: 9px;
  margin-top: 15px;
}
.beauty-bottle i {
  position: absolute;
  font:
    italic 20px Georgia,
    serif;
  bottom: 25px;
  right: 25px;
}
.beauty-box {
  position: absolute;
  width: 130px;
  height: 290px;
  padding: 28px 15px;
  background: linear-gradient(90deg, #d6c7d9 88%, #bca9c0 88%);
  transform: rotate(9deg) translate(80px, 15px);
  z-index: -1;
  border: 1px solid #bca9c0;
  box-shadow: 25px 25px 20px #6a526e25;
}
.beauty-box span {
  display: block;
  font:
    italic 38px Georgia,
    serif;
  letter-spacing: -2px;
}
.beauty-box small {
  position: absolute;
  bottom: 25px;
  font-size: 7px;
  letter-spacing: 1px;
  left: 20px;
  right: 20px;
}
.beauty-art-caption {
  position: absolute;
  bottom: 15px;
  font-size: 8px;
  letter-spacing: 2px;
}
.study-details {
  display: flex;
  gap: 40px;
  align-items: center;
  justify-content: space-between;
  padding: 50px;
  color: #333c31;
  background: #eff0ec;
  border-top: 1px solid #24282022;
}
.study-details > div {
  max-width: 800px;
}
.study-details > div > p:first-child {
  font-size: 9px;
  letter-spacing: 1.5px;
  margin-bottom: 15px;
}
.study-details h2 {
  font-size: 24px;
  margin-bottom: 15px;
}
.study-details > div > p:last-child {
  font-size: 12px;
  line-height: 1.9;
  color: #596254;
}
.study-details > a {
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 11px;
  flex-shrink: 0;
  border-bottom: 1px solid #333c31;
  padding-bottom: 8px;
}
.study-footer {
  background: #eff0ec;
  color: #596254;
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 20px 50px;
  border-top: 1px solid #24282022;
  font-size: 9px;
}
@media (max-width: 1000px) {
  .study-sidebar {
    padding: 25px 15px;
  }
  .study-dashboard {
    grid-template-columns: 165px 1fr;
  }
  .study-dashboard-main {
    padding: 25px;
  }
  .study-dashboard-greeting {
    align-items: start;
    flex-direction: column;
    gap: 15px;
  }
  .study-dashboard-greeting p {
    max-width: none;
  }
  .study-dashboard-greeting h1 {
    font-size: 38px;
  }
  .study-metrics > div {
    padding: 18px;
  }
  .study-metrics strong {
    font-size: 24px;
  }
  .study-dashboard-panels {
    grid-template-columns: 1fr;
  }
  .study-bank-card,
  .study-network {
    display: none;
  }
  .study-editorial-header {
    padding: 0 30px;
  }
  .study-editorial-hero {
    padding-inline: 30px;
  }
  .study-editorial-copy h1 {
    font-size: 65px;
  }
  .study-editorial-art {
    transform: scale(0.8);
    transform-origin: center;
  }
  .study-editorial-travel .study-editorial-art {
    transform: none;
  }
  .creative-poster-small {
    left: -25px;
  }
  .study-editorial-bottom {
    padding-inline: 30px;
  }
}
@media (max-width: 650px) {
  .study-notice {
    padding: 10px 18px;
    font-size: 6px;
    gap: 15px;
  }
  .study-notice > span:last-child {
    display: none;
  }
  .study-dashboard {
    grid-template-columns: 1fr;
  }
  .study-sidebar {
    padding: 18px;
    border: 0;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .study-sidebar > small,
  .study-sidebar nav,
  .study-user {
    display: none;
  }
  .study-dashboard-main {
    padding: 10px 20px 25px;
  }
  .study-dashboard-main > header {
    display: none;
  }
  .study-dashboard-greeting {
    margin: 15px 0 25px;
  }
  .study-dashboard-greeting h1 {
    font-size: 37px;
  }
  .study-metrics {
    gap: 8px;
    grid-template-columns: 1fr 1fr;
  }
  .study-metrics > div:first-child {
    grid-column: 1/-1;
  }
  .study-metrics > div {
    padding: 18px;
  }
  .study-metrics > div:first-child strong {
    font-size: 33px;
  }
  .study-graph-panel {
    padding: 18px;
  }
  .study-activity small {
    display: none;
  }
  .activity-bars {
    width: 70px;
    margin-left: auto;
  }
  .study-editorial-header {
    height: 85px;
    padding-inline: 20px;
  }
  .study-editorial-header .study-logo {
    font-size: 29px;
  }
  .study-editorial-header nav {
    display: none;
  }
  .study-header-action {
    width: 34px;
    height: 34px;
  }
  .study-editorial-hero {
    grid-template-columns: 1fr;
    padding: 25px 22px;
    min-height: 760px;
    align-content: start;
  }
  .study-editorial-copy h1 {
    font-size: 53px;
    letter-spacing: -2px;
  }
  .study-editorial-copy > p {
    font-size: 7px;
    margin-bottom: 20px;
  }
  .study-editorial-copy > div {
    margin-top: 20px;
  }
  .study-editorial-copy > div > span {
    font-size: 11px;
  }
  .study-editorial-art {
    height: 330px;
    transform: scale(0.65);
    transform-origin: center top;
    margin-bottom: -80px;
  }
  .study-editorial-travel .study-editorial-hero {
    min-height: 710px;
    padding-top: 80px;
  }
  .study-editorial-travel .study-editorial-copy {
    padding: 0;
  }
  .study-editorial-travel .study-editorial-copy h1 {
    font-size: 58px;
    letter-spacing: -3px;
  }
  .study-editorial-travel .study-editorial-art {
    margin: 0;
    height: auto;
    transform: none;
    inset: -85px 0 0;
  }
  .study-editorial-travel .study-editorial-art img {
    object-position: 65%;
  }
  .study-editorial-bottom {
    padding: 22px;
    gap: 15px;
    font-size: 7px;
    line-height: 1.6;
  }
  .study-editorial-bottom > span:nth-child(3) {
    display: none;
  }
  .travel-coordinates {
    right: 22px;
    bottom: 25px;
    font-size: 6px;
  }
  .study-editorial-fitness .study-editorial-copy h1 {
    font-size: 62px;
    letter-spacing: -3px;
  }
  .study-editorial-fitness .study-editorial-art {
    height: 430px;
    margin-top: -20px;
    margin-bottom: -125px;
  }
  .study-editorial-creative .study-editorial-copy h1 {
    font-size: 58px;
    letter-spacing: -3px;
  }
  .study-editorial-creative .study-editorial-art {
    height: 430px;
    margin-top: 15px;
    margin-bottom: -125px;
  }
  .study-editorial-beauty .study-editorial-art {
    height: 430px;
    margin-top: 15px;
    margin-bottom: -125px;
  }
  .study-editorial-beauty .study-editorial-copy h1 {
    font-size: 52px;
  }
  .study-details {
    padding: 35px 22px;
    flex-direction: column;
    align-items: start;
    gap: 25px;
  }
  .study-details h2 {
    font-size: 20px;
  }
  .study-footer {
    padding: 20px 22px;
    font-size: 7px;
    line-height: 1.8;
    flex-wrap: wrap;
  }
}
``````

## app/studio.css

``````css
/* Elvora studio: original editorial layouts, scoped motion and privacy controls. */
.studio-section {
  margin-block: 132px;
}
.studio-heading {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 80px;
  align-items: end;
  margin: 17px 0 46px;
}
.studio-heading h2,
.workflow-intro h2,
.tool-copy h2,
.footer-invitation h2 {
  font-size: clamp(32px, 4.1vw, 58px);
  line-height: 1.12;
  letter-spacing: -2px;
  white-space: pre-line;
}
.studio-heading > p,
.workflow-intro > div > p:not(.eyebrow),
.tool-copy > p:not(.eyebrow) {
  color: var(--muted);
  line-height: 1.95;
  max-width: 520px;
}
.studio-note {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
}
.text-link {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  padding-block: 12px;
  font-size: 12px;
  border-bottom: 1px solid var(--line-bright);
}
.text-link:hover {
  color: var(--gold);
}
/* The brand sculpture is CSS, the logo is the owner's existing vector. */
.hero-emblem {
  width: 100%;
  height: 540px;
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-radius: 38% 38% 12px 12px;
  background: radial-gradient(ellipse at 50% 45%, color-mix(in srgb, var(--muted) 12.55%, transparent), transparent 66%);
  perspective: 1000px;
}
.emblem-grid {
  position: absolute;
  inset: 40% -40% -25%;
  transform: rotateX(65deg);
  background-image:
    linear-gradient(color-mix(in srgb, var(--text) 7.84%, transparent) 1px, transparent 1px),
    linear-gradient(90deg, color-mix(in srgb, var(--text) 7.84%, transparent) 1px, transparent 1px);
  background-size: 45px 45px;
  mask-image: radial-gradient(ellipse, var(--neutral-black), transparent 70%);
}
.emblem-object {
  position: absolute;
  top: 90px;
  left: calc(50% - 120px);
  width: 240px;
  height: 240px;
  border-radius: 58px;
  background: var(--bg);
  transform: rotateX(10deg) rotateY(-22deg) rotateZ(-9deg);
  box-shadow:
    14px 15px 0 var(--neutral-black),
    16px 17px 0 var(--neutral-black),
    25px 28px 55px color-mix(in srgb, var(--neutral-black) 60%, transparent),
    0 0 70px color-mix(in srgb, var(--neutral-black) 12.55%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent-text) 37.65%, transparent);
  overflow: hidden;
  animation: emblem-hover 9s ease-in-out infinite;
}
.emblem-object img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.emblem-shine {
  position: absolute;
  inset: -70% -100%;
  background: linear-gradient(
    110deg,
    transparent 42%,
    color-mix(in srgb, var(--text) 40%, transparent) 49%,
    color-mix(in srgb, var(--text) 6.67%, transparent) 53%,
    transparent 60%
  );
  transform: translateX(-40%);
  animation: emblem-shine 8s ease-in-out infinite;
}
.emblem-ring {
  position: absolute;
  width: 420px;
  height: 420px;
  border: 1px solid color-mix(in srgb, var(--accent-text) 16.08%, transparent);
  border-radius: 50%;
  top: 15px;
  left: calc(50% - 210px);
  pointer-events: none;
}
.emblem-ring-one {
  transform: rotateX(64deg) rotateY(-22deg);
  animation: emblem-ring 22s linear infinite;
  border-left-color: color-mix(in srgb, var(--accent-text) 46.67%, transparent);
}
.emblem-ring-two {
  transform: rotateY(65deg) rotateZ(-25deg);
  border-right-color: color-mix(in srgb, var(--accent-text) 46.67%, transparent);
}
.emblem-plinth {
  position: absolute;
  width: 310px;
  height: 110px;
  border: 1px solid color-mix(in srgb, var(--accent-text) 34.9%, transparent);
  border-radius: 50%;
  top: 350px;
  left: calc(50% - 155px);
  background: radial-gradient(
    ellipse,
    color-mix(in srgb, var(--muted) 9.8%, transparent),
    color-mix(in srgb, var(--muted) 3.53%, transparent) 45%,
    transparent 65%
  );
  box-shadow:
    0 9px 0 color-mix(in srgb, var(--neutral-black) 12.16%, transparent),
    0 16px 0 color-mix(in srgb, var(--neutral-black) 7.06%, transparent);
  transform: rotateX(40deg);
}
.emblem-label {
  position: absolute;
  bottom: 23px;
  left: 0;
  width: 100%;
  text-align: center;
  letter-spacing: 10px;
  font-family: var(--font-space), sans-serif;
  font-size: 27px;
}
.emblem-label small {
  display: block;
  color: var(--muted);
  font:
    10px var(--font-inter),
    sans-serif;
  letter-spacing: 1px;
  margin-top: 12px;
}
.emblem-coordinate {
  position: absolute;
  top: 35px;
  right: 20px;
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--muted);
}
.emblem-orbit-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
  position: absolute;
  left: 13%;
  top: 33%;
  box-shadow: 0 0 25px color-mix(in srgb, var(--neutral-black) 46.67%, transparent);
}
/* Services */
.studio-services {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
.studio-services > div {
  display: flex;
  min-width: 0;
}
.studio-service {
  position: relative;
  overflow: hidden;
  padding: 35px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: linear-gradient(140deg, var(--surface), var(--bg));
  min-height: 370px;
  display: flex;
  flex-direction: column;
  transition: transform 0.4s;
  isolation: isolate;
  width: 100%;
}
.studio-service:hover {
  border-color: var(--line-bright);
  transform: translateY(-5px);
  box-shadow: var(--shadow-luxe);
}
.service-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
  color: var(--gold);
}
.studio-index {
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--muted);
}
.studio-service h3 {
  font-size: clamp(22px, 2.1vw, 29px);
  line-height: 1.25;
  max-width: 330px;
  margin-bottom: 16px;
  letter-spacing: -0.7px;
}
.studio-service > p {
  color: var(--muted);
  line-height: 1.85;
  max-width: 455px;
}
.studio-service ul {
  padding: 0;
  margin: 24px 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}
.studio-service li {
  border: 1px solid var(--line);
  border-radius: 30px;
  padding: 6px 10px;
  font-size: 10px;
  color: var(--text);
  background: var(--soft);
}
.service-bottom {
  margin-top: auto;
  padding-top: 22px;
  border-top: 1px solid var(--line);
  display: flex;
  gap: 25px;
  align-items: center;
  justify-content: space-between;
}
.service-bottom small {
  color: var(--muted);
  font-size: 10px;
  line-height: 1.8;
  max-width: 340px;
}
.service-bottom a {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  border: 1px solid var(--line);
  border-radius: 50%;
  transition: none;
}
.service-bottom a:hover {
  color: var(--text);
  background: var(--accent);
}
.service-orbit {
  position: absolute;
  width: 240px;
  height: 240px;
  border: 1px solid var(--line);
  border-radius: 50%;
  top: -140px;
  right: -110px;
  z-index: -1;
  box-shadow:
    0 0 0 30px var(--soft),
    0 0 0 60px var(--soft);
  transition: transform 0.7s;
}
.studio-service:hover .service-orbit {
  transform: translate(-15px, 15px);
}
.service-chat {
  background:
    radial-gradient(ellipse at top right, color-mix(in srgb, var(--muted) 4.71%, transparent), transparent 60%),
    var(--surface);
}
/* Scroll-driven workflow, sticky only where there is room. */
.workflow-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 120px;
  align-items: start;
}
.workflow-intro {
  position: sticky;
  top: 125px;
}
.workflow-intro h2 {
  margin-block: 18px 24px;
}
.workflow-intro small {
  color: var(--muted);
  font-size: 10px;
}
.workflow-art {
  width: 270px;
  height: 240px;
  position: relative;
  display: grid;
  place-items: center;
  margin-top: 22px;
  overflow: hidden;
}
.workflow-art-ring {
  width: 185px;
  height: 185px;
  position: absolute;
  top: 20px;
  left: 40px;
  border: 1px solid var(--line-bright);
  border-radius: 50%;
  transform: rotateX(55deg) rotateZ(-25deg);
}
.workflow-art-ring:nth-child(2) {
  transform: rotateY(58deg) rotateZ(40deg);
  border-color: color-mix(in srgb, var(--accent-text) 30.2%, transparent);
}
.workflow-art-core {
  display: grid;
  place-items: center;
  width: 82px;
  height: 82px;
  border: 1px solid var(--line-bright);
  border-radius: 23px;
  color: var(--gold);
  transform: rotate(-12deg);
  background: var(--raised);
  box-shadow: 0 15px 35px color-mix(in srgb, var(--neutral-black) 13.33%, transparent);
  animation: workflow-float 7s ease-in-out infinite;
}
.workflow-art i {
  position: absolute;
  font-size: 8px;
  letter-spacing: 2px;
  font-style: normal;
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 7px 9px;
  border-radius: 20px;
  color: var(--muted);
}
.workflow-art i:nth-last-child(3) {
  left: 4px;
  top: 50px;
}
.workflow-art i:nth-last-child(2) {
  right: 0;
  top: 70px;
}
.workflow-art i:last-child {
  bottom: 24px;
  left: 90px;
}
.workflow-steps {
  padding-left: 35px;
  border-left: 1px solid var(--line-bright);
}
.workflow-step {
  position: relative;
  padding: 5px 0 42px;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--line);
}
.workflow-step:last-child {
  margin-bottom: 0;
}
.workflow-node {
  position: absolute;
  top: 12px;
  left: -40px;
  height: 9px;
  width: 9px;
  border: 2px solid var(--bg);
  background: var(--gold);
  box-shadow:
    0 0 0 1px var(--line-bright),
    0 0 25px color-mix(in srgb, var(--neutral-black) 20%, transparent);
  border-radius: 50%;
}
.workflow-step-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--gold);
  margin-bottom: 28px;
}
.workflow-step-label > span {
  font:
    28px var(--font-space),
    sans-serif;
}
.workflow-step h3 {
  font-size: 25px;
  letter-spacing: -0.6px;
  margin-bottom: 15px;
}
.workflow-step p {
  color: var(--muted);
  line-height: 1.95;
}
.workflow-step small {
  margin-top: 25px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--gold);
  font-size: 10px;
}
/* Journey */
.journey-section {
  padding-top: 30px;
}
.journey-section .studio-heading {
  align-items: start;
}
.journey-section h2 {
  font-size: clamp(31px, 3.5vw, 48px);
}
.journey-chapters {
  border-top: 1px solid var(--line);
}
.journey-chapter {
  display: grid;
  grid-template-columns: 150px 1fr 32px;
  gap: 55px;
  padding: 40px 10px;
  border-bottom: 1px solid var(--line);
  align-items: start;
  transition: none;
}
.journey-chapter:hover {
  background: var(--soft);
}
.journey-chapter-number {
  font:
    54px var(--font-space),
    sans-serif;
  color: var(--muted);
  letter-spacing: -3px;
  position: relative;
}
.journey-chapter-number span {
  display: block;
  width: 65px;
  height: 1px;
  background: linear-gradient(90deg, var(--muted), transparent);
  margin-top: 22px;
}
.journey-chapter h3 {
  font-size: 27px;
  margin: 10px 0 16px;
  letter-spacing: -0.7px;
}
.journey-chapter p:not(.eyebrow) {
  color: var(--muted);
  line-height: 1.9;
  max-width: 740px;
}
.journey-chapter > svg {
  color: var(--gold);
  margin-top: 12px;
  transition: transform 0.4s;
}
.journey-chapter:hover > svg {
  transform: translate(4px, -4px);
}
.journey-signature {
  display: flex;
  justify-content: flex-end;
  gap: 30px;
  align-items: center;
  font:
    italic 25px Georgia,
    serif;
  color: var(--gold);
  margin-top: 35px;
}
.journey-signature span {
  font:
    35px var(--font-space),
    sans-serif;
}
/* AI toolkit editorial board */
.tool-board {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid var(--line-bright);
  border-radius: 24px;
  background:
    radial-gradient(ellipse at 90% 40%, color-mix(in srgb, var(--muted) 7.06%, transparent), transparent 65%),
    var(--surface);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 45px;
  padding: 55px 45px;
}
.tool-copy {
  position: relative;
  z-index: 1;
}
.tool-copy h2 {
  font-size: clamp(30px, 3vw, 43px);
  margin: 20px 0;
}
.tool-handwriting {
  display: block;
  color: var(--gold);
  font:
    italic 21px Georgia,
    serif;
  margin-top: 40px;
  transform: rotate(-4deg);
}
.tool-board-grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: -1;
  opacity: 0.3;
  background-image:
    linear-gradient(var(--line) 1px, transparent 1px),
    linear-gradient(90deg, var(--line) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(90deg, transparent 10%, var(--neutral-black));
}
.tool-tiles {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  align-content: center;
  padding: 15px 0;
}
.tool-tile {
  padding: 20px 12px;
  text-align: center;
  border: 1px solid color-mix(in srgb, var(--text) 12.55%, transparent);
  border-radius: 17px;
  background: linear-gradient(145deg, var(--surface), var(--bg));
  color: var(--text);
  box-shadow: 0 10px 30px color-mix(in srgb, var(--neutral-black) 20%, transparent);
  transition: transform 0.45s;
}
.tool-tile-0,
.tool-tile-4 {
  transform: rotate(-6deg);
}
.tool-tile-2,
.tool-tile-3 {
  transform: rotate(5deg) translateY(-10px);
}
.tool-tile:hover {
  transform: rotate(0) translateY(-8px);
  border-color: color-mix(in srgb, var(--accent-text) 46.67%, transparent);
}
.tool-mark {
  display: grid;
  place-items: center;
  height: 50px;
  font:
    24px var(--font-space),
    sans-serif;
  letter-spacing: -1px;
}
.tool-tile-0 .tool-mark,
.tool-tile-2 .tool-mark {
  font-size: 39px;
}
.tool-tile strong {
  display: block;
  font-size: 11px;
  font-weight: 500;
  margin-top: 10px;
}
.tool-tile small {
  display: block;
  font-size: 9px;
  line-height: 1.6;
  color: var(--muted);
  margin-top: 7px;
}
.tool-section .studio-note {
  margin-top: 20px;
  max-width: 800px;
}
.skills-note {
  max-width: 900px;
}
/* A deliberately separate contact sheet below Selected Work. */
.bunch-section {
  overflow: clip;
  padding-block: 30px;
}
.bunch-window {
  overflow: clip;
  padding: 30px 0 55px;
  background: radial-gradient(ellipse at center, color-mix(in srgb, var(--muted) 5.1%, transparent), transparent 65%);
}
.bunch-grid {
  width: min(1660px, calc(100% + 100px));
  margin-left: max(calc((100% - 1660px) / 2), -50px);
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 23px;
  align-items: center;
}
.bunch-piece {
  min-width: 0;
  border: 1px solid var(--line-bright);
  border-radius: 10px;
  overflow: hidden;
  background: var(--surface);
  box-shadow: 0 20px 45px color-mix(in srgb, var(--neutral-black) 20%, transparent);
  transition: transform 0.5s;
  transform: rotate(-4deg);
}
.bunch-piece:nth-child(2n) {
  transform: rotate(4deg) translateY(20px);
}
.bunch-piece:nth-child(3n) {
  transform: rotate(-3deg) translateY(-15px);
}
.bunch-piece:hover,
.bunch-piece:focus-visible {
  transform: rotate(0) translateY(-6px);
  box-shadow: 0 25px 50px color-mix(in srgb, var(--neutral-black) 33.33%, transparent);
  z-index: 2;
}
.bunch-browser {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 10px;
  border-bottom: 1px solid var(--line);
}
.bunch-browser i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--muted);
  opacity: 0.65;
}
.bunch-browser span {
  font-size: 7px;
  color: var(--muted);
  margin-inline: auto;
  padding-right: 15px;
}
.bunch-image {
  position: relative;
  aspect-ratio: 1.6;
  overflow: hidden;
}
.bunch-image img {
  object-fit: cover;
}
.bunch-caption {
  padding: 13px;
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  align-items: center;
}
.bunch-caption > span {
  font-size: 11px;
}
.bunch-caption small {
  font-size: 8px;
  color: var(--muted);
}
.bunch-caption svg {
  margin-left: auto;
  color: var(--gold);
}
.bunch-after {
  display: flex;
  gap: 35px;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
.bunch-after p {
  max-width: 750px;
}
.bunch-after a {
  flex-shrink: 0;
}
/* One testimonial at a time; all unsupplied reviews remain clearly labeled. */
/* Social links, ending and colophon */
.social-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.social-links a {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  min-height: 40px;
  font-size: 12px;
  color: var(--muted);
}
.social-links a:hover {
  color: var(--gold);
}
.email-card .social-links {
  margin-top: 28px;
}
.email-card .social-links a {
  font-size: 12px;
  margin: 0;
  gap: 9px;
}
.email-card .social-links svg {
  width: 17px;
}
.studio-footer {
  margin-top: 120px;
  padding-top: 80px;
  border-top: 1px solid var(--line-bright);
  position: relative;
  overflow: hidden;
  background:
    radial-gradient(ellipse at bottom, color-mix(in srgb, var(--muted) 6.27%, transparent), transparent 65%), var(--bg);
}
.footer-invitation {
  display: grid;
  grid-template-columns: 1.3fr 1fr;
  gap: 40px 80px;
  align-items: end;
  padding-bottom: 75px;
  border-bottom: 1px solid var(--line);
}
.footer-invitation > .eyebrow {
  grid-column: 1/-1;
}
.footer-invitation h2 {
  font-size: clamp(38px, 5.3vw, 76px);
  letter-spacing: -3px;
}
.footer-invitation > div > p {
  color: var(--muted);
  line-height: 1.9;
  margin-bottom: 25px;
  max-width: 360px;
}
.footer-invitation .button {
  font-size: 12px;
}
.footer-directory {
  display: grid;
  grid-template-columns: 1.8fr 1fr 1fr 1fr;
  gap: 30px;
  padding-block: 55px;
}
.footer-directory h3 {
  font:
    10px var(--font-inter),
    sans-serif;
  font-weight: 500;
  letter-spacing: 1px;
  margin-bottom: 20px;
  color: var(--text);
}
.footer-directory nav {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 13px;
}
.footer-directory nav h3 {
  margin-bottom: 5px;
}
.footer-directory nav > a,
.cookie-settings-link {
  font-size: 11px;
  color: var(--muted);
}
.cookie-settings-link {
  background: none;
  padding: 0;
  text-align: left;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.cookie-settings-link:hover,
.footer-directory nav a:hover {
  color: var(--gold);
}
.footer-identity p {
  color: var(--muted);
  font-size: 11px;
  margin-top: 18px;
  line-height: 1.9;
}
.footer-email {
  display: inline-block;
  font-size: 12px;
  margin-top: 14px;
  overflow-wrap: anywhere;
}
.footer-directory .social-links {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: -10px;
}
.footer-directory .social-links a {
  font-size: 11px;
}
.footer-directory .social-links svg {
  width: 15px;
}
.footer-colophon {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 15px;
  padding-block: 25px;
  border-top: 1px solid var(--line);
  font-size: 10px;
  color: var(--muted);
  line-height: 1.7;
}
.footer-art {
  position: relative;
  overflow: hidden;
  height: clamp(130px, 22vw, 285px);
  margin-top: 20px;
  isolation: isolate;
}
.footer-art > span {
  display: block;
  text-transform: uppercase;
  font:
    600 clamp(75px, 19.3vw, 265px) / 1 var(--font-space),
    sans-serif;
  text-align: center;
  letter-spacing: -0.075em;
  padding-right: 0.075em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in srgb, var(--gold) 50%, var(--bg));
  background: linear-gradient(
    110deg,
    transparent 35%,
    color-mix(in srgb, var(--muted) 25.1%, transparent) 47%,
    var(--muted) 50%,
    color-mix(in srgb, var(--muted) 25.1%, transparent) 54%,
    transparent 66%
  );
  -webkit-background-clip: text;
  background-clip: text;
  background-size: 300% 100%;
  animation: footer-light 12s ease-in-out infinite;
}
.footer-art i {
  position: absolute;
  width: 60%;
  height: 100px;
  background: color-mix(in srgb, var(--accent-text) 7.06%, transparent);
  filter: blur(40px);
  bottom: -60px;
  left: 20%;
  z-index: -1;
}
/* Equal-weight consent actions. No optional provider is loaded before permission. */
.consent-banner {
  position: fixed;
  z-index: 85;
  bottom: 18px;
  left: 18px;
  right: 18px;
  max-width: 1320px;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 22px;
  padding: 22px;
  border: 1px solid var(--line-bright);
  border-radius: 18px;
  background: var(--surface);
  box-shadow: 0 10px 65px color-mix(in srgb, var(--neutral-black) 40%, transparent);
}
.consent-symbol {
  width: 45px;
  height: 45px;
  display: grid;
  place-items: center;
  border: 1px solid var(--line-bright);
  color: var(--gold);
  border-radius: 13px;
  flex-shrink: 0;
}
.consent-copy {
  flex: 1;
  min-width: 0;
}
.consent-copy h2 {
  font-size: 17px;
  letter-spacing: -0.3px;
  margin-bottom: 8px;
}
.consent-copy p {
  color: var(--muted);
  font-size: 11px;
  line-height: 1.8;
}
.consent-copy a {
  text-decoration: underline;
  text-underline-offset: 3px;
  color: var(--text);
}
.consent-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.consent-actions button {
  border: 1px solid var(--line-bright);
  background: var(--raised);
  color: var(--text);
  padding: 12px 14px;
  min-height: 44px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  transition: none;
}
.consent-actions button:hover {
  border-color: var(--gold);
  background: var(--surface);
}
.consent-banner .consent-actions {
  flex-shrink: 0;
}
.privacy-dialog {
  width: min(640px, calc(100% - 28px));
  max-height: calc(100dvh - 36px);
  padding: 30px;
  border: 1px solid var(--line-bright);
  border-radius: 20px;
  color: var(--text);
  background: var(--surface);
  box-shadow: 0 30px 100px color-mix(in srgb, var(--neutral-black) 53.33%, transparent);
  overflow-y: auto;
}
.privacy-dialog::backdrop {
  background: color-mix(in srgb, var(--neutral-black) 73.33%, transparent);
  backdrop-filter: blur(7px);
}
.privacy-dialog-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--gold);
  margin-bottom: 15px;
}
.privacy-dialog h2 {
  font-size: 28px;
  letter-spacing: -1px;
}
.privacy-dialog > p {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.9;
  margin-top: 15px;
}
.privacy-option {
  display: flex;
  gap: 25px;
  justify-content: space-between;
  align-items: center;
  padding: 23px 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
}
.privacy-option strong {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
}
.privacy-option small {
  display: block;
  color: var(--muted);
  font-size: 11px;
  line-height: 1.85;
}
.privacy-option input {
  width: 22px;
  height: 22px;
  accent-color: var(--gold);
  flex-shrink: 0;
}
.privacy-dialog .privacy-withdrawal {
  font-size: 10px;
  margin-bottom: 20px;
}
.privacy-links {
  display: flex;
  gap: 20px;
  margin-top: 25px;
  font-size: 11px;
  text-decoration: underline;
  text-underline-offset: 3px;
  color: var(--muted);
}
.embed-consent-gate {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22px;
  padding: 55px 25px;
  margin: auto;
}
.embed-consent-gate > svg {
  color: var(--gold);
}
.embed-consent-gate h3 {
  font-size: 27px;
  letter-spacing: -0.6px;
}
.embed-consent-gate p {
  max-width: 350px;
  font-size: 12px;
  line-height: 1.85;
  color: var(--muted);
}
.embed-consent-gate > a {
  font-size: 11px;
  color: var(--muted);
  text-decoration: underline;
}
/* Readable legal pages, using actual site features rather than generic promises. */
.legal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: 30px;
  border-bottom: 1px solid var(--line);
  gap: 20px;
}
.legal-main {
  max-width: 960px;
  padding-top: 80px;
}
.legal-main h1 {
  font-size: clamp(40px, 6vw, 70px);
  margin-block: 20px 28px;
}
.legal-intro {
  color: var(--muted);
  font-size: 18px;
  line-height: 1.85;
  max-width: 800px;
}
.legal-tabs {
  display: flex;
  gap: 22px;
  flex-wrap: wrap;
  align-items: center;
  padding-block: 25px;
  margin-top: 20px;
  border-bottom: 1px solid var(--line);
}
.legal-tabs a {
  font-size: 12px;
  color: var(--muted);
  padding-block: 9px;
}
.legal-tabs a[aria-current="page"] {
  color: var(--gold);
  border-bottom: 1px solid var(--gold);
}
.legal-section {
  display: grid;
  grid-template-columns: 35px 1fr;
  gap: 25px;
  padding-block: 35px;
  border-bottom: 1px solid var(--line);
}
.legal-section > span {
  color: var(--gold);
  font-size: 11px;
  padding-top: 6px;
}
.legal-section h2 {
  font-size: 23px;
  margin-bottom: 18px;
}
.legal-section p {
  color: var(--muted);
  line-height: 2;
  font-size: 14px;
}
.legal-contact {
  padding-top: 35px;
}
.legal-contact p {
  margin-bottom: 15px;
}
.legal-contact a {
  color: var(--gold);
  overflow-wrap: anywhere;
}
@keyframes emblem-hover {
  0%,
  100% {
    transform: rotateX(10deg) rotateY(-22deg) rotateZ(-9deg) translateY(0);
  }
  50% {
    transform: rotateX(6deg) rotateY(-12deg) rotateZ(-5deg) translateY(-10px);
  }
}
@keyframes emblem-shine {
  0%,
  22% {
    transform: translateX(-40%);
  }
  55%,
  100% {
    transform: translateX(40%);
  }
}
@keyframes emblem-ring {
  to {
    transform: rotateX(64deg) rotateY(-22deg) rotateZ(360deg);
  }
}
@keyframes workflow-float {
  0%,
  100% {
    transform: rotate(-12deg) translateY(0);
  }
  50% {
    transform: rotate(-5deg) translateY(-7px);
  }
}
@keyframes footer-light {
  0%,
  100% {
    background-position: 100% 50%;
  }
  60% {
    background-position: 0 50%;
  }
}
@media (max-width: 1200px) {
  .desktop-nav {
    gap: 16px;
  }
  .desktop-nav a {
    font-size: 11px;
  }
  .nav-row {
    gap: 20px;
  }
  .consent-banner {
    flex-wrap: wrap;
  }
  .consent-banner .consent-actions {
    margin-left: 67px;
  }
  .workflow-section {
    gap: 65px;
  }
  .tool-board {
    padding: 40px 30px;
    gap: 25px;
  }
  .tool-tiles {
    gap: 10px;
  }
}
@media (max-width: 1000px) {
  .studio-heading {
    gap: 40px;
  }
  .studio-section {
    margin-block: 100px;
  }
  .tool-board {
    grid-template-columns: 1fr;
  }
  .tool-copy {
    max-width: 650px;
  }
  .tool-tiles {
    max-width: 700px;
    gap: 20px;
  }
  .tool-handwriting {
    margin-top: 20px;
  }
  .tool-tile {
    padding: 20px;
  }
  .footer-directory {
    grid-template-columns: 1.5fr 1fr 1fr;
  }
  .footer-identity {
    grid-column: 1/-1;
  }
  .footer-invitation {
    gap: 30px;
  }
  .footer-invitation h2 {
    font-size: 50px;
  }
  .bunch-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .bunch-piece:nth-child(n + 7) {
    transform: rotate(2deg);
  }
}
@media (max-width: 700px) {
  .studio-section {
    margin-block: 80px;
  }
  .studio-heading {
    grid-template-columns: 1fr;
    gap: 22px;
    margin-bottom: 30px;
  }
  .studio-heading h2,
  .workflow-intro h2 {
    font-size: clamp(30px, 8vw, 44px);
    letter-spacing: -1.4px;
  }
  .studio-heading > p {
    font-size: 13px;
  }
  .hero-emblem {
    height: 450px;
  }
  .emblem-object {
    top: 70px;
    width: 210px;
    height: 210px;
    left: calc(50% - 105px);
    border-radius: 50px;
  }
  .emblem-ring {
    width: 340px;
    height: 340px;
    left: calc(50% - 170px);
  }
  .emblem-plinth {
    top: 300px;
    width: 250px;
    left: calc(50% - 125px);
  }
  .emblem-label {
    bottom: 5px;
  }
  .emblem-coordinate {
    top: 5px;
    right: 5px;
  }
  .studio-services {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .studio-service {
    padding: 27px;
    min-height: 360px;
  }
  .service-top {
    margin-bottom: 26px;
  }
  .workflow-section {
    grid-template-columns: 1fr;
    gap: 40px;
  }
  .workflow-intro {
    position: static;
  }
  .workflow-art {
    display: none;
  }
  .workflow-intro small {
    display: block;
    margin-top: 20px;
  }
  .workflow-steps {
    padding-left: 26px;
    margin-left: 5px;
  }
  .workflow-node {
    left: -31px;
  }
  .workflow-step {
    margin-bottom: 30px;
    padding-bottom: 30px;
  }
  .workflow-step h3 {
    font-size: 23px;
  }
  .journey-chapter {
    grid-template-columns: 43px 1fr;
    gap: 20px;
    padding-block: 30px;
  }
  .journey-chapter > svg {
    display: none;
  }
  .journey-chapter-number {
    font-size: 31px;
    letter-spacing: -2px;
  }
  .journey-chapter-number span {
    width: 30px;
  }
  .journey-chapter h3 {
    font-size: 23px;
  }
  .journey-chapter p:not(.eyebrow) {
    font-size: 13px;
  }
  .journey-chapter .eyebrow {
    font-size: 8px;
    letter-spacing: 1px;
  }
  .journey-signature {
    font-size: 20px;
  }
  .tool-board {
    padding: 30px 22px;
    border-radius: 17px;
  }
  .tool-copy h2 {
    font-size: 32px;
  }
  .tool-copy > .eyebrow {
    font-size: 8px;
    letter-spacing: 1.4px;
  }
  .tool-tiles {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 17px;
  }
  .tool-tile {
    padding: 15px 8px;
  }
  .tool-tile-2 {
    transform: rotate(2deg);
  }
  .bunch-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 15px;
    width: calc(100% + 55px);
    margin-left: -27px;
  }
  .bunch-piece:nth-child(n) {
    transform: rotate(-3deg);
  }
  .bunch-piece:nth-child(2n) {
    transform: rotate(3deg) translateY(20px);
  }
  .bunch-browser {
    padding: 7px;
  }
  .bunch-browser span {
    font-size: 6px;
  }
  .bunch-caption {
    padding: 10px;
  }
  .bunch-caption small {
    display: none;
  }
  .bunch-caption > span {
    font-size: 10px;
  }
  .bunch-after {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .studio-footer {
    margin-top: 85px;
    padding-top: 55px;
  }
  .footer-invitation {
    grid-template-columns: 1fr;
    gap: 25px;
    padding-bottom: 45px;
  }
  .footer-invitation h2 {
    font-size: clamp(39px, 9.6vw, 62px);
    letter-spacing: -2px;
  }
  .footer-directory {
    grid-template-columns: 1fr 1fr;
    gap: 35px 20px;
    padding-block: 40px;
  }
  .footer-directory > nav:last-child {
    grid-column: 1/-1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 17px;
  }
  .footer-directory > nav:last-child h3 {
    grid-column: 1/-1;
    margin: 0;
  }
  .footer-colophon {
    flex-direction: column;
    gap: 10px;
    font-size: 9px;
  }
  .footer-art {
    height: 26vw;
  }
  .footer-art > span {
    font-size: 20vw;
  }
  .consent-banner {
    left: 10px;
    right: 10px;
    bottom: 10px;
    padding: 18px;
    gap: 13px;
    max-height: calc(100dvh - 20px);
    overflow-y: auto;
    border-radius: 13px;
  }
  .consent-symbol {
    display: none;
  }
  .consent-copy {
    flex-basis: 100%;
  }
  .consent-copy h2 {
    font-size: 16px;
  }
  .consent-copy p {
    font-size: 10px;
  }
  .consent-banner .consent-actions {
    margin-left: 0;
    flex-shrink: 1;
    width: 100%;
  }
  .consent-actions button {
    font-size: 10px;
    padding: 11px 9px;
  }
  .consent-banner .consent-actions button {
    flex: 1;
  }
  .privacy-dialog {
    padding: 22px;
  }
  .privacy-dialog h2 {
    font-size: 25px;
  }
  .privacy-option {
    gap: 15px;
  }
  .privacy-option small {
    font-size: 10px;
  }
  .legal-header {
    padding-block: 20px;
  }
  .legal-header .wordmark {
    font-size: 23px;
  }
  .legal-header .brand-symbol {
    width: 34px;
    height: 34px;
  }
  .legal-header .text-link {
    font-size: 10px;
    gap: 7px;
  }
  .legal-main {
    padding-top: 50px;
  }
  .legal-intro {
    font-size: 15px;
  }
  .legal-tabs {
    gap: 10px 18px;
  }
  .legal-section {
    gap: 13px;
    grid-template-columns: 25px 1fr;
  }
  .legal-section h2 {
    font-size: 21px;
  }
  .legal-section p {
    font-size: 13px;
  }
}
@media (prefers-reduced-motion: reduce) {
  html:not([data-motion="full"]) .emblem-object,
  html:not([data-motion="full"]) .emblem-shine,
  html:not([data-motion="full"]) .emblem-ring,
  html:not([data-motion="full"]) .workflow-art-core,
  html:not([data-motion="full"]) .footer-art > span {
    animation: none;
  }
  html:not([data-motion="full"]) .emblem-shine {
    display: none;
  }
  html:not([data-motion="full"]) .footer-art > span {
    background-position: 45% 50%;
  }
  html:not([data-motion="full"]) .bunch-piece,
  html:not([data-motion="full"]) .studio-service,
  html:not([data-motion="full"]) .service-orbit,
  html:not([data-motion="full"]) .journey-chapter > svg,
  html:not([data-motion="full"]) .tool-tile {
    transition: none;
  }
  html:not([data-motion="full"]) .bunch-piece:nth-child(n),
  html:not([data-motion="full"]) .bunch-piece:hover,
  html:not([data-motion="full"]) .bunch-piece:focus-visible,
  html:not([data-motion="full"]) .tool-tile:nth-child(n),
  html:not([data-motion="full"]) .tool-tile:hover {
    transform: none;
  }
  html:not([data-motion="full"]) .studio-service:hover,
  html:not([data-motion="full"]) .journey-chapter:hover > svg {
    transform: none;
  }
}
html[data-motion="reduced"] .studio-service:hover,
html[data-motion="reduced"] .journey-chapter:hover > svg {
  transform: none;
}
html[data-motion="reduced"] .bunch-piece:nth-child(n),
html[data-motion="reduced"] .bunch-piece:hover,
html[data-motion="reduced"] .bunch-piece:focus-visible,
html[data-motion="reduced"] .tool-tile:nth-child(n),
html[data-motion="reduced"] .tool-tile:hover {
  transform: none;
}
html[data-motion="reduced"] .bunch-piece,
html[data-motion="reduced"] .studio-service,
html[data-motion="reduced"] .service-orbit,
html[data-motion="reduced"] .journey-chapter > svg,
html[data-motion="reduced"] .tool-tile {
  transition: none;
}
html[data-motion="reduced"] .footer-art > span {
  background-position: 45% 50%;
}
html[data-motion="reduced"] .emblem-shine {
  display: none;
}
html[data-motion="reduced"] .emblem-object,
html[data-motion="reduced"] .emblem-shine,
html[data-motion="reduced"] .emblem-ring,
html[data-motion="reduced"] .workflow-art-core,
html[data-motion="reduced"] .footer-art > span {
  animation: none;
}

.contact-privacy a {
  color: var(--text);
  text-decoration: underline;
  text-underline-offset: 3px;
}
``````

## app/technical-domains/page.tsx

``````tsx
import { redirect } from "next/navigation";
export default function Page() {
  redirect("/websites#fundamentals");
}
``````

## app/terms/page.tsx

``````tsx
import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
export const metadata: Metadata = {
  title: "Terms of Service — Elvora",
  alternates: { canonical: "/terms" },
};
export default function Page() {
  return <LegalPage page="terms" />;
}
``````

## app/testimonials/page.tsx

``````tsx
import { Testimonials } from "@/components/testimonials";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getTestimonials } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("testimonials");

export default async function Page() {
  const testimonials = await getTestimonials();
  return (
    <SiteShell page="testimonials">
      <Testimonials testimonials={testimonials} />
    </SiteShell>
  );
}
``````

## app/theme-tokens.css

``````css
/* Generated by scripts/generate-theme-assets.mjs. Edit data/theme-tokens.json. */
:root {
  --neutral-black: #000000;
  --neutral-white: #FFFFFF;
  --neutral-ink: #111111;
  --neutral-charcoal: #222222;
  --neutral-slate: #444444;
  --neutral-gray: #888888;
  --neutral-silver: #BBBBBB;
  --neutral-paper: #F5F5F5;
  --inverse-bg: #0A0A0F;
  --inverse-surface: #14141C;
  --inverse-text: #F5F3FF;
  --inverse-muted: #A09CB5;
  --inverse-border: #262633;
  --inverse-accent: #A78BFA;
  --light-background: #FAFAFC;
  --light-surface: #FFFFFF;
  --light-text: #0A0A0F;
  --light-muted: #6B6880;
  --light-border: #E6E4EE;
  --light-accent: #7C3AED;
  --light-accent-hover: #6D28D9;
}
:root, [data-theme="light"] {
  color-scheme: light;
  --bg: #FAFAFC;
  --surface: #FFFFFF;
  --line: #E6E4EE;
  --text: #0A0A0F;
  --muted: #6B6880;
  --accent: #7C3AED;
  --accent-hover: #6D28D9;
  --accent-soft: rgba(124,58,237,0.08);
  --accent-text: #7C3AED;
  --on-accent: #FFFFFF;
  --raised: color-mix(in srgb, #FFFFFF 94%, #0A0A0F);
  --glass: color-mix(in srgb, #FAFAFC 92%, transparent);
  --soft: color-mix(in srgb, #0A0A0F 3%, transparent);
  --line-bright: color-mix(in srgb, #6B6880 52%, #E6E4EE);
}
[data-theme="dark"] {
  color-scheme: dark;
  --bg: #0A0A0F;
  --surface: #14141C;
  --line: #262633;
  --text: #F5F3FF;
  --muted: #A09CB5;
  --accent: #8B5CF6;
  --accent-hover: #A78BFA;
  --accent-soft: rgba(139,92,246,0.12);
  --accent-text: #A78BFA;
  --on-accent: #0A0A0F;
  --raised: color-mix(in srgb, #14141C 94%, #F5F3FF);
  --glass: color-mix(in srgb, #0A0A0F 92%, transparent);
  --soft: color-mix(in srgb, #F5F3FF 3%, transparent);
  --line-bright: color-mix(in srgb, #A09CB5 52%, #262633);
}
/* Legacy names are aliases, never a second palette. Scope-dependent aliases also
   resolve correctly inside the existing dark footer and testimonial cards. */
:root, [data-theme], .footer-signoff, .testimonial-card {
  --gold: var(--accent-text);
  --ref-card: var(--surface);
  --ref-soft: var(--raised);
  --ref-shadow: 0 18px 34px color-mix(in srgb, var(--neutral-black) 8%, transparent);
  --shadow-luxe: 0 22px 65px color-mix(in srgb, var(--neutral-black) 8%, transparent);
  --contact-error: var(--text);
  --contact-success: var(--text);
}
``````

## app/websites/page.tsx

``````tsx
import { TechnicalDomains } from "@/components/experience";
import { Workflow } from "@/components/studio-sections";
import { Work } from "@/components/work";
import { SiteShell } from "@/components/site-shell";
import { pageMetadata } from "@/lib/page-metadata";
import { getProjects } from "@/lib/content-loader";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("websites");

export default async function Page() {
  const projects = await getProjects();
  return (
    <SiteShell page="websites">
      <Work projects={projects} />
      <Workflow />
      <TechnicalDomains />
    </SiteShell>
  );
}
``````

## app/work/[slug]/page.tsx

``````tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getProjects, getIdentity } from "@/lib/content-loader";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getProjects()).find((item) => item.id === slug);
  return project
    ? {
        title: `${project.title} — Project notes | Elvora`,
        description: project.description,
        alternates: { canonical: `/work/${slug}` },
      }
    : { title: "Project not found", robots: { index: false, follow: false } };
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const [projects, identity] = await Promise.all([
    getProjects(),
    getIdentity(),
  ]);
  const project = projects.find((item) => item.id === slug);
  if (!project) notFound();
  return (
    <>
      <Navbar identity={identity} rootLinks />
      <main id="main-content" className="container agency-detail">
        <Link href="/websites" className="eyebrow">
          ELVORA / SELECTED WORK
        </Link>
        <header className="agency-detail-hero">
          <p className="eyebrow">PROJECT NOTES / {project.industry}</p>
          <h1>{project.title}</h1>
          <p>{project.description}</p>
          {project.demoUrl && (
            <Link href={project.demoUrl} className="button button-gold">
              Explore the website
            </Link>
          )}
        </header>
        <div className="agency-case-hero">
          <Image
            src={project.screenshots[0].src}
            alt={project.screenshots[0].alt}
            fill
            priority
            sizes="(max-width: 800px) 94vw,1200px"
          />
        </div>
        <div className="agency-detail-grid">
          <section>
            <p className="eyebrow">THE DIRECTION</p>
            <h2>{project.subtitle}</h2>
            <p>{project.description}</p>
            <ul>
              {project.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section>
            <p className="eyebrow">THE IMPLEMENTATION</p>
            <h2>From design to interface.</h2>
            <p>
              Explore the implemented page, its responsive layouts and
              interaction details. Screenshots below are captures of the actual
              interface.
            </p>
            <ul>
              {project.stack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
        </div>
        <p className="agency-detail-note">
          Concept portfolio work demonstrates design and implementation.
          Fictional brands, sample products and interface data do not represent
          commissioned client work or verified business results.
        </p>
        <div className="agency-case-images">
          {project.screenshots.slice(1).map((image) => (
            <figure key={image.src}>
              <div
                className={`agency-case-shot${image.title.toLowerCase().includes("mobile") ? " is-mobile" : ""}`}
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width:800px) 94vw,580px"
                />
              </div>
              <figcaption>{image.title}</figcaption>
            </figure>
          ))}
        </div>
        <section className="agency-related">
          <h2>Keep exploring.</h2>
          {projects
            .filter((item) => item.id !== slug)
            .map((item) => (
              <Link href={`/work/${item.id}`} key={item.id}>
                {item.title}
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
        </section>
      </main>
      <Footer brand={identity.brand} email={identity.email} />
    </>
  );
}
``````
