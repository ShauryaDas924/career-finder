export const categoryIds = [
  "technology",
  "business",
  "finance-risk",
  "healthcare",
  "engineering",
  "science-research",
  "supply-chain-operations",
  "marketing-communications",
  "design-creative",
  "government-law-policy",
  "education",
  "human-services-nonprofit",
  "general-any-major",
] as const;

export type CategoryId = (typeof categoryIds)[number];

export type CategoryIcon =
  | "code"
  | "briefcase"
  | "coins"
  | "care"
  | "gear"
  | "flask"
  | "boxes"
  | "megaphone"
  | "palette"
  | "capitol"
  | "book"
  | "heart"
  | "paths";

export interface CategoryMetadata {
  readonly id: CategoryId;
  readonly label: string;
  readonly shortLabel: string;
  readonly description: string;
  /** Stable semantic name that the UI can map to an original icon component. */
  readonly icon: CategoryIcon;
  /** Extra phrases included when matching a text search. */
  readonly keywords: readonly string[];
}

export const categories = [
  {
    id: "technology",
    label: "Technology",
    shortLabel: "Technology",
    description: "Software, AI, data, cybersecurity, IT, and product roles.",
    icon: "code",
    keywords: [
      "software engineering",
      "computer science",
      "developer",
      "artificial intelligence",
      "AI",
      "machine learning",
      "cybersecurity",
      "information technology",
      "IT",
      "data science",
      "analytics",
      "product management",
    ],
  },
  {
    id: "business",
    label: "Business",
    shortLabel: "Business",
    description: "Consulting, startups, sales, HR, strategy, and operations.",
    icon: "briefcase",
    keywords: [
      "general business",
      "consulting",
      "entrepreneurship",
      "startups",
      "sales",
      "business development",
      "human resources",
      "HR",
      "operations",
    ],
  },
  {
    id: "finance-risk",
    label: "Finance & Risk",
    shortLabel: "Finance & Risk",
    description: "Finance, accounting, actuarial, banking, quant, and insurance.",
    icon: "coins",
    keywords: [
      "finance",
      "accounting",
      "actuarial science",
      "actuary",
      "quantitative finance",
      "quant",
      "banking",
      "investment",
      "insurance",
      "risk management",
    ],
  },
  {
    id: "healthcare",
    label: "Healthcare",
    shortLabel: "Healthcare",
    description: "Administration, operations, public health, informatics, and care.",
    icon: "care",
    keywords: [
      "healthcare management",
      "healthcare administration",
      "health administration",
      "hospital administration",
      "healthcare operations",
      "public health",
      "health informatics",
      "clinical careers",
      "nursing",
      "pharmacy",
      "pharmaceutical",
      "biotechnology",
      "biotech",
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    shortLabel: "Engineering",
    description: "Mechanical, electrical, civil, industrial, aerospace, and more.",
    icon: "gear",
    keywords: [
      "mechanical engineering",
      "electrical engineering",
      "computer engineering",
      "civil engineering",
      "industrial engineering",
      "aerospace engineering",
      "manufacturing engineering",
      "architecture",
    ],
  },
  {
    id: "science-research",
    label: "Science & Research",
    shortLabel: "Science",
    description: "Biology, chemistry, physics, environmental, lab, and research paths.",
    icon: "flask",
    keywords: [
      "science",
      "research",
      "biology",
      "chemistry",
      "physics",
      "environmental science",
      "laboratory",
      "lab",
      "undergraduate research",
    ],
  },
  {
    id: "supply-chain-operations",
    label: "Supply Chain & Operations",
    shortLabel: "Supply Chain",
    description: "Logistics, procurement, manufacturing, and operations careers.",
    icon: "boxes",
    keywords: [
      "supply chain",
      "logistics",
      "procurement",
      "purchasing",
      "operations",
      "manufacturing",
      "distribution",
    ],
  },
  {
    id: "marketing-communications",
    label: "Marketing & Communications",
    shortLabel: "Marketing",
    description: "Marketing, advertising, PR, communications, content, and media.",
    icon: "megaphone",
    keywords: [
      "marketing",
      "advertising",
      "communications",
      "public relations",
      "PR",
      "content",
      "media",
      "brand",
      "growth",
    ],
  },
  {
    id: "design-creative",
    label: "Design & Creative",
    shortLabel: "Design",
    description: "UX, UI, graphic, product, media, and other creative roles.",
    icon: "palette",
    keywords: [
      "design",
      "UX",
      "UI",
      "user experience",
      "graphic design",
      "product design",
      "creative",
      "media",
    ],
  },
  {
    id: "government-law-policy",
    label: "Government, Law & Policy",
    shortLabel: "Government & Law",
    description: "Public service, legal, policy, political science, and administration.",
    icon: "capitol",
    keywords: [
      "government",
      "legal",
      "law",
      "pre-law",
      "public policy",
      "political science",
      "public administration",
      "public service",
    ],
  },
  {
    id: "education",
    label: "Education",
    shortLabel: "Education",
    description: "Teaching, EdTech, student support, and education administration.",
    icon: "book",
    keywords: [
      "education",
      "teaching",
      "teacher",
      "EdTech",
      "student support",
      "education administration",
      "higher education",
    ],
  },
  {
    id: "human-services-nonprofit",
    label: "Human Services & Nonprofit",
    shortLabel: "Human Services",
    description: "Psychology, social work, community programs, and nonprofit service.",
    icon: "heart",
    keywords: [
      "psychology",
      "social services",
      "social work",
      "community programs",
      "human services",
      "nonprofit",
      "mental health",
    ],
  },
  {
    id: "general-any-major",
    label: "General / Any Major",
    shortLabel: "Any Major",
    description: "Broad internship and early-career resources for every field.",
    icon: "paths",
    keywords: [
      "general",
      "all majors",
      "any major",
      "university resources",
      "career center",
      "internships",
      "early career",
      "real estate",
      "construction management",
      "hospitality",
      "tourism",
      "event management",
    ],
  },
] as const satisfies readonly CategoryMetadata[];

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category]),
) as unknown as Readonly<Record<CategoryId, CategoryMetadata>>;

