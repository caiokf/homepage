<template>
  <component
    :is="componentType"
    :to="to"
    :href="href"
    :type="isButton ? 'button' : undefined"
    :target="isExternalLink ? '_blank' : undefined"
    :rel="isExternalLink ? 'noopener noreferrer' : undefined"
    class="base-bracket-link"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
  import { computed } from "vue";
  import { RouterLink } from "vue-router";

  interface Props {
    to?: string;
    href?: string;
  }

  const props = defineProps<Props>();

  const isButton = computed(() => !props.to && !props.href);
  const isExternalLink = computed(() => !!props.href);

  const componentType = computed(() => {
    if (props.to) return RouterLink;
    if (props.href) return "a";
    return "button";
  });
</script>

<style>
  .base-bracket-link {
    font-family: var(--font-mono);
    font-size: var(--text-sm);
    color: var(--color-primary);
    text-decoration: none;
    text-transform: lowercase;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    transition: opacity var(--transition-fast);
  }

  .base-bracket-link::before {
    content: "[";
  }

  .base-bracket-link::after {
    content: "]";
  }

  .base-bracket-link:hover {
    opacity: 0.8;
  }
</style>
