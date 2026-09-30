# Accessibility

Where to Look uses native HTML and deliberately nonessential decoration so its main tasks—navigating, browsing by college year, choosing focused search tools, searching, filtering, reading resource context, and opening an external destination—remain available without the illustrated layer.

This document describes implemented safeguards and the manual checks expected for future changes. It is not a formal WCAG conformance claim, and the current automated tests are not a complete accessibility audit.

## Implemented decisions

### Document structure

- The root document declares `lang="en"`.
- The page uses `header`, labeled `nav` elements, `main`, labeled `section` elements, `article` resource cards, and `footer`.
- The page has one `h1`; major sections use `h2`; intent, resource, and empty-state titles use `h3`; compact search-tool names use `h4` beneath their intent heading.
- Ordered and unordered lists represent the step sequence, tags, and tips.
- A “Skip to main content” link becomes visible when focused and targets `#main-content`.

### Keyboard interaction and focus

- Navigation, category cards, college-year cards, filter chips, search controls, show-more/reset actions, focused search-tool links, external links, footer actions, and dialog actions use native anchors, buttons, or inputs.
- A global `:focus-visible` rule provides a 3px `--coral-dark` outline with a 4px offset.
- The skip link moves into view on focus.
- Search receives an additional visible border and focus ring.
- Choosing a category schedules focus on the search field after scrolling to the library.
- The suggestion notice uses the native `<dialog>` element with button-based close actions. Native Escape-to-close behavior remains available.

Do not replace these elements with clickable noninteractive containers. Any new custom interaction must define keyboard behavior, focus visibility, and an accessible name.

### Search and filters

- The search input has a persistent `<label>` connected through `htmlFor` and `id`; placeholder text is only an example.
- The clear-search icon button is named “Clear search.”
- Category chips sit inside a `<fieldset>` with a `<legend>`.
- Browse by College Year uses a native `<fieldset>` and `<legend>`; the group references the visible eligibility guidance through `aria-describedby`. Each native button exposes `aria-pressed` and has an accessible name containing its audience and current derived resource count.
- The library's career-path and college-year chips use separate labeled fieldsets. Every chip exposes `aria-pressed`; its active state also has a checkmark and high-contrast visual treatment.
- Choosing a Browse by College Year card applies the matching library filter, collapses the expanded list, scrolls to the library, and focuses search. Selecting a year chip in the explorer updates that same state without unexpectedly moving focus.
- Result text uses `role="status"`, `aria-live="polite"`, and `aria-atomic="true"`. It reports the resulting count and names the selected category, year audience, and query when present.
- The show-more button declares `aria-controls="resource-results"` and its current expanded state.
- “Clear filters” restores All paths, All years, an empty query, and the collapsed default list, then returns focus to search. The zero-results recovery button resets the same filters, expands all resources, and returns focus to search.

The college-year language describes resources that are especially useful for an audience, not eligibility for every opportunity on a destination. The visible guidance tells students to confirm eligibility on the original source; keep that distinction intact in future copy and accessible names.

### Category and resource cards

- Category cards are buttons. Each accessible name includes the full category and its current resource count.
- Resource cards are `article` elements, and each resource name is an `h3` heading inside its card.
- Tag lists have resource-specific accessible labels.
- The external link name includes the destination and “opens in a new tab.”
- External resource links use `target="_blank"` with `rel="noopener noreferrer"`.

The “Search your way” intent panels are semantic nested sections labelled by their visible `h3` headings. Their compact cards reuse the canonical resource object and a normal external anchor with the same new-tab warning and safety attributes as library cards. The panels are not controls and do not expose a false pressed or selected state.

### Decorative artwork

The hero and footer scenery, pinwheels, brand marks, targets, category marks, search icon, focused-search location/pay marks, sparkles, and other ornaments are hidden with `aria-hidden="true"` at the component or containing-scene level. They do not contain required instructions or state.

The in-page illustration system is CSS and HTML, not SVG. If an SVG is added later:

- mark it `aria-hidden="true"` and `focusable="false"` when decorative; or
- give it an appropriate role and concise accessible name when it conveys information.

Do not expose individual decorative shape elements to the accessibility tree.

### Color and contrast

Primary text and outlines use dark navy (`#183553`) on cream, paper, and pale pastel surfaces. Supporting copy uses `#50687c` on those light surfaces. Interactive state is not conveyed by color alone: the active filter also has a checkmark and `aria-pressed`, links have text, and focus has an outline.

No automated contrast assertion exists in the current suite. Recheck contrast whenever foreground colors, background tokens, font size, or weight changes. In particular, do not use the pastel palette for small text without a dark foreground.

### Responsive and zoom behavior

The content shell and grids reflow at 1050px, 820px, and 580px. Resource and category grids become single-column on narrow screens. The Browse by College Year panel stacks at 1050px; its five-button grid uses three columns at 820px and two at 580px. The two focused-search intent panels become one column at 820px. Each compact resource card keeps its link below the text at every width, and each panel's paired tool cards become one column at 580px. Navigation and both library filter rows become horizontally scrollable where wrapping would make them unusable. Page-level horizontal overflow is clipped/hidden, so QA must verify that no content is merely being cut off.

Primary pill buttons are at least 50px tall. Mobile filter chips are at least 40px tall. Preserve generous targets and spacing when adding compact controls.

