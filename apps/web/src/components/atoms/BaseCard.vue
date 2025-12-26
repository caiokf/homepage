<template>
  <component :is="tag" class="base-card">
    <header v-if="$slots.header" class="card-header">
      <slot name="header"></slot>
    </header>
    <div class="card-body">
      <slot></slot>
    </div>
  </component>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      tag?: "div" | "article" | "section";
    }>(),
    {
      tag: "div",
    }
  );
</script>

<style scoped>
  .base-card {
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-md);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    max-width: 100%;
    transition:
      background-color var(--transition-theme),
      border-color var(--transition-theme),
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--space-3) var(--space-4);
    background: var(--color-background-subtle);
    border-bottom: 1px solid var(--color-border);
    transition:
      background-color var(--transition-theme),
      border-color var(--transition-theme),
      transform 0.2s ease,
      box-shadow 0.2s ease;
  }

  .card-header:hover {
    background: var(--color-surface-hover);
  }

  .card-header:hover ~ .card-body {
    transform: translateY(1px);
  }

  .base-card:has(.card-header:hover) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  .card-body {
    padding: var(--space-6);
    font-family: var(--font-mono);
    color: var(--color-text-primary);
    transition:
      color var(--transition-theme),
      transform 0.2s ease;
  }
</style>
