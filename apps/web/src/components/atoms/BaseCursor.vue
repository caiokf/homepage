<template>
  <span
    class="base-cursor"
    :class="{ animate }"
    :style="{ animationDelay: `${delay}ms` }"
  ></span>
</template>

<script setup lang="ts">
  withDefaults(
    defineProps<{
      delay?: number;
      animate?: boolean;
    }>(),
    {
      delay: 0,
      animate: false,
    }
  );
</script>

<style scoped>
  .base-cursor {
    display: inline-block;
    width: 0.2em;
    height: 1.2em;
    background: var(--color-primary);
    vertical-align: text-bottom;
    animation: blink 1s step-end infinite;
  }

  .base-cursor.animate {
    animation: appear 200ms ease-out forwards, blink 1s step-end infinite;
  }

  @keyframes appear {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
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
