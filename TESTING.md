# Testing

Where to Look uses a small test system matched to its deliberately simple architecture. Automated checks protect the curated dataset, specialist-first search behavior, work-setup and compensation discovery, college-year guidance, healthcare coverage, and the server-rendered page. Manual review covers interaction and visual behavior that the current suite does not automate.

## Tools and locations

- `tests/rendered-html.test.mjs` contains all six current top-level tests.
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

- 13 category records and 64 resource records
- unique category IDs, resource IDs, and resource URLs
- alignment between the exported ID lists and data arrays
- the exact college-year ID order: `freshman`, `sophomore`, `junior`, `senior`, `new-grad`
- aligned college-year metadata and the expected visible labels
- HTTPS and parseable resource URLs
- required names, descriptions, best-for guidance, categories, and tags
- one to five tags per resource
- only known category IDs
- only known, nonrepeating college-year IDs in optional `recommendedForYears` arrays
- at least one resource in every category
- at least one recommended resource for every college year, intentional assignments on representative resources, and the rendered counts: 12 Freshmen, 13 Sophomores, 15 Juniors, 19 Seniors, and 16 New Grads
- the exact five intended featured resources

These are structural checks. They do not make network requests, so a passing test does not prove that an external destination is currently live or that its content still supports the description.

### Search behavior

The search test mirrors the client algorithm and verifies the required majors and career directions return at least one starting point. It also protects whole-token behavior for short aliases such as `AI`, `IT`, `PR`, and `HR`, plus specialist results for civil engineering.

Because the helper mirrors implementation code rather than importing it from `CareerGuide.tsx`, update both places together when the algorithm changes.

### Work-setup and compensation discovery

The focused-search test verifies that work-setting, nearby, and job-type phrases can find Handshake; `time zone` and `work from home` can find Himalayas; salary-filter and compensation phrases can find Simplify; `disclosed salary` and `no experience` can find HiringCafe; and minimum-salary phrases can find both HiringCafe and USAJOBS Early Careers. It protects the evidence boundary by requiring `highest salary` to return exactly HiringCafe, Himalayas, and USAJOBS—the three resources with verified salary-order controls.

### College-year guidance

The college-year test verifies that year guidance composes with the existing filters instead of bypassing them. It covers:

- all 64 resources when category, year, and query are unrestricted;
- a Technology + Sophomore result narrowed to the intended underclassmen resource;
- a Sophomore + `research` query retaining a strong research resource;
- category + year + query intersections for underclassmen technology and new-grad healthcare;
- exclusion when a resource is not recommended for the selected year.

`recommendedForYears` is editorial guidance about when a resource is especially useful, not an assertion of job-level eligibility. Automated tests can validate IDs and composition, but maintainers must manually confirm that every assignment remains reasonable and that visible copy continues to tell students to verify eligibility at the original source.

### Healthcare coverage

The healthcare test checks that the visible category exists, has a substantial specialist set, connects management-oriented resources to Business, includes the named administration, public-health, informatics, pharmacy, nursing, government, and biotech sources, and returns focused results for healthcare-management queries.

### Rendered HTML and metadata

The production-page test invokes the built Worker and verifies:

- an HTTP 200 HTML response
- `lang="en"`
- the current title, description, and host-derived Open Graph image URL
- important page headings and copy in server-rendered HTML
- the Browse by College Year heading and eligibility guidance
- all five year labels and the default pressed “All years” control
- the “Search your way” heading, both intent headings, verified salary-sort wording, and placement between year browsing and the library
- canonical Handshake, Himalayas, HiringCafe, and USAJOBS Early Careers links within that section
- the 64-resource expansion control
- absence of starter-preview content
- server-rendered external resource links
- `noopener noreferrer` on links that open a new tab

## What to run for each change

| Change | Minimum checks | Manual review |
| --- | --- | --- |
| Resource text, aliases, URL, tags, or category assignment | `npm run lint`, `npx tsc --noEmit`, `npm test` | Confirm the real destination and search result quality. |
| Category, college-year guidance, or featured-list change | Full validation suite | Category/year counts, card layout, filter labels, combined category + year + query results, result status, reset behavior, shortlist composition, and mobile filter scrolling. |
| CSS, artwork, or animation | `npm run lint`, `npx tsc --noEmit`, `npm run build` | Desktop, mobile, focus, contrast, overflow, reduced motion, and print if affected. |
| Search/filter or dialog behavior | Add/update a test where practical, then run the full suite | Keyboard, empty state, combined query/filter state, dialog open/close, polite status announcements. |
| Metadata, Worker, Vite, or dependency change | Full validation suite from a clean install when practical | Built response, favicon/social card, local production start, deployment artifact layout. |

