<template>
  <span :class="['base-badge', `base-badge--${variant}`, `base-badge--${size}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
  interface Props {
    variant?: "primary" | "muted" | "success" | "warning";
    size?: "sm" | "md";
  }

  withDefaults(defineProps<Props>(), {
    variant: "primary",
    size: "sm",
  });
</script>

<style>
  .base-badge {
    display: inline-flex;
    align-items: center;
    font-family: var(--font-mono);
    border-radius: var(--radius-sm);
    text-transform: lowercase;
    transition:
      background-color var(--transition-theme),
      color var(--transition-theme);
  }

  /* Sizes */
  .base-badge--sm {
    font-size: var(--text-xs);
    padding: 2px 8px;
  }

  .base-badge--md {
    font-size: var(--text-xs);
    padding: 4px 10px;
  }

  /* Variants */
  .base-badge--primary {
    color: var(--color-primary);
    background: var(--color-primary-light);
  }

  .base-badge--muted {
    color: var(--color-text-secondary);
    background: var(--color-background-subtle);
  }

  .base-badge--success {
    color: var(--color-success);
    background: var(--color-success-bg);
    text-transform: uppercase;
    font-size: 10px;
    font-weight: var(--font-semibold);
    padding: 2px 6px;
  }

  .base-badge--warning {
    color: var(--color-warning);
    background: var(--color-warning-bg);
    text-transform: uppercase;
    font-size: 10px;
    font-weight: var(--font-semibold);
    padding: 2px 6px;
  }
</style>
