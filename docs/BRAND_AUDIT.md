# Elvora: brand and conversion audit

Audit date: 19 October 2026. Source baseline: commit `96df652`. Scope: Elvora's public pages, project notes, service details, fictional website demos and UI studies. Private admin and legal/provider policies are outside the marketing rewrite. The source files and local rendered application are the evidence; this is not a claim to have inspected Google results or the live host's CMS records.

## What the business actually offers

Abdul Hafeez is building Elvora to sell website development and website chatbots using customers' own business information, including to international customers. The supplied context says he started this business after watching Nafay's videos and has followed him since *Unreal Engine 5: Easy Car Render for Beginners*. His photo is supplied, not a generated portrait.

The selected portfolio contains four fictional website concepts (Solenne, Vanta, Aster, Kovo), six UI studies, three separate business-knowledge chat demos (Veldt, Northline, Solenne), an Aura voice demo and a connected Forte Botpress assistant. These are examples, not client commissions. The previous Gemini fix has real provider/API verification recorded in `BUSINESS_ASSISTANTS.md`.

Four older restaurant, property, software and fashion demos also remain available at their existing URLs. Their vague headlines/descriptions are rewritten to explain the sample interface; they are not counted as additional client work.

There are no permission-approved client quotes in the file content. There is no supplied evidence of paid agency employment, commercial conversion gains, client count, years of professional experience or ranking improvements. None has been invented in this rewrite.

## Findings and replacements

Severity describes the impact on clarity and credibility, not whether a particular phrase proves AI authorship. Polished language, a serif or a purple accent alone cannot establish who wrote/designed a page.

### Home and global navigation

| Where | Previous issue | Why it feels generic | Severity | Replacement implemented |
|---|---|---|---|---|
| Home hero, `components/hero.tsx` | “Custom websites. Helpful AI chatbots.” followed by “Built for your business. Ready for your customers.” | Category labels plus a symmetrical promise; no evidence of the work. | High | “I build websites. And chatbots that answer from your documents.” Immediately followed by the actual work offered and a named Kovo capture. |
| Home hero visual | Floating, rotating 3D Elvora emblem with rings, shine and orbit dot. | A logo animation says nothing about a development service. | High | A flat browser capture linking to the working Kovo concept. Its caption identifies it as concept work. |
| Hero actions | Two equally styled calls to action plus a repeated “explore” prompt. | The standard portfolio template gives every action the same weight. | Medium | One solid “Tell me what you need” action; a quieter text link leads to the work below. |
| Hero bottom | Animated expertise marquee listing generic technical categories. | Repeats services without helping a visitor assess them. | Medium | Deleted. A margin note gives an exact Veldt question about a $70 order and a $75 free-shipping threshold. |
| Home purpose band | “Show what you do. Make it easy to get in touch.” plus another explanation of the same services. | A second sales introduction before evidence. | Medium | Deleted. The page moves from the offer into working examples. |
| Home website/bot bands | Full-width staged videos of a laptop/chat, generic descriptions. | Promotional scenes obscure the actual interface and may read as synthetic footage. | High | Actual Solenne and Vanta browser captures, each linking to its functional concept and naming the interaction to try. Uploaded video files are preserved but these placements are removed. |
| Collection promotion | “Different worlds. One eye for detail.” | A taste claim that any design portfolio could make. | High | “Six interface studies” linking to a named, flat contact sheet. |
| Keep Exploring | “The person. The perspective. The next idea.” above three navigation cards. | Symmetrical filler duplicating the existing navigation and footer. | Medium | Entire section removed. |
| Global navigation | A primary Testimonials link while there are no real public testimonials. | Gives unearned prominence to nonexistent client evidence. | High | Removed from primary and mobile sales navigation. The existing URL remains honest and reachable directly. |
| Navigation material | WebGL refraction/glass overlay and translucent surfaces. | Visual novelty adds no service evidence and competes with text. | Medium | Removed the `NavigationGlass` mount; opaque ink/paper navigation with a rule and active underline. Keyboard/menu controls retained. |
| Site shell | Category WebGL shaders, scroll ambience and reading/word effects. | Creates a shared effect-library identity rather than a business identity. | High | Removed shader/ambience/effect mounts. Content is readable immediately; no WebGL is mounted on the public marketing pages. |
| Global typography | Inter body + Space Grotesk display used throughout an effect-heavy system. | Familiar startup typography without a clear editorial distinction. | Medium | Locally hosted Fraunces for public display headings and Space Grotesk for body/interface text. Admin and standalone demo requirements remain scoped. |
| Global palette | Purple accents, purple/blue shaders, glow layers. | The same visual shorthand as many AI products. | High | Warm paper, ink and forest green. Dark mode reverses the ink/paper relationship with a readable green tint. Existing E logo geometry is retained with a green accent. |

