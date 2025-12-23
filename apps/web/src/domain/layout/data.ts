export type Social = {
  network: string;
  username: string;
  url: string;
  icon: string;
  iconColor: string;
};

export const socialsConfig: Social[] = [
  {
    network: "Email",
    username: "caiokf@gmail.com",
    url: "mailto:caiokf@gmail.com",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/gmail.svg",
    iconColor: "#D14836",
  },
  {
    network: "GitHub",
    username: "github.com/caiokf",
    url: "https://github.com/caiokf",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/github.svg",
    iconColor: "#181717",
  },
  {
    network: "LinkedIn",
    username: "linkedin.com/in/caiokf",
    url: "https://www.linkedin.com/in/caiokf/",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/linkedin.svg",
    iconColor: "#0077B5",
  },
  {
    network: "Toptal Profile",
    username: "toptal.com/resume/caio-kinzel-filho",
    url: "https://www.toptal.com/resume/caio-kinzel-filho",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/toptal.svg",
    iconColor: "#3863A0",
  },
  {
    network: "Codewars",
    username: "codewars.com/users/caiokf",
    url: "https://www.codewars.com/users/caiokf",
    icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/codewars.svg",
    iconColor: "#AD2C27",
  },
  // {
  //   network: "Codepen",
  //   username: "codepen.io/caiokf",
  //   url: "https://codepen.io/caiokf/",
  //   icon: "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/codepen.svg",
  //   iconColor: "#000000",
  // },
  // {
  //   network: "HackerRank",
  //   username: "hackerrank.com/caiokf",
  //   url: "https://www.hackerrank.com/caiokf",
  //   icon: "https://cdn4.iconfinder.com/data/icons/logos-and-brands-1/512/160_Hackerrank_logo_logos-512.png",
  //   iconColor: "#2BBD5D",
  // },
];
