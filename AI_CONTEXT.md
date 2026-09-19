# AI Context: Where to Look

This file is authoritative working context for AI coding agents. Read it before changing the product. Then consult the narrower guides linked throughout this document.

## Project purpose

Where to Look is a curated directory of external internship and early-career resources for college students who do not know where to begin searching. It helps a student:

1. choose a broad career path;
2. discover reputable places that serve that path;
3. understand what each source is best for; and
4. continue to the organization that maintains the opportunity.

The project solves a discovery problem, not an application-management problem. It reduces the need to know every association, government portal, specialist job board, or maintained internship list before beginning a search.

## Non-negotiable product rule

**This is a resource organizer, not a job board.**

- Keep the visible product focused on a small set of clear browsing, search, and guidance tasks.
- Link to original or specialist destinations; do not copy their listings into this site.
- Prefer editorial quality and useful coverage over a higher resource count.
- Protect the current broad-category/deep-search model. Do not create a top-level category for every major.
- Preserve the distinction between a curated starting point and a promise that an external listing is current or suitable.

## Do not add without explicit direction

- accounts or user profiles;
- authentication or authorization;
- databases or other durable application storage;
- job scraping, feeds, or copied job listings;
- resume builders or resume storage;
- application tracking;
- AI chatbots or recommendation engines;
- favorites or saved-resource systems;
- social features;
- employer portals;
- analytics or third-party tracking;
- unnecessary API routes, services, or backend infrastructure.

Treat any of these as a product-scope decision, not as routine polish.

## Current architecture

- **Framework:** Next.js App Router APIs rendered through Vinext, React, TypeScript, Vite, the Cloudflare Vite plugin, and a Cloudflare Worker entry point. Exact versions are pinned in `package.json` and `package-lock.json`.
- **Routing:** one application route, `/`, implemented by `app/page.tsx`. Header and footer links navigate to sections of the same page with fragment identifiers.
- **Rendering:** the initial page and metadata are server-rendered by the Vinext worker. `app/CareerGuide.tsx` is a client component and hydrates the interactive directory in the browser.
- **Metadata:** `app/layout.tsx` derives the metadata base and absolute social-image URL from the incoming request host and protocol.
- **Resource source:** `app/data/resources.ts` is the sole authored source for the category taxonomy and directory records. There is no runtime resource API.
- **Search and filters:** module-level normalized search indexes are derived from the resource and category arrays. React component state holds the query, active category, active college year, and default-list expansion state.
- **Persistence:** none. There is no `localStorage`, cookie, account, database, or server-side user-state behavior. Refreshing the page resets search and filter state.
- **Styling and artwork:** one handcrafted global stylesheet, `app/globals.css`, supplies layout, tokens, responsive rules, interaction states, CSS illustrations, and motion. The illustrated scenery is composed from decorative HTML elements and CSS; it is not an SVG component system.
- **Production model:** `npm run build` produces a Worker application in `dist/server` plus browser assets in `dist/client`. This is a stateless Worker deployment, **not** a Next.js static export. `.openai/hosting.json` identifies the Sites project and declares no D1 or R2 binding.

For the request-to-render and search data flows, see [ARCHITECTURE.md](ARCHITECTURE.md).

## Important files

| Path | Responsibility |
| --- | --- |
| `app/data/resources.ts` | Category and college-year IDs/metadata, resource IDs and records, TypeScript contracts, derived featured list, and lookup helpers. |
| `app/CareerGuide.tsx` | All visible page sections, reusable card/artwork helpers, search, category/year-filter behavior, dialog behavior, and client state. |
| `app/globals.css` | Design tokens, typography, layout, component styles, CSS artwork, responsive breakpoints, motion, reduced-motion handling, and print rules. |
| `app/layout.tsx` | Root HTML language, viewport settings, page metadata, favicon, and social-preview metadata. |
| `app/page.tsx` | The sole App Router page; renders `CareerGuide`. |
| `tests/rendered-html.test.mjs` | Resource-integrity, year-aware filtering, search-coverage, healthcare-specialist, and server-rendered HTML/metadata tests. |
| `worker/index.ts` | Cloudflare Worker entry point; routes image-optimization requests and delegates application requests to Vinext. |
| `vite.config.ts` | Vinext, Sites, and Cloudflare build integration plus local binding declarations. |
| `build/sites-vite-plugin.ts` | Copies Sites hosting metadata, and a migration directory if one ever exists, into the build artifact. |
| `.openai/hosting.json` | Sites project identifier and logical storage declarations; D1 and R2 are currently `null`. |
| `package.json` | Supported Node version, npm scripts, and dependencies. |

See [FILE_MAP.md](FILE_MAP.md) for the complete navigation map.

## Resource model

`app/data/resources.ts` uses readonly TypeScript contracts and `as const satisfies` so IDs, tags, formats, and categories remain constrained at authoring time.

### `Resource`

