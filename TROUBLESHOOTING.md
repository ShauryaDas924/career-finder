# Troubleshooting

Start with the exact failing command and its first actionable error. Avoid changing architecture to work around a local setup problem.

## Installation

### The install reports an unsupported Node version

`package.json` requires Node.js 22.13.0 or newer.

    node --version

Switch to a supported runtime, then run:

    npm install

This repository uses npm and `package-lock.json`; do not substitute another package manager unless the project deliberately changes package managers and regenerates its lockfile.

### `vinext`, `vite`, `eslint`, or `tsc` cannot be found

These tools are local dependencies, not required global installations. Install the repository dependencies and invoke them through package scripts or `npx`:

    npm install
    npm run dev
    npx tsc --noEmit

### `npm ci` rejects the lockfile

`npm ci` requires `package.json` and `package-lock.json` to agree. If a dependency was intentionally changed, run `npm install` to update the lockfile, inspect the resulting dependency changes, and rerun the full validation suite. Do not hand-edit resolved package entries.

## Local development

### The development server does not start

1. Confirm the supported Node version.
2. Run `npm install`.
3. Run `npm run dev` from the repository root.
4. Read the first error in the terminal and, when relevant, `.wrangler/wrangler.log`.
5. If the printed port is already in use, stop the process that owns it or use the alternate URL the server reports.

The Vite configuration enables polling only when `CODEX_SANDBOX=seatbelt`, because FSEvents is unavailable in that environment. Do not force polling for every developer unless file watching is actually broken.

### Changes do not appear

Make sure the running command is `npm run dev`, not `npm run start`. The latter serves the built output and requires a rebuild to reflect source changes.

If hot reload reports an error, fix that source error first. Then reload the exact URL printed by the development server.

### `npm run start` fails

Build before starting production output:

    npm run build
    npm run start

The start command serves the vinext build; it is not a static-file preview of `dist/client/`.

## Build and type checking

### TypeScript reports an unknown resource ID, category, tag, or format

The dataset uses literal unions:

- `resourceIds` defines valid `ResourceId` values.
- `categoryIds` defines valid `CategoryId` values.
- `ResourceTag` and `ResourceFormat` define their allowed strings.

Keep the relevant union/list and the resource object in sync. Do not silence an error with a broad cast when the intended fix is to add or correct a literal.

Run:

    npx tsc --noEmit

### The build fails in `worker/index.ts` or the Cloudflare plugin

Confirm dependencies match the lockfile and that `vite.config.ts`, `worker/index.ts`, and `.openai/hosting.json` still agree. The current configuration expects:

- Worker entry `worker/index.ts`
- `nodejs_compat`
- an `ASSETS` binding
- an `IMAGES` binding when the `/_vinext/image` path is used
- no D1 or R2 application binding

Do not replace the Worker with a static export as a build workaround.

### A route-classification message appears during build

`app/layout.tsx` reads request headers to construct absolute metadata URLs. That is server behavior and is one reason the application is not a plain static export. Judge the build by its exit status and presence of `dist/server/index.js`; do not point a static host at `dist/client/` to suppress a server-related message.

### The build prints a Node `DEP0205` warning

The current vinext dependency stack can emit a deprecation warning for `module.register()` under the supported Node runtime. When the command still ends with `Build complete` and a zero exit status, this warning is non-blocking. Do not patch installed dependencies or suppress all Node warnings; reassess it when deliberately upgrading vinext, Vite, or Node.

### ESLint reports errors

Run the project command:

    npm run lint

Fix the source rather than changing the rule set for a one-off violation. The configuration intentionally includes Next.js Core Web Vitals and TypeScript rules.

## Tests

### The rendered-page test cannot import `dist/server/index.js`

The test exercises production output. Use:

    npm test

That command builds before running the Node test suite. If invoking the runner directly, run `npm run build` first.

### The expected resource or category count is wrong

The counts of 61 resources and 13 categories are explicit integrity assertions. If the dataset changed intentionally:

1. Verify `resourceIds` and `resources` still align.
2. Verify every category has at least one resource.
3. Update the count assertion.
4. Update “Show all 61 resources” rendered-copy assertions when the UI's derived total changes.
5. Run the complete suite.

Do not update an assertion merely to hide an accidental duplicate or deletion.

### A URL test passes but the destination is dead

The automated suite checks HTTPS syntax, URL parsing, and uniqueness. It deliberately performs no network health check. Open the destination manually and verify the page, organization, audience, claims, and usefulness before keeping it.

## Resource and search behavior

### A newly added resource is not visible in the initial grid

The default library intentionally shows only the first 12 resources. Use “Show all 61 resources,” search for the item, or apply its category filter. If it should be a quick-start item, changing dataset order affects the product's default shortlist and should be intentional.

