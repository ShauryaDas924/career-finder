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

### Added

- Browse by College Year controls for combining optional resource-level year guidance with career-category filters and text search; individual-opportunity eligibility must still be verified at the original source.
- Underclassmen Opportunities as a technology-focused resource for freshmen and sophomores.
- A compact “Search your way” section that uses Handshake and Himalayas for work setup/location guidance, then HiringCafe and USAJOBS Early Careers for compensation-focused discovery, without adding listings or application behavior.
- HiringCafe and Himalayas as non-featured General / Any Major resources while preserving the 13-category taxonomy.
- Dated first-party research notes with a dedicated hidden-gem pass, exact salary-filter/sort distinctions, access/currentness notes, and the federal-only scope of USAJOBS' verified **Highest salary** sort.
- A maintained destination-level safety audit covering ownership, canonical URLs, maintenance, student relevance, reporting or moderation evidence, risk notes, and an explicit decision for every resource reviewed.
- A native search-tip reminder that individual opportunities on external services require independent verification, including calm guidance to confirm unexpected repositories, package installs, scripts, containers, or binaries through the company's official domain before executing them.

### Changed

- Expanded the reviewed records' factual descriptions and search aliases so work-setup, location, job-type, salary, compensation, and pay queries find the intended destinations.
- Kept Simplify featured and searchable while moving the compact compensation mapping to HiringCafe plus the distinct federal USAJOBS specialist.
- Reconciled the catalog after the safety review to 62 resources, 13 categories, and four featured starting points, with updated college-year and category counts.
- Corrected or narrowed factual metadata and useful caveats, including ApplyGuy's documented cadence, the Jobright finance collection's display name, Dreamwork's supported disciplines, destination-specific application cautions, and SelectLeaders' category assignment from General / Any Major to Business only.
- Broadened LinkedIn and Simplify's resource-level college-year guidance while preserving the requirement to verify eligibility on each original opportunity.

### Fixed

- Normalized the BioSpace destination to its canonical `jobs.biospace.com` URL.

### Removed

- The stale, redundant Vansh Summer 2027 internship tracker; the stronger maintained Simplify/Pitt collection remains.
- InternList, whose application links resolve through Simplify; the existing Simplify resource is the canonical replacement rather than a duplicate record.

### Security

- Reviewed all 64 pre-audit destinations without cloning or executing unknown repository content, documented the evidence and limitations, and distinguished destination-level curation from any guarantee about individual listings.
- Added actionable public guidance for unexpected developer assessments that ask students to run unfamiliar code or tools.

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
