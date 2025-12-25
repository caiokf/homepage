export type Skill = {
  title: string;
  description: string;
};

export const skillsConfig: Skill[] = [
  {
    title: "ai-powered engineering",
    description:
      "Build LLM-driven workflows that turn small teams into force multipliers. Context systems, code generation, and agentic tools that augment human judgment rather than replace it. Exploration and refactoring fast enough to keep pace with pivots. Validate faster, onboard more effectively, keep technical decisions clean.",
  },
  {
    title: "scaling architecture",
    description:
      "Build systems that ship fast without accumulating technical debt. Intentional 10-100x growth accommodation, data flow integrity, event-driven patterns, and observable systems. Document which shortcuts are strategic versus dangerous, establish guard rails that prevent repeating mistakes.",
  },
  {
    title: "data architecture as business signal",
    description:
      "Design data models that force clarity about what actually matters. Data flows tell the truth about product-market fit, customer behavior, and operational health. Makes it obvious when you're chasing ghosts versus solving real problems.",
  },
  {
    title: "technical foundation as culture multiplier",
    description:
      "Establish standards, decision frameworks, and ownership patterns that make scaling frictionless. Junior engineers thrive without constant oversight. Transparent decision-making eliminates consensus theater and establishes accountability. Productive new hires in weeks, not months.",
  },
];
