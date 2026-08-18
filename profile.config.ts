import { Schema } from "effect"

export const GithubSource = Schema.Struct({
  type: Schema.Literals(["user", "org"]),
  login: Schema.String,
})
export type GithubSourceType = typeof GithubSource.Type

export const FeaturedProject = Schema.Struct({
  key: Schema.String,
  badge: Schema.Struct({ text: Schema.String, color: Schema.String }),
  title: Schema.String,
  description: Schema.String,
  url: Schema.String,
  // relative to repo root; README and the site both resolve against this same file
  image: Schema.String,
})

export const WorkEntry = Schema.Struct({
  company: Schema.String,
  period: Schema.String,
  impact: Schema.String,
  details: Schema.Array(Schema.String),
  // README-only: renders a full-width section-divider row above this entry
  sectionBefore: Schema.optional(Schema.String),
})

export const Link = Schema.Struct({
  label: Schema.String,
  href: Schema.String,
})

export const ProfileConfig = Schema.Struct({
  name: Schema.String,
  tagline: Schema.String,
  bioIntro: Schema.String,
  bioLong: Schema.String,
  avatarSource: Schema.String,
  links: Schema.Array(Link),
  githubSources: Schema.Array(GithubSource),
  featuredProjects: Schema.Array(FeaturedProject),
  workHistory: Schema.Array(WorkEntry),
})

export type ProfileConfigType = typeof ProfileConfig.Type

