export type Project = {
  id: string;
  title: string;
  description: string;
  year: string;
  tags: string[];
  link?: string;
  metrics?: string;
  category?: "freelance" | "self";
};

export type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

export type Testimonial = {
  id: string;
  client: string;
  quote: string;
  role: string;
  company: string;
};

export type Developer = {
  id: string;
  name: string;
  role: string;
  bio: string;
  quote: string;
  avatar: string;
  skills: string[];
  works: Project[];
  timeline: TimelineItem[];
};

export const developers: Developer[] = [
  {
    id: "alex-chen",
    name: "Alex Chen",
    role: "Principal Full Stack Engineer",
    bio: "Veteran of the React ecosystem, specializing in distributed systems and rendering performance.",
    quote: "Performance is trust.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    skills: ["React", "Next.js", "Node.js", "AWS", "Go", "GraphQL"],
    works: [
      {
        id: "p1",
        title: "E-Commerce Platform",
        description: "Re-architected global checkout flow.",
        year: "2024",
        tags: ["Next.js", "Stripe"],
        metrics: "+20% Conversion",
      },
      {
        id: "p2",
        title: "HFT Dashboard",
        description: "Sub-10ms latency analytics.",
        year: "2023",
        tags: ["React", "Go"],
        metrics: "50k/sec",
      },
    ],
    timeline: [
      {
        year: "2024",
        title: "Principal Engineer",
        description: "Leading infra team.",
      },
    ],
  },
  {
    id: "sarah-jones",
    name: "Sarah Jones",
    role: "Design Systems Architect",
    bio: "Bridges design and engineering with mathematically consistent interfaces.",
    quote: "Design is inevitable.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    skills: ["Figma", "Tailwind", "Motion", "React"],
    works: [
      {
        id: "p3",
        title: "Nebula DS",
        description: "Unified design system for 5 products.",
        year: "2024",
        tags: ["Storybook", "Figma"],
        metrics: "60% Faster Handoff",
      },
    ],
    timeline: [
      { year: "2023", title: "Design Lead", description: "Rebranded suite." },
    ],
  },
  {
    id: "mike-ross",
    name: "Mike Ross",
    role: "Backend & Security Architect",
    bio: "Obsessed with security and DB optimization. The backbone of critical infra.",
    quote: "Security is a process.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
    skills: ["Rust", "Python", "K8s", "Postgres"],
    works: [
      {
        id: "p4",
        title: "Vault API",
        description: "Centralized auth mesh.",
        year: "2024",
        tags: ["Rust", "Kong"],
        metrics: "99.99% Uptime",
      },
    ],
    timeline: [
      {
        year: "2024",
        title: "Principal Architect",
        description: "Cloud-native designs.",
      },
    ],
  },
  {
    id: "elena-volkova",
    name: "Elena Volkova",
    role: "AI Engineer",
    bio: "Integrates LLMs into production apps. Turns data into intelligence.",
    quote: "The future is probabilistic.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena",
    skills: ["Python", "PyTorch", "React", "FastAPI"],
    works: [
      {
        id: "p5",
        title: "Predictive Engine",
        description: "Sales forecasting model.",
        year: "2024",
        tags: ["Python", "Scikit"],
        metrics: "92% Accuracy",
      },
    ],
    timeline: [
      { year: "2024", title: "AI Lead", description: "New division." },
    ],
  },
  {
    id: "david-kim",
    name: "David Kim",
    role: "Blockchain Developer",
    bio: "Expert in smart contracts and dApps. Transparency through code.",
    quote: "Code is law.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    skills: ["Solidity", "Web3.js", "React", "Rust"],
    works: [
      {
        id: "p7",
        title: "DeFi Exchange",
        description: "DEX smart contracts.",
        year: "2024",
        tags: ["Solidity"],
        metrics: "$50M TVL",
      },
    ],
    timeline: [
      { year: "2023", title: "Blockchain Dev", description: "NFT market." },
    ],
  },
  {
    id: "olivia-chen",
    name: "Olivia Chen",
    role: "Mobile Lead",
    bio: "Builds fluid, native-feeling experiences across iOS and Android.",
    quote: "One codebase, zero compromises.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia",
    skills: ["React Native", "Swift", "Kotlin"],
    works: [
      {
        id: "p8",
        title: "Health Tracker",
        description: "BLE wearable integration.",
        year: "2024",
        tags: ["React Native"],
        metrics: "4.8 Rating",
      },
    ],
    timeline: [
      {
        year: "2024",
        title: "Mobile Lead",
        description: "Managing mobile team.",
      },
    ],
  },
  // New Data
  {
    id: "marcus-thorne",
    name: "Marcus Thorne",
    role: "DevOps Specialist",
    bio: "Automating the unautomatable. CI/CD pipelines that run at the speed of thought.",
    quote: "Automate everything.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus",
    skills: ["Docker", "Kubernetes", "Terraform", "AWS"],
    works: [
      {
        id: "p9",
        title: "Global Mesh",
        description: "Multi-region K8s federation.",
        year: "2024",
        tags: ["K8s", "Terraform"],
        metrics: "0ms Downtime",
      },
    ],
    timeline: [
      { year: "2023", title: "SRE", description: "Scaled to 10k nodes." },
    ],
  },
  {
    id: "sophia-li",
    name: "Sophia Li",
    role: "AR/VR Engineer",
    bio: "Crafting immersive realities for the web and headsets.",
    quote: "Reality is canvas.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia",
    skills: ["Three.js", "WebGL", "Unity", "C#"],
    works: [
      {
        id: "p10",
        title: "Virtual Showroom",
        description: "3D product visualizer.",
        year: "2024",
        tags: ["Three.js"],
        metrics: "3x Engagement",
      },
    ],
    timeline: [
      { year: "2022", title: "3D Artist", description: "Game assets." },
    ],
  },
  {
    id: "james-halloway",
    name: "James Halloway",
    role: "Cybersecurity Analyst",
    bio: "Red team specialist. Finding cracks before the bad guys do.",
    quote: "Trust but verify.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    skills: ["Kali", "Python", "PenTesting", "NetworkSec"],
    works: [
      {
        id: "p11",
        title: "Bank Audit",
        description: "Full infrastructure pen-test.",
        year: "2024",
        tags: ["Security"],
        metrics: "Zero Breaches",
      },
    ],
    timeline: [
      { year: "2021", title: "Sec Ops", description: "Monitoring center." },
    ],
  },
  {
    id: "nina-patel",
    name: "Nina Patel",
    role: "Product Manager",
    bio: "Turning chaos into roadmaps. Aligning stakeholders and shipping value.",
    quote: "Ship it.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nina",
    skills: ["Jira", "SQL", "Strategy", "User Research"],
    works: [
      {
        id: "p12",
        title: "Fintech Launch",
        description: "Go-to-market for neo-bank.",
        year: "2024",
        tags: ["Product"],
        metrics: "100k Signups",
      },
    ],
    timeline: [{ year: "2023", title: "PM", description: "Growth team." }],
  },
  {
    id: "lucas-mendes",
    name: "Lucas Mendes",
    role: "Frontend Architect",
    bio: "Pushing the boundaries of what browsers can do.",
    quote: "60fps or nothing.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas",
    skills: ["Vue", "Svelte", "WebGL", "TS"],
    works: [
      {
        id: "p13",
        title: "Canvas Editor",
        description: "Browser-based image editor.",
        year: "2024",
        tags: ["WebGL"],
        metrics: "Photoshop-grade",
      },
    ],
    timeline: [
      { year: "2022", title: "Senior Dev", description: "UI library." },
    ],
  },
  {
    id: "yuki-tanaka",
    name: "Yuki Tanaka",
    role: "Quantum Researcher",
    bio: "Preparing our cryptography for the post-quantum era.",
    quote: "Superposition is strategy.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki",
    skills: ["Q#", "Python", "Math", "Physics"],
    works: [
      {
        id: "p14",
        title: "Q-Key Dist",
        description: "Quantum key distribution proto.",
        year: "2024",
        tags: ["Quantum"],
        metrics: "Secure",
      },
    ],
    timeline: [
      {
        year: "2023",
        title: "PhD Candidate",
        description: "Quantum computing.",
      },
    ],
  },
  {
    id: "omar-fayed",
    name: "Omar Fayed",
    role: "Database Administrator",
    bio: "Ensuring data integrity at petabyte scale.",
    quote: "Data never sleeps.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar",
    skills: ["Oracle", "Postgres", "Mongo", "Redis"],
    works: [
      {
        id: "p15",
        title: "Migration 2.0",
        description: "Zero-downtime DB migration.",
        year: "2024",
        tags: ["SQL"],
        metrics: "5PB Moved",
      },
    ],
    timeline: [
      { year: "2022", title: "DBA", description: "Financial sector." },
    ],
  },
  {
    id: "chloe-dubois",
    name: "Chloe Dubois",
    role: "UX Researcher",
    bio: "Understanding the human behind the screen.",
    quote: "Empathy is a skill.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe",
    skills: ["UserTesting", "Figma", "Psychology"],
    works: [
      {
        id: "p16",
        title: "Accessibility Study",
        description: "Global a11y audit.",
        year: "2024",
        tags: ["Research"],
        metrics: "WCAG AAA",
      },
    ],
    timeline: [{ year: "2023", title: "uxr", description: "Agency work." }],
  },
  {
    id: "hiroshi-sato",
    name: "Hiroshi Sato",
    role: "Embedded Systems Eng",
    bio: "Writing C for devices with 2KB of RAM.",
    quote: "Efficiency is everything.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Hiroshi",
    skills: ["C", "C++", "Assembly", "RTOS"],
    works: [
      {
        id: "p17",
        title: "IoT Sensor",
        description: "Smart agriculture node.",
        year: "2024",
        tags: ["C"],
        metrics: "5yr Battery",
      },
    ],
    timeline: [
      { year: "2021", title: "Firmware Dev", description: "Auto industry." },
    ],
  },
  {
    id: "isabella-rossi",
    name: "Isabella Rossi",
    role: "QA Lead",
    bio: "Breaking things so users don't have to.",
    quote: "Quality is non-negotiable.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella",
    skills: ["Selenium", "Cypress", "Python"],
    works: [
      {
        id: "p18",
        title: "Auto-Test Suite",
        description: "E2E coverage for main app.",
        year: "2024",
        tags: ["Cypress"],
        metrics: "90% Coverage",
      },
    ],
    timeline: [{ year: "2022", title: "QA Eng", description: "Fintech." }],
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    client: "James Wilson",
    role: "CTO",
    company: "TechFlow",
    quote: "Architected a scalable platform that is the core of our business.",
  },
  {
    id: "t2",
    client: "Amanda Lee",
    role: "Founder",
    company: "Artisan DAO",
    quote: "Every pixel feels intentional. A true premium experience.",
  },
  {
    id: "t3",
    client: "Robert Chen",
    role: "VP Eng",
    company: "GlobalFi",
    quote: "Delivered 10x beyond our expectations.",
  },
  {
    id: "t4",
    client: "Sarah Miller",
    role: "CEO",
    company: "StartUp Inc",
    quote: "The best dev team we've ever worked with.",
  },
  {
    id: "t5",
    client: "David Zhang",
    role: "Director",
    company: "MediaCorp",
    quote: "Fast, reliable, and incredibly talented.",
  },
];
