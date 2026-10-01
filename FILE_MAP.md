# Repository File Map

Where to Look is compact by design. Product source lives in `app/`, deployment integration is split between `vite.config.ts`, `worker/`, `build/`, and `.openai/`, and all automated tests currently live in one file.

## Quick tree

```text
.
├── .openai/
│   └── hosting.json
├── app/
│   ├── data/
│   │   └── resources.ts
│   ├── CareerGuide.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── build/
│   └── sites-vite-plugin.ts
├── docs/
│   └── RESOURCE_SAFETY_AUDIT.md
├── public/
│   ├── favicon.png
│   └── og.png
├── tests/
│   └── rendered-html.test.mjs
├── worker/
│   └── index.ts
├── SEARCH_TOOL_RESEARCH.md
├── package.json
├── package-lock.json
├── vite.config.ts
└── supporting configuration and documentation
```

## Product source

| Path | Purpose | Edit when… |
| --- | --- | --- |
| `app/data/resources.ts` | Authoritative category, college-year, and resource dataset. Defines all controlled IDs and metadata, resource records and optional `recommendedForYears` guidance, search aliases—including work-setup and compensation discovery terms—the derived featured list, and lookup helpers. | Adding, removing, or correcting a resource; changing aliases, year guidance, featured status, or an approved taxonomy value. Read [RESOURCE_GUIDE.md](RESOURCE_GUIDE.md) first. |
| `app/CareerGuide.tsx` | Sole interactive page component. Contains local artwork/card helpers, search-index construction, category/year filter state, all visible sections, the typed existing-resource mapping for “Search your way,” and suggestion-dialog behavior. | Changing page content, focused search-tool selection/copy, search/filter logic, resource-card presentation, section structure, or client interaction. |
| `app/globals.css` | Global design system and all product styles: tokens, typography, components, CSS artwork, animations, breakpoints, reduced-motion behavior, and print rules. | Changing colors, spacing, layout, component appearance, artwork, motion, responsive behavior, or print output. Read [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md). |
| `app/layout.tsx` | Root document shell and request-aware metadata. Sets language, viewport, theme color, favicon, Open Graph data, and X card data. | Changing site-wide metadata, icon references, social-preview copy/image, language, or viewport behavior. |
| `app/page.tsx` | App Router entry for `/`; renders `CareerGuide`. | Changing the route's top-level composition. Most product edits belong in `CareerGuide.tsx` instead. |

## Runtime and build integration

| Path | Purpose | Edit when… |
| --- | --- | --- |
| `worker/index.ts` | Cloudflare Worker entry point. Handles Vinext image optimization at `/_vinext/image` and delegates all other requests to the Vinext App Router handler. | The Worker request pipeline or image-optimization integration must change. Normal page work does not belong here. |
| `vite.config.ts` | Vite configuration for Vinext, the local Sites plugin, and the Cloudflare Vite plugin. Derives optional local D1/R2 bindings from hosting configuration and keeps local Wrangler state project-scoped. | Changing build/runtime integration, dev watcher behavior, or an explicitly approved storage binding. |
| `build/sites-vite-plugin.ts` | Build-only Vite plugin that copies `.openai/hosting.json` into `dist/.openai` and would copy root Drizzle migrations if a `drizzle/` directory existed. | The Sites artifact packaging contract changes. Do not add a migration directory without an approved persistence feature. |
| `.openai/hosting.json` | OpenAI Sites project identifier and logical resource declarations. Both `d1` and `r2` are currently `null`. | Sites changes the project association or an explicitly approved D1/R2 capability is added. Do not place secrets here. |
| `next.config.ts` | Presently empty typed Next configuration object. | A verified Next/Vinext configuration need arises. Do not add static-export settings casually; the current build is Worker-based. |
| `postcss.config.mjs` | Registers the Tailwind PostCSS plugin. The current product stylesheet is handwritten and contains no Tailwind directives. | The CSS processing pipeline changes. Product styling belongs in `app/globals.css`. |

## Public assets

| Path | Purpose | Edit when… |
| --- | --- | --- |
| `public/favicon.png` | 256×256 site icon referenced by `app/layout.tsx`. | Replacing the product favicon; keep metadata dimensions/type aligned if the asset format changes. |
| `public/og.png` | 1730×909 product-specific social preview referenced in Open Graph and X metadata. | Updating the site's settled visual identity or social-preview message. Verify text and update declared dimensions if needed. |

## Tests and quality configuration

