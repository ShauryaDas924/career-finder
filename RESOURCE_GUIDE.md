# Resource Guide

[`app/data/resources.ts`](app/data/resources.ts) is the authoritative source for the taxonomy, resource inventory, search aliases, and featured selection. The interface derives category counts, search results, filters, and featured cards from this file.

Current source inventory: **64 unique resources**, **13 visible categories**, **5 college-year choices**, and **5 featured starting points**. A resource can belong to more than one category, so category totals intentionally add up to more than 64.

## Curation principles

Prefer resources that give students a distinct, credible place to search:

- official government and public-service opportunity portals;
- established professional-association career centers;
- maintained internship trackers with a clear audience;
- reputable job platforms and specialist industry boards;
- university or student-focused resources;
- fellowship, research, service, and micro-internship directories with clear value.

Avoid:

- spammy or opaque aggregators;
- duplicates or near-duplicates that add no new audience or function;
- dead, redirected-to-irrelevant, or abandoned destinations;
- misleading descriptions or unsupported claims;
- broad homepages when a stable, useful destination page exists;
- entries added only to increase the resource count.

Every card should answer “Why would a student open this?” The directory is deliberately selective, not exhaustive.

## Current categories

| Category ID | Visible label | Resources |
| --- | --- | ---: |
| `technology` | Technology | 11 |
| `business` | Business | 18 |
| `finance-risk` | Finance & Risk | 8 |
| `healthcare` | Healthcare | 12 |
| `engineering` | Engineering | 11 |
| `science-research` | Science & Research | 10 |
| `supply-chain-operations` | Supply Chain & Operations | 5 |
| `marketing-communications` | Marketing & Communications | 5 |
| `design-creative` | Design & Creative | 4 |
| `government-law-policy` | Government, Law & Policy | 10 |
| `education` | Education | 4 |
| `human-services-nonprofit` | Human Services & Nonprofit | 5 |
| `general-any-major` | General / Any Major | 16 |

These counts come from the current multi-category assignments. Update this table when the dataset changes.

## Resource schema

The `Resource` interface is read-only and uses closed TypeScript unions for IDs, categories, formats, and tags.

| Field | Required | Expected value | Purpose | Current example |
| --- | --- | --- | --- | --- |
| `id` | Yes | Stable kebab-case literal also present in `resourceIds` | React key, search-index key, and durable internal identity | `"ana-career-center"` |
| `name` | Yes | Official, recognizable resource name | Visible card heading | `"ANA Career Center"` |
| `url` | Yes | Direct, valid HTTPS URL | External destination | `"https://ana.careerwebsite.com/"` |
| `description` | Yes | One concise, factual sentence | Explains what the destination is | `"The American Nurses Association's official career center…"` |
| `categories` | Yes | Non-empty read-only array of `CategoryId` values | Controls category cards and filters | `["healthcare"]` |
| `bestFor` | Yes | Non-empty array of short student-oriented uses | Explains who should open it and why | `["Nursing careers"]` |
| `tags` | Yes | One to five values from `ResourceTag` | Visible scan labels and direct search terms | `["NURSING", "CLINICAL", "HEALTHCARE", "EARLY CAREER"]` |
| `format` | Yes | One `ResourceFormat` literal | Visible source type and compact format mark | `"Professional association job board"` |
| `featured` | Yes | Boolean | Includes a resource in the five-card starting section when `true` | `false` |
| `recommendedForYears` | No | Array of `CollegeYearId` values for which the destination is an especially useful starting point | Powers Browse by College Year; this is editorial resource guidance, not job-level eligibility | `["freshman", "sophomore"]` |
| `searchTerms` | No in the type; present on all 64 current resources | Array of specific majors, roles, abbreviations, and aliases | Improves direct search without crowding the card | `["registered nurse", "RN"]` |
| `updateFrequency` | No | Short claim that has been specifically verified | Shows an update badge | `"Updated daily"` |
| `notes` | No | Concise qualification, limitation, or useful caveat | Sets accurate expectations below the card | Eligibility or audience note |

The allowed `ResourceFormat` values are:

- `GitHub collection`
- `Job platform`
- `Internship directory`
- `University career platform`
- `Professional association job board`
- `Industry job board`
- `Government career portal`
- `Career education resource`
- `Fellowship directory`
- `Research opportunity directory`
- `Service opportunity portal`
- `Micro-internship platform`

`ResourceTag` is also a closed union in the data file. Reuse an existing tag whenever possible. Current tags cover disciplines and roles, plus audience or timing labels such as `ALL MAJORS`, `EARLY CAREER`, `UNIVERSITY`, and `2027`. Adding a new literal requires extending the union deliberately.

### Category metadata

Each entry in `categories` conforms to `CategoryMetadata`:

