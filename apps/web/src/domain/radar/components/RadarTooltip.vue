<template>
  <div v-if="visible" class="radar-tooltip" :style="positionStyle">
    {{ text }}
  </div>
</template>

<script setup lang="ts">
  import { computed, type CSSProperties } from "vue";

  type Props = {
    visible: boolean;
    text: string;
    x: number;
    y: number;
  };

  const props = defineProps<Props>();

  const positionStyle = computed<CSSProperties>(() => ({
    left: `${props.x + 15}px`,
    top: `${props.y - 10}px`,
  }));
</script>

<style scoped>
  .radar-tooltip {
    position: fixed;
    background: var(--color-tooltip-bg);
    color: var(--color-tooltip-text);
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    font-size: var(--text-xs);
    font-family: var(--font-mono);
    pointer-events: none;
    z-index: 100;
    max-width: 200px;
    box-shadow: var(--shadow-lg);
    transition:
      background-color var(--transition-theme),
      color var(--transition-theme);
  }
</style>