| Field | Required | Meaning |
| --- | --- | --- |
| `id` | Yes | Stable slug from the `resourceIds` tuple. The tuple and record order must remain aligned. |
| `name` | Yes | Human-readable destination name. |
| `url` | Yes | Direct HTTPS destination. Resource links open this URL; the app does not proxy it. |
| `description` | Yes | Concise, factual summary of the destination. |
| `categories` | Yes | One or more existing broad `CategoryId` values. |
| `bestFor` | Yes | Student-oriented use cases displayed on the card and included in search. |
| `tags` | Yes | Controlled `ResourceTag` values displayed as compact labels and included in search. Cards display at most four tags, or three in the featured section. |
| `format` | Yes | Controlled `ResourceFormat` value used both as visible context and to derive the compact format mark. |
| `featured` | Yes | Whether the resource appears in the separate five-card starting shortlist. |
| `recommendedForYears` | No | Controlled college-year IDs for which the resource is an especially useful starting point. This is editorial resource-level guidance, not job-level eligibility. |
| `searchTerms` | No | Specific majors, roles, and common aliases included in search without adding visible card clutter. |
| `updateFrequency` | No | A visible cadence claim. Include only when it has been verified and is useful. |
| `notes` | No | Important caveat or eligibility/context note displayed at the bottom of the card. |

The current data contains **62 resources**, **13 broad categories**, and five featured resources: ApplyGuy, Handshake, InternList, Jobright.ai, and Simplify. The Technology category includes the non-featured **Underclassmen Opportunities** collection, recommended for freshmen and sophomores. Tests intentionally protect those totals, the featured IDs, and key year assignments; update the assertions only when an editorially approved data change makes them obsolete.

### College-year metadata

The controlled college-year values are:

| ID | Visible label |
| --- | --- |
| `freshman` | Freshman |
| `sophomore` | Sophomore |
| `junior` | Junior |
| `senior` | Senior |
| `new-grad` | New Grad |

`recommendedForYears` is optional. Do not tag every resource merely to populate a filter, and never interpret the field as a guarantee that an individual listing accepts a particular year. Verify each assignment against the destination's purpose and keep eligibility caveats with the original opportunity.

### Category metadata

Each category has a stable `id`, full `label`, compact `shortLabel`, visible `description`, controlled `icon` name, and search-only `keywords`. The 13 current career families are:

1. Technology
2. Business
3. Finance & Risk
4. Healthcare
5. Engineering
6. Science & Research
7. Supply Chain & Operations
8. Marketing & Communications
9. Design & Creative
10. Government, Law & Policy
11. Education
12. Human Services & Nonprofit
13. General / Any Major

Use broad visible categories plus deep `searchTerms` and category `keywords` to support specific majors. See [RESOURCE_GUIDE.md](RESOURCE_GUIDE.md) before editing this file.

## Search behavior that must remain intentional

1. The query is lowercased, punctuation is collapsed to spaces, and the characters `+`, `#`, and `/` are retained.
2. A resource index combines `name`, `description`, `format`, `tags`, `bestFor`, and optional `searchTerms`.
3. The active category and optional college year first scope the resource set; resources without a matching `recommendedForYears` value are excluded from an active year scope.
4. Text search then runs within that combined scope, so category, year, and query can work together without changing search semantics.
5. Resource matches are tried first. Most queries use normalized substring matching; one- or two-character alphanumeric queries such as `AI`, `IT`, `PR`, and `HR` require a whole-token match to avoid accidental substring results.
6. Category labels and keywords are used only as a fallback when no resource directly matches the query within the current category/year scope. This keeps specialist searches focused instead of expanding them to an entire career family.
7. In the unfiltered default view, the library shows the first 12 resources and offers an explicit show-all control. A query, category, or year filter shows every match.

Search behavior is duplicated deliberately in the test helper so expected query coverage can be verified independently of browser interaction. If the production algorithm changes, update its tests in the same change.

## Visual identity

The identity pairs dependable editorial UX with a small illustrated world:

- cotton-candy pink;
- powder blue;
- light and mint greens;
- cream paper surfaces;
- lavender accents;
- deep navy outlines and text;
- coral and yellow emphasis;
- pinwheels, wind swirls, trees, targets, rolling hills, paths, small flowers, and spark-like marks.

The working design ratio is approximately **75% excellent modern UX and 25% playful illustrated world**. The illustration supports orientation and warmth; it must never make search, filters, resource evaluation, or reading harder. Preserve the calm, handmade field-guide character rather than replacing it with generic purple SaaS styling, heavy glass effects, or decorative clutter.

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for token and component details.

## Animation rules

