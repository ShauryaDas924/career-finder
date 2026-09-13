# Testing

Where to Look uses a small test system matched to its deliberately simple architecture. Automated checks protect the curated dataset, specialist-first search behavior, healthcare coverage, and the server-rendered page. Manual review covers interaction and visual behavior that the current suite does not automate.

## Tools and locations

- `tests/rendered-html.test.mjs` contains all four current top-level tests.
- Node's built-in `node:test` runner executes the suite.
- `node:assert/strict` provides assertions.
- The TypeScript compiler API transpiles `app/data/resources.ts` in memory so the tests inspect the real exported data rather than a duplicate fixture.
- The production test imports `dist/server/index.js` and invokes the built Worker's `fetch` handler.
- ESLint uses the Next.js Core Web Vitals and TypeScript configurations from `eslint.config.mjs`.
- TypeScript runs with strict checking and no emit through `tsconfig.json`.

There is no browser end-to-end framework, visual-regression service, automated accessibility scanner, or live external-URL checker in the repository.

## Commands

Run the complete automated test command:

    npm test

This expands to:

    npm run build
    node --test tests/rendered-html.test.mjs

Run the other validation layers separately:

    npm run lint
    npx tsc --noEmit
    npm run build

Do not run the Node test file against stale output. Its rendered-page test imports `dist/server/index.js`, so build first when invoking it directly.

## Current automated coverage

### Resource integrity

The dataset test verifies:

- 13 category records and 61 resource records
- unique category IDs, resource IDs, and resource URLs
- alignment between the exported ID lists and data arrays
- HTTPS and parseable resource URLs
- required names, descriptions, best-for guidance, categories, and tags
- one to five tags per resource
- only known category IDs
- at least one resource in every category
- the exact five intended featured resources

These are structural checks. They do not make network requests, so a passing test does not prove that an external destination is currently live or that its content still supports the description.

### Search behavior

The search test mirrors the client algorithm and verifies the required majors and career directions return at least one starting point. It also protects whole-token behavior for short aliases such as `AI`, `IT`, `PR`, and `HR`, plus specialist results for civil engineering.

Because the helper mirrors implementation code rather than importing it from `CareerGuide.tsx`, update both places together when the algorithm changes.

### Healthcare coverage

The healthcare test checks that the visible category exists, has a substantial specialist set, connects management-oriented resources to Business, includes the named administration, public-health, informatics, pharmacy, nursing, government, and biotech sources, and returns focused results for healthcare-management queries.

### Rendered HTML and metadata

The production-page test invokes the built Worker and verifies:

- an HTTP 200 HTML response
- `lang="en"`
- the current title, description, and host-derived Open Graph image URL
- important page headings and copy in server-rendered HTML
- the 61-resource expansion control
- absence of starter-preview content
- server-rendered external resource links
- `noopener noreferrer` on links that open a new tab

## What to run for each change

| Change | Minimum checks | Manual review |
| --- | --- | --- |
| Resource text, aliases, URL, tags, or category assignment | `npm run lint`, `npx tsc --noEmit`, `npm test` | Confirm the real destination and search result quality. |
| Category or featured-list change | Full validation suite | Category counts, card layout, filter labels, shortlist composition, mobile filter scrolling. |
| CSS, artwork, or animation | `npm run lint`, `npx tsc --noEmit`, `npm run build` | Desktop, mobile, focus, contrast, overflow, reduced motion, and print if affected. |
| Search/filter or dialog behavior | Add/update a test where practical, then run the full suite | Keyboard, empty state, combined query/filter state, dialog open/close, polite status announcements. |
| Metadata, Worker, Vite, or dependency change | Full validation suite from a clean install when practical | Built response, favicon/social card, local production start, deployment artifact layout. |

## Manual QA checklist

### Desktop

- Load the page with no console-visible failure.
- Confirm the sticky navigation reaches each labeled section.
- Confirm the first 12 library resources appear by default and the expansion control reveals all 61.
- Inspect the hero, category grid, cards, tips, footer, and dialog at a wide viewport.
- Confirm no text clips at large browser zoom.

### Mobile

- Inspect at 320 CSS pixels and at a representative modern phone width.
- Confirm the header navigation and filter chips scroll within their own rows.
- Confirm cards use one column and buttons remain usable.
- Confirm the illustration does not cover copy or controls.
- Confirm the document has no unintended horizontal page overflow.

### Search and filters

- Search a broad term such as `business`.
- Search a specialist term such as `healthcare management` and confirm the result stays focused instead of expanding to the entire Healthcare category.
- Search `AI`, `IT`, `PR`, and `HR` and check that unrelated substring matches do not appear.
- Combine a query with a category filter.
- Enter a query with no result, confirm the empty state, then clear it.
- Confirm the live result count changes and the clear controls restore the default state.

### Links and content

- Open a sample of general, specialist, government, association, and GitHub resources.
- Confirm each destination is live, accurately described, and useful to students.
- Confirm links open a new tab without giving the new page access to `window.opener`.
- Recheck any visible update-frequency claim against its source.

### Keyboard and accessibility

- Use the skip link to reach main content.
- Navigate header links, category cards, search, filters, resource links, footer controls, and dialog buttons with the keyboard.
- Confirm focus is always visible.
- Confirm category selection moves focus to the search field without disorienting scrolling.
- Open and dismiss the native suggestion dialog, including with Escape.
- Review the page at 200% zoom and with a screen reader when making structural changes.

### Reduced motion

- Enable the operating system or browser preference for reduced motion.
- Confirm pinwheels, clouds, swirls, target breathing, path hops, and tree sway do not continue visibly.
- Confirm navigation and category selection do not smooth-scroll.
- Confirm no information depends on animation.

## Passing criteria

A change is ready only when relevant automated checks pass, external claims have been manually reverified when data changed, and UI changes have been inspected at the affected viewport and input modes. Deployment behavior is covered separately in [DEPLOYMENT.md](./DEPLOYMENT.md).
