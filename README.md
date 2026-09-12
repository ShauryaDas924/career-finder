# Where to Look

![Where to Look social preview](public/og.png)

Where to Look is a curated field guide to internship and early-career resources for college students who are unsure where to begin. It organizes reliable starting points by broad career path, explains what each source is useful for, and sends students to the organization that maintains the opportunity.

It is deliberately **not a job board**. The application does not scrape, copy, host, or accept applications for job listings.

## What problem it solves

Career information is scattered across professional associations, government portals, university platforms, specialist job boards, and maintained internship trackers. Students often know what they want to explore but not which sources are worth checking. Where to Look turns that open-ended search into a small, understandable path:

1. Choose a broad career family.
2. Search by a major, role, or topic.
3. Learn what each resource is best for.
4. Continue to the original source and confirm details there.

The current directory contains **60 resources across 13 visible career families**:

- Technology
- Business
- Finance & Risk
- Healthcare
- Engineering
- Science & Research
- Supply Chain & Operations
- Marketing & Communications
- Design & Creative
- Government, Law & Policy
- Education
- Human Services & Nonprofit
- General / Any Major

Specific majors such as healthcare management, nursing, civil engineering, actuarial science, public relations, and hospitality remain discoverable through deep search terms instead of creating a top-level category for every major.

## Current features

- Five-step “Start Here” guidance for students beginning a search
- Four editorially selected featured resources
- Career-family cards with live resource counts
- Specialist-first text search across names, descriptions, formats, tags, “best for” guidance, and aliases
- Broad-category fallback when a query has no direct resource match
- Combinable category filters and search
- A 12-card starting set with an accessible expand/collapse control for all resources
- Empty-state and clear-filter recovery
- Safe external links with descriptive accessible names
- Responsive layouts tested down to 320 CSS pixels
- Keyboard focus management, semantic controls, status announcements, and a skip link
- Lightweight CSS illustration and motion with reduced-motion support
- Product-specific favicon and Open Graph/X social card
- Print rules that simplify navigation, scenery, explorer controls, and outbound resource actions

There are no accounts, authentication, favorites, browser storage, database, analytics integration, resume tools, application tracking, or backend content management.

## Visual identity

The interface is mostly modern, practical UX with a smaller layer of playful illustration. Cream paper surfaces, powder blue, cotton-candy pink, mint green, lavender, coral, and deep navy form the palette. Pinwheels, paths, hills, trees, targets, clouds, wind swirls, sparkles, and flowers reinforce exploration without carrying essential meaning.

See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for the tokens, component treatments, responsive rules, and motion system.

## Technology

- React 19 and Next.js 16 App Router
- TypeScript with strict checking
- Vinext and Vite for Cloudflare Worker-compatible builds
- Cloudflare Vite plugin and a small Worker entry point
- Hand-authored global CSS; no component library
- ESLint with Next.js Core Web Vitals and TypeScript rules
- Node’s built-in test runner plus TypeScript transpilation for dataset tests
- npm with a committed lockfile

The application is a single route. Its resource catalog is a checked-in TypeScript dataset, and all search/filter state is held in React memory for the current page session.

## Local setup

Prerequisite: Node.js **22.13.0 or newer**.

~~~bash
npm install
npm run dev
~~~

The development server prints the local URL. The default project URL is normally http://localhost:3000/.

## Quality commands

~~~bash
# Lint application and configuration files
npm run lint

# Strict TypeScript check
npx tsc --noEmit

# Production build followed by the four Node tests
npm test

# Production build only
npm run build

# Serve an existing production build
npm run start
~~~

The test command already runs the production build before the test file. Run a separate final build only when a workflow specifically requires it after another change.

## Project structure

~~~text
app/
  CareerGuide.tsx       Interactive single-page product and local UI components
  data/resources.ts     Category taxonomy, resource schema, and all resource records
  globals.css           Tokens, layout, components, CSS artwork, motion, and breakpoints
  layout.tsx            Metadata, social previews, viewport, and root document
  page.tsx              Home route