- Keep motion subtle, lightweight, and decorative or meaningfully responsive.
- Prefer CSS transforms and opacity; avoid heavy runtime animation libraries without a demonstrated need.
- Current ambient motion includes slow pinwheel rotation, cloud drift, wind drift, target breathing, path-dot hops, and tree sway. Short transitions communicate hover and focus response.
- Career-path and college-year card navigation checks `prefers-reduced-motion` before requesting smooth scrolling.
- The stylesheet's reduced-motion media query removes smooth scrolling and reduces all animation and transition durations to effectively zero.
- Never make animation necessary to understand content or operate a control.

## Accessibility requirements

Preserve and extend the existing baseline:

- semantic `header`, `nav`, `main`, `section`, `article`, `footer`, headings, lists, forms, and native `dialog`;
- one clear `h1` and a logical heading structure;
- a keyboard-visible skip link and visible `:focus-visible` outline;
- native buttons and links rather than clickable generic elements;
- associated labels and fieldset/legend semantics for search and filters;
- `aria-pressed` on category and college-year filters and a polite, atomic live result count;
- descriptive external-link names that announce opening a new tab;
- decorative artwork hidden from assistive technology;
- usable touch targets and layouts at desktop, tablet, and narrow mobile widths;
- no horizontal page overflow;
- full reduced-motion support.

Do not use color or motion as the only way to communicate state. Follow the manual checks in [ACCESSIBILITY.md](ACCESSIBILITY.md) after interaction or visual changes.

## Testing expectations

The repository uses Node's built-in test runner, `node:assert/strict`, and the TypeScript compiler API. `npm test` first creates a production build, then runs `tests/rendered-html.test.mjs` against the built Worker and the authored dataset.

Current automated coverage verifies:

- 13 categories and 62 resources;
- all five college-year IDs/labels, valid non-duplicated `recommendedForYears` values, and key editorial assignments;
- unique category IDs, resource IDs, and resource URLs;
- alignment of ID tuples with authored arrays;
- HTTPS URL shape, required content, valid categories, tag presence, and the five-tag maximum;
- at least one resource in every category;
- the exact featured-resource set;
- category + year, query + year, and category + query + year filtering, including “All years” behavior;
- search coverage for required majors and career directions, including short aliases;
- specialist healthcare and nursing search behavior;
- server-rendered page content, metadata, language, social image URL, and safe new-tab link attributes;
- absence of the removed starter/loading preview.

Automated checks do **not** prove that external destinations are live or that their claims remain current. Verify those editorial facts manually. For a normal completed change, run the real repository commands:

```bash
npm run lint
npx tsc --noEmit
npm test
```

`npm test` already runs `npm run build`; running `npm run build` separately is still appropriate when diagnosing build output. There is no `typecheck` npm script. See [TESTING.md](TESTING.md).

## Deployment expectations

- Build and validate the exact source revision intended for release.
- Keep the Vinext, Sites, and Cloudflare Vite plugin chain intact unless a deployment migration is explicitly requested.
- Treat `dist/` as generated output. Do not hand-edit it.
- Do not describe this project as a static export or assume an `out/` directory. The current artifact is `dist/server/index.js` with `dist/client` assets.
- Keep application secrets out of the repository. No application environment variables are currently required.
- Keep `.openai/hosting.json` synchronized with Sites. Its current D1 and R2 values are `null`; do not add storage merely because the configuration supports it.
- The presence of a Sites project ID is configuration, not proof that the latest local source is deployed. Follow [DEPLOYMENT.md](DEPLOYMENT.md) for the maintained release procedure.

## Safe change principles

1. Inspect the current code and the relevant guide before editing.
2. Keep `app/data/resources.ts` the single source of truth for directory content.
3. Prefer extending the existing arrays, unions, helper components, and CSS tokens over adding new layers.
4. Preserve stable IDs. Changing an ID is a data migration even though no database exists because tests and future links may depend on it.
5. Make resource descriptions and cadence claims factual. A valid URL is not sufficient evidence of usefulness.
6. Keep category breadth stable. Add search aliases before proposing a new visible career family.
7. Preserve server rendering, client hydration, metadata generation, external-link safety, focus behavior, and reduced motion.
8. Keep derived counts derived from the dataset; do not hard-code them in page copy.
9. Add or update tests when changing resource totals, protected coverage, featured status, or search behavior.
10. Avoid unrelated refactors in editorial or visual changes.

## Known non-goals and boundaries

- The application does not host, rank, scrape, or accept job listings.
- It does not apply to jobs or verify student eligibility; college-year filtering only organizes curated resource destinations that may be useful for that year.
- It does not personalize results or persist a search.
- It does not provide accounts, alerts, favorites, or application tracking.
- It does not currently collect resource suggestions. The “Suggest a resource” control opens an informational dialog stating that no contact method is configured.
- It does not guarantee external availability; maintainers must periodically re-verify destinations.
- It is intentionally one route and does not require a backend or database for its present, editor-maintained dataset.

For product boundaries, also read [FEATURES.md](FEATURES.md), [PRIVACY.md](PRIVACY.md), and [RESOURCE_GUIDE.md](RESOURCE_GUIDE.md).
