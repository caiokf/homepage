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
    animation: var(--control-pulse) 350ms ease-out backwards;
  }

  .control--close {
    background-color: #ff5f57;
    animation-delay: 0ms;
  }

  .control--minimize {
    background-color: #febc2e;
    animation-delay: 70ms;
  }

  .control--maximize {
    background-color: #28c840;
    animation-delay: 140ms;
  }
</style>
