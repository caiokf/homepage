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

  .control--close {
    background-color: var(--color-red);
    transition: background-color var(--transition-theme);
  }

  .control--minimize {
    background-color: var(--color-orange);
    transition: background-color var(--transition-theme);
  }

  .control--maximize {
    background-color: var(--color-green);
    transition: background-color var(--transition-theme);
  }
</style>
