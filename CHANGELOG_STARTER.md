# Changelog

This file is a starter for recording meaningful changes to Where to Look. It follows the structure of [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) without claiming a release date that the repository does not establish.

The package version in `package.json` is currently 0.1.0. No release tag, publication status, or release date is inferred here.

## [Unreleased]

Use this section while work is in progress. Add only headings that have entries:

- **Added** for new user-visible behavior, resources, categories, or developer capabilities
- **Changed** for changes to existing behavior, content, or architecture
- **Fixed** for corrected defects or inaccurate resource information
- **Removed** for deleted behavior, resources, or dependencies
- **Security** for security-relevant changes

Move completed entries into a versioned section when a release is actually made.

## [0.1.0] — Initial completed product (date not recorded)

### Added

- A responsive, single-page student career-resource guide built with Next.js, React, vinext, Vite, and a Cloudflare Worker entry.
- A curated directory of 60 external starting points across 13 broad career families.
- Four featured resources and a default 12-resource quick-start view with an option to reveal the full directory.
- Search by resource content, major, role, topic, tag, and alias, with category fallback and whole-token matching for short abbreviations.
- Career-family category cards and filter controls with derived resource counts.
- Healthcare-management, administration, operations, public-health, informatics, nursing, pharmacy, biotech, and related specialist coverage.
- “Start Here” guidance, job-search tips, an about section, and an informational resource-suggestion dialog.
- Safe external-link attributes and explicit new-tab accessible names.
- Semantic landmarks, skip navigation, visible focus treatment, live result counts, keyboard-operable controls, and reduced-motion handling.
- Original CSS scenery using the cotton-candy landscape, pinwheel, path, target, tree, cloud, wind, and hill visual language.
- Site-specific favicon and Open Graph/X social image metadata.
- Node tests for dataset integrity, required search coverage, healthcare coverage, and production-rendered HTML.
- OpenAI Sites metadata and a vinext Cloudflare Worker-compatible build.

## Writing future entries

1. Record the change under `[Unreleased]` when it is merged into the maintained source.
2. Describe observable outcomes, not a chronological work log.
3. Name important data corrections, especially replaced or removed external resources.
4. Separate breaking architecture or deployment changes from routine content maintenance.
5. When a release is made, add a real version and ISO date: `## [x.y.z] - YYYY-MM-DD`.
6. Do not invent dates, version tags, deployments, or security claims.

A future maintained changelog may rename this file to `CHANGELOG.md`; update links at the same time if that happens.
