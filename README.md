# Where to Look

Where to Look is a friendly, curated field guide to internship and early-career resources for college students. It is intentionally **not a job board**: students choose a path, search or filter 60 verified external resources across 13 broad career categories, learn what each source is best for, and continue to the source that maintains the opportunities.

The product is a responsive single-page React experience built with [vinext](https://github.com/cloudflare/vinext) for OpenAI Sites and Cloudflare Workers. It has no accounts, authentication, database, scraping, or copied job listings.

## Local development

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev
```

Quality checks:

```bash
npm run lint
npx tsc --noEmit
npm test
npm run build
```

`npm test` performs a production build before running the server-rendered product and resource-coverage tests. Use `npm run start` to serve a completed build locally.

## Resource data

[`app/data/resources.ts`](app/data/resources.ts) is the single source of truth for the directory. It contains the category taxonomy, resource records, search aliases, featured-resource selection, and their TypeScript contracts. The UI derives its counts, filters, featured list, and search index from this file.

To add or revise a resource:

1. Add its stable slug to `resourceIds` and its record to `resources`.
2. Use existing `CategoryId`, `ResourceFormat`, and `ResourceTag` values, extending those unions only when a genuinely new classification is needed.
3. Add specific majors, roles, and common aliases to `searchTerms`; these improve discovery without cluttering the visible card.
4. Keep `description`, `bestFor`, tags, and optional notes factual and concise. Set `featured` deliberately.
5. Run the full quality checks. Coverage tests guard resource totals, category representation, duplicate IDs/URLs, URL shape, and required searchable content.

## URL and editorial principles

- Link to a live, canonical page that still serves the stated audience; prefer the most direct useful destination.
- Verify every new or changed URL and periodically recheck the collection. A successful response alone is not enough—the destination must still be relevant.
- Do not invent update cadence, job totals, availability, or product features. Omit `updateFrequency` unless the claim was verified.
- Use neutral wording where access, eligibility, school participation, or listing availability can vary.
- Keep opportunities on the originating resource. Students are encouraged to confirm details and apply on the employer's official careers site whenever possible.
- External actions open in a new tab with `noopener noreferrer` and an accessible new-tab label.

## Accessibility and motion

The interface uses semantic landmarks and headings, a skip link, keyboard-operable controls, visible focus states, pressed-state filter announcements, a polite live result count, descriptive link labels, and decorative artwork hidden from assistive technology. Layout, contrast, and touch targets are designed for desktop and mobile use.

Pinwheels, clouds, paths, and other motion are decorative rather than required for comprehension. The `prefers-reduced-motion` rules remove animation and smooth scrolling for visitors who request less motion.

## Deployment

`npm run build` produces the Cloudflare Worker-compatible vinext output used by Sites, including `dist/server/index.js`. The Sites Vite plugin remains configured in `vite.config.ts`; this project does not use `wrangler.jsonc`.

Deploy only a source revision that has passed lint, type checking, tests, and the production build. Sites records its `project_id` in `.openai/hosting.json`; keep that file limited to the project ID and optional logical `d1`/`r2` bindings. Both bindings remain `null` because this directory is intentionally stateless. Manage any future hosted runtime values through Sites rather than committing secrets.

`public/og.png` is the product-specific social card. `app/layout.tsx` builds absolute Open Graph and X image URLs from the incoming request host, so previews work on both local and deployed origins.
