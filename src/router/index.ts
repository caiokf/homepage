import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      redirect: "/about",
    },
    {
      path: "/about",
      name: "about",
      component: () => import("../pages/AboutPage.vue"),
    },
    {
      path: "/tech-radar",
      name: "tech-radar",
      component: () => import("../pages/TechRadarHomePage.vue"),
    },
    {
      path: "/tech-radar/:id",
      name: "tech-radar-view",
      component: () => import("../pages/TechRadarViewPage.vue"),
    },
    {
      path: "/experience",
      name: "experience",
      component: () => import("../pages/ExperiencePage.vue"),
    },
    {
      path: "/articles",
      name: "articles",
      component: () => import("../pages/ArticlesPage.vue"),
    },
    {
      path: "/articles/:slug",
      name: "article",
      component: () => import("../pages/ArticlePage.vue"),
    },
  ],
});

export default router;
