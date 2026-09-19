# Deployment

## Current deployment model

Where to Look is built for OpenAI Sites and a Cloudflare Worker-compatible runtime. It is not a static-export project.

| Item | Verified repository value |
| --- | --- |
| Build-time Node version | 22.13.0 or newer |
| Package manager | npm with `package-lock.json` |
| Reproducible install | `npm ci` |
| Build command | `npm run build` |
| Artifact root | `dist/` |
| Worker entry | `dist/server/index.js` |
| Browser assets | `dist/client/` |
| Packaged Sites metadata | `dist/.openai/hosting.json` |
| Static HTML export | None |
| Application environment variables | None currently required |
| D1 / R2 application bindings | Both are `null` |

The build uses:

- vinext and Vite in `vite.config.ts`
- the Cloudflare Vite plugin with `nodejs_compat`
- `worker/index.ts` for app routing and the `/_vinext/image` optimization endpoint
- `build/sites-vite-plugin.ts` to copy Sites metadata, and migrations if ever present, into the build

`dist/client/` does not contain an `index.html`. The server Worker is required for routing, React Server Components, server-rendered HTML, and request-host-derived metadata. Do not deploy `dist/client/` by itself.

Generated `dist/`, `.wrangler/`, and `.vinext/` directories are ignored. Build them from the exact source being released rather than editing or preserving them as source.

## Predeployment validation

Use a supported Node runtime and install from the lockfile:

    npm ci

Run:

    npm run lint
    npx tsc --noEmit
    npm test

`npm test` performs a production build before the test suite. If source changes afterward, rebuild:

    npm run build

Before publishing, confirm these generated paths exist:

    dist/server/index.js
    dist/client/
    dist/.openai/hosting.json

Also confirm the homepage renders through the Worker rather than by opening files from `dist/client/` directly.

## OpenAI Sites publishing

`.openai/hosting.json` contains an existing Sites project identifier and no storage bindings. Its presence means this repository is associated with a Sites project; it does not by itself prove that a successful deployment is currently live.

The repository has no publish npm script. Publishing this configured path requires the OpenAI Sites integration in a supported client; if that integration is unavailable, the build remains local until a separate deployment configuration is added and verified.

The supported publishing sequence is:

1. Validate the exact source state with the commands above.
2. Publish that exact source revision through OpenAI Sites tooling.
3. Let the Sites packaging flow stage the Worker bundle, browser assets, hosting metadata, and any future migrations.
4. Save a single version and prefer a private deployment unless a different access level is explicitly approved.
5. Wait for the hosting service to report success.
6. Open the returned deployed URL and repeat the production smoke checks below.

Publishing requires a source revision that identifies the validated state. Do not publish unreviewed local edits or a build produced from a different revision. Keep source credentials out of repository URLs, configuration, logs, and documentation.

Only `project_id` and optional logical `d1` and `r2` names belong in `.openai/hosting.json`. Application runtime values, if introduced later, must be managed through the hosting service rather than committed.

No successful production deployment was confirmed while this documentation was written.

## Cloudflare Pages status

Cloudflare Pages was requested as a preferred destination, but direct Pages deployment is not configured or verified in this repository.

In particular:

- there is no static `out/` export;
- there is no `dist/client/index.html`;
- `dist/client/` is only the browser-asset half of the application;
- there is no Pages Functions adapter or Pages-specific deployment configuration;
- there is no repository script for a direct Cloudflare deployment.

Therefore, do not configure a Pages project with `out`, `dist`, or `dist/client` as its output directory. Doing so would either fail or omit required server behavior.

### If a future migration to Pages is required

Treat it as an explicit architecture change:

1. Decide whether the product can become a true static export or requires Pages Functions-compatible server rendering.
2. Select and configure an adapter that supports the project's Next.js/vinext behavior.
3. Preserve or deliberately replace request-host-derived metadata in `app/layout.tsx`.
4. Add a documented Pages build/deploy configuration.
5. Produce the candidate artifact and verify its actual entry point and output directory.
6. Test server rendering, search/filter hydration, metadata, static assets, and image handling in a real Pages preview.
7. Only after that verification, connect the repository to Cloudflare Pages and enter the proven build command and output directory.
8. Document preview deployments, production-branch behavior, and rollback based on the options actually enabled in Cloudflare.

