import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import ts from "typescript";

const rootUrl = new URL("../", import.meta.url);

async function loadResourceData() {
  const sourceUrl = new URL("app/data/resources.ts", rootUrl);
  const source = await readFile(sourceUrl, "utf8");
  const result = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
    fileName: sourceUrl.pathname,
    reportDiagnostics: true,
  });

  const errors = (result.diagnostics ?? []).filter(
    (diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error,
  );
  assert.deepEqual(
    errors.map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n")),
    [],
    "resource data should transpile without syntax errors",
  );

  const moduleUrl = `data:text/javascript;base64,${Buffer.from(result.outputText).toString("base64")}`;
  return import(moduleUrl);
}

async function render() {
  const workerUrl = new URL("dist/server/index.js", rootUrl);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: {
        accept: "text/html",
        "x-forwarded-host": "where-to-look.test",
        "x-forwarded-proto": "https",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

function normalizeSearchText(value) {
  return value
    .toLocaleLowerCase()
    .replace(/[^a-z0-9+#/]+/g, " ")
    .trim();
}

function buildSearch({ categories, resources }) {
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

  const matchesSearchText = (normalizedIndex, normalizedQuery) => {
    if (!normalizedQuery) return true;
    const shortQueryNeedsWholeToken = /^[a-z0-9]{1,2}$/.test(normalizedQuery);

    return shortQueryNeedsWholeToken
      ? ` ${normalizedIndex} `.includes(` ${normalizedQuery} `)
      : normalizedIndex.includes(normalizedQuery);
  };

  return (query, activeCategory = "all", activeCollegeYear = "all") => {
    const normalizedQuery = normalizeSearchText(query);
    const resourcesInScope = resources.filter(
      (resource) =>
        (activeCategory === "all" || resource.categories.includes(activeCategory)) &&
        (activeCollegeYear === "all" ||
          resource.recommendedForYears?.includes(activeCollegeYear)),
    );

    if (!normalizedQuery) return resourcesInScope;

    const directMatches = resourcesInScope.filter((resource) =>
      matchesSearchText(searchIndex.get(resource.id) ?? "", normalizedQuery),
    );

    if (directMatches.length) return directMatches;

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
      resource.categories.some((categoryId) => fallbackCategories.has(categoryId)),
    );
  };
}

function htmlToText(html) {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&apos;|&#x27;|&#39;/gi, "'")
    .replace(/&quot;|&#x22;/gi, '"')
    .replace(/&amp;/gi, "&")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

test("resource data remains complete, unique, and internally consistent", async () => {
  const {
    categories,
    categoryIds,
    collegeYearIds,
    collegeYears,
    featuredResources,
    resources,
    resourceIds,
  } = await loadResourceData();

  assert.equal(categories.length, 13);
  assert.equal(resources.length, 62);
  assert.deepEqual(collegeYearIds, [
    "freshman",
    "sophomore",
    "junior",
    "senior",
    "new-grad",
  ]);
  assert.deepEqual(
    collegeYears.map(({ id }) => id),
    collegeYearIds,
  );
  assert.deepEqual(
    collegeYears.map(({ label }) => label),
    ["Freshman", "Sophomore", "Junior", "Senior", "New Grad"],
  );
  assert.equal(new Set(categories.map(({ id }) => id)).size, categories.length);
  assert.equal(new Set(resources.map(({ id }) => id)).size, resources.length);
  assert.equal(new Set(resources.map(({ url }) => url)).size, resources.length);

  assert.deepEqual(categoryIds, categories.map(({ id }) => id));
  assert.deepEqual(resourceIds, resources.map(({ id }) => id));

  const knownCategoryIds = new Set(categoryIds);
  const knownCollegeYearIds = new Set(collegeYearIds);
  for (const resource of resources) {
    assert.match(resource.url, /^https:\/\/[^\s]+$/i, `${resource.id} must use HTTPS`);
    assert.doesNotThrow(() => new URL(resource.url), `${resource.id} must have a valid URL`);
    assert.ok(resource.name.trim(), `${resource.id} must have a name`);
    assert.ok(resource.description.trim(), `${resource.id} must have a description`);
    assert.ok(resource.bestFor.length > 0, `${resource.id} must explain who it is best for`);
    assert.ok(resource.categories.length > 0, `${resource.id} must have a category`);
    assert.ok(resource.tags.length > 0, `${resource.id} must have at least one tag`);
    assert.ok(resource.tags.length <= 5, `${resource.id} must have no more than five tags`);

    const recommendedForYears = resource.recommendedForYears ?? [];
    assert.equal(
      new Set(recommendedForYears).size,
      recommendedForYears.length,
      `${resource.id} must not repeat a college year`,
    );
    for (const collegeYearId of recommendedForYears) {
      assert.ok(
        knownCollegeYearIds.has(collegeYearId),
        `${resource.id} uses unknown college year ${collegeYearId}`,
      );
    }

    for (const categoryId of resource.categories) {
      assert.ok(knownCategoryIds.has(categoryId), `${resource.id} uses unknown category ${categoryId}`);
    }
  }

  for (const category of categories) {
    assert.ok(
      resources.some((resource) => resource.categories.includes(category.id)),
      `${category.label} must retain at least one resource`,
    );
  }

  for (const collegeYear of collegeYears) {
    assert.ok(
      resources.some((resource) =>
        resource.recommendedForYears?.includes(collegeYear.id),
      ),
      `${collegeYear.label} must retain at least one recommended resource`,
    );
  }

  const expectedFeaturedIds = [
    "applyguy-2027-internships",
    "handshake",
    "jobright",
    "simplify",
  ];
  const actualFeaturedIds = resources
    .filter(({ featured }) => featured)
    .map(({ id }) => id)
    .sort();

  assert.deepEqual(actualFeaturedIds, expectedFeaturedIds);
  assert.deepEqual(featuredResources.map(({ id }) => id).sort(), expectedFeaturedIds);

  const jobrightResources = resources.filter(({ name }) => name === "Jobright.ai");
  assert.equal(jobrightResources.length, 1);
  assert.equal(jobrightResources[0].url, "https://jobright.ai/");
  assert.equal(jobrightResources[0].featured, true);

  const expectedYearAssignments = new Map([
    ["handshake", collegeYearIds],
    ["underclassmen-opportunities", ["freshman", "sophomore"]],
    ["linkedin-jobs", collegeYearIds],
    ["simplify", collegeYearIds],
    ["parker-dewey", collegeYearIds],
    ["ache-administrative-fellowships", ["new-grad"]],
  ]);
  for (const [resourceId, expectedYears] of expectedYearAssignments) {
    const resource = resources.find(({ id }) => id === resourceId);
    assert.deepEqual(
      resource?.recommendedForYears,
      expectedYears,
      `${resourceId} should retain its intentional college-year guidance`,
    );
  }

  const underclassmenResources = resources.filter(
    ({ name }) => name === "Underclassmen Opportunities",
  );
  assert.equal(underclassmenResources.length, 1);
  assert.equal(
    underclassmenResources[0].url,
    "https://github.com/Jose-Gael-Cruz-Lopez/underclassmen-opportunities",
  );
  assert.deepEqual(underclassmenResources[0].categories, ["technology"]);
  assert.equal(underclassmenResources[0].featured, false);

  for (const removedResourceId of [
    "internlist",
    "vansh-summer-2027-internships",
  ]) {
    assert.equal(
      resources.some(({ id }) => id === removedResourceId),
      false,
      `${removedResourceId} should stay out of the audited catalog`,
    );
  }
});

test("search covers the addendum's majors and career directions", async () => {
  const data = await loadResourceData();
  const search = buildSearch(data);
  const requiredQueries = [
    "software",
    "computer science",
    "cybersecurity",
    "IT",
    "AI",
    "data science",
    "product management",
    "actuarial",
    "accounting",
    "finance",
    "banking",
    "business",
    "consulting",
    "sales",
    "HR",
    "healthcare",
    "healthcare management",
    "health administration",
    "hospital administration",
    "healthcare operations",
    "public health",
    "health informatics",
    "nursing",
    "biotech",
    "mechanical engineering",
    "electrical engineering",
    "civil engineering",
    "research",
    "supply chain",
    "logistics",
    "marketing",
    "PR",
    "communications",
    "psychology",
    "human services",
    "nonprofit",
    "government",
    "policy",
    "law",
    "education",
    "teaching",
    "design",
    "UX",
    "real estate",
    "construction management",
    "hospitality",
    "tourism",
    "event management",
    "any major",
  ];

  const missingQueries = requiredQueries.filter((query) => search(query).length === 0);
  assert.deepEqual(missingQueries, [], "every required query should return a useful starting point");

  // Initials should match real aliases, not arbitrary substrings such as the
  // "ai" inside "maintained" or the "pr" inside "professional".
  assert.ok(search("AI").some((resource) => resource.tags.includes("AI / ML")));
  assert.ok(search("IT").some((resource) => resource.id === "ieee-jobs"));
  assert.ok(search("PR").some((resource) => resource.id === "prsa-jobcenter"));
  assert.ok(search("HR").some((resource) => resource.id === "shrm-hr-jobs"));
  assert.ok(search("Jobright.ai").some((resource) => resource.id === "jobright"));

  const civilEngineeringIds = new Set(search("civil engineering").map(({ id }) => id));
  assert.ok(civilEngineeringIds.has("asce-career-connections"));
  assert.ok(civilEngineeringIds.has("cmaa-career-hq"));
});

test("search finds the selected work-setup and compensation tools", async () => {
  const data = await loadResourceData();
  const search = buildSearch(data);
  const expectedMatches = [
    ["remote jobs", "handshake"],
    ["hybrid jobs", "handshake"],
    ["onsite", "handshake"],
    ["in person", "handshake"],
    ["jobs near me", "handshake"],
    ["full time", "handshake"],
    ["part time", "handshake"],
    ["salary filter", "simplify"],
    ["salary range", "simplify"],
    ["compensation", "simplify"],
    ["time zone", "himalayas"],
    ["work from home", "himalayas"],
    ["disclosed salary", "hiringcafe"],
    ["no experience", "hiringcafe"],
    ["minimum salary", "usajobs-early-careers"],
    ["minimum salary", "hiringcafe"],
    ["highest salary", "hiringcafe"],
    ["highest salary", "himalayas"],
  ];

  for (const [query, expectedId] of expectedMatches) {
    assert.ok(
      search(query).some(({ id }) => id === expectedId),
      `${query} should find ${expectedId}`,
    );
  }

  assert.deepEqual(
    search("highest salary").map(({ id }) => id),
    ["usajobs-early-careers", "hiringcafe", "himalayas"],
    "only resources with verified salary-order controls should claim that phrase",
  );
});

test("college-year guidance composes with category and text search", async () => {
  const data = await loadResourceData();
  const search = buildSearch(data);

  assert.equal(search("", "all", "all").length, data.resources.length);

  const technologySophomoreResults = search("", "technology", "sophomore");
  assert.deepEqual(
    technologySophomoreResults.map(({ id }) => id),
    ["simplify", "underclassmen-opportunities"],
  );

  const sophomoreResearchResults = search("research", "all", "sophomore");
  assert.ok(
    sophomoreResearchResults.some(({ id }) => id === "nsf-reu"),
    "a query plus college year should retain a strong sophomore research resource",
  );
  assert.ok(
    sophomoreResearchResults.every((resource) =>
      resource.recommendedForYears?.includes("sophomore"),
    ),
  );

  const combinedResults = search(
    "underclassmen",
    "technology",
    "sophomore",
  );
  assert.deepEqual(combinedResults.map(({ id }) => id), [
    "underclassmen-opportunities",
  ]);
  assert.ok(
    combinedResults.every(
      (resource) =>
        resource.categories.includes("technology") &&
        resource.recommendedForYears?.includes("sophomore"),
    ),
  );

  const newGradHealthcareResults = search(
    "public health",
    "healthcare",
    "new-grad",
  );
  assert.ok(
    newGradHealthcareResults.some(({ id }) => id === "orise-zintellect"),
    "category, query, and college year should compose without bypassing direct matches",
  );
  assert.ok(
    newGradHealthcareResults.every(
      (resource) =>
        resource.categories.includes("healthcare") &&
        resource.recommendedForYears?.includes("new-grad"),
    ),
  );

  assert.equal(
    search("underclassmen", "technology", "junior").length,
    0,
    "year guidance should exclude resources not recommended for the selected year",
  );
});

test("healthcare is visible and supports administration, operations, and care paths", async () => {
  const data = await loadResourceData();
  const search = buildSearch(data);
  const healthcareCategory = data.categories.find(({ id }) => id === "healthcare");
  const healthcareResources = data.resources.filter((resource) =>
    resource.categories.includes("healthcare"),
  );

  assert.equal(healthcareCategory?.label, "Healthcare");
  assert.ok(healthcareResources.length >= 10, "Healthcare should offer a substantial starting set");
  assert.ok(
    healthcareResources.some((resource) => resource.categories.includes("business")),
    "Healthcare management should connect to business and administration",
  );

  const expectedSpecialists = [
    "ache-job-center",
    "ache-administrative-fellowships",
    "mgma-career-center",
    "apha-careermart",
    "amia-career-center",
    "ashp-careerpharm",
    "ana-career-center",
    "cdc-students",
    "biospace-jobs",
  ];
  for (const id of expectedSpecialists) {
    assert.ok(healthcareResources.some((resource) => resource.id === id), `${id} is required`);
  }

  for (const query of [
    "healthcare management",
    "health administration",
    "hospital administration",
    "healthcare operations",
    "public health",
    "health informatics",
  ]) {
    assert.ok(
      search(query).some((resource) => resource.categories.includes("healthcare")),
      `${query} should lead to a healthcare resource`,
    );
  }

  const nursingResults = search("nursing");
  assert.ok(
    nursingResults.some((resource) => resource.id === "ana-career-center"),
    "nursing should resolve to the ANA specialist resource",
  );

  const healthcareManagementResults = search("healthcare management");
  const healthcareManagementIds = new Set(
    healthcareManagementResults.map(({ id }) => id),
  );
  assert.ok(healthcareManagementIds.has("ache-job-center"));
  assert.ok(healthcareManagementIds.has("mgma-career-center"));
  assert.ok(
    healthcareManagementResults.length < healthcareResources.length,
    "a specialist query should not expand to the entire Healthcare category",
  );
});

test("the production page server-renders its content and metadata", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  const text = htmlToText(html);

  assert.match(html, /<html\b[^>]*\blang="en"/i);
  assert.match(html, /<title>Where to Look — Student Career Resource Guide<\/title>/i);
  assert.match(
    html,
    /<meta(?=[^>]*\bname="description")(?=[^>]*\bcontent="A friendly, curated field guide to internship and career resources for college students who are not sure where to start\.")[^>]*>/i,
  );
  assert.match(
    html,
    /<meta(?=[^>]*\bproperty="og:image")(?=[^>]*\bcontent="https:\/\/where-to-look\.test\/og\.png")[^>]*>/i,
  );

  for (const phrase of [
    "Find your next opportunity.",
    "Not sure where to start?",
    "Great places to start",
    "Browse by career path",
    "Browse by college year",
    "Find resources especially useful for your current year. Eligibility varies by opportunity, so always confirm details on the original source.",
    "Search your way",
    "Work where you want",
    "Compare the pay",
    "can sort by Highest salary",
    "Find a useful place to look",
    "A few things worth remembering",
    "Whoopberry curates useful places to search, but individual opportunities are maintained by external services and should be independently verified.",
    "Unexpected coding test? Verify it first.",
    "Was bored lol so I made this",
    "Show all 62 resources",
  ]) {
    assert.ok(text.includes(phrase), `server-rendered page should include “${phrase}”`);
  }

  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
  assert.doesNotMatch(text, /Your site is taking shape|Building your site/i);

  for (const label of [
    "All years",
    "Freshman",
    "Sophomore",
    "Junior",
    "Senior",
    "New Grad",
  ]) {
    assert.ok(text.includes(label), `college-year controls should include “${label}”`);
  }
  for (const [audience, count] of [
    ["Freshmen", 13],
    ["Sophomores", 14],
    ["Juniors", 15],
    ["Seniors", 18],
    ["New Grads", 16],
  ]) {
    assert.ok(
      html.includes(
        `aria-label="Show resources especially useful for ${audience}, ${count} resources"`,
      ),
      `${audience} browse control should expose its derived count`,
    );
  }
  assert.match(
    html,
    /<button\b(?=[^>]*\baria-pressed="true")[^>]*>\s*All years\s*<\/button>/i,
  );

  assert.match(
    html,
    /<section\b(?=[^>]*\bclass="search-tools-section")(?=[^>]*\baria-labelledby="search-tools-title")[^>]*>/i,
  );
  const yearSectionIndex = html.indexOf('id="college-years"');
  const searchToolsIndex = html.indexOf('class="search-tools-section"');
  const librarySectionIndex = html.indexOf('id="resource-library"');
  assert.ok(
    yearSectionIndex < searchToolsIndex && searchToolsIndex < librarySectionIndex,
    "search-tool guidance should render between college-year browsing and the library",
  );

  const searchToolsHtml = html.slice(searchToolsIndex, librarySectionIndex);
  for (const url of [
    "https://joinhandshake.com/students/",
    "https://himalayas.app/jobs",
    "https://hiringcafe.com/",
    "https://intern.usajobs.gov/search/",
  ]) {
    assert.ok(
      searchToolsHtml.includes(`href="${url}"`),
      `search-tool guidance should link to ${url}`,
    );
  }

  assert.match(
    html,
    /<a\b(?=[^>]*\bhref="https:\/\/jobright\.ai\/")(?=[^>]*\btarget="_blank")(?=[^>]*\brel="(?=[^"]*\bnoopener\b)(?=[^"]*\bnoreferrer\b)[^"]*")[^>]*>/i,
  );
  const newTabLinks = html.match(/<a\b(?=[^>]*\btarget="_blank")[^>]*>/gi) ?? [];
  assert.ok(newTabLinks.length >= 4, "resource links should render on the server");
  for (const link of newTabLinks) {
    assert.match(link, /\brel="(?=[^"]*\bnoopener\b)(?=[^"]*\bnoreferrer\b)[^"]*"/i);
  }
});
