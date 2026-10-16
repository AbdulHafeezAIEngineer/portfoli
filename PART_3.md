# Elvora personalization

Brand: **Elvora**. Owner: **Abdul Hafeez**. Public contact: **abdulhafeez@elvoraai.online** only. No phone or WhatsApp links. Owner-supplied GitHub and Instagram profiles are included.

The About Me section now summarizes the owner's supplied Python/AI exploration, agency work, independent development and startup aspirations. It explains structured prompts, review, testing, refinement and the frontend/backend/database/deployment fundamentals. The latest design avoids experience/project/success metric cards. AI tools are included as a toolkit without proficiency percentages. Genuine testimonials and approved client portraits are pending and remain explicitly labeled previews.

The supplied E-and-amber-dot logo is represented as a scalable SVG in `public/elvora-logo.svg` and the favicon in `app/icon.svg`. The navbar and footer pair it with the **Elvora** wordmark. The portrait caption also uses the brand instead of AH.

The supplied Coursiv certificate is now showcased: **Master of ChatGPT**, issued to **Abdul Hafeez** on **31 October 2024**, for a **6-hour** course. Certificate ID: **ADO6IJOS**. These details are transcribed from the uploaded PDF; no external credential verification is claimed. This is described as a course completion certificate, not an academic degree.

`public/certificates/coursiv-master-of-chatgpt.webp` is a high-resolution rendering of the uploaded certificate, preserving its original artwork and wording. The title, issuer, date, description and accessible image text live in `data/certificates.ts`. The fullscreen viewer supports zoom buttons, +/−, 0 to fit, Esc, touch/native scrolling and focus restoration. The old neutral placeholder remains available for new draft entries; `npm run certificate-placeholder` does not replace the real certificate.

After database seeding, edit published content through `/admin`. File changes are the seed source; they do not overwrite existing database records. Choose `CONTENT_SOURCE=files` when using data-only edits.

The About Me whitespace now contains a framed portrait area wired to the same `site.hero.portrait` and accessible description in `data/site.ts`. The hero now displays the animated Elvora emblem. The owner has not uploaded a personal photo, so the abstract image is explicitly labeled **Portrait placeholder**. Once supplied, put the real image in `public/`, update `portrait` and `portraitAlt` in `data/site.ts`, and clear `portraitStatus`; the About Me portrait updates.

`app/premium.css` adds gold lighting, violet atmosphere, reflective buttons, hover depth, portrait motion, card glows and a scroll progress line. It preserves keyboard focus, light theme, mobile layouts and reduced-motion preferences. The current four concept websites and their actual screenshots are documented in `SCREENSHOTS.md`; the earlier Elvora promotional card has been removed from Selected Work.
