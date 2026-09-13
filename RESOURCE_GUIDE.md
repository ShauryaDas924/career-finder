# Resource Guide

[`app/data/resources.ts`](app/data/resources.ts) is the authoritative source for the taxonomy, resource inventory, search aliases, and featured selection. The interface derives category counts, search results, filters, and featured cards from this file.

Current source inventory: **61 unique resources**, **13 visible categories**, and **5 featured starting points**. A resource can belong to more than one category, so category totals intentionally add up to more than 61.

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
| `technology` | Technology | 10 |
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
| `general-any-major` | General / Any Major | 14 |

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
| `searchTerms` | No in the type; present on all 61 current resources | Array of specific majors, roles, abbreviations, and aliases | Improves direct search without crowding the card | `["registered nurse", "RN"]` |
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

1. The selected category is applied first, or all resources are used.
2. The query is lowercased, most punctuation becomes spaces, and `+`, `#`, and `/` are retained.
3. A direct resource index searches `name`, `description`, `format`, `tags`, `bestFor`, and `searchTerms`.
4. If at least one resource matches directly, only those specialist matches are returned.
5. If no resource matches, category `label`, `shortLabel`, and `keywords` are searched; resources from matching categories are returned.
6. One- or two-character alphanumeric queries require whole-token matches. This keeps `AI`, `IT`, `PR`, and `HR` from matching letters embedded inside unrelated words.

This fallback order is intentional. A precise query such as `nursing` should reach the ANA Career Center instead of automatically returning every Healthcare resource.

Resources keep their source-array order. That order controls the first 12 cards in the default library and the order of filtered results; there is no score-based ranking.

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
9. Leave `updateFrequency` and `notes` out unless they add verified value.
10. Keep `featured: false` unless the shortlist is intentionally changing.
11. Run `npm test`, `npm run lint`, `npx tsc --noEmit`, and `npm run build`. Update exact-count or coverage assertions only when the dataset change is deliberate.
12. Manually try the important new search phrases and open the external link.

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
- **Categories:** assignments are broad, defensible, and not added merely to increase exposure.
- **External behavior:** the link opens the intended page and the site's own eligibility and privacy terms remain clear.

The automated suite checks HTTPS shape, URL parseability, duplicate IDs and URLs, required fields, tag limits, category validity, category coverage, featured IDs, and required searches. It does **not** make live network requests, so editorial URL verification remains a manual responsibility.
