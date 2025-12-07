export type Skill = {
  title: string;
  description: string;
  iconPath?: string;
};

export const skillsConfig: Skill[] = [
  {
    title: "frontend architecture",
    description:
      "Building scalable, maintainable frontend systems with modern frameworks like React and Vue. Focus on performance, developer experience, and clean architecture patterns.",
  },
  {
    title: "backend development",
    description:
      "Designing and implementing robust backend services using Node.js, TypeScript, and cloud-native technologies. Experience with event-driven architectures and microservices.",
  },
  {
    title: "technical leadership",
    description:
      "Leading engineering teams through complex projects. Balancing technical excellence with business goals while mentoring developers and fostering a culture of continuous improvement.",
  },
  {
    title: "system design",
    description:
      "Architecting distributed systems that scale. From database design to API contracts, ensuring systems are resilient, observable, and maintainable.",
  },
];
