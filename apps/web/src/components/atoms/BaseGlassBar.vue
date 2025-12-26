<template>
  <component
    :is="as"
    class="base-glass-bar"
    :class="`base-glass-bar--${position}`"
  >
    <slot></slot>
  </component>
</template>

<script setup lang="ts">
  type Props = {
    position?: "top" | "bottom";
    as?: string;
  };

  withDefaults(defineProps<Props>(), {
    position: "top",
    as: "div",
  });
</script>

<style scoped>
  .base-glass-bar {
    position: fixed;
    left: 0;
    right: 0;
    z-index: 100;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;

    backdrop-filter: blur(24px) saturate(1.5);
    -webkit-backdrop-filter: blur(24px) saturate(1.5);
    background-color: oklch(0.12 0 0 / 0.5);
    font-family: var(--font-mono);
    color: oklch(0.92 0 0);
    will-change: backdrop-filter, transform;
  }

  .base-glass-bar--top {
    top: 0;
    border-bottom: 1px solid oklch(1 0 0 / 0.08);
    box-shadow: oklch(0 0 0 / 0.3) 0px 0.5px 0px 0px,
      oklch(1 0 0 / 0.05) 0px 0.5px 0px 0px inset;
  }

  .base-glass-bar--bottom {
    bottom: 0;
    border-top: 1px solid oklch(1 0 0 / 0.08);
    box-shadow: oklch(0 0 0 / 0.3) 0px -0.5px 0px 0px,
      oklch(1 0 0 / 0.05) 0px -0.5px 0px 0px inset;
  }

  :root:not([data-theme="dark"]) .base-glass-bar,
  [data-theme="light"] .base-glass-bar {
    background-color: oklch(0.98 0.005 260 / 0.45);
    color: oklch(0.25 0.01 260);
  }

  :root:not([data-theme="dark"]) .base-glass-bar--top,
  [data-theme="light"] .base-glass-bar--top {
    border-bottom-color: oklch(0 0 0 / 0.08);
    box-shadow: oklch(0 0 0 / 0.1) 0px 0.5px 0px 0px,
      oklch(1 0 0 / 0.5) 0px 0.5px 0px 0px inset;
  }

  :root:not([data-theme="dark"]) .base-glass-bar--bottom,
  [data-theme="light"] .base-glass-bar--bottom {
    border-top-color: oklch(0 0 0 / 0.08);
    box-shadow: oklch(0 0 0 / 0.1) 0px -0.5px 0px 0px,
      oklch(1 0 0 / 0.5) 0px -0.5px 0px 0px inset;
  }
</style>