## Manual QA checklist

### Desktop

- Load the page with no console-visible failure.
- Confirm the sticky navigation reaches each labeled section.
- Confirm the first 12 library resources appear by default and the expansion control reveals all 64.
- Confirm Browse by College Year shows Freshman, Sophomore, Junior, Senior, and New Grad with counts derived from the current dataset.
- Choose each year and confirm it applies the matching library filter, collapses an expanded list, scrolls to the library, and focuses search.
- Confirm “Search your way” appears after college-year browsing and before the library, with two balanced intent panels and four compact canonical resource links.
- Inspect the hero, category grid, cards, tips, footer, and dialog at a wide viewport.
- Confirm no text clips at large browser zoom.

### Mobile

- Inspect at 320 CSS pixels and at a representative modern phone width.
- Confirm the header navigation and both library filter rows scroll within their own rows.
- Confirm the Browse by College Year panel stacks by 1050px, its five controls use three columns by 820px and two by 580px, and labels, counts, and focus outlines do not clip.
- Confirm the search-intent panels stack by 820px, compact-card actions remain below their text, and each panel's paired tool cards stack by 580px, including at 390px and 320px.
- Confirm cards use one column and buttons remain usable.
- Confirm the illustration does not cover copy or controls.
- Confirm the document has no unintended horizontal page overflow.

### Search and filters

- Search a broad term such as `business`.
- Search a specialist term such as `healthcare management` and confirm the result stays focused instead of expanding to the entire Healthcare category.
- Search `AI`, `IT`, `PR`, and `HR` and check that unrelated substring matches do not appear.
- Search representative new aliases: `remote jobs`, `hybrid jobs`, `jobs near me`, `time zone`, `work from home`, `salary filter`, `disclosed salary`, `no experience`, `minimum salary`, and `highest salary`; confirm the intended reviewed destinations appear.
- Combine a query with a category filter.
- Combine a query with both a category and college-year filter; confirm every result satisfies all three dimensions.
- Confirm the live result status names the active category, year audience, and query, with the correct count.
- Confirm selecting All years removes only the year restriction and preserves the active category and query.
- Enter a query with no result, confirm the empty state, then clear it.
- Confirm Clear filters restores All paths, All years, an empty query, the first 12 resources, and search focus.
- Confirm the empty-state recovery action restores All paths, All years, an empty query, all resources, and search focus.

### Links and content

- Open a sample of general, specialist, government, association, and GitHub resources.
- Confirm each destination is live, accurately described, and useful to students.
- Recheck the four “Search your way” destination claims against [`SEARCH_TOOL_RESEARCH.md`](SEARCH_TOOL_RESEARCH.md), including Himalayas' remote-only scope and USAJOBS' federal-only salary sort.
- Confirm links open a new tab without giving the new page access to `window.opener`.
- Recheck any visible update-frequency claim against its source.

### Keyboard and accessibility

- Use the skip link to reach main content.
- Navigate header links, category cards, college-year cards, search, both filter groups, resource links, footer controls, and dialog buttons with the keyboard.
- Confirm all year controls work with Space and Enter, expose `aria-pressed`, and do not rely on color alone.
- Confirm each Browse by College Year card's accessible name includes its audience and current count.
- Confirm focus is always visible.
- Confirm category selection moves focus to the search field without disorienting scrolling.
- Open and dismiss the native suggestion dialog, including with Escape.
- Review the page at 200% zoom and with a screen reader when making structural changes.

### Reduced motion

- Enable the operating system or browser preference for reduced motion.
- Confirm pinwheels, clouds, swirls, target breathing, path hops, and tree sway do not continue visibly.
- Confirm navigation and career-path or college-year card selection do not smooth-scroll.
- Confirm no information depends on animation.

## Passing criteria

A change is ready only when relevant automated checks pass, external claims have been manually reverified when data changed, and UI changes have been inspected at the affected viewport and input modes. Deployment behavior is covered separately in [DEPLOYMENT.md](./DEPLOYMENT.md).