export const resourceIds = [
  "applyguy-2027-internships",
  "simplify-summer-2027-internships",
  "vansh-summer-2027-internships",
  "wellfound",
  "internlist",
  "dreamwork-business-internships",
  "jobright-accounting-finance-internships",
  "northwestern-fintech-quant-internships",
  "handshake",
  "linkedin-jobs",
  "simplify",
  "y-combinator-jobs",
  "management-consulted-jobs",
  "shrm-hr-jobs",
  "aicpa-cima-careers",
  "society-of-actuaries-jobs",
  "efinancialcareers",
  "mypath-insurance-careers",
  "ascm-career-center",
  "ism-career-center",
  "sme-jobs-connection",
  "selectleaders",
  "cmaa-career-hq",
  "hcareers",
  "ache-job-center",
  "ache-administrative-fellowships",
  "mgma-career-center",
  "apha-careermart",
  "amia-career-center",
  "ashp-careerpharm",
  "ana-career-center",
  "cdc-students",
  "biospace-jobs",
  "ieee-jobs",
  "asme-career-center",
  "asce-career-connections",
  "iise-career-center",
  "aiaa-career-center",
  "science-careers",
  "nih-oite-jobs",
  "nsf-reu",
  "doe-suli",
  "orise-zintellect",
  "usajobs-early-careers",
  "gogovernment-internship-finder",
  "psjd",
  "ama-marketing-jobs",
  "prsa-jobcenter",
  "mediabistro",
  "aiga-design-careers",
  "coroflot-design-jobs",
  "edsurge-jobs",
  "schoolspring",
  "higheredjobs",
  "aps-employment-network",
  "nasw-joblink",
  "idealist-internships",
  "my-americorps",
  "parker-dewey",
  "careeronestop-job-search",
] as const;

export type ResourceId = (typeof resourceIds)[number];

export type ResourceFormat =
  | "GitHub collection"
  | "Job platform"
  | "Internship directory"
  | "University career platform"
  | "Professional association job board"
  | "Industry job board"
  | "Government career portal"
  | "Career education resource"
  | "Fellowship directory"
  | "Research opportunity directory"
  | "Service opportunity portal"
  | "Micro-internship platform";

export type ResourceTag =
  | "TECHNOLOGY"
  | "AI / ML"
  | "DATA"
  | "CYBERSECURITY"
  | "PRODUCT"
  | "STARTUPS"
  | "ALL MAJORS"
  | "EARLY CAREER"
  | "UNIVERSITY"
  | "BUSINESS"
  | "CONSULTING"
  | "SALES"
  | "HR"
  | "OPERATIONS"
  | "FINANCE"
  | "ACCOUNTING"
  | "ACTUARIAL"
  | "QUANT"
  | "INSURANCE"
  | "HEALTHCARE"
  | "ADMINISTRATION"
  | "PUBLIC HEALTH"
  | "INFORMATICS"
  | "CLINICAL"
  | "NURSING"
  | "PHARMACY"
  | "BIOTECH"
  | "ENGINEERING"
  | "MECHANICAL"
  | "ELECTRICAL"
  | "CIVIL"
  | "INDUSTRIAL"
  | "AEROSPACE"
  | "MANUFACTURING"
  | "SCIENCE"
  | "RESEARCH"
  | "LAB"
  | "SUPPLY CHAIN"
  | "LOGISTICS"
  | "PROCUREMENT"
  | "MARKETING"
  | "COMMUNICATIONS"
  | "PR"
  | "MEDIA"
  | "DESIGN"
  | "UX / UI"
  | "CREATIVE"
  | "GOVERNMENT"
  | "LAW"
  | "POLICY"
  | "EDUCATION"
  | "TEACHING"
  | "PSYCHOLOGY"
  | "SOCIAL WORK"
  | "NONPROFIT"
  | "REAL ESTATE"
  | "CONSTRUCTION"
  | "HOSPITALITY"
  | "SERVICE"
  | "2027";

export interface Resource {
  readonly id: ResourceId;
  readonly name: string;
  readonly url: string;
  readonly description: string;
  readonly categories: readonly CategoryId[];
  readonly bestFor: readonly string[];
  readonly tags: readonly ResourceTag[];
  readonly format: ResourceFormat;
  readonly featured: boolean;
  /** Specific majors, role names, and common aliases that should match search. */
  readonly searchTerms?: readonly string[];
  /** Include only when a claim is verified and worth showing to students. */
  readonly updateFrequency?: string;
  readonly notes?: string;
}

