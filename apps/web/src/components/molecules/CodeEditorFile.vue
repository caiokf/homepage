<<<<<<< ours
<template>
  <div v-show="isActive" class="editor-file-content">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { inject, computed } from "vue";

  const props = defineProps<{
    name: string;
  }>();

  const activeFile = inject<{ value: string }>("activeFile");
  const isActive = computed(() => activeFile?.value === props.name);
</script>

<style scoped>
  .editor-file-content {
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
    transition: opacity var(--transition-fast), color var(--transition-fast);
    min-width: 32px;
    text-align: right;
    padding-right: var(--space-4);
    user-select: none;
    flex-shrink: 0;
  }
</style>
|||||||
=======
<template>
  <div v-show="isActive" class="editor-file-content">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { inject, computed } from "vue";

  const props = defineProps<{
    name: string;
  }>();

  const activeFile = inject<{ value: string }>("activeFile");
  const isActive = computed(() => activeFile?.value === props.name);
</script>

<style scoped>
  .editor-file-content {
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
    transition: opacity var(--transition-fast), color var(--transition-fast);
    min-width: 32px;
    text-align: right;
    padding-right: var(--space-4);
    user-select: none;
    flex-shrink: 0;
  }
</style>
>>>>>>> theirs
