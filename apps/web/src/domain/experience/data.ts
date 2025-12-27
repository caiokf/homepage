export type Experience = {
  slug: string;
  company: string;
  via?: string;
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
    slug: "slice",
    company: "Slice",
    position: "Principal Engineer",
    tags: ["remote", "fintech", "startup"],
    website: "https://www.slice.co.uk",
    startDate: "2024-02-12",
    highlights: [
      "Slice is a fintech/traveltech startup focused on lay-by solutions for travel. I led the fintech team, leading payments orchestration and payment gateway integrations. I have been part of modernizing the platform, introducing new technologies and practices and changing how the company processes payments, saving us +7M AUD annually (and growing). I was also responsible for setting up platform and data platform infrastructure.",
    ],
    technologies:
      "typescript, aws, temporal, stripe, pulumi, nx, event-sourcing, k8s, bigquery, airbyte, neon",
  },

  {
    slug: "forgetmenot",
    company: "Forget Me Not",
    position: "Head of Engineering",
    tags: ["remote", "ed-tech", "startup"],
    website: "https://www.forgetmenot.com",
    startDate: "2022-02-16",
    endDate: "2024-02-09",
    highlights: [
      "As a hands-on Head of Engineering, I grew the team from 2 to 8 engineers, and introduced new ways to communicate with stakeholders, as well as multiple engineering improvements like reducing build time from 45min to 30s. With the team, we created multiple product offerings and started using AI to help build microlearning solutions.",
    ],
    technologies: "typescript, aws, serverless, pulumi, event-sourcing, bigquery",
  },

  {
    slug: "flex",
    company: "Flex",
    position: "Lead Frontend Engineer",
    tags: ["remote", "fintech", "startup"],
    website: "https://www.getflex.com",
    startDate: "2020-05-22",
    endDate: "2022-02-15",
    highlights: [
      "Single digit engineer employee, working as a lead frontend engineer, I was responsible for creating and maintaining mobile and web apps for Flex, a fintech startup focused on helping people manage their rent payments. I was reporting directly to the CTO and also involved in helping with backend development and architecture. Some other products I was heavily involved include customer onboarding, increasing app store rating from 3.2 to 4.5, bill payments and rent payment portal integrations, and analytics and funnel optimization.",
    ],
    technologies:
      "typescript, event-sourcing, aws, serverless, react-native, mixpanel, firebase, firestore, cloudformation, plaid, bigquery",
  },

  {
    slug: "indebted",
    company: "InDebted",
    position: "Senior Full-stack Developer",
    tags: ["remote", "fintech", "startup"],
    website: "https://www.indebted.co",
    startDate: "2019-11-20",
    endDate: "2020-05-22",
    highlights: [
      "As a senior full-stack developer at InDebted, a fintech startup focused on debt collection, I was responsible for researching, analyzing, and translating business needs into solution architectures. I took full ownership of key features from conception to release, implementing secure and scalable serverless microservices.",
    ],
    technologies: "golang, event-sourcing, aws, terraform,serverless, node, react",
  },

  {
    slug: "selectquote",
    company: "SelectQuote",
    via: "toptal",
    position: "Senior Full-stack Developer",
    tags: ["remote", "insurance", "contract"],
    website: "https://www.selectquote.com",
    startDate: "2019-03-25",
    endDate: "2019-06-21",
    highlights: [
      "Contractor working on the SelectQuote platform, a web application for insurance brokers to quote and sell insurance policies. Using C# and Node.js, I was responsible for adding functionality to the platform, creating A/B testing experiments and assisting in migrating it to a new platform.",
    ],
    technologies: "node.js, c#, web-api, sql",
  },

  {
    slug: "runthecall",
    company: "Run The Call",
    position: "Lead Front-end Engineer",
    tags: ["remote", "startup", "contract"],
    website: "https://runthecall.com/",
    startDate: "2017-01-13",
    endDate: "2019-01-20",
    highlights: [
      "As Lead Front-end Engineer, I was responsible for taking the current prototype into a market-ready MVP. In the process, I worked on setting up continuous integration, building the foundation for unit tests and automated acceptance tests, stabilizing and adding features to the frontend, and restructuring the app and migrating it from Angular to React.",
    ],
    technologies:
      "javascript, angular, graphql, docker, k8s, gcp, react, redux, redux-saga, styled-components",
  },

  {
    slug: "ethereum-marketplace",
    company: "Ethereum Marketplace Startup",
    position: "Full-stack Developer",
    tags: ["remote", "startup", "web3", "contract"],
    website: "",
    startDate: "2017-10-20",
    endDate: "2017-11-25",
    highlights: [
      "Developed a proof of concept app on ethereum smart contracts for a digital marketplace's payments and escrow. The prototype was built in Node.js, MongoDB, and GraphQL.",
    ],
    technologies:
      "javascript, react, redux, redux-saga, ethereum-smart-contracts, solidity, graphql, apollo, mongodb",
  },

  {
    slug: "scribe-intelligence",
    company: "Scribe Intelligence",
    via: "toptal",
    position: "Technical Lead",
    tags: ["remote", "startup", "ai", "contract"],
    website: "https://www.linkedin.com/company/scribe-intelligence/",
    startDate: "2017-11-20",
    endDate: "2018-08-24",
    highlights: [
      "Technical Lead at Scribe Intelligence, an AI startup for AI-powered transcription. Initially tasked with performance optimizations, I improved the streaming of speech recognition backends in 20x and a 10x speedup in UI rendering for large datasets. After that I took a few more projects while preparing the company's MVP. Meanwhile, I led and mentored a team of 3 developers.",
    ],
    technologies: "javasctipt, react, streaming, aws, elastic-search, mongodb, docker",
  },

  {
    slug: "clinova",
    company: "Clinova",
    position: "Lead React Native Developer",
    tags: ["remote", "healthcare", "contract"],
    website: "https://www.caidr.co.uk/",
    startDate: "2017-11-20",
    endDate: "2017-12-07",
    highlights: [
      "Contracted as a lead React Native developer tasked at creating a prototype used for fundraising for Clinova, a healthcare startup. I led a small team in the end-to-end development of their mobile application, from initial architectural design to deployment infrastructure. I was responsible for setting up the testing environment and preparing the app for internationalization.",
    ],
    technologies:
      "react-native, redux, styled-components, ios, android, fastlane, mongodb, express",
  },

  {
    slug: "buffalo-suny",
    company: "University at Buffalo",
    via: "toptal",
    position: "Senior React Developer",
    tags: ["remote", "education", "contract"],
    website: "",
    startDate: "2017-04-24",
    endDate: "2017-07-23",
    highlights: [
      "Senior React developer for the University at Buffalo, tasked at creating an MVP for a music notation editing application, used for music education. I built both the React frontend and the supporting Node.js backend APIs, while also managing the testing and deployment infrastructure and preparing the platform for internationalization.",
    ],
    technologies: "react, redux, redux-saga, immutable, reselect, enzyme, vexflow, mongodb",
  },

  {
    slug: "zenefits",
    company: "Zenefits | MustWin",
    via: "toptal",
    position: "Senior Frontend Developer",
    tags: ["remote", "hr-tech", "contract"],
    website: "https://www.zenefits.com",
    startDate: "2016-08-22",
    endDate: "2016-10-08",
    highlights: [
      "Working as a senior frontend developer for Zenefits, a HR-tech platform, I was responsible for modernizing the application by integrating React and Redux into the existing stack. Under tight deadlines, I implemented responsive web views and extended the Django-based backend while focusing on stabilizing the frontend and adding new features.",
    ],
    technologies: "react, redux, python, django, responsive-design",
  },

  {
    slug: "cisco",
    company: "Cisco | MustWin",
    via: "toptal",
    position: "Senior Fullstack Developer",
    tags: ["remote", "enterprise", "contract"],
    website: "",
    startDate: "2016-04-04",
    endDate: "2016-08-21",
    highlights: [
      "Contracted as a senior full-stack developer focusing on modernizing their frontend infrastructure. I was responsible for setting up a unit testing framework for an AngularJS codebase and architecting a data metrics pipeline using InfluxDB, Docker, Grafana, and Kafka to improve system observability.",
    ],
    technologies:
      "javascript, angular, restangular, ui-router, grunt, d3, grafana, docker, influxdb, kafka, mesos, consul",
  },

  {
    slug: "rackspace",
    company: "Rackspace",
    via: "tw",
    position: "Lead Consultant",
    tags: ["remote", "cloud"],
    website: "https://www.rackspace.com",
    startDate: "2013-11-20",
    endDate: "2015-02-01",
    highlights: [
      "Working for ThoughtWorks, I consulted at Rackspace, working on their cloud management platform. I was responsible for building a comprehensive dashboard for managing cloud resources and developing modules for automatic scaling. I focused heavily on DevOps practices, creating a continuous delivery pipeline with multiple daily deploys backed by thousands of automated tests.",
    ],
    technologies: "javaScript, closure, cassandra, react",
  },

  {
    slug: "jse",
    company: "Johannesburg Stock Exchange",
    via: "tw",
    position: "Technical Lead",
    tags: ["on-site", "fintech", "consulting"],
    website: "https://www.jse.co.za",
    startDate: "2013-02-01",
    endDate: "2013-11-01",
    highlights: [
      "As a Technical Lead at the Johannesburg Stock Exchange, I led the implementation of a pilot Agile project that became the blueprint for multiple teams within the organization. I provided strategic technical guidance, built internal tools to automate manual workloads, and trained teams on automated functional testing while assisting stakeholders with product inception and MVP specifications.",
    ],
    technologies: "c#, asp-net-mvc, sqlserver, nhibernate, javascript, angular",
  },

  {
    slug: "visioncritical",
    company: "Vision Critical",
    via: "tw",
    position: "Senior Web Developer",
    tags: ["on-site", "saas", "consulting"],
    website: "https://www.visioncritical.com",
    startDate: "2012-05-01",
    endDate: "2012-11-01",
    highlights: [
      "Senior web developer at Vision Critical, where I built a platform for customized survey creation. I implemented a polyglot persistence layer using MongoDB and SQL Server, developed RESTful APIs, and established a continuous delivery pipeline and functional testing suite for the engineering team.",
    ],
    technologies: "c#, asp-net-mvc, javascript, sqlserver, mongodb",
  },

  {
    slug: "measuredprogress",
    company: "Measured Progress",
    via: "tw",
    position: "Technical Lead",
    tags: ["on-site", "education", "consulting"],
    website: "https://www.measuredprogress.org",
    startDate: "2010-08-01",
    endDate: "2012-03-01",
    highlights: [
      "Technical Lead for Measured Progress, an education technology company. I architected and built a rich-client web application for student assessments from iteration zero to a successful platform. I introduced modern engineering practices like CI/CD and Agile to the organization and developed a custom WYSIWYG editor with support for complex math formulas.",
    ],
    technologies: "c#, asp-net-mvc, nhibernate, javascript, sqlserver",
  },

  {
    slug: "gap",
    company: "Gap Inc.",
    via: "tw",
    position: "Senior Web Developer",
    tags: ["on-site", "e-commerce", "consulting"],
    website: "",
    startDate: "2010-02-15",
    endDate: "2011-08-01",
    highlights: [
      "Senior web developer at Gap Inc., working on their large-scale enterprise e-commerce platform. Collaborating with multi-continent distributed teams, I focused on reducing technical debt and implementing core features for global payment processing and order fulfillment.",
    ],
    technologies: "java, spring, xml, xslt, e-commerce, agile, scrum",
  },

  {
    slug: "totvs",
    company: "TOTVS",
    position: "Senior Web Developer",
    tags: ["on-site", "healthcare", "enterprise"],
    website: "http://totvs.com",
    startDate: "2009-09-01",
    endDate: "2010-02-01",
    highlights: [
      "Senior web developer at TOTVS, working on mission-critical hospital management systems for some of Brazil's largest healthcare providers. Tasked with some of the product features like medicine inventory and dispensary, as well as projects like modernizing the development workflow and source control systems, advocating for CI/CD and unit testing practices.",
    ],
    technologies: "c#, sqlserver, oracle, multi-tenant, workflow-foundation",
  },

  {
    slug: "hos",
    company: "Farmácias Aguiar / HOS",
    position: "Technical Lead",
    tags: ["on-site", "healthcare"],
    website: "http://hos.com.br",
    startDate: "2007-02-01",
    endDate: "2009-09-01",
    highlights: [
      "Technical Lead at Farmácias Aguiar, where I single-handedly developed a logistics and call-center system that remained in production for over a decade. I managed the full project lifecycle, working closely with business experts, and mentored the development team through a major technology migration from VB6 to .NET, introducing OOP, Agile, and CI/CD practices.",
    ],
    technologies: "vb6, vb-net, c#, asp-net, web-forms, windows-forms, firebird, sqlserver",
  },

  {
    slug: "conceitoweb",
    company: "Conceito Web",
    position: "Freelancer Web Developer",
    tags: ["remote", "e-commerce"],
    website: "http://conceitoweb.com.br",
    startDate: "2007-09-01",
    endDate: "2008-02-01",
    highlights: [
      "Freelance web developer at Conceito Web, where I architected and developed a complex 'virtual shopping center' platform. Leading a team of 8 developers under tight deadlines, I was responsible for delivering the final project while mentoring junior engineers on multi-tiered application design and object-oriented programming.",
    ],
    technologies: "vb-net, sqlserver, e-commerce, multi-tier",
  },

  {
    slug: "solontavares",
    company: "Solon Tavares Technical State School",
    position: "Trainer",
    tags: ["on-site", "education"],
    website: "http://solontavares.com/",
    startDate: "2006-05-01",
    endDate: "2007-11-01",
    highlights: [
      "Part-time technical trainer at Solon Tavares Technical State School, where I taught software development and analysis. I was responsible for delivering curriculum on Object-Oriented Programming, system design, and fundaments of data structures, networking and algorithms.",
    ],
    technologies: "teaching, oop, data-structures, networking, algorithms",
  },

  {
    slug: "zeta",
    company: "Zeta Informática",
    position: "Developer",
    tags: ["on-site", "erp"],
    website: "http://zeta.com.br",
    startDate: "2005-11-01",
    endDate: "2006-07-01",
    highlights: [
      "Developer at Zeta Informática, working on their in-house ERP system using Clarion and Topspeed. I focused on core application modules and within two months of joining, achieved the highest performance markers within the development team.",
    ],
    technologies: "clarion, topspeed",
  },

  {
    slug: "server",
    company: "Server Informática",
    position: "Developer",
    tags: ["on-site", "internship"],
    website: "http://www.serverinformatica.com.br",
    startDate: "2005-01-01",
    endDate: "2005-06-01",
    highlights: [
      "Internship at Server Informática developing specialized applications for civil engineering clients, including some of the largest construction companies in Brazil. I focused on building web applications using Classic ASP while gaining foundational knowledge in database management and professional development processes.",
    ],
    technologies: "vb6, asp, sqlserver",
  },
];
