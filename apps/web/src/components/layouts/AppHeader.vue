<template>
  <BaseGlassBar as="header" position="top">
    <div class="header-content">
      <router-link to="/about" class="header-logo">
        <span class="logo-text">caiokf</span>
      </router-link>
      <BaseThemeToggle />
    </div>
  </BaseGlassBar>
</template>

<script setup lang="ts">
  import BaseThemeToggle from "../atoms/BaseThemeToggle.vue";
  import BaseGlassBar from "../atoms/BaseGlassBar.vue";
</script>

<style scoped>
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

  @media (--md) {
    .header-content {
      padding: 0 var(--space-4);
    }
  }
</style>
