# Elvora integration

Source: https://github.com/dickwu/apple-design-skill
Pinned commit: `914b6a377c22755597e4405e54911b996de822d7`.
Installed on 18 October 2026 as development guidance, with no runtime dependency.

The upstream skill is named `apple-design`. This project already contains Emil
Kowalski’s skill with that name. Only the new skill’s YAML `name` is changed to
`apple-hig-design`, so both remain independently discoverable. Invoke this one
with `$apple-hig-design`. No Apple guideline text has been edited.

`UPSTREAM-SHA256.json` records the original hashes of every imported source file.
For SKILL.md, reverse the single frontmatter name replacement before comparing.
Local INTEGRATION.md and the hash manifest are not upstream files. The prior
Emil skill and its provenance are unchanged.

Read SKILL.md and select only relevant references. For this Next.js website,
apply web accessibility, responsive layout, legibility, feedback and appearance
preferences. Preserve the owner’s custom purple theme, artwork, video loops,
manual theme/motion controls and existing consent/provider behavior. Native
Apple navigation, Apple Pay, SwiftUI materials and App Store rules are not web
requirements. This is not an Apple certification or endorsement.

The imported snapshot contains 123 generated HIG pages and one curated Liquid
Glass guide. Refreshing is a separate maintenance operation: use the upstream
script and review its diff; do not silently refresh during ordinary site work.
No cache, Git history, sponsorship configuration or installer is included.

Attribution: retain upstream README.md and source links in each reference.
Apple guideline text belongs to Apple Inc. Upstream supplies the skill and
script as-is and includes no separate LICENSE file; see README.md’s “Origin
and license” section. Existing project/Emil licensing is not extended to this
snapshot.
