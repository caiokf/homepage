export type Experience = {
  company: string;
  companyLogoPath?: string;
  position: string;
  tags: string[];
  website: string;
  startDate: string;
  endDate?: string;
  highlights: string[];
  technologies: string;
};

export const experiencesConfig: Experience[] = [
  {
    company: "Flex",
    position: "Lead Frontend Developer",
    tags: ["remote", "fintech", "startup"],
    website: "https://www.getflex.com",
    startDate: "2020-05-22",
    highlights: [
      "Engineering lead at a Flex. The role is a combination of that of a principal engineer and an engineering manager",
      "Architecting and building new systems to improve Flex's key services such as Flex's bill payment engine and credit decisioning platform.",
      "Improving the performance of Flex's engineering team, while maintaining their focus on executing Flex's technical roadmap.",
      "Working closely with other teams like Product and Data Science to influence Flex's product vision.",
    ],
    technologies: "typescript, event-sourcing, aws, serverless, react native",
  },

  {
    company: "InDebted",
    position: "Senior Full-stack Developer",
    tags: ["remote", "fintech", "startup"],
    website: "https://www.indebted.co",
    startDate: "2019-11-20",
    endDate: "2020-05-22",
    highlights: [
      "Work on key features composing the main pillars of the new codebase while taking full ownership from conception to release.",
      "Research, analyse and translate business needs into solution architectures.",
      "Implement secure, self-healing, highly scalable serverless microservices.",
      "Ensure compliance best practices across the entire ecosystem.",
      "Take full ownership of features with implementation, integration & end-to-end testing, deployment, infrastructure management, logging, and monitoring.",
      "Receive and provide constructive feedback verbally and through code reviews.",
    ],
    technologies: "golang, event-sourcing, aws, serverless, node, react",
  },
];
