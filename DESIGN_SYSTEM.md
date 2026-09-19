# Design System

Where to Look combines approximately **75% clear, modern utility with 25% playful illustrated character**. Content hierarchy, search, and readable resource cards come first; the illustrated landscape makes the experience warm and memorable without becoming the interface itself.

The design is cheerful, calm, youthful, and useful—whimsical, not childish. [`app/globals.css`](app/globals.css) is the single global stylesheet and contains the tokens, components, illustrations, motion, responsive rules, reduced-motion override, and print treatment.

## Color system

All root tokens are defined in `:root`.

| Token | Value | Current role |
| --- | --- | --- |
| `--navy` | `#183553` | Primary text, outlines, dark buttons, and structural contrast |
| `--navy-2` | `#244b6d` | Secondary dark text |
| `--cream` | `#fff9ed` | Main page canvas and light button surface |
| `--paper` | `#fffdf8` | Cards, panels, and light foreground surfaces |
| `--sky` | `#b9e0f2` | Hero/footer sky and blue accents |
| `--sky-pale` | `#e4f4fa` | Resource-library background and soft blue accents |
| `--pink` | `#f5b5c8` | Cotton-candy accents and offset shadows |
| `--pink-pale` | `#fbe0e8` | Category section, featured card, and hover surfaces |
| `--coral` | `#ec6c61` | Interactive accents, dotted paths, and dark-button shadow |
| `--coral-dark` | `#bc4842` | Emphasis text and focus outline |
| `--mint` | `#bae7cc` | Illustrated hills and green-blue accents |
| `--mint-pale` | `#e2f5e9` | About panel, featured card, and status surface |
| `--green` | `#66ad7b` | Foreground hills and tree foliage |
| `--green-dark` | `#397b55` | Verified-status text and dot |
| `--lavender` | `#c9bced` | Pinwheel and category accents |
| `--lavender-pale` | `#eee9fb` | Tips board and soft lavender accents |
| `--yellow` | `#f7d778` | Sun, stamps, format labels, and small highlights |
| `--line` | `#183553` | Defined structural-line alias; currently not referenced beyond its declaration |
| `--muted` | `#50687c` | Supporting copy on light backgrounds |
| `--shadow` | `7px 8px 0 rgba(24, 53, 83, 0.13)` | Large offset card shadow |
| `--shadow-small` | `4px 5px 0 rgba(24, 53, 83, 0.12)` | Compact offset card shadow |
| `--radius-lg` | `28px` | Large panels and empty states |
| `--radius-md` | `19px` | Resource cards |
| `--page` | `min(1180px, calc(100% - 40px))` | Maximum content width and desktop gutters |

The palette relies on dark navy text and outlines over very light pastel surfaces. Preserve that foreground/background relationship. Do not place small pastel text on another pastel or assume hue alone communicates a state. Contrast-check any new token pairing, especially at normal text sizes.

The only gradient constructs the recognizable radial bullseye used for target ornaments; most surfaces are flat colors.

## Typography

No hosted webfont is loaded.

- **Body and interface:** `"Avenir Next", Avenir, "Segoe UI", Helvetica, Arial, sans-serif`
- **Display and card headings:** `Georgia, "Times New Roman", serif`

The serif face carries editorial warmth in the hero, section titles, resource names, numbered steps, and small numeric emphasis. The sans-serif face handles body copy, labels, navigation, controls, and metadata.

Current hierarchy:

- Hero title: `clamp(4.1rem, 7vw, 6.9rem)` on wide screens, with smaller responsive clamps.
- Section titles: generally `clamp(2.35rem, 4vw, 4.2rem)`.
- Resource titles: `clamp(1.46rem, 2vw, 1.82rem)`.
- Eyebrows, stamps, formats, and tags: compact, bold, uppercase, and letter-spaced.
- Body text: 16px base with a 1.55 line height.

Use the serif sparingly for hierarchy, not for long paragraphs or controls. Preserve balanced headings and readable supporting copy.

## Layout and surfaces

- The default content shell is capped at 1180px with 20px side gutters.
- Sections alternate cream, pale pink, and pale blue to make a long single page easy to scan.
- Structural elements use 1.5–2px navy borders, large rounded corners, and crisp offset shadows rather than blurred floating panels.
- Slight rotations, paper-tape shapes, a paperclip, stamped labels, and dashed paths create an editorial field-guide feel.
- Content grids use generous gaps and collapse predictably rather than compressing cards.

The result should feel tactile but not busy. Keep the resource library visually calmer than the hero artwork.

## Illustration language

The visible scenery is built from semantic-neutral `<span>`, `<i>`, and `<b>` elements plus CSS borders, fills, border radii, pseudo-elements, and transforms. It includes:

- cotton-candy clouds;
- rotating pinwheels;
- wind swirls;
- trees and rolling mint/green hills;
- a sun;
- a winding discovery path and moving path dots;
- bullseye targets;
- a “Start Here” sign;
- small flowers or sparkles.

These elements are decorative and marked `aria-hidden="true"` by their React components or containing scene. They should never carry required information. The product currently uses no inline SVG illustrations; `public/og.png` and `public/favicon.png` are raster metadata assets rather than in-page scenery.

New artwork should reuse CSS shapes and the existing palette when practical. Avoid introducing a separate illustration style, photorealism, or decorative assets that compete with resource content.