The separate featured section is controlled by `featured: true`, not by dataset position.

### Search does not find a resource

Resource-level search indexes:

- name
- description
- format
- tags
- `bestFor`
- `searchTerms`

Add the missing major, role, abbreviation, or synonym to that resource's `searchTerms`. Search text is lowercased and punctuation other than `+`, `#`, and `/` becomes spaces.

Category labels and keywords are fallback behavior only. If at least one resource matches directly, the entire matching category is not appended. This keeps specialist queries focused.

### A short abbreviation matches incorrectly

One- and two-character alphanumeric queries use whole-token matching. Make sure aliases such as `AI`, `IT`, `PR`, and `HR` appear as their own tokens in tags or `searchTerms`. If changing this rule, update both `app/CareerGuide.tsx` and the mirrored search helper in `tests/rendered-html.test.mjs`.

### A category count looks stale

Category-card counts are derived during render from resource category assignments; there is no cache or saved count to clear. Inspect the resource's `categories` array and the category ID spelling. A TypeScript error usually identifies an invalid ID.

### Favorites or saved searches disappear

Favorites and saved searches are not implemented. Search and filter state exists only in memory and resets on reload. Do not debug browser storage or add persistence unless that feature is explicitly requested.

## Interaction, accessibility, and layout

### The suggestion button does not send anything

That is current intended behavior. It opens an informational native `<dialog>` and states that no contact method is configured. Do not add a fake email address or nonfunctional form endpoint.

### Focus is hard to see or keyboard order feels wrong

The global `:focus-visible` rule supplies the primary outline, and the skip link becomes visible on focus. Check whether a new component overrides `outline`, uses a non-semantic clickable element, or places decorative markup in the tab order.

Test the full sequence from the header through the dialog at 200% zoom. Keep decorative illustration elements `aria-hidden`.

### Motion continues when reduced motion is enabled

The reduced-motion media query at the end of `app/globals.css` collapses animation and transition durations and disables smooth scrolling. Category-card navigation also reads `window.matchMedia("(prefers-reduced-motion: reduce)")`.

Check new animation declarations against that media query. If code requests smooth scrolling directly, add the same preference check used by `chooseCategory`.

### The page overflows horizontally on mobile

Test at 320 CSS pixels. Inspect the specific element extending the layout—usually a fixed-width child, an absolutely positioned illustration, a nonwrapping label, or a grid minimum—rather than adding another broad overflow mask. Existing responsive rules switch resource/category grids to one column and make the header navigation and filter rows intentionally scroll within themselves.

### Print output omits controls or links

The stylesheet intentionally hides the site header, prominent hero scenery, explorer panel, footer, `.button` controls, and outbound resource actions in print. Category cards and some plain controls are not covered by those selectors. Review the `@media print` block before treating this as a browser bug.

## Metadata and external links

### Social metadata uses the wrong host

`app/layout.tsx` derives `metadataBase` from `x-forwarded-host`, `host`, and `x-forwarded-proto`. Verify the production proxy supplies accurate forwarded headers. Do not hard-code a temporary preview hostname.

### A resource opens in the same tab or exposes `window.opener`

Every resource link should include:

    target="_blank"
    rel="noopener noreferrer"

The rendered-HTML test checks these attributes for server-rendered new-tab links.

## Deployment

### A Cloudflare Pages build asks for an output directory

Do not enter `out`, `dist`, or `dist/client` for the current project. There is no static export or verified Pages artifact, and `dist/client/` has no `index.html`. Use the OpenAI Sites flow documented in [DEPLOYMENT.md](./DEPLOYMENT.md), or undertake an explicit Pages migration.

### The Sites project ID exists but no live URL is known

`.openai/hosting.json` associates the source with a Sites project; it is not evidence of a successful deployment. Publish a validated source version through Sites, wait for a succeeded deployment status, and use the URL returned by that deployment.

### A deployment serves assets but not the page

This usually indicates that only browser assets were uploaded. The deployment requires `dist/server/index.js`, `dist/client/`, and `dist/.openai/hosting.json`. Rebuild and package the complete Worker-compatible artifact.

### A custom domain does not validate

Use only the DNS records supplied by the active hosting provider. Check for conflicting records, verify whether the apex or `www` is canonical, wait for certificate issuance, and test HTTPS before enabling a redirect. Domain and certificate state are not stored in this repository.

## Still blocked?

Record:

- the exact command
- Node and npm versions
- the first relevant error
- whether a fresh `npm run build` succeeds
- the affected resource ID or UI state
- the deployment target and artifact paths involved

Then compare the behavior with [ARCHITECTURE.md](./ARCHITECTURE.md), [TESTING.md](./TESTING.md), and [DEPLOYMENT.md](./DEPLOYMENT.md) before expanding project scope.
