export const solutions = [
  {
    id: "brand-identity",
    icon: "◈",
    title: "Brand Identity",
    tagline: "Building brands that stand apart.",
    description:
      "We craft distinctive visual identities that communicate who you are and what you stand for — from the first sketch to a complete brand system.",
    subServices: [
      "Logo Design",
      "Brand Identity Systems",
      "Brand Guidelines",
      "Brand Refresh",
      "Corporate Identity Development",
    ],
  },
  {
    id: "corporate-branding",
    icon: "◉",
    title: "Corporate Branding",
    tagline: "Every touchpoint tells your story.",
    description:
      "Consistent, professional corporate materials that reinforce your brand across every business interaction — from boardroom to mailbox.",
    subServices: [
      "Company Profiles",
      "Corporate Brochures",
      "Product Catalogues",
      "Annual Reports",
      "Presentation Folders",
      "Proposal Templates",
      "Business Cards",
      "Letterheads & Envelopes",
      "Corporate Stationery",
      "Calendars & Diaries",
      "Certificates",
      "Corporate Gift Sets",
    ],
  },
  {
    id: "packaging-solutions",
    icon: "▣",
    title: "Packaging Solutions",
    tagline: "Premium packaging that sells.",
    description:
      "From concept to production, we design packaging that protects your product, communicates your brand, and wins attention on the shelf.",
    subServices: [
      "Product Packaging",
      "Premium Packaging",
      "Food Packaging",
      "Cosmetic Packaging",
      "Retail Packaging",
      "Product Labels",
      "Stickers",
      "Custom Packaging Design",
    ],
  },
  {
    id: "signage-environmental",
    icon: "⬡",
    title: "Signage & Environmental Branding",
    tagline: "Spaces that speak your brand.",
    description:
      "We transform physical environments into brand experiences — from reception branding to full-scale wayfinding and illuminated signage systems.",
    subServices: [
      "3D Signage",
      "Illuminated Signage",
      "Acrylic Signage",
      "Reception Branding",
      "Office Branding",
      "Wayfinding Systems",
      "Wall Graphics",
      "Frosted Glass Branding",
      "Safety Signage",
    ],
  },
  {
    id: "marketing-promotional",
    icon: "◎",
    title: "Marketing & Promotional",
    tagline: "Campaigns that connect.",
    description:
      "From exhibition stands to vehicle wraps, we produce marketing and promotional materials that get your brand noticed in every setting.",
    subServices: [
      "Promotional Merchandise",
      "Exhibition Branding",
      "Event Branding",
      "Campaign Materials",
      "Roll-Up Banners",
      "Backdrops",
      "Vehicle Branding",
    ],
  },
  {
    id: "creative-design",
    icon: "◌",
    title: "Creative Design",
    tagline: "Design with purpose and precision.",
    description:
      "Strategic creative design across digital and print — from campaign concepts to social media graphics and product mockups that bring your brand to life.",
    subServices: [
      "Marketing Campaign Design",
      "Packaging Design",
      "Editorial Design",
      "Social Media Graphics",
      "Product Mockups",
      "Advertising Materials",
    ],
  },
  {
    id: "brand-production",
    icon: "⬟",
    title: "Brand Production",
    tagline: "Flawless execution. Every time.",
    description:
      "End-to-end production management and installation — we don't just design it, we build it, install it, and ensure it meets our quality standard.",
    subServices: [
      "Production Management",
      "Fabrication",
      "Installation Services",
      "Brand Implementation",
      "Quality Assurance",
    ],
  },
];

export const industries = [
  "Oil & Gas",
  "Manufacturing",
  "Construction",
  "Agriculture",
  "Retail",
  "Healthcare",
  "Hospitality",
  "Education",
  "Government",
  "Financial Services",
  "NGOs",
  "Technology",
];

export const whyChoose = [
  {
    title: "Strategic Creativity",
    description:
      "We blend creative thinking with brand strategy — every design decision serves a business purpose.",
  },
  {
    title: "Premium Craftsmanship",
    description:
      "Quality is non-negotiable. We apply exacting standards to every project, from concept to final delivery.",
  },
  {
    title: "Tailored Solutions",
    description:
      "No templates, no shortcuts. Every engagement is built around your specific brand objectives and audience.",
  },
  {
    title: "End-to-End Execution",
    description:
      "From ideation through production and installation — one partner, full accountability, zero handoff friction.",
  },
  {
    title: "Reliable Delivery",
    description:
      "We respect deadlines. Our project management process keeps complex productions on time and on budget.",
  },
  {
    title: "Lasting Brand Impact",
    description:
      "We build brands that endure. Our work creates recognition today and brand equity for years to come.",
  },
];