| Field | Required | Purpose |
| --- | --- | --- |
| `id` | Yes | Stable `CategoryId` used by resources and UI state |
| `label` | Yes | Full heading shown on the category card and in result text |
| `shortLabel` | Yes | Compact filter-chip text |
| `description` | Yes | One-sentence explanation on the category card |
| `icon` | Yes | Semantic `CategoryIcon` key mapped to the existing CSS mark |
| `keywords` | Yes | Broad aliases used only by category-fallback search |

The parallel `categoryIds` and `resourceIds` arrays intentionally create literal unions. When adding an ID, update its registry and its corresponding object together. Tests assert that registry order matches data order.

### College-year metadata

`collegeYearIds` is the closed source of truth for the Browse by College Year controls. Its current IDs, in display order, are:

- `freshman`
- `sophomore`
- `junior`
- `senior`
- `new-grad`

Each ID has a corresponding `CollegeYearMetadata` entry with a visible singular `label` and a plural `audienceLabel` used in accessible names and result status text. Keep `collegeYearIds` and `collegeYears` aligned and preserve these stable IDs when changing display copy.

`recommendedForYears` is deliberately optional on a resource. Add it only when the destination is an especially useful starting point for that audience. It does **not** assert that every listing on that destination accepts, excludes, or guarantees eligibility for that college year. Students must confirm eligibility on the original opportunity page. Leaving the field out means the resource is not included when a college-year filter is active; it does not mean the resource is unusable or ineligible.

The current unfiltered counts are **12 Freshmen**, **13 Sophomores**, **15 Juniors**, **19 Seniors**, and **16 New Grads**. These are derived from `recommendedForYears` and protected by rendered-page tests; update documentation and assertions together after an intentional editorial change.

### Focused search-tool guidance

The “Search your way” section is a curated view of existing records, not a separate resource source. A small typed mapping in [`app/CareerGuide.tsx`](app/CareerGuide.tsx) stores only intent IDs, labels, explanatory copy, and `ResourceId` references. Destination names, URLs, formats, descriptions, and other catalog metadata continue to come from this file.

The current mapping uses:

- `handshake` for student-focused location/radius, work setup, and job-type discovery;
- `himalayas` for remote country/time-zone, early-career, salary-range, and salary-order controls;
- `hiringcafe` for broad location/work-setting, minimum/disclosed-pay, and **Highest salary** controls; and
- `usajobs-early-careers` for minimum-salary filtering and the verified **Highest salary** sort on federal openings.

These four records carry the supporting work-setup, location, job-type, salary, compensation, and pay aliases in `searchTerms`. HiringCafe and Himalayas were added as non-featured General / Any Major resources; the catalog now has 64 records, while its schema and five-resource featured set are unchanged. Simplify remains featured and retains its verified salary-filter aliases, but is not in the compact mapping because HiringCafe covers that broad compensation role and USAJOBS adds a distinct federal specialist. Exact evidence and rejected alternatives are recorded in [`SEARCH_TOOL_RESEARCH.md`](SEARCH_TOOL_RESEARCH.md); reverify those first-party sources before changing a capability claim.

## Broad categories, deep search terms

Do not create a top-level category for every major. Keep the visible taxonomy broad and make specialist resources discoverable with precise resource-level aliases.

For example, Healthcare Management belongs under `healthcare`—and often also `business`—while relevant records can include:

- `healthcare management`
- `healthcare administration`
- `health administration`
- `hospital administration`
- `healthcare operations`
- `hospital management`
- `MHA`

This pattern supports majors and career directions without turning the filter list into a degree catalog:

> broad visible categories + deep resource-level `searchTerms`

Use category `keywords` for broad concepts that reasonably describe the entire category. Use resource `searchTerms` for specialist majors, roles, abbreviations, and phrases that should surface a smaller, more useful set.

## How search uses the data

Search behavior lives in [`app/CareerGuide.tsx`](app/CareerGuide.tsx):

1. The selected category and college year are applied first. A selected year retains only resources whose `recommendedForYears` includes that year; “All paths” and “All years” leave their respective dimensions unrestricted.
2. The query is lowercased, most punctuation becomes spaces, and `+`, `#`, and `/` are retained.
3. A direct resource index searches `name`, `description`, `format`, `tags`, `bestFor`, and `searchTerms` within the category-and-year scope.
4. If at least one resource matches directly, only those specialist matches are returned.
5. If no resource matches, category `label`, `shortLabel`, and `keywords` are searched; resources from matching categories are returned only when they also remain in the selected category-and-year scope.
6. One- or two-character alphanumeric queries require whole-token matches. This keeps `AI`, `IT`, `PR`, and `HR` from matching letters embedded inside unrelated words.

This fallback order is intentional. A precise query such as `nursing` should reach the ANA Career Center instead of automatically returning every Healthcare resource.

Resources keep their source-array order. That order controls the first 12 cards in the default library and the order of filtered results; there is no score-based ranking.