### Websites, project notes and the collection

| Where | Previous issue | Why it feels generic | Severity | Replacement implemented |
|---|---|---|---|---|
| Websites heading | “Ideas, brought to the browser.” | Does not identify the deliverable. | High | “Four website concepts. Try the working pages.” Intro names Kovo's enquiry and Solenne's planner. |
| Websites introduction | “Four original concepts. Four distinct worlds… built to explore, not just look at.” | Repetition and contrast in place of information. | Medium | Concrete examples, clear fictional-brand disclosure. |
| Project cards | Floating laptop/phone devices, floor lights, pointer tilt and scroll rotation. | Ad-style staging overstates a simple browser screenshot. | High | Flat screenshots, restrained project metadata and a specific task to try. Gallery and build-note links remain. |
| Work showcase video | Another generic presentation before the project list. | Repeats the portfolio without making it easier to inspect. | Medium | Removed from Websites; projects start directly below the heading. |
| Repeated technical-domain grid after workflow | Broad technical categories repeated on Skills and a separate route. | “One more section” before contact; adds length without new proof. | Medium | Removed from Websites. Dedicated technical route remains; navigation now points to its real URL. |
| Work process | “A thoughtful process”, “Care lives in the details”, “Launch is a beginning.” | A process brochure without concrete review points. | Medium | Written scope, early page review, working build, interaction checks and domain/setup handover. No invented timeline. |
| Collection | Rotating 3D cylinder repeating the same screenshots dozens of times. | Artificial scale and visual activity obscure the actual number of studies. | High | Ten unique linked entries: six studies and four concepts. Unequal columns and offsets keep the visual rhythm without rotation. |
| Collection copy | “A closer look at the craft”, “different directions… an eye for the details.” | Claims design judgment instead of showing it. | Medium | “The interface notebook.” Identifies what the entries are and warns that financial/usage figures are demo data. |
| Project notes | “From design to interface”, repeated general description. | Could be attached to any project. | Low | “Try the implemented interface”, named functional project subtitles and links to the actual build. |
| Project subtitles | Feeling-led lines such as “A slower rhythm” and “Architecture with room for life to happen.” | Gives a mood instead of explaining the interaction. | High | Solenne: suite filters/stay planner. Vanta: model comparison/finish selection. Aster: care filters/no-data planner. Kovo: project filters/brief builder. |

### AI assistants

| Where | Previous issue | Why it feels generic | Severity | Replacement implemented |
|---|---|---|---|---|
| AI Bots hero | “Your business. Better conversations.” | An unmeasured improvement claim with a symmetrical rhythm. | High | “A chatbot that answers from your documents.” Supporting copy names product details, policies and customer questions. |
| AI Bots backdrop | Rainbow/prismatic WebGL, dark overlay and sparkle kicker. | Describes an effect library, not the assistant's usefulness. | High | Removed the shader and sparkle decoration. Left-aligned paper/ink heading with one demo action. |
| Knowledge story | “It starts with what your business knows.” plus a generic assistant answer. | Could fit every chatbot seller and offers no way to check correctness. | High | Veldt's exact $70-versus-$75 policy test with an actual source-policy excerpt. Source links remain beside the actual demos. |
| Bot feature images | Generated backpack/laptop/hotel studio scenes. | They are not photos of Elvora or client businesses. | High | Removed from the marketing page. Original HTML conversation previews and custom brand marks are the primary visuals. No replacement stock photos. |
| Veldt headline | “A little guidance. A better shopping experience.” | Implies a benefit without showing an answer. | High | “Which bag fits a 15-inch laptop?” with the sample product's actual specification. |
| Northline headline | “Turn a first question into a clear project brief.” | Plausible but abstract. | Medium | “What would a website project include?” The description explains package answers and local brief drafting, without claiming an enquiry is sent. |
| Solenne headline | “A warm welcome, before the stay begins.” | A hospitality feeling instead of an assistant capability. | High | “Which room fits four guests?” Explicit limit: no availability confirmation or reservation. |
| Demo collection heading | “Different jobs. One thoughtful experience.” | Another interchangeable balanced pair. | Medium | “Pick a business. Ask a real question.” Fictional-business labels remain. |
| Build-process intro | A generic sequence of knowledge/conversation/integration claims. | Describes every chatbot service. | Medium | Names Veldt's supplied guide and delivery policy, separate sources and answer testing. |
| Motion story | “Built to feel part of your website” with another promo video. | Repeats the pitch rather than showing more evidence. | Medium | Deleted. Working demos and integration details remain. |
| Chat branding | Solenne's role “Your stay, thoughtfully planned.” | A vague hospitality slogan inside a functional tool. | Low | “Room and policy questions.” All four custom assistant logos remain intact. |