export const resources = [
  {
    id: "applyguy-2027-internships",
    name: "ApplyGuy — 2027 SWE & Product Internships",
    url: "https://github.com/ApplyGuy/2027-Internships",
    description:
      "A focused GitHub collection of 2027 software engineering, product, and related technical internships.",
    categories: ["technology"],
    bestFor: [
      "Software engineering internships",
      "Product management internships",
      "Technical internships",
    ],
    tags: ["TECHNOLOGY", "PRODUCT", "2027"],
    format: "GitHub collection",
    featured: true,
    searchTerms: ["software", "SWE", "computer science", "developer", "product management"],
    updateFrequency: "Continuously verified",
  },
  {
    id: "simplify-summer-2027-internships",
    name: "Simplify / Pitt CSC Summer 2027 Internships",
    url: "https://github.com/SimplifyJobs/Summer2027-Internships",
    description:
      "A broad GitHub collection of Summer 2027 internships across software, AI, data, product, quant, and hardware.",
    categories: ["technology", "finance-risk", "engineering"],
    bestFor: [
      "Software and hardware internships",
      "AI and data roles",
      "Product and quant internships",
    ],
    tags: ["TECHNOLOGY", "AI / ML", "DATA", "QUANT", "2027"],
    format: "GitHub collection",
    featured: false,
    searchTerms: [
      "software engineering",
      "computer science",
      "machine learning",
      "data science",
      "product management",
      "computer engineering",
      "cybersecurity",
    ],
    updateFrequency: "Updated daily",
  },
  {
    id: "vansh-summer-2027-internships",
    name: "Summer 2027 Tech Internships by Vansh & Ouckah",
    url: "https://github.com/vanshb03/Summer2027-Internships",
    description:
      "A student-maintained GitHub collection of Summer 2027 software and other technical internships.",
    categories: ["technology"],
    bestFor: [
      "Software internships",
      "AI opportunities",
      "Product and technical roles",
    ],
    tags: ["TECHNOLOGY", "AI / ML", "PRODUCT", "2027"],
    format: "GitHub collection",
    featured: false,
    searchTerms: ["software", "SWE", "computer science", "machine learning"],
  },
  {
    id: "wellfound",
    name: "Wellfound",
    url: "https://wellfound.com/jobs",
    description:
      "A hiring platform centered on opportunities at startups and early-stage companies.",
    categories: [
      "technology",
      "business",
      "marketing-communications",
      "design-creative",
    ],
    bestFor: [
      "Startup opportunities",
      "Software and product roles",
      "Design, sales, and business roles",
    ],
    tags: ["STARTUPS", "TECHNOLOGY", "BUSINESS", "SALES", "DESIGN"],
    format: "Job platform",
    featured: false,
    searchTerms: [
      "entrepreneurship",
      "business development",
      "marketing",
      "UX",
      "product management",
    ],
  },
  {
    id: "internlist",
    name: "InternList",
    url: "https://internlist.org/",
    description:
      "An internship discovery site spanning a wide range of academic and professional fields.",
    categories: ["general-any-major"],
    bestFor: [
      "Students from many majors",
      "Broad internship discovery",
      "Exploring more than one career path",
    ],
    tags: ["ALL MAJORS", "EARLY CAREER"],
    format: "Internship directory",
    featured: true,
    searchTerms: [
      "internships broadly",
      "general internships",
      "college students",
      "business",
      "finance",
      "design",
    ],
    updateFrequency: "Updated hourly",
  },
  {
    id: "dreamwork-business-internships",
    name: "Dreamwork Business Internships",
    url: "https://github.com/dreamworkhq/Tech-Internships-2027/blob/main/BUSINESS.md",
    description:
      "A business-focused page within Dreamwork's 2027 internship collection.",
    categories: ["business", "finance-risk", "supply-chain-operations"],
    bestFor: [
      "Business internships",
      "Finance and accounting roles",
      "Analytics, operations, and actuarial opportunities",
    ],
    tags: ["BUSINESS", "FINANCE", "ACCOUNTING", "OPERATIONS", "2027"],
    format: "GitHub collection",
    featured: false,
    searchTerms: [
      "consulting",
      "sales",
      "human resources",
      "HR",
      "supply chain",
      "actuarial science",
    ],
    updateFrequency: "Updated daily",
  },
  {
    id: "jobright-accounting-finance-internships",
    name: "Jobright Accounting / Finance Internship Collection",
    url: "https://github.com/jobright-ai/2026-Account-Internship",
    description:
      "A rolling seven-day feed of accounting and finance internship opportunities.",
    categories: ["finance-risk"],
    bestFor: [
      "Accounting internships",
      "Finance internships",
      "Actuarial-adjacent opportunities",
    ],
    tags: ["ACCOUNTING", "FINANCE", "ACTUARIAL"],
    format: "GitHub collection",
    featured: false,
    searchTerms: ["audit", "tax", "banking", "risk", "insurance"],
    updateFrequency: "Rolling daily feed",
  },
  {
    id: "northwestern-fintech-quant-internships",
    name: "Northwestern FinTech Quant Internship List",
    url: "https://github.com/northwesternfintech/2027QuantInternships",
    description:
      "A GitHub collection focused on quantitative finance internship opportunities.",
    categories: ["finance-risk", "technology"],
    bestFor: [
      "Quantitative finance",
      "Trading and research",
      "Quant development",
    ],
    tags: ["QUANT", "FINANCE", "TECHNOLOGY", "2027"],
    format: "GitHub collection",
    featured: false,
    searchTerms: ["quant", "quantitative trading", "banking", "investment", "financial engineering"],
  },
  {
    id: "handshake",
    name: "Handshake",
    url: "https://joinhandshake.com/students/",
    description:
      "A career platform used by participating schools and employers for roles, recruiting, and career events.",
    categories: ["general-any-major"],
    bestFor: [
      "University-connected recruiting",
      "Internships and career events",
      "Local opportunities across majors",
    ],
    tags: ["UNIVERSITY", "ALL MAJORS", "EARLY CAREER"],
    format: "University career platform",
    featured: true,
    searchTerms: ["college career center", "campus recruiting", "any major", "career fair"],
    notes: "Availability and features can vary by school.",
  },
  {
    id: "linkedin-jobs",
    name: "LinkedIn Jobs",
    url: "https://www.linkedin.com/jobs/",
    description:
      "LinkedIn's large job-search directory for roles across industries and career levels.",
    categories: ["general-any-major"],
    bestFor: [
      "Broad job discovery",
      "Internships across professional fields",
      "Following employers and career paths",
    ],
    tags: ["ALL MAJORS", "EARLY CAREER"],
    format: "Job platform",
    featured: false,
    searchTerms: ["jobs", "internships", "entry level", "college students", "university"],
  },
  {
    id: "simplify",
    name: "Simplify",
    url: "https://simplify.jobs/",
    description:
      "A job-search platform with discovery and application tools for internships and new-grad roles.",
    categories: ["technology", "general-any-major"],
    bestFor: [
      "Finding early-career roles",
      "Organizing a job search",
      "Technology internships and new-grad jobs",
    ],
    tags: ["TECHNOLOGY", "ALL MAJORS", "EARLY CAREER"],
    format: "Job platform",
    featured: true,
    searchTerms: ["software", "computer science", "AI", "data science", "product", "internships"],
  },
  {
    id: "y-combinator-jobs",
    name: "Y Combinator Jobs",
    url: "https://www.ycombinator.com/jobs",
    description:
      "Open roles at startups in the Y Combinator community across technical and business functions.",
    categories: ["technology", "business", "marketing-communications"],
    bestFor: [
      "Startup and entrepreneurship paths",
      "Software and product roles",
      "Sales, growth, and operations",
    ],
    tags: ["STARTUPS", "TECHNOLOGY", "PRODUCT", "SALES", "BUSINESS"],
    format: "Job platform",
    featured: false,
    searchTerms: ["entrepreneurship", "business development", "growth", "marketing"],
  },
  {
    id: "management-consulted-jobs",
    name: "Management Consulted Jobs",
    url: "https://jobs.managementconsulted.com/",
    description:
      "A specialized job board for management consulting and adjacent strategy roles.",
    categories: ["business"],
    bestFor: [
      "Management consulting",
      "Strategy roles",
      "Consulting internships and entry-level jobs",
    ],
    tags: ["CONSULTING", "BUSINESS", "EARLY CAREER"],
    format: "Industry job board",
    featured: false,
    searchTerms: ["consultant", "strategy consulting", "business analyst", "case interview"],
  },
  {
    id: "shrm-hr-jobs",
    name: "SHRM HR Jobs",
    url: "https://jobs.shrm.org/jobs/",
    description:
      "The Society for Human Resource Management's job board for HR and people-operations careers.",
    categories: ["business"],
    bestFor: [
      "Human resources roles",
      "People operations",
      "Recruiting and talent careers",
    ],
    tags: ["HR", "BUSINESS", "OPERATIONS"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["human resources", "people operations", "recruiting", "talent acquisition"],
  },
  {
    id: "aicpa-cima-careers",
    name: "AICPA & CIMA Global Career Hub",
    url: "https://mycareer.aicpa-cima.com/",
    description:
      "A professional career hub for accounting, audit, tax, and finance opportunities.",
    categories: ["finance-risk", "business"],
    bestFor: [
      "Accounting careers",
      "Audit and tax roles",
      "Corporate finance paths",
    ],
    tags: ["ACCOUNTING", "FINANCE", "BUSINESS"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["CPA", "management accounting", "auditing", "tax", "financial reporting"],
  },
  {
    id: "society-of-actuaries-jobs",
    name: "Society of Actuaries Job Center",
    url: "https://jobs.soa.org/",
    description:
      "The Society of Actuaries' specialized job center for actuarial and risk careers.",
    categories: ["finance-risk"],
    bestFor: [
      "Actuarial science students",
      "Insurance and risk roles",
      "Actuarial internships and jobs",
    ],
    tags: ["ACTUARIAL", "INSURANCE", "FINANCE"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["actuary", "actuarial exams", "risk management", "insurance analytics"],
  },
  {
    id: "efinancialcareers",
    name: "eFinancialCareers",
    url: "https://www.efinancialcareers.com/",
    description:
      "A specialized careers platform for banking, investment, markets, and financial services.",
    categories: ["finance-risk"],
    bestFor: [
      "Banking and investment roles",
      "Financial markets careers",
      "Finance internships and graduate jobs",
    ],
    tags: ["FINANCE", "QUANT", "EARLY CAREER"],
    format: "Industry job board",
    featured: false,
    searchTerms: ["investment banking", "asset management", "private equity", "trading", "quantitative finance"],
  },
  {
    id: "mypath-insurance-careers",
    name: "MyPath Insurance Careers",
    url: "https://www.insuremypath.org/careers",
    description:
      "A career-exploration resource introducing roles and pathways across the insurance industry.",
    categories: ["finance-risk", "business"],
    bestFor: [
      "Exploring insurance careers",
      "Risk and underwriting paths",
      "Learning where different majors fit",
    ],
    tags: ["INSURANCE", "ACTUARIAL", "FINANCE", "BUSINESS"],
    format: "Career education resource",
    featured: false,
    searchTerms: ["underwriting", "claims", "risk management", "actuarial science", "insurance jobs"],
    notes: "Best used to learn the field before moving to an employer or job search.",
  },
  {
    id: "ascm-career-center",
    name: "ASCM Career Center",
    url: "https://jobs.ascm.org/",
    description:
      "The Association for Supply Chain Management's job board for supply chain and operations careers.",
    categories: ["supply-chain-operations", "business"],
    bestFor: [
      "Supply chain careers",
      "Logistics and planning roles",
      "Operations opportunities",
    ],
    tags: ["SUPPLY CHAIN", "LOGISTICS", "OPERATIONS", "BUSINESS"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["inventory", "demand planning", "distribution", "procurement", "operations management"],
  },
  {
    id: "ism-career-center",
    name: "ISM Career Center",
    url: "https://careers.ismworld.org/",
    description:
      "The Institute for Supply Management's career center for procurement and supply management.",
    categories: ["supply-chain-operations", "business"],
    bestFor: [
      "Procurement careers",
      "Strategic sourcing roles",
      "Supply management jobs",
    ],
    tags: ["PROCUREMENT", "SUPPLY CHAIN", "OPERATIONS", "BUSINESS"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["purchasing", "sourcing", "supplier management", "logistics"],
  },
  {
    id: "sme-jobs-connection",
    name: "SME Jobs Connection",
    url: "https://jobsconnection.sme.org/",
    description:
      "SME's specialized job board for manufacturing, production, and engineering careers.",
    categories: ["supply-chain-operations", "engineering"],
    bestFor: [
      "Manufacturing engineering",
      "Production and process roles",
      "Industrial technology careers",
    ],
    tags: ["MANUFACTURING", "ENGINEERING", "INDUSTRIAL", "OPERATIONS"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["manufacturing", "production", "quality engineering", "industrial engineering", "process engineering"],
  },
  {
    id: "selectleaders",
    name: "SelectLeaders",
    url: "https://www.selectleaders.com/jobs/",
    description:
      "A specialized job board for commercial real estate, development, and property careers.",
    categories: ["business", "general-any-major"],
    bestFor: [
      "Commercial real estate",
      "Property and development roles",
      "Real estate finance and operations",
    ],
    tags: ["REAL ESTATE", "BUSINESS", "FINANCE", "OPERATIONS"],
    format: "Industry job board",
    featured: false,
    searchTerms: ["property management", "real estate development", "acquisitions", "architecture"],
  },
  {
    id: "cmaa-career-hq",
    name: "CMAA Career Headquarters",
    url: "https://www.cmaanet.org/career-hq",
    description:
      "The Construction Management Association of America's career destination for construction management.",
    categories: ["engineering", "business", "general-any-major"],
    bestFor: [
      "Construction management",
      "Project and field engineering",
      "Built-environment careers",
    ],
    tags: ["CONSTRUCTION", "ENGINEERING", "OPERATIONS", "BUSINESS"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["construction", "architecture", "project management", "civil engineering", "property development"],
  },
  {
    id: "hcareers",
    name: "Hcareers",
    url: "https://www.hcareers.com/jobs-by-category",
    description:
      "A job platform organized around hospitality, hotels, food service, and related operations.",
    categories: ["business", "general-any-major"],
    bestFor: [
      "Hospitality careers",
      "Hotel and tourism roles",
      "Events and guest operations",
    ],
    tags: ["HOSPITALITY", "OPERATIONS", "BUSINESS", "EARLY CAREER"],
    format: "Industry job board",
    featured: false,
    searchTerms: ["tourism", "event management", "hotel management", "food and beverage", "guest services"],
  },
  {
    id: "ache-job-center",
    name: "ACHE Job Center",
    url: "https://careers.ache.org/",
    description:
      "The American College of Healthcare Executives' job board for healthcare leadership and administration.",
    categories: ["healthcare", "business"],
    bestFor: [
      "Healthcare administration",
      "Healthcare management",
      "Hospital operations and leadership",
    ],
    tags: ["HEALTHCARE", "ADMINISTRATION", "OPERATIONS", "BUSINESS"],
    format: "Professional association job board",
    featured: false,
    searchTerms: [
      "health administration",
      "hospital administration",
      "healthcare operations",
      "health services management",
      "hospital management",
    ],
  },
  {
    id: "ache-administrative-fellowships",
    name: "ACHE Administrative Fellowship Directory",
    url: "https://www.ache.org/Career-Resources/Start-Your-Career/Administrative-Fellowships",
    description:
      "A directory of postgraduate administrative fellowships in healthcare organizations.",
    categories: ["healthcare", "business"],
    bestFor: [
      "Healthcare management students",
      "Hospital administration fellowships",
      "Early-career healthcare leadership",
    ],
    tags: ["HEALTHCARE", "ADMINISTRATION", "EARLY CAREER", "BUSINESS"],
    format: "Fellowship directory",
    featured: false,
    searchTerms: [
      "healthcare administration",
      "health administration",
      "healthcare operations",
      "administrative residency",
      "MHA",
    ],
    notes: "Many fellowships are designed for graduate students or recent graduate-degree recipients.",
  },
  {
    id: "mgma-career-center",
    name: "MGMA Career Center",
    url: "https://www.mgma.com/career-center/job-seekers",
    description:
      "A career center focused on medical-practice management and healthcare operations.",
    categories: ["healthcare", "business"],
    bestFor: [
      "Healthcare operations",
      "Medical-practice administration",
      "Healthcare management careers",
    ],
    tags: ["HEALTHCARE", "ADMINISTRATION", "OPERATIONS", "BUSINESS"],
    format: "Professional association job board",
    featured: false,
    searchTerms: [
      "healthcare management",
      "health administration",
      "clinic management",
      "practice manager",
      "hospital operations",
    ],
  },
  {
    id: "apha-careermart",
    name: "APHA CareerMart",
    url: "https://careers.apha.org/jobseekers/index.cfm",
    description:
      "The American Public Health Association's career portal for public-health opportunities.",
    categories: ["healthcare", "science-research", "government-law-policy"],
    bestFor: [
      "Public health careers",
      "Community and population health",
      "Health policy and research",
    ],
    tags: ["PUBLIC HEALTH", "HEALTHCARE", "RESEARCH", "POLICY"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["epidemiology", "biostatistics", "community health", "environmental health", "health policy"],
  },
  {
    id: "amia-career-center",
    name: "AMIA Career Center",
    url: "https://jobs.amia.org/",
    description:
      "The American Medical Informatics Association's job board for health-data and informatics careers.",
    categories: ["healthcare", "technology"],
    bestFor: [
      "Health informatics",
      "Clinical data and analytics",
      "Healthcare technology roles",
    ],
    tags: ["INFORMATICS", "HEALTHCARE", "DATA", "TECHNOLOGY"],
    format: "Professional association job board",
    featured: false,
    searchTerms: [
      "health information management",
      "clinical informatics",
      "healthcare analytics",
      "medical data",
      "digital health",
    ],
  },
  {
    id: "ashp-careerpharm",
    name: "ASHP CareerPharm",
    url: "https://www.ashp.org/professional-development/careerpharm",
    description:
      "A pharmacy career resource from the American Society of Health-System Pharmacists.",
    categories: ["healthcare"],
    bestFor: [
      "Pharmacy careers",
      "Health-system pharmacy",
      "Clinical and pharmaceutical roles",
    ],
    tags: ["PHARMACY", "CLINICAL", "HEALTHCARE"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["pharmacist", "pharmaceutical", "hospital pharmacy", "clinical pharmacy", "patient care"],
    notes: "This resource is specialized for pharmacy students and professionals.",
  },
  {
    id: "ana-career-center",
    name: "ANA Career Center",
    url: "https://ana.careerwebsite.com/",
    description:
      "The American Nurses Association's official career center for nursing roles, job alerts, and career support.",
    categories: ["healthcare"],
    bestFor: [
      "Nursing careers",
      "Clinical and community-health roles",
      "Nursing leadership and education",
    ],
    tags: ["NURSING", "CLINICAL", "HEALTHCARE", "EARLY CAREER"],
    format: "Professional association job board",
    featured: false,
    searchTerms: [
      "nurse",
      "registered nurse",
      "RN",
      "nursing internships",
      "nurse practitioner",
      "nursing leadership",
    ],
    notes: "Listings span career levels; students can narrow searches with terms such as internship or new graduate.",
  },
  {
    id: "cdc-students",
    name: "CDC Student Opportunities",
    url: "https://jobs.cdc.gov/working-at-cdc/students.html",
    description:
      "The CDC's official overview of internships, fellowships, and learning opportunities for students.",
    categories: ["healthcare", "science-research", "government-law-policy"],
    bestFor: [
      "Public health students",
      "Government health pathways",
      "Science and research experience",
    ],
    tags: ["PUBLIC HEALTH", "GOVERNMENT", "RESEARCH", "EARLY CAREER"],
    format: "Government career portal",
    featured: false,
    searchTerms: ["epidemiology", "biology", "laboratory", "health policy", "federal internships"],
    notes: "Eligibility, application windows, and hiring routes vary by program.",
  },
  {
    id: "biospace-jobs",
    name: "BioSpace Jobs",
    url: "https://www.biospace.com/jobs",
    description:
      "An industry job board focused on biotechnology, pharmaceutical, and life-sciences careers.",
    categories: ["healthcare", "science-research"],
    bestFor: [
      "Biotechnology careers",
      "Pharmaceutical roles",
      "Life-science research and lab work",
    ],
    tags: ["BIOTECH", "SCIENCE", "RESEARCH", "LAB", "HEALTHCARE"],
    format: "Industry job board",
    featured: false,
    searchTerms: ["biology", "chemistry", "pharma", "clinical research", "laboratory", "biomedical science"],
  },
  {
    id: "ieee-jobs",
    name: "IEEE Jobs",
    url: "https://jobs.ieee.org/",
    description:
      "IEEE's job board for electrical, computing, electronics, and technology careers.",
    categories: ["engineering", "technology"],
    bestFor: [
      "Electrical engineering",
      "Computer engineering",
      "Computing and electronics roles",
    ],
    tags: ["ELECTRICAL", "ENGINEERING", "TECHNOLOGY"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["electronics", "embedded systems", "computer science", "telecommunications", "cybersecurity", "IT"],
  },
  {
    id: "asme-career-center",
    name: "ASME Career Center",
    url: "https://careercenter.asme.org/",
    description:
      "The American Society of Mechanical Engineers' job board for mechanical and related engineering roles.",
    categories: ["engineering"],
    bestFor: [
      "Mechanical engineering",
      "Manufacturing and energy roles",
      "Engineering internships and jobs",
    ],
    tags: ["MECHANICAL", "ENGINEERING", "MANUFACTURING"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["mechanical design", "robotics", "thermal", "aerospace", "product engineering"],
  },
  {
    id: "asce-career-connections",
    name: "ASCE Career Connections",
    url: "https://careers.asce.org/",
    description:
      "The American Society of Civil Engineers' career portal for civil and infrastructure roles.",
    categories: ["engineering"],
    bestFor: [
      "Civil engineering",
      "Infrastructure careers",
      "Construction and environmental engineering",
    ],
    tags: ["CIVIL", "ENGINEERING", "CONSTRUCTION"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["structural engineering", "transportation", "water resources", "geotechnical", "architecture"],
  },
  {
    id: "iise-career-center",
    name: "IISE Career Center",
    url: "https://careers.iise.org/",
    description:
      "The Institute of Industrial and Systems Engineers' job board for systems, operations, and process careers.",
    categories: ["engineering", "supply-chain-operations"],
    bestFor: [
      "Industrial engineering",
      "Operations and process improvement",
      "Systems and supply-chain roles",
    ],
    tags: ["INDUSTRIAL", "ENGINEERING", "OPERATIONS", "SUPPLY CHAIN"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["systems engineering", "process improvement", "quality", "logistics", "operations research"],
  },
  {
    id: "aiaa-career-center",
    name: "AIAA Career Center",
    url: "https://careercenter.aiaa.org/",
    description:
      "The aerospace professional association's job board for aviation, space, and related engineering roles.",
    categories: ["engineering", "science-research"],
    bestFor: [
      "Aerospace engineering",
      "Aviation and space careers",
      "Research and technical roles",
    ],
    tags: ["AEROSPACE", "ENGINEERING", "RESEARCH"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["aeronautical engineering", "astronautics", "flight", "propulsion", "space science"],
  },
  {
    id: "science-careers",
    name: "Science Careers",
    url: "https://jobs.sciencecareers.org/",
    description:
      "Science's career site for research, laboratory, academic, and industry opportunities.",
    categories: ["science-research"],
    bestFor: [
      "Scientific research careers",
      "Laboratory opportunities",
      "Academic and industry science roles",
    ],
    tags: ["SCIENCE", "RESEARCH", "LAB"],
    format: "Industry job board",
    featured: false,
    searchTerms: ["biology", "chemistry", "physics", "environmental science", "life sciences", "research scientist"],
  },
  {
    id: "nih-oite-jobs",
    name: "NIH OITE Jobs",
    url: "https://www.training.nih.gov/jobs/",
    description:
      "An NIH career resource with job and training opportunities for biomedical researchers and trainees.",
    categories: ["science-research", "healthcare", "government-law-policy"],
    bestFor: [
      "Biomedical research",
      "Research training pathways",
      "Science and health careers",
    ],
    tags: ["RESEARCH", "SCIENCE", "HEALTHCARE", "GOVERNMENT"],
    format: "Government career portal",
    featured: false,
    searchTerms: ["biology", "neuroscience", "laboratory", "biomedical science", "postbac", "clinical research"],
    notes: "Some opportunities are intended for specific education or training levels.",
  },
  {
    id: "nsf-reu",
    name: "NSF Research Experiences for Undergraduates",
    url: "https://www.nsf.gov/funding/initiatives/reu",
    description:
      "The National Science Foundation's official route to undergraduate research sites and supplements.",
    categories: ["science-research", "engineering"],
    bestFor: [
      "Undergraduate research experience",
      "STEM summer programs",
      "Faculty-mentored science and engineering",
    ],
    tags: ["RESEARCH", "SCIENCE", "ENGINEERING", "EARLY CAREER"],
    format: "Research opportunity directory",
    featured: false,
    searchTerms: ["REU", "biology", "chemistry", "physics", "environmental science", "summer research"],
    notes: "Eligibility and application processes are set by each participating site.",
  },
  {
    id: "doe-suli",
    name: "DOE Science Undergraduate Laboratory Internships",
    url: "https://science.osti.gov/wdts/suli",
    description:
      "A U.S. Department of Energy program placing undergraduates in research at national laboratories.",
    categories: ["science-research", "engineering", "government-law-policy"],
    bestFor: [
      "National-lab research",
      "Science and engineering internships",
      "Energy and computing research",
    ],
    tags: ["RESEARCH", "LAB", "ENGINEERING", "GOVERNMENT"],
    format: "Government career portal",
    featured: false,
    searchTerms: ["SULI", "physics", "chemistry", "computer science", "energy", "environmental science"],
    notes: "Review the current term, eligibility, and citizenship requirements before applying.",
  },
  {
    id: "orise-zintellect",
    name: "ORISE / Zintellect Opportunity Catalog",
    url: "https://www.zintellect.com/Catalog",
    description:
      "A searchable catalog of research, science, health, and policy internships and fellowships.",
    categories: [
      "science-research",
      "healthcare",
      "engineering",
      "government-law-policy",
    ],
    bestFor: [
      "Federal research opportunities",
      "STEM and public-health fellowships",
      "Students and recent graduates",
    ],
    tags: ["RESEARCH", "SCIENCE", "PUBLIC HEALTH", "GOVERNMENT", "EARLY CAREER"],
    format: "Research opportunity directory",
    featured: false,
    searchTerms: ["ORISE", "laboratory", "biology", "chemistry", "engineering", "health policy"],
    notes: "Eligibility, location, and appointment terms differ across programs.",
  },
  {
    id: "usajobs-early-careers",
    name: "USAJOBS Early Careers",
    url: "https://intern.usajobs.gov/search/",
    description:
      "The federal government's official search for internships and early-career opportunities.",
    categories: ["government-law-policy", "general-any-major"],
    bestFor: [
      "Federal internships",
      "Government early-career roles",
      "Public-service opportunities across majors",
    ],
    tags: ["GOVERNMENT", "EARLY CAREER", "ALL MAJORS", "POLICY"],
    format: "Government career portal",
    featured: false,
    searchTerms: ["public administration", "political science", "Pathways", "federal jobs", "student government"],
    notes: "Read each posting's eligibility and required documents carefully.",
  },
  {
    id: "gogovernment-internship-finder",
    name: "GoGovernment Internship & Fellowship Finder",
    url: "https://gogovernment.org/explore/internships-fellowships/finder/",
    description:
      "A finder and learning resource for internships and fellowships across the federal government.",
    categories: ["government-law-policy", "general-any-major"],
    bestFor: [
      "Exploring federal career paths",
      "Government internships and fellowships",
      "Understanding public-service hiring",
    ],
    tags: ["GOVERNMENT", "POLICY", "EARLY CAREER", "ALL MAJORS"],
    format: "Career education resource",
    featured: false,
    searchTerms: ["public policy", "political science", "public administration", "federal internships", "public service"],
  },
  {
    id: "psjd",
    name: "PSJD",
    url: "https://www.psjd.org/",
    description:
      "A public-interest law careers network with jobs, internships, and employer information.",
    categories: ["government-law-policy", "human-services-nonprofit"],
    bestFor: [
      "Public-interest law",
      "Legal internships",
      "Government and nonprofit legal work",
    ],
    tags: ["LAW", "GOVERNMENT", "NONPROFIT", "POLICY"],
    format: "Industry job board",
    featured: false,
    searchTerms: ["legal", "pre-law", "law student", "public defender", "legal aid", "public service"],
    notes: "Some services or listings may depend on a participating law-school account.",
  },
  {
    id: "ama-marketing-jobs",
    name: "AMA Marketing Jobs",
    url: "https://jobs.ama.org/",
    description:
      "The American Marketing Association's job board for marketing, brand, and growth roles.",
    categories: ["marketing-communications", "business"],
    bestFor: [
      "Marketing careers",
      "Brand and growth roles",
      "Market research opportunities",
    ],
    tags: ["MARKETING", "COMMUNICATIONS", "BUSINESS"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["advertising", "digital marketing", "brand management", "content marketing", "consumer insights"],
  },
  {
    id: "prsa-jobcenter",
    name: "PRSA Jobcenter",
    url: "https://jobs.prsa.org/",
    description:
      "The Public Relations Society of America's job board for PR and communications careers.",
    categories: ["marketing-communications"],
    bestFor: [
      "Public relations",
      "Corporate communications",
      "Media relations roles",
    ],
    tags: ["PR", "COMMUNICATIONS", "MARKETING", "MEDIA"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["public relations", "communications", "press", "content", "reputation management"],
  },
  {
    id: "mediabistro",
    name: "Mediabistro",
    url: "https://www.mediabistro.com/",
    description:
      "A specialized careers site for media, content, communications, and creative work.",
    categories: ["marketing-communications", "design-creative"],
    bestFor: [
      "Media and publishing roles",
      "Content and communications",
      "Creative and editorial careers",
    ],
    tags: ["MEDIA", "COMMUNICATIONS", "CREATIVE", "MARKETING"],
    format: "Industry job board",
    featured: false,
    searchTerms: ["journalism", "writing", "editorial", "advertising", "social media", "content creation"],
  },
  {
    id: "aiga-design-careers",
    name: "AIGA Design Careers",
    url: "https://designcareers.aiga.org/jobs",
    description:
      "AIGA's career destination for graphic, visual, interaction, and multidisciplinary design roles.",
    categories: ["design-creative"],
    bestFor: [
      "Graphic and visual design",
      "UX and interaction design",
      "Creative career opportunities",
    ],
    tags: ["DESIGN", "UX / UI", "CREATIVE"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["graphic design", "user experience", "UI", "visual communication", "product design"],
  },
  {
    id: "coroflot-design-jobs",
    name: "Coroflot Design Jobs",
    url: "https://www.coroflot.com/design-jobs",
    description:
      "A design-focused job board spanning product, industrial, graphic, UX, and creative roles.",
    categories: ["design-creative"],
    bestFor: [
      "Product and industrial design",
      "UX and UI roles",
      "Graphic and creative jobs",
    ],
    tags: ["DESIGN", "UX / UI", "CREATIVE", "PRODUCT"],
    format: "Industry job board",
    featured: false,
    searchTerms: ["graphic design", "user interface", "user experience", "industrial design", "media design"],
  },
  {
    id: "edsurge-jobs",
    name: "EdSurge Jobs",
    url: "https://jobsboard.edsurge.com/",
    description:
      "A job board for education technology, learning products, and education-sector organizations.",
    categories: ["education", "technology", "business"],
    bestFor: [
      "Education technology",
      "Learning-product roles",
      "Education organizations and startups",
    ],
    tags: ["EDUCATION", "TECHNOLOGY", "PRODUCT", "STARTUPS"],
    format: "Industry job board",
    featured: false,
    searchTerms: ["EdTech", "instructional design", "learning technology", "education sales", "student support"],
  },
  {
    id: "schoolspring",
    name: "SchoolSpring",
    url: "https://www.schoolspring.com/",
    description:
      "A job-search platform for K–12 teaching, school support, and education administration roles.",
    categories: ["education"],
    bestFor: [
      "Teaching positions",
      "School support roles",
      "K–12 education administration",
    ],
    tags: ["TEACHING", "EDUCATION", "EARLY CAREER"],
    format: "Industry job board",
    featured: false,
    searchTerms: ["teacher", "school counselor", "special education", "student support", "school administrator"],
  },
  {
    id: "higheredjobs",
    name: "HigherEdJobs",
    url: "https://www.higheredjobs.com/",
    description:
      "A higher-education job board covering academic, administrative, and student-support work.",
    categories: ["education"],
    bestFor: [
      "College and university roles",
      "Student affairs and support",
      "Higher-education administration",
    ],
    tags: ["EDUCATION", "UNIVERSITY", "ADMINISTRATION"],
    format: "Industry job board",
    featured: false,
    searchTerms: ["higher education", "student affairs", "academic advising", "faculty", "college administration"],
  },
  {
    id: "aps-employment-network",
    name: "APS Employment Network",
    url: "https://jobs.psychologicalscience.org/",
    description:
      "The Association for Psychological Science's job board for psychology research and related careers.",
    categories: ["human-services-nonprofit", "science-research", "education"],
    bestFor: [
      "Psychology careers",
      "Behavioral-science research",
      "Academic and applied psychology roles",
    ],
    tags: ["PSYCHOLOGY", "RESEARCH", "SCIENCE", "EDUCATION"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["behavioral science", "cognitive science", "mental health", "research assistant", "social psychology"],
  },
  {
    id: "nasw-joblink",
    name: "NASW JobLink",
    url: "https://joblink.socialworkers.org/",
    description:
      "The National Association of Social Workers' job board for social-work and human-services careers.",
    categories: ["human-services-nonprofit", "healthcare"],
    bestFor: [
      "Social work roles",
      "Community and human services",
      "Behavioral-health careers",
    ],
    tags: ["SOCIAL WORK", "NONPROFIT", "HEALTHCARE", "SERVICE"],
    format: "Professional association job board",
    featured: false,
    searchTerms: ["social services", "case management", "community programs", "mental health", "clinical social work"],
  },
  {
    id: "idealist-internships",
    name: "Idealist Internships",
    url: "https://www.idealist.org/en/internships",
    description:
      "A searchable directory of internships with nonprofit, community, and mission-driven organizations.",
    categories: ["human-services-nonprofit", "general-any-major"],
    bestFor: [
      "Nonprofit internships",
      "Community and social-impact work",
      "Mission-driven opportunities across majors",
    ],
    tags: ["NONPROFIT", "SERVICE", "ALL MAJORS", "EARLY CAREER"],
    format: "Internship directory",
    featured: false,
    searchTerms: ["social services", "community programs", "human services", "social impact", "volunteer"],
  },
  {
    id: "my-americorps",
    name: "My AmeriCorps",
    url: "https://my.americorps.gov/mp/listing/publicRequestSearch.do",
    description:
      "The official search for AmeriCorps service opportunities with community organizations across the U.S.",
    categories: [
      "human-services-nonprofit",
      "government-law-policy",
      "general-any-major",
    ],
    bestFor: [
      "National and community service",
      "Education and nonprofit programs",
      "Public-service experience",
    ],
    tags: ["SERVICE", "NONPROFIT", "GOVERNMENT", "ALL MAJORS"],
    format: "Service opportunity portal",
    featured: false,
    searchTerms: ["AmeriCorps", "community programs", "human services", "education service", "public service"],
    notes: "AmeriCorps service positions differ from conventional jobs; review each program's benefits and commitment.",
  },
  {
    id: "parker-dewey",
    name: "Parker Dewey",
    url: "https://www.parkerdewey.com/career-launchers",
    description:
      "A platform where college students and recent graduates can find short, project-based micro-internships.",
    categories: ["general-any-major", "business"],
    bestFor: [
      "Short professional projects",
      "Building early experience",
      "Exploring roles across majors",
    ],
    tags: ["EARLY CAREER", "ALL MAJORS", "BUSINESS"],
    format: "Micro-internship platform",
    featured: false,
    searchTerms: ["micro internship", "college students", "project work", "career exploration", "remote internship"],
    notes: "Project availability and fit vary; treat micro-internships as one part of a broader search.",
  },
  {
    id: "careeronestop-job-search",
    name: "CareerOneStop Job Search",
    url: "https://www.careeronestop.org/JobSearch/job-search.aspx",
    description:
      "A U.S. Department of Labor-sponsored starting point for job search and career exploration.",
    categories: ["general-any-major", "government-law-policy"],
    bestFor: [
      "Job seekers from any major",
      "Exploring occupations and local opportunities",
      "Finding public career-search guidance",
    ],
    tags: ["ALL MAJORS", "EARLY CAREER", "GOVERNMENT"],
    format: "Government career portal",
    featured: false,
    searchTerms: ["general jobs", "career exploration", "occupation finder", "entry level", "internships"],
  },
] as const satisfies readonly Resource[];

export const featuredResources = resources.filter(
  (resource) => resource.featured,
);

export function getResourcesByCategory(categoryId: CategoryId) {
  return resources.filter((resource) => {
    const resourceCategories: readonly CategoryId[] = resource.categories;

    return resourceCategories.includes(categoryId);
  });
}
