<template>
  <component
    :is="componentType"
    :to="to"
    :href="isExternalLink ? href : undefined"
    :type="isButton ? 'button' : undefined"
    :target="isExternalLink ? '_blank' : undefined"
    :rel="isExternalLink ? 'noopener noreferrer' : undefined"
    class="base-bracket-link"
    v-bind="$attrs"
    @keydown.enter="handleEnter"
  >
    <span class="bracket-link-content"><slot /></span>
  </component>
</template>

<script setup lang="ts">
  import { computed, watchEffect } from "vue";
  import { RouterLink, type RouteLocationRaw } from "vue-router";

  defineOptions({ inheritAttrs: false });

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

  function handleEnter(event: KeyboardEvent) {
    const target = event.currentTarget as HTMLElement;
    target.click();
  }
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
    transition: color 200ms ease;
  }

  /* Brackets with expand animation */
  .base-bracket-link::before,
  .base-bracket-link::after {
    display: inline-block;
    transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .base-bracket-link::before {
    content: "[";
  }

  .base-bracket-link::after {
    content: "]";
  }

  /* Bracket expansion on hover - uses transform so no layout shift */
  .base-bracket-link:hover::before,
  .base-bracket-link:focus-visible::before {
    transform: translateX(-3px);
  }

  .base-bracket-link:hover::after,
  .base-bracket-link:focus-visible::after {
    transform: translateX(3px);
  }

  /* Text color shift on hover */
  .base-bracket-link:hover,
  .base-bracket-link:focus-visible {
    color: var(--color-text-primary);
  }

  .bracket-link-content {
    position: relative;
    display: inline-block;
  }

  /* Animated underline */
  .bracket-link-content::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: -2px;
    height: 1px;
    background: currentColor;
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .base-bracket-link:hover .bracket-link-content::after,
  .base-bracket-link:focus-visible .bracket-link-content::after {
    transform: scaleX(1);
  }

  .base-bracket-link:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 4px;
    border-radius: var(--radius-sm);
  }
</style>