| Path | Purpose | Edit when… |
| --- | --- | --- |
| `tests/rendered-html.test.mjs` | Six-test Node suite. Transpiles the TypeScript data module for direct inspection, independently models category/year-scoped search, invokes the built Worker, and verifies resource and year-metadata integrity, combined-filter behavior, required and focused search coverage, healthcare behavior, metadata, rendered content and safety guidance, focused-section placement/links, and external-link safety. | Resource totals/coverage or year guidance intentionally change, search/filter behavior changes, focused search-tool claims or public safety copy change, a regression is fixed, or new critical behavior needs coverage. |
| `eslint.config.mjs` | ESLint flat configuration using Next core-web-vitals and TypeScript rules, with generated/build paths ignored. | Changing lint policy or adding a generated path that should not be linted. |
| `tsconfig.json` | Strict TypeScript configuration, DOM/ES libraries, bundler module resolution, Next plugin, and `@/*` path alias. | Changing compiler scope or module/type policy. |
| `package.json` | Node engine requirement (`>=22.13.0`), npm scripts, application dependencies, and build/test tooling. | Adding/removing a dependency, changing a script, or changing the supported Node runtime. |
| `package-lock.json` | Exact npm dependency graph. | Whenever `package.json` dependencies change; update it with npm rather than by hand. |

## General repository configuration

| Path | Purpose | Edit when… |
| --- | --- | --- |
| `.gitignore` | Excludes dependencies, environment files, generated build/runtime state, logs, and local system files. | A new generated or machine-local artifact must be excluded. Do not unignore secrets. |

## Documentation entry points

| Path | Purpose |
| --- | --- |
| `README.md` | Public project overview, setup, common commands, and concise maintenance orientation. |
| `AI_CONTEXT.md` | Non-negotiable product boundaries and authoritative implementation context for future coding agents. |
| `ARCHITECTURE.md` | Rendering, build, component, state, search, data, and deployment architecture. |
| `DEVELOPMENT_GUIDE.md` | Practical local workflow and common change procedures. |
| `FEATURES.md` | Current product capabilities and explicit non-goals. |
| `RESOURCE_GUIDE.md` | Resource schema, curation standards, taxonomy philosophy, and add/update workflow. |
| `SEARCH_TOOL_RESEARCH.md` | Dated first-party evidence, serious-candidate and hidden-gem decisions, salary-filter/sort distinctions, access/currentness boundaries, and claim limits for work-setup and compensation guidance. |
| `docs/RESOURCE_SAFETY_AUDIT.md` | Dated catalog-wide evidence for operator identity, canonical URLs, maintenance, student relevance, moderation/reporting, risk notes, and keep/caution/remove/replace decisions. It audits destinations, not every external listing. |
| `DESIGN_SYSTEM.md` | Visual tokens, typography, components, illustration, motion, and responsive principles. |
| `TESTING.md` | Automated coverage, commands, and manual QA expectations. |
| `DEPLOYMENT.md` | Build artifact and maintained release procedure for the configured hosting model. |
| `PRIVACY.md` | Actual privacy posture and third-party-link boundary. |
| `ACCESSIBILITY.md` | Accessibility implementation and manual audit checklist. |
| `CHANGELOG_STARTER.md` | Starting release history and format for future entries. |
| `TROUBLESHOOTING.md` | Stack-specific diagnosis for common local, data, UI, and deployment issues. |
| `FILE_MAP.md` | This navigation map. |

## Generated and machine-local paths

These paths may exist after installation, development, or a build. They are not authoritative source and should not be edited manually.

| Path | Generated by | Notes |
| --- | --- | --- |
| `node_modules/` | `npm install` | Installed dependencies; recreate from the lockfile. |
| `dist/` | `npm run build` | Production Worker and client assets, including a packaged copy of hosting metadata. Ignored by source control. |
| `.wrangler/` | Cloudflare tooling | Local logs, registry, and runtime state. Ignored by source control. |
| `.vinext/` | Vinext | Local framework output/state. Ignored by source control. |
| `.next/` | Compatible Next tooling, when produced | Generated framework output. Ignored by source control. |
| `next-env.d.ts` | Next-compatible tooling, when produced | Generated type declarations. Ignored by source control in this repository. |
| `tsconfig.tsbuildinfo` | TypeScript incremental checking | Compiler cache. Ignored by source control. |

There is no `src/` directory, API directory, component library directory, database schema, migration directory, or application environment file in the current repository. Do not invent one unless an approved requirement makes it necessary.
