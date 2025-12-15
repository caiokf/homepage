export type Skill = {
  title: string;
  description: string;
};

export const skillsConfig: Skill[] = [
  {
    title: "architecture for rapid scaling",
    description:
      "Design and implement systems that ship fast while preventing the technical debt paralysis that kills scaling. This means making architectural decisions that intentionally accommodate 10x growth without rewrites, prioritizing data flow integrity, event-driven patterns, and observable systems over perfection. I establish which technical shortcuts are strategic versus dangerous, document these decisions explicitly, and create architectural guard rails that prevent future teams from undoing good decisions or repeating mistakes.",
  },
  {
    title: "data architecture as business strategy",
    description:
      "Build data models and ontologies that force clarity about what actually matters. Bad data architecture hides business assumptions and allows founders to operate on beliefs rather than signals. I design systems where data flows tell the truth about product-market fit, customer behavior, and operational health—making it obvious when you're chasing ghosts versus solving real problems.",
  },
  {
    title: "technical foundation as hiring and culture accelerant",
    description:
      "Establish technical standards, decision-making frameworks, and ownership patterns that make hiring and scaling frictionless. I build systems where junior engineers can thrive without constant senior oversight, create transparent decision frameworks that eliminate consensus theater and establish accountability, and design processes that enable junior hires to be productive in weeks not months. The engineering culture compounds.It determines whether you attract talent, retain people, and scale velocity.",
  },
  {
    title: "ai-augmented team productivity",
    description:
      "Build LLM-driven workflows and developer experience systems that turn junior engineers into force multipliers and let senior engineers tackle bigger problems. I architect context systems, code generation frameworks, and agentic tools that augment human judgment rather than replace it, making exploration and refactoring fast enough to keep pace with product pivots. This isn't about replacing engineers—it's about making the small team you have maximally productive so you can validate product-market fit faster, onboard new engineers more effectively, and keep technical decisions clean.",
  },
];
