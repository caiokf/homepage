<template>
  <header class="app-header">
    <div class="header-content">
      <router-link to="/about" class="header-logo">
        <span class="logo-text">dev.caiokf</span>
      </router-link>
      <BaseThemeToggle />
    </div>
  </header>
</template>

<script setup lang="ts">
  import BaseThemeToggle from "../atoms/BaseThemeToggle.vue";
</script>

<style scoped>
  .app-header {
    position: fixed;
    top: 0;
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
    background-color: oklch(0.12 0 0 / 0.5);
    border-bottom: 1px solid oklch(1 0 0 / 0.08);
    box-shadow: oklch(0 0 0 / 0.3) 0px 0.5px 0px 0px, oklch(1 0 0 / 0.05) 0px 0.5px 0px 0px inset;

    font-family: var(--font-mono);
    color: oklch(0.92 0 0);
    will-change: backdrop-filter, transform;
  }

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    padding: 0 var(--space-6);
  }

  .header-logo {
    text-decoration: none;
    color: inherit;
    transition: opacity var(--transition-fast);
  }

  .header-logo:hover {
    opacity: 0.8;
  }

  .header-logo:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
    border-radius: var(--radius-sm);
  }

  .logo-text {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    font-family: var(--font-mono);
    letter-spacing: 0.05em;
    color: var(--color-primary);
  }

  /* Light theme adjustments */
  :root:not([data-theme="dark"]) .app-header,
  [data-theme="light"] .app-header {
    background-color: oklch(0.98 0.005 260 / 0.45);
    color: oklch(0.25 0.01 260);
    border-bottom-color: oklch(0 0 0 / 0.08);
    box-shadow: oklch(0 0 0 / 0.1) 0px 0.5px 0px 0px, oklch(1 0 0 / 0.5) 0px 0.5px 0px 0px inset;
  }

  @media (--md) {
    .header-content {
      padding: 0 var(--space-4);
    }
  }
</style>
