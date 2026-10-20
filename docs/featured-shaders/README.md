# Tunnel, Accretion and AI Agents

The Testimonials background uses a moving tunnel; Websites uses a black-hole accretion scene. References supplied by the owner:

- https://www.shadcn.io/view/shaders/tunnel
- https://www.shadcn.io/view/shaders/accretion (identified in the supplied screenshot)

The reference site's source could not be retrieved from this environment. These are original, locally implemented WebGL studies of those directions, not the exact shadcn registry components or redistributed source. The fragment programs live in `lib/featured-shaders.ts` and are hosted by `components/featured-page-shader.tsx`.

Both scenes render at up to 24 fps with buffers bounded to 960 × 720. Motion Off freezes the scene. Testimonials' Pause also freezes its tunnel. Hidden tabs and offscreen main content stop the frame loop. Context loss and unsupported WebGL show a local poster of the same shader. Context restoration rebuilds the resources. Extra-contrast and reduced-transparency modes hide the decoration. Native text and controls remain outside the canvas.

Regenerate the posters with `node --import tsx scripts/capture-featured-shader-posters.mjs`.

Run `PUBLIC_TEST_URL=http://127.0.0.1:3018 node tests/featured-shaders.browser.mjs` against a local app. It checks moving pixels, Motion Off, testimonial Pause, hidden tabs, footer visibility, context loss/restoration, mobile DPR bounds, both themes, unsupported graphics, AI Agents labels and the removal of AI-tool promotions. Results are in `checks.json`. The existing page-shader tests now exercise the remaining SDK backgrounds; their lifecycle check uses About.

The visible service name is AI Agents across navigation, home, service copy and metadata. Existing `/ai-bots` links, chat endpoints, business knowledge, individual brand logos and the verified Gemini configuration are retained. AI-tool promotions and assistant-development sales copy were removed from About, the website workflow and Skills. No new claims of autonomous purchases or bookings were added.
