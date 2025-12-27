import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(_to, _from, savedPosition) {
    // If browser back/forward, restore saved position
    if (savedPosition) {
      return savedPosition;
    }
    // Otherwise scroll to top
    return { top: 0 };
  },
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../pages/AboutPage.vue"),
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
      path: "/devlog",
      name: "devlog",
      component: () => import("../pages/DevLogPage.vue"),
    },
    // Legacy redirect for old article URLs
    {
      path: "/articles",
      redirect: "/devlog",
    },
    {
      path: "/articles/:slug",
      redirect: "/devlog",
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../pages/NotFoundPage.vue"),
    },
  ],
});

export default router;