build/
  sites-vite-plugin.ts  Copies hosting metadata into the production bundle
public/
  favicon.png           Product favicon
  og.png                Social sharing image
tests/
  rendered-html.test.mjs  Dataset, search, healthcare, and rendered-HTML checks
worker/
  index.ts              Cloudflare Worker entry and image-optimization route
.openai/hosting.json    Sites project and optional logical storage bindings
vite.config.ts          Vinext, Sites, and Cloudflare build configuration
~~~

For every maintained file and when to edit it, see [FILE_MAP.md](FILE_MAP.md).

## Resource data

[app/data/resources.ts](app/data/resources.ts) is the single source of truth. It defines:

- the 13 category IDs and their labels, descriptions, icons, and fallback keywords;
- allowed resource IDs, formats, and tags;
- the Resource interface;
- all 60 resource records;
- the derived featured-resource list and category helper.

To add a resource:

1. Verify the destination is live, relevant, reputable, and useful to students.
2. Add a stable ID to resourceIds.
3. Add a Resource object with the same ID to resources.
4. Reuse existing categories, formats, and tags unless a genuinely new concept is required.
5. Add specific majors, job titles, and aliases to searchTerms.
6. Make only supportable claims; omit updateFrequency when cadence is not verified.
7. Run the quality commands and manually test the relevant searches.

The full curation rules, field reference, and copy-ready example are in [RESOURCE_GUIDE.md](RESOURCE_GUIDE.md).

## Accessibility and motion

The product uses semantic landmarks and headings, a visible-on-focus skip link, native buttons and forms, a named filter fieldset, a native dialog, visible focus treatment, pressed and expanded states, a polite result status, and descriptive new-tab labels. Decorative artwork is hidden from assistive technology.

The prefers-reduced-motion rules effectively disable animation, transitions, and smooth scrolling. The category-card interaction also checks the preference before scrolling.

See [ACCESSIBILITY.md](ACCESSIBILITY.md) for implementation notes and the manual QA checklist.

## Deployment

The verified build is **not a static export**. The production build produces a Vinext Cloudflare Worker bundle in dist/, including dist/server/index.js, dist/client/, and packaged Sites metadata. The repository is currently configured for OpenAI Sites and Cloudflare’s Worker runtime; no D1 or R2 binding is active.

Do not configure a static host to publish dist/client/ by itself: it has no standalone index.html and omits the server runtime. [DEPLOYMENT.md](DEPLOYMENT.md) documents the current Sites path and the work required before using Cloudflare Pages Git integration.

## Maintenance philosophy

- Preserve the resource-directory model; do not turn the product into a job board.
- Prefer a smaller set of useful, maintained sources over count inflation.
- Keep visible categories broad and make majors discoverable through aliases.
- Avoid backend infrastructure while checked-in data and client state remain sufficient.
- Treat accessibility, reduced motion, mobile layout, and external-link safety as acceptance criteria.
- Add features only when they solve a demonstrated student problem without obscuring the simple browsing flow.

## Documentation

- [AI_CONTEXT.md](AI_CONTEXT.md) — authoritative constraints and handoff context for future coding agents
- [ARCHITECTURE.md](ARCHITECTURE.md) — technical design and data flow
- [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) — practical development workflow
- [FEATURES.md](FEATURES.md) — implemented behavior and explicit non-goals
- [FILE_MAP.md](FILE_MAP.md) — repository navigation guide
- [RESOURCE_GUIDE.md](RESOURCE_GUIDE.md) — resource curation and schema reference
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — visual language, components, and motion
- [TESTING.md](TESTING.md) — automated coverage and manual QA
- [DEPLOYMENT.md](DEPLOYMENT.md) — verified build and deployment guidance
- [PRIVACY.md](PRIVACY.md) — current privacy posture
- [ACCESSIBILITY.md](ACCESSIBILITY.md) — accessibility decisions and checklist
- [CHANGELOG_STARTER.md](CHANGELOG_STARTER.md) — release-note template and baseline entry
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) — stack-specific failure diagnosis
