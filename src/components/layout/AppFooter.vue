<template>
  <footer class="app-footer">
    <nav class="footer-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item bracket-link"
        :class="{ active: isActive(item.path) }"
      >
        <span class="nav-label-long">{{ item.labelLong }}</span>
        <span class="nav-label-short">{{ item.labelShort }}</span>
      </router-link>
    </nav>

    <div class="social-links">
      <a
        v-for="social in socialsConfig"
        :key="social.network"
        :href="social.url"
        :title="social.network"
        class="social-link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img :src="social.icon" :alt="social.network" class="social-icon" />
      </a>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { useRoute } from "vue-router";
  import { socialsConfig } from "../../config/socials-config";

  type NavItem = {
    path: string;
    labelLong: string;
    labelShort: string;
  };

  const route = useRoute();

  const navItems: NavItem[] = [
    { path: "/about", labelLong: "about", labelShort: "about" },
    { path: "/tech-radar", labelLong: "tech-radar", labelShort: "radar" },
    { path: "/experience", labelLong: "experience", labelShort: "xp" },
    { path: "/articles", labelLong: "articles", labelShort: "articles" },
  ];

  function isActive(path: string): boolean {
    if (path === "/tech-radar") {
      return route.path.startsWith("/tech-radar");
    }
    return route.path === path;
  }
</script>

<style scoped>
  .app-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;

    /* Glassy iOS-like effect */
    backdrop-filter: blur(24px) saturate(1.5);
    -webkit-backdrop-filter: blur(24px) saturate(1.5);
    background-color: oklch(0.12 0 0 / 0.82);
    border-top: 1px solid oklch(1 0 0 / 0.08);
    box-shadow: oklch(0 0 0 / 0.3) 0px -0.5px 0px 0px, oklch(1 0 0 / 0.05) 0px -0.5px 0px 0px inset;

    font-family: var(--font-mono);
    color: oklch(0.92 0 0);
    will-change: backdrop-filter, transform;
  }

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

  .nav-label-short {
    display: none;
  }

  .social-links {
    display: flex;
    align-items: center;
    gap: var(--space-4);
    margin-left: var(--space-6);
    padding-left: var(--space-6);
    border-left: 1px solid oklch(1 0 0 / 0.15);
  }

  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.7;
    transition: opacity var(--transition-fast), transform var(--transition-fast);
  }

  .social-link:hover {
    opacity: 1;
    transform: translateY(-2px);
  }

  .social-icon {
    width: 18px;
    height: 18px;
    filter: invert(1);
  }

  /* Light theme adjustments */
  :root:not([data-theme="dark"]) .app-footer,
  [data-theme="light"] .app-footer {
    background-color: oklch(0.98 0.005 260 / 0.82);
    color: oklch(0.25 0.01 260);
    border-top-color: oklch(0 0 0 / 0.08);
    box-shadow: oklch(0 0 0 / 0.1) 0px -0.5px 0px 0px, oklch(1 0 0 / 0.5) 0px -0.5px 0px 0px inset;
  }

  :root:not([data-theme="dark"]) .social-links,
  [data-theme="light"] .social-links {
    border-left-color: oklch(0 0 0 / 0.15);
  }

  :root:not([data-theme="dark"]) .social-icon,
  [data-theme="light"] .social-icon {
    filter: invert(0);
  }

  /* Mobile/small screens: show short labels */
  @media (max-width: 600px) {
    .footer-nav {
      gap: var(--space-4);
      padding: 0 var(--space-4);
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

    .social-links {
      gap: var(--space-3);
      margin-left: var(--space-4);
      padding-left: var(--space-4);
    }

    .social-icon {
      width: 16px;
      height: 16px;
    }
  }
</style>