### About, journey, services, skills, certificates and contact

| Where | Previous issue | Why it feels generic | Severity | Replacement implemented |
|---|---|---|---|---|
| About title/lead | “A thoughtful approach… Design judgment. Practical engineering. A human eye…” | A group of flattering abstractions. | High | “I'm Abdul Hafeez. I build what you see here.” Concrete origin and named projects. |
| About biography | Agency work and professional-sounding career progression with no supplied names or evidence. | Risks inventing experience and authority. | High | Removed agency-employment claims. Uses only the user's account of Nafay's influence and the work visible in the repository. |
| About AI paragraphs | Long defence of human judgment around AI. | Generic positioning that delays showing the actual method. | Medium | One practical paragraph: separate business knowledge, test Veldt against its policy, review code and behaviour. |
| About portrait labels | “Independent by design”, “The person behind the pixels.” | Adds a slogan to an authentic photo. | Low | Keeps the supplied portrait and name. Removes decorative overlay labels/signature block. |
| Journey | Four conventional career chapters including unverified agency collaboration/startup progression. | Sounds like a generated founder biography. | High | Two factual entries: learning through examples and building the concepts shown here. No invented dates or employers. |
| Services headline | “Design + Development. Built with purpose.” | Says almost nothing about scope. | High | “What I can build for you.” Each service includes an observable example or technical responsibility. |
| Service descriptions | “Modern”, “professional”, “instant assistance”, “trained on business data.” | Unverifiable quality/latency claims; “trained” misdescribes these context-based demos. | High | Names Next.js pages, enquiry forms, approved documents, server-side API keys and tested errors. Uses “answers from”, not a fine-tuning claim. |
| Service details | “A practical scope. Built around you.” | A generic reassurance above specific content. | Low | “Scope / Before development starts.” Adds links to the actual Kovo/Solenne or Veldt/Northline examples. |
| Skills/tool copy | “Always learning. Always refining.” and human-vs-tool slogans. | Empty reassurance plus decorative tool logos. | Medium | Describes the stack used by this site and connects it to the demos. No partnerships or skill percentages implied. |
| Technical-domain conclusion | “If you don't understand… how will your website actually run, scale, and stay secure?” | Defensive rhetorical claim without evidence. | Medium | Directs visitors to the chat demos and sample knowledge as inspectable examples. |
| Certificate heading | “Certificate Showcase.” | Makes one course document feel like a credentials gallery. | Low | “Course record.” Names Coursiv, six hours and 31 October 2024. Explicitly distinguishes course completion from accreditation. |
| Contact | “Let's find a thoughtful way forward.” | Says nothing about what a customer should send. | High | Asks for the current URL, the job to do and two or three chatbot questions. Form placeholder asks for scope and known deadline/budget. |
| Contact FAQ | Generic FAQ block after a complete contact form. | Repeats basic sales information and prolongs the page. | Medium | Removed from Contact. Relevant requirements/cost responsibilities stay in service detail pages and handover scope. |
| Footer | “Your idea deserves a thoughtful home”, “Let's make something matter”, three-part purpose claim, huge wordmark and animated waves. | A second generic sales hero on every page. | High | Compact “What needs to work better?” brief prompt, direct email, functional links and named examples. No waves or oversized decorative wordmark. |

### Truth, demo copy and assets

