import type { SiteContent } from "./content.types";

/**
 * The single source of content for the whole site.
 *
 * Every user-visible string, number, link, and asset path lives here.
 * No component may contain copy. Updating the site — a new lift PR, a new
 * project, a job change — should never require opening a component.
 */
export const site: SiteContent = {
  name: "Pradeep Kumar",
  tagline: "AI Engineer",
  location: "Bengaluru, India",

  hero: {
    headline: "Still figuring it out,\nat speed.",
    body: "I get deeply interested in things and learn by building them. Right now that means agentic systems and retrieval — and six days a week on the mats.",
    photo: {
      src: "/img/train.webp",
      alt: "Pradeep leaning out of the window of the Nilgiri Mountain Railway as it climbs through forest toward Ooty",
      width: 1600,
      height: 2133,
    },
  },

  metrics: [
    { value: "6 yrs", label: "building production AI" },
    { value: "120k", label: "lines of open source shipped" },
    { value: "5,000+", label: "users on systems I built" },
    { value: "$534K", label: "customer revenue influenced" },
  ],

  projects: [
    {
      name: "Crucible",
      blurb:
        "An agentic coding assistant for VS Code. A FastAPI orchestrator runs ReAct tool loops against isolated shadow workspaces, a Rust indexer builds an LSP-resolved symbol graph across six languages, and a memory layer compacts context and recalls across sessions.",
      href: "https://github.com/pradeepA2125/crucible",
      stack: ["Python", "TypeScript", "Rust", "MCP"],
      year: "2026",
    },
    {
      name: "Ask-Git",
      blurb:
        "Conversational code intelligence over Git history — commits, file-level changes, and pull-request metadata across multiple repositories. Adopted into IBM's Client Engineering enablement accelerators.",
      stack: ["LangChain", "Vector search", "GitHub API"],
      year: "2025",
    },
    {
      name: "watsonx Orchestrate agents",
      blurb:
        "A portfolio of production agents: a LangGraph natural-language-to-SQL tool, a vision-language document extractor, and a call-transcript analyzer producing structured insight across six dimensions.",
      stack: ["LangGraph", "watsonx", "VLMs"],
      year: "2025",
    },
  ],

  roles: [
    {
      title: "Lead Engineer",
      org: "IBM",
      period: "Feb 2024 — Present",
      startYear: 2024,
      points: [
        "Architected 3+ enterprise RAG systems serving 5,000+ users across finance, HR, and energy.",
        "Technical Lead on the Rogers engagement — deployed Cloud Pak for Data and IBM Knowledge Catalog onto customer-managed OpenShift.",
        "Influenced USD 534K in customer revenue across three strategic engagements.",
      ],
    },
    {
      title: "Senior AI Engineer",
      org: "Infilect",
      period: "Sep 2021 — Feb 2024",
      startYear: 2021,
      points: [
        "Led six end-to-end AI deployments for global FMCG clients.",
        "Built computer vision systems for Share-of-Shelf and On-Shelf Availability analytics.",
      ],
    },
    {
      title: "Computer Vision Engineer",
      org: "Drishte",
      period: "Oct 2020 — Sep 2021",
      startYear: 2020,
      points: [
        "Built tracking, detection, and re-identification models for crowd analytics.",
        "Deployed to Jetson Nano and edge devices with TensorRT and OpenVINO.",
      ],
    },
  ],

  resumeHref: "/resume.pdf",

  interstitial: {
    quote: "Engineering is a major part of my life. It isn't my entire identity.",
    attribution: "Which is the whole point of the rest of this page.",
    photo: {
      src: "/img/stump.webp",
      alt: "Pradeep sitting cross-legged on a fallen tree trunk in dense green forest",
      width: 1600,
      height: 1500,
    },
  },

  training: {
    heading: "Training",
    body: "MMA six days a week — striking, wrestling, and Brazilian jiu-jitsu — alongside structured strength work. I care about what the body can actually do, not just what it looks like.",
    lifts: [
      { name: "RDL", value: "170 kg" },
      { name: "Squat", value: "130 kg" },
      { name: "Bench", value: "90 kg" },
      { name: "Press", value: "60 kg" },
    ],
    photo: {
      src: "/img/mma.webp",
      alt: "Pradeep with training partners and coaches on the mats at Kranos MMA in Bengaluru",
      width: 1600,
      height: 1200,
    },
  },

  riding: {
    heading: "Riding",
    body: "A KTM 390 Adventure and a preference for mountain roads. Long rides are how I get away from screens — Bengaluru to Ooty and back, exploring rather than sightseeing.",
    photo: {
      src: "/img/bike.webp",
      alt: "Pradeep sitting on his orange and black KTM 390 Adventure under pine trees",
      width: 1200,
      height: 2133,
    },
  },

  contact: {
    heading: "Get in touch",
    email: "mailto:pradeepkumar94p@gmail.com",
    links: [
      { label: "GitHub", href: "https://github.com/pradeepA2125" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/pradeepk21" },
      { label: "Crucible", href: "https://github.com/pradeepA2125/crucible" },
    ],
  },
};
