# Given Loyiso — Design System

A personal brand system for **Given Loyiso**, a spiritual programmer and builder. The
portfolio it dresses is aimed at investors, entrepreneurs, product owners and creators
who may want to hire Given or build alongside him. It should read as **professional and
credible, but unmistakably personal** — a blend of the sacred and the technical.

> Instagram: **@givenloyiso**

## Who this is for
**Given Loyiso** — **creator, founder and technologist** based in **Amsterdam**. Not one
label: a pioneer who turns ideas into products and companies. Founder of **Meltizo**
(healthcare SaaS); 9+ years of deep engineering across React Native, Next.js, Node/NestJS,
PostgreSQL and AWS is the *craft underneath* the vision — proof, not the headline. The
brand should read as an entrepreneur and creative first, with serious technical depth as
backing. Audience: investors, founders, creators and collaborators. Contact:
`info@givenloyiso.com`, `linkedin.com/in/givenloyiso`, Instagram `@givenloyiso`.

## Sources
Authored from the brief ("gold and silver, high-frequency colors, spiritual + programmer")
plus Given's real assets: **gold signature logo** (`assets/logo-signature.png`), portrait
and working photography (`assets/given-*.jpg`), and his **2025 CV** (`uploads/Given-Loyiso-2025.pdf`)
for real experience, projects and stack. See CAVEATS at the bottom.

---

## The idea: "Frequency & Craft"

Two truths held at once:
- **Spiritual** — obsidian depth, gold light, calm space, high-frequency color as energy.
- **Programmer** — precision, monospace detail, systems thinking, restraint.

The result is a **dark, metallic, luminous** system. Gold is the signature metal, silver
is the cool structural neutral, and a small set of *high-frequency* accents (violet,
cyan, magenta) appear rarely — like energy surfacing through matter.

---

## CONTENT FUNDAMENTALS — how the copy is written

- **Positioning:** creator / founder / pioneer FIRST; developer as the craft underneath.
  Never reduce Given to "just a developer." Lead with vision and range; let the engineering
  depth back it up. He is "more than one thing — a pioneer in whatever he's called to build."
- **Voice:** first person, warm and grounded. "I build things that carry meaning." Given
  speaks as himself — confident, not corporate.
- **Address:** speaks *to you* directly when inviting collaboration. "Let's build
  something that matters."
- **Tone:** calm, intentional, a little poetic — but always concrete about what he does.
  Spiritual language is a seasoning, never a smokescreen; every lofty line is anchored by
  a real deliverable.
- **Casing:** Sentence case for body and most headings. Reserve UPPERCASE for short mono
  **eyebrows / labels** with wide letter-spacing (e.g. `SELECTED WORK`, `LET'S TALK`).
  Display serif headlines use title-ish sentence case.
- **Sentence length:** headlines are short and declarative. Body runs 1–2 tight sentences.
- **Numbers/stats:** used only when true and earned (years building, projects shipped) —
  never invented filler metrics.
- **Emoji:** none. The system expresses warmth through gold, type and space, not emoji.
- **Symbols:** an occasional geometric glyph (◇ ✦ ·) as a quiet divider is on-brand; keep
  it rare.

**Sample copy**
- Hero: *"Given Loyiso — Spiritual technologist. I build with intention."*
- Eyebrow: `SELECTED WORK`
- CTA: `Let's build →`
- About: *"I'm a programmer who treats code like craft and building like a practice."*

---

## VISUAL FOUNDATIONS

**Colors.** Ground is obsidian (`--ink-900 #08080b`). Text is silver
(`--silver-100 … --silver-500`). The warm signature is gold, four steps from champagne
`--gold-300` to antique `--gold-600`, with `--gold-500 #c9a24b` as the primary metal.
High-frequency accents (`--freq-violet`, `--freq-cyan`, `--freq-magenta`) are *energy*,
used at ≤10% of any composition — a halo, a hairline, a hover glow. Metallic **gradients**
(`--grad-gold`, `--grad-silver`) are reserved for the wordmark, key numerals and rules —
not for filling large areas.

**Type.** Three voices:
- Display: **Cormorant Garamond** — editorial serif, spiritual/elegant, for big headlines
  and pull quotes (often the italic for warmth).
