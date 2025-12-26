<template>
  <BaseGlassBar as="footer" position="bottom">
    <nav class="footer-nav">
      <BaseBracketLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        tabindex="0"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        <span class="nav-label-long">{{ item.labelLong }}</span>
        <span class="nav-label-short">{{ item.labelShort }}</span>
      </BaseBracketLink>
    </nav>

    <SocialLinks />
  </BaseGlassBar>
</template>

<script setup lang="ts">
  import { useRoute } from "vue-router";
  import SocialLinks from "./SocialLinks.vue";
  import BaseBracketLink from "../atoms/BaseBracketLink.vue";
  import BaseGlassBar from "../atoms/BaseGlassBar.vue";

  type NavItem = {
    path: string;
    labelLong: string;
    labelShort: string;
  };

  const route = useRoute();

  const navItems: NavItem[] = [
    { path: "/about", labelLong: "about", labelShort: "abt" },
    { path: "/tech-radar", labelLong: "tech-radar", labelShort: "radar" },
    { path: "/devlog", labelLong: "dev-log", labelShort: "log" },
    { path: "/experience", labelLong: "experience", labelShort: "xp" },
  ];

  function isActive(path: string): boolean {
    if (path === "/tech-radar") {
      return route.path.startsWith("/tech-radar");
    }
    return route.path === path;
  }
</script>

<style scoped>
  .footer-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-6);
    padding: 0 var(--space-6);
  }

  .nav-item {
    font-size: var(--text-base);
    color: inherit;
    opacity: 0.7;
    white-space: nowrap;
  }

  .nav-item:hover {
    opacity: 1;
  }

  .nav-item.active {
    opacity: 1;
    color: var(--color-primary);
  }

  .nav-item:focus-visible {
    opacity: 1;
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
    border-radius: var(--radius-sm);
  }

  .nav-label-short {
    display: none;
  }

  /* Mobile/small screens: show short labels */
  @media (--md) {
    .footer-nav {
      gap: var(--space-4);
      padding: 0 0;
    }

    .nav-label-long {
      display: none;
    }

    .nav-label-short {
      display: inline;
    }

    .nav-item {
      font-size: var(--text-sm);
    }
  }
</style>
