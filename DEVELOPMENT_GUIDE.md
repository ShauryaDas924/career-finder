# Development Guide

This guide covers day-to-day work on Where to Look. Read [AI_CONTEXT.md](./AI_CONTEXT.md) before changing product scope, [RESOURCE_GUIDE.md](./RESOURCE_GUIDE.md) before curating links, and [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) before changing the visual language.

## Prerequisites

- Node.js 22.13.0 or newer, as required by `package.json`
- npm; this repository uses `package-lock.json` with lockfile version 3
- No database, hosted service, or application environment variables are required for local development

Confirm the runtime before debugging an install or build problem:

    node --version
    npm --version

## Install and run

Install dependencies:

    npm install

For a clean, lockfile-exact CI installation, use:

    npm ci

Start the vinext development server:

    npm run dev

Use the local URL printed by the command. The script writes Wrangler diagnostics to `.wrangler/wrangler.log`; `.wrangler/` is generated and ignored.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the vinext/Vite development server with hot reload. |
| `npm run lint` | Run ESLint with the Next.js Core Web Vitals and TypeScript rule sets. Generated `dist/` and `.next/` output is ignored. |
| `npx tsc --noEmit` | Type-check the project in strict mode. There is no separate `typecheck` package script. |
| `npm test` | Build the application, then run the Node test suite in `tests/rendered-html.test.mjs`. |
| `npm run build` | Produce the Cloudflare Worker-compatible build in `dist/`. |
| `npm run start` | Start the built vinext application. Run a successful build first. |

`npm test` already performs `npm run build`. Run a final standalone build when source changed after the tests or when validating deployment output.

## How the editing surface is organized

- `app/page.tsx` defines the single route and renders `CareerGuide`.
- `app/CareerGuide.tsx` owns the interactive UI, search/filter state, cards, illustrated markup, and dialog.
- `app/data/resources.ts` is the authoritative category and resource dataset.
- `app/globals.css` contains design tokens, layout, component styles, illustrations, breakpoints, keyframes, reduced-motion behavior, and print rules.
- `app/layout.tsx` owns document metadata, the favicon, the social preview, viewport settings, and the root language.
- `worker/index.ts` is the Cloudflare Worker entry point used by vinext.
- `vite.config.ts` combines vinext, the Sites packaging plugin, and the Cloudflare Vite plugin.

See [FILE_MAP.md](./FILE_MAP.md) for the broader repository map.

## Common changes

### Add a resource

Follow [RESOURCE_GUIDE.md](./RESOURCE_GUIDE.md) for the full curation checklist. At code level:

1. Add a stable identifier to `resourceIds` in `app/data/resources.ts`.
2. Add the corresponding object to `resources`.
3. Use an existing `CategoryId`, `ResourceFormat`, and `ResourceTag` when they fit. Extend those unions only when the new value represents a genuine new concept.
4. Add specific majors, roles, abbreviations, and aliases to `searchTerms`.
5. Verify the destination and every claim shown to students.
6. Update intentional assertions in `tests/rendered-html.test.mjs`, including the resource count if it changed.
7. Run the validation workflow below.

Resource order matters: the default library displays the first 12 records until the user expands it.

### Edit or remove a resource

Edit the object in `app/data/resources.ts`. If the URL or identifier changes, keep the `resourceIds` list in sync. When removing an item, check whether it was the only resource in a category, a featured resource, or a specialist result required by a search assertion.

### Add a category

Broad categories are intentional; do not add one for every major. If a new top-level family is justified:

1. Add its ID to `categoryIds`.
2. Add a complete metadata object to `categories`, including a short label, description, semantic icon name, and search keywords.
3. Reuse a `CategoryIcon` when possible. A genuinely new icon requires updates to the `CategoryIcon` union and `iconLabels` in `app/CareerGuide.tsx`.
4. Assign at least one resource to the new category.
5. Update the explicit category-count assertion and relevant search coverage in the tests.
6. Inspect the category grid and horizontally scrolling mobile filter row.

### Add search aliases

Use `searchTerms` on a resource for majors, role names, industry vocabulary, and common aliases that should return that resource directly. Use category `keywords` only for broad terms that should fall back to a whole category.

The current search order is deliberate:

1. Normalize the query and searchable resource text.
2. Return direct resource matches when any exist.
3. Only when there are no direct matches, match category labels and keywords and return resources in those categories.

One- and two-character alphanumeric queries use whole-token matching. This prevents `AI`, `IT`, `PR`, and `HR` from matching arbitrary substrings. If the search algorithm changes, update the mirrored helper and assertions in `tests/rendered-html.test.mjs` in the same change.

### Mark a resource as featured

Set `featured: true` on the resource. `featuredResources` is derived from that flag and rendered in the five-card shortlist. The current automated test intentionally locks the exact five featured IDs, so a shortlist change must update that assertion and be visually reviewed.

### Adjust artwork

The original scenery is decorative React markup styled with CSS rather than image files:

- `Pinwheel`, `Tree`, `CategoryMark`, and the scene markup live in `app/CareerGuide.tsx`.
- Shapes, positioning, and responsive adjustments live in `app/globals.css`.

Keep decorative pieces `aria-hidden="true"` and non-interactive. Check all three responsive breakpoints after moving large or absolutely positioned shapes.

### Edit motion

Continuous motion is defined through the keyframes near the end of `app/globals.css`. Component-level durations are attached to the pinwheel classes and the `speed` custom property. Category-card navigation in `app/CareerGuide.tsx` also checks `prefers-reduced-motion` before requesting smooth scrolling.

Every new transition or animation must remain understandable when the reduced-motion media query collapses its duration. Do not add motion that communicates required information by itself.

### Modify colors or component styling

Change shared colors, radii, shadows, and page width through the custom properties at the top of `app/globals.css`. Then inspect focus outlines, text contrast, hover/pressed states, the illustrated landscape, and the print rules. Avoid replacing the established palette with a generic product-dashboard treatment.

### Add or update tests

Tests live in `tests/rendered-html.test.mjs` and use Node's built-in test runner. The suite transpiles `app/data/resources.ts` with the installed TypeScript compiler and imports the built Worker for response-level assertions. See [TESTING.md](./TESTING.md) before changing the test harness.

## Expected workflow

1. Make the smallest scoped source or data change.
2. Run or extend the most relevant automated test.
3. Run `npm run lint`.
4. Run `npx tsc --noEmit`.
5. Run `npm test`.
6. If source changed after the test build, run `npm run build`.
7. If UI, styling, copy length, interaction, or animation changed, inspect desktop and mobile behavior manually.
8. Recheck documentation when commands, architecture, resource schema, privacy posture, or deployment behavior changed.

The product should remain a curated map to external career resources, not become a job board or a general career-management platform.
