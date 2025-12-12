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
      "Principal engineer at Slice, a fintech startup focused on lay-by solutions for travel.",
    ],
    technologies: "typescript, react, node, aws",
  },

  {
    slug: "forgetmenot",
    company: "Forget Me Not",
    position: "Head of Engineering",
    tags: ["remote", "ed-tech", "startup"],
    website: "https://www.forgetmenot.com",
    startDate: "2022-02-16",
    endDate: "2024-02-09",
    highlights: ["Lead engineer at Forget Me Not, building micro learning solutions."],
    technologies: "typescript, react, node, aws, serverless",
  },

  {
    slug: "flex",
    company: "Flex",
    position: "Lead Frontend Developer",
    tags: ["remote", "fintech", "startup"],
    website: "https://www.getflex.com",
    startDate: "2020-05-22",
    endDate: "2022-02-15",
    highlights: [
      "Engineering lead at a Flex. The role is a combination of that of a principal engineer and an engineering manager",
      "Architecting and building new systems to improve Flex's key services such as Flex's bill payment engine and credit decisioning platform.",
      "Improving the performance of Flex's engineering team, while maintaining their focus on executing Flex's technical roadmap.",
      "Working closely with other teams like Product and Data Science to influence Flex's product vision.",
    ],
    technologies: "typescript, event-sourcing, aws, serverless, react native",
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
      "Work on key features composing the main pillars of the new codebase while taking full ownership from conception to release.",
      "Research, analyse and translate business needs into solution architectures.",
      "Implement secure, self-healing, highly scalable serverless microservices.",
      "Ensure compliance best practices across the entire ecosystem.",
      "Take full ownership of features with implementation, integration & end-to-end testing, deployment, infrastructure management, logging, and monitoring.",
      "Receive and provide constructive feedback verbally and through code reviews.",
    ],
    technologies: "golang, event-sourcing, aws, serverless, node, react",
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
      "Add functionality to C# and Node.js projects.",
      "Create A/B Testing variants of customer facing pages.",
      "Work on system migration to a new platform.",
    ],
    technologies: "Node.js, C#, Web Api, SQL",
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
      "Set up continuous integration.",
      "Built the foundation for unit tests and automated acceptance tests.",
      "Stabilized and added features to the frontend.",
      "Restructured the app and migrate it from Angular to React.",
      "Created js-side styleguides.",
      "Created an app-wide component library.",
      "Fixed defects and get the app ready for production.",
    ],
    technologies:
      "JavaScript, AngularJS, GraphQL, Docker, Kubernetes, Google Cloud, Node.js, React.js, Redux, Redux-saga, styled-components",
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
      "Developed a proof of concept app on ethereum smart contracts for a digital markplace's payments and escrow.",
      "Built a back-end in Node.js, MongoDB, and GraphQL.",
      "Created a front-end in React to integrate with GraphQL using Apollo.",
      "Implemented the authentication system with Auth0 in React.",
    ],
    technologies:
      "Node.js, React, Redux, Redux-saga, Ethereum Smart Contracts, Solidity, GraphQL, Apollo, MongoDB",
  },

  {
    slug: "scribe-intelligence",
    company: "Scribe Intelligence",
    via: "toptal",
    position: "Technical Lead",
    tags: ["remote", "startup", "ai", "contract"],
    website: "https://www.linkedin.com/company/scribe-intelligence/posts/?feedView=all",
    startDate: "2017-11-20",
    endDate: "2018-08-24",
    highlights: [
      "Led and mentored a small team of developers.",
      "Optimized the performance of a streaming back-end for speech recognition by 20x.",
      "Built the foundation for a test-driven development workflow.",
      "Decreased the operational costs of the application pipeline by improving third-party integration points.",
      "Architected and implemented a backend migration to Event Sourcing.",
      "Redesigned the React frontend.",
      "Improved performance of the UI for the rendering of large datasets by 10x.",
    ],
    technologies: "Node.js, React, Event Sourcing, Streaming, AWS, ElasticSearch, MongoDB, Docker",
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
      "Led a small team in the development of a React Native app.",
      "Designed and architected the application from specs to deployment.",
      "Set up tests and deployment infrastructure.",
      "Prepared the application for internationalization and copywriting.",
    ],
    technologies:
      "React Native, Redux, Styled Components, iOS, Android, Fastlane, MongoDB, Node.js, Express",
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
      "Developed a React application for music notation editing.",
      "Created a back-end application to handle simple APIs endpoints.",
      "Set up tests and deployment infrastructure.",
      "Prepared the application for internationalization and copywriting.",
    ],
    technologies:
      "React, Redux, Redux-saga, Immutable, Reselect, Enzyme, VexFlow, MongoDB, Node.js",
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
      "Added React/Redux to the existing application.",
      "Implemented responsive web views using React.js and Sass under a tight deadline.",
      "Maintained and extended the existing Django framework and models.",
      "Stabilized and added features to the frontend.",
    ],
    technologies: "ReactJS, Redux, Python, Django, Responsive Design, Sass",
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
      "Worked as a JavaScript frontend developer on an AngularJS code base.",
      "Set up a unit testing framework for frontend application.",
      "Created a data metrics pipeline using InfluxDB, Docker, Grafana, and Kafka.",
    ],
    technologies:
      "JavaScript, AngularJS, Grafana, Docker, InfluxDB, Kafka, Restangular, UI Router, Grunt, D3.js",
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
      "Worked on a continuous delivery pipeline with multiple deploys a day.",
      "Created a dashboard for managing cloud servers, databases, and other resources",
      "Developed a module for the management of automatic scaling of cloud servers and nodes.",
      "Created a pipeline with thousands of tests backing the deployment process from commit to production deploy.",
    ],
    technologies: "JavaScript, Google Closure, Cassandra, Node.js, React",
  },

  {
    slug: "jse",
    company: "Johannesburg Stock Exchange",
    via: "tw",
    position: "Technical Lead",
    tags: ["on-site", "fintech"],
    website: "https://www.jse.co.za",
    startDate: "2013-02-01",
    endDate: "2013-11-01",
    highlights: [
      "Implemented a pilot Agile project to be further followed by multiple teams within the organization.",
      "Provided guidance for the client's technical leads on processes and tools.",
      "Built an internal tool to remove manual workload for an important department.",
      "Trained client developers and testers on automated functional tests.",
      "Helped the business with project inception and minimal viable product specifications.",
    ],
    technologies: "C#, ASP.NET MVC, SQL Server, NHibernate, JavaScript, AngularJS",
  },

  {
    slug: "visioncritical",
    company: "Vision Critical",
    via: "tw",
    position: "Senior Web Developer",
    tags: ["on-site", "saas"],
    website: "https://www.visioncritical.com",
    startDate: "2012-05-01",
    endDate: "2014-11-01",
    highlights: [
      "Built a platform for customized survey creation.",
      "Created a continuous delivery pipeline.",
      "Implemented a polyglot persistence on MongoDB and SQL Server.",
      "Worked on a RESTful API for back-end services.",
      "Designed a functional testing suite to be used by developers and testers.",
    ],
    technologies: "C#, ASP.NET MVC, JavaScript, SQL Server, MongoDB",
  },

  {
    slug: "measuredprogress",
    company: "Measured Progress",
    via: "tw",
    position: "Technical Lead",
    tags: ["on-site", "education"],
    website: "https://www.measuredprogress.org",
    startDate: "2010-08-01",
    endDate: "2012-03-01",
    highlights: [
      "Built a rich client web application to manage custom student assessments.",
      "Introduced continuous integration, testing, and Agile processes to the project as a pilot to the organization.",
      "Developed a testing framework for a higher integration between business analysts and developers.",
      "Worked on a rich WYSIWYG editor with custom functions and math formulas.",
      "Designed the application from iteration 0 to a succesful platform.",
    ],
    technologies: "C#, ASP.NET MVC, NHibernate, JavaScript, SQL Server",
  },

  {
    slug: "gap",
    company: "Gap Inc.",
    via: "tw",
    position: "Senior Web Developer",
    tags: ["on-site", "e-commerce"],
    website: "",
    startDate: "2010-02-15",
    endDate: "2011-08-01",
    highlights: [
      "Worked on a large-scale enterprise e-commerce with multi-continent distributed teams.",
      "Developed a plan to reduce technical debt.",
      "Worked on global payment processing and order fullfillment.",
    ],
    technologies: "Java, Spring, XML, XSLT, e-commerce, Agile, Scrum",
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
      "Worked on hospital management systems used by some of the largest hospitals in Brazil.",
      "Helped transition from an old VCS to Subversion.",
      "Advocated for Continuous Integration and unit testing practices that was later adopted by the company.",
    ],
    technologies:
      "C#, MSSQL, Oracle, large enterprise multi-tenant software, MS Workflow Foundation",
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
      "Single-handedly developed a logistics and call-center system which was still being used in production 10+ years later.",
      "Involved in the the full project life-cycle, working closely with business experts.",
      "Traning a small team of developers on OOP, Agile, Testing, CI/CD for a migration from VB6 to .NET",
    ],
    technologies: "VB6, VB.NET, C#, ASP.NET WebForms, Windows Forms, Firebird, MSSQL",
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
      'Architected and developed the company\'s vision of a "virtual shopping center".',
      "Worked through a tight deadline with a team of 8 developers to deliver the final project.",
      "Mentoring junior developers on multi-tiered application design and OOP.",
    ],
    technologies: "VB.NET, MSSQL, e-commerce, multi-tiered application",
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
      "Part-time trainer teaching Software Development and Analysis.",
      "Taught Object-Oriented Programming and Design, and Data Structures and Algorithms.",
    ],
    technologies: "Formal teaching experience",
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
      "In-house developed ERP system. I worked on some of the application modules in Clarion language, with Topspeed database.",
      "Within two months, I held the highest performance markers amongst all the developers.",
    ],
    technologies: "Clarion, Topspeed",
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
      "Internship developing an application for civil engineering clients, used by some of the largest construction companies in Brazil.",
      "Learned Classic ASP and improved my knowledge on databases and development processes.",
    ],
    technologies: "Visual Basic 6, Classic ASP, MSSQL",
  },
];
