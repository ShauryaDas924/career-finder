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

  return (query, activeCategory = "all") => {
    const normalizedQuery = normalizeSearchText(query);
    const resourcesInCategory = resources.filter(
      (resource) =>
        activeCategory === "all" || resource.categories.includes(activeCategory),
    );

    if (!normalizedQuery) return resourcesInCategory;

    const directMatches = resourcesInCategory.filter((resource) =>
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

    return resourcesInCategory.filter((resource) =>
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
    featuredResources,
    resources,
    resourceIds,
  } = await loadResourceData();

  assert.equal(categories.length, 13);
  assert.equal(resources.length, 61);
  assert.equal(new Set(categories.map(({ id }) => id)).size, categories.length);
  assert.equal(new Set(resources.map(({ id }) => id)).size, resources.length);
  assert.equal(new Set(resources.map(({ url }) => url)).size, resources.length);

  assert.deepEqual(categoryIds, categories.map(({ id }) => id));
  assert.deepEqual(resourceIds, resources.map(({ id }) => id));

  const knownCategoryIds = new Set(categoryIds);
  for (const resource of resources) {
    assert.match(resource.url, /^https:\/\/[^\s]+$/i, `${resource.id} must use HTTPS`);
    assert.doesNotThrow(() => new URL(resource.url), `${resource.id} must have a valid URL`);
    assert.ok(resource.name.trim(), `${resource.id} must have a name`);
    assert.ok(resource.description.trim(), `${resource.id} must have a description`);
    assert.ok(resource.bestFor.length > 0, `${resource.id} must explain who it is best for`);
    assert.ok(resource.categories.length > 0, `${resource.id} must have a category`);
    assert.ok(resource.tags.length > 0, `${resource.id} must have at least one tag`);
    assert.ok(resource.tags.length <= 5, `${resource.id} must have no more than five tags`);

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

  const expectedFeaturedIds = [
    "applyguy-2027-internships",
    "handshake",
    "internlist",
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
    "Find a useful place to look",
    "A few things worth remembering",
    "Was bored lol so I made this",
    "Show all 61 resources",
  ]) {
    assert.ok(text.includes(phrase), `server-rendered page should include “${phrase}”`);
  }

  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
  assert.doesNotMatch(text, /Your site is taking shape|Building your site/i);

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