Terms such as `remote jobs`, `hybrid jobs`, `onsite`, `in person`, `jobs near me`, `time zone`, `full time`, `part time`, `no experience`, `salary filter`, `salary range`, `disclosed salary`, `minimum salary`, and `highest salary` are intentional discovery aliases on the reviewed records. `highest salary` belongs only to `hiringcafe`, `himalayas`, and `usajobs-early-careers`; do not broaden that phrase to another resource without current first-party evidence for a genuine salary-order sort.

The Browse by College Year and career-path panels derive each visible count from the dataset after applying the other active dimensions, so a card's count matches the result it will produce. Choosing a year applies that same year in the library, collapses the expanded list, scrolls to the library, and focuses search. The library's category, year, and query controls compose rather than replacing one another. Its live status names the active category, year audience, and query as applicable. “Clear filters” restores the query, category, year, collapsed first-12 state, and search focus to the default view; the empty-state “Show every resource” action resets the same filters but intentionally expands the full catalog.

## Featured resources

`featuredResources` is derived by filtering `resources` where `featured` is `true`. The current five are:

- `applyguy-2027-internships`
- `internlist`
- `handshake`
- `simplify`
- `jobright`

Keep the featured set small and broad. Mark a specialist resource as featured only with an intentional product decision, and update the exact-featured assertion in the tests when that decision changes.

## Add a resource

1. Visit the destination and verify that it is live, relevant, and useful to students.
2. Check for an existing resource with the same URL, organization, or purpose.
3. Add a stable kebab-case literal to `resourceIds` in the position where the record will appear.
4. Add the resource object at the matching position in `resources`.
5. Assign one or more existing broad categories. Add secondary categories only when the resource genuinely serves them.
6. Write a factual description and two or three concrete `bestFor` statements.
7. Select one to five existing tags.
8. Add specific roles, majors, abbreviations, and search aliases to `searchTerms`.
9. Add `recommendedForYears` only when editorial review supports the resource's usefulness for those audiences; do not infer job eligibility from the destination's general audience.
10. Leave `updateFrequency` and `notes` out unless they add verified value.
11. Keep `featured: false` unless the shortlist is intentionally changing.
12. Run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Update exact-count or coverage assertions only when the dataset change is deliberate.
13. Manually try the important new search phrases, combine any assigned college years with relevant categories and queries, and open the external link.

An illustrative object uses the same structure as the production array. Replace every placeholder with verified information, and add the chosen ID to `resourceIds` first:

```ts
{
  id: "stable-resource-id",
  name: "Official resource name",
  url: "https://verified.example/path",
  description: "One factual sentence explaining the destination.",
  categories: ["healthcare", "business"],
  bestFor: [
    "A specific student audience",
    "A specific role or opportunity type",
    "A distinct reason to use this resource",
  ],
  tags: ["HEALTHCARE", "ADMINISTRATION", "EARLY CAREER"],
  format: "Professional association job board",
  featured: false,
  recommendedForYears: ["senior", "new-grad"],
  searchTerms: [
    "healthcare management",
    "healthcare administration",
    "hospital administration",
  ],
  notes: "Include only a useful, verified qualification.",
},
```

The example is a schema template, not a current resource or endorsement.

## Edit, remove, or recategorize a resource

- Preserve `id` when changing copy or URLs unless the resource's identity truly changed.
- Reverify the destination before changing its description, notes, or update claim.
- Remove both the record and its `resourceIds` literal when removing a resource.
- Check whether a URL replacement creates a duplicate.
- After category changes, verify category-card counts and filtered results.
- After college-year changes, verify the Browse by College Year count, the matching library filter, the live result status, and combinations with category and text search.
- After alias changes, test the specific query and nearby short queries for unintended matches.

## Verification checklist

Before accepting a new or changed resource, confirm:

- **URL:** HTTPS, direct enough to be useful, and free of an unnecessary tracking string.
- **Identity:** the organization and page are what the name says they are.
- **Audience:** students or early-career users can reasonably benefit, even if some listings target experienced applicants.
- **Description:** every claim is visible or otherwise verified; avoid job-count or availability claims that change quickly.
- **Update frequency:** add it only when a trustworthy source supports the exact wording.
- **Usefulness:** the destination adds a field, opportunity type, or workflow not already served well.
- **Search:** important majors, roles, and abbreviations find the specialist resource directly.
- **External capabilities:** current first-party documentation supports every filter or sort named in visible copy; narrow claims by market or audience where required.
- **Categories:** assignments are broad, defensible, and not added merely to increase exposure.
- **College years:** each `recommendedForYears` assignment reflects editorial usefulness, uses a known ID, and is never presented as opportunity-level eligibility.
- **External behavior:** the link opens the intended page and the site's own eligibility and privacy terms remain clear.

The automated suite checks HTTPS shape, URL parseability, duplicate IDs and URLs, required fields, tag limits, category validity, category coverage, the five college-year IDs and labels, valid nonrepeating year assignments, at least one recommended resource per year, intentional sample assignments, featured IDs, required searches, and category + year + query composition. It does **not** make live network requests or judge whether an editorial year recommendation remains useful, so both URL and year-guidance verification remain manual responsibilities.
