# Google AI Studio import instructions — Mori Kohi Aki Matsuri

## Goal

Load this existing site into **Google AI Studio Build mode without redesigning, rewriting, refactoring, or regenerating the website**.

The website is already complete. Treat the current repository as the source of truth.

## Non-negotiable preservation rules

1. **Do not change visible site content.** Preserve all copy, headings, dates, Japanese text, links, venue information, images, image order, image crops, section order, colors, typography, spacing, animations, and responsive behavior unless I explicitly ask for a change later.
2. **Do not migrate this project to React, Vue, Next.js, Tailwind, or another framework.** It is intentionally a small vanilla HTML/CSS/JS Vite site.
3. **Do not replace or regenerate assets.** Keep everything under `assets/` exactly as provided.
4. **Do not "improve" the design on import.** No cleanup, normalization, componentization, content rewriting, accessibility rewrite, or dependency replacement unless required to make the existing project run.
5. If something fails, make the **smallest infrastructure-only fix** possible. Before changing any site file (`index.html`, `style.css`, `main.js`, `motion.js`, or anything under `assets/`), explain why the change is necessary.
6. Preserve the existing DOM/classes because `style.css` and the animation code depend on them.

## Existing architecture

- `index.html` — complete page markup and content.
- `style.css` — complete styles.
- `motion.js` — dependency-free animation primitives; exposes `window.Motion`.
- `main.js` — page interaction/animation code; depends on `window.Motion`.
- `assets/` — all site images/decorative assets.
- `vite.config.js` — Vite dev/build configuration.
- `server.mjs` — tiny production static server for the generated `dist/` directory.

There is **no backend and no Gemini API integration** in this site. Do not add either unless explicitly requested.

## Runtime contract

Use the repository's scripts exactly:

```bash
npm install
npm run dev
```

The dev server must listen on **0.0.0.0:3000** for Google AI Studio preview.

Before considering the import complete, also verify:

```bash
npm run build
npm run preview
```

`npm run build` must produce `dist/` without errors. `npm run preview` must serve that build on port 3000.

For a production-style Node start (including Cloud Run-style environments):

```bash
npm start
```

`npm start` runs the build first via `prestart`, then serves `dist/` with `server.mjs`. The server respects `process.env.PORT` and falls back to port 3000.

## Import task for the agent

On first load:

1. Read this file and inspect the repository.
2. Do **not** edit the site merely because AI Studio normally defaults to React.
3. Install dependencies if required.
4. Start `npm run dev` and verify the existing page renders.
5. Run `npm run build` and confirm it succeeds.
6. Do not make any visual/content changes during this setup task.
7. Report only actual runtime/build problems you found and any minimal fix you made.

## Reusability / components

Do **not** componentize the current page during import. For this template, preserving exact markup and styling is more valuable than introducing a component system.

If reusable components are wanted later, do them incrementally and only after taking a visual baseline. Good low-risk candidates are repeated data-driven blocks such as programme rows or coupon cards, but the initial import should remain vanilla and structurally unchanged.

## Baseline integrity check

This repository includes a checksum manifest for the site source and assets as imported. Run:

```bash
npm run verify:baseline
```

Run it before and after the initial AI Studio setup. It should print:

```text
Baseline OK: site content/source assets are unchanged.
```

If this check fails during the initial import, revert the unexpected source/content change rather than accepting a redesign.