export const processSteps = [
  {
    step: "01",
    title: "Discover",
    description:
      "We begin with a deep-dive into your brand, business goals, audience, and competitive landscape. Understanding your context is the foundation of work that resonates.",
  },
  {
    step: "02",
    title: "Strategy",
    description:
      "We translate insights into a clear creative brief and strategic direction — defining positioning, tone, and visual language before a single design is produced.",
  },
  {
    step: "03",
    title: "Create",
    description:
      "Our creative team develops concepts, refines through structured feedback rounds, and produces work that balances aesthetic excellence with strategic intent.",
  },
  {
    step: "04",
    title: "Produce",
    description:
      "From pre-press to fabrication, we manage the full production process with precision — applying quality checks at every stage.",
  },
  {
    step: "05",
    title: "Deliver",
    description:
      "We complete with installation, handover, and brand asset delivery — ensuring everything is implemented correctly and built to last.",
  },
];

export const portfolioCategories = [
  "All",
  "Brand Identity",
  "Corporate Branding",
  "Packaging",
  "Signage",
  "Office Branding",
  "Promotional Merchandise",
  "Event Branding",
  "Vehicle Branding",
] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number];

export const portfolioItems = [
  { id: 1,  title: "Apex Energy — Brand System",       category: "Brand Identity" as PortfolioCategory,         image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=700&q=80",  client: "Apex Energy Group" },
  { id: 2,  title: "NovaTech Identity Suite",           category: "Brand Identity" as PortfolioCategory,         image: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=700&q=80",  client: "NovaTech Ltd" },
  { id: 3,  title: "Heritage Bank Visual Identity",     category: "Brand Identity" as PortfolioCategory,         image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=700&q=80",  client: "Heritage Bank" },
  { id: 4,  title: "Sterling Corp Annual Report",       category: "Corporate Branding" as PortfolioCategory,     image: "https://images.unsplash.com/photo-1542744095-291d1f67b221?w=700&q=80",  client: "Sterling Corporation" },
  { id: 5,  title: "Meridian Group Company Profile",    category: "Corporate Branding" as PortfolioCategory,     image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=700&q=80",  client: "Meridian Group" },
  { id: 6,  title: "Vertex Capital Stationery Suite",   category: "Corporate Branding" as PortfolioCategory,     image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=700&q=80",  client: "Vertex Capital" },
  { id: 7,  title: "Elara Cosmetics Premium Box",       category: "Packaging" as PortfolioCategory,              image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=700&q=80",  client: "Elara Beauty" },
  { id: 8,  title: "Harvest Foods Packaging Range",     category: "Packaging" as PortfolioCategory,              image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=700&q=80",  client: "Harvest Foods" },
  { id: 9,  title: "Cascade Spirits Label Design",      category: "Packaging" as PortfolioCategory,              image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80",  client: "Cascade Spirits" },
  { id: 10, title: "TowerPoint 3D Fascia Signage",      category: "Signage" as PortfolioCategory,                image: "https://images.unsplash.com/photo-1545289414-1c3cb1c06238?w=700&q=80",  client: "TowerPoint Properties" },
  { id: 11, title: "MedCenter Wayfinding System",       category: "Signage" as PortfolioCategory,                image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80",  client: "MedCenter Hospital" },
  { id: 12, title: "RetailMart Illuminated Signage",    category: "Signage" as PortfolioCategory,                image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=700&q=80",  client: "RetailMart" },
  { id: 13, title: "Pinnacle HQ Office Branding",       category: "Office Branding" as PortfolioCategory,        image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=700&q=80",  client: "Pinnacle Holdings" },
  { id: 14, title: "BlueSky Tech Reception Design",     category: "Office Branding" as PortfolioCategory,        image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=700&q=80",  client: "BlueSky Technologies" },
  { id: 15, title: "GlobalMine Wall Graphics",          category: "Office Branding" as PortfolioCategory,        image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=700&q=80",  client: "GlobalMine Resources" },
  { id: 16, title: "Summit Conference Merchandise",     category: "Promotional Merchandise" as PortfolioCategory, image: "https://images.unsplash.com/photo-1591085686350-798c0f9faa7f?w=700&q=80", client: "Summit Conference" },
  { id: 17, title: "EcoFarm Brand Merchandise Set",     category: "Promotional Merchandise" as PortfolioCategory, image: "https://images.unsplash.com/photo-1556742393-d75f468bfcb0?w=700&q=80", client: "EcoFarm Ltd" },
  { id: 18, title: "OilServ Trade Show Stand",          category: "Event Branding" as PortfolioCategory,         image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80",  client: "OilServ Nigeria" },
  { id: 19, title: "TechExpo Exhibition Branding",      category: "Event Branding" as PortfolioCategory,         image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=700&q=80",  client: "TechExpo Africa" },
  { id: 20, title: "GrandLaunch Event Backdrop",        category: "Event Branding" as PortfolioCategory,         image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=700&q=80",  client: "GrandLaunch Events" },
  { id: 21, title: "LogiTrans Full Fleet Wrap",         category: "Vehicle Branding" as PortfolioCategory,       image: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=700&q=80",  client: "LogiTrans Ltd" },
  { id: 22, title: "DeliverFast Van Branding",          category: "Vehicle Branding" as PortfolioCategory,       image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=700&q=80",  client: "DeliverFast" },
  { id: 23, title: "PromoRide Mobile Billboard",        category: "Vehicle Branding" as PortfolioCategory,       image: "https://images.unsplash.com/photo-1519817650390-64a93db51149?w=700&q=80",  client: "PromoRide Media" },
  { id: 24, title: "Cascade Cosmetics Gift Pack",       category: "Packaging" as PortfolioCategory,              image: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?w=700&q=80",  client: "Cascade Beauty" },
];

export const insightTopics = [
  "All",
  "Branding",
  "Packaging Trends",
  "Design Inspiration",
  "Marketing",
  "Visual Communication",
  "Business Growth",
  "Brand Strategy",
] as const;

export type InsightTopic = (typeof insightTopics)[number];

export const insights = [
  {
    id: 1,
    title: "Why Brand Consistency Drives Revenue",
    excerpt:
      "Inconsistent branding erodes trust faster than bad advertising. Here's how unified visual systems protect and grow your brand equity.",
    topic: "Branding" as InsightTopic,
    readTime: "5 min read",
    date: "July 2025",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=600&q=80",
  },
  {
    id: 2,
    title: "5 Premium Packaging Trends Shaping 2025",
    excerpt:
      "From tactile finishes to sustainable substrates, the packaging innovations winning over buyers right now.",
    topic: "Packaging Trends" as InsightTopic,
    readTime: "4 min read",
    date: "June 2025",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80",
  },
  {
    id: 3,
    title: "Office Branding: More Than Aesthetics — It Shapes Culture",
    excerpt:
      "How your physical workspace communicates brand values to employees and visitors alike — and why it matters more than ever.",
    topic: "Design Inspiration" as InsightTopic,
    readTime: "6 min read",
    date: "May 2025",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
  },
  {
    id: 4,
    title: "Maximising Exhibition ROI Through Strategic Branding",
    excerpt:
      "The brands that win at trade shows don't just show up — they show up with a system. Here's what separates memorable stands from forgettable ones.",
    topic: "Marketing" as InsightTopic,
    readTime: "5 min read",
    date: "April 2025",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80",
  },
  {
    id: 5,
    title: "The Hidden Power of Visual Communication in B2B Sales",
    excerpt:
      "B2B buyers make decisions with their eyes as much as their logic. How your visual language is quietly winning or losing deals.",
    topic: "Visual Communication" as InsightTopic,
    readTime: "7 min read",
    date: "March 2025",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&q=80",
  },
  {
    id: 6,
    title: "When to Rebrand: 6 Signals Your Brand Has Outgrown Itself",
    excerpt:
      "Rebranding at the wrong time is expensive. Not rebranding at the right time is more expensive. Here's how to read the signals.",
    topic: "Brand Strategy" as InsightTopic,
    readTime: "6 min read",
    date: "February 2025",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80",
  },
];