### Reduced motion

All continuous motion is decorative. Under `prefers-reduced-motion: reduce`:

- smooth document scrolling becomes automatic;
- animations run for `0.001ms` and only once;
- transitions run for `0.001ms`;
- career-path and college-year card navigation checks the preference and requests automatic rather than smooth scrolling.

Search, filters, navigation, and resource content do not depend on motion. See [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md) for the animation inventory.

### External destinations

Where to Look controls the accessibility of its own links and warnings, but not the pages it opens. External resources may have different keyboard, screen-reader, privacy, and application experiences. Curation should prefer usable direct destinations, and link checks should include a basic destination review rather than status-code verification alone.

## Expected keyboard flow

A keyboard-only pass should be able to:

1. reveal and activate the skip link;
2. traverse header navigation in reading order;
3. activate either hero action;
4. choose a career card and land in the search field;
5. enter and clear a query;
6. select each Browse by College Year card, perceive its pressed state and count, and arrive at the library search field;
7. select “All paths,” “All years,” and individual category/year filters and perceive each selected state;
8. combine category, year, and query filters and hear or observe the updated result status;
9. use Clear filters and zero-result recovery, with focus returning to search;
10. reach the four focused search-tool links in reading order;
11. expand and collapse the default resource list;
12. reach every visible resource link;
13. open and close the suggestion dialog, including with Escape;
14. continue through footer navigation without a keyboard trap.

Focus should never disappear behind the sticky header or be indicated only by a subtle color shift.

## Manual accessibility QA checklist

Run this checklist for meaningful interface, content, or styling changes.

### Keyboard

- [ ] Start at the address bar and use only Tab, Shift+Tab, Enter, Space, and Escape.
- [ ] Confirm the skip link is the first useful page control and moves focus to main content.
- [ ] Confirm every control has a visible focus indicator on every background it appears over.
- [ ] Confirm year cards and all filter buttons work with Space and Enter and expose their pressed state.
- [ ] Confirm selecting a Browse by College Year card moves focus to search, while using the explorer's year chips does not move focus unexpectedly.
- [ ] Confirm Clear filters restores the collapsed default state, while empty-state recovery expands all resources; both reset the filters and return focus to search.
- [ ] Confirm the native dialog opens, contains focus, closes by button and Escape, and returns focus sensibly.
- [ ] Confirm there is no keyboard trap and focus order follows the visual reading order.

### Screen reader and semantics

- [ ] Check the page title, language, landmarks, and heading outline.
- [ ] Confirm the search field, Browse by College Year group, and both library filter groups are announced with their visible labels and guidance.
- [ ] Confirm each year card announces its audience, derived resource count, and pressed state.
- [ ] Confirm category cards announce a useful label and count.
- [ ] Confirm result changes are announced once and without excessive repeated content.
- [ ] Confirm a combined category + year + query result status announces all active dimensions clearly.
- [ ] Confirm resource cards have understandable headings, tag-list labels, and new-tab link warnings.
- [ ] Confirm the “Search your way” section, both intent panels, and compact resource names form a logical heading outline and each link announces the destination and new tab.
- [ ] Confirm decorative scenery and icons are absent from the accessibility tree.
- [ ] Confirm the dialog has the “Know a resource we should add?” accessible title.

### Visual and responsive

- [ ] Check normal text, muted text, focus outlines, buttons, chips, and links with a contrast tool.
- [ ] Check at 200% browser zoom and with increased text size.
- [ ] Check desktop, tablet, 390px mobile, and 320px mobile layouts.
- [ ] Confirm navigation and filters can be horizontally scrolled when necessary.
- [ ] Confirm the five Browse by College Year controls fit at desktop/tablet widths, use three columns by 820px, and reflow to two columns at 580px and below without clipped labels, counts, or focus outlines.
- [ ] Confirm focused-search intent panels stack at 820px, compact-card actions remain below their text, and the paired tool cards stack at 580px without clipped copy, links, or focus outlines.
- [ ] Confirm cards, dialog content, focus outlines, and long resource names are not clipped.
- [ ] Confirm there is no unintended horizontal page overflow.

### Motion

- [ ] Enable the operating system's reduced-motion preference before loading the page.
- [ ] Confirm pinwheels, clouds, swirls, trees, target, and path-dot motion are effectively absent.
- [ ] Confirm career-path and college-year card navigation does not smooth-scroll.
- [ ] Confirm all controls and content remain understandable without transitions.

### Links and content

- [ ] Open representative resource links and confirm the named destination is correct.
- [ ] Confirm external links announce that they open in a new tab.
- [ ] Confirm no instruction relies only on color, position, an icon, or animation.
- [ ] Confirm error/empty guidance is clear and provides a recovery action.

## Automated coverage and limits

[`tests/rendered-html.test.mjs`](tests/rendered-html.test.mjs) currently verifies the English document language, the five college-year IDs and labels, valid year assignments, category + year + query composition, the default pressed “All years” control, the labelled “Search your way” section and its canonical links, and safe server-rendered external links. These checks support accessible, predictable result states.

It does not currently run axe, a browser screen reader, contrast analysis, tab-order assertions, zoom checks, or reduced-motion emulation. Treat the manual checklist as required until equivalent automated coverage is added. Review test commands and broader QA expectations in [`TESTING.md`](TESTING.md).