| Where | Previous issue | Why it feels generic or misleading | Severity | Replacement implemented |
|---|---|---|---|---|
| Testimonials page | Four fictional people with positive reviews, despite labels saying they were examples. | Visitors scan the social proof before the disclaimer. Fictional praise is still unnecessary. | High | Removed the fixture file and all fallback review rendering. Empty state: “No client reviews published yet.” Real permission-approved CMS reviews can still render. Placeholder reviews are filtered out. |
| Testimonials visual | Stars, floating review cards, dramatic quote marks. | Makes illustrative praise feel endorsed and theatrically important. | High | A plain empty state or static genuine quote list, with links to inspect the actual work. |
| Four website-demo hero headlines | “Somewhere time slows down”, “Pure form. Pure intent”, “Care that makes space for you”, “Spaces, deeply considered.” | Each describes an atmosphere more than a usable offering. | Medium | Rewritten within the fictional demos to suites/villas, model/finish choice, care options and residential/workplace architecture. All sample-data disclosures and interactions retained. |
| Six study headlines | “More possibilities”, “Signals into possibilities”, “Move with intention”, “A softer everyday” etc. | Generic slogans repeated across fictional brands. | Medium | Account activity, analytics sources, coastal travel editorial, strength/mobility classes, identity/editorial work and skincare products. These are UI studies, not claims that Elvora operates those businesses. |
| Generated imagery inside fictional demos/studies | Imagined hotels, cars, buildings and products. | Must not be presented as real client businesses or photographed outcomes. | Medium within a labelled demo; high in a real-client sales claim | Kept only as labelled fictional design content inside the example interfaces and their actual captures. Removed from assistant sales photography. No actual client exists to photograph here. Replacement for a real commission: [PLACEHOLDER: client-approved property, product or project photographs with usage permission]. |
| Em dashes and symmetrical patterns | Frequent stylistic dashes and repeated “X. Y.” statements. | Gives unrelated sections the same generated cadence. | Low–Medium | Cut the repeated sections; replace remaining stylistic em dashes in public content with ordinary punctuation. Functional documentation, code and real quoted reviews are not mechanically altered. |
| Decorative icons | Sparkles marking AI sections and a launch step. | Decorative AI shorthand rather than meaning. | Low | Removed AI sparkle decoration. Retained icons only for actions, sources or genuine tool identification. |

No substantiated commercial outcome statistics were found or added. Example balances and product prices remain labelled fictional, and counts refer to inspectable work items.

No literal occurrence of every buzzword in the request was found in public sales copy. For example, “revolutionize” and “game-changer” were not present. The stronger problem was repeated vague “thoughtful/purpose/considered” language and staged evidence. A generic-word search is not a substitute for reading the page. Private image-generation prompts and historical audit documents are not customer copy.

## Design system

- **Display: Fraunces, 450 weight.** Its shaped serif forms make large headings look editorial rather than like a SaaS UI. Use it for short public headings, not form inputs or long paragraphs.
- **Body/interface: Space Grotesk.** Its technical character suits a developer's build notes and makes a deliberate contrast with the serif. Locally hosted alongside Fraunces; no Google Fonts request or additional tracking.
- **Paper `#F3EFE5`, ink `#24251F`, forest `#386344`.** Paper and ink carry almost the whole page. Forest marks links/actions; it is not a background spectacle. Borders and muted text are mixtures of these roles. Dark mode reverses ink/paper with a legible green tint.
- **Separate demo palettes stay separate.** A Vanta lime or Northline violet inside a labelled interface example is project content, not a fourth main-site accent. The admin interface is not redesigned as a marketing page.
- **Layout:** a large left-aligned offer, a real Kovo browser capture and a narrower policy-test margin note. Below it, Solenne and Vanta occupy unequal columns with an offset. Services/process use ruled text rows. The study collection is a flat, staggered contact sheet instead of a 3D cylinder.

## Asset decisions

Use the supplied Abdul Hafeez portrait on About. Use actual rendered browser captures for the website work, and the original custom Veldt/Northline/Solenne/Aura marks with readable conversation previews for assistants. Keep the original course certificate. Do not add client logos, generated people, invented dashboards presented as business results, or stock “person using a laptop” photography.

Uploaded promotional videos and old effect components are retained as source assets but are no longer mounted on the sales pages. The four demo brands remain fictional; generated scene images in those labelled design examples are not presented as Elvora's office or a client's premises. New client imagery would require [PLACEHOLDER: actual client asset files, licensing and publication approval].

Project/demo screenshots are refreshed after the copy changes so the preview reflects the implementation. Captures now target the actual interface region rather than the surrounding mock desktop, dock or cookie banner, and gallery detail captures scroll the real preview container. UI screenshots count as evidence of the build, not proof of commercial outcomes.

## Sections removed entirely

Floating-logo hero; expertise marquee; second homepage purpose pitch; centered category-video bands; Keep Exploring navigation cards; home testimonial promotion; website showcase video; repeated technical-domain grid on Websites; collection cylinder; fictional testimonials; testimonial stars/floating animation; category shaders; navigation refraction canvas; bot promo photography; repeated bot motion story; generic Contact FAQ; decorative footer waves/wordmark.

