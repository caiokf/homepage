<template>
  <div class="app-card">
    <div class="card-header">
      <div class="card-controls">
        <span class="control"></span>
        <span class="control"></span>
        <span class="control"></span>
      </div>
      <span class="card-title">caiokf://{{ title }}</span>
    </div>
    <div class="card-body">
      <slot></slot>
      <span v-if="showCursor" class="cursor"></span>
    </div>
  </div>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      title?: string;
      showCursor?: boolean;
    }>(),
    {
      title: "terminal",
      showCursor: true,
    }
  );
</script>

<style scoped>
  .app-card {
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

  .app-card:has(.card-header:hover) {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
  }

  .card-title {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-text-muted);
    text-transform: lowercase;
  }

  .card-controls {
    display: flex;
    gap: var(--space-2);
  }

  .control {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--color-border);
    transition: background-color var(--transition-theme);
  }

  .control:nth-child(1) {
    background: var(--color-red);
  }

  .control:nth-child(2) {
    background: var(--color-orange);
  }

  .control:nth-child(3) {
    background: var(--color-green);
  }

  .card-body {
    padding: var(--space-6);
    font-family: var(--font-mono);
    color: var(--color-text-primary);
    transition:
      color var(--transition-theme),
      transform 0.2s ease;
  }

  .cursor {
    display: inline-block;
    width: 10px;
    height: 1.2em;
    background: var(--color-primary);
    margin-left: var(--space-1);
    vertical-align: text-bottom;
    animation: blink 1s step-end infinite;
  }

  @keyframes blink {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
  }
</style>
