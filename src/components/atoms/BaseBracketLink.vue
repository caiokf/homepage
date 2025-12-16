<template>
  <component
    :is="componentType"
    :to="to"
    :href="isExternalLink ? href : undefined"
    :type="isButton ? 'button' : undefined"
    :target="isExternalLink ? '_blank' : undefined"
    :rel="isExternalLink ? 'noopener noreferrer' : undefined"
    class="base-bracket-link"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
  import { computed, watchEffect } from "vue";
  import { RouterLink, type RouteLocationRaw } from "vue-router";

  type Props = {
    to?: string | RouteLocationRaw;
    href?: string;
  };

  const props = defineProps<Props>();

  // Warn when both to and href are provided
  watchEffect(() => {
    if (props.to && props.href) {
      console.warn(
        "[BaseBracketLink] Both 'to' and 'href' props provided. 'to' takes precedence; 'href' will be ignored."
      );
    }
  });

  const isButton = computed(() => !props.to && !props.href);
  const isExternalLink = computed(() => !!props.href && !props.to);

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

  .base-bracket-link:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
    border-radius: var(--radius-sm);
  }
</style>
