<template>
  <div id="app">
    <a href="#main-content" class="skip-link">Skip to content</a>
    <AppHeader />
    <main id="main-content" class="main-content" aria-label="Main content">
      <router-view v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </router-view>
    </main>
    <ScrollFadeHint />
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
  import AppHeader from "./components/layouts/AppHeader.vue";
  import AppFooter from "./components/layouts/AppFooter.vue";
  import ScrollFadeHint from "./components/atoms/ScrollFadeHint.vue";
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

  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-primary);
    color: var(--color-background);
    padding: var(--space-2) var(--space-4);
    z-index: 100;
    transition: top 0.2s ease;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    text-decoration: none;
  }

  .skip-link:focus {
    top: 0;
  }

  .main-content {
    padding-top: 56px;
    padding-bottom: 56px;
  }
</style>