const raw: typeof ProfileConfig.Encoded = {
  name: "Robin Brämer",
  tagline: "Engineer • Founder • Builder",
  bioIntro:
    "At 12, I wrote my first lines of code. By 17, I had built a gaming community with 500,000 users and led a team of 15. Today, I architect systems serving millions.",
  bioLong:
    "Experienced **Full Stack • Platform Engineer** with a proven track record of building scalable, cloud-native systems. Specialized in **Go**, **Kubernetes**, **Temporal**, **TypeScript**, **SvelteKit**, and modern infrastructure patterns. Successfully led projects serving millions of users, from fintech compliance systems to cloud platforms and developer tooling.",
  avatarSource: "https://avatars.githubusercontent.com/u/22003767",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/robin-br%C3%A4mer/" },
    { label: "Email", href: "mailto:robin.braemer@web.de" },
    { label: "@robinbraemer", href: "https://github.com/robinbraemer" },
    { label: "X", href: "https://x.com/robinbraemer" },
  ],
  githubSources: [
    { type: "user", login: "robinbraemer" },
    { type: "org", login: "minekube" },
    { type: "org", login: "akua-dev" },
  ],
  featuredProjects: [
    {
      key: "agentos",
      badge: { text: "Agent-OS", color: "F7F680" },
      title: "Self-driving company harness",
      description: "Build autonomous companies.",
      url: "https://agentos.akua.dev",
      image: "site/public/projects/agentos.png",
    },
    {
      key: "akua",
      badge: { text: "Akua-Cloud", color: "5196CD" },
      title: "Agentic Cloud Platform",
      description: "Build self-hosted clouds, sell software products.",
      url: "https://docs.akua.dev",
      image: "site/public/projects/akua.png",
    },
    {
      key: "hetzner-auctions",
      badge: { text: "Hetzner-Browser", color: "c5272a" },
      title: "Hetzner Value Auctions",
      description: "Smarter Hetzner server search with real performance data and filters.",
      url: "https://auction.akua.dev/about",
      image: "site/public/projects/hetzner-auctions.png",
    },
    {
      key: "dribble",
      badge: { text: "Dribble-Sports", color: "000000" },
      title: "More Than Just Watching",
      description: "Real-time chatrooms. Synchronized polls and reactions for live games.",
      url: "https://dribblesports.com",
      image: "site/public/projects/dribble.png",
    },
    {
      key: "minekube-connect",
      badge: { text: "Minekube-Connect", color: "f57c00" },
      title: "The Cloudflare for Gaming",
      description: "DDoS-protected tunnel for Minecraft. Zero-config, global.",
      url: "https://connect.minekube.com",
      image: "site/public/projects/minekube-connect.png",
    },
    {
      key: "minekube-ai",
      badge: { text: "Minekube-AI Servers", color: "6366f1" },
      title: "AI Minecraft Servers",
      description: "Create, and customize Minecraft servers with AI. Just chat ingame.",
      url: "https://minekube.com",
      image: "site/public/projects/minekube-ai.png",
    },
    {
      key: "gate",
      badge: { text: "Gate-Proxy", color: "3ba3e6" },
      title: "High-Performance Proxy",
      description: "A high-performance, scalable Minecraft proxy in Go.",
      url: "https://gate.minekube.com",
      image: "site/public/projects/gate.png",
    },
  ],
  workHistory: [
    {
      company: "Sovereign Cloud Provider",
      period: "2026-Present",
      impact:
        "SRE & Platform Engineer — Building managed database services for a major European cloud platform. Go, Kubernetes, FluxCD, Terraform at scale",
      details: [
        "• Database engineering platform team",
        "• Large-scale infrastructure (hundreds of thousands of cores, tens of thousands of VMs)",
        "• Go, Kubernetes, FluxCD, Helm, Terraform",
        "• Prometheus, VictoriaMetrics, Grafana, OpenTelemetry",
      ],
    },
    {
      company: "Elefant AI",
      period: "2024-2025",
      impact: "AI agents in 3D worlds. Developed AI Minecraft agent; integrated Gate proxy",
      details: [
        "• Implemented Gate proxy into agent system",
        "• Developed AI Minecraft agent",
        "• Feature development, bug fixes, code cleanup",
        "• Assisted with Minecraft community entry",
      ],
    },
    {
      company: "CubeCraft",
      period: "2024",
      impact: "Kubernetes-based game hosting. Scaled infrastructure for <b>millions</b> of players",
      details: [
        "• Built system using Kubernetes & Java Operator Framework",
        "• Designed APIs for hosting platform",
        "• Automated deployment & scaling mechanisms",
        "• Created monitoring & alerting systems",
        "• Optimized resource allocation",
      ],
    },
    {
      company: "SumUp",
      period: "2022-2023",
      impact:
        "Developer platforms & fintech compliance. <b>65%</b> faster incident resolution, <b>40%</b> developer productivity boost, <b>800+</b> engineers on portal",
      details: [
        "• Built \"SumUp Backstage\" internal developer portal",
        "• Architected Compliance Alert Engine with Temporal",
        "• Co-founded observability improvements team",
        "• Automated onboarding for 2,000 Git projects",
        "• Migrated 800 GitHub teams to new structure",
      ],
    },
    {
      company: "JustChunks",
      period: "2021-2023",
      impact: "Game backend microservices. Scalable architecture, CI/CD pipelines, Agones matchmaking",
      details: [
        "• Engineered scalable microservices architecture",
        "• Implemented Kubernetes deployments for game servers",
        "• Developed CI/CD pipelines",
        "• Built configurable matchmaking system using Agones",
        "• Monitoring & logging solutions",
      ],
    },
    {
      company: "Akua",
      period: "2024-Present",
      impact:
        "Founder — Cloud app deployment platform. Building SaaS marketplace for self-hosting & selling software services",
      sectionBefore: "Side Projects & Open Source",
      details: [
        "• Platform for packaging, deploying, and selling applications",
        "• Self-hosting infrastructure for developers",
        "• SaaS marketplace capabilities",
      ],
    },
    {
      company: "Minekube",
      period: "2018-Present",
      impact:
        "Founder — Cloud-native Minecraft infra. Gate proxy (<b>50%</b> perf boost), <b>100+</b> OSS contributions, millions served",
      details: [
        "• Developed Minekube Connect cloud-native TCP edge network",
        "• Created Gate high-performance reverse proxy",
        "• DDoS-protected developer platform",
        "• Leading team of developers",
        '• Positioned as "The Cloudflare for Minecraft"',
      ],
    },
    {
      company: "MyPvP",
      period: "2014-2018",
      impact: "Founded SkyPvP gaming network. <b>500K+</b> registered players, led team of <b>15</b>",
      details: [
        "• Founded prominent SkyPvP Java edition game network",
        "• Managed community of 400 avg concurrent players",
        "• Led team of 15 members",
        "• First online shop at age 14",
      ],
    },
  ],
}

export const profile = Schema.decodeUnknownSync(ProfileConfig)(raw)
