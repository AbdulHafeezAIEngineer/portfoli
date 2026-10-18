# Emil Kowalski skills — project installation

Source: <https://github.com/emilkowalski/skills>.

Installed from the owner's uploaded `skills-main.zip` on 18 October 2026. Archive SHA-256: `e6b7504bc6455efdda6ad657a19a352a2579fa5b4c12f0112c6b1b09e26ae735`. The ZIP does not identify an upstream commit; this is a checksum-pinned supplied snapshot, not a claim of the latest GitHub version.

All 15 skill directories and their referenced Markdown files are copied without modification. `LICENSE.emilkowalski`, `UPSTREAM-README.md` and `performance-cheatsheet.md` retain the upstream license, overview and reference. No installer or third-party executable was run, and no application dependency was added.

These are development instructions. They are not imported into the Next.js application, injected into website chatbots or downloaded by visitors. Only choose a skill when its actual scope matches the task. Native/Expo/Swift skills are installed for completeness and are not applicable to this web project. `improve-animations` is a read-only advisor; its findings/plans can be implemented as a separate authorized coding step using the implementation skills. Current user instructions and repository requirements take precedence over generic advice, including default Motion On and preserving all original custom art.

For the website, start with:

- `emil-design-eng/SKILL.md`: design engineering and interaction review.
- `animation-performance/SKILL.md`: evidence-based animation diagnostics.
- `mobile-native/SKILL.md`: touch controls and mobile browser behavior.
- `review-animations/SKILL.md` and `STANDARDS.md`: review motion changes.
- `apple-design/SKILL.md`: reference for intentional, interruptible motion.

The current audit, implemented fixes and measured limits are in `docs/EMIL_SKILLS_AUDIT.md`. Reproducible regression checks are run with `npm run test:emil:browser` against the local production server on port 3008.