Until that work is complete, OpenAI Sites is the repository's supported path.

### Pages project setup after the migration passes

The following sequence is valid only after the migration checklist above produces and verifies a Pages-compatible build. It is not a deployment procedure for the current artifact.

1. Push the validated source revision to GitHub.
2. In Cloudflare, create a Pages application and choose **Connect to Git**, following Cloudflare's [Git integration guide](https://developers.cloudflare.com/pages/get-started/git-integration/).
3. Authorize GitHub access, select the repository, and choose the intended production branch.
4. Enter the build command proven by the migration; do not assume the current command is Pages-compatible before that proof exists.
5. Enter the exact output directory produced by that command. Never use the current `dist/client/` directory by itself.
6. Configure Node 22.13.0 or newer and only the environment variables introduced and documented by the migration. The current application requires none.
7. Save and deploy, then require a successful build status before treating the result as usable.
8. Open the returned `pages.dev` URL and run the production smoke test below.
9. Add the chosen `.com` hostname through Pages **Custom domains** and apply the provider-supplied DNS instructions. Cloudflare documents different requirements for [apex domains and subdomains](https://developers.cloudflare.com/pages/configuration/custom-domains/).
10. Verify managed HTTPS, select either the apex or `www` as canonical, and permanently redirect the alternate hostname to it.

After setup, record the proven build command, output directory, production branch, preview policy, and canonical URL in this document. Do not leave placeholder deployment instructions behind.

## Direct Cloudflare Worker deployment

The generated application is Worker-compatible, but the repository does not include a standalone `wrangler.json`, `wrangler.jsonc`, or deploy script. A direct Wrangler deployment is therefore not a documented one-command path. Adding one requires a separate, tested configuration for the Worker entry, static assets, compatibility flags, and image behavior.

Do not invent a `wrangler deploy` command or assume the local Cloudflare Vite configuration is sufficient for production account wiring.

## Custom domain

Domain configuration lives in the selected hosting control plane, not in this repository. After a successful deployment:

1. Choose the canonical hostname, usually either the apex `.com` or `www`.
2. Add the canonical hostname and, if desired, the alternate hostname in the hosting provider.
3. Apply the exact DNS records the provider supplies.
4. Wait for domain validation and managed HTTPS to complete.
5. Configure a permanent redirect from the alternate hostname to the canonical hostname.
6. Verify the homepage, resource links, favicon, and social metadata over HTTPS on the canonical URL.

Do not document specific DNS records before the hosting service supplies them. They depend on the account and deployment model.

## Continuous deployment, previews, and rollback

This repository does not configure GitHub-triggered continuous deployment, preview deployments, or an automated rollback policy. A source push must not be described as an automatic production release unless the hosting project is later configured and verified to behave that way.

If a future Pages Git integration is enabled, Cloudflare can build connected branches on pushes, create [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/), and roll production back to a [previous successful production deployment](https://developers.cloudflare.com/pages/configuration/rollbacks/). Those are platform capabilities, not evidence that this repository has enabled them.

Sites keeps deployment versions outside the repository. If the hosting interface exposes a previously successful version, confirm its source and redeploy that version when a rollback is necessary. Otherwise, restore the known-good source, rebuild, validate, and publish it as a new version.

Document any future production branch, preview URL rules, approval gates, and rollback process here after they are enabled.

## Production smoke test

After a deployment reports success:

- Load the canonical HTTPS URL and refresh a deep hash such as `#resource-library`.
- Verify title, description, favicon, and the absolute Open Graph image URL.
- Confirm the first 12 resources and the “Show all 62 resources” control.
- Test a specialist search, a college-year filter, category + year, search + year, category + search + year, a no-results combination, and reset.
- Open several external resources in new tabs.
- Check a narrow mobile viewport, keyboard focus, and reduced motion.
- Confirm there is no horizontal page overflow and no application error in the browser.

See [TESTING.md](./TESTING.md) for the full manual checklist and [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) for build and hosting failures.
