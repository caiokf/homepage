<template>
  <div class="code-editor">
    <header class="editor-header">
      <BaseWindowControls />
      <div class="editor-tabs">
        <span class="tab active">{{ filename }}</span>
      </div>
    </header>

    <div class="editor-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
  import BaseWindowControls from "../atoms/BaseWindowControls.vue";

  withDefaults(
    defineProps<{
      filename?: string;
    }>(),
    {
      filename: "untitled.ts",
    }
  );
</script>

<style scoped>
  .code-editor {
    background: var(--color-background-elevated);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: var(--shadow-lg);
    transition:
      background-color var(--transition-theme),
      border-color var(--transition-theme);
  }

  .editor-header {
    display: flex;
    align-items: center;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    transition:
      background-color var(--transition-theme),
      border-color var(--transition-theme);
  }

  .editor-header :deep(.base-window-controls) {
    padding: var(--space-3) var(--space-4);
  }

  .editor-tabs {
    display: flex;
    flex: 1;
  }

  .tab {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    padding: var(--space-3) var(--space-4);
    color: var(--color-text-secondary);
    border-bottom: 2px solid transparent;
    margin-bottom: -1px;
    transition: color var(--transition-theme);
  }

  .tab.active {
    color: var(--color-text-primary);
    background: var(--color-background-elevated);
    border-bottom-color: var(--color-primary);
  }

  .editor-content {
    padding: var(--space-4) 0;
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    line-height: 1.7;
    overflow-x: auto;
  }

  /* Line styles for content */
  :deep(.line) {
    display: flex;
    align-items: flex-start;
    padding: 0 var(--space-4);
    min-height: 1.7em;
  }

  :deep(.line:hover) {
    background: var(--color-surface-hover);
  }

  :deep(.line code) {
    white-space: pre-wrap;
    word-break: break-word;
  }

  :deep(.line code.indent-1) {
    padding-left: 1.5ch;
  }

  :deep(.line code.indent-2) {
    padding-left: 3ch;
  }

  :deep(.line-number) {
    color: var(--color-text-muted);
    opacity: 0.5;
    transition:
      opacity var(--transition-fast),
      color var(--transition-fast);
    min-width: 32px;
    text-align: right;
    padding-right: var(--space-4);
    user-select: none;
    flex-shrink: 0;
  }
</style>
