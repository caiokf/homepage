<template>
  <div id="app">
    <AppHeader />
    <main class="main-content">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
  import AppHeader from "./components/layout/AppHeader.vue";
  import AppFooter from "./components/layout/AppFooter.vue";
  import { useTheme } from "./composables/useTheme";

  // Initialize theme system
  useTheme();
</script>

<style scoped>
  #app {
    min-height: 100vh;
    background: var(--color-background);
    color: var(--color-text-primary);
    transition:
      background-color var(--transition-theme),
      color var(--transition-theme);
  }

  .main-content {
    max-width: var(--content-max-width);
    margin: 0 auto;
    padding-top: 56px;
    padding-bottom: 56px;
  }
</style>
