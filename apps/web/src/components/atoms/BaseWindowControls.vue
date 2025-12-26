<template>
  <div class="base-window-controls" :style="controlStyle" aria-hidden="true">
    <span class="control control--close"></span>
    <span class="control control--minimize"></span>
    <span class="control control--maximize"></span>
  </div>
</template>

<script setup lang="ts">
  import { computed } from "vue";

  type Props = {
    size?: number;
    gap?: number;
  };

  const props = withDefaults(defineProps<Props>(), {
    size: 12,
    gap: 8,
  });

  const controlStyle = computed(() => ({
    "--control-size": `${props.size}px`,
    "--control-gap": `${props.gap}px`,
  }));
</script>

<style scoped>
  .base-window-controls {
    display: inline-flex;
    gap: var(--control-gap);
  }

  .control {
    width: var(--control-size);
    height: var(--control-size);
    border-radius: 50%;
    background-color: var(--color-border);
    transition: background-color var(--transition-theme);
  }

  /* macOS-style traffic light colors */
  .control--close {
    background-color: #ff5f57;
    transition: background-color var(--transition-theme);
  }

  .control--minimize {
    background-color: #febc2e;
    transition: background-color var(--transition-theme);
  }

  .control--maximize {
    background-color: #28c840;
    transition: background-color var(--transition-theme);
  }
</style>