## Component styling

### Navigation

The sticky header uses a translucent cream surface, subtle bottom border, and 14px backdrop blur. The brand includes a small rotating pinwheel. Navigation links reveal a coral underline on hover and focus. At the narrowest breakpoint, the link row scrolls horizontally.

### Buttons and links

Primary and secondary buttons are pill-shaped, at least 50px tall, outlined, and use crisp offset shadows. Hover moves the button two pixels and shortens its shadow. Resource links are compact dark pills that switch to coral on hover.

Use the existing primary button for the main action and the cream secondary button for supporting actions. Do not create multiple competing accent styles.

### Resource cards

Resource cards use paper backgrounds, navy outlines, 19px corners, small offset shadows, and a restrained hover lift. Their order is:

1. format mark, source type, and optional update badge;
2. resource name and description;
3. “Best for” guidance;
4. tags and external action;
5. optional editorial note.

Featured cards are larger, use alternating pale backgrounds and tiny resting rotations, and show three tags instead of four.

### Category cards

Category cards are button elements with an original CSS mark, title, description, and derived count. Five repeating pastel tones provide rhythm without encoding category meaning. Hover lifts the card and moves its arrow.

### Search and filters

The Browse by College Year section is a bordered paper panel with explanatory copy and five native button cards. The cards use the existing pastel sequence, show their derived resource counts, and switch to navy with cream text, a coral offset shadow, and a visible checkmark when pressed.

The explorer is a paper panel with a visible label above a pill search input and separate fieldset/legend groups for career-path and college-year chips. Category, year, and query states compose. Active chips use navy with cream text, a coral offset shadow, and a visible checkmark. The result line reflects all active dimensions, and reset actions return the explorer to All paths, All years, an empty query, and the first 12 resources. Mobile filter-chip rows remain independently horizontally scrollable.

### Guidance panels and dialog

The Start Here sequence uses numbered pastel circles and a dashed coral route. The tips board resembles clipped stationery. The About panel pairs a target illustration with short product copy. The suggestion dialog uses the same cream, navy, pink-shadow, and rounded-card vocabulary.

## Motion system

Motion is decorative or confirmatory; it never carries required content. Animations are CSS-based, use small transforms, and do not run JavaScript animation loops.

| Motion | Timing |
| --- | --- |
| Brand pinwheel | 16s linear infinite rotation |
| Hero pinwheel | 16s linear infinite rotation |
| Footer pinwheel | 23s linear infinite rotation |
| Hovered pinwheel wheel | 2.4s rotation duration |
| Clouds | 8s and 10s alternating drifts |
| Wind swirls | 7s and 8.5s alternating drifts |
| Target | 5.5s gentle scale cycle |
| Path dots | 2.5s vertical cycle with staggered delays |
| Trees | 5s alternating sway with optional delay |
| Control and hover transitions | approximately 140–180ms |

The `prefers-reduced-motion: reduce` block changes document scrolling to `auto`, reduces all animation and transition durations to `0.001ms`, and limits animations to one iteration. Career-path and college-year card navigation separately chooses `auto` instead of `smooth` when the same media query matches.

When adding motion:

- animate `transform`, `translate`, `rotate`, or opacity rather than layout properties where possible;
- keep movement slow and low-amplitude;
- do not animate text needed for reading;
- ensure the final state is useful when animation is removed;
- include the behavior in the reduced-motion audit.

## Responsive rules

The stylesheet has breakpoints at 1050px, 820px, and 580px.

- **Above 1050px:** two-column hero, four-column category grid, three-column resource grid, and two-column featured grid.
- **1050px and below:** the hero remains two-column at narrower proportions; categories move to three columns, resources to two columns, the Start Here introduction and Browse by College Year panel stack, and the footer grid simplifies.
- **820px and below:** the hero and featured cards become one-column; categories use two columns; the college-year cards use three columns; and the search/filter panel, Start Here steps, and tips board stack. The About panel keeps its target and heading side by side while its body copy moves below them.
- **580px and below:** 12px page gutters, single-column categories and resources, a two-column Browse by College Year card grid, full-width hero actions and resource links, horizontal navigation/filter scrolling, simplified scenery, one-column tips/footer, and tighter panels.

`html` clips horizontal overflow and `body` hides it as a final guard, but individual components should still be sized correctly. Test at 320px rather than relying on the overflow guard.

When changing the year controls, verify that all five labels and counts fit without clipping at desktop, tablet, 390px, and 320px widths; that each library filter row scrolls independently on mobile; and that active, hover, focus, and reduced-motion states remain consistent with the existing control language.

## Patterns to avoid

- a generic purple SaaS palette or unrelated neon accents;
- excessive glassmorphism or blurred floating surfaces;
- gratuitous surface or background gradients that do not construct a recognizable motif;
- deep dashboards, sidebars, dense tables, or enterprise chrome;
- visual clutter that competes with names and descriptions;
- stock illustrations that conflict with the CSS landscape;
- continuous large-amplitude movement, parallax, or auto-playing media;
- playful styling on every element; the 75/25 balance is intentional;
- state communicated by color alone.

For interaction and assistive-technology requirements, also read [`ACCESSIBILITY.md`](ACCESSIBILITY.md).
