# Features

Where to Look is a curated directory of external internship and early-career resources. It helps college students decide where to search; it does not host, copy, scrape, or accept applications for jobs.

The current dataset contains **61 resources across 13 broad career categories**. Counts shown in the interface are derived from [`app/data/resources.ts`](app/data/resources.ts), not duplicated in the component.

## Directory and discovery

### Career-family browsing

**What it does:** Displays 13 career-path cards with a short explanation and the current number of matching resources. Choosing a card applies that category, moves the student to the resource library, and focuses search.

**Why it exists:** A student can begin with a broad direction without already knowing a job title or specialist website.

The current categories are Technology; Business; Finance & Risk; Healthcare; Engineering; Science & Research; Supply Chain & Operations; Marketing & Communications; Design & Creative; Government, Law & Policy; Education; Human Services & Nonprofit; and General / Any Major.

### Resource cards

**What they do:** Each card identifies the resource name, destination type, description, intended uses, up to four visible tags, and an external visit link. A card can also show a verified update-frequency badge or an editorial note when those optional fields are present.

**Why they exist:** Students need enough context to decide whether a destination is worth opening without turning this site into another listing feed.

### Featured starting points

**What it does:** Presents five broad, student-friendly resources before the full library: ApplyGuy, InternList, Handshake, Simplify, and Jobright.ai.

**Why it exists:** A short starting set reduces decision fatigue for students who do not yet know which specialist source they need.

### Progressive disclosure

**What it does:** The unfiltered library initially renders the first 12 resources and offers a button to show all 61. A search or category selection displays all matching results immediately.

**Why it exists:** The first visit remains approachable while the complete directory is still one action away.

## Search and filtering

### Major-, role-, and topic-aware search

**What it does:** Searches a normalized index of each resource's name, description, format, tags, `bestFor` text, and `searchTerms`. Search is case-insensitive and preserves useful characters such as `+`, `#`, and `/`.

Direct resource matches are returned first. Only when there are no direct matches does search fall back to category labels, short labels, and category keywords. One- and two-character alphanumeric searches, such as `AI`, `IT`, `PR`, and `HR`, require whole-token matches instead of matching arbitrary substrings.

**Why it exists:** A specific query should surface specialist destinations rather than expanding to every resource in a broad category. Category fallback still provides a useful path for broader terms.

See [`RESOURCE_GUIDE.md`](RESOURCE_GUIDE.md) for the indexing and curation rules.

### Category filters

**What they do:** Provide an “All” option and one filter for each category. Search and category filters can be used together. The selected filter uses both a visual active treatment and `aria-pressed` state.

**Why they exist:** Students can narrow a search without the complexity of multiple faceted-filter panels.

### Result feedback and recovery

**What it does:** Announces result totals through a polite live region, names the active category and query, and provides clear-search and clear-filter actions. A zero-result state suggests broader terms and offers a reset.

**Why it exists:** Every change has visible feedback, and an unsuccessful query is never a dead end.

## Guidance content

### “Start Here” sequence

**What it does:** Gives a five-step search routine: choose a broad path, open a few resources, check regularly, save alerts, and confirm an opportunity on the employer site.

**Why it exists:** The product is designed for students who may not know how to begin, not only students who already know where to search.

### Search tips and product explanation

**What they do:** Reinforce applying early, using several sources, enabling alerts, checking original employer pages, and understanding why the directory exists.

**Why they exist:** Good search habits are part of the resource guide's value.

### Resource-suggestion notice

**What it does:** Opens a native dialog explaining that a submission channel has not been configured.

**Why it exists:** The interface can acknowledge resource suggestions without inventing an address, form, or backend. It is informational only and does not collect or send data.

## Interface behavior

### Responsive single-page navigation

**What it does:** Uses a sticky header and anchor navigation for Start Here, Paths, Resources, Tips, and About. Layouts collapse from multi-column grids to a single column, and the smallest navigation and filter rows scroll horizontally instead of forcing page overflow.

**Why it exists:** The same directory remains usable on wide desktop screens, tablets, and narrow phones.

### Illustrated visual world

**What it does:** Uses HTML elements, pseudo-elements, and CSS to draw pinwheels, clouds, wind swirls, trees, a sun, targets, hills, a path, signs, and small flowers or sparkles. There is no inline SVG illustration system.

**Why it exists:** The discovery metaphor makes the guide encouraging and recognizable while leaving the resource content dominant.

### Lightweight motion and reduced motion

**What it does:** Adds slow pinwheel rotation, drifting clouds and swirls, tree sway, target breathing, path-dot movement, and short control transitions. A `prefers-reduced-motion: reduce` media query effectively disables animation, transitions, and smooth scrolling. Category-card scrolling also checks the preference in JavaScript.

**Why it exists:** Motion gives the illustrated world life without carrying information or blocking use. Students who request less motion receive a stable experience.

See [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for exact tokens and timings.

### Accessible interaction patterns

**What they do:** Provide semantic landmarks and headings, a skip link, native controls, visible focus outlines, programmatic labels, pressed-state filters, a live result count, and decorative artwork hidden from assistive technology.

**Why they exist:** Search, filtering, navigation, the dialog, and external links should remain understandable without a mouse or visual decoration.

See [`ACCESSIBILITY.md`](ACCESSIBILITY.md) for implementation details and the manual QA checklist.

### Safe external destinations

**What it does:** Opens resource destinations in a new tab with `rel="noopener noreferrer"` and an accessible label that warns about the new tab.

**Why it exists:** Where to Look remains an organizer while the source website owns its listings, application flow, privacy policy, and eligibility details.

### Metadata and social preview

**What it does:** Supplies product-specific title, description, icons, keywords, Open Graph metadata, X card metadata, and a dedicated social image. Absolute preview-image URLs are derived from the incoming request host.

**Why it exists:** Links have clear, consistent context on local, preview, and deployed origins.

### Print simplification

**What it does:** The print stylesheet hides the site header, prominent hero scenery, explorer panel, footer, `.button` controls, and outbound resource actions. Resource and featured grids print in two columns, and resource-card shadows are removed.

**Why it exists:** Printed content avoids decorative and interactive-only chrome.

## Non-goals

The current product intentionally does not include:

- hosted or copied job listings;
- job scraping or automatic resource ingestion;
- accounts, authentication, profiles, or employer portals;
- favorites, browser storage, saved searches, or application tracking;
- resumes, application forms, or document storage;
- AI chat, ranking, personalization, or recommendation engines;
- social or community features;
- a database or application-owned backend persistence layer.

Additions in these areas require explicit product direction. The default maintenance posture is to improve the curated directory rather than expand it into a job platform.