- Sans: **Space Grotesk** — the working voice: UI, body, buttons, navigation.
- Mono: **JetBrains Mono** — eyebrows, labels, code, metadata, the "programmer" texture.

**Spacing.** 4px base scale. Generous negative space is a feature — the layout should
breathe like a gallery, not a dashboard. Container max 1200px; narrow reading column 820px.

**Backgrounds.** Flat obsidian is the default. Depth comes from **radial halos**
(`--grad-halo`) glowing softly behind hero content, subtle vignettes, and the occasional
fine hairline. No busy patterns, no stock gradients across whole sections. Optional very
subtle grain is acceptable but never loud.

**Borders & cards.** Cards are `--surface` (`--ink-700`) with a hairline ring
(`--ring-hair`) and soft radius (`--radius-lg 16px`). A featured card upgrades to a
**gold hairline** (`--border-gold`) and a warm `--glow-gold`. No colored left-border-only
cards. Radii are soft and jewel-like (6 → 32px), pill for chips/CTAs.

**Shadows.** Deep, diffuse elevation shadows suit the dark ground (`--shadow-md/lg/xl`).
The signature is the **gold glow** (`--glow-gold`) and, rarely, a **frequency halo**
(`--glow-freq`) behind spiritual/energetic moments.

**Motion.** Calm and intentional. Fades and gentle rises (12–20px) on `--ease-out`,
240ms default. Hovers add a soft glow and a hair of lift; no bounces, no springy overshoot.
Respect `prefers-reduced-motion`.

**Hover / press.** Hover = brighter gold + soft glow (+ ~1px lift on cards/buttons).
Press = antique gold `--gold-600` and a 1–2px settle (scale ~0.99). Ghost elements warm
their border and text toward gold on hover.

**Transparency & blur.** Glassy chrome (sticky nav, overlays) uses `--blur-glass` over a
translucent obsidian. Used for floating chrome only, not decoration.

**Imagery vibe.** Warm-cool duality: cool obsidian shadows, warm gold light. Photography
skews moody, high-contrast, with warm highlights; a faint grain is welcome. Portraits are
intimate and calm.

---

## ICONOGRAPHY

- **Primary mark: the gold signature logo** (`assets/logo-signature.png`) — a hand-drawn
  "Given Loyiso" script in gold on black. Use it in the nav, footer and anywhere the brand
  signs off. A new logo may replace it later; keep it swappable. As a text fallback, the
  name set in Cormorant Garamond with a gold gradient works.
- **Icon set:** [Lucide](https://lucide.dev) via CDN — thin, consistent 1.5–2px stroke,
  rounded joins. This matches the refined, non-shouty feel. Stroke icons only; no filled
  or duotone icon families.
- **Social glyphs** (Instagram, GitHub, etc.) also come from Lucide.
- **Emoji:** never used as iconography.
- **Geometric glyphs:** unicode `◇ ✦ · —` may appear as quiet dividers/eyebrow marks,
  sparingly, in gold.
- Icons inherit `currentColor`; default to `--silver-300`, warm to `--gold-500` on hover
  or when active.

---

## Index / manifest

- `styles.css` — global entry (only `@import`s).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `fonts.css`.
- `guidelines/` — foundation specimen cards (Colors, Type, Spacing, Effects, Brand).
- `components/core/` — Button, LinkButton, Tag, Badge, Card, ProjectCard, Eyebrow,
  Input, SocialLink, Stat, SectionHeading.
- `ui_kits/portfolio/` — full-screen recreation of the Given Loyiso portfolio site.
- `SKILL.md` — Agent-Skill wrapper for use in Claude Code.

**Namespace:** components mount from `window.GivenLoyiso` (confirm via check_design_system).

---

## CAVEATS
- **Fonts are substitutions** (Cormorant Garamond / Space Grotesk / JetBrains Mono from
  Google Fonts). If you own brand fonts, please share them.
- **Logo:** using the current gold signature. You mentioned a new one is coming — drop it
  in `assets/` and it swaps everywhere.
- **High-frequency accents** are now used very sparingly (a quiet gold-forward palette) so
  the brand reads serious/credible to investors and founders. The violet/cyan/magenta
  tokens remain available for energetic, personal contexts.
- **Project detail copy** in the UI kit is summarised from the CV; expand each into a real
  case study when ready.
