import type {
  TechRadarDataProvider,
  RadarVersion,
} from "./data-provider";
import type { TechRadarData } from "./types";
import { RING_NAMES } from "../config";

const DEFAULT_VERSION: RadarVersion = { id: "default", name: "Default" };

const sampleData: TechRadarData = {
  title: "Technology Radar",
  rings: [...RING_NAMES],
  // Note: quadrant names are extracted from blips in Radar.create()
  blips: [
    // Techniques quadrant
    {
      name: "Micro Frontends",
      ring: "Adopt",
      quadrant: "Techniques",
      isNew: false,
      status: "no change",
      description:
        "Breaking up frontend monoliths into smaller, independently deployable pieces.",
    },
    {
      name: "Design Tokens",
      ring: "Adopt",
      quadrant: "Techniques",
      isNew: true,
      status: "new",
      description:
        "Platform-agnostic way to store design decisions like colors, typography, and spacing.",
    },
    {
      name: "Team Topologies",
      ring: "Trial",
      quadrant: "Techniques",
      isNew: false,
      status: "moved in",
      description:
        "Organizing business and technology teams for fast flow of change.",
    },
    {
      name: "Dependency Pruning",
      ring: "Trial",
      quadrant: "Techniques",
      isNew: true,
      status: "new",
      description: "Regularly auditing and removing unnecessary dependencies.",
    },
    {
      name: "Server-Driven UI",
      ring: "Assess",
      quadrant: "Techniques",
      isNew: true,
      status: "new",
      description: "UI configuration and layout driven by backend responses.",
    },
    {
      name: "Chaos Engineering",
      ring: "Assess",
      quadrant: "Techniques",
      isNew: false,
      status: "no change",
      description:
        "Deliberately introducing failures to test system resilience.",
    },
    {
      name: "GitOps",
      ring: "Adopt",
      quadrant: "Techniques",
      isNew: false,
      status: "no change",
      description: "Using Git as single source of truth for infrastructure.",
    },

    // Platforms quadrant
    {
      name: "Kubernetes",
      ring: "Adopt",
      quadrant: "Platforms",
      isNew: false,
      status: "no change",
      description:
        "Container orchestration platform for automating deployment.",
    },
    {
      name: "Cloudflare Workers",
      ring: "Trial",
      quadrant: "Platforms",
      isNew: true,
      status: "new",
      description: "Serverless execution environment at the edge.",
    },
    {
      name: "Supabase",
      ring: "Trial",
      quadrant: "Platforms",
      isNew: false,
      status: "moved in",
      description: "Open source Firebase alternative with Postgres.",
    },
    {
      name: "AWS App Runner",
      ring: "Assess",
      quadrant: "Platforms",
      isNew: true,
      status: "new",
      description: "Fully managed container application service.",
    },
    {
      name: "Deno Deploy",
      ring: "Assess",
      quadrant: "Platforms",
      isNew: true,
      status: "new",
      description: "Distributed serverless JavaScript/TypeScript runtime.",
    },
    {
      name: "PlanetScale",
      ring: "Trial",
      quadrant: "Platforms",
      isNew: false,
      status: "no change",
      description: "Serverless MySQL platform with branching.",
    },
    {
      name: "Vercel",
      ring: "Adopt",
      quadrant: "Platforms",
      isNew: false,
      status: "no change",
      description: "Platform for frontend frameworks and static sites.",
    },

    // Tools quadrant
    {
      name: "Vite",
      ring: "Adopt",
      quadrant: "Tools",
      isNew: false,
      status: "no change",
      description: "Next generation frontend tooling with instant HMR.",
    },
    {
      name: "Turborepo",
      ring: "Trial",
      quadrant: "Tools",
      isNew: true,
      status: "new",
      description: "High-performance build system for monorepos.",
    },
    {
      name: "Playwright",
      ring: "Adopt",
      quadrant: "Tools",
      isNew: false,
      status: "moved in",
      description: "End-to-end testing framework for modern web apps.",
    },
    {
      name: "Bruno",
      ring: "Trial",
      quadrant: "Tools",
      isNew: true,
      status: "new",
      description: "Open source IDE for exploring and testing APIs.",
    },
    {
      name: "Biome",
      ring: "Assess",
      quadrant: "Tools",
      isNew: true,
      status: "new",
      description: "Fast formatter and linter for JavaScript/TypeScript.",
    },
    {
      name: "Tauri",
      ring: "Assess",
      quadrant: "Tools",
      isNew: false,
      status: "no change",
      description: "Build smaller, faster desktop apps with web technologies.",
    },
    {
      name: "pnpm",
      ring: "Adopt",
      quadrant: "Tools",
      isNew: false,
      status: "no change",
      description: "Fast, disk space efficient package manager.",
    },

    // Languages & Frameworks quadrant
    {
      name: "TypeScript",
      ring: "Adopt",
      quadrant: "Languages & Frameworks",
      isNew: false,
      status: "no change",
      description: "Typed superset of JavaScript that compiles to plain JS.",
    },
    {
      name: "Vue 3",
      ring: "Adopt",
      quadrant: "Languages & Frameworks",
      isNew: false,
      status: "no change",
      description: "Progressive JavaScript framework with Composition API.",
    },
    {
      name: "Rust",
      ring: "Trial",
      quadrant: "Languages & Frameworks",
      isNew: false,
      status: "moved in",
      description:
        "Systems programming language focused on safety and performance.",
    },
    {
      name: "SolidJS",
      ring: "Trial",
      quadrant: "Languages & Frameworks",
      isNew: true,
      status: "new",
      description: "Reactive JavaScript library with fine-grained reactivity.",
    },
    {
      name: "Effect",
      ring: "Assess",
      quadrant: "Languages & Frameworks",
      isNew: true,
      status: "new",
      description: "TypeScript library for building robust applications.",
    },
    {
      name: "Zig",
      ring: "Hold",
      quadrant: "Languages & Frameworks",
      isNew: true,
      status: "new",
      description: "Systems programming language as C replacement.",
    },
    {
      name: "htmx",
      ring: "Assess",
      quadrant: "Languages & Frameworks",
      isNew: false,
      status: "moved out",
      description: "Access modern browser features directly from HTML.",
    },
    {
      name: "Astro",
      ring: "Trial",
      quadrant: "Languages & Frameworks",
      isNew: false,
      status: "no change",
      description: "Static site builder with partial hydration.",
    },
  ],
};

export class DataProviderSample implements TechRadarDataProvider {
  async listVersions(): Promise<RadarVersion[]> {
    return [DEFAULT_VERSION];
  }

  async fetchVersion(_versionId: string): Promise<TechRadarData> {
    return sampleData;
  }
}