The five-step bot-build explanation and integration code guide were moved out of the primary sales page into the existing /ai-bots/how-i-embed-bots route. Forte and Aura are available under a native expandable section. Public routes, project filters/planners, chat history/knowledge links, privacy/consent, theme/menu controls, contact submission and genuine review rendering are preserved. The removed legacy FAQ anchor redirects to Contact without a dead fragment; embedding links point to the technical guide. No provider secrets or bot knowledge limits are changed by this work.

## Missing evidence: do not fill with invented copy

- [PLACEHOLDER: permission-approved client quotation, identity and project context] before publishing an endorsement.
- [PLACEHOLDER: real project baseline, measured post-launch result and measurement period] before making a performance/conversion claim.
- [PLACEHOLDER: approved real-client screenshots and permission] before replacing concept work with client work.
- [PLACEHOLDER: agreed service fees and delivery scope] before publishing real package prices or promised dates.

These placeholders belong in the editorial backlog, not as fake-looking content on the public homepage. The public site omits those unsupported claims.

## Final name/logo removal check

| Area | Would it still identify this particular body of work? | Revision made |
|---|---|---|
| Home | Yes: Kovo capture, Veldt's $70/$75 policy test, Solenne and Vanta interactions. | Replaced generic introduction and videos with those artifacts. |
| Websites | Yes: named concepts plus the exact task to try in each. | Replaced emotional subtitles and floating devices. |
| Assistants | Yes: separate Veldt/Northline/Solenne sources, capabilities and explicit action limits. | Concrete sample question in every feature; retained source links and real chat. |
| About/Journey | Yes: supplied Nafay tutorial origin, real portrait and the same inspectable builds. | Removed agency-career narrative and generic AI manifesto. |
| Services | Generic service labels alone failed. | Added Kovo, this site's chat route and Veldt/Northline proof links. No invented differentiator. |
| Collection | A rotating wall failed. | A unique, numbered index of the actual studies and builds. |
| Testimonials | Fictional profiles failed. | Honest absence of published client reviews; links to inspect the work. |
| Contact/footer | A generic invitation failed. | Asks for a useful site/chatbot brief and names the concrete examples the visitor just saw. A functional email form is intentionally plain. |
| Certificate/legal/controls | These should remain standard, factual records and usable UI. | No invented personality, prose flourishes or fake credential language added. |

A name-removal test is a qualitative editorial check, not proof of market uniqueness. The distinction now comes from the real artifacts and the supplied origin story rather than a claim that no competitor can do the same work.

## Verification

The name/logo removal check was applied again after the first visual review: the homepage headline now says the actual service directly, the assistant knowledge section uses a source-policy excerpt, and the technical guide is on its own route. Screenshots under `docs/brand-audit/` are local QA evidence, not screenshots of a deployed client business.

Final verification on 19 October 2026:

- Production build passed with lint and TypeScript validation; all 28 chat/backend tests passed.
- `node tests/brand-audit.browser.mjs`: 90 layout cases (15 routes × 390/768/1440px × light/dark), no overflow or page errors; one H1 per page; no decorative canvases; no fictional reviews or banned sales buzzwords in the checked main content. Three assistant send/source-link cases used explicitly mocked replies. Four concept filters and two local concept summaries worked. Six study captures were refreshed.
- `node tests/brand-accessibility.browser.mjs`: eight main-content scans on Home, AI Bots, Contact and About across both themes. Final run used the actual built styles (`injectedStyles: false`) and found no WCAG A/AA rule violations. Earlier contrast failures in assistant previews were fixed, not waived. This is a scoped automated check, not a claim of complete WCAG conformance.
- Additional browser checks: mobile navigation and Escape; contact validation before a request; mocked contact failure with draft retained; four readable pages with JavaScript disabled. No real email was sent. No Gemini requests were made for this design audit; API UI responses were mocked.
- Original capture script refreshed all sixteen concept-gallery images. Screenshots exclude the fake desktop/dock and cookie UI, and detail captures scroll the real preview region. Six study images also show their actual interface region.
- The app ran in `CONTENT_SOURCE=files`. Production database overrides, genuine client records and hosting settings were not edited. Existing shader/motion-specific browser scripts describe the replaced design and were not claimed as passing.
- Local screenshots and JSON results are in `docs/brand-audit/`. Git publication and a local production build do not independently verify the public Vercel deployment. No conversion/ranking improvement is asserted.
