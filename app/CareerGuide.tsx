"use client";

import {
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import {
  categories,
  categoryById,
  collegeYearById,
  collegeYears,
  featuredResources,
  resources,
  type CategoryIcon,
  type CategoryId,
  type CollegeYearId,
  type Resource,
  type ResourceId,
} from "./data/resources";

type ActiveCategory = "all" | CategoryId;
type ActiveCollegeYear = "all" | CollegeYearId;

type SearchToolIntent = {
  readonly id: "work" | "pay";
  readonly label: string;
  readonly title: string;
  readonly description: string;
  readonly resourceIds: readonly ResourceId[];
};

function normalizeSearchText(value: string) {
  return value
    .toLocaleLowerCase()
    .replace(/[^a-z0-9+#/]+/g, " ")
    .trim();
}

const iconLabels: Record<CategoryIcon, string> = {
  code: "</>",
  coins: "$",
  briefcase: "▰",
  care: "+",
  gear: "✣",
  flask: "△",
  boxes: "▦",
  megaphone: "))",
  palette: "◒",
  capitol: "⌂",
  book: "Ⅱ",
  heart: "♥",
  paths: "↝",
};

function formatMark(format: Resource["format"]) {
  const normalized = format.toLocaleLowerCase();
  if (normalized.includes("github")) return "LIST";
  if (normalized.includes("government")) return "GOV";
  if (normalized.includes("research")) return "LAB";
  if (normalized.includes("association")) return "PRO";
  if (normalized.includes("university")) return "CAMPUS";
  if (normalized.includes("internship")) return "INTERN";
  if (normalized.includes("program")) return "PATH";
  return "JOBS";
}

// Resource fields are indexed separately from broad category keywords so a
// specific query such as “PR” or “nursing” returns specialist sources first.
const searchIndex = new Map(
  resources.map((resource) => [
    resource.id,
    normalizeSearchText(
      [
        resource.name,
        resource.description,
        resource.format,
        ...resource.tags,
        ...resource.bestFor,
        ...(resource.searchTerms ?? []),
      ].join(" "),
    ),
  ]),
);

const categorySearchIndex = new Map(
  categories.map((category) => [
    category.id,
    normalizeSearchText(
      [category.label, category.shortLabel, ...category.keywords].join(" "),
    ),
  ]),
);

const resourceById = new Map<ResourceId, Resource>(
  resources.map((resource) => [resource.id, resource] as const),
);

const searchToolIntents = [
  {
    id: "work",
    label: "REMOTE · HYBRID · ONSITE · LOCATION",
    title: "Work where you want",
    description:
      "Handshake combines student-focused city or ZIP, distance, work setup, and job-type filters. Himalayas adds remote-only country or time-zone, entry-level, internship, salary-range, and salary-sorting controls.",
    resourceIds: ["handshake", "himalayas"],
  },
  {
    id: "pay",
    label: "SALARY · COMPENSATION · PAY",
    title: "Compare the pay",
    description:
      "HiringCafe combines location and work setup with minimum-salary and disclosed-pay filters, then can sort by Highest salary. USAJOBS adds the same named sort for official federal openings.",
    resourceIds: ["hiringcafe", "usajobs-early-careers"],
  },
] as const satisfies readonly SearchToolIntent[];

function matchesSearchText(normalizedIndex: string, normalizedQuery: string) {
  if (!normalizedQuery) return true;
  const shortQueryNeedsWholeToken = /^[a-z0-9]{1,2}$/.test(normalizedQuery);

  return shortQueryNeedsWholeToken
    ? (" " + normalizedIndex + " ").includes(" " + normalizedQuery + " ")
    : normalizedIndex.includes(normalizedQuery);
}

function filterResources(
  query: string,
  activeCategory: ActiveCategory,
  activeCollegeYear: ActiveCollegeYear,
) {
  const normalizedQuery = normalizeSearchText(query);
  const resourcesInScope = resources.filter(
    (resource: Resource) =>
      (activeCategory === "all" ||
        resource.categories.includes(activeCategory)) &&
      (activeCollegeYear === "all" ||
        resource.recommendedForYears?.includes(activeCollegeYear)),
  );

  if (!normalizedQuery) return resourcesInScope;

  const directMatches = resourcesInScope.filter((resource) =>
    matchesSearchText(searchIndex.get(resource.id) ?? "", normalizedQuery),
  );

  if (directMatches.length) return directMatches;

  // Category aliases are a fallback only when no resource-specific result
  // exists; this preserves broad discovery without diluting precise searches.
  const fallbackCategories = new Set(
    categories
      .filter((category) =>
        matchesSearchText(
          categorySearchIndex.get(category.id) ?? "",
          normalizedQuery,
        ),
      )
      .map((category) => category.id),
  );

  return resourcesInScope.filter((resource) =>
    resource.categories.some((categoryId) =>
      fallbackCategories.has(categoryId),
    ),
  );
}

function Pinwheel({
  className = "",
  speed = "18s",
}: {
  className?: string;
  speed?: string;
}) {
  return (
    <span
      className={`pinwheel ${className}`}
      style={{ "--spin-speed": speed } as CSSProperties}
      aria-hidden="true"
    >
      <span className="pinwheel__stick" />
      <span className="pinwheel__wheel">
        <i />
        <i />
        <i />
        <i />
        <b />
      </span>
    </span>
  );
}

function Tree({ className = "" }: { className?: string }) {
  return (
    <span className={`tree ${className}`} aria-hidden="true">
      <i />
      <i />
      <i />
      <b />
    </span>
  );
}

function CategoryMark({ icon }: { icon: CategoryIcon }) {
  return (
    <span className={`category-mark category-mark--${icon}`} aria-hidden="true">
      {iconLabels[icon]}
    </span>
  );
}

function ResourceCard({
  resource,
  featured = false,
}: {
  resource: Resource;
  featured?: boolean;
}) {
  return (
    <article
      className={`resource-card${featured ? " resource-card--featured" : ""}`}
    >
      <div className="resource-card__topline">
        <span className="format-mark">{formatMark(resource.format)}</span>
        <span className="resource-format">{resource.format}</span>
        {resource.updateFrequency ? (
          <span className="update-badge">
            <i aria-hidden="true" /> {resource.updateFrequency}
          </span>
        ) : null}
      </div>

      <div className="resource-card__copy">
        <h3>{resource.name}</h3>
        <p>{resource.description}</p>
      </div>

      <div className="best-for">
        <span>Best for</span>
        <p>{resource.bestFor.join(" · ")}</p>
      </div>

      <div className="resource-card__footer">
        <ul className="tag-list" aria-label={`${resource.name} tags`}>
          {resource.tags.slice(0, featured ? 3 : 4).map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <a
          className="resource-link"
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${resource.name} (opens in a new tab)`}
        >
          Visit <span aria-hidden="true">↗</span>
        </a>
      </div>
      {resource.notes ? <p className="resource-note">{resource.notes}</p> : null}
    </article>
  );
}

function SearchToolCard({ resource }: { resource: Resource }) {
  return (
    <article className="search-tool-card">
      <div className="search-tool-card__topline">
        <span className="format-mark">{formatMark(resource.format)}</span>
        <span className="resource-format">{resource.format}</span>
      </div>
      <h4>{resource.name}</h4>
      <p>{resource.description}</p>
      <a
        className="resource-link"
        href={resource.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${resource.name} (opens in a new tab)`}
      >
        Visit <span aria-hidden="true">↗</span>
      </a>
    </article>
  );
}

export default function CareerGuide() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<ActiveCategory>("all");
  const [activeCollegeYear, setActiveCollegeYear] =
    useState<ActiveCollegeYear>("all");
  const [showAllResources, setShowAllResources] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);
  const suggestionDialog = useRef<HTMLDialogElement>(null);

  const filteredResources = useMemo(
    () => filterResources(query, activeCategory, activeCollegeYear),
    [activeCategory, activeCollegeYear, query],
  );

  const isDefaultView =
    activeCategory === "all" &&
    activeCollegeYear === "all" &&
    query.trim().length === 0;
  const visibleResources =
    isDefaultView && !showAllResources
      ? filteredResources.slice(0, 12)
      : filteredResources;

  const moveToLibraryAndFocusSearch = () => {
    window.requestAnimationFrame(() => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      document
        .getElementById("resource-library")
        ?.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      searchInput.current?.focus({ preventScroll: true });
    });
  };

  const chooseCategory = (categoryId: CategoryId) => {
    setActiveCategory(categoryId);
    setShowAllResources(false);
    moveToLibraryAndFocusSearch();
  };

  const updateCollegeYear = (collegeYearId: ActiveCollegeYear) => {
    setActiveCollegeYear(collegeYearId);
    setShowAllResources(false);
  };

  const chooseCollegeYear = (collegeYearId: CollegeYearId) => {
    updateCollegeYear(collegeYearId);
    moveToLibraryAndFocusSearch();
  };

  const resetExplorer = () => {
    setQuery("");
    setActiveCategory("all");
    setActiveCollegeYear("all");
    setShowAllResources(false);
  };

  const resetExplorerAndFocus = () => {
    resetExplorer();
    window.requestAnimationFrame(() => searchInput.current?.focus());
  };

  const showEveryResource = () => {
    setQuery("");
    setActiveCategory("all");
    setActiveCollegeYear("all");
    setShowAllResources(true);
    window.requestAnimationFrame(() => searchInput.current?.focus());
  };

  const clearSearch = () => {
    setQuery("");
    setShowAllResources(false);
    window.requestAnimationFrame(() => searchInput.current?.focus());
  };

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>

      <header className="site-header">
        <div className="nav-shell">
          <a className="brand" href="#home" aria-label="Where to Look home">
            <span className="brand-mark" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
              <b />
            </span>
            <span>whoopberry</span>
          </a>
          <nav aria-label="Primary navigation">
            <a href="#start-here">Start here</a>
            <a href="#categories">Paths</a>
            <a href="#resource-library">Resources</a>
            <a href="#tips">Tips</a>
            <a href="#about">About</a>
          </nav>
        </div>
      </header>

      <main id="main-content">
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero__sky" aria-hidden="true">
            <span className="cloud cloud--one">
              <i />
              <i />
              <i />
            </span>
            <span className="cloud cloud--two">
              <i />
              <i />
              <i />
            </span>
            <span className="wind-swirl wind-swirl--one" />
            <span className="wind-swirl wind-swirl--two" />
          </div>

          <div className="page-shell hero__grid">
            <div className="hero__copy">
              <p className="eyebrow">
                <span aria-hidden="true">✦</span> A field guide for students
              </p>
              <h1 id="hero-title">
                Find your next <em>opportunity.</em>
              </h1>
              <p className="hero__intro">
                A simple collection of internship and career resources for
                students who don&apos;t know where to start.
              </p>
              <p className="hero__aside">
                Pick your path. We&apos;ll point you toward the places worth
                checking.
              </p>
              <div className="hero__actions">
                <a className="button button--primary" href="#resource-library">
                  Browse resources <span aria-hidden="true">↓</span>
                </a>
                <a className="button button--secondary" href="#start-here">
                  Show me how
                </a>
              </div>
              <div className="hero__proof" aria-label="Directory highlights">
                <span><b>{resources.length}</b> reliable starting points</span>
                <span><b>{categories.length}</b> career paths</span>
                <span><b>0</b> copied job listings</span>
              </div>
            </div>

            <div className="hero-scene" aria-hidden="true">
              <span className="scene-sun">
                <i />
                <i />
                <i />
                <i />
              </span>
              <span className="scene-hill scene-hill--back" />
              <span className="scene-hill scene-hill--front" />
              <span className="scene-path" />
              <span className="target">
                <i />
                <b />
              </span>
              <span className="path-dot path-dot--one" />
              <span className="path-dot path-dot--two" />
              <span className="path-dot path-dot--three" />
              <Tree className="tree--hero-left" />
              <Tree className="tree--hero-right" />
              <Pinwheel className="pinwheel--hero" speed="16s" />
              <span className="scene-sign">
                <i>START HERE</i>
                <b />
              </span>
              <span className="scene-flower scene-flower--one">✦</span>
              <span className="scene-flower scene-flower--two">✦</span>
              <span className="scene-flower scene-flower--three">✦</span>
            </div>
          </div>

          <div className="hero__ground" aria-hidden="true" />
        </section>

        <section className="start-section" id="start-here" aria-labelledby="start-title">
          <div className="page-shell start-card">
            <div className="start-card__intro">
              <span className="section-stamp">START HERE</span>
              <h2 id="start-title">Not sure where to start?</h2>
              <p>
                That&apos;s normal. Your first search session can be small and
                useful—no giant spreadsheet required.
              </p>
            </div>
            <ol className="path-steps">
              <li>
                <span>1</span>
                <p><b>Pick a broad path.</b> Choose the closest match, not the perfect one.</p>
              </li>
              <li>
                <span>2</span>
                <p><b>Open 2–3 resources.</b> Learn what a useful listing looks like.</p>
              </li>
              <li>
                <span>3</span>
                <p><b>Check them regularly.</b> A short routine beats a frantic scroll.</p>
              </li>
              <li>
                <span>4</span>
                <p><b>Save searches or alerts.</b> Let the right openings come to you.</p>
              </li>
              <li>
                <span>5</span>
                <p><b>Confirm on the employer site.</b> Apply there whenever possible.</p>
              </li>
            </ol>
          </div>
        </section>

        <section className="featured-section" aria-labelledby="featured-title">
          <div className="page-shell">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow">THE SHORTLIST</p>
                <h2 id="featured-title">Great places to start</h2>
              </div>
              <p>
                Five broad, student-friendly starting points when you just want
                to get moving.
              </p>
            </div>
            <div className="featured-grid">
              {featuredResources.map((resource) => (
                <ResourceCard resource={resource} featured key={resource.id} />
              ))}
            </div>
          </div>
        </section>

        <section className="category-section" id="categories" aria-labelledby="categories-title">
          <div className="category-ribbon" aria-hidden="true">
            <span>CHOOSE A PATH</span>
            <span>✦</span>
            <span>CHOOSE A PATH</span>
            <span>✦</span>
            <span>CHOOSE A PATH</span>
          </div>
          <div className="page-shell">
            <div className="section-heading section-heading--centered">
              <p className="eyebrow">WHERE ARE YOU HEADED?</p>
              <h2 id="categories-title">Browse by career path</h2>
              <p>
                Choose the path that sounds closest. You can switch at any time.
              </p>
            </div>
            <div className="category-grid">
              {categories.map((category, index) => {
                const count = filterResources(
                  query,
                  category.id,
                  activeCollegeYear,
                ).length;

                return (
                  <button
                    className="category-card"
                    data-tone={(index % 5) + 1}
                    key={category.id}
                    type="button"
                    onClick={() => chooseCategory(category.id)}
                    aria-label={`Show ${category.label} resources, ${count} ${count === 1 ? "resource" : "resources"}`}
                  >
                    <CategoryMark icon={category.icon} />
                    <span className="category-card__copy">
                      <b>{category.label}</b>
                      <small>{category.description}</small>
                    </span>
                    <span className="category-count" aria-hidden="true">
                      {count} {count === 1 ? "place" : "places"} <i>→</i>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section
          className="year-section"
          id="college-years"
          aria-labelledby="college-years-title"
        >
          <div className="page-shell year-panel">
            <div className="year-panel__copy">
              <p className="eyebrow">START WHERE YOU ARE</p>
              <h2 id="college-years-title">Browse by college year</h2>
              <p id="college-year-guidance">
                Find resources especially useful for your current year.
                Eligibility varies by opportunity, so always confirm details
                on the original source.
              </p>
            </div>
            <fieldset
              className="year-browse-group"
              aria-describedby="college-year-guidance"
            >
              <legend>Choose your year</legend>
              <div className="year-browse-list">
                {collegeYears.map((collegeYear, index) => {
                  const count = filterResources(
                    query,
                    activeCategory,
                    collegeYear.id,
                  ).length;

                  return (
                    <button
                      className={
                        activeCollegeYear === collegeYear.id ? "is-active" : ""
                      }
                      data-tone={(index % 5) + 1}
                      key={collegeYear.id}
                      type="button"
                      aria-pressed={activeCollegeYear === collegeYear.id}
                      aria-label={`Show resources especially useful for ${collegeYear.audienceLabel}, ${count} ${count === 1 ? "resource" : "resources"}`}
                      onClick={() => chooseCollegeYear(collegeYear.id)}
                    >
                      <b>{collegeYear.label}</b>
                      <span>
                        {count} {count === 1 ? "resource" : "resources"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>
        </section>

        <section
          className="search-tools-section"
          aria-labelledby="search-tools-title"
        >
          <div className="page-shell">
            <div className="section-heading section-heading--split">
              <div>
                <p className="eyebrow">A MORE FOCUSED SEARCH</p>
                <h2 id="search-tools-title">Search your way</h2>
              </div>
              <p>
                Already know what matters most? These external tools help you
                narrow opportunities by where you work, how you work, or what
                they pay.
              </p>
            </div>

            <div className="search-intent-grid">
              {searchToolIntents.map((intent) => (
                <section
                  className={`search-intent search-intent--${intent.id}`}
                  aria-labelledby={`search-intent-${intent.id}`}
                  key={intent.id}
                >
                  <div className="search-intent__heading">
                    <span
                      className={`search-intent-mark search-intent-mark--${intent.id}`}
                      aria-hidden="true"
                    >
                      <i />
                      <b />
                    </span>
                    <div>
                      <p>{intent.label}</p>
                      <h3 id={`search-intent-${intent.id}`}>{intent.title}</h3>
                    </div>
                  </div>
                  <p className="search-intent__description">
                    {intent.description}
                  </p>
                  <div className="search-tool-list">
                    {intent.resourceIds.map((resourceId) => {
                      const resource = resourceById.get(resourceId);

                      return resource ? (
                        <SearchToolCard
                          resource={resource}
                          key={resource.id}
                        />
                      ) : null;
                    })}
                  </div>
                </section>
              ))}
            </div>
            <p className="search-tools-note">
              Filters and pay details belong to each external service and can
              change. Confirm the final work setup and compensation on the
              original listing.
            </p>
          </div>
        </section>

        <section
          className="library-section"
          id="resource-library"
          aria-labelledby="library-title"
        >
          <div className="page-shell">
            <div className="library-heading">
              <div>
                <p className="eyebrow">THE FULL FIELD GUIDE</p>
                <h2 id="library-title">Find a useful place to look</h2>
              </div>
              <p>
                Search by major, role, or topic, then narrow the list by career
                path and college year.
              </p>
            </div>

            <div className="explorer-panel">
              <div className="search-field">
                <label htmlFor="resource-search">Search the guide</label>
                <span className="search-input-wrap">
                  <i aria-hidden="true" />
                  <input
                    id="resource-search"
                    ref={searchInput}
                    type="search"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setShowAllResources(false);
                    }}
                    placeholder="Try ‘healthcare’, ‘civil engineering’, or ‘PR’…"
                    autoComplete="off"
                  />
                  {query ? (
                    <button
                      type="button"
                      onClick={clearSearch}
                      aria-label="Clear search"
                    >
                      ×
                    </button>
                  ) : null}
                </span>
              </div>

              <div className="filter-stack">
                <fieldset className="filter-group">
                  <legend className="filter-label">Filter by career path</legend>
                  <div className="filter-list">
                    <button
                      type="button"
                      className={activeCategory === "all" ? "is-active" : ""}
                      aria-pressed={activeCategory === "all"}
                      onClick={() => {
                        setActiveCategory("all");
                        setShowAllResources(false);
                      }}
                    >
                      All paths
                    </button>
                    {categories.map((category) => (
                      <button
                        type="button"
                        key={category.id}
                        className={activeCategory === category.id ? "is-active" : ""}
                        aria-pressed={activeCategory === category.id}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setShowAllResources(false);
                        }}
                      >
                        {category.shortLabel}
                      </button>
                    ))}
                  </div>
                </fieldset>

                <fieldset
                  className="filter-group"
                  aria-describedby="college-year-guidance"
                >
                  <legend className="filter-label">Filter by college year</legend>
                  <div className="filter-list filter-list--years">
                    <button
                      type="button"
                      className={activeCollegeYear === "all" ? "is-active" : ""}
                      aria-pressed={activeCollegeYear === "all"}
                      onClick={() => updateCollegeYear("all")}
                    >
                      All years
                    </button>
                    {collegeYears.map((collegeYear) => (
                      <button
                        type="button"
                        key={collegeYear.id}
                        className={
                          activeCollegeYear === collegeYear.id ? "is-active" : ""
                        }
                        aria-pressed={activeCollegeYear === collegeYear.id}
                        onClick={() => updateCollegeYear(collegeYear.id)}
                      >
                        {collegeYear.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>

            <div className="results-line">
              <p role="status" aria-live="polite" aria-atomic="true">
                {isDefaultView && !showAllResources ? (
                  <>
                    Showing <b>{visibleResources.length}</b> of{" "}
                    <b>{filteredResources.length}</b> resources
                  </>
                ) : (
                  <>
                    <b>{filteredResources.length}</b>{" "}
                    {filteredResources.length === 1 ? "resource" : "resources"}
                    {activeCategory !== "all" ? (
                      <> for <strong>{categoryById[activeCategory].label}</strong></>
                    ) : null}
                    {activeCollegeYear !== "all" ? (
                      <>
                        {" "}especially useful for{" "}
                        <strong>
                          {collegeYearById[activeCollegeYear].audienceLabel}
                        </strong>
                      </>
                    ) : null}
                    {query.trim() ? <> matching “{query.trim()}”</> : null}
                  </>
                )}
              </p>
              {activeCategory !== "all" ||
              activeCollegeYear !== "all" ||
              query ? (
                <button type="button" onClick={resetExplorerAndFocus}>
                  Clear filters
                </button>
              ) : null}
            </div>

            {filteredResources.length ? (
              <div className="resource-grid" id="resource-results">
                {visibleResources.map((resource) => (
                  <ResourceCard resource={resource} key={resource.id} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <span className="empty-target" aria-hidden="true"><i /></span>
                <h3>No path found—yet.</h3>
                <p>
                  Try a broader word, another career path or college year, or
                  clear your filters and start again.
                </p>
                <button
                  className="button button--primary"
                  type="button"
                  onClick={showEveryResource}
                >
                  Show every resource
                </button>
              </div>
            )}
            {isDefaultView && filteredResources.length > 12 ? (
              <div className="show-more-wrap">
                <button
                  className="button button--secondary"
                  type="button"
                  aria-controls="resource-results"
                  aria-expanded={showAllResources}
                  onClick={() => setShowAllResources((current) => !current)}
                >
                  {showAllResources ? (
                    <>Show the first 12 resources</>
                  ) : (
                    <>Show all {filteredResources.length} resources</>
                  )}{" "}
                  <span aria-hidden="true">{showAllResources ? "↑" : "↓"}</span>
                </button>
                <p>
                  {showAllResources
                    ? "Return to the quick starting set."
                    : "The shortlist above is only the beginning."}
                </p>
              </div>
            ) : null}
          </div>
        </section>

        <section className="tips-section" id="tips" aria-labelledby="tips-title">
          <div className="page-shell">
            <div className="tips-board">
              <div className="tips-board__heading">
                <span className="section-stamp">A NOTE FOR YOUR SEARCH</span>
                <h2 id="tips-title">A few things worth remembering</h2>
                <p>Keep it simple, consistent, and wider than one job board.</p>
                <span className="paperclip" aria-hidden="true" />
              </div>
              <ul className="tip-list">
                <li><span>01</span><div><b>Apply early.</b><p>Openings can close long before their listed deadline.</p></div></li>
                <li><span>02</span><div><b>Use several sources.</b><p>Two or three good tabs beat endlessly refreshing one.</p></div></li>
                <li><span>03</span><div><b>Turn on alerts.</b><p>Saved searches make a regular routine much easier.</p></div></li>
                <li><span>04</span><div><b>Check the source.</b><p>When possible, apply through the employer&apos;s careers page.</p></div></li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-section" id="about" aria-labelledby="about-title">
          <div className="page-shell about-card">
            <div className="about-target" aria-hidden="true"><i /><b /></div>
            <div>
              <p className="eyebrow">WHY THIS EXISTS</p>
              <h2 id="about-title">Was bored lol so I made this</h2>
            </div>
            <p>
              Whoopberry organizes useful career resources in one place so
              students can spend less time figuring out where to search. Its very useful trust 😤🥴😎
            </p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-sky" aria-hidden="true">
          <span className="footer-swirl" />
          <Tree className="tree--footer-one" />
          <Tree className="tree--footer-two" />
          <Pinwheel className="pinwheel--footer" speed="23s" />
          <span className="footer-flower footer-flower--one">✦</span>
          <span className="footer-flower footer-flower--two">✦</span>
        </div>
        <div className="footer-hill footer-hill--back" aria-hidden="true" />
        <div className="footer-hill footer-hill--front" aria-hidden="true" />
        <div className="page-shell footer-content">
          <a className="brand brand--footer" href="#home">
            <span className="brand-mark" aria-hidden="true">
              <i /><i /><i /><i /><b />
            </span>
            <span>whoopberry</span>
          </a>
          
          <nav aria-label="Footer navigation">
            <a href="#about">About</a>
            <a href="#resource-library">Resources</a>
            <button
              type="button"
              onClick={() => suggestionDialog.current?.showModal()}
            >
              Suggest a resource
            </button>
          </nav>
          <small>Curated links, not copied listings. © {new Date().getFullYear()}.</small>
        </div>
      </footer>

      <dialog
        className="suggest-dialog"
        ref={suggestionDialog}
        aria-labelledby="suggest-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}
      >
        <div className="dialog-card">
          <form method="dialog">
            <button className="dialog-close" aria-label="Close dialog">×</button>
          </form>
          <span className="dialog-pin" aria-hidden="true">✦</span>
          <p className="eyebrow">GOOD FINDS ARE WELCOME</p>
          <h2 id="suggest-title">Know a resource we should add?</h2>
          <p>
            A contact method hasn&apos;t been configured yet. When one is added,
            this space will explain exactly how to send a suggestion—no mystery
            inboxes or made-up addresses.
          </p>
          <form method="dialog">
            <button className="button button--primary">Got it</button>
          </form>
        </div>
      </dialog>
    </>
  );
}
